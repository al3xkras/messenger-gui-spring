const input_username = document.getElementById("username")
const input_password = document.getElementById("password")

function initUserServiceTokens(username,password){
    const login_form = new FormData();
    login_form.append( "username",username)
    login_form.append("password",password)
    const xhr = new XMLHttpRequest()
    xhr.overrideMimeType("application/json")
    xhr.open('POST', '/login', true);
    xhr.onload=()=>{
        if (xhr.status===200){
            const response = JSON.parse(xhr.responseText)
            console.log(JSON.stringify(response))
            const access=response['access-token']
            const refresh=response['refresh-token']

            if (access){
                setCookie(usr_name,username,7)
                setCookie(usr_access,"Bearer "+access,7)
                document.location="/user/index"
            } else {
                return
            }
            if (refresh){
                //todo implement
            }
        } else {
            alert("failed to log in")
        }
    }
    xhr.send(login_form)
}

function initChatServiceTokens(chat_name){
    const user_token = getCookie(usr_access)
    const login_form = new FormData();
    login_form.append( "user-access-token",user_token)
    if (chat_name)
        login_form.append("chat-name",chat_name)
    let cookie_name=nochat_access
    if (chat_name)
        cookie_name=chat_access
    const xhr = new XMLHttpRequest()
    xhr.overrideMimeType("application/json")
    xhr.open('POST', '/chat/auth', true);
    xhr.onload=()=>{
        if (xhr.status===200){
            const response = JSON.parse(xhr.responseText)
            console.log(JSON.stringify(response))
            const access=response['access-token']
            const refresh=response['refresh-token']

            if (access){
                setCookie(cookie_name,"Bearer "+access,7)
                alert("auth successful")
                document.location="/user/index"
            } else {
                alert("access token not received")
                return
            }
            if (refresh){
                //todo implement
            }
        } else {
            alert("failed to authenticate")
        }
    }
    xhr.send(login_form)
}

document.getElementById("btn-login").addEventListener("click",()=>{
    initUserServiceTokens(input_username.value,input_password.value)
    initChatServiceTokens()
})