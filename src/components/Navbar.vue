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
      <a class="navbar-brand" href="#">MathWhiz</a>
      <div class="d-flex order-lg-2 gap-2">
        <button
          @click="openModal"
          class="btn btn-outline-primary"
          type="submit"
          data-bs-target="#getStartedModal"
          data-bs-toggle="modal"
        >
          Get Started!</button
        ><button
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
            <a class="nav-link active" aria-current="page" href="#">Home</a>
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
                  Kindly re-check the password you've provided.
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
} from "firebase/auth";
import { ref, onMounted } from "vue";
import * as bootstrap from "bootstrap";
const loginValidity = ref("");
const error = ref("");
const email = ref("");
const signupEmail = ref("");
const loginPassword = ref("");
const signupPassword = ref("");
// const confirmPassword = ref("");
const errorMessage = ref("");
const displayForm = ref("login");
const auth = getAuth();
const signupValidity = ref("");

const handleLogin = () => {
  console.log(email.value);
  console.log(loginPassword.value);

  signInWithEmailAndPassword(auth, email.value, loginPassword.value)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log("You're logged in", user);
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
  createUserWithEmailAndPassword(auth, signupEmail.value, signupPassword.value)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(error.message);
      signupValidity.value = "is-invalid";
      // ..
    });
};
</script>
