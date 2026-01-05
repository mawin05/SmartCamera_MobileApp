import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List

app = FastAPI()
IP = "192.168.1.22"

if not os.path.exists("images"):
    os.makedirs("images")

app.mount("/images", StaticFiles(directory="images"), name="images")

# KONFIGURACJA CORS
# Pozwala Twojej aplikacji React Native łączyć się z tym serwerem
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Definicja modelu danych (taka sama jak Twoje AlertItem w TypeScript)
class Alert(BaseModel):
    id: str
    title: str
    time: str
    image: str
    isNew: bool

# Tymczasowa "baza danych" w pamięci RAM
alerts_db = [
    {
        "id": "1",
        "title": "Kacper",
        "time": "12:45",
        "image": f"http://{IP}:8000/images/kacper.jpg",
        "isNew": True
    },
    {
        "id": "2",
        "title": "Maciej",
        "time": "13:10",
        "image": f"http://{IP}:8000/images/maciej.jpg",
        "isNew": True
    },
    {
        "id": "3",
        "title": "Maciejunio",
        "time": "6:10",
        "image": f"http://{IP}:8000/images/maciej.jpg",
        "isNew": True
    },
    {
        "id": "4",
        "title": "Zupstein",
        "time": "ku:tas",
        "image": f"http://{IP}:8000/images/zupa.jpg",
        "isNew": True
    },
    {
        "id": "5",
        "title": "Robercik",
        "time": "09:09",
        "image": f"http://{IP}:8000/images/lewy.jpg",
        "isNew": True
    },
    {
        "id": "6",
        "title": "Repcak",
        "time": "11:11",
        "image": f"http://{IP}:8000/images/kacper.jpg",
        "isNew": True
    },
]

@app.get("/alerts", response_model=List[Alert])
async def get_alerts():
    """Zwraca listę wszystkich alertów."""
    return alerts_db

@app.post("/alerts/{alert_id}/read")
async def mark_as_read(alert_id: str):
    """Znajduje alert po ID i zmienia isNew na False."""
    for alert in alerts_db:
        if alert["id"] == alert_id:
            alert["isNew"] = False
            return {"status": "success", "message": f"Alert {alert_id} przeczytany"}
    return {"status": "error", "message": "Nie znaleziono alertu"}