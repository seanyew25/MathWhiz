<template>
  <div
    class="md:tw-overflow-hidden tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-center tw-min-h-[calc(100vh-56px)]"
  >
    <!-- Game Container -->
    <div
      class="nes-container is-rounded is-centered with-title"
      style="background-color: rgba(255, 245, 205, 1); width: 800px"
    >
      <p class="title" style="background-color: rgba(255, 245, 205, 1)">
        Multiplication and Division
      </p>

      <div class="p-6 w-[400px] h-[300px] mx-auto">
        <!-- Instructions and Hint -->
        <div class="tw-flex tw-items-center tw-justify-center tw-mb-4">
          <h1 class="tw-text-3xl text-center align-center">
            {{
              currentQuestion.operator === "×"
                ? "Multiply the numbers!"
                : "Divide the numbers!"
            }}
          </h1>
          <button
            @click="showHintModal = true"
            class="nes-btn is-primary tw-text-sm tw-mx-4"
          >
            Hint
          </button>
        </div>

        <!-- Hint Modal -->
        <div
          v-if="showHintModal"
          class="tw-fixed tw-inset-0 tw-flex tw-items-center tw-justify-center tw-bg-gray-500 tw-bg-opacity-50 tw-z-50"
        >
          <div
            class="tw-bg-white nes-container is-centered is-rounded with-title tw-p-6"
          >
            <p class="title">Hint</p>
            <p class="tw-text-lg tw-mb-4">
              Click on the multiplication or division operator to visualise the
              question!<br />
              For <strong>multiplication</strong>, you'll see a table with rows
              and columns.<br />
              For <strong>division</strong>, you'll see different coloured groups
              corresponding to the quotient of the equation.
            </p>

            <!-- Button-->
            <div class="tw-flex tw-gap-8 tw-justify-center">
              <button
                @click="showHintModal = false"
                class="nes-btn is-success tw-w-auto"
              >
                I Understand!
              </button>
            </div>
          </div>
        </div>

        <!-- Timer Bar -->
        <TimerBar
          ref="timerBar"
          :initial-time="initialTimerSeconds"
          :is-running="isTimerRunning"
          @timerExpired="handleTimerExpired"
        />

        <!-- Streak Message -->
        <transition name="fade">
        <div
          v-if="streakActive"
          class="streak-message text-center my-2 tw-flex tw-items-center tw-justify-center"
        >
          <i class="nes-icon trophy is-large"></i>
          <p class="tw-mx-6">On a streak! x2 coins enabled!</p>
          <i class="nes-icon trophy is-large"></i>
        </div>
        </transition>

        
          <div :key="'question-' + questionIndex" class="question-container">
            <div class="text-center tw-mt-6">
              <div class="tw-text-2xl" v-if="currentQuestion">
                <span>{{ currentQuestion.leftNumber }}</span>
                <span class="mx-2">{{ currentQuestion.operator }}</span>
                <span>{{ currentQuestion.rightNumber }}</span>
              </div>
            </div>

            <!-- Emoji and Operator Display -->
            <div class="text-center mb-6" style="position: relative">
              <div class="text-4xl mb-2">
                <!-- Left Emojis -->
                <transition-group name="bounce" tag="div">
                  <span
                    v-for="(item, index) in currentQuestion.leftItems"
                    :key="'left-' + index"
                    :class="['emoji-group', getEmojiClass(index)]"
                  >
                    {{ item.item }}
                  </span>
                </transition-group>

                <!-- Operator with Click Events -->
                <div
                  class="text-4xl operator-symbol"
                  @click="handleOperatorClick($event)"
                  ref="operatorSymbol"
                >
                  {{ currentQuestion.operator }}
                </div>

                <!-- Right Emojis -->
                <transition-group name="bounce" tag="div">
                  <span
                    v-for="(item, index) in currentQuestion.rightItems"
                    :key="'right-' + index"
                    class="emoji-group"
                  >
                    {{ item.item }}
                  </span>
                </transition-group>

                <!-- Equals Sign -->
                <span>=</span>
              </div>

              <!-- Multiplication Table Overlay -->
              <div
                v-if="showMultiplicationGrid && currentQuestion.operator === '×'"
                class="multiplication-table-overlay"
              >
                <!-- Column headers -->
                <div class="multiplication-grid-header">
                  <span class="row-label"></span>
                  <!-- Column numbers -->
                  <span
                    v-for="col in multiplicationGridColNumbers"
                    :key="'col-' + col"
                    class="column-number"
                  >
                    {{ col }}
                  </span>
                </div>
                <!-- Rows with row labels and emojis -->
                <div
                  v-for="(row, rowIndex) in multiplicationTableRows"
                  :key="rowIndex"
                  class="multiplication-grid-row"
                >
                  <!-- Row label -->
                  <span class="row-label">
                    {{ multiplicationGridRowNumbers[rowIndex] }}
                  </span>
                  <span
                    v-for="(emoji, index) in row"
                    :key="'cell-' + rowIndex + '-' + index"
                    class="multiplication-emoji"
                  >
                    {{ emoji }}
                  </span>
                </div>
              </div>
            </div>
          </div>
       

        <div class="nes-field is-inline mb-4">
          <input
            type="number"
            v-model="userInput"
            @keyup.enter="checkAnswer"
            class="nes-input is-success"
            placeholder="Enter Your Answer"
            :disabled="gameOver"
          />
        </div>

        <div class="text-center mb-6">
          <button
            @click="checkAnswer"
            :class="{ 'nes-btn': true, 'is-disabled': gameOver }"
            :disabled="gameOver"
          >
            Submit Answer
          </button>
        </div>

        <!-- Question and Coins Display -->
        <h2 class="tw-text-base tw-text-gray-800 tw-text-center tw-mt-4">
          Question {{ questionsAnswered }}/10
        </h2>
        <h2 class="tw-text-base tw-text-gray-800 tw-text-center tw-mb-0">
          Coins: {{ coins }}<i class="nes-icon coin is-small"></i>
        </h2>

        <!--Game Over Dialogue Box-->
        <div v-if="gameOver" class="game-over-overlay">
          <div class="game-over-content">
            <h2>{{ completionMessage }}</h2>
            <br />
            <p>Total Coins Earned: {{ coins }}</p>
            <p>You're one step closer to regaining Morgana's fur!</p>
            <p>Play again?</p>
            <br>
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

        <!-- Start Game Dialogue Box-->
        <dialog class="nes-dialog" id="instructions-dialog">
          <form method="dialog">
            <h5 class="title tw-mb-4" style="text-align: center">
              Welcome to the Multiplication and Division Game!
            </h5>
            <p style="text-align: center">
              Answer 10 questions to tidy up the school.<br /><br />
              Answer 5 questions in a row correctly to activate a streak -<br />
              it earns you double coins!<br /><br />
              You have <strong>{{ initialTimerSeconds }}</strong> seconds for
              each question. Good luck!
            </p>
            <menu class="dialog-menu tw-mb-0 tw-px-0">
              <button
                class="nes-btn is-primary"
                style="text-align: center"
                @click="startGame"
              >
                Start Game
              </button>
            </menu>
          </form>
        </dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  arrayUnion,
} from "firebase/firestore";
import { useRouter } from "vue-router";
import TimerBar from '../Timerbar.vue'; // Adjust the path as needed

