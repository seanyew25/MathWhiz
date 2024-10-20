import { createApp } from "vue";
// import "./style.css";
import App from "./App.vue";
// Import our custom CSS
import "./styles.scss";

// Import all of Bootstrap's JS
import * as bootstrap from "bootstrap";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { createWebHistory, createRouter } from "vue-router";
import { getAuth } from "firebase/auth";

import HomePage from "./components/HomePage.vue";
import LandingPage from "./components/LandingPage.vue";
// import AboutView from "./AboutView.vue";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWSTG1AdhZ0xLTb4l5hbsLol9B-IKOuLk",
  authDomain: "mathwhiz-f717a.firebaseapp.com",
  projectId: "mathwhiz-f717a",
  storageBucket: "mathwhiz-f717a.appspot.com",
  messagingSenderId: "610807389572",
  appId: "1:610807389572:web:c7b928a69640b6e6ae91d1",
  measurementId: "G-JL54QQP5QG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Initialize Vue Router
const routes = [
  { path: "/home", component: HomePage },
  { path: "/", component: LandingPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

createApp(App).use(router).mount("#app");
