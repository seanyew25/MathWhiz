<template>
  <div>
    <SchoolCutscene
      v-if="showCutscene"
      @end-cutscene="endCutscene"
      @go-to-addition-subtraction="goToAdditionSubtraction"
      @go-to-multiplication-division="goToMultiplicationDivision"
    />
    <AdditionSubtractGame v-else-if="showAdditionSubtraction" />
    <MuliplicationDivisionGame v-else-if="showMultiplicationDivision" />
  </div>
</template>
<style scoped></style>
<script setup>
// import SchoolASPage from "./ASComponent.vue";
// import SchoolMDPage from "./MDComponent.vue";

import MuliplicationDivisionGame from "../components/school/MultiplicationDivisionGame.vue";
import AdditionSubtractGame from "../components/school/AdditionSubtractGame.vue";
import { ref, onMounted } from "vue";
import SchoolCutscene from "../components/school/SchoolCutscene.vue";

const showCutscene = ref(true); // Show cutscene initially
const showAdditionSubtraction = ref(false);
const showMultiplicationDivision = ref(false);

// Function to display MarketCounting after the cutscene
function goToAdditionSubtraction() {
  showAdditionSubtraction.value = true;
  showCutscene.value = false;
}

// Function to display MarketOrdering after the cutscene
function goToMultiplicationDivision() {
  showMultiplicationDivision.value = true;
  showCutscene.value = false;
}

// Handler for when the cutscene ends
function endCutscene() {
  showCutscene.value = false; // Hide cutscene
}

// Reset state when the component is mounted
onMounted(() => {
  showCutscene.value = true;
  showAdditionSubtraction.value = false;
  showMultiplicationDivision.value = false;
});

</script>
