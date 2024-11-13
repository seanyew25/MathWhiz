<template>
    <div class="md:tw-overflow-hidden tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-center tw-min-h-[calc(100vh-56px)]">
        <!-- Game Container -->
        <div class="nes-container is-rounded is-centered with-title" style="background-color: rgba(255, 245, 205, 1); width: 768px;">
            <p class="title" style="background-color: rgba(255, 245, 205, 1);">Counting</p>
            <div class="tw-max-w-3xl tw-flex tw-flex-col tw-items-center tw-justify-center">

                <!-- Instructions and Hint Button -->
                <h3 class="tw-text-3xl tw-mb-2 tw-flex tw-justify-center tw-items-center tw-gap-4">
                    Make a total of:{{ targetNumber }}
                    <button @click="showHintModal=true; timerFrozen=true" class="nes-btn is-primary tw-text-sm tw-mx-2">Hint</button>
                </h3>

                <!-- Hint Modal -->
                <div v-if="showHintModal" class="tw-fixed tw-inset-0 tw-flex tw-items-center tw-justify-center tw-bg-gray-500 tw-bg-opacity-50 tw-z-50">
                    <div class="tw-bg-white nes-container is-centered is-rounded with-title tw-p-6">
                        <p class="title">Hint</p>
                        <p class="tw-text-md tw-mb-4">
                            In Hint Mode, click on the items to see how they add up in the box.<br><br>
                            Do you want to use Hint Mode?
                        </p>
          
                        <div class="tw-flex tw-gap-8 tw-justify-center">
                            <button @click="getHint(true); timerFrozen=false" class="nes-btn is-success tw-w-32">Yes</button>
                            <button @click="getHint(false); timerFrozen=false" class="nes-btn is-error tw-w-32">No</button>
                        </div>
                    </div>
                </div>

                <!-- Hint Modal -->
                <!-- <dialog v-if="showHintModal" class="nes-dialog" style="border-radius: 10px;">
                    <form method="dialog">
                        <p class="title tw-text-lg tw-mb-4 text-center">Hint</p>
                        <p class="text-center tw-text-md tw-mb-4">
                        In Hint Mode, click items to preview them in the target box with a counter.<br>
                        Do you want to turn on Hint Mode?
                        </p>
                        <div class="tw-flex tw-gap-8 tw-justify-center">
                            <button @click="getHint(true)" class="nes-btn is-success tw-w-32">Yes</button>
                            <button @click="getHint(false)" class="nes-btn is-error tw-w-32">No</button>
                        </div>
                    </form>
                </dialog> -->

                <!-- Timer Bar -->
                <div class="progress-container tw-w-full">
                    <progress class="nes-progress is-success tw-w-full" :value="timerWidth" :max="20"></progress>
                    <p class="nes-text timer-text">{{ timerWidth.toFixed(0) }}s</p>
                </div>

                <!-- Streak Message -->
                <transition name="fade">
                <div v-if="streakCount >= 5" class="streak-banner text-center my-2 tw-flex tw-items-center tw-justify-center">
                    <i class="nes-icon trophy is-large"></i>
                    <p class="tw-mx-6">On a streak! x2 coins enabled!</p>
                    <i class="nes-icon trophy is-large"></i>
                </div>
                </transition>

                <!-- Grids for Selection -->
                <div class="grid-container tw-mb-4">
                    <div v-for="(grid, index) in grids" :key="index" class="grid-item">
                        <p class="tw-text-center tw-mt-2 tw-mb-0 tw-text-base">{{ labels[index] }}</p>
                        <div class="object-grid">
                            <div v-for="object in grid"
                            :key="object.id"
                            :class="['object', { 'selected': object.selected }]"
                            @click="toggleSelectById(object.id)"
                            ref="objects"
                            :data-id="object.id" 
                            v-bind:style="{ visibility: object.visible ? 'visible' : 'hidden' }">
                                <img :src="object.image" :alt="object.type" class="tw-w-full tw-h-full object-contain" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Target Boxes for Display -->
                <div class="tw-flex tw-justify-center tw-gap-8 tw-mt-0">
                    <div ref="hundredsBox" class="target-box nes-container is-rounded tw-bg-white" style="padding: 8px;"></div>
                    <div ref="tensBox" class="target-box nes-container is-rounded tw-bg-white" style="padding: 8px;"></div>
                    <div ref="onesBox" class="target-box nes-container is-rounded tw-bg-white" style="padding: 8px;"></div>
                </div>

                <!-- Submit Button -->
                <div class="tw-text-center tw-mt-4">
                    <button class="nes-btn" @click="submitAnswer" :disabled="loadingNextQuestion">Submit Answer</button>
                </div>

                <!-- Question Count and Coins Display -->
                <h2 class="tw-text-base tw-text-gray-800 tw-text-center tw-mt-4">
                Question {{ questionCount }}/10
                </h2>
                <h2 class="tw-text-base tw-text-gray-800 tw-text-center tw-mb-0">
                    Coins: {{ coins }}<i class="nes-icon coin is-small"></i>
                </h2>
            </div>
        </div>

        <!-- Tutorial Modal-->
        <dialog class="nes-dialog" id="tutorial">
          <form method="dialog">
            <h5 class="title tw-mb-4">Welcome to the Counting Game!</h5>
            <p style="text-align: center;">
                Pick the right number of items to match the target number.<br><br>
                1 crate equals 100, 1 basket equals 10, and 1 apple equals 1.<br><br>
                Good luck!
            </p>
            <menu class="dialog-menu tw-mb-0 tw-px-0">
              <button class="nes-btn is-primary" style="text-align:center;" @click="startGame">Start Game</button>
            </menu>
          </form>
        </dialog>

        <!-- Game Over Modal -->
        <div v-if="gameOver" class="game-over-overlay">
            <div class="game-over-content">
                <h2>{{ completionMessage }}</h2>
                <p>Total Coins Earned: {{ coins }}</p>
                <div class="button-container">
                    <button @click="exitGame" class="nes-btn is-primary">
                        Exit Game
                    </button>
                    <button @click="restartGame" class="nes-btn is-success">
                        Restart Game
                    </button>
                </div>
            </div>
        </div>

        
    </div>
