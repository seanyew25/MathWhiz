<template>
  <div class="school-cutscene md:tw-overflow-hidden">
    <div
      class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-center tw-min-h-[calc(100vh-56px)]"
    >
      <div class="tw-relative tw-inline-block tw-text-center">
        <!-- Character Image with Animation -->
        <img
          :src="currentImage"
          :class="{ shake: isShaking }"
          alt="Character Animation"
          class="character-size tw-mx-auto"
          @click="toggleAnimation"
        />
        <!-- Exclamation Icon for Alerted State -->
        <img
          v-if="isAlerted"
          src="/assets/MarketImages/exclamation.png"
          alt="Exclamation"
          :class="{ shake: isAlerted }"
          class="tw-absolute tw--top-9 tw-left-1/4 tw-w-16 tw-h-16"
        />
        <!-- Dialogue Speech Bubble -->
        <div
          v-if="!isAlerted"
          :class="[
            'dialogue-position',
            isSmallScreen ? 'nes-container' : 'nes-balloon from-left',
          ]"
          @click="toggleAnimation"
        >
          <p>{{ displayedText }}</p>
        </div>
      </div>
      <!-- End Buttons, appear only when cutscene finishes -->
      <div
        v-if="showEndButtons"
        class="tw-mt-8 tw-flex tw-flex-col md:tw-flex-row tw-items-center tw-space-y-4 md:tw-space-y-0 md:tw-space-x-4"
      >
        <button
          @click="
            $emit('end-cutscene');
            $emit('go-to-addition-subtraction');
          "
          class="tw-px-4 tw-py-2 tw-bg-blue-500 tw-text-white tw-rounded nes-btn is-primary"
        >
          Go to Adding and Subtracting!
        </button>
        <button
          @click="
            $emit('end-cutscene');
            $emit('go-to-multiplication-division');
          "
          class="tw-px-4 tw-py-2 tw-bg-blue-500 tw-text-white tw-rounded nes-btn is-success"
        >
          Go to Multiplying and Dividing!
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

export default {
  name: "SchoolCutscene",
  setup(props, { emit }) {
    const cutsceneActive = ref(true);

    const showEndButtons = computed(
      () => currentAnimation.value === "finished"
    );

    // Animation Frames and Indices
    const totalReadFrames = 6;
    const readFrame = ref(1);
    const headacheFrames = [0, 1, 2, 2];
    let headacheIndex = 0;
    const spinFrames = [1, 2, 3, 4];
    let spinIndex = 0;
    const standingFrames = [
      1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 3, 3, 3, 2, 2, 2,
    ];
    let standingIndex = 0;
    let standingClickCount = 0;

    // Animation State
    const currentAnimation = ref("reading");
    const currentImage = ref(`/assets/schoolassets/reading1.png`);

    const isAlerted = computed(() => currentAnimation.value === "alerted");
    const isShaking = computed(() => currentAnimation.value === "alerted");

    // Dialogue Text and Display
    const dialogueText = ref("Wow this is very interesting!");
    const displayedText = ref("");
    let index = 0;

    // Detect screen size
    const isSmallScreen = ref(window.innerWidth < 768);

    const updateScreenSize = () => {
      isSmallScreen.value = window.innerWidth < 768;
    };

    onMounted(() => {
      updateScreenSize();
      window.addEventListener("resize", updateScreenSize);

      typeText();

      setInterval(() => {
        if (currentAnimation.value === "reading") {
          readAnimation();
        } else if (currentAnimation.value === "headache") {
          headacheAnimation();
        } else if (currentAnimation.value === "spin") {
          spinAnimation();
        } else if (currentAnimation.value === "standing") {
          standingAnimation();
        }
      }, 75);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", updateScreenSize);
    });

    // Function to cycle through reading frames
    function readAnimation() {
      currentImage.value = `/assets/schoolassets/reading${readFrame.value}.png`;
      readFrame.value =
        readFrame.value < totalReadFrames ? readFrame.value + 1 : 1;
    }

    // Function to cycle through headache frames
    function headacheAnimation() {
      currentImage.value = `/assets/schoolassets/headache${headacheFrames[headacheIndex]}.png`;
      headacheIndex = (headacheIndex + 1) % headacheFrames.length;
    }

    // Function to cycle through spin frames
    function spinAnimation() {
      currentImage.value = `/assets/schoolassets/spin${spinFrames[spinIndex]}.png`;
      spinIndex = (spinIndex + 1) % spinFrames.length;
    }

    // Function to cycle through standing frames
    function standingAnimation() {
      currentImage.value = `/assets/schoolassets/standing${standingFrames[standingIndex]}.png`;
      standingIndex = (standingIndex + 1) % standingFrames.length;
    }

    // Function to toggle animation and update text
    function toggleAnimation() {
      if (!cutsceneActive.value) return;

      if (currentAnimation.value === "reading") {
        currentAnimation.value = "headache";
        dialogueText.value = "Oh no! I got sidetracked again";
      } else if (currentAnimation.value === "headache") {
        currentAnimation.value = "spin";
        dialogueText.value = "The library is still so messy!";
      } else if (currentAnimation.value === "spin") {
        currentAnimation.value = "alerted";
        currentImage.value = `/assets/schoolassets/spin4.png`;
        dialogueText.value = "Hey, you over there!";

        setTimeout(() => {
          currentAnimation.value = "standing";
          standingClickCount = 0;
          displayedText.value = "";
          index = 0;
          typeText();
        }, 750);
      } else if (currentAnimation.value === "standing") {
        if (standingClickCount === 0) {
          dialogueText.value = "The library is really messy...";
          standingClickCount++;
        } else if (standingClickCount === 1) {
          dialogueText.value = "I need help tidying the library";
          standingClickCount++;
        } else {
          currentAnimation.value = "carrying";
          currentImage.value = `/assets/schoolassets/carrying1.png`;
          dialogueText.value = "Can you help me sort it out?";
          standingClickCount = 0;
        }
      } else if (currentAnimation.value === "carrying") {
        currentAnimation.value = "finished";
        dialogueText.value = "Thank you very much!";
      } else if (currentAnimation.value === "finished") {
        cutsceneActive.value = false;
        return;
      }

      displayedText.value = "";
      index = 0;
      typeText();
    }

    // Function to display text letter by letter
    function typeText() {
      if (index < dialogueText.value.length) {
        displayedText.value += dialogueText.value.charAt(index);
        index++;
        setTimeout(typeText, 40);
      }
    }

    return {
      currentImage,
      displayedText,
      isAlerted,
      isShaking,
      toggleAnimation,
      showEndButtons,
      isSmallScreen,
    };
  },
};
</script>

