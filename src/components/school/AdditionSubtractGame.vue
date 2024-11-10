<template>
  <div
    class="math-game min-h-screen bg-gray-100 flex flex-col"
    style="background-color: #add8e6; position: relative"
  >
    <div class="flex-grow flex items-center justify-center p-4">
      <div
        class="w-full max-w-5xl bg-white rounded-lg shadow-xl overflow-hidden"
      >
        <div class="p-6 w-[400px] h-[300px] mx-auto">
          <h1 class="text-3xl font-bold text-center align-center mb-6">
            {{
              currentQuestion.operator === "+"
                ? "Addition Game"
                : "Subtraction Game" 
            }}
          </h1>

          <div class="progress-container">
            <progress
              class="nes-progress is-success"
              :value="timerWidth"
              :max="100"
            ></progress>
            <p class="nes-text is-primary">{{ Math.round(timerWidth) }}%</p>
          </div>

          <section>
            <button
              type="button"
              class="nes-btn is-primary"
              onclick="document.getElementById('dialog-default').showModal();"
            >
              Hint
            </button>
            <dialog class="nes-dialog" id="dialog-default">
              <form method="dialog">
                <p class="title">Hint</p>
                <p>
                  Hover over the emojis to visualise the addition and
                  subtraction
                </p>
                <menu class="dialog-menu">
                  <button class="nes-btn">Cancel</button>
                  <button class="nes-btn is-primary">Confirm</button>
                </menu>
              </form>
            </dialog>
          </section>

          <transition name="fade" mode="out-in">
            <div :key="'question-' + questionIndex" class="question-container">
              <div class="text-center mb-4">
                <div class="text-4xl" v-if="currentQuestion">
                  <span>{{ currentQuestion.leftNumber }}</span>
                  <span class="mx-2">{{ currentQuestion.operator }}</span>
                  <span>{{ currentQuestion.rightNumber }}</span>
                </div>
              </div>

              <div class="text-center mb-6" style="position: relative">
                <div class="text-4xl mb-4">
                  <transition-group name="bounce" tag="div">
                    <span
                      v-for="(item, index) in currentQuestion.leftItems"
                      :key="'left-' + index"
                      :class="['emoji-group', { hide: item.hide }]"
                      class="emoji-group"
                      @mouseover="handleHover"
                      @mouseleave="clearHover"
                    >
                      {{ item.item }}
                    </span>
                  </transition-group>

                  <div class="text-4xl">{{ currentQuestion.operator }}</div>

                  <transition-group name="bounce" tag="div">
                    <span
                      v-for="(item, index) in currentQuestion.rightItems"
                      :key="'right-' + index"
                      :class="['emoji-group', { hide: item.hide }]"
                      class="emoji-group"
                      @mouseover="handleHover"
                      @mouseleave="clearHover"
                    >
                      {{ item.item }}
                    </span>
                  </transition-group>

                  <span>=</span>
                </div>

                <!-- Addition hover table showing total in rows of 10 as overlay -->
                <div v-if="showAdditionTable" class="addition-table-overlay">
                  <!-- Column headers for 1 to 10 -->
                  <div class="addition-grid-header">
                    <span class="row-label"></span>
                    <!-- Empty cell for alignment with row labels -->
                    <span
                      v-for="col in 10"
                      :key="'col-' + col"
                      class="column-number"
                      >{{ col }}</span
                    >
                  </div>
                  <!-- Rows with row labels and emojis -->
                  <div
                    v-for="(row, rowIndex) in additionTableRows"
                    :key="rowIndex"
                    class="addition-grid-row"
                  >
                    <span class="row-label">{{ rowIndex + 1 }}</span>
                    <!-- Row label -->
                    <span
                      v-for="(emoji, index) in row"
                      :key="index"
                      class="addition-emoji"
                    >
                      {{ emoji }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </transition>

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

          <!-- Streak Message -->
          <div v-if="streakActive" class="text-center mb-2">
            <p class="text-xl text-green-600">
              You are on a streak! x2 coins enabled!
            </p>
          </div>

          <!-- Display coin count -->
          <div class="text-center mt-4">
            <p class="text-xl">
              Coins Earned: {{ coins }} <i class="nes-icon coin is-medium"></i>
            </p>
            <p class="text-xl">
              Questions Answered: {{ questionsAnswered }} / 10
            </p>
          </div>

          <div v-if="gameOver" class="game-over-overlay">
            <div class="game-over-content">
              <h2>{{ completionMessage }}</h2>
              <p>Total Coins Earned: {{ coins }}</p>
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
    </div>
  </div>
</template>

<script>
const emojiSet = ["🚗", "🏀", "🌍", "💡", "📚", "💻", "🏫", "👨‍🏫", "📏", "🔢"];
const getRandomEmoji = () =>
  emojiSet[Math.floor(Math.random() * emojiSet.length)];

const generateQuestion = () => {
  const operators = ["+", "-"];
  const operator = operators[Math.floor(Math.random() * operators.length)];
  let leftNumber, rightNumber, correct, leftItems, rightItems, selectedEmoji;

  selectedEmoji = getRandomEmoji();

  if (operator === "+") {
    leftNumber = Math.floor(Math.random() * 50) + 1;
    rightNumber = Math.floor(Math.random() * 50) + 1;
    correct = leftNumber + rightNumber;
  } else {
    leftNumber = Math.floor(Math.random() * 50) + 1;
    rightNumber = Math.floor(Math.random() * leftNumber);
    correct = leftNumber - rightNumber;
  }

  leftItems = Array(leftNumber)
    .fill(selectedEmoji)
    .map((item, index) => ({ item, hide: false }));
  rightItems = Array(rightNumber)
    .fill(selectedEmoji)
    .map((item) => ({ item, hide: false }));

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
  data() {
    return {
      gameOver: false,
      completionMessage: "",
      score: 0,
      highScore: localStorage.getItem("highScore") || 0,
      streakActive: false,
      coins: 0,
      correctAnswersInRow: 0,
      questionsAnswered: 0,
      questions: [
        generateQuestion(),
        generateQuestion(),
        generateQuestion(),
        generateQuestion(),
      ],
      questionIndex: 0,
      timerWidth: 100,
      userInput: "",
      showAdditionTable: false,
      additionTableRows: [],
      timerInterval: null,
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.questionIndex];
    },
  },
  methods: {
    startTimer() {
      this.timerWidth = 100;
      clearInterval(this.timerInterval);

      this.timerInterval = setInterval(() => {
        this.timerWidth = Math.max(0, this.timerWidth - 0.625);
        if (this.timerWidth <= 0) {
          clearInterval(this.timerInterval);
          this.nextQuestion();
        }
      }, 100);
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

      if (this.correctAnswersInRow >= 5) {
        this.streakActive = true;
      }

      this.coins += this.streakActive ? 2 : 1;

      if (this.questionsAnswered >= 10) {
        this.endGame();
        return;
      }

      this.nextQuestion();
    },
    handleIncorrectAnswer() {
      this.playSound(false);
      this.correctAnswersInRow = 0;
      this.streakActive = false;
      this.questionsAnswered += 1;

      if (this.questionsAnswered >= 10) {
        this.endGame();
        return;
      }

      this.nextQuestion();
    },
    checkAnswer() {
      const userAnswer = parseInt(this.userInput, 10);

      if (userAnswer === this.currentQuestion.correct) {
        this.handleCorrectAnswer();
      } else {
        this.handleIncorrectAnswer();
      }
    },
    handleHover() {
      if (this.currentQuestion.operator === "-") {
        this.currentQuestion.leftItems.forEach((item, i) => {
          if (
            i >=
            this.currentQuestion.leftItems.length -
              this.currentQuestion.rightNumber
          ) {
            item.hide = true;
          }
        });
        this.currentQuestion.rightItems.forEach((item) => (item.hide = true));
      } else if (this.currentQuestion.operator === "+") {
        const totalEmojis =
          this.currentQuestion.leftNumber + this.currentQuestion.rightNumber;
        const emoji = this.currentQuestion.selectedEmoji;
        this.additionTableRows = Array(Math.ceil(totalEmojis / 10))
          .fill()
          .map((_, i) => Array(Math.min(10, totalEmojis - i * 10)).fill(emoji));
        this.showAdditionTable = true;
      }
    },
    clearHover() {
      if (this.currentQuestion.operator === "-") {
        this.currentQuestion.leftItems.forEach((item) => (item.hide = false));
        this.currentQuestion.rightItems.forEach((item) => (item.hide = false));
      } else if (this.currentQuestion.operator === "+") {
        this.showAdditionTable = false;
        this.additionTableRows = [];
      }
    },
    nextQuestion() {
      this.userInput = "";
      this.questionIndex = (this.questionIndex + 1) % this.questions.length;

      this.currentQuestion.leftItems.forEach((item) => {
        item.hide = false;
      });
      this.currentQuestion.rightItems.forEach((item) => {
        item.hide = false;
      });
      this.showAdditionTable = false;
      this.additionTableRows = [];

      if (this.questionIndex === 0) {
        this.questions = [
          generateQuestion(),
          generateQuestion(),
          generateQuestion(),
          generateQuestion(),
        ];
      }

      this.timerWidth = 100;
      this.startTimer();
    },
    endGame() {
      this.gameOver = true;
      this.completionMessage = "Game Over! You've answered 10 questions.";
      clearInterval(this.timerInterval);
    },
    restartGame() {
      this.gameOver = false;
      this.completionMessage = "";
      this.coins = 0;
      this.correctAnswersInRow = 0;
      this.streakActive = false;
      this.questionsAnswered = 0;
      this.userInput = "";
      this.questions = [
        generateQuestion(),
        generateQuestion(),
        generateQuestion(),
        generateQuestion(),
      ];
      this.questionIndex = 0;
      this.startTimer();
    },
    exitGame() {
      console.log("Exiting game");
    },
  },
  mounted() {
    this.startTimer();
  },
  beforeUnmount() {
    clearInterval(this.timerInterval);
  },
};
</script>

