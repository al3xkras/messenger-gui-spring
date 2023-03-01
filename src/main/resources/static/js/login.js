const input_username = document.getElementById("username")
const input_password = document.getElementById("password")
document.getElementById("btn-login").addEventListener("click",()=>{
    const login_form = new FormData();
    login_form.append( "username",input_username.value)
    login_form.append("password",input_password.value)
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
                setCookie(usr_access,"Bearer "+access,7)
                alert("login successful")
                document.location="/user/index"
            } else {
                alert("access token not received")
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
})