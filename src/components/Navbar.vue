<template>
  <nav
    class="navbar navbar-expand-lg"
    style="
      background-color: rgba(255, 245, 205, 1);
      padding-left: 5%;
      padding-right: 5%;
    "
  >
    <div class="container-fluid">
      <a class="navbar-brand"
        ><RouterLink style="text-decoration: none; color: black" to="/"
          >MathWhiz</RouterLink
        ></a
      >
      <div class="d-flex order-lg-2 gap-2">
        <button
          v-if="!isAuthenticated"
          @click="openModal"
          class="btn btn-outline-primary"
          type="submit"
          data-bs-target="#getStartedModal"
          data-bs-toggle="modal"
        >
          Get Started!
        </button>

        <!-- Example single danger button -->
        <div v-else class="dropdown-center">
          <button
            class="btn btn-secondary dropdown-toggle"
            style="background-color: transparent; color: black; border: none"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-person"
              viewBox="0 0 16 16"
            >
              <path
                d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"
              />
            </svg>
            {{ userData.displayName }}
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
          <li class="nav-item">
            <RouterLink
              to="/home"
              aria-current="page"
              style="text-decoration: none; color: black"
              >Home</RouterLink
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
                <label for="inputSignupUsername" class="form-label"
                  >Username</label
                >
                <input
                  :class="'form-control ' + usernameCheck"
                  id="inputSignupUsername"
                  aria-describedby="emailHelp"
                  v-model="username"
                />
                <div class="invalid-feedback">Kindly add a username.</div>
              </div>

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

<script setup>
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  signOut,
} from "firebase/auth";
import { ref, onMounted } from "vue";
import * as bootstrap from "bootstrap";
import { useRouter } from "vue-router";
const loginValidity = ref("");
const email = ref("");
const signupEmail = ref("");
const loginPassword = ref("");
const signupPassword = ref("");
// const confirmPassword = ref("");
const errorMessage = ref("");
const displayForm = ref("login");
const username = ref("");
const usernameCheck = ref("");
const userData = ref("");
const isAuthenticated = ref(false);
const auth = getAuth();

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    console.log(user);
    userData.value = user;
    isAuthenticated.value = user !== null;
  });
});
const signupValidity = ref("");

const router = useRouter();

const handleLogin = () => {
  console.log(email.value);
  console.log(loginPassword.value);

  signInWithEmailAndPassword(auth, email.value, loginPassword.value)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      // console.log(auth.currentUser);
      console.log("You're logged in", user);
      const modalElement = document.getElementById("getStartedModal");
      const modal = bootstrap.Modal.getInstance(modalElement);
      // userData.value = user;
      router.push("/home");
      modal.hide();

      // Here you can add logic to redirect the user or update the UI
    })
    .catch((error) => {
      const errorCode = error.code;
      errorMessage.value = error.message;
      console.error("Login error:", errorCode, errorMessage.value);
      loginValidity.value = "is-invalid";
    });
};

const handleSignup = () => {
  console.log(signupEmail.value);
  console.log(signupPassword.value);
  username.value.trim().length === 0
    ? (usernameCheck.value = "is-invalid")
    : "";
  createUserWithEmailAndPassword(auth, signupEmail.value, signupPassword.value)
    .then((userCredential) => {
      // Signed up
      // const user = auth.currentUser;
      const user = userCredential.user;
      user["displayName"] = username.value.trim();
      userData.value = user;
      console.log(userData.value);
      updateProfile(user, {
        displayName: username.value.trim(),
      })
        .then((response) => {
          // console.log(response);
          // userData.value = updatedUser;
        })
        .catch((error) => {
          console.log(error);
        });
      router.push("/home");
      const modalElement = document.getElementById("getStartedModal");
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal.hide();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(error.message);
      signupValidity.value = "is-invalid";
      // ..
    });
};

const handleLogout = () => {
  signOut(auth)
    .then(() => {
      console.log("Sign-out successful.");
      router.push("/");
    })
    .catch((error) => {
      // An error happened.
    });
};
</script>
