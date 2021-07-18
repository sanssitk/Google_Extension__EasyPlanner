let addItemForm = document.querySelector("#addItemForm");
let itemsList = document.querySelector(".actionItem_items");
let storage = chrome.storage.sync;

//storage.clear();
storage.get(["actionItems"], (data) => {
    let items = data.actionItems;
    renderActionItems(items)
    setProgress();
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
            }, () => {
                setProgress();
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

const setProgress = () => {
    storage.get(["actionItems"], (data) => {
        let items = data.actionItems;
        let completedItems;
        completedItems = items.filter(item => item.completed)
        let progress = 0;
        progress = completedItems.length / items.length;
        circle.animate(progress); // Number from 0.0 to 1.0    
    })
}

//Prgress Bar
var circle = new ProgressBar.Circle("#container", {
    color: '#A252F1',
    // This has to be the same size as the maximum width to
    // prevent clipping
    strokeWidth: 6,
    trailWidth: 2,
    easing: 'easeInOut',
    duration: 1400,
    text: {
        autoStyleContainer: false
    },
    from: {
        color: '#A252F1',
        width: 2
    },
    to: {
        color: '#A252F1',
        width: 6
    },
    // Set default step function for all animate calls
    step: function (state, circle) {
        circle.path.setAttribute('stroke', state.color);
        circle.path.setAttribute('stroke-width', state.width);

        var value = Math.round(circle.value() * 100);
        if (value === 0) {
            circle.setText('');
        } else {
            circle.setText(`${value}%`);
        }

    }
});
circle.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
circle.text.style.fontSize = '1.2rem';

// circle.animate(percentage); // Number from 0.0 to 1.0    