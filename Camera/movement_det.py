from gpiozero import MotionSensor
from signal import pause
import camera
import time

pir = MotionSensor(25)
is_capturing = False

def movement_detected():
    global is_capturing

    if is_capturing:
        return
    
    is_capturing = True

    for i in range(1, 6):
        current_filename = f"temp_{i}.jpg"
        camera.execute(current_filename)
        time.sleep(2)

    is_capturing = False

def no_movement():
    print('No movement...')

pir.when_activated = movement_detected
pir.when_deactivated = no_movement

print('Sensor is ready')
pause()
