const HOST = location.href.replace(/^http/, 'ws');  //'ws://localhost:8080/echo'
// console.log('window.location.href;;', location.href);
// const HOST = location.origin.replace(/^http/, 'ws')  //'ws://localhost:8080'
// console.log('window.location.origin;;',location.origin);
// console.log('HOST;;',HOST);
const ws = new WebSocket(HOST);

ws.onopen = function () {
    clickSavedmessage()
    // Get the element with id="Savedmessage" in "chatTabs" and click on it
};

ws.onclose = function () {
    setTiltle('disconnected');
};

ws.onmessage = function ({ data }) {
    // data= {  senderId : " " ,message:"Sometimes",isSender:"sometimes"} in BLOB
    // data= {  id : "" ,username:""} in BLOB
    // console.log("data|>", data);
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
        console.log("parsedBlobData|>", parsedBlobData);
        if (parsedBlobData.hasOwnProperty("message")) {
            console.log("parsedBlobData|>", parsedBlobData);

            createRecievedEl(parsedBlobData);
        } else {
            let existTitle = document.getElementById(parsedBlobData.id)
            if (!existTitle) {
                createChatTitleAndChatContent(parsedBlobData)
            }
        }

        if (parsedBlobData.hasOwnProperty("isSender")) {
            if(parsedBlobData.isSender){
                createRecievedEl(parsedBlobData);
            }else{
                parsedBlobData.recieverId = parsedBlobData.senderId
                createSentEl(parsedBlobData)
            }
        }
    };

};

document.forms["message"].onsubmit = function () {

    var inputElement = document.getElementById("usermsg");
    // console.log("input|>", inputElement.value);
    // const chatTabs = document.getElementsByClassName("chatTabs");
    const activeChatTitle = document.querySelector('button.active'); //or 'button.chatTitle.active'

    const recieveridMessage = { recieverId: activeChatTitle.id, message: inputElement.value };
    createSentEl(recieveridMessage);

    ws.send(JSON.stringify(recieveridMessage));
    inputElement.value = "";
    // scrollToBottom("chatbox");
};

function setTiltle(title) {
    document.querySelector('h4').innerHTML = title;
};

function createSentEl({ recieverId, message }) {
    //recieveridMessage = { recieverId: activeChatTitle.id, message: inputElement.value }
    const pMessage = document.createElement('p');
    pMessage.setAttribute("class", "sentMessage");
    pMessage.innerText = message;
    printMessage(pMessage, recieverId);
};

function createRecievedEl({ senderId, message }) {
    //recieveridMessage = { recieverId: activeChatTitle.id, message: inputElement.value }
    const pMessage = document.createElement('p');
    pMessage.setAttribute("class", "recievedMessage");
    pMessage.innerText = message;
    printMessage(pMessage, senderId);
};

function printMessage(pMessage, id) {

    const chatContent = document.querySelector("div" + "[" + "id='" + id + "']")
    chatContent.appendChild(pMessage);

    scrollToBottom(chatContent);
};

function createChatTitleAndChatContent(parsedBlobData) {

    // console.log("parsedBlobData|>", parsedBlobData);
    const button = document.createElement("button");
    button.setAttribute("class", "chatTitle");
    button.setAttribute("onclick", "openChat(event,'" + parsedBlobData.id + "')");
    button.setAttribute("id", parsedBlobData.id);
    button.setAttribute("name", parsedBlobData.username);
    button.innerText = parsedBlobData.username;
    // button.onclick = openChat()
    document.querySelector("div.chatTabs").appendChild(button);

    const div = document.createElement("div");
    div.setAttribute("class", "chatContent");
    div.setAttribute("id", parsedBlobData.id);
    div.setAttribute("name", parsedBlobData.username);
    div.setAttribute("style", "display: none");

    document.querySelector("div.chatContents").appendChild(div);
    const divFormal = document.createElement("div");
    divFormal.setAttribute("class", "formal");
    // console.log("div" + "[" + "id='" + parsedBlobData.id + "']");
    const chatContent = document.querySelector("div" + "[" + "id='" + parsedBlobData.id + "']")
    // console.log("chatContent|>", chatContent);
    chatContent.appendChild(divFormal);

};

const scrollToBottom = (el) => {
    // const p = document.getElementById(id);
    el.scrollTop = el.scrollHeight;
};

function openChat(evt, id) {
    // Declare all variables
    let i, chatContent, chatTitle, chatContent1;
    // Get all elements with class="chatContent" and hide them
    chatContent = document.getElementsByClassName("chatContent");
    // chatContent1 = document.querySelector("div[id='" + id + "']")
    // console.log("chatcontent1.childElementCount|>",chatContent1.childElementCount);
    // console.log("chatContent1|>",chatContent1);
    // if (chatContent.length == 0) {
    //     ws.send(JSON.stringify({ chatContentWithId: id }))
    // }
    for (i = 0; i < chatContent.length; i++) {
        console.log("chatContent|>", chatContent[i]);
        // console.log("chatContent1|>", chatContent1[i]);
        if (chatContent[i].id != id) {
            chatContent[i].style.display = "none";//Hide all tabs,
        } else {
            chatContent[i].style.display = "flex";//Show the current tab,
            console.log("chatContent[i].childElementCount == 1",chatContent[i].childElementCount == 1);
            if (chatContent[i].childElementCount == 1) {
                ws.send(JSON.stringify({ chatContentWithId: id })) //give database message
            };
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
    // ws.send(JSON.stringify({ chatContentWithId: id }))
    // console.log("evt\>", evt.currentTarget.className);

};

function clickSavedmessage() {
    const chatTabs = document.getElementsByClassName("chatTabs");
    // console.log("chatTabs|>", chatTabs[0]);
    chatTabs[0].querySelector("button#Savedmessage").click();
    setTiltle('connected');
}

// Get the element with id="defaultOpen" and click on it
// document.getElementById("defaultOpen").click();