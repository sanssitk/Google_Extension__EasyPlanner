class ActionItems {

    saveName(name, callback) {
        chrome.storage.sync.set({
            name: name,
        }, callback)
    }

    addQuickActionItem(id, text, tab, callback) {
        let website = null;
        if (id == "quickLink3") {
            website = {
                url: tab.url,
                fav_icon: tab.favIconUrl,
                title: tab.title
            }
        }
        this.add(text, website, callback)
    }

    saveButton(fTag, dataTag, index) {
        let initialButton = [{
            fTag: fTag,
            dataTag: dataTag
        }]
        chrome.storage.sync.get(["initialButtons"], (data) => {
            let buttons = data.initialButtons;
            if (!buttons) {
                buttons = initialButton
            } else {
                if (index == 0) {
                    buttons[0].fTag = fTag;
                    buttons[0].dataTag = dataTag;
                } else if (index == 1) {
                    buttons[1].fTag = fTag;
                    buttons[1].dataTag = dataTag;
                }
            }
            chrome.storage.sync.set({
                initialButtons: buttons
            });
        });
    }

    add(text, website = null, callback) {
        let actionItem = {
            id: uuidv4(),
            added: new Date().toString(),
            text: text,
            completed: null,
            website: website
        }
        if (userUid) {
            dumpDB.collection(userUid).doc(actionItem.id)
                .set(actionItem)
        } else {
            chrome.storage.sync.get(["actionItems"], (data) => {
                let items = data.actionItems;
                if (!items) {
                    items = [actionItem]
                } else {
                    items.push(actionItem)
                }
                chrome.storage.sync.set({
                    actionItems: items
                }, () => {
                    callback(actionItem)
                });
            });
        }
    }

    remove = (id, callback) => {
        if (userUid) {
            dumpDB.collection(userUid).doc(id)
                .delete()
                .catch((error) => {
                    throw error
                });
        } else {
            chrome.storage.sync.get(["actionItems"], (data) => {
                let items = data.actionItems;
                let foundItemIndex = items.findIndex((item) => item.id == id);
                if (foundItemIndex >= 0) {
                    items.splice(foundItemIndex, 1)
                    chrome.storage.sync.set({
                        actionItems: items
                    }, callback)
                }
            })
        }
    }

    markUnmarkCompleted(id, completedStatus) {
        if (userUid) {
            dumpDB.collection(userUid).doc(id).update({
                completed: completedStatus
            })
        } else {
            chrome.storage.sync.get(["actionItems"], (data) => {
                let items = data.actionItems;
                let foundItemIndex = items.findIndex((item) => item.id == id);

                if (foundItemIndex >= 0) {
                    items[foundItemIndex].completed = completedStatus;
                    chrome.storage.sync.set({
                        actionItems: items
                    })
                }
            })
        }

    }

    setProgress = () => {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        if (userUid) {
            dumpDB.collection(userUid).get()
                .then((collections) => {
                    let totalItems = [];
                    let completedItems = [];
                    collections.forEach((collection) => {
                        let itemCompletedDate = new Date(collection.data().completed);
                        if (itemCompletedDate > currentDate || collection.data().completed == null) {
                            totalItems.push(itemCompletedDate)
                        }
                        if (itemCompletedDate > currentDate && collection.data().completed !== null) {
                            completedItems.push(itemCompletedDate)
                        }
                    })
                    if (totalItems.length > 0) {
                        let progress = completedItems.length / totalItems.length;
                        this.setBrowserBadge(totalItems.length - completedItems.length);
                        if (typeof window.circle !== "undefined") circle.animate(progress)
                    }
                })

        } else if (!userUid) {
            chrome.storage.sync.get(["actionItems"], (data) => {
                let items = data.actionItems;
                let completedItems;
                completedItems = items?.filter(item => item.completed)
                let progress = 0;
                if (items ?.length > 0) {
                    progress = completedItems.length / items.length;
                }
                this.setBrowserBadge(items?.length - completedItems?.length);
                if (typeof window.circle !== "undefined") circle.animate(progress); // Number from 0.0 to 1.0    
            })
        }
    }

    setBrowserBadge(todoItems) {
        let text = `${todoItems}`;
        if (todoItems > 9) text = "9+"
        chrome.browserAction.setBadgeText({
            text: text
        })
    }

}