const input_username = document.getElementById("username")
const input_password = document.getElementById("password")



document.getElementById("btn-login").addEventListener("click",()=>{
    initUserServiceTokens(input_username.value,input_password.value)
    initChatServiceTokens()
})