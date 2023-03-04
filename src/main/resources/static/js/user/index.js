
function getUserInfo(xhr_consumer) {
    const username=getCookie(usr_name)
    const token=getCookie(usr_access)
    sendRequest("/user/info?username="+username+"&token="+token,"GET",null,null,xhr_consumer)
}

function getUserChats(xhr_consumer) {
    const username=getCookie(usr_name)
    const token=getCookie(nochat_access)
    sendRequest("/user/chats?username="+username+"&token="+token,"GET",null,null,xhr_consumer)
}

const divUsername=document.getElementById("user-username")
const divName=document.getElementById("user-name")
const divSurname=document.getElementById("user-surname")
const divUserType=document.getElementById("user-type")
const divEmailAddress=document.getElementById("email-address")
const divPhoneNumber=document.getElementById("phone-number")
const divChatListItem=document.getElementById("chat-list-item")
const divChatList=document.getElementById("chat-list")
const divActiveChat=document.getElementById("active-chat")

const messageTemplate=document.getElementById("message-template")
const divMessageInput=document.getElementById("div-message-input")
const messageInput=document.getElementById("message-input")
let update = ()=>{}

const createChatDialog = {
    dialog:document.getElementById("create-chat-dialog"),
    inputChatName:document.getElementById("input-chat-name"),
    inputDisplayName:document.getElementById("input-chat-display-name"),
    createChat:function () {
        const token=getCookie(nochat_access)
        const dialog=createChatDialog.dialog;
        const jwtData=parseJwt(token.split(" ")[1])
        console.assert(jwtData['user-id'])
        const chat = {
            "chatName":this.inputChatName.value,
            "displayName":this.inputDisplayName.value,
            "ownerId":jwtData["user-id"]
        }
        createChat(chat)
        dialog.close()
    }
}

function getUserByUsername(username,user_consumer){
    const token=getCookie(usr_access)
    sendRequest("/user?username="+username+"&token="+token,"GET",null,null,xhr=>{
        console.assert(xhr.status===200)
        if (xhr.status===200){
            let user=JSON.parse(xhr.responseText)
            user_consumer(user)
        } else {
            user_consumer(null)
        }
    })
}

const addChatUserDialog = {
    dialog:document.getElementById("add-user-dialog"),
    inputUsername:document.getElementById("input-username"),
    addUser:()=>{

        const token = getCookie(chat_access)
        const jwtData=parseJwt(token.split(" ")[1])
        const username=addChatUserDialog.inputUsername.value
        getUserByUsername(username,user=>{
            console.log(user)
            const userDTO = JSON.stringify({
                "chatId":jwtData["chat-id"],
                "userId":user['messengerUserId'],
                "chatUserRole":"USER",
                "title":""
            })
            sendRequest("/chat/users?username="+username+"&token="+getCookie(chat_access),"POST",userDTO,"application/json",xhr=>{
                console.assert(xhr.status===200)
                console.log(xhr.responseText)
            })
            addChatUserDialog.dialog.close()
        })
    }
}

function logout(){
    eraseCookie(usr_access)
    eraseCookie(usr_name)
    eraseCookie(chat_access)
    eraseCookie(nochat_access)
    document.location="/"
}

function newInstance(clazz, arguments, scope) {
    return new (Function.prototype.bind.apply(clazz, [scope].concat(arguments)));
}

function createChat(chat){
    let token = getCookie(nochat_access)
    sendRequest("/chat?token="+token,"POST",JSON.stringify(chat),"application/json",xhr=>{
        console.assert(xhr.status===200)
        addChat(chat)
    })
}

getUserInfo(xhr=>{
    console.assert(xhr instanceof XMLHttpRequest)
    //xhr=new XMLHttpRequest(xhr)

    console.log(xhr.responseText)
    let userdata = JSON.parse(xhr.responseText)
    divUsername.innerHTML=userdata['username']
    divName.innerHTML=userdata['name']
    divSurname.innerHTML=userdata['surname']
    divUserType.innerHTML=userdata['messengerUserType']
    divEmailAddress.innerHTML=userdata['emailAddress']
    divPhoneNumber.innerHTML=userdata['phoneNumber']
})

