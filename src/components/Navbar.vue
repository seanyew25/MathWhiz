<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: #fff5cd;
  transition: transform 0.2s ease;
  transform: translateY(0);
  width: 100vw;
}

.navbar.hidden {
  transform: translateY(-100%);
}

.nav-item {
  padding-left: 15px;
}
@media (max-width: 991px) {
  .nav-item.first-item {
    padding-left: 27px !important;
  }
}

.nav-item a {
  position: relative;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.nav-item a:hover {
  transform: scale(1.1);
  color: #ffcfb3;
}

.nav-item a:hover::after,
.nav-item.active a::after {
  content: "";
  position: absolute;
  bottom: -3px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  filter: blur(2px);
  opacity: 0.9;
  transition: opacity 0.5s ease, filter 0.5s ease;
}
.profile-icon:hover {
  animation: bounce 0.5s ease;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}
</style>
<template>
  <nav
    class="navbar navbar-expand-lg"
    style="
      background-color: rgba(255, 245, 205, 1);
      padding-left: 5%;
      padding-right: 5%;
      border: 2px solid #212121; /* Dark pixelated effect */
      border-radius: 3px; /* Small rounding for a retro look */
    "
    :class="['navbar', { hidden: isNavbarHidden }]"
  >
    <div class="container-fluid">
      <a class="navbar-brand">
        <RouterLink style="text-decoration: none; color: black" to="/"
          ><img
            src="/assets/navbar/MathWhiz-logo-final.png"
            style="width: 120px"
            alt=""
        /></RouterLink>
      </a>
      <div class="d-flex order-lg-2 gap-2">
        <button
          v-if="!isAuthenticated"
          @click="openModal"
          class="nes-btn is-primary"
          type="submit"
          data-bs-target="#getStartedModal"
          data-bs-toggle="modal"
        >
          Get Started!
        </button>

        <!-- Example single danger button -->
        <div v-else class="dropdown-center">
          <button
            class="btn btn-secondary dropdown-toggle math-game profile-icon"
            style="background-color: transparent; color: black; border: none"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img :src="globalState.playerImgLink" width="20" />
            {{ userData.displayName ? userData.displayName : username }}
          </button>
          <ul class="dropdown-menu">
            <li>
              <a @click="handleLogout" class="dropdown-item" href="#">Logout</a>
            </li>
          </ul>
        </div>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>

      <div
        class="order-lg-1 collapse navbar-collapse"
        id="navbarSupportedContent"
      >
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <!-- START OF REMOVE -->

          <!-- li class="nav-item">
            <RouterLink
              class="nav-link"
              to="/market"
              aria-current="page"
              style="text-decoration: none; color: black"
              >Market</RouterLink
            >
          </li>
          <li class="nav-item">
            <a>Test</a>
            <RouterLink
              class="nav-link"
              to="/bakery"
              aria-current="page"
              style="text-decoration: none; color: black"
              >Bakery</RouterLink
            >
          </li>
          <li class="nav-item">
            <RouterLink
              class="nav-link"
              to="/bank"
              aria-current="page"
              style="text-decoration: none; color: black"
              >Bank</RouterLink
            >
          </li>
          <li class="nav-item">
            <RouterLink
              class="nav-link"
              to="/school"
              aria-current="page"
              style="text-decoration: none; color: black"
              >School</RouterLink
            >
          </li>
          <li class="nav-item">
            <RouterLink
              class="nav-link"
              to="/timerbar"
              aria-current="page"
              style="text-decoration: none; color: black"
              >Timer</RouterLink
            >
          </li-->

          <!-- END OF REMOVE -->
          <li
            class="nav-item first-item"
            :class="{ active: isGameActive }"
            style="padding-left: 50px"
          >
            <!-- <a>Test</a> -->
            <RouterLink
              v-if="isAuthenticated"
              class="nav-link math-game"
              to="/game"
              aria-current="page"
              style="text-decoration: none; color: black"
            >
              <img
                src="/assets/navbar/animated_control_room_facebook_scrolling.gif"
                style="width: 25px"
                alt=""
              />
              Game</RouterLink
            >
          </li>
          <li class="nav-item" :class="{ active: activeRoute === '/story' }">
            <!-- <a>Test</a> -->
            <RouterLink
              v-if="isAuthenticated"
              class="nav-link math-game"
              to="/story"
              aria-current="page"
              style="text-decoration: none; color: black"
            >
              <img
                src="/assets/navbar/animated_spell_book.gif"
                style="width: 50px"
                alt=""
              />Story</RouterLink
            >
          </li>
          <li class="nav-item" :class="{ active: activeRoute === '/shop' }">
            <!-- <a>Test</a> -->
            <RouterLink
              v-if="isAuthenticated"
              class="nav-link math-game"
              to="/shop"
              aria-current="page"
              style="text-decoration: none; color: black"
            >
              <img
                src="/assets/navbar/animated_shopping_cart.gif"
                style="width: 50px"
                alt=""
              />Shop</RouterLink
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <!-- <div v-if="showModal">Hello World</div> -->
  <div>
    <div
      class="modal fade"
      id="getStartedModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="getStartedLabel">Get Started!</h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <nav class="nav nav-tabs">
              <a
                @click="displayForm = 'login'"
                :class="
                  displayForm === 'login' ? 'nav-link active' : 'nav-link'
                "
                aria-current="page"
                >Login</a
              >
              <a
                @click="displayForm = 'signup'"
                :class="
                  displayForm === 'signup' ? 'nav-link active' : 'nav-link'
                "
                >Sign Up</a
              >
            </nav>
            <form
              class="mt-3"
              v-show="displayForm === 'login'"
              id="login"
              @submit.prevent="handleLogin"
            >
              <div class="mb-3">
                <label for="inputEmail" class="form-label">Email address</label>
                <input
                  type="email"
                  :class="'form-control ' + loginValidity"
                  id="inputEmail"
                  aria-describedby="emailHelp"
                  v-model="email"
                />
                <div class="invalid-feedback">
                  Kindly re-check the email address you've provided.
                </div>
              </div>
              <div class="mb-3">
                <label for="inputPassword" class="form-label">Password</label>
                <input
                  type="password"
                  :class="'form-control ' + loginValidity"
                  id="inputPassword"
                  v-model="loginPassword"
                />
                <div class="invalid-feedback">
                  Kindly re-check the password you've provided.
                </div>
              </div>
              <div style="float: right">
                <button
                  @click="handleLogin"
                  type="button"
                  class="btn btn-primary"
                >
                  Login!
                </button>
              </div>
            </form>
            <form
              class="mt-3"
              v-show="displayForm === 'signup'"
              id="signup"
              @submit.prevent="handleLogin"
            >
              <div class="mb-3">
                <label for="inputSignupEmail" class="form-label"
                  >Email address</label
                >
                <input
                  type="email"
                  :class="'form-control ' + signupValidity"
                  id="inputSignupEmail"
                  aria-describedby="emailHelp"
                  v-model="signupEmail"
                />
                <div class="invalid-feedback">
                  Kindly re-check the email address you've provided.
                </div>
              </div>
              <div class="mb-3">
                <label for="inputSignupPassword" class="form-label"
                  >Password</label
                >
                <input
                  type="password"
                  :class="'form-control ' + signupValidity"
                  id="inputSignupPassword"
                  v-model="signupPassword"
                />
                <div class="invalid-feedback">
                  Password must have at least 6 characters.
                </div>
              </div>
              <!-- <div class="mb-3"> -->
              <!-- <label for="inputConfirmPassword" class="form-label"
                  >Confirm Password</label
                > -->
              <!-- <input
                  type="password"
                  class="form-control"
                  id="inputConfirmPassword"
                  v-model="confirmPassword"
                /> -->
              <!-- </div> -->

              <div class="mb-3">
                <label for="inputSignupUsername" class="form-label"
                  >Display Name</label
                >
                <input
                  :class="'form-control ' + usernameCheck"
                  id="inputSignupUsername"
                  aria-describedby="emailHelp"
                  v-model="username"
                />
                <div class="invalid-feedback">Kindly add a display name.</div>
              </div>

              <div style="float: right">
                <button
                  @click="handleSignup"
                  type="button"
                  class="btn btn-primary"
                >
                  Sign Up!
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: #fff5cd;
  transition: transform 0.2s ease;
  transform: translateY(0);
  width: 100vw;
}

