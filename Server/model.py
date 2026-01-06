import face_recognition
import os
import numpy as np
import cv2

# --- KONFIGURACJA ---
DIRECTORY = "images"  # Folder ze zdjęciami znanych osób
TOLERANCE = 0.50      # Im niższa wartość, tym surowsze rozpoznawanie

def get_known_encodings(directory):
    known_encodes = []
    known_names = []
    
    for name in os.listdir(directory):
        img_path = os.path.join(directory, name)
        image = face_recognition.load_image_file(img_path)
        encodings = face_recognition.face_encodings(image)
        
        if len(encodings) > 0:
            known_encodes.append(encodings[0])
            known_names.append(os.path.splitext(name)[0])
    return known_encodes, known_names

def identify_face(input_image_path, known_encodes, known_names):
    # 1. Wczytaj zdjęcie testowe
    unknown_image = face_recognition.load_image_file(input_image_path)
    
    # 2. Znajdź kodowanie twarzy na nowym zdjęciu
    unknown_encodings = face_recognition.face_encodings(unknown_image)
    
    if len(unknown_encodings) == 0:
        return "no_face_detected"

    # 3. Porównaj z bazą (analizujemy pierwszą znalezioną twarz)
    face_to_check = unknown_encodings[0]
    distances = face_recognition.face_distance(known_encodes, face_to_check)
    
    if len(distances) > 0:
        best_match_index = np.argmin(distances)
        if distances[best_match_index] < TOLERANCE:
            return known_names[best_match_index]
    
    return "unknown"

# --- WYKONANIE ---
# To robisz raz przy starcie serwera (ładowanie bazy)
known_encodes, known_names = get_known_encodings(DIRECTORY)

# To wywołujesz, gdy dostaniesz zdjęcie
result = identify_face("test_photo.jpg", known_encodes, known_names)

print(result) # Wypisze np. "Maciej", "unknown" lub "no_face_detected"