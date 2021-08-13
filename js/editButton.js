let actionItemsUtils = new ActionItems();

const hideUpdateModal = () => {
    let hideEle = document.querySelector(".buttonName");
    while (hideEle.firstChild) {
        hideEle.removeChild(hideEle.firstChild)
    }
    $('#updateButtonModal').modal('hide')
}

const handleButtonSaveClick = (e) => {
    e.preventDefault();
    let buttonMain = document.querySelectorAll(".editButtonMain");
    buttonMain.forEach((values, index) => {
        let fTag = values.firstElementChild.value
        let dataTag = values.lastElementChild.value
        if (fTag && dataTag) {
            actionItemsUtils.saveButton(fTag, dataTag, index);
            renderButtonItem(fTag, dataTag, index)
            createQuickActionListener()
        }
    })
    hideUpdateModal()
}

const showEditableButtonName = (buttonInfo, dataText) => {
    let buttonText = buttonInfo.outerText;
    console.log(buttonText, dataText)
    let btnEle = `
        <div class= "editButtonMain">
        <input type="text" class="form-control buttonList-control" id="inputName2" placeholder="${buttonText}">
        <input type="text" class="form-control buttonList-control" id="dataText" placeholder="${dataText}">
        </div>        
    `
    document.querySelector(".buttonName").innerHTML += btnEle;
    document.querySelector(".saveInput2").addEventListener("click", handleButtonSaveClick)
    let closeOrSave = document.querySelectorAll("#editButton");
    closeOrSave.forEach((ele) => {
        ele.addEventListener("click", hideUpdateModal)
    })
}

const editButtonClick = () => {
    let buttons = document.querySelectorAll(".quickButton")
    buttons.forEach((button) => {
        const id = button.getAttribute("data-id");
        const dataText = button.getAttribute("data-text")
        if (id != "quickLink3") {
            showEditableButtonName(button, dataText)
        }
    })
}

document.querySelector(".editButton").addEventListener("click", () => {
    $('#updateButtonModal').modal('show')
    editButtonClick()
})

const renderButtonItem = (fTag, dataTag, index) => {
    let ele = document.createElement("button");
    ele.classList.add("quickButton")
    ele.classList.add("btn")
    ele.classList.add("btn-outline-primary")

    if (index == 0) {
        ele.setAttribute("data-id", "quickLink1")
        ele.setAttribute("data-text", dataTag)
        ele.innerHTML = `<i class="fas fa-plus"></i> ${fTag}`
        let oldEle = $("button[data-id='quickLink1']");
        oldEle.length > 0 ? oldEle.replaceWith(ele) : document.querySelector(".actionInput_shortLink").prepend(ele);
    } else if (index == 1) {
        ele.setAttribute("data-id", "quickLink2")
        ele.setAttribute("data-text", dataTag)
        ele.innerHTML = `<i class="fas fa-plus"></i> ${fTag}`
        let oldEle = $("button[data-id='quickLink2']");
        oldEle.length > 0 ? oldEle.replaceWith(ele) : document.querySelector(".actionInput_shortLink").prepend(ele);
    }
}