.navbar.hidden {
  transform: translateY(-100%);
}

.nav-item {
  padding-left: 15px;
}

.nav-item a {
  position: relative;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.nav-item a:hover {
  transform: scale(1.1);
  color: #ffcfb3;
}

.nav-item a:hover::after,
.nav-item.active a::after {
  content: "";
  position: absolute;
  bottom: -3px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  filter: blur(2px);
  opacity: 0.9;
  transition: opacity 0.5s ease, filter 0.5s ease;
}
.profile-icon:hover {
  animation: bounce 0.5s ease;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}
</style>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  signOut,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import * as bootstrap from "bootstrap";
import { useRouter, useRoute } from "vue-router";
import { globalState } from "./globalState";

const loginValidity = ref("");
const email = ref("");
const signupEmail = ref("");
const loginPassword = ref("");
const signupPassword = ref("");
const errorMessage = ref("");
const displayForm = ref("login");
const username = ref("");
const usernameCheck = ref("");
const userData = ref("");
const isAuthenticated = ref(false);
const auth = getAuth();
const db = getFirestore();
const playerImage = ref("");
const defaultCat = ref([
  {
    name: "Furless",
    cuteness: 70,
    fluffiness: 10,
    coolness: 85,
    color: "Pale Pink",
    imgLocation: "/assets/shopassets/furless.png",
    description: "It takes a furless cat to be fearless!",
    rarity: "Super Rare",
    price: 150,
  },
]);

const defaultPlayer = ref({
  name: "Hoodie Boy",
  imgLocation: "/assets/profileassets/character/Hoodie Boy.png",
  description:
    "A casual cool kid in his comfortable hoodie, ready for any relaxed adventure",
});

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    // console.log(user);
    userData.value = user;
    isAuthenticated.value = user !== null;
    getEquippedPlayer(db, "users", userData.value.uid);
  });
});

