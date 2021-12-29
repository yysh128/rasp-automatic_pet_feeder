import os; import io; import time
import picamera
fileName = ""
stream = io.BytesIO()
camera = picamera.PiCamera()
camera.start_preview()
camera.resolution = (320, 240)
camera.rotation = 90
time.sleep(1)

def takePicture() :
	global fileName, stream, camera

	if len(fileName) != 0:
		os.unlink(fileName)

	stream.seek(0)
	stream.truncate()
	camera.capture(stream, format='jpeg', use_video_port=True)

	takeTime = time.time()
	fileName = "./static/%d.jpg" % (takeTime * 10)
	cv2.imwrite(fileName, image)
	return fileName

if __name__ == '__main__' :
	while(True):
		name = takePicture()
		print("fname= %s" % name)

