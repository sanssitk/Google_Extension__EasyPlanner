let addItemForm = document.querySelector("#addItemForm");
console.log(addItemForm)

addItemForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let itemText = addItemForm.elements.namedItem("itemText").value;
    renderActionItem(itemText);
})

const renderActionItem = (text) => {
    let actionItem_items = [];

    `<div class="actionItem_container">
                        <div class="actionItem_item">
                            <div class="action_item_checkBox">
                                <i class="fas fa-check"></i>
                            </div>
                            <div class="action_item_content">
                                read book
                            </div>
                            <i class="fas fa-times"></i>
                        </div>
                        <div class="actionItem_shortLink">
                            <a href="">
                                Four useFull JavaScript shorthands..
                            </a>
                        </div>
                    </div>`

}



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
        width: 5
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

circle.animate(1.0); // Number from 0.0 to 1.0