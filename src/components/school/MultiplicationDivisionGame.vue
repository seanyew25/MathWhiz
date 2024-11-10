<template>
  <div
    class="math-game tw-min-h-screen tw-flex tw-flex-col"
    style="background-color: #add8e6"
  >
    <div class="tw-flex-grow tw-flex tw-items-center tw-justify-center tw-p-4">
      <div
        class="tw-w-full tw-max-w-5xl tw-bg-white tw-rounded-lg tw-shadow-xl tw-overflow-hidden"
        style="width: 1000px;"
      >
        <div class="tw-p-6 tw-w-full">
          <h1 class="tw-text-xl tw-font-bold tw-text-center tw-mb-6">
            {{ currentQuestion.operator === "×" ? "Multiplication" : "Division" }}
          </h1>

          <div class="progress-container tw-relative tw-mb-4">
            <progress
              class="nes-progress is-success tw-w-full"
              :value="timerWidth"
              :max="100"
            ></progress>
            <p class="nes-text tw-absolute tw-top-1/2 tw-left-1/2 tw-transform tw-translate-x-[-50%] tw-translate-y-[-50%] tw-text-center">
              {{ Math.ceil(timerSeconds) }}s
            </p>
          </div>

          <transition name="fade">
            <div
              v-if="isBonusRound && !gameOver"
              class="bonus-round text-center mb-4"
            >
              Bonus Round! Double coins for correct answers!
            </div>
          </transition>

          <div class="text-center tw-mb-4">
            <div class="text-4xl" v-if="currentQuestion">
              <span>{{ currentQuestion.leftNumber }}</span>
              <span class="mx-2">{{ currentQuestion.operator }}</span>
              <span>{{ currentQuestion.rightNumber }}</span>
            </div>
          </div>

          <div class="text-center tw-mb-6">
            <div class="tw-text-4xl tw-mb-4" v-if="currentQuestion">
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

              <div class="tw-text-4xl">{{ currentQuestion.operator }}</div>

              <div 
                class="bottom-emojis" 
                ref="bottomEmojis"
                @mouseover="handleBottomEmojisHover"
                @mouseleave="handleBottomEmojisLeave"
              >
                <transition-group name="bounce" tag="div">
                  <span
                    v-for="(item, index) in currentQuestion.rightItems"
                    :key="'right-' + index"
                    class="emoji-group"
                  >
                    {{ item }}
                  </span>
                </transition-group>
              </div>

              <span>=</span>
            </div>

            <transition name="fade">
              <div v-if="showMultiplicationGrid && currentQuestion.operator === '×'" class="multiplication-grid">
                <div class="grid-row grid-header">
                  <div class="grid-cell"></div>
                  <div v-for="col in currentQuestion.rightNumber" :key="'col-' + col" class="grid-cell">
                    {{ col }}
                  </div>
                </div>
                <div
                  v-for="row in currentQuestion.leftNumber"
                  :key="'row-' + row"
                  class="grid-row"
                >
                  <div class="grid-cell grid-label">{{ row }}</div>
                  <div
                    v-for="col in currentQuestion.rightNumber"
                    :key="'col-' + col"
                    class="grid-cell"
                    :class="{ 'highlighted': isHighlighted(row, col) }"
                    @mouseover="highlightCell(row, col)"
                    @mouseleave="clearHighlight"
                  >
                    {{ currentQuestion.leftItems[0] }}
                  </div>
                </div>
              </div>
            </transition>
          </div>

          <div class="nes-field tw-mb-4">
            <input
              type="number"
              v-model="userInput"
              @keyup.enter="checkAnswer"
              class="nes-input is-success"
              placeholder="Enter Your Answer"
              :disabled="gameOver || !gameStarted"
            />
          </div>

          <div class="tw-text-center tw-mb-4">
            <button
              @click="checkAnswer"
              :class="{ 'nes-btn': true, 'is-disabled': gameOver || !gameStarted }"
              :disabled="gameOver || !gameStarted"
            >
              Submit Answer
            </button>
            <button
              type="button"
              class="nes-btn is-primary center"
              @click="showHintDialog"
              :disabled="gameOver || !gameStarted"
            >
              Hint!
            </button>
          </div>

          <div class="tw-text-center tw-mt-6" v-if="hasCorrectStreak">
            <p class="tw-text-xl">
              <i class="nes-icon coin is-medium"></i>Coins earned: {{ medals }} / 15
            </p>
          </div>

          <div v-if="gameOver" class="game-over-overlay">
            <div class="game-over-content">
              <h2>{{ completionMessage }}</h2>
              <br>
              <p>You're one step closer to regaining Morgana's fur!</p>
              <p>Play again?</p>
              <button @click="exitGame" class="nes-btn is-primary">
                Exit Game
              </button>
              <button @click="restartGame" class="nes-btn is-success">
                Restart Game
              </button>
            </div>
          </div>

          <dialog class="nes-dialog" id="dialog-default">
            <form method="dialog">
              <p class="title">Hint</p>
              <p>
                Hover over the bottom row of emojis to visualize the question!
                For multiplication, you'll see a grid. For division, you'll see colored groups.
              </p>
              <menu class="dialog-menu center-button">
                <button class="nes-btn is-primary" @click="closeHintDialog">I Understand!</button>
              </menu>
            </form>
          </dialog>
          
          <dialog class="nes-dialog" id="instructions-dialog">
            <form method="dialog">
              <p class="title" style="text-align:center;">Welcome to the Multiplication and Division Game!</p>
              <p style="text-align: center;">
                Answer questions to earn Destress coins.<br><br>
                Objective: Earn <strong>15</strong> Destress coins to return Morgana's fur!<br><br>
                You have <strong>{{ initialTimerSeconds }}</strong> seconds for each question. Good luck!
              </p>
              <menu class="dialog-menu center-button">
                <button class="nes-btn is-primary" style="text-align:center;" @click="startGame">Start Game</button>
              </menu>
            </form>
          </dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import confetti from "canvas-confetti";
