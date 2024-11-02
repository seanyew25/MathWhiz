<template>
  <div
    class="tw-min-h-screen relative tw-flex tw-items-center tw-justify-center tw-p-4 tw-overflow-hidden"
  >
    <div
      class="tw-absolute tw-inset-0 tw-z-0"
      :style="{
        backgroundImage: 'url(/schoolBg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }"
    />
    <!-- <div class="tw-absolute tw-inset-0 tw-bg-[#B7E0FF]/40 tw-z-10" /> -->
    <div class="tw-w-full tw-max-w-3xl tw-z-20">
      <h1
        class="tw-text-4xl tw-font-bold tw-text-center tw-mb-8 tw-text-white tw-shadow-sm"
      >
        Quiz Game
      </h1>
      <!-- <div class="tw-bg-[#FFF5CD] tw-rounded-lg tw-p-6 tw-shadow-lg"> -->
      <div class="tw-flex tw-flex-col tw-items-center tw-mb-6">
        <!-- <img
            src="/placeholder.svg?height=200&width=200"
            alt="Question related image"
            class="tw-w-48 tw-h-48 tw-object-cover tw-mb-4"
          /> -->
        <h2 class="tw-text-2xl tw-font-semibold tw-text-center">
          {{ questions[currentQuestion].question }}
        </h2>
      </div>
      <div class="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 tw-gap-4">
        <MotionButton
          v-for="(option, index) in questions[currentQuestion].options"
          :key="index"
          :option="option"
          :handleAnswer="handleAnswer"
        />
      </div>
      <!-- </div> -->
      <p
        class="tw-text-xl tw-font-semibold tw-text-center tw-mt-6 tw-text-white tw-shadow-sm"
      >
        Score: {{ score }} / {{ questions.length }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import MotionButton from "./MotionButton.vue";

const questions = [
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris",
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Mars", "Venus", "Jupiter", "Saturn"],
    correctAnswer: "Mars",
  },
];

const currentQuestion = ref(0);
const score = ref(0);

const handleAnswer = (selectedAnswer) => {
  if (selectedAnswer === questions[currentQuestion.value].correctAnswer) {
    score.value += 1;
  }
  if (currentQuestion.value < questions.length - 1) {
    currentQuestion.value += 1;
  }
};
</script>
