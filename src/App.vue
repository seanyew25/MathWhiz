<script setup>
import Login from "./components/Login.vue";
import HomePage from "./components/HomePage.vue";
import Navbar from "./components/Navbar.vue";
import { useRouter } from "vue-router";
import { getAuth } from "firebase/auth";
const router = useRouter();
const isAuthenticated = getAuth();
router.beforeEach(async (to, from) => {
  console.log(JSON.stringify(isAuthenticated));
  console.log(`current user: ${JSON.stringify(isAuthenticated.currentUser)}`);
  if (
    // make sure the user is authenticated
    !isAuthenticated.currentUser &&
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
  <RouterView></RouterView>
</template>

<style></style>
