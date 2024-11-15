<template>
  <div
    class="cutscene md:tw-overflow-hidden tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-center tw-min-h-[calc(100vh-56px)]"
  >
    <!-- Cutscene Container -->
    <div
      class="nes-container is-rounded is-centered with-title tw-max-w-3xl"
      style="background-color: rgba(255, 245, 205, 1)"
    >
      <p class="title" style="background-color: rgba(255, 245, 205, 1); margin-bottom: 0">
        Supermarket
      </p>

      <button
        class="tw-absolute tw-top-0 tw-left-0 tw-m-2 nes-btn"
        @click="skipCutscene"
        v-if="currentAnimation != 'finished'"
      >
        Skip
      </button>

      <div
        class="tw-max-w-3xl tw-min-h-[450px] tw-flex tw-flex-col tw-items-center tw-justify-center"
        @click="toggleAnimation"
      >
        <div class="tw-relative tw-inline-block tw-text-center">
          <!-- Character Image with Animation -->
          <img
            :src="currentImage"
            :class="{ shake: isAlerted }"
            alt="Character Animation"
            class="character-size tw-object-contain tw-mx-auto"
          />

          <!-- Exclamation Icon for Alerted State, with custom position -->
          <img
            v-if="isAlerted"
            src="/assets/marketassets/exclamation.png"
            alt="Exclamation"
            :class="{ shake: isAlerted }"
            class="tw-absolute tw--top-9 tw-left-1/4 tw-w-16 tw-h-16"
          />

          <!-- Dialogue Speech Bubble -->
          <div
            v-if="!isAlerted"
            :class="[
              'dialogue-position',
              isSmallScreen
                ? 'nes-container is-rounded'
                : 'nes-balloon from-left',
            ]"
          >
            <p>{{ displayedText }}</p>
          </div>

          <!-- End Buttons, appear only when cutscene finishes -->
          <div
            v-if="showEndButtons"
            class="tw-absolute tw-bottom-[-6rem] tw-left-1/2 tw-transform tw--translate-x-1/2 tw-flex tw-gap-20"
          >
            <button
              @click="
                $emit('end-cutscene');
                $emit('go-to-counting');
              "
              class="wiggle-button nes-btn is-primary"
            >
              Go to Counting!
            </button>
            <button
              @click="
                $emit('end-cutscene');
                $emit('go-to-ordering');
              "
              class="wiggle-button nes-btn is-success"
            >
              Go to Ordering!
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

