
function getUserInfo() {
    const username=getCookie(usr_name)
    const token=getCookie(usr_access)
    sendUserServiceRequest("/user/info?username="+username+"&token="+token,"GET",null,null,xhr=>{
        console.assert(xhr instanceof XMLHttpRequest)
        //xhr=new XMLHttpRequest(xhr)
        console.log(xhr.responseText)
    })
}