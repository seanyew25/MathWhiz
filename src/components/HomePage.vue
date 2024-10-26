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
<style scoped>
#phaser-container {
  overflow: hidden;
  height: calc(100vh - 56px);
  /* flex: 1; */
}
</style>
