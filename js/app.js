let addItemForm = document.querySelector("#addItemForm");
let itemsList = document.querySelector(".actionItem_items");
let storage = chrome.storage.sync;

//storage.clear();
storage.get(["actionItems"], (data) => {
    let items = data.actionItems;
    renderActionItems(items)
})

const renderActionItems = (items) => {
    items.map(item => {
        renderActionItem(item.text, item.id, item.completed)
    })
}

addItemForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let itemText = addItemForm.elements.namedItem("itemText").value;
    if (itemText) {
        add(itemText);
        renderActionItem(itemText);
        addItemForm.elements.namedItem("itemText").value = "";
    }
})

const add = (text) => {
    let actionItem = {
        id: uuidv4(),
        added: new Date().toString(),
        text: text,
        completed: null,
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
        });
    });
}

const markUnmarkCompleted = (id, completedStatus) => {
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

const handelCheckBoxClicked = (e) => {
    const parentEle = e.target.parentElement.parentElement;
    if (parentEle.classList.contains("completed")) {
        parentEle.classList.remove("completed")
        markUnmarkCompleted(parentEle.id, null)
    } else {
        parentEle.classList.add("completed");
        markUnmarkCompleted(parentEle.id, new Date().toString())
    }
}

const renderActionItem = (text, id, completed) => {
    let element = document.createElement("div");
    element.classList.add("actionItem_container");
    let item = document.createElement("div");
    item.classList.add("actionItem_item");
    let checkBox = document.createElement("div");
    checkBox.classList.add("action_item_checkBox");
    checkBox.addEventListener("click", handelCheckBoxClicked)
    let content = document.createElement("div");
    content.classList.add("action_item_content");
    let itemDelete = document.createElement("div");
    itemDelete.classList.add("action_item_delete");
    let shortLink = document.createElement("div");
    shortLink.classList.add("actionItem_shortLink");
    checkBox.innerHTML = `<i class="fas fa-check"></i>`
    content.textContent = text;
    itemDelete.innerHTML = `<i class="fas fa-times"></i>`
    shortLink.innerHTML = `<a href="">Four useFull JavaScript shorthands..</a>`
    if (completed) element.classList.toggle("completed");
    element.setAttribute("id", id)
    element.appendChild(item);
    item.appendChild(checkBox);
    item.appendChild(content);
    item.appendChild(itemDelete);
    element.appendChild(shortLink);
    document.querySelector(".actionItem_items").prepend(element)
}