<<<<<<< HEAD
<script setup>
import Navbar from "./components/Navbar.vue";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
const router = useRouter();
const auth = getAuth();
const isAuthenticated = ref("");
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isAuthenticated.value = true;
    } else {
      isAuthenticated.value = false;
    }
  });
});

router.beforeEach(async (to, from) => {
  // console.log(isAuthenticated.value);
  if (
    // make sure the user is authenticated
    !isAuthenticated.value &&
    // ❗️ Avoid an infinite redirect
    to.path !== "/"
  ) {
    // redirect the user to the landing page
    return { path: "/" };
  }
});
</script>

<template>
  <Navbar />
  <div class="tw-bg-[#B7E0FF]">
    <RouterView></RouterView>
  </div>
=======
<script>
import Login from "./components/Login.vue";
import HomePage from "./components/HomePage.vue";
import { onMounted } from "vue";
import { initializePhaser } from "./components/Environment.js";
export default {
  setup() {
    onMounted(() => {
      initializePhaser();
    });
  },
};
</script>

<template>
  <!--<Login />-->
  <!-- <HomePage /> -->
  <div id="phaser-container"></div>
>>>>>>> 6d93397 (Added phaser and environment render)
</template>

<style></style>
