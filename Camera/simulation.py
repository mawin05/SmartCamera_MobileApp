import os
import time
import requests
import secrets
from dotenv import load_dotenv

load_dotenv()
SERVER_URL = os.environ.get("SERVER_URL")
IMAGE_DIR = "test_images"

def run_simulation():

    images = [f for f in os.listdir(IMAGE_DIR) if f.endswith(('.jpg', '.jpeg', '.png'))]

    session_id = secrets.token_hex(16)
    payload = {"session_id": session_id}

    for img_name in images:
        img_path = os.path.join(IMAGE_DIR, img_name)

        print(f"\n📸 Taken a photo: {img_name}")

        try:
            with open(img_path, "rb") as f:
                # Creating and sending the UploadFile object as json
                files = {"file": (img_name, f, "image/jpeg")}
                
                response = requests.post(f"{SERVER_URL}/recognize", files=files, data=payload)

                if response.status_code == 200:
                    print(f"✅ Success with {img_name}")
                else:
                    print(f"⚠️ Error: {response.status_code} - {response.text}")

        except Exception as e:
            print(f"Error: {e}")

        time.sleep(1)

    print("ALL PHOTOS HAVE BEEN TAKEN")

if __name__ == "__main__":
    run_simulation()
