(function (context) {

    document.getElementById("appid").value = chrome.runtime.id;
    var logField = document.getElementById("log");
    var sendId = document.getElementById("sendId");
    var send = document.getElementById("send");
    var applicationId = "";

    send.addEventListener('click', function () {
        appendLog("Saved application id " + sendId.value);
        applicationId = sendId.value;
        chrome.runtime.sendMessage(
            sendId.value,
            {myCustomMessage: sendText.value},
            function (response) {
                appendLog("Connection to app successful!");
            })
    });

    var appendLog = function (message) {
        logField.innerText += "\n" + message;
    }

    context.appendLog = appendLog;

})(window)
