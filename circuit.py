import time
import RPi.GPIO as GPIO
from adafruit_htu21d import HTU21D
import busio

servo=18
sda = 2
scl = 3
i2c = busio.I2C(scl, sda)
sensor = HTU21D(i2c)
trig = 20
echo = 16
led=6

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(trig, GPIO.OUT)
GPIO.setup(echo, GPIO.IN)
GPIO.output(trig, False)
GPIO.setup(led, GPIO.OUT)
GPIO.setup(servo, GPIO.OUT)


def measureDistance(): 
	time.sleep(0.5)
	GPIO.output(trig, True) # 신호 1 발생
	time.sleep(0.00001) # 짧은 시간을 나타내기 위함
	GPIO.output(trig, False) # 신호 0 발생
	while(GPIO.input(echo) == 0):
		pulse_start = time.time() # 신호 1을 받았던 시간
	while(GPIO.input(echo) == 1):
		pulse_end = time.time() # 신호 0을 받았던 시간
	pulse_duration = pulse_end - pulse_start
	return 340*100/2*pulse_duration

def LED_on():
	GPIO.output(led, 1)

def LED_off():
	GPIO.output(led, 0)

def getTemperature():
	return float(sensor.temperature)
def getHumidity():
	return float(sensor.relative_humidity)
def Servo_on():
	pwm = GPIO.PWM(servo, 50)
	pwm.start(3.0)

	pwm.ChangeDutyCycle(3.0)
	time.sleep(1.0)
	pwm.ChangeDutyCycle(7.5)
	time.sleep(1.0)
	pwm.ChangeDutyCycle(0.0)
	pwm.stop()

	