const signupValidity = ref("");
const router = useRouter();
const handleLogin = () => {
  signInWithEmailAndPassword(auth, email.value, loginPassword.value)
    .then((userCredential) => {
      const user = userCredential.user;
      const modalElement = document.getElementById("getStartedModal");
      const modal = bootstrap.Modal.getInstance(modalElement);
      router.push("/story");
      modal.hide();
    })
    .catch((error) => {
      const errorCode = error.code;
      errorMessage.value = error.message;
      loginValidity.value = "is-invalid";
    });
};

const handleSignup = () => {
  if (username.value.trim().length === 0) {
    usernameCheck.value = "is-invalid";
    return;
  }
  createUserWithEmailAndPassword(auth, signupEmail.value, signupPassword.value)
    .then((userCredential) => {
      const user = userCredential.user;
      user["displayName"] = username.value.trim();
      userData.value = user;
      createUserProfile(user.uid);
      updateProfile(user, { displayName: username.value.trim() });
      router.push("/story");

      const modalElement = document.getElementById("getStartedModal");
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal.hide();
    })
    .catch((error) => {
      signupValidity.value = "is-invalid";
    });
};

const handleLogout = () => {
  signOut(auth)
    .then(() => {
      router.push("/");
    })
    .catch((error) => {
      console.error("Logout error:", error);
    });
};

async function createUserProfile(userId) {
  const userRef = doc(db, "users", userId);
  await setDoc(
    userRef,
    {
      currency: 0,
      equippedCat: defaultCat.value[0],
      purchasedCats: defaultCat.value,
      equippedPlayer: defaultPlayer.value,
    },
    { merge: true }
  );
  // console.log(userRef);
}

async function getEquippedPlayer(db, collectionName, documentId) {
  const docRef = doc(db, collectionName, documentId);
  try {
    const doc = await getDoc(docRef);
    // console.log(doc);
    if (doc.exists()) {
      // console.log("Document data:", doc.data());
      if (doc.data().equippedPlayer) {
        globalState.playerImgLink = doc.data().equippedPlayer.imgLocation;
      } else {
        console.log("No equippedPlayer data!");
      }
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error getting document:", error);
  }
}

const isNavbarHidden = ref(false);
let lastScrollTop = 0;

const handleScroll = () => {
  const currentScroll = window.pageYOffset || 0;

  if (currentScroll > lastScrollTop && currentScroll > 0) {
    isNavbarHidden.value = true;
  } else if (currentScroll < lastScrollTop) {
    isNavbarHidden.value = false;
  }

  lastScrollTop = currentScroll;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});

const route = useRoute();
const activeRoute = computed(() => route.path);

const isGameActive = computed(() => {
  // Check if the current path is NOT '/', '/story', or '/shop'
  return (
    route.path !== "/" && route.path !== "/story" && route.path !== "/shop"
  );
});
</script>
