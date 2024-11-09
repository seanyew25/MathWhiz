<template>
  <div class="tw-absolute tw-inset-0 tw-flex tw-items-center tw-justify-center tw-text-center tw-top-[var(--navbar-height)]" @click="toggleAnimation">
  <div class="tw-relative tw-inline-block tw-text-center">
    <!-- Character Image with Animation -->
    <img :src="currentImage" :class="{ shake: currentAnimation.value === 'alerted' }" 
        alt="Character Animation" class="character-size tw-object-contain tw-mx-auto" />

    <!-- Exclamation Icon for Alerted State, with custom position -->
    <img v-if="isAlerted" src="/assets/MarketImages/exclamation.png" alt="Exclamation" 
        :class="{ shake: isAlerted }"
        class="tw-absolute tw--top-9 tw-left-1/4 tw-w-16 tw-h-16" />

    <!-- Dialogue Speech Bubble -->
    <div v-if="!isAlerted" class="nes-balloon from-left dialogue-position">
        <p>{{ displayedText }}</p>
    </div>

    <!-- End Buttons, appear only when cutscene finishes -->
    <div v-if="showEndButtons" class="tw-absolute tw-bottom-[-6rem] tw-left-1/2 tw-transform tw--translate-x-1/2 tw-flex tw-gap-20">
      <button @click="$emit('end-cutscene'); $emit('go-to-counting')" class="tw-px-4 tw-py-2 tw-bg-blue-500 tw-text-white tw-rounded wiggle-button">Go to Counting!</button>
      <button @click="$emit('end-cutscene'); $emit('go-to-ordering')" class="tw-px-4 tw-py-2 tw-bg-blue-500 tw-text-white tw-rounded wiggle-button">Go to Ordering!</button>
    </div>
  </div>
</div>
</template>


<script>
import { ref, computed, onMounted, reactive } from 'vue';

export default {
  setup(props, { emit }) {
    const cutsceneActive = ref(true);

    // Computed property to show the end buttons when the cutscene ends
    const showEndButtons = computed(() => currentAnimation.value === "finished" && dialogueText.value === "Thank you very much!");

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
    const standingFrames = [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 3, 3, 3, 2, 2, 2];
    let standingIndex = 0;
    let standingClickCount = 0; // Track consecutive clicks in standing mode

    // Animation State
    const currentAnimation = ref("running"); // Initial animation
    const currentImage = ref(`/assets/MarketImages/run${runFrame.value}.png`);

    const isAlerted = computed(() => currentAnimation.value === "alerted");

    // Computed property to show the button when the cutscene ends
    const showEndButton = computed(() => currentAnimation.value === "finished" && dialogueText.value === "Thank you very much!");

    // Dialogue Text and Display
    const dialogueText = ref("NOOOOOOOOOOOO!!"); // Initial text for running
    const displayedText = ref("");
    let index = 0;

    // Function to cycle through running frames
    function runAnimation() {
        currentImage.value = `/assets/MarketImages/run${runFrame.value}.png`;
        runFrame.value = runFrame.value < totalRunFrames ? runFrame.value + 1 : 1;
    }

    // Function to cycle through breathing frames
    function breatheAnimation() {
        currentImage.value = `/assets/MarketImages/breathe${breatheFrames[breatheIndex]}.png`;
        breatheIndex = (breatheIndex + 1) % breatheFrames.length;
    }

    // Function to cycle through shocked frames
    function shockedAnimation() {
        currentImage.value = `/assets/MarketImages/shocked${shockedFrames[shockedIndex]}.png`;
        shockedIndex = (shockedIndex + 1) % shockedFrames.length;
    }

    // Function to cycle through standing frames
    function standingAnimation() {
        currentImage.value = `/assets/MarketImages/standing${standingFrames[standingIndex]}.png`;
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
              currentImage.value = `/assets/MarketImages/alert1.png`;
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
          if (dialogueText.value === "The market's apples have spilt everywhere...") {
              dialogueText.value = "The queues are out of control...";
          } else if (standingClickCount < 2) {
              dialogueText.value = "The market's apples have spilt everywhere...";
              standingClickCount++;
          } else {
              currentAnimation.value = "carrying";
              currentImage.value = `/assets/MarketImages/carrying1.png`;
              dialogueText.value = "Could you help me count the apples and manage the queues?";
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

    // Start the typewriter effect on mount
    onMounted(() => {
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
        const navbar = document.querySelector(".navbar");
        if (navbar) {
            navbarHeight.value = navbar.offsetHeight;
            document.documentElement.style.setProperty("--navbar-height", `${navbarHeight.value}px`);
        }
    });

    const navbarHeight = ref(0);

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
      navbarHeight
    };
  }
};
</script>

<style scoped>
* {
    font-family: 'Press Start 2P', sans-serif;
}

.dialogue-position {
        position: absolute;
        bottom: 11rem; /* Anchor the box to the bottom */
        right: -17rem; /* Adjust initial horizontal position as needed */
        transform-origin: bottom; /* Ensures the box grows upward */
}

.nes-balloon {
        display: inline-block;
        width: 280px; /* Fixed width to prevent horizontal growth */
        padding: 1rem;
        overflow-wrap: break-word; /* Wraps text within the fixed width */
        text-align: left; /* Keeps text left-aligned within the fixed width */
}

.character-size {
        width: 125px; /* Set desired width */
        height: auto; /* Maintain aspect ratio */
        max-width: 100%; /* Ensure responsiveness within container */
}

@keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-8px); }
        50% { transform: translateX(8px); }
        75% { transform: translateX(-8px); }
}

.shake {
        animation: shake 0.3s; /* Adjust duration as needed */
}

/* Wiggle animation */
@keyframes tw-wiggle {
        0%, 100% { transform: rotate(0); }
        25% { transform: rotate(-3deg); }
        75% { transform: rotate(3deg); }
}

/* Button hover styles */
.wiggle-button {
        transition: background-color 0.3s ease, transform 0.1s ease;
}

.wiggle-button:hover {
        background-color: #22c55e; /* Tailwind's green-500 */
        animation: tw-wiggle 0.5s infinite;
        color: white;
}
</style>
