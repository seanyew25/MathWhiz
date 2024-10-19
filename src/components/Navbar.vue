<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Navbar</a>
      <div class="d-flex order-lg-2 gap-2">
        <button
          @click="openModal"
          class="btn btn-outline-primary"
          type="submit"
          data-bs-target="#exampleModal"
          data-bs-toggle="modal"
        >
          Login</button
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
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
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
              v-show="displayForm === 'login'"
              id="login"
              @submit.prevent="handleLogin"
            >
              <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label"
                  >Email address</label
                >
                <input
                  type="email"
                  class="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                />
              </div>
              <div class="mb-3">
                <label for="exampleInputPassword1" class="form-label"
                  >Password</label
                >
                <input
                  type="password"
                  class="form-control"
                  id="exampleInputPassword1"
                />
              </div>
              <div class="mb-3 form-check"></div>
              <button type="submit" class="btn btn-primary">Submit</button>
            </form>
            <form
              v-show="displayForm === 'signup'"
              id="signup"
              @submit.prevent="handleLogin"
            >
              <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label"
                  >Email address</label
                >
                <input
                  type="email"
                  class="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                />
              </div>
              <div class="mb-3">
                <label for="exampleInputPassword1" class="form-label"
                  >Password</label
                >
                <input
                  type="password"
                  class="form-control"
                  id="exampleInputPassword1"
                />
              </div>
              <div class="mb-3">
                <label for="exampleInputPassword1" class="form-label"
                  >Password</label
                >
                <input
                  type="password"
                  class="form-control"
                  id="exampleInputPassword1"
                />
              </div>
              <div class="mb-3 form-check"></div>
              <button type="submit" class="btn btn-primary">Submit</button>
            </form>
          </div>
          <!-- <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <button type="button" class="btn btn-primary">Save changes</button>
        </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { ref, onMounted } from "vue";

const showModal = ref(false);
const email = ref("");
const password = ref("");
const errorMessage = ref("");
const displayForm = ref("login");
const auth = getAuth();

const openModal = () => {
  showModal.value = true;
  errorMessage.value = "";
};

const closeModal = () => {
  showModal.value = false;
  email.value = "";
  password.value = "";
  errorMessage.value = "";
};

const handleLogin = () => {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log("You're logged in", user);
      closeModal();
      // Here you can add logic to redirect the user or update the UI
    })
    .catch((error) => {
      const errorCode = error.code;
      errorMessage.value = error.message;
      console.error("Login error:", errorCode, errorMessage.value);
    });
};
</script>
