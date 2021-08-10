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

    saveButton(fTag, dataTag, callback) {
        let initialButton = {
            fTag: fTag,
            dataTag: dataTag
        }
        chrome.storage.sync.get(["initialButtons"], (data) => {
            let buttons = data.initialButtons;
            if (!buttons) {
                buttons = [initialButton]
            } else {
                console.log("Yes", buttons)
                buttons.map((button) => {
                        button.fTag.replace(button.fTag, fTag)
                        button.dataTag.replace(button.dataTag, dataTag)
                    }) 
            }
            chrome.storage.sync.set({
                initialButtons: buttons
            }, () => {
                callback(initialButton)
            });
        });

        // chrome.storage.sync.get(["initialButtons"], (data) => {
        //         let buttons = data.initialButtons;
        //         if (!buttons){                    
        //             buttons = [initialButton]                    
        //         } else {
        //             console.log("Yes", buttons)
        //             buttons.map((button) => {
        //                 button.fTag.replace(button.fTag, fTag)
        //                 button.dataTag.replace(button.dataTag, dataTag)
        //             }) 
        //         }
        //         chrome.storage.sync.set({
        //             initialButtons: buttons
        //         });
        //     });
    }

    getButton = () => {
        chrome.storage.sync.get(["actionItems"], (data) => {
            let buttons = data.initialButtons;
            console.log(data.initialButtons)
        })
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
                    console.error("Error removing document: ", error);
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
        const currentDate = new Date().toDateString();
        if (userUid) {
            dumpDB.collection(userUid).get()
                .then((collections) => {
                    let totalItems = collections.size;                    
                    dumpDB.collection(userUid)
                        .where("completed", "!=", null)
                        .where("completed", ">=", currentDate)
                        .where("completed", "<=", currentDate + "\uf8ff")                        
                        .get()
                        .then((com) => {
                            let completedItems = com.size; 
                            totalItems = totalItems - completedItems;                   
                            if (totalItems > 0) {                                
                                let progress = completedItems / totalItems;
                                this.setBrowserBadge(totalItems - completedItems);
                                if (typeof window.circle !== "undefined") circle.animate(progress)
                            }
                        })
                })

        } else if (!userUid) {
            chrome.storage.sync.get(["actionItems"], (data) => {
                let items = data.actionItems;
                let completedItems;
                completedItems = items?.filter(item => item.completed)
                let progress = 0;
                if (items?.length > 0) {
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