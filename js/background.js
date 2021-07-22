let storage = chrome.storage.sync;
let actionItemsUtils = new ActionItems();

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