</template>

<script>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import confetti from "canvas-confetti";
import { useRouter } from 'vue-router';
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  arrayUnion,
} from "firebase/firestore";

export default {
    name: "MarketCounting",
    setup() {
        // Reactive data
        const targetNumber = ref(0);
        const showHintModal = ref(false);
        const hintMode = ref(false);
        const coins = ref(0);
        const questionCount = ref(1);
        const totalQuestions = 10;
        const gameOver = ref(false); 
        const completionMessage = ref("Game Over! You've answered 10 questions.");
        const loadingNextQuestion = ref(false);
        const streakCount = ref(0);

    const labels = ["Hundreds", "Tens", "Ones"];
    const grids = ref([]);
    const objects = ref([]);
    const hundredsBox = ref(null);
    const tensBox = ref(null);
    const onesBox = ref(null);

    const itemCounts = reactive({ hundreds: 0, tens: 0, ones: 0 });
    const tempCounters = reactive({ hundreds: 0, tens: 0, ones: 0 });
    const ghostCounters = reactive({ hundreds: 0, tens: 0, ones: 0 });

        const timerWidth = ref(20);
        const timerInterval = ref(null);
        const timerFrozen = ref(false);

        const startTimer = () => {
            timerWidth.value = 20;
            timerFrozen.value = false;
            clearInterval(timerInterval.value);

            timerInterval.value = setInterval(() => {
                if (!timerFrozen.value) {
                    timerWidth.value = Math.max(0, timerWidth.value - 0.1);
                    if (timerWidth.value <= 0) {
                        timerFrozen.value = true
                        handleTimeOut();
                    }
                }
            }, 100);
        };

    const resetTimer = () => {
      clearInterval(timerInterval.value);
      startTimer();
    };

        const handleTimeOut = () => {
            playSound(false);
            console.log("counting, time, playing sound")
            resetStreak();
            loadNextQuestion();
        };

        const totalCoins = ref(0)
        const loadNextQuestion = () => {
            if (questionCount.value < totalQuestions) {
                questionCount.value += 1;
                targetNumber.value = getRandomNumber(1, 999);
                resetTimer();
                resetGameObjects();
                clearTargetBoxes();
                loadingNextQuestion.value = false;
            } else {
                loadingNextQuestion.value = false;
                gameOver.value = true;
                totalCoins.value += coins.value;
                updateCurrency(
                    db.value,
                    "users",
                    auth.value.currentUser.uid,
                    money.value + totalCoins.value
                    );
                updateCompletedTasks(
                    db.value,
                    "users",
                    auth.value.currentUser.uid,
                    "counting"
                );
            }
        };

    const router = useRouter();
    const exitGame = () => {
      router.push("/game");
    };

        const restartGame = () => {
            coins.value = 0;
            questionCount.value = 1;
            targetNumber.value = getRandomNumber(1, 999);
            gameOver.value = false;
            resetStreak();
            resetTimer();
            resetGameObjects();
            clearTargetBoxes();
        };


    const clearTargetBoxes = () => {
      [hundredsBox, tensBox, onesBox].forEach((box) => {
        if (box.value) {
          box.value.innerHTML = ""; // Clear all items from each target box
          const countOverlay = box.value.querySelector(".tw-count-overlay");
          if (countOverlay) countOverlay.remove(); // Remove the item count overlay if it exists
        }
      });
    };

    const resetGameObjects = () => {
      generateObjects();
      generateGrids();
      itemCounts.hundreds = itemCounts.tens = itemCounts.ones = 0;
      tempCounters.hundreds = tempCounters.tens = tempCounters.ones = 0;
      ghostCounters.hundreds = ghostCounters.tens = ghostCounters.ones = 0;
      objects.value.forEach((obj) => (obj.selected = false));
    };

    const getRandomNumber = (min, max) =>
      Math.floor(Math.random() * (max - min + 1)) + min;

    const generateObjects = () => {
      let idCounter = 0;
      objects.value = [
        ...Array.from({ length: 9 }, () => ({
          id: idCounter++,
          type: "apple",
          value: 1,
          selected: false,
          visible: true,
          image: "/assets/marketassets/apple.png",
        })),
        ...Array.from({ length: 9 }, () => ({
          id: idCounter++,
          type: "basket",
          value: 10,
          selected: false,
          visible: true,
          image: "/assets/marketassets/basket.png",
        })),
        ...Array.from({ length: 9 }, () => ({
          id: idCounter++,
          type: "crate",
          value: 100,
          selected: false,
          visible: true,
          image: "/assets/marketassets/crate.png",
        })),
      ];
    };

    const generateGrids = () => {
      grids.value = ["crate", "basket", "apple"].map((type) =>
        objects.value.filter((obj) => obj.type === type)
      );
    };

    const toggleHintMode = () => {
      hintMode.value = true;
      objects.value.forEach((object) => {
        if (object.selected) {
          const boxType =
            object.value === 100
              ? "hundreds"
              : object.value === 10
              ? "tens"
              : "ones";
          ghostCounters[boxType]++;
          addGhostImageToBox(object, boxType, true);
        }
      });
    };

    const toggleSelectById = (id) => {
      const object = objects.value.find((obj) => obj.id === id);
      if (object) {
        object.selected = !object.selected;
        const boxType =
          object.value === 100
            ? "hundreds"
            : object.value === 10
            ? "tens"
            : "ones";

        if (hintMode.value) {
          object.selected
            ? addGhostImageToBox(object, boxType)
            : removeGhostImageFromBox(boxType);
        }
      }
    };

    const addGhostImageToBox = (object, boxType, skipCounter = false) => {
      const box = getTargetBoxByType(boxType);
      const img = document.createElement("img");
      img.src = object.image;
      img.classList.add("tw-box-object", "tw-opacity-30");
      img.style.width = "41px";
      img.style.height = "41px";
      img.style.margin = "5px";
      img.style.objectFit = "contain";
      img.dataset.ghost = true;
      box.appendChild(img);

      if (!skipCounter) {
        ghostCounters[boxType]++;
      }
      showGhostCounterOverlay(box, ghostCounters[boxType]);
    };

    const removeGhostImageFromBox = (boxType) => {
      const box = getTargetBoxByType(boxType);
      const ghosts = box.querySelectorAll("img[data-ghost]");
      if (ghosts.length > 0) {
        ghosts[ghosts.length - 1].remove();
      }
      showGhostCounterOverlay(box, --ghostCounters[boxType]);
    };

    const showGhostCounterOverlay = (box, count) => {
      let overlay = box.querySelector(".tw-ghost-counter-overlay");
      if (!overlay) {
        overlay = document.createElement("div");
        overlay.classList.add("tw-ghost-counter-overlay");
        box.appendChild(overlay);
      }
      Object.assign(overlay.style, {
        fontFamily: "'Press Start 2P', sans-serif",
        fontSize: "18px",
        color: "gray",
        position: "absolute",
        bottom: "-2px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: "10",
      });
      overlay.textContent = count;
    };

    const submitAnswer = () => {
      timerFrozen.value = true; // Freeze timer on submit
      loadingNextQuestion.value = true;
      if (hintMode.value) {
        document
          .querySelectorAll(".tw-ghost-counter-overlay")
          .forEach((el) => el.remove());
        document
          .querySelectorAll("img[data-ghost]")
          .forEach((el) => el.remove());
        hintMode.value = false;
      }

      const selectedObjects = objects.value.filter(
        (obj) => obj.selected && obj.visible
      );
      itemCounts.hundreds = itemCounts.tens = itemCounts.ones = 0;

            // If no items are selected, show zeros in target boxes sequentially
            if (selectedObjects.length === 0) {
                // Display zeros sequentially
                showItemCountOverlay(onesBox.value, 0);
                setTimeout(() => showItemCountOverlay(tensBox.value, 0), 100);
                setTimeout(() => {
                    showItemCountOverlay(hundredsBox.value, 0);
                    playSound(false);
                    console.log("counting, zero, playing sound")
                }, 200);

                // Load the next question after displaying zeros
                setTimeout(() => {
                    resetStreak(); // Reset streak on incorrect answer
                    loadNextQuestion();
                }, 800);
                return;
            }

      const groups = {
        ones: selectedObjects.filter((obj) => obj.type === "apple"),
        tens: selectedObjects.filter((obj) => obj.type === "basket"),
        hundreds: selectedObjects.filter((obj) => obj.type === "crate"),
      };

      if (groups.ones.length > 0) {
        animateItems(groups.ones, "ones", handleTensAnimationOrZero);
      } else if (groups.tens.length > 0 || groups.hundreds.length > 0) {
        setTimeout(() => showItemCountOverlay(onesBox.value, 0), 50);
        handleTensAnimationOrZero();
      }
    };

    const handleTensAnimationOrZero = () => {
      const tensGroup = objects.value.filter(
        (obj) => obj.type === "basket" && obj.selected
      );
      const hundredsGroup = objects.value.filter(
        (obj) => obj.type === "crate" && obj.selected
      );
      if (tensGroup.length > 0) {
        animateItems(tensGroup, "tens", handleHundredsAnimation);
      } else if (hundredsGroup.length > 0) {
        setTimeout(() => showItemCountOverlay(tensBox.value, 0), 150);
        handleHundredsAnimation();
      } else {
        handleHundredsAnimation();
      }
    };

        const handleHundredsAnimation = () => {
            const hundredsGroup = objects.value.filter(obj => obj.type === 'crate' && obj.selected);
            animateItems(hundredsGroup, 'hundreds', () => {
                const selectedTotal = objects.value.reduce((sum, obj) => obj.selected ? sum + obj.value : sum, 0);
                
                // Check if answer is correct
                if (selectedTotal === targetNumber.value) {
                    playSound(true);
                    streakCount.value += 1;

                    if (streakCount.value == 5){
                        triggerConfetti();
                    }

                    if (streakCount.value > 5) {
                        coins.value += 2;
                    } else {
                        coins.value += 1;
                    }
                } else {
                    playSound(false);
                    console.log("counting, wrong, playing sound")
                    resetStreak();
                }

        setTimeout(() => loadNextQuestion(), 1000);
      });
    };

        const resetStreak = () => {
            streakCount.value = 0;
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
        }, index * 200);
      });
    };

    const showTempCounterOverlay = (box, count) => {
      let tempCounter = box.querySelector(".tw-temp-counter-overlay");
      if (!tempCounter) {
        tempCounter = document.createElement("div");
        tempCounter.classList.add("tw-temp-counter-overlay");
        box.appendChild(tempCounter);
      }
      Object.assign(tempCounter.style, {
        fontFamily: "'Press Start 2P', sans-serif",
        fontSize: "18px",
        color: "black",
        position: "absolute",
        bottom: "-2px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: "10",
      });
      tempCounter.textContent = count;
    };

    const hideTempCounterOverlay = (box) => {
      const tempCounter = box.querySelector(".tw-temp-counter-overlay");
      if (tempCounter) tempCounter.remove();

      box.querySelectorAll(".tw-box-object").forEach((item) => {
        item.style.filter = "blur(4px)"; // Directly apply blur effect
      });
    };

    const animateFlyingObject = (object, onComplete) => {
      const objectElement = getObjectElementById(object.id);
      if (!objectElement) return onComplete();

      const targetBox = getTargetBox(object.value);
      const objectRect = objectElement.getBoundingClientRect();
      const targetRect = targetBox.getBoundingClientRect();

      const newTop =
        targetRect.top +
        window.scrollY +
        targetRect.height / 2 -
        objectRect.height / 2;
      const newLeft =
        targetRect.left +
        window.scrollX +
        targetRect.width / 2 -
        objectRect.width / 2;

      const clonedElement = objectElement.cloneNode(true);
      clonedElement.style.position = "absolute";
      clonedElement.style.top = `${objectRect.top + window.scrollY}px`;
      clonedElement.style.left = `${objectRect.left + window.scrollX}px`;
      clonedElement.style.width = `${objectRect.width}px`;
      clonedElement.style.height = `${objectRect.height}px`;
      clonedElement.style.transition = "none";
      document.body.appendChild(clonedElement);

      clonedElement.getBoundingClientRect();
      clonedElement.style.transition =
        "top 0.15s ease-in-out, left 0.15s ease-in-out";

      requestAnimationFrame(() => {
        clonedElement.style.top = `${newTop}px`;
        clonedElement.style.left = `${newLeft}px`;

        clonedElement.addEventListener(
          "transitionend",
          () => {
            clonedElement.remove();
            moveObjectToBox(object);
            object.visible = false;
            onComplete();
          },
          { once: true }
        );
      });

      objectElement.style.visibility = "hidden";
    };

    const getObjectElementById = (id) => {
      return [...document.querySelectorAll("[data-id]")].find(
        (el) => el.dataset.id == id && el.style.visibility !== "hidden"
      );
    };

    const moveObjectToBox = (object) => {
      const box = getTargetBox(object.value);
      const imgElement = document.createElement("img");
      imgElement.src = object.image;
      imgElement.className = "tw-box-object";
      imgElement.style.width = "41px";
      imgElement.style.height = "41px";
      imgElement.style.margin = "5px";
      imgElement.style.objectFit = "contain";
      box.appendChild(imgElement);
    };

    const getTargetBox = (value) => {
      return value === 100
        ? hundredsBox.value
        : value === 10
        ? tensBox.value
        : onesBox.value;
    };

    const getTargetBoxByType = (boxType) => {
      return boxType === "hundreds"
        ? hundredsBox.value
        : boxType === "tens"
        ? tensBox.value
        : onesBox.value;
    };

    const showItemCountOverlay = (box, count) => {
      if (!box || typeof box.querySelector !== "function") return;

      let overlay = box.querySelector(".tw-count-overlay");
      if (!overlay) {
        overlay = document.createElement("div");
        overlay.classList.add("tw-count-overlay");
        box.appendChild(overlay);
      }
      Object.assign(overlay.style, {
        fontSize: "120px",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-45%, -45%)",
        zIndex: "10",
        textShadow:
          "3px 3px 0px white, -3px 3px 0px white, 3px -3px 0px white, -3px -3px 0px white",
      });
      overlay.textContent = count;
    };

        const getHint = (answer) => {
            showHintModal.value = false;
            if (!answer) {
                hintMode.value = false;
                clearGhostElements();
            } else if (!hintMode.value){
                toggleHintMode();
            }
        };

        const clearGhostElements = () => {
            document.querySelectorAll('.tw-ghost-counter-overlay').forEach(el => el.remove());
            document.querySelectorAll('img[data-ghost]').forEach(el => el.remove());
            ghostCounters.hundreds = ghostCounters.tens = ghostCounters.ones = 0;
        };

        const playSound = (correct) => {
            const audio = new Audio(
                correct
                ? 'https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3'
                : 'https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3'
            );
            audio.play();
        };

        const triggerConfetti = () => {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            });
        };

        const showTutorial = () => {
            document.getElementById('tutorial').showModal();
        };

        const startGame = () => {
            document.getElementById('tutorial').close();
            startTimer(); 
        };

        const db = ref(null);
        const auth = ref(null);
        const money = ref(0);

        async function getCurrency(db, collectionName, documentId) {
            const docRef = doc(db, collectionName, documentId);
            try {
                const doc = await getDoc(docRef);
                console.log(doc);
                if (doc.exists()) {
                console.log("Document data:", doc.data());
                money.value = doc.data().currency;
                } else {
                console.log("No such document!");
                }
            } catch (error) {
                console.error("Error getting document:", error);
            }
        }

        async function updateCurrency(db, collectionName, documentId, currency) {
            const docRef = doc(db, collectionName, documentId);
            try {
                await setDoc(docRef, { currency: currency }, { merge: true });
                console.log(currency);
                console.log("Currency successfully written!");
            } catch (error) {
                console.error("Error writing document: ", error);
            }
        }

        async function updateCompletedTasks(
            db,
            collectionName,
            documentId,
            newTask
            ) {
            const docRef = doc(db, collectionName, documentId);
            try {
                await setDoc(
                docRef,
                { completedTasks: arrayUnion(newTask) },
                { merge: true }
                );
                console.log("Task successfully added to completedTasks!");
            } catch (error) {
                console.error("Error updating document: ", error);
            }
        }

        // Clean up timer and dynamically added DOM elements
        onBeforeUnmount(() => {
            // Clear the timer interval
            if (timerInterval.value) {
                clearInterval(timerInterval.value);
            }

            // Remove any ghost overlays, dynamically added elements, etc.
            clearGhostElements();
            document.querySelectorAll('.tw-ghost-counter-overlay').forEach(el => el.remove());
            document.querySelectorAll('img[data-ghost]').forEach(el => el.remove());
            document.querySelectorAll('.tw-count-overlay').forEach(el => el.remove());
            document.querySelectorAll('.tw-temp-counter-overlay').forEach(el => el.remove());
        });

        onMounted(() => {
            const authObj = getAuth();
            console.log(`uid=${authObj.currentUser.uid}`);
            const dbInstance = getFirestore();
            db.value = dbInstance;
            auth.value = authObj;
            console.log(db);
            getCurrency(dbInstance, "users", authObj.currentUser.uid);
            showTutorial();
            targetNumber.value = getRandomNumber(1, 999);
            generateObjects();
            generateGrids();
        });

        return {
            targetNumber,
            showHintModal,
            hintMode,
            labels,
            grids,
            objects,
            hundredsBox,
            tensBox,
            onesBox,
            timerWidth,
            toggleSelectById,
            submitAnswer,
            getHint,
            toggleHintMode,
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
            clearGhostElements,
            startTimer,
            coins,
            questionCount,
            totalQuestions,
            gameOver,
            completionMessage,
            router,
            startGame,
            exitGame,
            restartGame,
            loadingNextQuestion,
            streakCount,
            resetStreak,
            timerFrozen
        };
    }
};
</script>

<style scoped>
    * {
    font-family: 'Press Start 2P', sans-serif;
    }

    .progress-container {
        position: relative; /* To allow positioning of the child elements absolutely */
    }

    .timer-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .game-over-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .game-over-content {
        background-color: white;
        padding: 2rem;
        border-radius: 1rem;
        text-align: center;
    }

    .button-container button {
        width: 220px;
        margin: 0 30px;
    }

/* Game Box and Object Grid */
.target-box {
  width: 180px;
  height: 180px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
}

.grid-container {
  display: flex;
  justify-content: space-around;
  gap: 40px;
}

.object-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.object {
  width: 65px;
  height: 65px;
  transition: transform 1s ease-in-out, top 1s ease-in-out, left 1s ease-in-out;
  position: relative;
}

    .selected { animation: wiggle 0.5s infinite; }

    @keyframes wiggle {
    0%, 100% { transform: rotate(0); }
    25% { transform: rotate(-7deg); }
    75% { transform: rotate(7deg); }
    }

    .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
    }
    .fade-enter, .fade-leave-to {
    opacity: 0;
    }

    .streak-banner {
    background-color: #ffd700;
    color: #000;
    padding: 1rem;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
    font-weight: bold;
    animation: pulse 1s infinite;
    }
</style>
