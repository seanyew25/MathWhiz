<template>
  <div>
    <cutscene v-if="currentView === 'cutscene'" @end-cutscene="showCounting"></cutscene>
    <counting v-if="currentView === 'counting'" @end-counting="showOrdering"></counting>
    <ordering v-if="currentView === 'ordering'"></ordering>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'Market',
  components: {
    Cutscene,
    Counting,
    Ordering,
  },
  setup() {
    const currentView = ref('cutscene'); // Start with cutscene view

    const showCounting = () => {
      currentView.value = 'counting';
    };

    const showOrdering = () => {
      currentView.value = 'ordering';
    };

    return {
      currentView,
      showCounting,
      showOrdering,
    };
  },
};

// Cutscene Component
const Cutscene = {
  template: `
  <div class="absolute inset-0 flex items-center justify-center text-center" @click="toggleAnimation">
    <div class="relative inline-block text-center">
      <!-- Character Image with Animation -->
      <img :src="currentImage" :class="{ shake: currentAnimation.value === 'alerted' }" 
          alt="Character Animation" class="character-size object-contain mx-auto" />

      <!-- Exclamation Icon for Alerted State, with custom position -->
      <img v-if="isAlerted" src="images/exclamation.png" alt="Exclamation" 
          :class="{ shake: isAlerted }"
          class="absolute -top-9 left-1/4 w-16 h-16" />

      <!-- Dialogue Speech Bubble -->
      <div v-if="!isAlerted" class="nes-balloon from-left dialogue-position">
          <p>{{ displayedText }}</p>
      </div>

      <!-- End Buttons, appear only when cutscene finishes -->
      <div v-if="showEndButtons" class="absolute bottom-[-6rem] left-1/2 transform -translate-x-1/2 flex gap-20">
          <a href="market_counting.html" class="px-4 py-2 bg-blue-500 text-white rounded wiggle-button">Go to Counting!</a>
          <a href="market_ordering.html" class="px-4 py-2 bg-blue-500 text-white rounded wiggle-button">Go to Ordering!</a>
      </div>
    </div>
  </div>
  `,
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
      const currentImage = ref(`images/run${runFrame.value}.png`);

      const isAlerted = computed(() => currentAnimation.value === "alerted");

      // Computed property to show the button when the cutscene ends
      const showEndButton = computed(() => currentAnimation.value === "finished" && dialogueText.value === "Thank you very much!");

      // Dialogue Text and Display
      const dialogueText = ref("NOOOOOOOOOOOO!!"); // Initial text for running
      const displayedText = ref("");
      let index = 0;

      // Function to cycle through running frames
      function runAnimation() {
          currentImage.value = `images/run${runFrame.value}.png`;
          runFrame.value = runFrame.value < totalRunFrames ? runFrame.value + 1 : 1;
      }

      // Function to cycle through breathing frames
      function breatheAnimation() {
          currentImage.value = `images/breathe${breatheFrames[breatheIndex]}.png`;
          breatheIndex = (breatheIndex + 1) % breatheFrames.length;
      }

      // Function to cycle through shocked frames
      function shockedAnimation() {
          currentImage.value = `images/shocked${shockedFrames[shockedIndex]}.png`;
          shockedIndex = (shockedIndex + 1) % shockedFrames.length;
      }

      // Function to cycle through standing frames
      function standingAnimation() {
          currentImage.value = `images/standing${standingFrames[standingIndex]}.png`;
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
                // Stay in shocked state, but change the text
                dialogueText.value = "The queues!!!!";
            } else {
                // Proceed to alerted state as usual
                currentAnimation.value = "alerted";
                currentImage.value = `images/alert1.png`;
                dialogueText.value = "Hey, you over there!";
          
                // Apply the shake effect by adding the class
                const imgElement = document.querySelector("img");
                imgElement.classList.add("shake");
          
                // Remove the shake effect after 300ms
                setTimeout(() => {
                    imgElement.classList.remove("shake");
                    currentAnimation.value = "standing"; // Switch to standing after shake
                    standingClickCount++;
                    displayedText.value = ""; // Clear displayed text for typewriter effect
                    index = 0; // Reset index
                    typeText(); // Restart typewriter effect
                }, 750); // Duration of the alert/shake effect
            }
        } else if (currentAnimation.value === "standing") {
            if (dialogueText.value === "The market's apples have spilt everywhere...") {
                // Stay in standing state, but change the text
                dialogueText.value = "The queues are out of control...";
            } else if (standingClickCount < 2) {
                // Cycle between initial standing dialogues as usual
                dialogueText.value = "The market's apples have spilt everywhere...";
                standingClickCount++;
            } else {
                // Proceed to the carrying state as usual
                currentAnimation.value = "carrying";
                currentImage.value = `images/carrying1.png`;
                dialogueText.value = "Could you help me count the apples and manage the queues?";
                standingClickCount = 0; // Reset for future clicks
            }
        } else if (currentAnimation.value === "carrying") {
            currentAnimation.value = "finished";
            dialogueText.value = "Thank you very much!";
          
            // Apply the shake effect for the final dialogue
            const imgElement = document.querySelector("img");
            imgElement.classList.add("shake");
          
            setTimeout(() => {
                imgElement.classList.remove("shake");
            }, 1500); // Duration of the shake effect
        } else {
            currentAnimation.value = "running";
            dialogueText.value = "NOOOOOOOOOOOO!!";
        }
    
        displayedText.value = ""; // Clear displayed text for typewriter effect
        index = 0; // Reset index
        typeText(); // Restart typewriter effect
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
              setTimeout(typeText, 40); // Adjust speed if needed
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
          }, 75); // Adjust interval for animation speed
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
        endCutscene
      };
  }
};

