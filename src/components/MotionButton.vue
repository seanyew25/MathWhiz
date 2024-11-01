<template>
  <button
    class="tw-bg-[#FFCFB3] tw-text-left tw-p-4 tw-rounded-lg tw-font-medium tw-transition-all tw-duration-200 hover:tw-translate-y-[-4px] relative"
    @mouseover="hover = true"
    @mouseleave="hover = false"
    @click="handleClick"
  >
    <div
      class="tw-absolute tw-inset-0 tw-bg-[#FFB088]/30 tw-rounded-lg -tw-z-10"
      :class="hover ? 'tw-translate-y-0' : 'tw-translate-y-2'"
    ></div>
    {{ option }}
  </button>
</template>

<script setup>
import { ref } from "vue";
// import { MotionPlugin } from '@vueuse/motion'

const props = defineProps(["option", "handleAnswer"]);

const hover = ref(false);

const handleClick = () => {
  props.handleAnswer(props.option);
};
</script>