<style scoped>
.nes-balloon,
.nes-btn,
.nes-container.is-rounded,
.nes-container.is-rounded.is-dark,
.nes-dialog.is-rounded,
.nes-dialog.is-rounded.is-dark,
.nes-progress,
.nes-progress.is-rounded,
.nes-table.is-bordered,
.nes-table.is-dark.is-bordered,
.nes-input,
.nes-textarea,
.nes-select select {
  border-style: solid;
  border-width: 4px;
}
.nes-balloon {
  border-image-slice: 3;
  border-image-width: 3;
  border-image-repeat: stretch;
  border-image-source: url('data:image/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8" ?><svg version="1.1" width="8" height="8" xmlns="http://www.w3.org/2000/svg"><path d="M3 1 h1 v1 h-1 z M4 1 h1 v1 h-1 z M2 2 h1 v1 h-1 z M5 2 h1 v1 h-1 z M1 3 h1 v1 h-1 z M6 3 h1 v1 h-1 z M1 4 h1 v1 h-1 z M6 4 h1 v1 h-1 z M2 5 h1 v1 h-1 z M5 5 h1 v1 h-1 z M3 6 h1 v1 h-1 z M4 6 h1 v1 h-1 z" fill="rgb(33,37,41)" /></svg>');
  border-image-outset: 2;
  position: relative;
  display: inline-block;
  padding: 1rem 1.5rem;
  margin: 8px;
  margin-bottom: 30px;
  background-color: #fff;
}
.nes-btn {
  border-image-slice: 2;
  border-image-width: 2;
  border-image-repeat: stretch;
  border-image-source: url('data:image/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8" ?><svg version="1.1" width="5" height="5" xmlns="http://www.w3.org/2000/svg"><path d="M2 1 h1 v1 h-1 z M1 2 h1 v1 h-1 z M3 2 h1 v1 h-1 z M2 3 h1 v1 h-1 z" fill="rgb(33,37,41)" /></svg>');
  border-image-outset: 2;
  position: relative;
  display: inline-block;
  padding: 6px 8px;
  margin: 4px;
  text-align: center;
  vertical-align: middle;
  cursor: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC)
      14 0,
    pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  color: #212529;
  background-color: #fff;
}
.nes-btn:hover {
  color: #212529;
  text-decoration: none;
  background-color: #e7e7e7;
}

