let darkMode = localStorage.getItem("darkMode");
const checkbox = document.querySelector("#checkbox");

const enableDarkMode = () => {
    document.body.classList.add("darkmode");
    localStorage.setItem("darkMode", "enabled");
}

const disableDarkMode = () => {
    document.body.classList.remove("darkmode");
    localStorage.setItem("darkMode", null)
}

if (darkMode == "enabled") {
    enableDarkMode();
}

checkbox.addEventListener("change", () => {
    // change theme    
    darkMode = localStorage.getItem("darkMode")
    if (darkMode !== "enabled") {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
})