const emojiSet = [
  "🚗",
  "🏀",
  "🌍",
  "💡",
  "📚",
  "💻",
  "🏫",
  "👨‍🏫",
  "📏",
  "🔢",
];
const getRandomEmoji = () =>
  emojiSet[Math.floor(Math.random() * emojiSet.length)];

const tables = [2, 3, 4, 5, 6, 7];

const generateQuestion = () => {
  const operators = ["×", "÷"];
  const operator = operators[Math.floor(Math.random() * operators.length)];
  let leftNumber,
    rightNumber,
    correct,
    leftItems,
    rightItems,
    selectedEmoji;

  selectedEmoji = getRandomEmoji();

  if (operator === "×") {
    leftNumber = tables[Math.floor(Math.random() * tables.length)];
    rightNumber = Math.floor(Math.random() * 8) + 2;
    correct = leftNumber * rightNumber;
  } else {
    rightNumber = tables[Math.floor(Math.random() * tables.length)];
    leftNumber = rightNumber * (Math.floor(Math.random() * 4) + 2);
    correct = leftNumber / rightNumber;
  }

  leftItems = Array(leftNumber)
    .fill(selectedEmoji)
    .map((item) => ({ item }));
  rightItems = Array(rightNumber)
    .fill(selectedEmoji)
    .map((item) => ({ item }));

  return {
    leftItems,
    rightItems,
    operator,
    leftNumber,
    rightNumber,
    correct,
    selectedEmoji,
  };
};

