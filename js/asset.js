const firebaseConfig = {
    apiKey: "AIzaSyBZ8Cb3b0rIUP6Sun95kw3OafQietso2PU",
  authDomain: "unitehconseil.firebaseapp.com",
  databaseURL: "https://unitehconseil-default-rtdb.firebaseio.com",
  projectId: "unitehconseil",
  storageBucket: "unitehconseil.appspot.com",
  messagingSenderId: "344894635493",
  appId: "1:344894635493:web:d003f5abc88a5e23c3030c",
  measurementId: "G-M2XBSDLFQZ"
    };

firebase.initializeApp(firebaseConfig);
const database = firebase.database();