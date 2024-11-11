<template>
  <div>
    <Cutscene v-if="showCutscene" @end-cutscene="endCutscene" @go-to-counting="goToCounting"  @go-to-ordering="goToOrdering"/>
    <MarketCounting v-else-if="showCounting" />
    <MarketOrdering v-else-if="showOrdering" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Cutscene from '../components/market/MarketCutscene.vue';
import MarketCounting from '../components/market/MarketCounting.vue';
import MarketOrdering from '../components/market/MarketOrdering.vue';

const showCutscene = ref(true); // Show cutscene initially
const showCounting = ref(false);
const showOrdering = ref(false);

// Function to display MarketCounting after the cutscene
function goToCounting() {
  showCounting.value = true;
  showCutscene.value = false;
}

// Function to display MarketOrdering after the cutscene
function goToOrdering() {
  showOrdering.value = true;
  showCutscene.value = false;
}

// Handler for when the cutscene ends
function endCutscene() {
  showCutscene.value = false; // Hide cutscene
}

// Reset state when the component is mounted
onMounted(() => {
  showCutscene.value = true;
  showCounting.value = false;
  showOrdering.value = false;
});
</script>