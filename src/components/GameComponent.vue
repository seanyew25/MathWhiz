<template>
  <div
    class="min-h-screen bg-gray-100 flex flex-col"
    style="background-color: #add8e6"
  >
    <div class="flex-grow flex items-center justify-center p-4">
      <div
        class="w-full max-w-5xl bg-white rounded-lg shadow-xl overflow-hidden"
      >
        <div class="p-6 w-[400px] h-[300px] mx-auto">
          <h1 class="text-3xl font-bold text-center align-center mb-6">
            {{
              currentQuestion.operator === "×"
                ? "Multiplication Game"
                : "Division Game"
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

          <div>
            <section>
              <button
                type="button"
                class="nes-btn is-primary"
                onclick="document.getElementById('dialog-default').showModal();"
              >
                Hint!
              </button>
              <dialog class="nes-dialog" id="dialog-default">
                <form method="dialog">
                  <p class="title">Hint</p>
                  <p>
                    Hover over the denominator in division questions to better
                    understand the question!
                  </p>
                  <menu class="dialog-menu">
                    <button class="nes-btn">Cancel</button>
                    <button class="nes-btn is-success">Confirm</button>
                  </menu>
                </form>
              </dialog>
            </section>
          </div>

          <transition name="fade">
            <div
              v-if="isBonusRound && !gameOver"
              class="bonus-round text-center mb-4"
            >
              Bonus Round! Double points for correct answers!
            </div>
          </transition>

          <div class="text-center mb-4">
            <div class="text-4xl" v-if="currentQuestion">
              <span>{{ currentQuestion.leftNumber }}</span>
              <span class="mx-2">{{ currentQuestion.operator }}</span>
              <span>{{ currentQuestion.rightNumber }}</span>
            </div>
          </div>

          <div class="text-center mb-6">
            <div class="text-4xl mb-4" v-if="currentQuestion">
              <transition-group name="bounce" tag="div">
                <span
                  v-for="(item, index) in currentQuestion.leftItems"
                  :key="'left-' + index"
                  :class="getEmojiClass(index)"
                  class="emoji-group"
                >
                  {{ item }}
                </span>
              </transition-group>

              <div class="text-4xl">{{ currentQuestion.operator }}</div>

              <transition-group name="bounce" tag="div">
                <span
                  v-for="(item, index) in currentQuestion.rightItems"
                  :key="'right-' + index"
                  class="emoji-group"
                  @mouseover="hoverDivisor(index)"
                  @mouseleave="clearHover"
                >
                  {{ item }}
                </span>
              </transition-group>

              <span>=</span>
            </div>
          </div>

          <div class="nes-field is-inline">
            <input
              type="number"
              v-model="userInput"
              @keyup.enter="checkAnswer"
              class="nes-input is-success"
              placeholder="Enter Your Answer"
              :disabled="gameOver"
            />
          </div>

          <div
            v-if="currentQuestion.operator === '×'"
            class="multiplication-grid"
            :style="{
              gridTemplateColumns:
                'repeat(' + currentQuestion.rightNumber + ', 1fr)',
            }"
          >
            <div
              v-for="(row, rowIndex) in multiplicationGrid"
              :key="'row-' + rowIndex"
            >
              <div
                v-for="(cell, cellIndex) in row"
                :key="'cell-' + rowIndex + '-' + cellIndex"
                class="multiplication-cell"
              ></div>
            </div>
          </div>

          <div class="text-center">
            <button
              @click="checkAnswer"
              :class="{ 'nes-btn': true, 'is-disabled': gameOver }"
              :disabled="gameOver"
            >
              Submit Answer
            </button>
          </div>

          <div class="text-center mt-6" v-if="correctStreak >= 3">
            <p
              class="text-xl"
              :class="{ 'streak-animation': medals > 0 && earnedMedal }"
            >
              Streak Count: {{ correctStreak }} Good Job! Medals earned:
            </p>

            <div class="medals-grid">
              <span v-for="n in medals" :key="n">
                <i class="nes-icon coin is-medium"></i>
              </span>
            </div>
          </div>

          <div class="text-center mt-4">
            <p class="text-xl">Score: {{ score }}</p>
            <p class="text-xl">High Score: {{ highScore }}</p>
          </div>

          <div v-if="gameOver" class="game-over-overlay">
            <div class="game-over-content">
              <h2>{{ completionMessage }}</h2>
              <p>Your final score: {{ score }}</p>
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
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import confetti from "canvas-confetti";

const emojiSet = ["😀", "🐶", "🍕", "🚗", "🎉", "🏀", "🌍", "💡", "📚", "💻"];
const getRandomEmoji = () =>
  emojiSet[Math.floor(Math.random() * emojiSet.length)];

const tables = [2, 3, 4, 5, 6, 7, 8, 9, 10];

const generateQuestion = () => {
  const operators = ["×", "÷"];
  const operator = operators[Math.floor(Math.random() * operators.length)];
  let leftNumber, rightNumber, correct, leftItems, rightItems, selectedEmoji;

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

  leftItems = Array(leftNumber).fill(selectedEmoji);
  rightItems = Array(rightNumber).fill(selectedEmoji);

  return { leftItems, rightItems, operator, leftNumber, rightNumber, correct };
};

export default {
  setup() {
    const gameOver = ref(false);
    const completionMessage = ref("");
    const colors = [
      "hover-red",
      "hover-blue",
      "hover-yellow",
      "hover-green",
      "hover-purple",
    ];
    const earnedMedal = ref(false);
    const score = ref(0);
    const highScore = ref(localStorage.getItem("highScore") || 0);
    const isBonusRound = ref(false);

    const questions = ref([
      generateQuestion(),
      generateQuestion(),
      generateQuestion(),
      generateQuestion(),
    ]);
    const questionIndex = ref(0);
    const correctStreak = ref(0);
    const medals = ref(0);
    const timerWidth = ref(100);
    const userInput = ref("");
    const hoverIndex = ref(null);
    let timerInterval = null;

    const startTimer = () => {
      if (gameOver.value) return;
      timerWidth.value = 100;
      clearInterval(timerInterval);

      timerInterval = setInterval(() => {
        if (gameOver.value) {
          clearInterval(timerInterval);
          return;
        }
        timerWidth.value = Math.max(0, timerWidth.value - 1.25);

        if (timerWidth.value <= 0) {
          clearInterval(timerInterval);
          nextQuestion();
        }
      }, 100);
    };

    const getEmojiClass = (index) => {
      if (currentQuestion.value.operator === "÷" && hoverIndex.value !== null) {
        const groupSize = currentQuestion.value.rightNumber;
        const groupIndex = Math.floor(index / groupSize);
        return colors[groupIndex % colors.length];
      }
      return "";
    };

    const hoverDivisor = (index) => {
      if (currentQuestion.value.operator === "÷") {
        hoverIndex.value = index;
      }
    };
    const clearHover = () => {
      hoverIndex.value = null;
    };

    const playSound = (correct) => {
      const audio = new Audio(
        correct
          ? "https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3"
          : "https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3"
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

    const handleCorrectAnswer = () => {
      playSound(true);
      correctStreak.value += 1;
      score.value += isBonusRound.value ? 20 : 10;

      if (correctStreak.value % 3 === 0) {
        triggerConfetti();
      }

      if (correctStreak.value % 10 === 0) {
        isBonusRound.value = true;
        setTimeout(() => {
          isBonusRound.value = false;
        }, 30000);
      }

      if (medals.value < 10) {
        if (correctStreak.value > 5 && correctStreak.value % 1 === 0) {
          medals.value += 1;
        } else if (correctStreak.value === 5) {
          medals.value += 1;
        }
      }

      if (medals.value === 10) {
        endGame();
      }

      earnedMedal.value = true;
      setTimeout(() => {
        earnedMedal.value = false;
      }, 1000);

      if (!gameOver.value) {
        nextQuestion();
      }
    };

    const handleIncorrectAnswer = () => {
      playSound(false);
      correctStreak.value = 0;
    };

    const checkAnswer = () => {
      if (gameOver.value) return;

      const userAnswer = parseInt(userInput.value, 10);

      if (userAnswer === currentQuestion.value.correct) {
        handleCorrectAnswer();
      } else {
        handleIncorrectAnswer();
      }
    };

    const generatedQuestions = new Set(); // Set to store unique questions

    const generateUniqueQuestion = () => {
      let question;
      let attempts = 0;
      const maxAttempts = 100; // Prevent infinite loop

      do {
        question = generateQuestion(); // Generate a question
      } while (generatedQuestions.has(JSON.stringify(question))); // Check for duplicates

      generatedQuestions.add(JSON.stringify(question)); // Store the new question
      return question;
    };

    const nextQuestion = () => {
      if (gameOver.value) return;
      userInput.value = "";
      hoverIndex.value = null;
      currentQuestion.value = generateUniqueQuestion();
      timerWidth.value = 100;
      startTimer();
    };

    const endGame = () => {
      gameOver.value = true;
      completionMessage.value = "Congratulations! You've earned all 10 medals!";
      clearInterval(timerInterval);
      isBonusRound.value = false;
    };

    const restartGame = () => {
      gameOver.value = false;
      completionMessage.value = "";
      medals.value = 0;
      correctStreak.value = 0;
      userInput.value = "";
      score.value = 0;
      isBonusRound.value = false;
      questions.value = [
        generateQuestion(),
        generateQuestion(),
        generateQuestion(),
        generateQuestion(),
      ];
      questionIndex.value = 0;
      startTimer();
    };

    const generateMultiplicationGrid = (left, right) => {
      const grid = [];
      for (let i = 0; i < left; i++) {
        const row = [];
        for (let j = 0; j < right; j++) {
          row.push(1);
        }
        grid.push(row);
      }
      return grid;
    };

    const multiplicationGrid = computed(() => {
      if (currentQuestion.value.operator === "×") {
        return generateMultiplicationGrid(
          currentQuestion.value.leftNumber,
          currentQuestion.value.rightNumber
        );
      }
      return null;
    });

    const exitGame = () => {
      console.log("Exiting game");
    };

    watch(score, (newScore) => {
      if (newScore > highScore.value) {
        highScore.value = newScore;
        localStorage.setItem("highScore", newScore);
      }
    });

    onMounted(() => {
      startTimer();
    });

    onUnmounted(() => {
      clearInterval(timerInterval);
    });

    return {
      timerWidth,
      currentQuestion,
      userInput,
      correctStreak,
      medals,
      checkAnswer,
      hoverDivisor,
      clearHover,
      getEmojiClass,
      earnedMedal,
      restartGame,
      exitGame,
      score,
      highScore,
      isBonusRound,
      gameOver,
      completionMessage,
      multiplicationGrid,
      currentQuestion,
    };
  },
};
</script>

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css");
@import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap");
@import url("https://unpkg.com/nes.css/css/nes.min.css");

html,
body {
  font-family: "Press Start 2P", sans-serif;
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
</style>
