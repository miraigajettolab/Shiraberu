
import React from "react";
import ReactDOM from "react-dom";
import App from "./App"
import * as firebase from "firebase"

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAWVGTYP8-pMRGLsP5I7nU5ee99tWaYgdo",
  authDomain: "shirabe-ru.firebaseapp.com",
  databaseURL: "https://shirabe-ru.firebaseio.com",
  projectId: "shirabe-ru",
  storageBucket: "shirabe-ru.appspot.com",
  messagingSenderId: "442007698056",
  appId: "1:442007698056:web:6900952556a893896a3d3d",
  measurementId: "G-PBKVTFYS03"
};

firebase.initializeApp(firebaseConfig)

ReactDOM.render(<App />, document.getElementById("root"));