.nes-btn:hover::after {
  box-shadow: inset -6px -6px #adafbc;
}

.nes-btn:focus {
  box-shadow: 0 0 0 6px rgba(173, 175, 188, 0.3);
}

.nes-btn:active:not(.is-disabled)::after {
  box-shadow: inset 4px 4px #adafbc;
}

.nes-btn:focus {
  outline: 0;
}

.nes-btn.is-disabled,
.nes-btn.is-disabled:hover,
.nes-btn.is-disabled:focus {
  color: #212529;
  cursor: not-allowed;
  background-color: #d3d3d3;
  box-shadow: inset -4px -4px #adafbc;
  opacity: 0.6;
}

.nes-btn.is-primary {
  color: #fff;
  background-color: #209cee;
}

.nes-btn.is-primary::after {
  position: absolute;
  top: -4px;
  right: -4px;
  bottom: -4px;
  left: -4px;
  content: "";
  box-shadow: inset -4px -4px #006bb3;
}

.nes-btn.is-primary:hover {
  color: #fff;
  text-decoration: none;
  background-color: #108de0;
}

.nes-btn.is-primary:hover::after {
  box-shadow: inset -6px -6px #006bb3;
}

.nes-btn.is-primary:focus {
  box-shadow: 0 0 0 6px rgba(0, 107, 179, 0.3);
}

.nes-btn.is-primary:active:not(.is-disabled)::after {
  box-shadow: inset 4px 4px #006bb3;
}

.nes-btn.is-success {
  color: #fff;
  background-color: #92cc41;
}

.nes-btn.is-success::after {
  position: absolute;
  top: -4px;
  right: -4px;
  bottom: -4px;
  left: -4px;
  content: "";
  box-shadow: inset -4px -4px #4aa52e;
}

.nes-btn.is-success:hover {
  color: #fff;
  text-decoration: none;
  background-color: #76c442;
}

.nes-btn.is-success:hover::after {
  box-shadow: inset -6px -6px #4aa52e;
}

.nes-btn.is-success:focus {
  box-shadow: 0 0 0 6px rgba(74, 165, 46, 0.3);
}

.nes-btn.is-success:active:not(.is-disabled)::after {
  box-shadow: inset 4px 4px #4aa52e;
}

.school-cutscene {
  font-family: "Press Start 2P", sans-serif;
  z-index: 1; /* Ensure the cutscene is below the navbar */
}

.character-size {
  width: 125px;
  height: auto;
  max-width: 100%;
}

.dialogue-position {
  position: absolute;
  bottom: 11rem; /* Anchor the box to the bottom */
  right: -17rem; /* Adjust initial horizontal position as needed */
  transform-origin: bottom; /* Ensures the box grows upward */
}

@media (max-width: 767px) {
  .dialogue-position {
    position: relative;
    bottom: auto;
    right: auto;
    transform: none;
    margin-top: 1rem;
  }
}

.nes-balloon {
  display: inline-block;
  width: 280px;
  padding: 1rem;
  overflow-wrap: break-word;
  text-align: left;
}

.nes-container {
  display: inline-block;
  width: 100%;
  padding: 1rem;
  overflow-wrap: break-word;
  text-align: left;
  background-color: #f5f5f5;
  border: 2px solid #000;
  border-radius: 8px;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .character-size {
    width: 100px;
  }

  .nes-balloon {
    width: 200px;
    padding: 0.5rem;
  }
}

@media (max-width: 480px) {
  .character-size {
    width: 80px;
  }

  .nes-balloon {
    width: 150px;
    padding: 0.25rem;
  }
}

/* Shake Animation */
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-8px);
  }
  50% {
    transform: translateX(8px);
  }
  75% {
    transform: translateX(-8px);
  }
}

.shake {
  animation: shake 0.3s;
}

/* Wiggle Animation */
@keyframes tw-wiggle {
  0%,
  100% {
    transform: rotate(0);
  }
  25% {
    transform: rotate(-3deg);
  }
  75% {
    transform: rotate(3deg);
  }
}

/* .wiggle-button {
  transition: background-color 0.3s ease, transform 0.1s ease;
}

.wiggle-button:hover {
  background-color: #22c55e;
  animation: tw-wiggle 0.5s infinite;
  color: white;
} */
</style>
