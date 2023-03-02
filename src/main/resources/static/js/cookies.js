//access user service
usr_access="user-access-token"
//access a specific chat
chat_access="chat-access-token"
//access chat service (create a new chat)
nochat_access="nochat-access"
//username cookie
usr_name="user-username"

function setCookie(name,value,days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i=0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0)===' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

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

function initChatServiceTokens(chat_name,hide_alert,token_consumer){
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
                const token = "Bearer "+access;
                setCookie(cookie_name,token,7)
                token_consumer(token)
                if (!hide_alert) {
                    alert("auth successful")
                    document.location="/user/index"
                }
                console.log("auth successful")
            } else {
                alert("access token not received")
                return
            }
            if (refresh){
                //todo implement
            }
        } else {
            if (!hide_alert) alert("failed to authenticate")
            console.log("auth failed")
        }
    }
    xhr.send(login_form)
}