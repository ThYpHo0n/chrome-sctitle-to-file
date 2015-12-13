var blacklistedIds = ["none"];
if (!applicationId) {
    //ToDo: Get this from chrome.storage
    var applicationId = 'ciaemelobkkpddlcncnkdmdgfobomdfn';
}

chrome.runtime.onMessageExternal.addListener(
    function (request, sender, sendResponse) {
        if (sender.id in blacklistedIds) {
            sendResponse({"result": "sorry, could not process your message"});
            return;  // don't allow this extension access
        } else if (request.myCustomMessage) {
            new Notification('Got message from ' + sender.id,
                {body: request.myCustomMessage});
            sendResponse({"result": "Ok, got your message"});
        } else {
            sendResponse({"result": "Ops, I don't understand this message"});
        }
    }
);

var queryInfo = {"url": "https://soundcloud.com/*", "audible": true};
var validTabIds = [];

// Collect and send all valid tab ids to the app
// ToDo: Put this into a timer which updates the valid TabIds every x seconds
chrome.tabs.query(
    queryInfo,
    function callback(tabs) {
        tabs.forEach(function (tab) {
            validTabIds.push(tab.id);
        });
    }
);

// Hook into tab updates and send them to the app (if the tab is producing sound)
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (tab.audible && (validTabIds.indexOf(tabId) > -1)) {
        chrome.runtime.sendMessage(
            applicationId,
            {tabTitle: tab.title, tabId: tabId},
            function (response) {
                //appendLog("response: "+JSON.stringify(response));
                if(response.validTitle) {
                    new Notification('Changed track title',
                        {body: tab.title});
                }
            });
    }
});
