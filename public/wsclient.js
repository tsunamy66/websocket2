const HOST = location.href.replace(/^http/, 'ws');  //'ws://localhost:8080/echo'
// console.log('window.location.href;;', location.href);
// const HOST = location.origin.replace(/^http/, 'ws')  //'ws://localhost:8080'
// console.log('window.location.origin;;',location.origin);
// console.log('HOST;;',HOST);
const ws = new WebSocket(HOST);
ws.binaryType = 'blob';

ws.onopen = function () {
    // Get the element with id="defaultOpen" and click on it
    const tabs = document.getElementsByClassName("tabs")
    console.log("tabs|>",tabs[0]);
    tabs[0].querySelector("button#Savedmessage").click();
    setTiltle('connected');
};

ws.onclose = function () {
    setTiltle('disconnected');
};

ws.onmessage = function ({ data }) {
    let parsedOnlineUser, parsedBlob
    try {
        parsedOnlineUser = JSON.parse(data);
        createTab(parsedOnlineUser)
        console.log('parsed0|>', parsedOnlineUser);
    } catch (error) {
        // if (payload.data instanceof Blob) {
        const reader = new FileReader();
        reader.readAsText(data)

        reader.onload = () => {
            parsedBlob = reader.result;
            console.log("Result0: " + parsedBlob);

            printMessage(parsedBlob);
        };

        console.log('payload.data|>', data);
        console.log('payload.data.size|>', data.size);
    };

    // console.log('navigator.userAgent;;', navigator.userAgent);
};

document.forms["message"].onsubmit = function () {
    // const username = document.getElementById("username").textContent;
    // console.log({ username });
    console.log("input.value");
    var input = document.getElementById("usermsg");
    const tabs = document.getElementsByClassName("tabs")
    const activeChatTitle = tabs.getElementsByClassName("chatTitle active")
    console.log("activeChatTitle|>",activeChatTitle);
    ws.send(input.value);
    printMessage(input.value);
    input.value = "";
    // p.scrollTo(0, nestedElement.scrollHeight);
    scrollToBottom("chatbox")
    // window.scrollTo(0, document.body.scrollHeight)
};

function setTiltle(title) {
    document.querySelector('h4').innerHTML = title;
};

function printMessage(message) {
    // let index = parsedBlob.indexOf("}") + 1;
    // let recievedMessage = parsedBlob.slice(index);
    // let senderUser = parsedBlob.substring(0,index);
    // console.log("recievedMessage|>",recievedMessage);
    // console.log("senderUser|>",senderUser);
    // console.log("printMessage|>", message);
    // document.querySelector('p.msg').innerHTML = message;

    const p = document.createElement('p');
    // p.setAttribute("class", "badge rounded-pill bg-secondary");
    // p.style.fontSize = "20px"
    p.innerText = message;

    const div = document.createElement("div")
    const divChatBox = document.querySelector('div.chatbox');
    divChatBox.appendChild(div)
    div.appendChild(p)
    scrollToBottom("chatbox")
    // linebreak = document.createElement("br");
    // p.appendChild(linebreak);
};

function createTab(parsed) {
    var button = document.createElement("button")
    button.setAttribute("class", "tab")
    button.innerText = parsed.username
    // button.onclick = openChat()
    document.querySelector("div.tabs").appendChild(button)
    console.log("parsed|>", parsed);
}

const scrollToBottom = (id) => {
    const p = document.getElementById(id);
    p.scrollTop = p.scrollHeight;
}

function openChat(evt, userName) {
    // Declare all variables
    var i, chatContent, chatTitle;
    // Get all elements with class="chatContent" and hide them
    chatContent = document.getElementsByClassName("chatContent");
    console.log("chatContent|>",chatContent[0].id);
    for (i = 0; i < chatContent.length; i++) {
        if (chatContent[i].id != userName) {           
            chatContent[i].style.display = "none";
        }else{
            chatContent[i].style.display = "block";
        }
    }

    // Get all elements with class="chatTitle" and remove the class "active"
    chatTitle = document.getElementsByClassName("chatTitle");
    for (i = 0; i < chatTitle.length; i++) {
        chatTitle[i].className = chatTitle[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the link that opened the tab
    document.getElementById(userName).style.display = "block";
    evt.currentTarget.className += " active";
    console.log("evt\>", evt.currentTarget.className);
}

// Get the element with id="defaultOpen" and click on it
// document.getElementById("defaultOpen").click();