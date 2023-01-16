const HOST = location.href.replace(/^http/, 'ws');  //'ws://localhost:8080/echo'
console.log('window.location.href;;', location.href);
// const HOST = location.origin.replace(/^http/, 'ws')  //'ws://localhost:8080'
// console.log('window.location.origin;;',location.origin);
// console.log('HOST;;',HOST);
const ws = new WebSocket(HOST);

ws.onopen = function () {
    // ws.send('i am connected');
    setTiltle('connected');
}
ws.onclose = function () {
    setTiltle('disconnected');
};
ws.onmessage = function (payload) {
    // console.log('window.location.origin;;',location.origin);
    // console.log('window.location.hostname;;',location.hostname);
    // console.log('window.location.pathname;;',location.pathname);
    // console.log('window.location.protocol;;',location.protocol);
    // console.log('window.location.port;;',location.port);
    // console.log('window.history;;',window.history);
    // console.log('document.cookie;;',document.cookie);
    console.log('payload.data|>', payload.data);
    console.log('navigator.userAgent;;', navigator.userAgent);
    printMessage(payload.data);
};
// ws.addEventListener('message',(payload)=>{
//     printMessage(payload.data)
// })
document.forms["message"].onsubmit = function () {
    const username = document.getElementById("username").textContent;
    console.log({ username });
    console.log("input.value");
    var input = document.getElementById("usermsg");
    ws.send(input.value);
    // printMessage(input.value);
    input.value = "";
    // p.scrollTo(0, nestedElement.scrollHeight);
    scrollToBottom("chatbox")
    // window.scrollTo(0, document.body.scrollHeight)
};

function setTiltle(title) {
    document.querySelector('h4').innerHTML = title;
};

function printMessage(message) {
    // console.log("printMessage|>",message);
    // document.querySelector('p.msg').innerHTML = message;
    var p = document.createElement('p');
    p.setAttribute("class", "msg");
    p.innerText = message;
    const divChatBox = document.querySelector('div.chatbox');
    divChatBox.appendChild(p)
    scrollToBottom("chatbox")
    // linebreak = document.createElement("br");
    // p.appendChild(linebreak);
};

const scrollToBottom = (id) => {
    const p = document.getElementById(id);
    p.scrollTop = p.scrollHeight ;
}