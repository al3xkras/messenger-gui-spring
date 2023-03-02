
function sendRequest(url, method, data, content_type, xhr_consumer) {
    const access_token=getCookie(usr_access)
    const xhr = new XMLHttpRequest()
    xhr.onload=()=>xhr_consumer(xhr)
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-Type", content_type);
    xhr.overrideMimeType(content_type)
    xhr.setRequestHeader("Authorization",access_token)
    xhr.send(data)
}

