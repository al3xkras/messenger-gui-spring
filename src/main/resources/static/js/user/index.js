
function getUserInfo(xhr_consumer) {
    const username=getCookie(usr_name)
    const token=getCookie(usr_access)
    sendUserServiceRequest("/user/info?username="+username+"&token="+token,"GET",null,null,xhr_consumer)
}