// Counting Game Component
const Counting = {
  template:`
    <div>
      <h3 class="text-2xl font-bold mb-6 flex justify-center items-center gap-4">
        Make a total of: {{ targetNumber }}
        <button @click="showHintModal = true" class="px-3 py-1 bg-blue-500 text-white rounded">Hint</button>
      </h3>
      
      <div v-if="showHintModal" class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
        <div class="bg-white p-6 rounded shadow-md text-center">
          <p class="text-lg mb-4">In Hint Mode, click items to preview them in the target box with a counter.<br>Do you want to turn on Hint Mode?</p>
          <button @click="getHint(true)" class="px-4 py-2 bg-green-500 text-white rounded mr-2">Yes</button>
          <button @click="getHint(false)" class="px-4 py-2 bg-red-500 text-white rounded">No</button>
        </div>
      </div>
  
      <div class="grid-container">
        <div v-for="(grid, index) in grids" :key="index" class="grid-item">
          <div class="object-grid">
            <div v-for="object in grid" :key="object.id" :class="['object', { 'selected': object.selected }]" @click="toggleSelectById(object.id)" ref="objects" :data-id="object.id" v-bind:style="{ visibility: object.visible ? 'visible' : 'hidden' }">
              <img :src="object.image" :alt="object.type" class="w-full h-full object-contain" />
            </div>
          </div>
          <p style="font-family:'Press Start 2P'; font-size: 22px; margin-top: 15px;">{{ labels[index] }}</p>
        </div>
      </div>
  
      <button class="px-6 py-2 bg-green-500 text-white rounded mt-6" @click="submitAnswer">Submit</button>
  
      <div class="flex justify-center gap-8 mt-8">
        <div ref="hundredsBox" class="target-box"></div>
        <div ref="tensBox" class="target-box"></div>
        <div ref="onesBox" class="target-box"></div>
      </div>
  
      <p class="mt-4 text-lg" :class="feedbackClass">{{ feedbackMessage }}</p>
    </div>
  `,
  setup() {
    // Reactive data
    const targetNumber = ref(0);
    const feedbackMessage = ref('');
    const feedbackClass = ref('');
    const showHintModal = ref(false);
    const hintMode = ref(false);

    const labels = ["Hundreds", "Tens", "Ones"];
    const grids = ref([]);
    const objects = ref([]);
    const hundredsBox = ref(null);
    const tensBox = ref(null);
    const onesBox = ref(null);
    
    const itemCounts = reactive({ hundreds: 0, tens: 0, ones: 0 });
    const tempCounters = reactive({ hundreds: 0, tens: 0, ones: 0 });
    const ghostCounters = reactive({ hundreds: 0, tens: 0, ones: 0 });

    // Methods
    const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    const generateObjects = () => {
      let idCounter = 0;
      objects.value = [
        ...Array.from({ length: 9 }, () => ({ id: idCounter++, type: 'apple', value: 1, selected: false, visible: true, image: 'images/apple.png' })),
        ...Array.from({ length: 9 }, () => ({ id: idCounter++, type: 'basket', value: 10, selected: false, visible: true, image: 'images/basket.png' })),
        ...Array.from({ length: 9 }, () => ({ id: idCounter++, type: 'crate', value: 100, selected: false, visible: true, image: 'images/crate.png' }))
      ];
    };

    const generateGrids = () => {
      grids.value = ['crate', 'basket', 'apple'].map(type => objects.value.filter(obj => obj.type === type));
    };

    const toggleHintMode = () => {
        hintMode.value = true;
        console.log("Hint mode activated");
    
        // Display ghost images for items that were already selected before hint mode was turned on
        objects.value.forEach(object => {
            if (object.selected) {
                const boxType = object.value === 100 ? 'hundreds' : object.value === 10 ? 'tens' : 'ones';
                ghostCounters[boxType]++;
                addGhostImageToBox(object, boxType, true);
            }
        });
    };

    const toggleSelectById = (id) => {
      const object = objects.value.find(obj => obj.id === id);
      if (object) {
        object.selected = !object.selected;
        const boxType = object.value === 100 ? 'hundreds' : object.value === 10 ? 'tens' : 'ones';

        // Only add/remove ghost image if hint mode is enabled
        if (hintMode.value) {
          object.selected ? addGhostImageToBox(object, boxType) : removeGhostImageFromBox(boxType);
        }
      }
    };

    const addGhostImageToBox = (object, boxType, skipCounter = false) => {
      const box = getTargetBoxByType(boxType);
      const img = document.createElement('img');
      img.src = object.image;
      img.classList.add('box-object', 'opacity-30');
      img.dataset.ghost = true;
      box.appendChild(img);

      if (!skipCounter) {
        ghostCounters[boxType]++;
      }
      showGhostCounterOverlay(box, ghostCounters[boxType]);
    };

    const removeGhostImageFromBox = (boxType) => {
      const box = getTargetBoxByType(boxType);
      const ghosts = box.querySelectorAll('img[data-ghost]');
      if (ghosts.length > 0) {
        ghosts[ghosts.length - 1].remove();
      }
      showGhostCounterOverlay(box, --ghostCounters[boxType]);
    };

    const showGhostCounterOverlay = (box, count) => {
      let overlay = box.querySelector('.ghost-counter-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.classList.add('ghost-counter-overlay');
        box.appendChild(overlay);
      }
      Object.assign(overlay.style, {
        fontFamily: "'Press Start 2P', sans-serif",
        fontSize: '18px',
        color: 'gray',
        position: 'absolute',
        bottom: '-2px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: '10'
      });
      overlay.textContent = count;
    };

    const submitAnswer = () => {
        if (hintMode.value) {
          document.querySelectorAll('.ghost-counter-overlay').forEach(el => el.remove());
          document.querySelectorAll('img[data-ghost]').forEach(el => el.remove());
          hintMode.value = false;
        }
      
        const selectedObjects = objects.value.filter(obj => obj.selected && obj.visible); // Filter only visible items
        if (!selectedObjects.length) return showFeedback("Please select at least one object!", "text-yellow-500");
      
        feedbackMessage.value = "";
        itemCounts.hundreds = itemCounts.tens = itemCounts.ones = 0;
      
        const groups = { 
          ones: selectedObjects.filter(obj => obj.type === 'apple'), 
          tens: selectedObjects.filter(obj => obj.type === 'basket'), 
          hundreds: selectedObjects.filter(obj => obj.type === 'crate') 
        };
      
        if (groups.ones.length > 0) {
          animateItems(groups.ones, 'ones', handleTensAnimationOrZero);
        } else if (groups.tens.length > 0 || groups.hundreds.length > 0) {
          setTimeout(() => {
            showItemCountOverlay(onesBox.value, 0);
          }, 100);
          handleTensAnimationOrZero();
        }
      };

    const handleTensAnimationOrZero = () => {
      const tensGroup = objects.value.filter(obj => obj.type === 'basket' && obj.selected);
      const hundredsGroup = objects.value.filter(obj => obj.type === 'crate' && obj.selected);
      if (tensGroup.length > 0) {
        animateItems(tensGroup, 'tens', handleHundredsAnimation);
      } else if (hundredsGroup.length > 0) {
        setTimeout(() => {
          showItemCountOverlay(tensBox.value, 0);
        }, 300);
        handleHundredsAnimation();
      } else {
        handleHundredsAnimation();
      }
    };

    const handleHundredsAnimation = () => {
      const hundredsGroup = objects.value.filter(obj => obj.type === 'crate' && obj.selected);
      animateItems(hundredsGroup, 'hundreds', () => {
        showFinalFeedback(objects.value.filter(obj => obj.selected));
      });
    };

    const animateItems = (items, boxType, onComplete) => {
        if (!items.length) return onComplete();
      
        const targetBox = getTargetBoxByType(boxType);
        items.forEach((object, index) => {
          setTimeout(() => {
            animateFlyingObject(object, () => {
              tempCounters[boxType] = ++itemCounts[boxType];
              showTempCounterOverlay(targetBox, tempCounters[boxType]);
      
              if (index + 1 === items.length) {
                showItemCountOverlay(targetBox, itemCounts[boxType]);
                hideTempCounterOverlay(targetBox);
                onComplete();
              }
            });
          }, index * 500);
        });
    };

    const showTempCounterOverlay = (box, count) => {
      let tempCounter = box.querySelector('.temp-counter-overlay');
      if (!tempCounter) {
        tempCounter = document.createElement('div');
        tempCounter.classList.add('temp-counter-overlay');
        box.appendChild(tempCounter);
      }
      Object.assign(tempCounter.style, {
        fontFamily: "'Press Start 2P', sans-serif",
        fontSize: '18px',
        color: 'black',
        position: 'absolute',
        bottom: '-2px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: '10'
      });
      tempCounter.textContent = count;
    };

    const hideTempCounterOverlay = (box) => {
      const tempCounter = box.querySelector('.temp-counter-overlay');
      if (tempCounter) tempCounter.remove();
    };

    const animateFlyingObject = (object, onComplete) => {
        const objectElement = getObjectElementById(object.id);
        if (!objectElement) return onComplete();
      
        const targetBox = getTargetBox(object.value);
        const objectRect = objectElement.getBoundingClientRect();
        const targetRect = targetBox.getBoundingClientRect();
      
        const newTop = targetRect.top + window.scrollY + targetRect.height / 2 - objectRect.height / 2;
        const newLeft = targetRect.left + window.scrollX + targetRect.width / 2 - objectRect.width / 2;
      
        const clonedElement = objectElement.cloneNode(true);
        clonedElement.style.position = 'absolute';
        clonedElement.style.top = `${objectRect.top + window.scrollY}px`;
        clonedElement.style.left = `${objectRect.left + window.scrollX}px`;
        clonedElement.style.width = `${objectRect.width}px`;
        clonedElement.style.height = `${objectRect.height}px`;
        clonedElement.style.transition = 'none';
        document.body.appendChild(clonedElement);
      
        // Trigger reflow for transition
        clonedElement.getBoundingClientRect();
        clonedElement.style.transition = 'top 0.3s ease-in-out, left 0.3s ease-in-out';
      
        requestAnimationFrame(() => {
          clonedElement.style.top = `${newTop}px`;
          clonedElement.style.left = `${newLeft}px`;
      
          clonedElement.addEventListener('transitionend', () => {
            clonedElement.remove();
            moveObjectToBox(object);
            object.visible = false; // Make object permanently invisible in the grid
            onComplete();
          }, { once: true });
        });
      
        objectElement.style.visibility = 'hidden';
    };

    const getObjectElementById = (id) => {
      return [...document.querySelectorAll('[data-id]')].find(el => el.dataset.id == id && el.style.visibility !== 'hidden');
    };

    const moveObjectToBox = (object) => {
      const box = getTargetBox(object.value);
      const imgElement = document.createElement('img');
      imgElement.src = object.image;
      imgElement.className = 'box-object';
      box.appendChild(imgElement);
    };

    const getTargetBox = (value) => {
        return value === 100 ? hundredsBox.value 
                : value === 10 ? tensBox.value 
                : onesBox.value;
    };
    
    const getTargetBoxByType = (boxType) => {
        return boxType === 'hundreds' ? hundredsBox.value 
                : boxType === 'tens' ? tensBox.value 
                : onesBox.value;
    };

    const showItemCountOverlay = (box, count) => {
        if (!box || typeof box.querySelector !== 'function') return; // Check if box is a valid DOM element
    
      let overlay = box.querySelector('.count-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.classList.add('count-overlay');
        box.appendChild(overlay);
      }
      Object.assign(overlay.style, {
        fontFamily: "'Press Start 2P', sans-serif",
        fontSize: '200px',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: '10'
      });
      overlay.textContent = count;
      box.querySelectorAll('.box-object').forEach(item => item.classList.add('blurred-item'));
    };

    const showFinalFeedback = (selectedObjects) => {
      const total = selectedObjects.reduce((sum, obj) => sum + obj.value, 0);
      const isCorrect = total === targetNumber.value;
      showFeedback(isCorrect ? "Correct!" : "Wrong!", isCorrect ? "text-green-500" : "text-red-500");
    };

    const showFeedback = (message, className) => {
      feedbackMessage.value = message;
      feedbackClass.value = className;
    };

    const getHint = (answer) => {
      showHintModal.value = false;
      if (!answer && hintMode.value) {
        hintMode.value = false;
        clearGhostElements();
      } else {
        toggleHintMode();
      }
    };

    const clearGhostElements = () => {
      document.querySelectorAll('.ghost-counter-overlay').forEach(el => el.remove());
      document.querySelectorAll('img[data-ghost]').forEach(el => el.remove());
      ghostCounters.hundreds = ghostCounters.tens = ghostCounters.ones = 0;
    };

    onMounted(() => {
      targetNumber.value = getRandomNumber(1, 999);
      generateObjects();
      generateGrids();
    });

    // Expose properties and methods
    return {
        // Reactive properties
        targetNumber,
        feedbackMessage,
        feedbackClass,
        showHintModal,
        hintMode,
        
        // Static properties
        labels,
        
        // Arrays and objects
        grids,
        objects,
        hundredsBox,
        tensBox,
        onesBox,
        
        // Methods
        toggleSelectById,
        submitAnswer,
        getHint,
        toggleHintMode,
        
        // Helper methods
        addGhostImageToBox,
        removeGhostImageFromBox,
        showGhostCounterOverlay,
        animateItems,
        handleTensAnimationOrZero,
        handleHundredsAnimation,
        showTempCounterOverlay,
        hideTempCounterOverlay,
        animateFlyingObject,
        getObjectElementById,
        moveObjectToBox,
        getTargetBox,
        getTargetBoxByType,
        showItemCountOverlay,
        showFinalFeedback,
        showFeedback,
        clearGhostElements
    };
  }
}

