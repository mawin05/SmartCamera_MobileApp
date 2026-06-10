import subprocess
import os
import requests
from dotenv import load_dotenv
import requests

TEMP_PHOTO = "temp_capture.jpg"
load_dotenv()
SERVER_URL = os.environ.get("SERVER_URL")

if not SERVER_URL:
    raise RuntimeError("SERVER_URL not found, check README for instructions")

def take_photo(filename):
    if os.path.exists(filename):
        os.remove(filename)

    print("📸 Przechwytywanie obrazu przez rpicam-still do {filename}...")
    try:
        # -n: brak podglądu, -o: wyjście, -t 1: czekaj 1ms (szybkie zdjęcie)
        # --immediate: nie czekaj na stabilizację (jeśli zależy Ci na czasie)
        subprocess.run([
            "rpicam-still",
            "-o", filename,
            "-n",
            "-t", "500", # 500ms na ustawienie ostrości/światła
            "--width", "1280",
            "--height", "720"
        ], check=True)

        if os.path.exists(filename):
            print("✅ Zdjęcie zapisane pomyślnie!")
            return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Błąd rpicam-still: {e}")

    return False

def send_to_model(session_id, filename):
    try:
        with open(filename, "rb") as f:
            files = {"file": (filename, f, "image/jpeg")}
            payload = {"session_id": session_id}
            print(f"📡 Wysyłanie do modelu: {SERVER_URL}/recognize...")

            response = requests.post(f"{SERVER_URL}/recognize", files=files, data=payload)

            if response.status_code == 200:
                print("🚀 Model odebrał zdjęcie i rozpoczął analizę.")
            else:
                print(f"⚠️ Serwer zwrócił błąd: {response.status_code} - {response.text}")

    except Exception as e:
        print(f"❌ Nie udało się połączyć z modelem: {e}")
    finally:
        if os.path.exists(filename):
            os.remove(filename)
    

def execute(session_id, filename=TEMP_PHOTO):
    if take_photo(filename):
        send_to_model(session_id, filename)
    return True

if __name__ == "__main__":
    if take_photo():
        send_to_model()