function addMessage(message){
    const container=divActiveChat
    const messageNode=messageTemplate.cloneNode(true)

    const msg_sender=messageNode.querySelectorAll(".msg-sender-text")[0]
    const msg_text=messageNode.querySelectorAll(".message-text")[0]
    const msg_date=messageNode.querySelectorAll(".msg-date-text")[0]
    const msg_delete_btn=messageNode.querySelectorAll(".msg-delete-btn")[0]
    msg_sender.innerHTML=message["userId"]
    msg_date.innerHTML=newInstance(Date,message["submissionDate"])
    msg_text.innerHTML=message["message"]
    const chatId=message['chatId']
    console.assert(chatId)
    const token = getCookie(chat_access)
    const jwtData=parseJwt(token.split(" ")[1])
    if (jwtData['user-id']===message['userId']){
        msg_delete_btn.hidden=null
        msg_delete_btn.addEventListener("click", ()=>{
            const data = {
                "chatId":message["chatId"],
                "userId":message["userId"],
                "submissionDate":message["submissionDate"]
            }
            sendRequest("/chat/message?token="+token,"DELETE",JSON.stringify(data),"application/json",xhr=>{
                if (xhr.status===200){
                    container.removeChild(messageNode)
                } else {
                    console.warn("message not deleted, response status: "+xhr.status)
                    console.warn(xhr.responseText)
                }
            })
        })
    }

    messageNode.hidden=null
    container.appendChild(messageNode)
}

function displayChatMessages(response){
    const messages=response['content']
    divActiveChat.innerHTML=''
    divActiveChat.appendChild(messageTemplate)
    for (const id in messages){
        const message=messages[id]
        console.log(message)
        addMessage(message)
    }
    console.log(response)
}
function addChat(chat) {
    let chatElement = divChatListItem.cloneNode()
    chatElement.hidden=null
    let displayName=chat['chatDisplayName']
    displayName=displayName?displayName:chat['displayName']
    chatElement.innerHTML=displayName
    chatElement.addEventListener("click",()=>{
        const chat_name=chat['chatName']
        update = ()=> initChatServiceTokens(chat_name,true,token=>{
            sendRequest("/chat/messages?chat-name="+chat_name+"&token="+token,"GET",null,null, xhr=>{
                console.assert(xhr.status===200)
                const response=JSON.parse(xhr.responseText)
                console.log(xhr.responseText)
                displayChatMessages(response)
                activeChatName=chat_name
            })
        })
        update()

    })
    divChatList.appendChild(chatElement)
}
getUserChats(xhr=>{
    console.assert(xhr instanceof XMLHttpRequest)
    console.log(xhr.responseText)
    let userdata = JSON.parse(xhr.responseText)
    const chats=userdata['content']
    for (const i in chats) {
        const chat=chats[i]
        console.log(chat)
        addChat(chat)
    }
})
const intervalId = setInterval(function () {
    update()
}, 5000);

let activeChatName=null
const btnSendMessage=document.getElementById("btn-send-message")
btnSendMessage.addEventListener("click", ()=>{
    if (!activeChatName)
        return

    const token = getCookie(chat_access)
    const jwtData=parseJwt(token.split(" ")[1])
    const message={
        "userId":jwtData['user-id'],
        "chatId":jwtData['chat-id'],
        "submissionDate":new Date(),
        "message":messageInput.value
    }
    const data = JSON.stringify(message)
    console.assert(jwtData['user-id'] && jwtData['chat-id'])
    console.log(jwtData)

    sendRequest("/chat/message?token="+token,"POST",data,"application/json;charset=UTF-8",xhr=>{
        console.assert(xhr.status===200)
        update()
    })
})