// Ordering Game Component
const Ordering = {
  template: `
  <h2 class="text-2xl font-bold text-gray-800 mb-6">Label the items in order!</h2>

  <div class="space-y-8 mb-8 px-6">
    <div
      v-for="(conveyor, index) in conveyors"
      :key="index"
      class="conveyor mx-auto"
      @dragover="allowDrop"
      @drop="drop($event, index)"
      @click="resetLabel(index)"
    >
      <img src="images/conveyor start.png" alt="Conveyor Start" />
      
      <!-- 13 Middle conveyor images to extend length -->
      <img src="images/conveyor middle.png" alt="Conveyor Middle" v-for="n in 13" />
      
      <img src="images/conveyor end.png" alt="Conveyor End" />
      
      <div class="grocery-container" :id="'grocery-' + index">
        <img :src="conveyor.image" class="grocery" :alt="'Basket ' + (index + 1)" />
        
        <div v-if="!conveyor.showCross && conveyor.assignedOrdinal" 
            :class="['label-circle', conveyor.labelClass]" 
            @click="resetLabel(index)">
          {{ conveyor.assignedOrdinal }}
        </div>
        <!-- Display the red cross emoji only if there's no assigned ordinal after submission or if showCross is true -->
        <span v-else-if="submitted && (!conveyor.assignedOrdinal || conveyor.showCross)" 
          class="text-red-500 text-5xl font-bold absolute" style="top: 20px;" @click="resetLabel(index)">❌</span>
      </div>
    </div>
  </div>

  <!-- Ordinal Labels to Drag -->
  <div class="flex justify-center space-x-4 mb-4">
    <div
      v-for="(label, index) in ordinalNumbers"
      :key="index"
      class="draggable text-xl font-bold py-2 px-4 rounded cursor-move w-20 h-12 flex items-center justify-center"
      :class="[label.disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-400', 'text-black']"
      :draggable="!label.disabled"
      @dragstart="!label.disabled && dragStart($event, label.text)"
    >
      {{ label.text }}
    </div>
  </div>

  <div class="text-center mt-6">
    <button class="bg-green-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-600" @click="checkAnswer">Submit</button>
    <p class="mt-4 text-lg font-medium" :class="feedbackClass">{{ feedbackMessage }}</p>
  </div>
  `,
  setup() {
    const conveyors = reactive(Array.from({ length: 4 }, (_, i) => ({
      id: i + 1,
      correctOrdinal: null,
      assignedOrdinal: null,
      image: '',
      labelClass: '',
      showCross: false,
    })));

    const ordinalNumbers = ref([
      { text: "1st", disabled: false },
      { text: "2nd", disabled: false },
      { text: "3rd", disabled: false },
      { text: "4th", disabled: false },
    ]);

    const draggedOrdinal = ref(null);
    const feedbackMessage = ref('');
    const feedbackClass = ref('');
    const submitted = ref(false);
    const basketImages = Array.from({ length: 8 }, (_, i) => `images/basket${i + 1}.png`);

    onMounted(() => {
      assignRandomImages();
      resetGroceries();
      setTimeout(startRace, 100);
    });

    const assignRandomImages = () => {
      let availableImages = [...basketImages];
      conveyors.forEach(conveyor => {
        const randomIndex = Math.floor(Math.random() * availableImages.length);
        conveyor.image = availableImages.splice(randomIndex, 1)[0];
      });
      console.log("Assigned random images to conveyors:", conveyors);
    };

    const resetGroceries = () => {
      conveyors.forEach((conveyor) => {
        const grocery = document.getElementById(`grocery-${conveyor.id - 1}`);
        grocery.style.transition = "none";
        grocery.style.left = "10px";
        grocery.offsetHeight; // Force reflow
        grocery.style.transition = "left 3s linear";
      });
    };

    const startRace = () => {
      const shuffledConveyors = [...conveyors].sort(() => Math.random() - 0.5);
      const ordinals = ["1st", "2nd", "3rd", "4th"];
      shuffledConveyors.forEach((conveyor, position) => {
        conveyor.correctOrdinal = ordinals[position];
      });
      console.log("Assigned correct ordinals to conveyors:", conveyors);

      let cumulativeDelay = 0;
      const finishPosition = 920;
      shuffledConveyors.forEach((conveyor) => {
        const grocery = document.getElementById(`grocery-${conveyor.id - 1}`);

        setTimeout(() => {
          grocery.style.left = `${finishPosition}px`;
        }, cumulativeDelay);

        cumulativeDelay += Math.random() * 800 + 200;
      });
    };

    const dragStart = (event, number) => {
      draggedOrdinal.value = number;
    };

    const allowDrop = (event) => {
      event.preventDefault();
    };

    const drop = (event, index) => {
      if (draggedOrdinal.value) {
        // If there's an already assigned label, reset it
        if (conveyors[index].assignedOrdinal) {
          const previousLabel = conveyors[index].assignedOrdinal;
    
          // Enable the previous label in the draggable list
          ordinalNumbers.value = ordinalNumbers.value.map(label =>
            label.text === previousLabel ? { ...label, disabled: false } : label
          );
        }
    
        // Assign the new label to the conveyor
        conveyors[index].assignedOrdinal = draggedOrdinal.value;
    
        // Disable the new label in the draggable list
        ordinalNumbers.value = ordinalNumbers.value.map(label =>
          label.text === draggedOrdinal.value ? { ...label, disabled: true } : label
        );
    
        // Clear the draggedOrdinal
        draggedOrdinal.value = null;
      }
    };

    const checkAnswer = () => {
      submitted.value = true;
      let allCorrect = true;

      conveyors.forEach((conveyor) => {
        if (conveyor.assignedOrdinal === conveyor.correctOrdinal) {
          conveyor.labelClass = 'correct';
          conveyor.showCross = false;
        } else {
          conveyor.labelClass = 'incorrect';
          conveyor.showCross = true;
        }
        if (!conveyor.assignedOrdinal) {
          conveyor.showCross = true;
        }
        allCorrect = allCorrect && conveyor.assignedOrdinal === conveyor.correctOrdinal;
      });

      feedbackMessage.value = allCorrect ? 'Correct!' : 'Try Again!';
      feedbackClass.value = allCorrect ? 'text-green-500' : 'text-red-500';
    };

    const resetLabel = (index) => {
      const removedLabel = conveyors[index].assignedOrdinal;

      conveyors[index].assignedOrdinal = null;
      conveyors[index].labelClass = '';

      ordinalNumbers.value = ordinalNumbers.value.map(label =>
        label.text === removedLabel ? { ...label, disabled: false } : label
      );
    };

    return {
      conveyors,
      ordinalNumbers,
      draggedOrdinal,
      feedbackMessage,
      feedbackClass,
      submitted,
      assignRandomImages,
      resetGroceries,
      startRace,
      dragStart,
      allowDrop,
      drop,
      checkAnswer,
      resetLabel,
    };
  }
};
</script>

