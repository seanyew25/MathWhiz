import { createApp } from "vue";
// import "./style.css";
import App from "./App.vue"; //can write as import App from "@/App.vue", the @ directs to source directory (for vue cli) https://www.youtube.com/watch?v=PciUq6HcUNc
// Import our custom CSS
import "./styles.scss";
import "./style.css";
import "nes.css/css/nes.min.css";

// Import all of Bootstrap's JS
import * as bootstrap from "bootstrap";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { createWebHistory, createRouter } from "vue-router";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import GamePage from "./pages/GamePage.vue";
import LandingPage from "./pages/LandingPage.vue";
import ProfilePage from "./pages/profile/ProfilePage.vue";
import Market from "./pages/Market.vue";
import SchoolPage from "./pages/SchoolPage.vue";
import BakeryPage from "./pages/BakeryPage.vue";
import BankPage from "./pages/BankPage.vue";
import StoryPage from "./pages/StoryPage.vue";
import ShopPage from "./pages/ShopPage.vue";
import CatChangingRoom from "./pages/profile/CatChangingRoom.vue";
// import TimerBar from "./pages/Timerbar.vue";
import CharacterChangingRoom from "./pages/profile/CharacterChangingRoom.vue";
import BankCutScene from "./components/bank/BankCutScene.vue";

// import BankPage from "./components/BankPage.vue";
// import FractionGame from "./components/FractionGame.vue";
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
const db = getFirestore(app);

//Initialize Vue Router
const routes = [
  { path: "/game", component: GamePage },
  { path: "/", component: LandingPage },
  { path: "/profile", component: ProfilePage },
  { path: "/market", component: Market },
  { path: "/school", component: SchoolPage },
  { path: "/bakery", component: BakeryPage },
  { path: "/bank", component: BankCutScene },
  { path: "/story", component: StoryPage },
  { path: "/shop", component: ShopPage },
  { path: "/catchangingroom", component: CatChangingRoom },
  // { path: "/timerbar", component: TimerBar },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

createApp(App).use(router).mount("#app");
