import os
import io
import shutil
import time
from dotenv import load_dotenv
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from typing import List
from database import *
from sqlalchemy.orm import selectinload
import httpx
import asyncio
from datetime import timedelta, datetime
from contextlib import asynccontextmanager
from PIL import Image, ImageDraw
import json

load_dotenv()
MODEL_URL = os.environ.get("MODEL_URL")

if not MODEL_URL:
    raise RuntimeError("MODEL_URL not found, check README for instructions")

async def cleanup_alerts(interval_seconds: int, max_age_hours: int):
    while True:
        threshold = datetime.now() - timedelta(hours=max_age_hours)
        with Session(engine) as session:
            old_alerts = session.exec(select(Alert).where(Alert.created_at < threshold)).all()
            for old_alert in old_alerts:
                image_path = f"data/images/captured/{old_alert.image}"
                if os.path.isfile(image_path):
                    try:
                        os.remove(image_path)
                    except Exception as e:
                        print(f"Could not delete file {image_path}: {e}")
            session.exec(delete(Alert).where(Alert.created_at < threshold))
            session.commit()
            print(f"Deleted {len(old_alerts)} alerts")
        await asyncio.sleep(interval_seconds)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: creating sql engine and all of the directories
    SQLModel.metadata.create_all(engine)
    os.makedirs("data/images/users", exist_ok=True)
    os.makedirs("data/images/captured", exist_ok=True)
    task = asyncio.create_task(cleanup_alerts(interval_seconds=60, max_age_hours=1))

    # Creating AsyncClient for connection pooling
    app.state.client = httpx.AsyncClient()

    # Starting the application
    yield

    # Shutdown of the application
    task.cancel()
    await app.state.client.aclose()

app = FastAPI(lifespan=lifespan)

app.mount("/data/images", StaticFiles(directory="data/images"), name="images")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_client(request: Request) -> httpx.AsyncClient:
    return request.app.state.client

# Uploading a captured image
def save_image_to_disk(filename: str, img_data):
    filepath = f"data/images/captured/{filename}"
    with open(filepath, "wb") as f:
        if isinstance(img_data, bytes):
            f.write(img_data)
        else:
            shutil.copyfileobj(img_data, f)

# Creating an alert
def add_alert(data: dict, session: Session):
    title = data["title"]
    if data["recognised_user_id"]:
        user = session.get(User, data["recognised_user_id"])
        if user:
            title = f"Detected: {user.name}"

    new_alert = Alert(
        title=title,
        time=data["time"],
        date=data["date"],
        image=data["image"],
        isNew=data["isNew"],
        recognised_user_id=data["recognised_user_id"],
        embedding=data["embedding"]
    )

    session.add(new_alert)
    session.commit()

    return new_alert

async def get_encoding_from_model(client: httpx.AsyncClient, file: UploadFile):
    try:
        files = {"file": (file.filename, await file.read(), file.content_type)}
        response = await client.post(f"{MODEL_URL}/encode", files=files)
        await file.seek(0)
        return response.json().get("encodings")
    except Exception as e:
        print(f"Error while connecting to the model: {e}")
        return None

async def rematch_alerts(client: httpx.AsyncClient, new_user: User, face_encoding: List[float], unrecognized_alerts: List[Alert], session: Session):
    data = {
        "user_id": new_user.id,
        "embedding": face_encoding,
        "unrecognized_alerts": [{"id": a.id, "embedding": a.embedding} for a in unrecognized_alerts]
    }
    try:
        response = await client.post(f"{MODEL_URL}/rematch", json=data, timeout=10)
        matched_ids = response.json().get("matched_ids", [])
        for alert_id in matched_ids:
            alert_to_update = session.get(Alert, alert_id)
            if alert_to_update:
                alert_to_update.recognised_user_id = new_user.id
                alert_to_update.title = f"Detected: {new_user.name}"
                alert_to_update.isNew = True
                session.add(alert_to_update)
        session.commit()
    except Exception as e:
        print(f"Rematch failed: {e}")

async def add_user_image_logic(user_id: int, file: UploadFile, face_encoding: list[float], session: Session):
    new_template = FaceTemplate(filepath="pending", user_id=user_id, embedding=face_encoding)
    session.add(new_template)
    session.commit()
    session.refresh(new_template)

    filename = f"template_{new_template.id}_{int(time.time())}.jpg"
    user_dir = f"data/images/users/{user_id}"
    filepath = f"{user_dir}/{filename}"

    os.makedirs(user_dir, exist_ok=True)
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    new_template.filepath = filename
    session.add(new_template)
    session.commit()

    return new_template

# Making it available for the model to get the embeddings of known users
def get_templates(session: Session):
    statement = select(FaceTemplate)
    results = session.exec(statement).all()
    return [{"user_id": f.user_id, "embedding": f.embedding} for f in results]

# Displaying users in the mobile app

@app.get("/users", response_model=List[UserRead])
async def get_users(session: Session = Depends(get_session)):
    """Zwraca listę wszystkich użytkowników."""
    statement = select(User).options(selectinload(User.images), selectinload(User.alerts))
    results = session.exec(statement).all()
    return results

# Creating a new user
@app.post("/users")
async def create_user(
    name: str = Form(...),
    file: UploadFile = File(...),
    session: Session = Depends(get_session),
    client: httpx.AsyncClient = Depends(get_client)
):
    face_encodings = await get_encoding_from_model(client, file)

    if face_encodings is None:
        raise HTTPException(
            status_code=503,
            detail="Model server is not responding or returned an error."
        )

    if len(face_encodings) == 0:
        raise HTTPException(status_code=404, detail="NO_FACE")

    if len(face_encodings) > 1:
        raise HTTPException(status_code=404, detail="MULTIPLE_FACES")

    new_user = User(name=name)
    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    await add_user_image_logic(new_user.id, file, face_encodings[0], session)
    statement = select(Alert).where(Alert.recognised_user_id == None, Alert.embedding != None)
    unrecognized_alerts = session.exec(statement).all()

    if unrecognized_alerts:
        await rematch_alerts(client, new_user, face_encodings[0], unrecognized_alerts, session)

    statement = select(User).where(User.id == new_user.id).options(
        selectinload(User.images), selectinload(User.alerts)
    )
    full_user = session.exec(statement).first()

    return full_user

