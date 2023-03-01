
function getUserInfo(xhr_consumer) {
    const username=getCookie(usr_name)
    const token=getCookie(usr_access)
    sendUserServiceRequest("/user/info?username="+username+"&token="+token,"GET",null,null,xhr_consumer)
}

function getUserChats(xhr_consumer) {
    const username=getCookie(usr_name)
    const token=getCookie(nochat_access)
    sendUserServiceRequest("/user/chats?username="+username+"&token="+token,"GET",null,null,xhr_consumer)
}