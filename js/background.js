let user_signedIn = false;
let storage = chrome.storage.sync;
let actionItemsUtils = new ActionItems();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "user_signed_in") {
        user_signedIn = true;
        sendResponse({
            message: "success",
            payload: user_signedIn
        })
    } else if (request.message === "user_signed_off") {
        user_signedIn = false;
        sendResponse({
            message: "success"
        })
    }
    return user_signedIn;
})

chrome.contextMenus.create({
    "id": "linkSiteMenu",
    "title": "Link site for Later",
    "contexts": ["all"]
})


chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId == "linkSiteMenu") {
        actionItemsUtils.addQuickActionItem("quickLink3", "Read this site", tab, () => {
            actionItemsUtils.setProgress();
        })
    }
})



chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason == "install") {
        chrome.storage.sync.set({
            actionItems: [],
            initialButtons: [{
                fTag: "Gym",
                dataTag: "Go to gym"
            }, {
                fTag: "Medication",
                dataTag: "Take Medication"
            }]
        })
    }
})