export default {
  components: {
    TimerBar,
  },
  data() {
    return {
      operatorEffectActive: false,
      showMultiplicationGrid: false,
      multiplicationTableRows: [],
      multiplicationGridRowNumbers: [],
      multiplicationGridColNumbers: [],
      hoverIndex: null,
      colors: [
        "hover-red",
        "hover-blue",
        "hover-yellow",
        "hover-green",
        "hover-purple",
      ],
      router: useRouter(),
      gameOver: false,
      completionMessage: "",
      score: 0,
      highScore: localStorage.getItem("highScore") || 0,
      streakActive: false,
      coins: 0,
      totalCoins: 0,
      money: 0,
      correctAnswersInRow: 0,
      questionsAnswered: 0,
      currentQuestion: generateQuestion(),
      userInput: "",
      isTimerRunning: false,
      initialTimerSeconds: 20,
      showHintModal: false,
      db: "",
      auth: "",
    };
  },
  computed: {
    questionIndex() {
      return this.questionsAnswered;
    },
  },
  methods: {
    handleOperatorClick(event) {
      event.stopPropagation();
      if (this.operatorEffectActive) {
        this.clearOperatorEffect();
      } else {
        this.applyOperatorEffect();
        document.addEventListener("click", this.handleOutsideClick);
      }
    },
    applyOperatorEffect() {
      this.operatorEffectActive = true;
      if (this.currentQuestion.operator === "×") {
        const leftNumber = this.currentQuestion.leftNumber;
        const rightNumber = this.currentQuestion.rightNumber;
        const biggerNumber = Math.max(leftNumber, rightNumber);
        const smallerNumber = Math.min(leftNumber, rightNumber);
        const emoji = this.currentQuestion.leftItems[0].item;

        // Generate multiplication grid
        this.multiplicationTableRows = [];
        for (let row = 1; row <= biggerNumber; row++) {
          let rowEmojis = [];
          for (let col = 1; col <= smallerNumber; col++) {
            rowEmojis.push(emoji);
          }
          this.multiplicationTableRows.push(rowEmojis);
        }
        this.multiplicationGridRowNumbers = Array.from(
          { length: biggerNumber },
          (_, i) => i + 1
        );
        this.multiplicationGridColNumbers = Array.from(
          { length: smallerNumber },
          (_, i) => i + 1
        );

        this.showMultiplicationGrid = true;
      } else if (this.currentQuestion.operator === "÷") {
        // Activate division visualization
        this.operatorEffectActive = true;
      }
    },
    clearOperatorEffect() {
      this.operatorEffectActive = false;
      if (this.currentQuestion.operator === "×") {
        this.showMultiplicationGrid = false;
        this.multiplicationTableRows = [];
      } else if (this.currentQuestion.operator === "÷") {
        this.hoverIndex = null;
      }
      document.removeEventListener("click", this.handleOutsideClick);
    },
    getEmojiClass(index) {
      if (
        this.currentQuestion.operator === "÷" &&
        this.operatorEffectActive
      ) {
        const groupSize = this.currentQuestion.rightNumber;
        const groupIndex = Math.floor(index / groupSize);
        return this.colors[groupIndex % this.colors.length];
      }
      return "";
    },
    handleOutsideClick(event) {
      const operatorElement = this.$refs.operatorSymbol;
      if (!operatorElement.contains(event.target)) {
        this.clearOperatorEffect();
      }
    },
    startTimer(reset = true) {
    this.isTimerRunning = true;
    if (reset) {
      this.$refs.timerBar.resetTimer();
    } else {
      this.$refs.timerBar.resumeTimer();
    }
    },
    pauseTimer() {
      this.isTimerRunning = false;
    },
    handleTimerExpired() {
      this.playSound(false);
      this.correctAnswersInRow = 0;
      this.streakActive = false;
      this.handleIncorrectAnswer();
    },
    playSound(correct) {
      const audio = new Audio(
        correct
          ? "https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3"
          : "https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3"
      );
      audio.play();
    },
    handleCorrectAnswer() {
      this.playSound(true);
      this.correctAnswersInRow += 1;
      this.questionsAnswered += 1;

      // Activate streak message on 5th consecutive correct answer
      if (this.correctAnswersInRow >= 5) {
        this.streakActive = true;
      } else {
        this.streakActive = false;
      }

      // Award coins
      if (this.correctAnswersInRow >= 6) {
        this.coins += 2; // Double coins from 6th correct answer
      } else {
        this.coins += 1;
      }

      if (this.questionsAnswered >= 10) {
        this.endGame();
      } else {
        this.nextQuestion();
      }
    },
    handleIncorrectAnswer() {
      this.playSound(false);
      this.correctAnswersInRow = 0;
      this.streakActive = false;
      this.questionsAnswered += 1;

      if (this.questionsAnswered >= 10) {
        this.endGame();
      } else {
        this.nextQuestion();
      }
    },
    checkAnswer() {
      const userAnswer = parseInt(this.userInput, 10);

      if (userAnswer === this.currentQuestion.correct) {
        this.handleCorrectAnswer();
      } else {
        this.handleIncorrectAnswer();
      }
    },
    nextQuestion() {
      this.userInput = "";
      this.currentQuestion = generateQuestion();
      this.startTimer();
    },
    async getCurrency(db, collectionName, documentId) {
      const docRef = doc(db, collectionName, documentId);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          this.money = docSnap.data().currency;
        } else {
          // console.log("No such document!");
        }
      } catch (error) {
        console.error("Error getting document:", error);
      }
    },
    async updateCurrency(db, collectionName, documentId, currency) {
      const docRef = doc(db, collectionName, documentId);
      try {
        await setDoc(docRef, { currency: currency }, { merge: true });
        // console.log("Currency successfully written!");
      } catch (error) {
        console.error("Error writing document: ", error);
      }
    },
    async updateCompletedTasks(db, collectionName, documentId, newTask) {
      const docRef = doc(db, collectionName, documentId);
      try {
        await setDoc(
          docRef,
          { completedTasks: arrayUnion(newTask) },
          { merge: true }
        );
        // console.log("Task successfully added to completedTasks!");
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    },
    endGame() {
      // Update currency and completed tasks if needed
      this.updateCurrency(
        this.db,
        "users",
        this.auth.currentUser.uid,
        this.money + this.coins + this.totalCoins
      );
      this.updateCompletedTasks(
        this.db,
        "users",
        this.auth.currentUser.uid,
        "additionAndSubtraction"
      );

      this.gameOver = true;
      this.completionMessage = "Game Over! You've answered 10 questions.";
      this.pauseTimer();
    },

    restartGame() {
      this.gameOver = false;
      this.completionMessage = "";
      this.totalCoins += this.coins;
      this.coins = 0;
      this.correctAnswersInRow = 0;
      this.streakActive = false;
      this.questionsAnswered = 0;
      this.userInput = "";
      this.currentQuestion = generateQuestion();
      this.startTimer();
    },
    exitGame() {
      this.router.push("/game");
      // console.log("Exiting game");
    },
    startGame() {
      this.startTimer();
    },
  },
  watch: {
  showHintModal(newVal) {
      if (newVal) {
        this.pauseTimer();
      } else {
        this.startTimer(false); // Resume timer without resetting
      }
    },
  },
  mounted() {
    // Show the instructions dialog
    const instructionsDialog = document.getElementById("instructions-dialog");
    if (instructionsDialog && typeof instructionsDialog.showModal === "function") {
      instructionsDialog.showModal();
    }

    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    const auth = getAuth();
    // console.log(`uid=${auth.currentUser.uid}`);
    const db = getFirestore();
    this.db = db;
    this.auth = auth;
    this.getCurrency(db, "users", auth.currentUser.uid);
  },
  beforeUnmount() {
    this.pauseTimer();
    document.removeEventListener("click", this.handleOutsideClick);
  },
};
</script>

