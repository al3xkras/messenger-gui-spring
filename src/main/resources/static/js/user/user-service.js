
function sendRequest(url, method, data, mime_type, xhr_consumer) {
    const access_token=getCookie(usr_access)
    const xhr = new XMLHttpRequest()
    xhr.onload=()=>xhr_consumer(xhr)
    xhr.open(method, url, true);
    if (mime_type)
        xhr.overrideMimeType(mime_type)
    xhr.setRequestHeader("Authorization",access_token)
    xhr.send(data)
}

