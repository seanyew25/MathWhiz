<template>
  <div class="hero">
    <video class="hero-video" autoplay muted loop playsinline>
      <source src="../media/final_background_video.mp4" type="video/mp4" />
    </video>
    <div class="hero-content">
      <h1
        class="hero-title tw-text-8xl tw-font-bold tw-text-black tw-font-russo-one"
      >
        Welcome to Mathwhiz!
      </h1>
    </div>
  </div>

  <!-- <div class="video-container">
    <video autoplay muted loop>
      <source src="../media/final_background_video.mp4" type="video/mp4">
    </video>
    <h1 class="text-over-video-h1 tw-text-8xl tw-font-bold tw-text-white-600">
        Welcome to Mathwhiz!
    </h1>
  </div> -->

  <div class="background-container">
    <h1 class="tw-font-russo-one">Bringing Math to Life!</h1>
    <p class="tw-text-2xl tw-font-russo-one">
      At Mathwhiz, we believe in unlocking the magic of math.
    </p>
  </div>

  <div class="tw-min-h-fit tw-bg-blue-300 tw-p-8">
    <div class="tw-max-w-4xl tw-mx-auto">
      <h1
        class="tw-text-3xl tw-font-bold tw-text-gray-800 tw-mb-8 tw-text-center tw-font-russo-one"
      >
        Your Mathwhiz Experience:
      </h1>
      <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
        <!-- Explore a city -->
        <div class="tw-bg-blue-100 tw-p-6 tw-rounded-xl tw-shadow-md">
          <h2
            class="tw-text-2xl tw-font-semibold tw-text-blue-800 tw-mb-4 tw-font-russo-one"
          >
            Explore a City
          </h2>
          <p class="tw-text-blue-700 tw-font-russo-one">
            Embark on a adventure in Math City. Explore different landmarks!
          </p>
        </div>

        <!-- Speak to different characters -->
        <div class="tw-bg-green-100 tw-p-6 tw-rounded-xl tw-shadow-md">
          <h2
            class="tw-text-2xl tw-font-semibold tw-text-green-800 tw-mb-4 tw-font-russo-one"
          >
            Interactive Scenarios
          </h2>
          <p class="tw-text-green-700 tw-font-russo-one">
            Engage in conversations with diverse characters in various game
            scenarios. Practice language skills, decision-making, and
            problem-solving in immersive environments.
          </p>
        </div>

        <!-- Practice math -->
        <div class="tw-bg-purple-100 tw-p-6 tw-rounded-xl tw-shadow-md">
          <h2
            class="tw-text-2xl tw-font-semibold tw-text-purple-800 tw-mb-4 tw-font-russo-one"
          >
            Math Adventures
          </h2>
          <p class="tw-text-purple-700 tw-font-russo-one">
            Dive into exciting math challenges! Practice arithmetic, geometry,
            and problem-solving skills through interactive games, puzzles, and
            real-world applications.
          </p>
        </div>

        <div class="tw-bg-orange-100 tw-p-6 tw-rounded-xl tw-shadow-md">
          <h2
            class="tw-text-2xl tw-font-semibold tw-text-orange-800 tw-mb-4 tw-font-russo-one"
          >
            Cat Collection Quest
          </h2>
          <p class="tw-text-orange-700 tw-font-russo-one">
            Embark on a delightful journey to collect virtual cats! Each unique
            feline provides a little boost to your fun in Mathwhiz.
          </p>
        </div>
      </div>
    </div>
  </div>

  <div class="tw-min-h-500px tw-bg-yellow-50 tw-p-4">
    <div class="tw-max-w-4xl tw-mx-auto tw-p-5">
      <h1 class="tw-text-center tw-p-6 tw-font-russo-one">
        Join Mathwhiz today! Sign up now!
      </h1>
    </div>
    <div class="tw-flex tw-flex-col tw-items-center">
      <button
        v-if="!isAuthenticated"
        @click="openModal"
        class="btn btn-outline-primary w-75 p-3"
        type="submit"
        data-bs-target="#getStartedModal"
        data-bs-toggle="modal"
      >
        Get Started!
      </button>
    </div>
  </div>
</template>

<style>
:root {
  --tw-content: "";
}

.hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 70vh;
  overflow: hidden;
  text-align: center;
  color: #fff;
  z-index: 10;
}

.hero-video {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 100%;
  min-height: 50%;
  width: auto;
  height: auto;
  z-index: 1; /* Keeps video behind the content */
  object-fit: cover; /* Ensures video covers the hero area */
}

.hero-content {
  z-index: 2;
  max-width: 90%;
  padding: 0 2rem;
}

.hero-title {
  font-size: 6vw;
  margin: 0;
  line-height: 1.2;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .hero-title {
    font-size: 8vw;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 10vw;
  }
}

.hero-title2 {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  margin: 0;
  padding: 0;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.background-container {
  background-image: linear-gradient(to right, #b7e0ff, #95e3ff);
  /* background-color: #B7E0FF; */
  min-height: 40vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.text-over-video-h1 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.video-container {
  position: relative;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 80%;
  overflow: hidden;
  margin: 0;
}

video {
  /* Make video to at least 100% wide and tall */
  min-width: 100%;
  min-height: 80%;

  /* Setting width & height to auto prevents the browser from stretching or squishing the video */
  width: auto;
  height: auto;

  opacity: 0.5;

  z-index: -2;
}
</style>

<script setup></script>
