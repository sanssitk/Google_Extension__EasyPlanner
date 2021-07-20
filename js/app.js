let storage = chrome.storage.sync;
let addItemForm = document.querySelector("#addItemForm");
let itemsList = document.querySelector(".actionItem_items");

let actionItemsUtils = new ActionItems();


// let timeContainer = document.querySelector(".info_container_time");
// let timeBlock = timeContainer.createElement("span");
// timeContainer.appendChild()

const getTime = () => {
    let date = new Date();
    let hrs = date.getHours();
    let min = date.getMinutes();
    let day = date.getDay();
    let month = date.getMonth();
    let today = date.getDate();
    let ampm = hrs >= 12 ? "pm" : "am";
    hrs = hrs % 12;
    hrs = hrs ? hrs : 12;
    let timeCont = document.querySelector(".info_container_time");
    var minitues = () => {
        if (min < 9) return "0" + min;
        else return min;
    }
    var time = `${hrs}:${minitues()} ${ampm}`
    timeCont.append(time)
    const days = ["Sunday", "Monday", "Tuesday", "WednesDay", "Thursday", "Friday", "Saturday"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    dayName = days[day]
    monthName = monthNames[month]
    document.querySelector(".info_container_day").innerText = dayName;
    document.querySelector(".info_container_date").innerText = monthName + " " + today;
    return timeCont;
}

//storage.clear();
storage.get(["actionItems"], (data) => {
    getTime();
    let items = data.actionItems;
    createQuickActionListener();
    renderActionItems(items)
    actionItemsUtils.setProgress();
    chrome.storage.onChanged.addListener(() => {
        actionItemsUtils.setProgress();
    });
})

const renderActionItems = (items) => {
    items.map(item => {
        renderActionItem(item.text, item.id, item.completed, item.website)
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

const handleQuickActionListener = (e) => {
    const text = e.target.getAttribute("data-text");
    const id = e.target.getAttribute("data-id");

    getCurrentTabl().then((tab) => {
        actionItemsUtils.addQuickActionItem(id, text, tab, (actionItem) => {
            renderActionItem(actionItem.text, actionItem.id, actionItem.completed, actionItem.website)
        })
    })
}

const createQuickActionListener = () => {
    let buttons = document.querySelectorAll(".quickButton")
    buttons.forEach((button) => {
        button.addEventListener("click", handleQuickActionListener)
    })
}

addItemForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let itemText = addItemForm.elements.namedItem("itemText").value;
    if (itemText) {
        actionItemsUtils.add(itemText, null, (actionItem) => {
            renderActionItem(actionItem.text, actionItem.id, actionItem.completed, actionItem.website)
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

const renderActionItem = (text, id, completed, website = null) => {
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
    checkBox.innerHTML = `<i class="fas fa-check"></i>`
    content.textContent = text;
    itemDelete.innerHTML = `<i class="fas fa-times"></i>`
    if (completed) element.classList.toggle("completed");

    item.appendChild(checkBox);
    item.appendChild(content);
    item.appendChild(itemDelete);
    element.setAttribute("id", id)
    element.appendChild(item);

    if (website) {
        let linkContainer = createLinkContainer(website.url, website.fav_icon, website.title);
        element.appendChild(linkContainer);
    }

    document.querySelector(".actionItem_items").prepend(element)
}

const createLinkContainer = (url, fav_icon, title) => {
    let mainLinkEle = document.createElement("div");
    mainLinkEle.classList.add("actionItem_shortLink");
    mainLinkEle.innerHTML = `
        <a href="${url}" target="_blank">
            <div class="actionItem_favIcon">
                <img src="${fav_icon}" alt="">
            </div>
            <div class="actionItem_title">
                <span>${title}</span>
            </div>
        </a> `
    return mainLinkEle;
}