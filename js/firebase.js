const firebaseConfig = {
    apiKey: "AIzaSyB7vK6OzqkJqREIE6HVqQv02D2byocsC0I",
    authDomain: "chrome-todolist-ext.firebaseapp.com",
    projectId: "chrome-todolist-ext",
    storageBucket: "chrome-todolist-ext.appspot.com",
    messagingSenderId: "872114912505",
    appId: "1:872114912505:web:1837b5ffd688dbe755f628"
};

// Initializing firebase with config
firebase.initializeApp(firebaseConfig);

let provider = new firebase.auth.GoogleAuthProvider();

const signIn = () => {
    firebase.auth().signInWithPopup(provider).then((result) => {
        // The signed-in user info.
        var user = result.user;
        chrome.runtime.sendMessage({
            message: "user_signed_in"
        }, (res) => {
            if (res.message == "success" && res.payload) {
                storage.get(["actionItems", "name"], (data) => {
                    getTime(new Date());
                    let items = data.actionItems;
                    let name = result.user.displayName;
                    createQuickActionListener();
                    renderActionItems(items);
                    actionItemsUtils.setProgress();
                    chrome.storage.onChanged.addListener(() => {
                        actionItemsUtils.setProgress();
                    });
                })
            }
        })
    })

}

const signOff = () => {
    chrome.runtime.sendMessage({
        message: "user_signed_off"
    }, (res) => {
        if (res.message == "success") {
            storage.get(["actionItems", "name"], (data) => {
                getTime(new Date());
                let items = data.actionItems;
                let name = data.name;
                setUsersName(name)
                createQuickActionListener();
                renderActionItems(items);
                actionItemsUtils.setProgress();
                chrome.storage.onChanged.addListener(() => {
                    actionItemsUtils.setProgress();
                });

            })
        }
    })
}

const setUsersName = (userName) => {
    USERNAME = userName ? userName : "Sign In";
    document.querySelector(".greeting__name").innerText = USERNAME;
}

let greetingTitle = document.querySelector(".greeting__title");
greetingTitle.addEventListener("click", () => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            userFName = user.displayName.split(" ")[0];
            userProfileImage = user.photoURL;
            document.querySelector(".profile_image").style.backgroundImage = `url(${userProfileImage})`;
            setUsersName(userFName);
            createNameDialogListner();
            createUpdateNameListener();
            let inputTextArea = document.querySelector("#addItemForm");
            inputTextArea.style.display = "block";
            inputTextArea.style.opacity = 1;
        } else {
            signIn();
        }
    })
})

signOff();