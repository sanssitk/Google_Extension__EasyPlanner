let addItemForm = document.querySelector("#addItemForm");
let itemsList = document.querySelector(".actionItem_items");

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
        id: 1,
        added: new Date().toString(),
        text: text,
        completed: null,
    }


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
            chrome.storage.sync.get(["actionItems"], data => {
                console.log(data)
            })
        });
    });

}

const renderActionItem = (text) => {

    let element = document.createElement("div");
    element.classList.add("actionItem_container");
    let item = document.createElement("div");
    item.classList.add("actionItem_item");
    let checkBox = document.createElement("div");
    checkBox.classList.add("action_item_checkBox");
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

    element.appendChild(item);
    item.appendChild(checkBox);
    item.appendChild(content);
    item.appendChild(itemDelete);
    element.appendChild(shortLink);



}

const deleteList = (e) => {
    console.log(e)
}