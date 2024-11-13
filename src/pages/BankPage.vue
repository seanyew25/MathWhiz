<template>
  <div>
    <BankCutscene
      v-if="showCutscene"
      @end-cutscene="endCutscene"
      @go-to-bank-game="goToBankGame"
    />
    <BankGame v-else-if="showBankGame" />
    <!-- <MultiplicationDivisionGame v-else-if="showMultiplicationDivision" /> -->
  </div>
</template>

<script setup>
import BankCutscene from "../components/bank/BankCutscene.vue";
import BankGame from "../components/bank/BankGame.vue";
import { ref, onMounted } from "vue";

const showCutscene = ref(true); // Show cutscene initially
const showBankGame = ref(false);

// Function to display MarketCounting after the cutscene
function goToBankGame() {
  showBankGame.value = true;
  showCutscene.value = false;
}


// Handler for when the cutscene ends
function endCutscene() {
  showCutscene.value = false; // Hide cutscene
}

// Reset state when the component is mounted
onMounted(() => {
  showCutscene.value = true;
  showBankGame.value = false;
});
</script>