export default {
  setup(props, { emit }) {
    const cutsceneActive = ref(true);

    // Computed property to show the end buttons when the cutscene ends
    const showEndButtons = computed(
      () =>
        currentAnimation.value === "finished" &&
        dialogueText.value === "Thank you very much!"
    );

    // Running Animation Frames
    const totalRunFrames = 6;
    const runFrame = ref(1);

    // Breathing Animation Frames
    const breatheFrames = [1, 2, 3, 4, 4, 4, 3, 2];
    let breatheIndex = 0;

    // Shocked Animation Frames
    const shockedFrames = [1, 2, 2];
    let shockedIndex = 0;

    // Standing Animation Frames
    const standingFrames = [
      1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 3, 3, 3, 2, 2, 2,
    ];
    let standingIndex = 0;
    let standingClickCount = 0; // Track consecutive clicks in standing mode

    // Animation State
    const currentAnimation = ref("running"); // Initial animation
    const currentImage = ref(`/assets/marketassets/run${runFrame.value}.png`);

    const isAlerted = computed(() => currentAnimation.value === "alerted");

    // Computed property to show the button when the cutscene ends
    const showEndButton = computed(
      () =>
        currentAnimation.value === "finished" &&
        dialogueText.value === "Thank you very much!"
    );

    // Dialogue Text and Display
    const dialogueText = ref("NOOOOOOOOOOOO!!"); // Initial text for running
    const displayedText = ref("");
    let index = 0;

    // Function to cycle through running frames
    function runAnimation() {
      currentImage.value = `/assets/marketassets/run${runFrame.value}.png`;
      runFrame.value = runFrame.value < totalRunFrames ? runFrame.value + 1 : 1;
    }

    // Function to cycle through breathing frames
    function breatheAnimation() {
      currentImage.value = `/assets/marketassets/breathe${breatheFrames[breatheIndex]}.png`;
      breatheIndex = (breatheIndex + 1) % breatheFrames.length;
    }

    // Function to cycle through shocked frames
    function shockedAnimation() {
      currentImage.value = `/assets/marketassets/shocked${shockedFrames[shockedIndex]}.png`;
      shockedIndex = (shockedIndex + 1) % shockedFrames.length;
    }

    // Function to cycle through standing frames
    function standingAnimation() {
      currentImage.value = `/assets/marketassets/standing${standingFrames[standingIndex]}.png`;
      standingIndex = (standingIndex + 1) % standingFrames.length;
    }

    // Function to toggle animation and update text
    function toggleAnimation() {
      if (currentAnimation.value === "finished") {
        cutsceneActive.value = false; // Disable further clicks after cutscene ends
      }

      if (!cutsceneActive.value) return; // Prevent advancing if cutscene is complete

      if (currentAnimation.value === "running") {
        currentAnimation.value = "breathing";
        dialogueText.value = "huff... puff... gasp...";
      } else if (currentAnimation.value === "breathing") {
        currentAnimation.value = "shocked";
        dialogueText.value = "The apples!!!!";
      } else if (currentAnimation.value === "shocked") {
        if (dialogueText.value === "The apples!!!!") {
          dialogueText.value = "The queues!!!!";
        } else {
          currentAnimation.value = "alerted";
          currentImage.value = `/assets/marketassets/alert1.png`;
          dialogueText.value = "Hey, you over there!";

          const imgElement = document.querySelector("img");
          imgElement.classList.add("shake");

          setTimeout(() => {
            imgElement.classList.remove("tw-shake");
            currentAnimation.value = "standing";
            standingClickCount++;
            displayedText.value = "";
            index = 0;
            typeText();
          }, 750);
        }
      } else if (currentAnimation.value === "standing") {
        if (
          dialogueText.value === "The market's apples have spilt everywhere..."
        ) {
          dialogueText.value = "The queues are out of control...";
        } else if (standingClickCount < 2) {
          dialogueText.value = "The market's apples have spilt everywhere...";
          standingClickCount++;
        } else {
          currentAnimation.value = "carrying";
          currentImage.value = `/assets/marketassets/carrying1.png`;
          dialogueText.value = "Could you help me with the apples and queues?";
          standingClickCount = 0;
        }
      } else if (currentAnimation.value === "carrying") {
        currentAnimation.value = "finished";
        dialogueText.value = "Thank you very much!";

        const imgElement = document.querySelector("img");
        imgElement.classList.add("tw-shake");

        setTimeout(() => {
          imgElement.classList.remove("tw-shake");
        }, 1500);
      } else {
        currentAnimation.value = "running";
        dialogueText.value = "NOOOOOOOOOOOO!!";
      }

      displayedText.value = "";
      index = 0;
      typeText();
    }

    // Emit end-cutscene event to the parent component
    function endCutscene() {
      emit("end-cutscene");
    }

    // Function to display text letter by letter
    function typeText() {
      if (index < dialogueText.value.length) {
        displayedText.value += dialogueText.value.charAt(index);
        index++;
        setTimeout(typeText, 40);
      }
    }

    const skipCutscene = () => {
      currentAnimation.value = "finished";
      currentImage.value = `/assets/marketassets/carrying1.png`;
      dialogueText.value = "Thank you very much!";
      displayedText.value = dialogueText.value;
      cutsceneActive.value = false;
    };

    // Detect screen size
    const isSmallScreen = ref(window.innerWidth < 768);

    const updateScreenSize = () => {
      isSmallScreen.value = window.innerWidth < 768;
    };

    onBeforeUnmount(() => {
      window.removeEventListener("resize", updateScreenSize);
    });

    // Start the typewriter effect on mount
    onMounted(() => {
      updateScreenSize();
      window.addEventListener("resize", updateScreenSize);

      typeText();

      // Start the appropriate animation based on currentAnimation state
      setInterval(() => {
        if (currentAnimation.value === "running") {
          runAnimation();
        } else if (currentAnimation.value === "breathing") {
          breatheAnimation();
        } else if (currentAnimation.value === "shocked") {
          shockedAnimation();
        } else if (currentAnimation.value === "standing") {
          standingAnimation();
        }
      }, 75);
    });

    return {
      currentImage,
      displayedText,
      currentAnimation,
      isAlerted,
      showEndButton,
      cutsceneActive,
      showEndButtons,
      toggleAnimation,
      endCutscene,
      isSmallScreen,
      updateScreenSize,
      skipCutscene
    };
  },
};
</script>

<style scoped>
.nes-btn {
  border-image-slice: 2;
  border-image-width: 2;
  border-image-repeat: stretch;
  border-image-source: url('data:image/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8" ?><svg version="1.1" width="5" height="5" xmlns="http://www.w3.org/2000/svg"><path d="M2 1 h1 v1 h-1 z M1 2 h1 v1 h-1 z M3 2 h1 v1 h-1 z M2 3 h1 v1 h-1 z" fill="rgb(33,37,41)" /></svg>');
  border-image-outset: 2;
}

.nes-container.is-rounded {
  border-image-slice: 3;
  border-image-width: 3;
  border-image-repeat: stretch;
  border-image-source: url('data:image/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8" ?><svg version="1.1" width="8" height="8" xmlns="http://www.w3.org/2000/svg"><path d="M3 1 h1 v1 h-1 z M4 1 h1 v1 h-1 z M2 2 h1 v1 h-1 z M5 2 h1 v1 h-1 z M1 3 h1 v1 h-1 z M6 3 h1 v1 h-1 z M1 4 h1 v1 h-1 z M6 4 h1 v1 h-1 z M2 5 h1 v1 h-1 z M5 5 h1 v1 h-1 z M3 6 h1 v1 h-1 z M4 6 h1 v1 h-1 z" fill="rgb(33,37,41)" /></svg>');
  border-image-outset: 2;
}

.nes-balloon {
  border-image-slice: 3;
  border-image-width: 3;
  border-image-repeat: stretch;
  border-image-source: url('data:image/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8" ?><svg version="1.1" width="8" height="8" xmlns="http://www.w3.org/2000/svg"><path d="M3 1 h1 v1 h-1 z M4 1 h1 v1 h-1 z M2 2 h1 v1 h-1 z M5 2 h1 v1 h-1 z M1 3 h1 v1 h-1 z M6 3 h1 v1 h-1 z M1 4 h1 v1 h-1 z M6 4 h1 v1 h-1 z M2 5 h1 v1 h-1 z M5 5 h1 v1 h-1 z M3 6 h1 v1 h-1 z M4 6 h1 v1 h-1 z" fill="rgb(33,37,41)" /></svg>');
  border-image-outset: 2;
}

.cutscene {
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

.wiggle-button:hover {
  animation: tw-wiggle 0.5s infinite;
}
</style>
