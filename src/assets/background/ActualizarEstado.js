var firebaseConfig = {
  apiKey: "AIzaSyDSHr6DDNOUAnMr-GiiDn7NeAyEt_lxEyY",
  authDomain: "memphis-107c8.firebaseapp.com",
  databaseURL: "https://memphis-107c8.firebaseio.com",
  projectId: "memphis-107c8",
  storageBucket: "memphis-107c8.appspot.com",
  messagingSenderId: "188692032373",
  appId: "1:188692032373:web:877cb8a9ac1f5e2f"
};

// Initialize Firebase
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// var size_of_widget = document.getElementById("idConekta").title;
	var updates = {};
updates['/prueba/'] = size_of_widget;

firebase.database().ref().update(updates);
