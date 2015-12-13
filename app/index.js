(function (context) {

    document.getElementById("appid").value = chrome.runtime.id;
    var logField = document.getElementById("log");
    var sendId = document.getElementById("sendId");
    var send = document.getElementById("send");

    var blacklistedIds = ["none"];
    var invalidTabTitles = ["Hear the tracks you’ve liked on SoundCloud", "Your stream on SoundCloud"];
    var fileEntry = null;

    chrome.runtime.onMessageExternal.addListener(
        function (request, sender, sendResponse) {
            if (sender.id in blacklistedIds) {
                sendResponse({"result": "sorry, could not process your message"});
                return;  // don't allow this extension access
            } else if (request.testConnectionMsg) {
                appendLog("Got a connection test from " + sender.id);
                sendResponse({"result": "Ok, got your message"});
            } else if (request.tabTitle) {
                //appendLog("Got title change event(" + sender.id + "): " + request.tabTitle + request.tabId);
                if(titleChange(request.tabTitle, request.tabId)) {
                    sendResponse({"result": "Ok, got your message", validTitle: true});
                    appendLog("Track title changed to: " + request.tabTitle);
                } else {
                    sendResponse({"result": "Ok, got your message", validTitle: false});
                }
            } else {
                sendResponse({"result": "Ops, I don't understand this message"});
            }
        });

    var saveToFile = function (title) {
        title = title.trim();
        title = title.substr(0, title.indexOf("by")-1);
        if(title.length > 5) {
            save("C:\\Users\\ThYpHoOn\\Documents\\OBS\\soundcloud.txt", title);
        }
    }

    var save = function (filename, title) {
        //appendLog("save: " + filename + " - " + title);

        fileEntry.createWriter(function (writer) {
            writer.onwrite = function() {
                writer.onwrite = null;
                writer.truncate(writer.position);
            };
            writer.write(new Blob([title], {type: 'text/plain'}));
        }, function(e){});
    };

    chrome.fileSystem.chooseEntry({
            type: 'openWritableFile'
        },
        function (writableFileEntry) {
            fileEntry = writableFileEntry;
        });

    var titleChange = function (title, tabId) {
        if (invalidTabTitles.indexOf(title) === -1) {
            //appendLog("Valid Tab title change!");
            saveToFile(title);
            return true;
        }
        return false;
    }

    var appendLog = function (message) {
        logField.innerText += "\n" + message;
    }

    context.appendLog = appendLog;
})(window)
