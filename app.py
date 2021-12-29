from flask import Flask, render_template, request
app = Flask(__name__)
@app.route('/')
def index():
	# 03-mqtt.html 파일은 03-mqttio.js 파일을 로딩
	return render_template('pjmqtt.html')
if __name__ == "__main__":
	app.run(host='0.0.0.0', port=8080)
