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
</template>

<style></style>
