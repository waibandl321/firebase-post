 // Your web app's Firebase configuration
(() => {
        const firebaseConfig = {
            apiKey: "AIzaSyCOF-SP4LUT3E7qvGXB8ktue6mbCriz8Ao",
            authDomain: "myfirebasechatapp-f3aa4.firebaseapp.com",
            databaseURL: "https://myfirebasechatapp-f3aa4.firebaseio.com",
            projectId: "myfirebasechatapp-f3aa4",
            storageBucket: "myfirebasechatapp-f3aa4.appspot.com",
            messagingSenderId: "470139298438",
            appId: "1:470139298438:web:36bd7c12ba41df482f2707",
            measurementId: "G-H2Y1EF043D"
        };
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);

        const db = firebase.firestore();
        const collection = db.collection('messages');

        const auth = firebase.auth();
        let me = null;

        const message = document.getElementById('message');
        const form = document.querySelector('form');
        const messages = document.getElementById('messages');
        const login = document.getElementById('login');
        const logout = document.getElementById('logout');

        

        login.addEventListener('click', () => {
            auth.signInAnonymously();
        })
        logout.addEventListener('click', () => {
            auth.signOut();
        })

        auth.onAuthStateChanged(user => {
            if(user) {
                me = user;

                while(messages.firstChild) {
                    messages.removeChild(messages.firstChild);
                }

                collection.orderBy('created').onSnapshot(snapshot => {
                    snapshot.docChanges().forEach(change => {
                        if(change.type === 'added') {
                        const li = document.createElement('li');
                        const d = change.doc.data();
                        li.textContent = d.uid.substr(0, 8) + ' : ' + d.message;
                        messages.appendChild(li);
                        }
                    })
                }, error => {});
                console.log(`Logged in as : ${user.uid}`);
                login.classList.add('hidden');
                [logout, form, messages].forEach(el => {
                    el.classList.remove('hidden');
                })
                message.focus();
                return
            }
            me = null;
            console.log('Nobady is logged in!');
            logout.classList.add('hidden');
            [login, form, messages].forEach(el => {
                el.classList.remove('hidden');
            })
        });

        form.addEventListener('submit', e => {
            e.preventDefault();

            const val = message.value.trim();
            if(val === "") {
                return;
            }


            message.value = '';
            

                collection.add({
                    message: val,
                    created: firebase.firestore.FieldValue.serverTimestamp(),
                    uid: me ? me.uid : 'nobody!'
                })
                .then(doc => {
                    console.log(`${doc.id}  added!`);
                
                })
                .catch(error => {
                    console.log('document add error');
                    console.log(error);
                })
        })
        message.focus();
    })();
