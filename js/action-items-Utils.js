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

    add(text, website = null, callback) {
        let actionItem = {
            id: uuidv4(),
            added: new Date().toString(),
            text: text,
            completed: null,
            website: website
        }
        if (userUid) {
            db.doc(userUid).get().then(doc => {
                    let items = doc.data();
                    if (!items) {
                        items = [actionItem]
                        db.doc(userUid).set({
                            actionItem: items
                        })
                    } else {
                        db.doc(userUid).update({
                            actionItem: firebase.firestore.FieldValue.arrayUnion(actionItem)
                        })
                    }
                })
                .then(() => callback(actionItem))
                .catch((error) => {
                    console.log("Error getting document:", error);
                });
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
        // Atomically remove a region from the "regions"array field.
        if (userUid) {
            let item = db.where("doc", "==", userUid).where("id", "==", id);
            console.log(item.data())
            // db.doc(userUid).update({
            //         actionItem: firebase.firestore.FieldValue.arrayRemove(item)
            //     })
            //     .then(() => callback);
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

    setProgress = () => {
        chrome.storage.sync.get(["actionItems"], (data) => {
            let items = data.actionItems;
            let completedItems;
            completedItems = items.filter(item => item.completed)
            let progress = 0;
            if (items.length > 0) {
                progress = completedItems.length / items.length;
            }
            this.setBrowserBadge(items.length - completedItems.length);
            if (typeof window.circle !== "undefined") circle.animate(progress); // Number from 0.0 to 1.0    
        })
    }

    setBrowserBadge(todoItems) {
        let text = `${todoItems}`;
        if (todoItems > 9) text = "9+"
        chrome.browserAction.setBadgeText({
            text: text
        })
    }

}