<style scoped>
/* @import url("https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css");
@import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"); */

.math-game {
  font-family: "Press Start 2P", cursive;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: mediumseagreen;
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

.medals-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  justify-items: center;
  margin-top: 1rem;
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
  background-color: lightpink;
}
.hover-blue {
  background-color: lightblue;
}
.hover-yellow {
  background-color: lightyellow;
}
.hover-green {
  background-color: lightgreen;
}
.hover-purple {
  background-color: lightcoral;
}

.multiplication-grid {
  display: inline-grid;
  gap: 2px;
  margin: 10px 0;
}

.multiplication-cell {
  width: 20px;
  height: 20px;
  background-color: #4caf50;
  border: 1px solid #45a049;
}

.emoji-group {
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.emoji-group.hide {
  opacity: 0;
}

.emoji-group.move {
  transform: translateX(50px);
}

.addition-table-overlay {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 0.9);
  border: 2px solid #add8e6;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-height: 300px;
  overflow-y: auto;
  z-index: 10;
  display: grid;
  grid-template-columns: 20px repeat(10, 1fr);
  gap: 5px;
}

.addition-grid-header {
  display: contents;
}

.column-number {
  font-weight: bold;
  text-align: center;
}

.addition-grid-row {
  display: contents;
}

.row-label {
  font-weight: bold;
  text-align: center;
}

.addition-emoji {
  text-align: center;
}

.hint-button {
  position: relative;
  top: 10px;
  margin-bottom: 15px;
  z-index: 1;
}
</style>