<style scoped>
/* ... existing styles ... */

* {
  font-family: "Press Start 2P", sans-serif;
}

.nes-container.is-rounded {
  border-image-slice: 3;
  border-image-width: 3;
  border-image-repeat: stretch;
  border-image-source: url('data:image/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8" ?><svg version="1.1" width="8" height="8" xmlns="http://www.w3.org/2000/svg"><path d="M3 1 h1 v1 h-1 z M4 1 h1 v1 h-1 z M2 2 h1 v1 h-1 z M5 2 h1 v1 h-1 z M1 3 h1 v1 h-1 z M6 3 h1 v1 h-1 z M1 4 h1 v1 h-1 z M6 4 h1 v1 h-1 z M2 5 h1 v1 h-1 z M5 5 h1 v1 h-1 z M3 6 h1 v1 h-1 z M4 6 h1 v1 h-1 z" fill="rgb(33,37,41)" /></svg>');
  border-image-outset: 2;
}

.nes-btn {
  border-image-slice: 2;
  border-image-width: 2;
  border-image-repeat: stretch;
  border-image-source: url('data:image/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8" ?><svg version="1.1" width="5" height="5" xmlns="http://www.w3.org/2000/svg"><path d="M2 1 h1 v1 h-1 z M1 2 h1 v1 h-1 z M3 2 h1 v1 h-1 z M2 3 h1 v1 h-1 z" fill="rgb(33,37,41)" /></svg>');
  border-image-outset: 2;
}