<style scoped>
/* Cutscene Styles */
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
@keyframes wiggle {
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
    animation: wiggle 0.5s infinite;
    color: white;
}
/* Cutscene Styles */

/* Counting Styles */
/* Basic Reset */
body { margin: 0; }
.min-h-screen { min-height: 100vh; }

/* Game Box and Object Grid */
.target-box {
  width: 300px;
  height: 300px;
  border: 2px solid gray;
  border-radius: 8px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding: 10px;
  overflow: hidden;
  position: relative;
}

.grid-container {
  display: flex;
  justify-content: space-around;
  gap: 20px;
  margin-bottom: 20px;
}

.object-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.object {
  width: 80px;
  height: 80px;
  transition: transform 1s ease-in-out, top 1s ease-in-out, left 1s ease-in-out;
  position: relative;
}

.box-object { width: 60px; height: 60px; margin: 5px; object-fit: contain; }

/* Animations */
.selected { animation: wiggle 0.5s infinite; }
.blurred-item { filter: blur(6px); }
/* Counting Styles */

/* Ordering Styles */
.conveyor {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 100px;
  margin: 0 auto;
}

.conveyor img {
  height: 100%;
  width: auto;
}

.grocery-container {
  position: absolute;
  top: -20px;
  left: 10px;
  width: 72px;
  height: 120px;
  transition: left 3s linear;
  display: flex;
  align-items: center;
  justify-content: center;
}

.grocery {
  width: 72px !important;
  height: 120px !important;
  user-select: none;
}

.label-circle {
  position: absolute;
  width: 55px;
  height: 55px;
  background-color: white;
  color: black;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  top: 25px;
  transition: transform 0.2s, background-color 0.2s;
}

.label-circle.correct {
  background-color: green;
  color: white;
  animation: pulse 0.6s ease-in-out infinite; /* Apply pulse animation for correct answers */
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.label-circle.incorrect {
  background-color: red;
  color: white;
}
/* Ordering Styles */
</style>