<template>
  <div
    class="cutscene md:tw-overflow-hidden tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-center tw-min-h-[calc(100vh-56px)]"
  >
    <!-- Cutscene Container -->
    <div
      class="nes-container is-rounded is-centered with-title tw-max-w-3xl"
      style="background-color: rgba(255, 245, 205, 1)"
    >
      <p class="title" style="background-color: rgba(255, 245, 205, 1)">Bank</p>
      <div
        class="tw-max-w-3xl tw-min-h-[450px] tw-flex tw-flex-col tw-items-center tw-justify-center"
        @click="toggleAnimation"
      >
        <div class="tw-relative tw-inline-block tw-text-center">
          <!-- Character Image with Animation -->
          <img
            :src="currentImage"
            :class="[
              { shake: currentAnimation.value === 'alerted' },
              currentAnimation.value === 'fall' ? 'tw-my-auto' : 'tw-mx-auto',
            ]"
            alt="Character Animation"
            class="character-size tw-object-contain"
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
                $emit('go-to-bank-game');
              "
              class="wiggle-button nes-btn is-primary"
            >
              Go to Counting Money!
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

    // walking Animation Frames
    const totalWalkFrames = 5;
    const walkFrame = ref(0);

    // headache Animation Frames
    const phoneFrames = [0, 1, 2, 3, 4, 5];
    let phoneIndex = 0;

    // headache Animation Frames
    const headacheFrames = [1, 1, 2, 2, 3, 3];
    let headacheIndex = 0;

    // Standing Animation Frames
    const standingFrames = [1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2];
    let standingIndex = 0;
    let standingClickCount = 0; // Track consecutive clicks in standing mode

    // Animation State
    const currentAnimation = ref("walking"); // Initial animation
    const currentImage = ref(
      `/assets/bankassets/cutscene/walk${walkFrame.value}.png`
    );

    const isAlerted = computed(() => currentAnimation.value === "alerted");

    // Computed property to show the button when the cutscene ends
    const showEndButton = computed(
      () =>
        currentAnimation.value === "finished" &&
        dialogueText.value === "Thank you very much!"
    );

    // Dialogue Text and Display
    const dialogueText = ref("Today I will deposit my piggybank at the bank!"); // Initial text for walking
    const displayedText = ref("");
    let index = 0;

    // Function to cycle through walking frames
    function runAnimation() {
      currentImage.value = `/assets/bankassets/cutscene/walk${walkFrame.value}.png`;
      walkFrame.value =
        walkFrame.value < totalWalkFrames ? walkFrame.value + 1 : 1;
    }

    // Function to cycle through headache frames
    function phoneAnimation() {
      currentImage.value = `/assets/bankassets/cutscene/phone${phoneFrames[phoneIndex]}.png`;
      phoneIndex = (phoneIndex + 1) % phoneFrames.length;
    }

    // Function to cycle through headache frames
    function headacheAnimation() {
      currentImage.value = `/assets/bankassets/cutscene/headache${headacheFrames[headacheIndex]}.png`;
      headacheIndex = (headacheIndex + 1) % headacheFrames.length;
    }

    // Function to cycle through standing frames
    function standingAnimation() {
      currentImage.value = `/assets/bankassets/cutscene/standing${standingFrames[standingIndex]}.png`;
      standingIndex = (standingIndex + 1) % standingFrames.length;
    }

    // Function to toggle animation and update text
    function toggleAnimation() {
      if (currentAnimation.value === "finished") {
        cutsceneActive.value = false; // Disable further clicks after cutscene ends
      }

      if (!cutsceneActive.value) return; // Prevent advancing if cutscene is complete

      if (currentAnimation.value === "walking") {
        currentAnimation.value = "phone";
        dialogueText.value = "It's time to use my phone to count the money!";
      } else if (currentAnimation.value === "phone") {
        currentAnimation.value = "headache";
        dialogueText.value = "NOOOOO!!! There's no battery left!!";
      } else if (currentAnimation.value === "headache") {
        if (dialogueText.value === "NOOOOO!!! There's no battery left!!") {
          dialogueText.value =
            "Mummy is going to scold me if I don't deposit this...";
        } else {
          currentAnimation.value = "alerted";
          currentImage.value = `/assets/bankassets/cutscene/alerted.png`;
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
        if (dialogueText.value === "Hey, you over there!") {
          dialogueText.value =
            "My math is bad and I need to deposit my piggybank";
        } else if (standingClickCount < 2) {
          dialogueText.value = "Can you please help me?";
          standingClickCount++;
          currentAnimation.value = "neutral";
          currentImage.value = `/assets/bankassets/cutscene/standing1.png`;
          //   dialogueText.value = "Thank you very much!";
          standingClickCount = 0;
        }
      } else if (currentAnimation.value === "neutral") {
        currentAnimation.value = "finished";
        dialogueText.value = "Thank you very much!";

        const imgElement = document.querySelector("img");
        imgElement.classList.add("tw-shake");

        setTimeout(() => {
          imgElement.classList.remove("tw-shake");
        }, 1500);
      } else {
        currentAnimation.value = "walking";
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
        if (currentAnimation.value === "walking") {
          runAnimation();
        } else if (currentAnimation.value === "phone") {
          phoneAnimation();
        } else if (currentAnimation.value === "headache") {
          headacheAnimation();
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
    };
  },
};
</script>

<style scoped>
.cutscene {
  font-family: "Press Start 2P", sans-serif;
  z-index: 1; /* Ensure the cutscene is below the navbar */
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
  width: 280px; /* Fixed width to prevent horizontal growth */
  padding: 1rem;
  overflow-wrap: break-word; /* Wraps text within the fixed width */
  text-align: left; /* Keeps text left-aligned within the fixed width */
}

.nes-container {
  display: inline-block;
  width: 100%;
  padding: 1rem;
  overflow-wrap: break-word;
  text-align: left;
}

.character-size {
  width: 125px; /* Set desired width */
  height: auto; /* Maintain aspect ratio */
  max-width: 100%; /* Ensure responsiveness within container */
}

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
  animation: shake 0.3s; /* Adjust duration as needed */
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
</style>
