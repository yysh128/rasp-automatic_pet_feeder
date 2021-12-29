import time
import paho.mqtt.client as mqtt
import circuit
import pjcamera
import math


flag=False

def on_connect(client, userdata, flag, rc):
	client.subscribe("led", qos = 0)
	client.subscribe("facerecognition", qos=0)
	client.subscribe("servomoter", qos=0)

def on_message(client, userdata, msg) :
	global flag
	command = msg.payload.decode("utf-8")
	if command == "feed" :
		circuit.Servo_on()
	if command == "action" :
		print("action msg received..")
		flag = True
	if command == "1" :
		command = int(command)
		print(command)
		circuit.LED_on()
	if command == "0" :
		command = int (command)
		print(command)
		circuit.LED_off()	

broker_ip = "localhost" # 현재 이 컴퓨터를 브로커로 설정
client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message
client.connect(broker_ip, 1883)
client.loop_start()

while True:
	distance = round(circuit.measureDistance(),2)
	client.publish("ultrasonic", distance, qos=0)
	temperature = round(circuit.getTemperature(),2)
	humidity = round(circuit.getHumidity(),2)
	client.publish("hotorcold", temperature, qos=0)
	client.publish("watt", humidity, qos=0)	
	if flag == True:
		imageFileName = pjcamera.takePicture()
		print(imageFileName)
		client.publish("image", imageFileName, qos=0)
		flag = False
	time.sleep(1)
	print("time...", end=" ")
	print(flag)
		
client.loop_end()
client.disconnect()