import { useRouter } from 'vue-router';

const emojiSet = ["😀", "🐶", "🍕", "🚗", "🎉", "🏀", "🌍", "💡", "📚", "💻"];
const getRandomEmoji = () => emojiSet[Math.floor(Math.random() * emojiSet.length)];

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
    const gameStarted = ref(false);
    const completionMessage = ref("");
    const colors = ["hover-red", "hover-blue", "hover-yellow", "hover-green", "hover-purple"];
    const earnedMedal = ref(false);
    const isBonusRound = ref(false);

    const currentQuestion = ref(generateQuestion());
    const correctStreak = ref(0);
    const medals = ref(0);
    const timerWidth = ref(100);
    const initialTimerSeconds = 10;
    const timerSeconds = ref(initialTimerSeconds);
    const pausedTimerSeconds = ref(0);
    const userInput = ref("");
    const hoverIndex = ref(null);
    let timerInterval = null;

    const hasCorrectStreak = computed(() => correctStreak.value >= 0);
    
    const showMultiplicationGrid = ref(false);
    const highlightedRow = ref(0);
    const highlightedCol = ref(0);
    const bottomEmojis = ref(null);

    const startTimer = () => {
      if (gameOver.value) return;
      clearInterval(timerInterval);

      timerInterval = setInterval(() => {
        if (gameOver.value) {
          clearInterval(timerInterval);
          return;
        }
        timerWidth.value = Math.max(0, (timerSeconds.value / initialTimerSeconds) * 100);
        timerSeconds.value = Math.max(0, timerSeconds.value - 0.1);

        if (timerSeconds.value <= 0) {
          clearInterval(timerInterval);
          handleTimerExpired();
          playSound(false);
        }
      }, 100);
    };

    const pauseTimer = () => {
      clearInterval(timerInterval);
      pausedTimerSeconds.value = timerSeconds.value;
    };

    const resumeTimer = () => {
      timerSeconds.value = pausedTimerSeconds.value;
      startTimer();
    };

    const handleTimerExpired = () => {
      correctStreak.value = 0;
      nextQuestion();
    };

    const getEmojiClass = (index) => {
      if (currentQuestion.value.operator === "÷" && hoverIndex.value !== null) {
        const groupSize = currentQuestion.value.rightNumber;
        const groupIndex = Math.floor(index / groupSize);
        return colors[groupIndex % colors.length];
      }
      return "";
    };

    const isHighlighted = (row, col) => {
      return row <= highlightedRow.value && col <= highlightedCol.value;
    };

    const highlightCell = (row, col) => {
      highlightedRow.value = row;
      highlightedCol.value = col;
    };

    const clearHighlight = () => {
      highlightedRow.value = 0;
      highlightedCol.value = 0;
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

      if (correctStreak.value % 5 === 0) {
        triggerConfetti();
      }

      if (correctStreak.value % 5 === 0) {
        isBonusRound.value = true;
        setTimeout(() => {
          isBonusRound.value = false;
        }, 30000);
      }

      if (medals.value < 15) {
        if (correctStreak.value > 5 && correctStreak.value % 1 === 0) {
          medals.value += 2;
        } else if (correctStreak.value <= 5) {
          medals.value += 1;
        }
      }

      if (medals.value >= 15) {
        medals.value = 15;
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
      correctStreak.value = medals.value;
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

    const generatedQuestions = new Set();

    const generateUniqueQuestion = () => {
      let question;
      let attempts = 0;
      const maxAttempts = 100;

      do {
        question = generateQuestion();
        attempts++;
        if (attempts > maxAttempts) {
          console.warn("Max attempts reached. Resetting generated questions.");
          generatedQuestions.clear();
          break;
        }
      } while (generatedQuestions.has(JSON.stringify(question)));

      generatedQuestions.add(JSON.stringify(question));
      return question;
    };

    const nextQuestion = () => {
      if (gameOver.value) return;
      userInput.value = "";
      hoverIndex.value = null;
      currentQuestion.value = generateUniqueQuestion();
      timerSeconds.value = initialTimerSeconds;
      startTimer();
    };

    const endGame = () => {
      gameOver.value = true;
      completionMessage.value = "You've earned all 15 Destress coins!";
      clearInterval(timerInterval);
      isBonusRound.value = false;
    };

    const restartGame = () => {
      gameOver.value = false;
      gameStarted.value = true;
      completionMessage.value = "";
      medals.value = 0;
      correctStreak.value = 0;
      userInput.value = "";
      isBonusRound.value = false;
      currentQuestion.value = generateQuestion();
      timerSeconds.value = initialTimerSeconds;
      startTimer();
    };

    const router = useRouter();
    const exitGame = () => {
      console.log("Exiting game");
      router.push("/game");
    };

    const showHintDialog = () => {
      pauseTimer();
      document.getElementById('dialog-default').showModal();
    };

    const closeHintDialog = () => {
      document.getElementById('dialog-default').close();
      resumeTimer();
    };

    const showInstructions = () => {
      document.getElementById('instructions-dialog').showModal();
    };

    const startGame = () => {
      gameStarted.value = true;
      document.getElementById('instructions-dialog').close();
      nextQuestion();
    };

    const updateGridPosition = () => {
      if (bottomEmojis.value && showMultiplicationGrid.value) {
        const rect = bottomEmojis.value.getBoundingClientRect();
        const grid = document.querySelector('.multiplication-grid');
        if (grid) {
          grid.style.position = 'absolute';
          grid.style.top = `${rect.bottom + window.scrollY}px`;
          grid.style.left = `${rect.left + window.scrollX}px`;
          grid.style.width = `${rect.width}px`;
        }
      }
    };

    const handleBottomEmojisHover = () => {
      if (currentQuestion.value.operator === '×') {
        showMultiplicationGrid.value = true;
      } else if (currentQuestion.value.operator === '÷') {
        hoverIndex.value = 0;
      }
    };

    const handleBottomEmojisLeave = () => {
      showMultiplicationGrid.value = false;
      hoverIndex.value = null;
    };

    watch(showMultiplicationGrid, (newValue) => {
      if (newValue) {
        nextTick(() => {
          updateGridPosition();
        });
      }
    });

    onMounted(() => {
      showInstructions();
    });

    onUnmounted(() => {
      clearInterval(timerInterval);
    });

    return {
      timerWidth,
      timerSeconds,
      initialTimerSeconds,
      currentQuestion,
      userInput,
      correctStreak,
      medals,
      hasCorrectStreak,
      checkAnswer,
      getEmojiClass,
      earnedMedal,
      restartGame,
      exitGame,
      isBonusRound,
      gameOver,
      gameStarted,
      completionMessage,
      showHintDialog,
      closeHintDialog,
      startGame,
      showMultiplicationGrid,
      isHighlighted,
      highlightCell,
      clearHighlight,
      bottomEmojis,
      updateGridPosition,
      hoverIndex,
      handleBottomEmojisHover,
      handleBottomEmojisLeave,
    };
  },
};
</script>