.nes-progress {
  border-image-slice: 2;
  border-image-width: 2;
  border-image-repeat: stretch;
  border-image-source: url('data:image/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8" ?><svg version="1.1" width="5" height="5" xmlns="http://www.w3.org/2000/svg"><path d="M2 1 h1 v1 h-1 z M1 2 h1 v1 h-1 z M3 2 h1 v1 h-1 z M2 3 h1 v1 h-1 z" fill="rgb(33,37,41)" /></svg>');
  border-image-outset: 2;
}

.nes-input.is-success,
.nes-textarea.is-success {
  border-image-source: url('data:image/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8" ?><svg version="1.1" width="5" height="5" xmlns="http://www.w3.org/2000/svg"><path d="M2 1 h1 v1 h-1 z M1 2 h1 v1 h-1 z M3 2 h1 v1 h-1 z M2 3 h1 v1 h-1 z" fill="rgb(146,204,65)" /></svg>');
  outline-color: #76c442;
}
.nes-input {
  border-image-slice: 2;
  border-image-width: 2;
  border-image-repeat: stretch;
  border-image-source: url('data:image/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8" ?><svg version="1.1" width="5" height="5" xmlns="http://www.w3.org/2000/svg"><path d="M2 1 h1 v1 h-1 z M1 2 h1 v1 h-1 z M3 2 h1 v1 h-1 z M2 3 h1 v1 h-1 z" fill="rgb(33,37,41)" /></svg>');
  border-image-outset: 2;
}

body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: red;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.outer-game-container {
  width: 100%;
  max-width: 800px;
  padding: 2rem;
}

.text-center {
  text-align: center;
}

.emoji-group {
  display: inline-block;
  padding: 0.2em;
  border-radius: 0.25em;
  text-align: center;
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.emoji-group:hover {
  transform: scale(1.2);
}

.streak-animation {
  animation: shake 0.5s;
}

@keyframes shake {
  0% {
    transform: translate(1px, 1px) rotate(0deg);
  }
  25% {
    transform: translate(-1px, -2px) rotate(-1deg);
  }
  50% {
    transform: translate(-3px, 0px) rotate(1deg);
  }
  75% {
    transform: translate(3px, 2px) rotate(0deg);
  }
  100% {
    transform: translate(1px, -1px) rotate(-1deg);
  }
}

.bonus-round {
  background-color: #ffd700;
  color: #000;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  font-weight: bold;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
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

.hover-red {
  background-color: #d81b60;
}
.hover-blue {
  background-color: #1e88e5;
}
.hover-yellow {
  background-color: #ffc107;
}
.hover-green {
  background-color: #004d40;
}
.hover-purple {
  background-color: #994f00;
}

.multiplication-table-overlay {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 0.9);
  border: 2px solid #add8e6;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

.multiplication-grid-header,
.multiplication-grid-row {
  display: flex;
}

.row-label {
  width: 30px;
  font-weight: bold;
  text-align: center;
}

.column-number {
  width: 30px;
  text-align: center;
  font-weight: bold;
}

.multiplication-emoji {
  width: 30px;
  text-align: center;
}

/* Timer Bar Styles */
.progress-container {
  width: 100%;
  margin-bottom: 1rem;
  position: relative;
}

.progress {
  height: 50px;
  background-color: #e9ecef;
  border-radius: 0.25rem;
}

.progress-bar {
  transition: width 0.1s ease;
  background-color: #8bc34a;
}

.timer-text {
  margin: 0;
  color: #000;
  font-weight: bold;
}

/* Streak Message Styles */
.streak-message {
  background-color: #ffd700;
  color: #000;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  font-weight: bold;
  animation: pulse 1s infinite;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.button-container button {
  width: 220px;
  margin: 0 30px;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

</style>

