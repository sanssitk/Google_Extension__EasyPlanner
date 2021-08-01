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
let db = firebase.firestore();

let provider = new firebase.auth.GoogleAuthProvider();

//storage.clear();

// Upload Data ////////////////////////////////////////////////////////////////////////////////////////////////
// db.collection("items").add({
//     first: "Ada",
//     last: "Lovelace",
//     born: 1815
// })
// .then((docRef) => {
//     console.log("Document written with ID: ", docRef.id);
// })
// .catch((error) => {
//     console.error("Error adding document: ", error);
// });


// Read data ////////////////////////////////////////////////////////////////////////////////////////////////
db.collection("items").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
    });
});

const setUsersName = (userName) => {
    USERNAME = userName ? userName : "Sign In";
    document.querySelector(".greeting__name").innerText = USERNAME;
}

const showSignInItems = (userInfo) => {
    if (userInfo) {
        var uid = userInfo.uid;
        db.collection("actionItems").doc(uid).get().then((datas) => {
            let data = datas.data();
            getTime(new Date());
            let items = data.actionItems;
            let fName = "";
            if (data.name) {
                fName = data.name
            } else {
                fName = userInfo.displayName.split(" ")[0];
            }
            setUsersName(fName)
            userProfileImage = userInfo.photoURL;
            document.querySelector(".profile_image").style.backgroundImage = `url(${userProfileImage})`;
            createQuickActionListener();
            renderActionItems(items);
            createNameDialogListner();
            createUpdateNameListener()
            actionItemsUtils.setProgress();
            chrome.storage.onChanged.addListener(() => {
                actionItemsUtils.setProgress();
            });
            let inputTextArea = document.querySelector("#addItemForm");
            inputTextArea.style.display = "block";
            inputTextArea.style.opacity = 1;
        });
    }

    // db.collection("actionItems").doc(uid).set({
    //         actionItems: actionItem,
    //     }).then((docRef) => {
    //         console.log("Document written with ID: ", docRef.id);
    //     })
    //     .catch((error) => {
    //         console.error("Error adding document: ", error);
    //     });



    // chrome.storage.sync.get(["actionItems", "name"], (data) => {
    //     getTime(new Date());
    //     let items = data.actionItems;
    //     let fName = "";
    //     if (data.name) {
    //         fName = data.name
    //     } else {
    //         fName = userInfo.displayName.split(" ")[0];
    //     }
    //     setUsersName(fName)
    //     userProfileImage = userInfo.photoURL;
    //     document.querySelector(".profile_image").style.backgroundImage = `url(${userProfileImage})`;
    //     createQuickActionListener();
    //     renderActionItems(items);
    //     createNameDialogListner();
    //     createUpdateNameListener()
    //     actionItemsUtils.setProgress();
    //     chrome.storage.onChanged.addListener(() => {
    //         actionItemsUtils.setProgress();
    //     });
    //     let inputTextArea = document.querySelector("#addItemForm");
    //     inputTextArea.style.display = "block";
    //     inputTextArea.style.opacity = 1;
    // })
}

const showSignOffItems = () => {
    chrome.storage.sync.get(["actionItems", "name"], (data) => {
        getTime(new Date());
        let items = data.actionItems;
        createQuickActionListener();
        renderActionItems(items);
        actionItemsUtils.setProgress();
        chrome.storage.onChanged.addListener(() => {
            actionItemsUtils.setProgress();
        });
    })
}

const logIn = () => {
    firebase.auth()
        .signInWithPopup(provider)
        .then((user) => {
            showSignInItems(user);
        }).catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            var credential = error.credential;
        });
}

const signOff = () => {
    firebase.auth().signOut().then(() => {
        $('#updateNameModal').modal('hide')
        document.querySelector(".profile_image").style.backgroundImage = `url("./images/Logo128.png")`;
        let inputTextArea = document.querySelector("#addItemForm");
        inputTextArea.style.display = "hidden";
        inputTextArea.style.opacity = 0;
        showSignOffItems();
        window.close();
    }).catch((error) => {
        console.log(error)
    });
}

const isSignInSignOut = () => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            showSignInItems(user);
            document.querySelector("#signOff").addEventListener("click", signOff)
        } else {
            showSignOffItems();
            setUsersName("Sign In");
            document.querySelector(".greeting__title").addEventListener("click", logIn)
        }
    })
}



isSignInSignOut();