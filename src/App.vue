<script setup>
import Navbar from "./components/Navbar.vue";
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
const router = useRouter();
const route = useRoute();
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

// Computed property to determine background image based on route
const backgroundImage = computed(() => {
  if (route.path === "/market") {
    return "url('/assets/backgroundassets/cart.gif')";
  } else if (route.path === "/school") {
    return "url('/assets/backgroundassets/book.gif')";
  } else if (route.path === "/") {
    return "";
  } else {
  return "url('/assets/backgroundassets/cat.gif')"; // Default
  }
});

const backgroundColor = computed(() => {
  if (route.path === "/") {
    return "";
  } else {
  return "pink"; // Default
  }
});

</script>

<template>
  <Navbar />
  <div :style="{ backgroundImage: backgroundImage, backgroundColor: backgroundColor}" class="background">
    <RouterView></RouterView>
  </div>
</template>

<style>
.background {
    background-size: auto; /* Keeps the original size */
    background-position: 0 0; /* Starting position */
    background-repeat: repeat;
    animation: slowScroll 20s linear infinite; /* Slow scrolling effect */
}

@keyframes slowScroll {
    0% {
        background-position: 0 0;
    }
    100% {
        background-position: 144px 144px; /* Adjust for direction and speed */
    }
}
</style>
