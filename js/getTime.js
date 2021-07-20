const getTime = (date) => {
    let hrs = date.getHours();
    let min = date.getMinutes();
    let day = date.getDay();
    let month = date.getMonth();
    let todayDate = date.getDate();
    let ampm = hrs >= 12 ? "pm" : "am";
    let greetingImg;
    let greetingMsg;
    if (hrs <= 11) {
        greetingImg = "images/GoodMorning.png";
        greetingMsg = "Good Morning"
    } else if (hrs >= 12 && hrs <= 19) {
        greetingImg = "images/GoodAfternoon.png";
        greetingMsg = "Good Afternoon"
    } else {
        greetingImg = "images/goodnight.png";
        greetingMsg = "Good Evening"
    }
    hrs = hrs % 12;
    hrs = hrs ? hrs : 12;
    var minitues = () => {
        if (min < 9) return "0" + min;
        else return min;
    }
    const days = ["Sunday", "Monday", "Tuesday", "WednesDay", "Thursday", "Friday", "Saturday"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    let shiftContiner = `
        <div class="info_container_time">
            <img id="greeting__image" src="${greetingImg}" />
            <span>${hrs}:${minitues()} ${ampm}</span>
        </div>
        <h2 class="info_container_day">${days[day]}</h2>
        <span class="info_container_date">${monthNames[month]} ${todayDate}</span>
        `
    document.querySelector(".greeting__type").innerText = greetingMsg;
    document.querySelector(".info_container").innerHTML = shiftContiner;
}