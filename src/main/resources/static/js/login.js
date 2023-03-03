


document.getElementById("btn-login").addEventListener("click",()=>{
    const input_username = document.getElementById("username")
    const input_password = document.getElementById("password")

    initUserServiceTokens(input_username.value,input_password.value,token=>{
        initChatServiceTokens()
    })
})