var port = 9001 // mosquitto의 디폴트 웹 포트
var client = null; // null이면 연결되지 않았음
function startConnect() { // 접속을 시도하는 함수
clientID = "clientID-" + parseInt(Math.random() * 100); // 랜덤한 사용자 ID 생성
// 사용자가 입력한 브로커의 IP 주소와 포트 번호 알아내기
broker = document.getElementById("broker").value; // 브로커의 IP 주소
// id가 message인 DIV 객체에 브로커의 IP와 포트 번호 출력
// MQTT 메시지 전송 기능을 모두 가징 Paho client 객체 생성
client = new Paho.MQTT.Client(broker, Number(port), clientID);
// client 객체에 콜백 함수 등록
client.onConnectionLost = onConnectionLost; // 접속이 끊어졌을 때 실행되는 함수 등록
client.onMessageArrived = onMessageArrived; // 메시지가 도착하였을 때 실행되는 함수 등록
// 브로커에 접속. 매개변수는 객체 {onSuccess : onConnect}로서, 객체의 프로퍼틴느 onSuccess이고 그 값이 onConnect.
// 접속에 성공하면 onConnect 함수를 실행하라는 지시
client.connect({
onSuccess: onConnect,
});
}
var isConnected = false;
// 브로커로의 접속이 성공할 때 호출되는 함수
function onConnect() {
isConnected = true;
}
var topicSave;
function subscribe(topic) {
if(client == null) return;
if(isConnected != true) {
topicSave = topic;
window.setTimeout("subscribe(topicSave)", 500);
return
}
// 토픽으로 subscribe 하고 있음을 id가 message인 DIV에 출력
if(topic=="ultrasonic"){
document.getElementById("messages").innerHTML += '<span>거리측정을 시작합니다'+'</span><br/>';}
if(topic=="watt"){
	document.getElementById("messages").innerHTML += '<span>습도측정을 시작합니다'+'</span><br/>';}
if(topic=="hotorcold"){
	document.getElementById("messages").innerHTML += '<span>온도측정을 시작합니다'+'</span><br/>';}
client.subscribe(topic);
}

function publish(topic, msg) {
if(client == null) return; // 연결되지 않았음
client.send(topic, msg, 0, false);
}
function unsubscribe(topic) {
if(client == null || isConnected != true) return;
// 토픽으로 subscribe 하고 있음을 id가 message인 DIV에 출력
if(topic=="watt") {
	document.getElementById("messages").innerHTML += '<span> 습도측정이 중단됩니다'+'</span><br/>';}
if(topic=="hotorcold"){
	document.getElementById("messages").innerHTML += '<span> 온도측정이 중단됩니다'+'</span><br/>';}

client.unsubscribe(topic, null); // 브로커에 subscribe
}
// 접속이 끊어졌을 때 호출되는 함수
function onConnectionLost(responseObject) { // 매개변수인 responseObject는 응답 패킷의 정보를 담은 개체
document.getElementById("messages").innerHTML += '<span>오류 : 접속 끊어짐</span><br/>';
if (responseObject.errorCode !== 0) {
document.getElementById("messages").innerHTML += '<span>오류 : ' + + responseObject.errorMessage + '</span><br/>';
}
}
// 메시지가 도착할 때 호출되는 함수
function onMessageArrived(msg) { // 매개변수 msg는 도착한 MQTT 메시지를 담고 있는 객체
console.log("onMessageArrived: " + msg.payloadString);
// 도착한 메시지 출력

if(msg.destinationName == "image") {
	drawImage(msg.payloadString);
	document.getElementById("messages").innerHTML += '<span>' + msg.destinationName + ' = ' + msg.payloadString + '</span><br/>';
}
if(msg.destinationName == "ultrasonic"){
	if (Number(msg.payloadString) <25){
	document.getElementById("messages").innerHTML += '<span>' + msg.payloadString + 'cm 입니다. 반려동물이 사정거리에 있습니다. 사진을 촬영합니다.</span><br/>'; 
	recognize()
	unsubscribe("ultrasonic")
}
	else { document.getElementById("messages").innerHTML += '<span>' + msg.payloadString + 'cm 입니다.</span><br/>';}
}
    if(msg.destinationName == "watt"){
        if(Number(msg.payloadString)<30){
            document.getElementById("messages").innerHTML += '<span> 주의!!! 현재 습도가 '+ msg.payloadString + ' % 입니다. 습도가 낮습니다!!!</span><br/>';
    
        }
        if(Number(msg.payloadString)>45){
            document.getElementById("messages").innerHTML += '<span> 주의!!! 현재 습도가 ' + msg.payloadString + '% 입니다. 습도가 높습니다!!!</span><br/>';
        }
        else {
        document.getElementById("messages").innerHTML += '<span> 현재 습도는 ' + msg.payloadString + '% 입니다. 적정습도입니다.</span>';
	unsubscribe("watt")
}    }
    if(msg.destinationName == "hotorcold"){
        if(Number(msg.payloadString)<20){
            document.getElementById("messages").innerHTML += '<span> 주의!!! 현재 온도가 '  + msg.payloadString + '도 입니다. 온도가 낮습니다!!!</span><br/>';
        
        }
        if(Number(msg.payloadString)>23){
            document.getElementById("messages").innerHTML += '<span> 주의!!! 현재 온도가 ' + msg.payloadString + '도 입니다. 온도가 높습니다!!!</span><br/>';
        }
        else{
        	document.getElementById("messages").innerHTML += '<span> 현재 온도는 ' + msg.payloadString + '도 입니다. 적정온도입니다.</span>';
		unsubscribe("hotorcold")
		}
	}
}
function startDisconnect() {
client.disconnect(); // 브로커에 접속 해제
document.getElementById("messages").innerHTML += '<span>Disconnected</span><br/>';
}
