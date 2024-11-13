<template>
  <div class="cutscene md:tw-overflow-hidden tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-center tw-min-h-[calc(100vh-56px)]">

    <!-- Cutscene Container -->
    <div class="nes-container is-rounded is-centered with-title tw-max-w-3xl" style="background-color: rgba(255, 245, 205, 1);">
      <p class="title" style="background-color: rgba(255, 245, 205, 1); margin-bottom: 0">School</p>
      <button class="tw-absolute tw-top-0 tw-left-0 tw-m-2 nes-btn" @click="skipCutscene" v-if="currentAnimation!='finished'">Skip</button>
      <div class="tw-max-w-3xl tw-min-h-[450px] tw-flex tw-flex-col tw-items-center tw-justify-center" @click="toggleAnimation">
        <div class="tw-relative tw-inline-block tw-text-center">

          <!-- Character Image with Animation -->
          <img
            :src="currentImage"
            :class="{ shake: isShaking }"
            alt="Character Animation"
            class="character-size tw-object-contain tw-mx-auto"
          />
 
          <!-- Exclamation Icon for Alerted State -->
          <img
            v-if="isAlerted"
            src="/assets/schoolassets/exclamation.png"
            alt="Exclamation"
            :class="{ shake: isAlerted }"
            class="tw-absolute tw--top-9 tw-left-1/4 tw-w-16 tw-h-16"
          />

          <!-- Dialogue Speech Bubble -->
          <div
            v-if="!isAlerted"
            :class="[
              'dialogue-position',
              isSmallScreen ? 'nes-container is-rounded tw-bg-white' : 'nes-balloon from-left',
            ]"
          >
            <p>{{ displayedText }}</p>
          </div>

          <!-- End Buttons, appear only when cutscene finishes -->
          <div
          v-if="showEndButtons"
          class="tw-absolute tw-bottom-[-6rem] tw-left-1/2 tw-transform tw--translate-x-1/2 tw-flex tw-gap-10"
          >
            <button
              @click="
                $emit('end-cutscene');
                $emit('go-to-addition-subtraction');
              "
              class="wiggle-button nes-btn is-primary"
              style="width: 300px;"
            >
              Go to Adding and Subtracting!
            </button>
            <button
              @click="
                $emit('end-cutscene');
                $emit('go-to-multiplication-division');
              "
              class="wiggle-button nes-btn is-success"
              style="width: 300px;"
            >
              Go to Multiplying and Dividing!
            </button>

            <!-- Temporary button to test out new MD-->
            <button
              @click="
                $emit('end-cutscene');
                $emit('go-to-new-multiplication-division');
              "
              class="wiggle-button nes-btn is-success"
            >
              Go to NEW Multiplying and Dividing!
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
        dialogueText.value = "Oh no! I got sidetracked again...";
      } else if (currentAnimation.value === "headache") {
        currentAnimation.value = "spin";
        dialogueText.value = "The school is still so messy!";
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
          dialogueText.value = "The school is in a mess!";
          standingClickCount++;
        } else if (standingClickCount === 1) {
          dialogueText.value = "I need help tidying the school.";
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

    const skipCutscene = () => {
        currentAnimation.value = "finished";
        currentImage.value = `/assets/schoolassets/carrying1.png`;
        dialogueText.value = "Thank you very much!";
        displayedText.value = dialogueText.value;
        cutsceneActive.value = false;
    };

    return {
      currentImage,
      displayedText,
      isAlerted,
      isShaking,
      currentAnimation,
      toggleAnimation,
      showEndButtons,
      isSmallScreen,
      skipCutscene
    };
  },
};
</script>

<style scoped>
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
        0%, 100% { transform: rotate(0); }
        25% { transform: rotate(-3deg); }
        75% { transform: rotate(3deg); }
}

.wiggle-button:hover {
        animation: tw-wiggle 0.5s infinite;
}
</style>
