const HOST = location.href.replace(/^http/, 'ws');  //'ws://localhost:8080/echo'
// console.log('window.location.href;;', location.href);
// const HOST = location.origin.replace(/^http/, 'ws')  //'ws://localhost:8080'
// console.log('window.location.origin;;',location.origin);
// console.log('HOST;;',HOST);
const ws = new WebSocket(HOST);
ws.binaryType = 'blob';

ws.onopen = function () {
    // Get the element with id="Savedmessage" in "chatTabs" and click on it
    const chatTabs = document.getElementsByClassName("chatTabs");
    console.log("chatTabs|>", chatTabs[0]);
    chatTabs[0].querySelector("button#Savedmessage").click();
    setTiltle('connected');
};

ws.onclose = function () {
    setTiltle('disconnected');
};

ws.onmessage = function ({ data }) {
    console.log("data|>", data);
    // try {
    //     //when a user has been connected.The server sends the user & id without message in JSON
    //     parsedOnlineUser = JSON.parse(data);
    //     createTab(parsedOnlineUser)
    //     console.log('parsed0|>', parsedOnlineUser);
    // } catch (error) {
    //when a user sends message.the server sends message & sender in BLOB
    // if (payload.data instanceof Blob) {
    const reader = new FileReader();
    reader.readAsText(data);

    reader.onload = () => {

        let parsedBlobData = JSON.parse(reader.result)
        if (parsedBlobData.message) {

            // printMessage(parsedOnlineUser);
        } else {
            let existTitle = document.getElementById(parsedBlobData.id)
            if (!existTitle) {
                createChatTitleAndChatContent(parsedBlobData)
            }
            // createChatContent(parsedBlobData)
        }
    };

    console.log('payload.data|>', data);
    console.log('payload.data.size|>', data.size);
    // };

    // console.log('navigator.userAgent;;', navigator.userAgent);
};

document.forms["message"].onsubmit = function () {
    // const username = document.getElementById("username").textContent;
    // console.log({ username });
    console.log("input.value");
    var inputElement = document.getElementById("usermsg");
    console.log("input|>", inputElement.value);
    const chatTabs = document.getElementsByClassName("chatTabs");
    const active = chatTabs[0].querySelector('button.active'); //or 'button.chatTitle.active'
    // const activeChatTitle = chatTabs.getElementsByClassName("chatTitle active");

    console.log("activeId|>", active.id);

    const useridMessage = { id: active.id, message: inputElement.value }

    ws.send(JSON.stringify(useridMessage));
    printMessage(inputElement.value);
    inputElement.value = "";
    // p.scrollTo(0, nestedElement.scrollHeight);
    // scrollToBottom("chatbox");
    // window.scrollTo(0, document.body.scrollHeight)
};

function setTiltle(title) {
    document.querySelector('h4').innerHTML = title;
};

function printMessage(message) {
    // // let index = parsedBlob.indexOf("}") + 1;
    // // let recievedMessage = parsedBlob.slice(index);
    // // let senderUser = parsedBlob.substring(0,index);
    // // console.log("recievedMessage|>",recievedMessage);
    // // console.log("senderUser|>",senderUser);
    // // console.log("printMessage|>", message);
    // // document.querySelector('p.msg').innerHTML = message;

    // const p = document.createElement('p');
    // // p.setAttribute("class", "badge rounded-pill bg-secondary");
    // // p.style.fontSize = "20px"
    // p.innerText = message;

    // const div = document.createElement("div")
    // const divChatBox = document.querySelector('div.chatbox');
    // divChatBox.appendChild(div)
    // div.appendChild(p)
    // scrollToBottom("chatbox")
    // linebreak = document.createElement("br");
    // p.appendChild(linebreak);
};

function createChatTitleAndChatContent(parsed) {

    console.log("parsed|>", parsed);
    const button = document.createElement("button");
    button.setAttribute("class", "chatTitle");
    button.setAttribute("onclick", "openChat(event,'" + parsed.username + "')");
    button.setAttribute("id", parsed.id);
    button.innerText = parsed.username;
    // button.onclick = openChat()
    document.querySelector("div.chatTabs").appendChild(button);

    const div = document.createElement("div");
    div.setAttribute("class", "chatContent");
    div.setAttribute("id", parsed.username);
    div.setAttribute("style", "display: none");

    document.querySelector("div.chatContents").appendChild(div);
    const divFormal = document.createElement("div");
    divFormal.setAttribute("class", "formal");
    console.log("div" + "#" + parsed.username);
    const divContent = document.querySelector("div" + "#" + parsed.username)
    console.log("divContent|>", divContent);
    divContent.appendChild(divFormal);

};


const scrollToBottom = (id) => {
    const p = document.getElementById(id);
    p.scrollTop = p.scrollHeight;
};

function openChat(evt, userName) {
    // Declare all variables
    var i, chatContent, chatTitle;
    // Get all elements with class="chatContent" and hide them
    chatContent = document.getElementsByClassName("chatContent");
    console.log("chatContent|>", chatContent[0].id);
    for (i = 0; i < chatContent.length; i++) {
        if (chatContent[i].id != userName) {
            chatContent[i].style.display = "none";//Hide all tabs,
        } else {
            chatContent[i].style.display = "block";//Show the current tab,
        }
    }

    // Get all elements with class="chatTitle" and remove the class "active"
    chatTitle = document.getElementsByClassName("chatTitle");
    for (i = 0; i < chatTitle.length; i++) {
        chatTitle[i].className = chatTitle[i].className.replace(" active", "");
    }

    // document.getElementById(userName).style.display = "block";
    //Add an "active" class to the link that opened the tab
    evt.currentTarget.className += " active";
    console.log("evt\>", evt.currentTarget.className);
};

// Get the element with id="defaultOpen" and click on it
// document.getElementById("defaultOpen").click();