<style scoped>
.math-game {
  font-family: "Press Start 2P", cursive;
}

.math-game .game-container {
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

.math-game .outer-game-container {
  width: 100%;
  max-width: 800px;
  padding: 2rem;
}

.math-game .text-center {
  text-align: center;
}

.math-game .emoji-group {
  display: inline-block;
  padding: 0.2em;
  border-radius: 0.25em;
  text-align: center;
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.math-game .emoji-group:hover {
  transform: scale(1.2);
}

.math-game .streak-animation {
  animation: shake 0.5s;
}

@keyframes math-game-shake {
  0% { transform: translate(1px, 1px) rotate(0deg); }
  25% { transform: translate(-1px, -2px) rotate(-1deg); }
  50% { transform: translate(-3px, 0px) rotate(1deg); }
  75% { transform: translate(3px, 2px) rotate(0deg); }
  100% { transform: translate(1px, -1px) rotate(-1deg); }
}

.math-game .bonus-round {
  background-color: #ffd700;
  color: #000;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  font-weight: bold;
  animation: pulse 1s infinite;
}

@keyframes math-game-pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.math-game .game-over-overlay {
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

.math-game .game-over-content {
  background-color: white;
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
}

.math-game .hover-red { background-color: rgba(255, 182, 193, 0.7); }
.math-game .hover-blue { background-color: rgba(173, 216, 230, 0.7); }
.math-game .hover-yellow { background-color: rgba(255, 255, 224, 0.7); }
.math-game .hover-green { background-color: rgba(144, 238, 144, 0.7); }
.math-game .hover-purple { background-color: rgba(240, 128, 128, 0.7); }

.center-button {
  display: flex;
  justify-content: center;
}

.multiplication-grid {
  position: absolute;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.9);
  border: 2px solid #000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  padding: 10px;
}

.grid-row {
  display: flex;
  align-items: center;
}

.grid-cell {
  width: 40px;
  height: 40px;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.grid-header .grid-cell,
.grid-label {
  font-weight: bold;
  background-color: #f0f0f0;
}

.grid-cell.highlighted {
  background-color: rgba(255, 255, 0, 0.5);
}

.bottom-emojis {
  position: relative;
  display: inline-block;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>