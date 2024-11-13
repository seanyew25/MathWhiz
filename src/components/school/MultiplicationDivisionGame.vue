<template>
  <div class="md:tw-overflow-hidden tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-center tw-min-h-[calc(100vh-56px)]">
    <!-- Game Container -->
    <div class="nes-container is-rounded is-centered with-title" style="background-color: rgba(255, 245, 205, 1); width: 800px;">
      <p class="title" style="background-color: rgba(255, 245, 205, 1);">Multiplication and Division</p>

      <div class="p-6 w-[400px] h-[300px] mx-auto">
        <!-- Instructions and Hint -->
        <div class="tw-flex tw-items-center tw-justify-center tw-mb-4">
          <h1 class="tw-text-3xl text-center align-center">
            {{ currentQuestion.operator === "×" ? "Multiply the numbers!" : "Divide the numbers!" }}
          </h1>
          <button @click="showHintModal = true" class="nes-btn is-primary tw-text-sm tw-mx-4">Hint</button>
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
              Hover over the <strong>bottom row of emojis</strong> to visualise the question!<br>
              For <strong>multiplication</strong>, you'll see a grid. <br>
              For <strong>division</strong>, you'll see coloured groups.
            </p>
            <!-- Button-->
            <div class="tw-flex tw-gap-8 tw-justify-center">
                <button @click="showHintModal = false" class="nes-btn is-success tw-w-auto">I Understand!</button>
              </div>
            </div>
          </div>

          <!-- Timer Bar -->
          <div class="progress-container">
          <progress
            class="nes-progress is-success"
            :value="timeRemaining"
            :max="totalTime"
          ></progress>
          <p class="nes-text is-primary">
            {{ timeRemaining.toFixed(1) }} seconds
          </p>
        </div>

        <transition name="fade">
          <div
            v-if="isBonusRound"
            class="bonus-round text-center mb-4"
          >
            Bonus Round! Double coins for correct answers!
          </div>
        </transition>

        <div class="text-center tw-mb-2">
          <div class="text-4xl" v-if="currentQuestion">
            <span>{{ currentQuestion.leftNumber }}</span>
            <span class="mx-2">{{ currentQuestion.operator }}</span>
            <span>{{ currentQuestion.rightNumber }}</span>
          </div>
        </div>

        <div class="text-center tw-mb-3">
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

            <!-- Operator with Click Event -->
<!-- Add ref to operator symbol -->
<div
  class="tw-text-4xl operator-symbol"
  @click="handleOperatorClick"
  ref="operatorSymbol"
>
  {{ currentQuestion.operator }}
</div>
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

        <div class="nes-field tw-mb-2">
          <input
            type="number"
            v-model="userInput"
            @keyup.enter="checkAnswer"
            class="nes-input is-success"
            placeholder="Enter Your Answer"
            :disabled="gameOver || !gameStarted"
          />
        </div>

        <div class="tw-text-center tw-mb-2">
          <button
            @click="checkAnswer"
            :class="{ 'nes-btn': true, 'is-disabled': gameOver || !gameStarted }"
            :disabled="gameOver || !gameStarted"
          >
            Submit Answer
          </button>
        </div>

        <div class="tw-text-center tw-mb-2">
          <p class="tw-test-md">
            <br>
            Question: {{ questionCount }} / 10 |
            Coins earned: {{ medals }}<i class="nes-icon coin is-small"></i>
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
        
        <dialog class="nes-dialog" id="instructions-dialog">
          <form method="dialog">
            <p class="title" style="text-align:center;">Welcome to the Multiplication and Division Game!</p>
            <p style="text-align: center;">
              Answer 10 questions and earn Destress coins.<br><br>
              Answer 5 questions in a row correctly to active a streak! <br>
              It earns you double coins!<br><br>
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
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch, nextTick} from "vue";
import confetti from "canvas-confetti";
import { useRouter } from 'vue-router';

const emojiSet = ["😀", "🐶", "🍕", "🚗", "🎉", "🏀", "🌍", "💡", "📚", "💻"];
const getRandomEmoji = () => emojiSet[Math.floor(Math.random() * emojiSet.length)];

const tables = [2, 3, 4, 5, 6, 7];

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
    const questionCount = ref(0);
    const medals = ref(0);
    const timerWidth = ref(100);
    const initialTimerSeconds = 20; // Updated from 10 to 20
    const timerSeconds = ref(initialTimerSeconds);
    const pausedTimerSeconds = ref(0);
    const userInput = ref("");
    const hoverIndex = ref(null);
    let timerInterval = null;

    const hasCorrectStreak = computed(() => correctStreak.value > 0);
    
    const showMultiplicationGrid = ref(false);
    const highlightedRow = ref(0);
    const highlightedCol = ref(0);
    const bottomEmojis = ref(null);

    const operatorEffectActive = ref(false);
    const operatorSymbol = ref(null);
    const showHintModal = ref(false);
