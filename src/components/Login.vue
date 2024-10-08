<script setup>
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { onMounted, ref } from "vue";

const email = ref("");
const password = ref("");
const auth = getAuth();

function handleClick() {
  console.log(email.value);
  console.log(password.value);
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log("You're in");
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
}
</script>

<template>
  <div>
    <input v-model="email" placeholder="Enter your email" />
    <input v-model="password" placeholder="Enter your password" />
    <button @click="handleClick()" class="btn btn-primary">Submit</button>
  </div>
</template>

<style scoped>
h1 {
  color: #da2e2e;
}
</style>
