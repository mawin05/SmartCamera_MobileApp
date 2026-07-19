import io
import json

import face_recognition
import numpy as np
import uvicorn
from fastapi import FastAPI, File, Form, UploadFile

TOLERANCE = 0.50

app = FastAPI()


# Core function for recognizing faces
# Takes all known encodes and an image
# Returns results for all detected faces
@app.post("/identify")
async def identify(file: UploadFile = File(...), known_faces_json: str = Form(...)):
    known_faces = json.loads(known_faces_json)
    known_encodes = [np.array(f["embedding"]) for f in known_faces]

    contents = await file.read()
    image = face_recognition.load_image_file(io.BytesIO(contents))
    locations = face_recognition.face_locations(image)
    unknown_encodings = face_recognition.face_encodings(image, locations)

    results = []
    for i, unknown_encoding in enumerate(unknown_encodings):
        distances = face_recognition.face_distance(known_encodes, unknown_encoding)
        user_id = None

        if len(distances) > 0:
            best_match_index = np.argmin(distances)
            if distances[best_match_index] < TOLERANCE:
                user_id = known_faces[best_match_index]["user_id"]
        results.append(
            {
                "user_id": user_id,
                "location": locations[i],
                "encoding": unknown_encoding.tolist(),
            }
        )

    return {"results": results}


# Endpoint for Server to get an image's encoding
@app.post("/encode")
async def encode_image(file: UploadFile):
    contents = await file.read()
    image = face_recognition.load_image_file(io.BytesIO(contents))
    encodings = face_recognition.face_encodings(image)
    return {"encodings": [e.tolist() for e in encodings]}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