const timeRemaining = ref(20); // Or your desired initial time
const totalTime = ref(20);     // Total time per question



    const handleOperatorClick = (event) => {
  event.stopPropagation();
  if (operatorEffectActive.value) {
    clearOperatorEffect();
  } else {
    applyOperatorEffect();
    document.addEventListener('click', handleOutsideClick);
  }
};

const applyOperatorEffect = () => {
  operatorEffectActive.value = true;
  if (currentQuestion.value.operator === '×') {
    showMultiplicationGrid.value = true;
    nextTick(() => {
      updateGridPosition();
    });
  } else if (currentQuestion.value.operator === '÷') {
    hoverIndex.value = 0;
  }
};

const clearOperatorEffect = () => {
  operatorEffectActive.value = false;
  if (currentQuestion.value.operator === '×') {
    showMultiplicationGrid.value = false;
  } else if (currentQuestion.value.operator === '÷') {
    hoverIndex.value = null;
  }
  document.removeEventListener('click', handleOutsideClick);
};

const handleOutsideClick = (event) => {
  const operatorElement = operatorSymbol.value;
  if (!operatorElement.contains(event.target)) {
    clearOperatorEffect();
  }
};


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
    console.log("Timer started"); // Debugging line
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
  isBonusRound.value = false; // Reset bonus round
  handleIncorrectAnswer();    // Treat as incorrect answer
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
  questionCount.value += 1;

  // Activate streak message on 5th consecutive correct answer
  if (correctStreak.value >= 5) {
    triggerConfetti();
    isBonusRound.value = true;
  } else {
    isBonusRound.value = false;
  }

  // Award coins
  if (correctStreak.value >= 6) {
    medals.value += 2; // Double coins from 6th correct answer
  } else {
    medals.value += 1;
  }

  // Cap medals at 15
  if (medals.value > 15) {
    medals.value = 15;
  }

  earnedMedal.value = true;
  setTimeout(() => {
    earnedMedal.value = false;
  }, 1000);

  if (questionCount.value >= 10) {
    endGame();
  } else {
    nextQuestion();
  }
};


const handleIncorrectAnswer = () => {
  playSound(false);
  correctStreak.value = 0;
  isBonusRound.value = false;
  questionCount.value += 1;

  if (questionCount.value >= 10) {
    endGame();
  } else {
    nextQuestion();
  }
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

    const endGame = () => { // 12NOV24 - Sean access this. This is the final coins value. PM me if u nt sure
      gameOver.value = true;
      completionMessage.value = "You've obtained " + medals.value + " Destress coins!";
      clearInterval(timerInterval);
      console.log("Game over. Total questions answered: ", questionCount.value);
    };

    const restartGame = () => {
      gameOver.value = false;
      gameStarted.value = true;
      completionMessage.value = "";
      medals.value = 0;
      correctStreak.value = 0;
      questionCount.value = 0;
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
    console.log("Game started"); // Add this line
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
          grid.style.top = `${rect.top - grid.offsetHeight}px`;
          grid.style.left = `${rect.left}px`;
          grid.style.width = `${rect.width}px`;
        }
      }
    };

    const handleBottomEmojisHover = () => {
      if (currentQuestion.value.operator === '×') {
        showMultiplicationGrid.value = true;
        nextTick(() => {
          updateGridPosition();
        });
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
      window.addEventListener('resize', updateGridPosition);
    });

    onUnmounted(() => {
      clearInterval(timerInterval);
      window.removeEventListener('resize', updateGridPosition);
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
      questionCount,
      showHintModal,
  timeRemaining,
  totalTime,
  gameOver,
  handleOperatorClick,
  operatorSymbol,
  applyOperatorEffect,
  clearOperatorEffect,
  handleOutsideClick,
  checkAnswer,
    };
  },
};
</script>

<style scoped>
* {
  font-family: "Press Start 2P";
}

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

.math-game .hover-red { background-color: #D81B60; }
.math-game .hover-blue { background-color: #1E88E5; }
.math-game .hover-yellow { background-color: #FFC107; }
.math-game .hover-green { background-color: #004D40; }
.math-game .hover-purple { background-color: #994F00; }

.center-button {
  display: flex;
  justify-content: center;
}

.math-game .multiplication-grid {
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