const ws = new WebSocket('ws://localhost:3000')

ws.onopen = function(){
    setTiltle('connected to Cyber Chat')
}
ws.onclose = function(){
    setTiltle('disconnected from Cyber Chat')
}
ws.onmessage = function(payload) {
    printMessage(payload.data)
}

document.forms[0].onsubmit = function() {
    var input = document.getElementById("message");
    ws.send(input.value )
    // printMessage(input.value)
    input.value = "";
}

function setTiltle(title){
    document.querySelector('h1').innerHTML = title
}

function printMessage(message) {
    var p = document.createElement('p')
    p.innerText = message
    document.querySelector('div.messages').appendChild(p)
}
