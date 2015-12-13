# chrome-sctitle-to-file - Extension
This Chrome extension looks for SoundCloud tabs that play music and listens to the tab change events. On every tab change event it sends the changed tab title to the app.

# ToDos
* Save the applicationId via chrome.storage
* Put the tabs.query into a timer to refresh the valid tab ids in a configurable interval
* Make the notification configurable (on/off)
* Load more track info (e.g. album artwork) via the SoundCloud API