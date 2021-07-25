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
        greetingImg = "https://img.icons8.com/officel/40/000000/morning.png";
        greetingMsg = "Good Morning,"
    } else if (hrs >= 12 && hrs <= 16) {
        greetingImg = "https://img.icons8.com/officel/40/000000/afternoon.png";
        greetingMsg = "Good Afternoon,"
    } else if (hrs >= 16 && hrs <= 20) {
        greetingImg = "https://img.icons8.com/officel/16/000000/evening.png";
        greetingMsg = "Good Evening,"
    } else {
        greetingImg = "https://img.icons8.com/color/48/000000/partly-cloudy-night.png";
        greetingMsg = "Good Night,"
    }
    hrs = hrs % 12;
    hrs = hrs ? hrs : 12;
    var minitues = () => {
        if (min < 9) return "0" + min;
        else return min;
    }

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    let shiftContiner = `   
    
                    
                  

        <div class="info_container_time">            
            <img id="greeting__image" src="${greetingImg}" />           
            <span>${hrs}:${minitues()} ${ampm}</span>
        </div>      
        <span class="info_container_date"><strong>${days[day]}</strong> ${monthNames[month]} ${todayDate}</span>
        `
    document.querySelector(".greeting__type").innerText = greetingMsg;
    document.querySelector(".info_container").innerHTML = shiftContiner;
}

{
    /* <div class="info_container_time">
                <img id="greeting__image" src="${greetingImg}" />           
                <span>${hrs}:${minitues()} ${ampm}</span>
            </div>
            <h2 class="info_container_day">${days[day]}</h2>
            <span class="info_container_date">${monthNames[month]} ${todayDate}</span> */
}