# Deleting a user
@app.delete("/users/{user_id}")
async def delete_user(user_id: int, session: Session = Depends(get_session)):
    statement = select(User).where(User.id == user_id).options(selectinload(User.images))
    user_to_remove = session.exec(statement).first()

    if not user_to_remove:
        raise HTTPException(status_code=404, detail="User not found")

    for img in user_to_remove.images:
        session.delete(img)

    folder_path = f"data/images/users/{user_id}"
    if os.path.exists(folder_path):
        try:
            shutil.rmtree(folder_path)
        except Exception as e:
            print(f"Błąd przy usuwaniu plików: {e}")

    session.delete(user_to_remove)
    session.commit()

    return {"message": f"User {user_id} and all their data removed",
            "deleted_id": user_id}

# Adding a new image for a user
@app.post("/users/{user_id}/images", response_model=UserRead)
async def add_user_image(
    user_id: int,
    file: UploadFile = File(...),
    session: Session = Depends(get_session),
    client: httpx.AsyncClient = Depends(get_client)
):
    face_encodings = await get_encoding_from_model(client, file)

    if len(face_encodings) == 0:
        raise HTTPException(status_code=404, detail="No face detected")

    if len(face_encodings) > 1:
        raise HTTPException(status_code=404, detail="More than 1 face detected")

    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    await file.seek(0)
    await add_user_image_logic(user_id, file, face_encodings[0], session)

    statement = select(User).where(User.id == user_id).options(
            selectinload(User.images),
            selectinload(User.alerts)
    )
    updated_user = session.exec(statement).first()

    return updated_user

# Get information about a certain user
@app.get("/users/{user_id}", response_model=UserRead)
async def get_user(user_id: int, session: Session = Depends(get_session)):
    statement = select(User).where(User.id == user_id).options(selectinload(User.images))
    user = session.exec(statement).first()

    if not user:
        raise HTTPException(status_code=404, detail="Użytkownik nie istnieje")

    return user

# Returns the list of all alerts
@app.get("/alerts", response_model=List[AlertRead])
async def get_alerts(session: Session = Depends(get_session)):
    return session.exec(select(Alert)).all()

# Checking alert's status from New to Read
@app.post("/alerts/{alert_id}/read")
async def mark_as_read(alert_id: int, session: Session = Depends(get_session)):
    """Znajduje alert po ID i zmienia isNew na False."""
    alert = session.get(Alert, alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail="Nie znaleziono alertu")
    alert.isNew = False
    session.add(alert)
    session.commit()
    return {"status": "success", "message": f"Alert {alert_id} przeczytany"}

# Deleting an alert
@app.delete("/alerts/{alert_id}")
async def delete_alert(alert_id: int, session: Session = Depends(get_session)):

    alert_to_remove = session.get(Alert, alert_id)

    if not alert_to_remove:
        raise HTTPException(status_code=404, detail="Alert not found")

    session.delete(alert_to_remove)
    session.commit()

    return {"message": f"Alert {alert_id} was removed",
            "deleted_id": alert_id}

@app.post("/recognize")
async def recognize_face(file: UploadFile, client: httpx.AsyncClient = Depends(get_client), session: Session = Depends(get_session)):
    contents = await file.read()
    known_faces = get_templates(session)

    response = await client.post(
        f"{MODEL_URL}/identify",
        data={"known_faces_json": json.dumps(known_faces)},
        files={"file": (file.filename, contents, file.content_type)}
    )

    results = response.json().get("results", [])

    now = datetime.now()
    time_str = now.strftime("%H:%M:%S")
    date_str = now.strftime("%d.%m.%Y")
    time_stamp = now.strftime("%d.%m.%Y_%H-%M-%S")

    if not results:
        await file.seek(0)
        image_name = f"empty_{time_stamp}.jpg"
        save_image_to_disk(image_name, contents)
        add_alert({
            "title": "No face detected",
            "time": time_str,
            "date": date_str,
            "image": image_name,
            "isNew": True,
            "recognised_user_id": None,
            "embedding": None
        }, session)
        return {"status": "processed", "result": "no_faces"}

    for i, res in enumerate(results):
        user_id = res["user_id"]
        top, right, bottom, left = res["location"]

        if user_id is not None:
            title = f"Detected User ID: {user_id}"
            status = f"user_{user_id}"
            print(f"Recognized user: {user_id}")
        else:
            title = "Unknown"
            status = "unknown"
            print("Unknown face detected.")

        image_name = f"{status}_{time_stamp}_{i}.jpg"

        im = Image.open(io.BytesIO(contents))
        d = ImageDraw.Draw(im)
        d.rectangle([left, top, right, bottom], outline="red", width=3)

        img_bytes = io.BytesIO()
        im.save(img_bytes, format='JPEG')
        img_bytes.seek(0)

        save_image_to_disk(image_name, img_bytes)
        add_alert({
            "title": title,
            "time": time_str,
            "date": date_str,
            "image": image_name,
            "isNew": True,
            "recognised_user_id": user_id,
            "embedding": res["encoding"]
        }, session)

    return {"status": "success"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
# needed to change the way of starting the server due to face recognition not wanting to cooperate
# to start the server type 'python main.py'
