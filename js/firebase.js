let user;
let userUid = null;

// Initializing firebase with config
firebase.initializeApp(firebaseConfig);
// let db = firebase.firestore().collection("actionItems");

let dumpDB = firebase.firestore();

let provider = new firebase.auth.GoogleAuthProvider();

//storage.clear();
const setUsersName = (userName) => {
    document.querySelector(".greeting__name").innerText = userName;
}

const showSignInItems = (userInfo) => {
    if (userInfo) {
        getTime(new Date());
        userProfileImage = userInfo.photoURL;
        document.querySelector(".profile_image").style.backgroundImage = `url(${userProfileImage})`;
        createQuickActionListener();
        createNameDialogListner();
        createUpdateNameListener()
        let inputTextArea = document.querySelector("#addItemForm");
        inputTextArea.style.display = "block";
        inputTextArea.style.opacity = 1;


        chrome.storage.sync.get(["actionItems", "name"], (data) => {
            let fName;
            if (data.name) {
                fName = data.name
                setUsersName(fName)
                document.querySelector("#inputName").placeholder = fName;
            } else {
                fName = userInfo.displayName.split(" ")[0];
                setUsersName(fName)
                document.querySelector("#inputName").placeholder = fName;
            }
        })

        dumpDB.collection(userUid).orderBy("added")
            .onSnapshot((snapshot) => {
                let changes = snapshot.docChanges();
                changes.forEach((change) => {
                    actionItemsUtils.setProgress();
                    if (change.type == "added") {
                        renderActionItems(change.doc.data())
                    } else if (change.type == "removed") {
                        let id = change.doc.data().id;
                        let jEle = $(`div[id="${id}"]`);
                        animateDeleteItem(jEle);
                    }
                })

            })
    }
}

const showSignOffItems = () => {
    chrome.storage.sync.get(["actionItems", "name"], (data) => {
        getTime(new Date());
        let items = data.actionItems;
        createQuickActionListener();
        if (items) {
            renderActionItems(items)
        }
        actionItemsUtils.setProgress();
        chrome.storage.onChanged.addListener(() => {
            actionItemsUtils.setProgress();
        });
    })
}

const logIn = () => {
    firebase.auth()
        .signInWithPopup(provider)
        .then((userInfo) => {
            showSignInItems(userInfo);
            user = userInfo;
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
    firebase.auth().onAuthStateChanged((userInfo) => {
        if (userInfo) {
            userUid = userInfo.uid;
            user = userInfo;
            showSignInItems(user);
            document.querySelector("#signOff").addEventListener("click", signOff)
        } else {
            userUid = null;
            user = null;
            showSignOffItems();
            setUsersName("Sign In");
            document.querySelector(".greeting__title").addEventListener("click", logIn)
        }
    })
}

isSignInSignOut();