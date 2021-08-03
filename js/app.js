let storage = chrome.storage.sync;
let addItemForm = document.querySelector("#addItemForm");
let itemsList = document.querySelector(".actionItem_items");

let actionItemsUtils = new ActionItems();

const filterActionItem = (actionItems) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    if (userUid) {
        const filteredItems = actionItems.actionItem.filter((item) => {
            if (item.completed) {
                const completedDate = new Date(item.completed)
                if (completedDate < currentDate) {
                    return false;
                }
            }
            return true;
        })
        return filteredItems;
    } else {
        const filteredItems = actionItems.filter((item) => {
            if (item.completed) {
                const completedDate = new Date(item.completed)
                if (completedDate < currentDate) {
                    return false;
                }
            }
            return true;
        })
        return filteredItems;
    }
}

const renderActionItems = (items) => {
    const filtedItems = filterActionItem(items)
    filtedItems.map(item => {
        renderActionItem(item.text, item.id, item.completed, item.website)
    })
}

const createNameDialogListner = () => {
    let greetingTitle = document.querySelector(".greeting__title");
    greetingTitle.addEventListener("click", () => {
        //open the modal
        $('#updateNameModal').modal('show')
    })
}

const createUpdateNameListener = () => {
    let input = document.querySelector(".saveInput");
    input.addEventListener("click", handleUpdateName)
}

const handleUpdateName = () => {
    let inputText = document.querySelector("#inputName").value;
    if (inputText) {
        // save the name
        actionItemsUtils.saveName(inputText, () => {
            setUsersName(inputText);
            $('#updateNameModal').modal('hide')
        })
    }
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
            renderActionItem(actionItem.text, actionItem.id, actionItem.completed, actionItem.website, 200)
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
            renderActionItem(actionItem.text, actionItem.id, actionItem.completed, actionItem.website, 200)
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
        let jEle = $(`div[id="${parentEle.id}"]`);
        actionItemsUtils.remove(parentEle.id, () => {
            animateDeleteItem(jEle);
        });
    }
}

const renderActionItem = (text, id, completed, website = null, duration = 300) => {
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

    document.querySelector(".actionItem_items").prepend(element);
    let jEle = $(`div[id="${id}"]`);
    animateAddItems(jEle, duration);
}

const animateAddItems = (jEle, duration) => {
    jEle.css({
        marginTop: `-46px`,
        opacity: 0
    }).animate({
        opacity: 1,
        marginTop: "0px",
    }, duration)
}

const animateDeleteItem = (jEle) => {
    jEle.animate({
        marginLeft: "1000px",
        opacity: "0",
    }, 450, () => {
        jEle.remove();
    })
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