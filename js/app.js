let storage = chrome.storage.sync;
let addItemForm = document.querySelector("#addItemForm");
let itemsList = document.querySelector(".actionItem_items");

let actionItemsUtils = new ActionItems();

//storage.clear();
storage.get(["actionItems"], (data) => {
    let items = data.actionItems;
    console.log(items)
    createQuickActionListener();
    renderActionItems(items)
    chrome.storage.onChanged.addListener(() => {
        actionItemsUtils.setProgress();
    });
})

const renderActionItems = (items) => {
    items.map(item => {
        renderActionItem(item.text, item.id, item.completed)
    })
}
const handleQuickActionListener = (e) => {
    const text = e.target.getAttribute("data-text");
    const id = e.target.getAttribute("data-id");

    getCurrentTabl().then((tab) => {
        actionItemsUtils.addQuickActionItem(id, text, tab, (actionItem) => {
            renderActionItem(actionItem.text, actionItem.id, actionItem.completed)
        })
    })
    // actionItemsUtils.add(text, (actionItem) => {
    //     renderActionItem(actionItem.text, actionItem.id, actionItem.completed)
    // });

}

const createQuickActionListener = () => {
    let buttons = document.querySelectorAll(".quickButton")
    buttons.forEach((button) => {
        button.addEventListener("click", handleQuickActionListener)
    })
}

async function getCurrentTabl() {
    return await new Promise((resolve, reject) => {
        queryOptions = {
            active: true,
            windowId: chrome.windows.WINDOW_ID_CURRENT
        };
        chrome.tabs.query(queryOptions, (tab) => {
            resolve(tab[0])
        })
    })
}

addItemForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let itemText = addItemForm.elements.namedItem("itemText").value;
    if (itemText) {
        actionItemsUtils.add(itemText, null, (actionItem) => {
            renderActionItem(actionItem.text, actionItem.id, actionItem.completed)
            addItemForm.elements.namedItem("itemText").value = "";
        });
    }
})

const handelCheckBoxClicked = (e) => {
    const parentEle = e.target.parentElement.parentElement;
    if (parentEle.classList.contains("completed")) {
        parentEle.classList.remove("completed")
        actionItemsUtils.markUnmarkCompleted(parentEle.id, null)
    } else {
        parentEle.classList.add("completed");
        actionItemsUtils.markUnmarkCompleted(parentEle.id, new Date().toString())
    }
}

const handelDeleteClicked = (e) => {
    const parentEle = e.target.parentElement.parentElement;
    if (parentEle.id) {
        actionItemsUtils.remove(parentEle.id, () => {
            parentEle.remove();
        });
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
    itemDelete.addEventListener("click", handelDeleteClicked)
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