<template>
  <div id="phaser-container"></div>
</template>
<script>
import { onMounted } from "vue";
import { initializePhaser } from "./Environment.js";
export default {
  setup() {
    onMounted(() => {
      initializePhaser();
    });
  },
};
</script>
<style scoped></style>
