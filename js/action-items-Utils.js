class ActionItems {

    saveName(name, callback) {
        storage.set({
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
        storage.get(["actionItems"], (data) => {
            let items = data.actionItems;
            if (!items) {
                items = [actionItem]
            } else {
                items.push(actionItem)
            }
            storage.set({
                actionItems: items
            }, () => {
                callback(actionItem)
            });
        });
    }

    remove = (id, callback) => {
        storage.get(["actionItems"], (data) => {
            let items = data.actionItems;
            let foundItemIndex = items.findIndex((item) => item.id == id);
            if (foundItemIndex >= 0) {
                items.splice(foundItemIndex, 1)
                storage.set({
                    actionItems: items
                }, callback)
            }
        })
    }

    markUnmarkCompleted(id, completedStatus) {
        storage.get(["actionItems"], (data) => {
            let items = data.actionItems;
            let foundItemIndex = items.findIndex((item) => item.id == id);

            if (foundItemIndex >= 0) {
                items[foundItemIndex].completed = completedStatus;
                storage.set({
                    actionItems: items
                })
            }
        })
    }

    setProgress = () => {
        storage.get(["actionItems"], (data) => {
            let items = data.actionItems;
            let completedItems;
            completedItems = items.filter(item => item.completed)
            let progress = 0;
            progress = completedItems.length / items.length;
            this.setBrowserBadge(items.length - completedItems.length);
            circle.animate(progress); // Number from 0.0 to 1.0    
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