<template>
  <!-- 1st Div - Welcome to Mathwhiz Hero Video Container -->
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

  <!-- 2nd Div - Mathwhiz vision -->
  <div class="background-container">
    <h1 class="tw-font-russo-one">Bringing Math to Life!</h1>
    <p class="tw-text-2xl tw-text-center tw-font-russo-one">
      At Mathwhiz, we believe in unlocking the magic of math.
    </p>
  </div>

  <!-- 3rd Div - Mathwhiz Features -->
  <div class="tw-min-h-fit tw-bg-blue-300 tw-p-8">
    <div class="tw-max-w-6xl tw-mx-auto">
      <h1 class="tw-text-3xl tw-font-bold tw-text-gray-800 tw-mb-8 tw-text-center tw-font-russo-one">
        Your Mathwhiz Experience:
      </h1>
      <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-8">
        <div v-for="(card, index) in cards" :key="index" 
             class="tw-flex tw-items-center tw-justify-between"
             @mouseenter="flipCard(index)"
             @mouseleave="flipCard(index)">
          <img v-if="index % 2 === 0" :src="card.imageSrc" :alt="card.imageAlt" class="tw-w-1/5 tw-hidden md:tw-block" />
          <div class="tw-perspective-1000 tw-w-full md:tw-w-3/4 tw-h-[300px]">
            <div class="tw-relative tw-w-full tw-h-full tw-transition-transform tw-duration-500 tw-transform-style-preserve-3d"
                 :class="{ 'tw-rotate-y-180': card.isFlipped }">
              <!-- Front of the card -->
              <div class="tw-absolute tw-w-full tw-h-full tw-backface-hidden"
                   :class="[card.bgColor, 'tw-p-6 tw-rounded-xl tw-shadow-md']">
                <h2 :class="['tw-text-2xl tw-font-semibold tw-mb-4 tw-font-russo-one', card.titleColor]">
                  {{ card.title }}
                </h2>
                <p :class="['tw-font-russo-one', card.textColor]">
                  {{ card.description }}
                </p>
              </div>
              <!-- Back of the card -->
              <div class="tw-absolute tw-w-full tw-h-full tw-backface-hidden tw-rotate-y-180"
                   :class="[card.bgColor, 'tw-p-6 tw-rounded-xl tw-shadow-md']">
                <div class="tw-h-full tw-flex tw-flex-col tw-justify-center">
                  <h3 :class="['tw-text-xl tw-font-semibold tw-mb-4 tw-font-russo-one', card.titleColor]">
                    More about {{ card.title }}
                  </h3>
                  <p :class="['tw-font-russo-one', card.textColor]">
                    {{ card.detailedDescription }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <img v-if="index % 2 !== 0" :src="card.imageSrc" :alt="card.imageAlt" class="tw-w-1/5 tw-hidden md:tw-block" />
        </div>
      </div>
    </div>
  </div>


  <!-- Mathwhiz Signup Div -->
  <div class="tw-flex tw-flex-col tw-items-center tw-bg-yellow-50 tw-p-5 tw-h-20vh">
    <div class="tw-max-w-4xl tw-mx-auto tw-p-5">
      <h1 class="tw-text-center tw-pt-5 tw-font-russo-one">
        Join Mathwhiz today! Sign up now!
      </h1>
    </div>
      <div class="tw-flex tw-flex-col tw-items-center" style="padding:0px 0px 20px 0px"> <!-- Padding at the bottom, follows top right bottom left -->
        <button
          v-if="!isAuthenticated"
          @click="openModal"
          class="nes-btn is-primary"
          type="submit"
          data-bs-target="#getStartedModal"
          data-bs-toggle="modal"
        >
          Get Started!
        </button>
        <button
          v-else
          class="nes-btn is-disabled"
          disabled
          title="You're already signed in!"
        >
          Already Signed In
        </button>
      </div>
    </div>
  
</template>

<style>
:root {
  --tw-content: "";
}

.nes-btn {
  border-image-slice: 2;
  border-image-width: 2;
  border-image-repeat: stretch;
  border-image-source: url('data:image/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8" ?><svg version="1.1" width="5" height="5" xmlns="http://www.w3.org/2000/svg"><path d="M2 1 h1 v1 h-1 z M1 2 h1 v1 h-1 z M3 2 h1 v1 h-1 z M2 3 h1 v1 h-1 z" fill="rgb(33,37,41)" /></svg>');
  border-image-outset: 2;
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

.background-container {
  background-image: linear-gradient(to right, #b7e0ff, #95e3ff);
  /* background-color: #B7E0FF; */
  min-height: 20vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

.tw-perspective-1000 {
  perspective: 1000px;
}

.tw-backface-hidden {
  backface-visibility: hidden;
}

.tw-rotate-y-180 {
  transform: rotateY(180deg);
}

.tw-transform-style-preserve-3d {
  transform-style: preserve-3d;
}
</style>

<script>
import { ref, onMounted } from "vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
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


export default {
  name: 'MathwhizFeatures',
  data() {
    return {
      cards: [
        {
          title: 'Explore a City',
          description: 'Embark on an adventure in Mathropolis. Explore different landmarks!',
          detailedDescription: 'Dive into a virtual city where every street corner presents a new mathematical challenge. From calculating fractions to counting money, you\'ll apply math in exciting real-world scenarios.',
          imageSrc: '/assets/profileassets/character/Hoodie Boy.png',
          imageAlt: 'Character to Explore With',
          bgColor: 'tw-bg-blue-100',
          titleColor: 'tw-text-blue-800',
          textColor: 'tw-text-blue-700',
          isFlipped: false
        },
        {
          title: 'Interactive Scenarios',
          description: 'Engage in conversations with diverse characters in various game scenarios. Practice language skills, decision-making, and problem-solving in immersive environments.',
          detailedDescription: 'Meet a cast of quirky characters, each with their own mathematical dilemmas. Help a chef balance recipes, assist a musician in composing melodies using math, or aid a detective in cracking codes. Every interaction is a chance to apply math creatively.',
          imageSrc: 'public/assets/schoolassets/carrying1.png',
          imageAlt: 'Scenario Character',
          bgColor: 'tw-bg-green-100',
          titleColor: 'tw-text-green-800',
          textColor: 'tw-text-green-700',
          isFlipped: false
        },
        {
          title: 'Math Adventures',
          description: 'Dive into exciting math challenges! Practice arithmetic, geometry, and problem-solving skills through interactive games, puzzles, and real-world applications.',
          detailedDescription: 'Embark on thrilling quests where math is your superpower. Scale geometric mountains, navigate algebraic mazes, and conquer statistical challenges. With each adventure, you\'ll gain confidence in your math abilities and see how they apply to the world around you.',
          imageSrc: 'public/assets/schoolassets/reading1.png',
          imageAlt: 'Reading Character',
          bgColor: 'tw-bg-purple-100',
          titleColor: 'tw-text-purple-800',
          textColor: 'tw-text-purple-700',
          isFlipped: false
        },
        {
          title: 'Cat Collection Quest',
          description: 'Embark on a delightful journey to collect virtual cats! Each unique feline provides a little boost to your fun in Mathwhiz.',
          detailedDescription: 'Discover and befriend a variety of adorable virtual cats, each with its own mathematical personality. Some cats might boost your arithmetic skills, while others enhance your geometric intuition. Collect them all to become a well-rounded math master!',
          imageSrc: 'public/assets/shopassets/morgana.png',
          imageAlt: 'Cat Morgana',
          bgColor: 'tw-bg-orange-100',
          titleColor: 'tw-text-orange-800',
          textColor: 'tw-text-orange-700',
          isFlipped: false
        }
      ]
    }
  },
  methods: {
    flipCard(index) {
      this.cards[index].isFlipped = !this.cards[index].isFlipped;
    }
  }
}

</script>
