<template>
  <div class="math-game min-h-screen bg-gray-100 flex flex-col" style="background-color: #add8e6;">
    <div class="flex-grow flex items-center justify-center p-4">
      <div class="w-full max-w-5xl bg-white rounded-lg shadow-xl overflow-hidden">
        <div class="p-6 w-[400px] h-[300px] mx-auto">
          <h1 class="text-3xl font-bold text-center align-center mb-6">
            {{ currentQuestion.operator === '×' ? 'Multiplication Game' : 'Division Game' }}
          </h1>

          <!--Timer Bar Logic-->
          <div class="progress-container">
            <progress class="nes-progress is-success" :value="timerWidth" :max="100"></progress>
            <p class="nes-text is-primary">{{ Math.round(timerWidth) }}%</p>
          </div>

          <!-- Innovation 1 -->
          <!--NES.css hint button to allow users to better visualise division questions in chunks. -->
          <div>
            <section>
              <button type="button" class="nes-btn is-primary" onclick="document.getElementById('dialog-default').showModal();">
                Hint!
              </button>
              <dialog class="nes-dialog" id="dialog-default">
                <form method="dialog">
                  <p class="title">Hint</p>
                  <p>Hover over the denominator in division questions to better understand the question!</p>
                  <menu class="dialog-menu">
                    <button class="nes-btn">Cancel</button>
                    <button class="nes-btn is-success">Confirm</button>
                  </menu>
                </form>
              </dialog>
            </section>
          </div>

          <!-- Fever / Streak feature after a series of questions are correctly answered. -->
          <!-- 04Nov24: Adapt to global points score to link with cat perk usage, after discussion with Sean. -->
          <transition name="fade">
            <div v-if="isBonusRound && !gameOver" class="bonus-round text-center mb-4">
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
            <!-- Current Question Display -->
            <div class="text-4xl mb-4" v-if="currentQuestion">
              <transition-group name="bounce" tag="div">
                <!-- Background Colour when users hover on denominator.-->
                <span v-for="(item, index) in currentQuestion.leftItems" 
                      :key="'left-' + index" 
                      :class="getEmojiClass(index)" 
                      class="emoji-group">
                  {{ item }}
                </span>
              </transition-group>

              <div class="text-4xl">{{ currentQuestion.operator }}</div>

              <!-- Emoji Group Transition effect (Added to make changes in emoji representation of variable less stiff.) -->
              <transition-group name="bounce" tag="div">
                <span v-for="(item, index) in currentQuestion.rightItems" 
                      :key="'right-' + index" 
                      class="emoji-group" 
                      @mouseover="hoverDivisor(index)" 
                      @mouseleave="clearHover">
                  {{ item }}
                </span>
              </transition-group>

              <span>=</span>
            </div>
          </div>

          <!-- Input Field for Users to key in answer.-->
          <div class="nes-field is-inline">
            <input type="number" 
              v-model="userInput"
              @keyup.enter="checkAnswer"
              class="nes-input is-success" 
              placeholder="Enter Your Answer"
              :disabled="gameOver">
          </div>

          <!--Multiplication Game Taken Out temporarily, working on local file.  -->
          <!-- <div v-if="currentQuestion.operator === '×'" class="multiplication-grid" 
              :style="{ gridTemplateColumns: 'repeat(' + currentQuestion.rightNumber + ', 1fr)' }">
            <div v-for="(row, rowIndex) in multiplicationGrid" :key="'row-' + rowIndex">
              <div v-for="(cell, cellIndex) in row" :key="'cell-' + rowIndex + '-' + cellIndex" 
                  class="multiplication-cell"></div>
            </div>
          </div> -->

          <!-- Submit Answer button -->
          <div class="text-center">
            <button @click="checkAnswer" 
                    :class="{'nes-btn': true, 'is-disabled': gameOver}"
                    :disabled="gameOver">
              Submit Answer
            </button>
          </div>
          
          <!-- When user answers 5 correct questions in a row, this is triggered.-->
          <div class="text-center mt-6" v-if="hasCorrectStreak">
            <p class="text-xl" :class="streakClass">
              Streak Count: {{ correctStreak }} Good Job! Medals earned:
            </p>
            <!-- Medal grid of 2 rows, 5 columns.-->
            <div class="medals-grid">
              <span v-for="n in medals" :key="n">
                <i class="nes-icon coin is-medium"></i>
              </span>
            </div>
          </div>

          <!-- Score and High Score records of the users (past) attempts.-->
          <div class="text-center mt-4">
            <p class="text-xl">Score: {{ score }}</p>
            <p class="text-xl">High Score: {{ highScore }}</p>
          </div>

          <!-- NES.css adapted Exit and Restart Game buttons.-->
          <div v-if="gameOver" class="game-over-overlay">
            <div class="game-over-content">
              <h2>{{ completionMessage }}</h2>
              <p>Your final score: {{ score }}</p>
              <button @click="exitGame" class="nes-btn is-primary">Exit Game</button>
              <button @click="restartGame" class="nes-btn is-success">Restart Game</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'; 
import confetti from 'canvas-confetti'; // Confetti effect after 3 correct answers in a row.

const emojiSet = ['😀', '🐶', '🍕', '🚗', '🎉', '🏀', '🌍', '💡', '📚', '💻'];
const getRandomEmoji = () => emojiSet[Math.floor(Math.random() * emojiSet.length)];

const tables = [2, 3, 4, 5, 6, 7, 8, 9, 10]; // Number pool when crafting questions.

const generateQuestion = () => {
  const operators = ['×', '÷'];
  const operator = operators[Math.floor(Math.random() * operators.length)];
  let leftNumber, rightNumber, correct, leftItems, rightItems, selectedEmoji;

  selectedEmoji = getRandomEmoji();

  if (operator === '×') {
    // When multiplication question
    leftNumber = tables[Math.floor(Math.random() * tables.length)];
    rightNumber = Math.floor(Math.random() * 8) + 2;
    correct = leftNumber * rightNumber;
  } else {
    // When division question
    rightNumber = tables[Math.floor(Math.random() * tables.length)];
    leftNumber = rightNumber * (Math.floor(Math.random() * 4) + 2);
    correct = leftNumber / rightNumber;
  }

  // Visual representation of selected number from number pool. i.e. 3 is chosen, 3 emojis will represent number.
  leftItems = Array(leftNumber).fill(selectedEmoji); 
  rightItems = Array(rightNumber).fill(selectedEmoji);

  return { leftItems, rightItems, operator, leftNumber, rightNumber, correct };
};

export default {
  setup() {
    // Initiatilise Game Completion trigger to false.
    const gameOver = ref(false);
    
    // Initialise Empty Completion Message.
    const completionMessage = ref('');

    // Hover Colours
    const colors = ['hover-red', 'hover-blue', 'hover-yellow', 'hover-green', 'hover-purple'];
    
    // Initialise Medals earned to false until consecutive questions are answered correctly.
    const earnedMedal = ref(false);

    // Initialise Current Attmept's Score.
    const score = ref(0);

    // Locate and print highest attemp's score.
    const highScore = ref(localStorage.getItem('highScore') || 0);

    // Initialise "Fever" to false until user answers consecutive questions correctly.
    const isBonusRound = ref(false);

    //Direct to current question and execute function.
    const currentQuestion = ref(generateQuestion());

    // Initialise streak count to 0
    const correctStreak = ref(0);
    
    // Initialise medals to 0
    const medals = ref(0);

    // Initialise timer bar to 100%
    const timerWidth = ref(100);

    // Initialise Input Field to be empty.
    const userInput = ref('');

    // Hover indexes are not shown by default. Will require user to hover over denominator with cursor.
    const hoverIndex = ref(null);

    // Timer Interval to work with const startTimer, edit depletion rate @ timerWidth.value [ I PUT ANOTHER LINE BELOW FOR REFERENCE, PLEASE LOOK FOR IT.]
    let timerInterval = null;

    const hasCorrectStreak = computed(() => correctStreak.value >= 3); // Streak value shifted down here

    const streakClass = computed(() => ({ // Streak animation based on streak class
      'streak-animation': medals.value > 0 && earnedMedal.value,
    }));

    // Timer bar deplete once game starts (aka once page loads.)
    const startTimer = () => {
      if (gameOver.value) return;
      timerWidth.value = 100;
      clearInterval(timerInterval);

      timerInterval = setInterval(() => {
        if (gameOver.value) {
          clearInterval(timerInterval);
          return;
        }
        timerWidth.value = Math.max(0, timerWidth.value - 1.25); // [ HI IM HERE EDIT THE FLOAT VALUE TO PLAY AROUND WITH DEPLETION RATES OF TIMER BAR.]

        if (timerWidth.value <= 0) {
          clearInterval(timerInterval);
          nextQuestion();
        }
      }, 100);
    };


    const getEmojiClass = (index) => {
      if (currentQuestion.value.operator === '÷' && hoverIndex.value !== null) { //Check it is a division question
        const groupSize = currentQuestion.value.rightNumber; // Group size is dependent on denominator value.
        const groupIndex = Math.floor(index / groupSize); // Decides chunks and its respective colours
        return colors[groupIndex % colors.length]; // Returns the chunks into numerator.
      }
      return '';
    };

    const hoverDivisor = (index) => { 
      if (currentQuestion.value.operator === '÷') { // Check it is a division question
        hoverIndex.value = index; // When hovering, group all the different values calculated above and show user.
      }
    };
    const clearHover = () => { hoverIndex.value = null; }; // Once user removes cursor from denominator, remove the groupings.

    const playSound = (correct) => { // Audio cues to let user know if answer is right or wrong
      const audio = new Audio(correct ? 'https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3' : 'https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3');
      audio.volume = 1.0 // At 100%, tweak accordingly once other components are finalised. - 04NOV24
      audio.play(); 
    };

    const triggerConfetti = () => { // Confetti related tweaks.
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    };

    const handleCorrectAnswer = () => { // Answer handling. 
      playSound(true);
      correctStreak.value += 1;
      score.value += isBonusRound.value ? 20 : 10;

      if (correctStreak.value % 3 === 0) { // Streak starts after 3 correct answers.
        triggerConfetti();
      }

      if (correctStreak.value % 10 === 0) { // "Fever" / Bonus round triggered upon 10 consecutive questions answered correctly. 
        isBonusRound.value = true;
        setTimeout(() => {
          isBonusRound.value = false;
        }, 30000);
      }

      if (medals.value < 10) { 
        if (correctStreak.value > 5 && correctStreak.value % 1 === 0) { // Every subsequent question answered correctly after 5th, 1 additional medal is given per correct answer.
          medals.value += 1;
        } else if (correctStreak.value === 5) { // 1 Medal given on the 5th correct question answered correctly.
          medals.value += 1;
        }
      }

      if (medals.value === 10) { // End game once 10 medals are collected. Record score and scope to global points system 04NOV24
        endGame();
      }

      earnedMedal.value = true;
      setTimeout(() => { earnedMedal.value  = false; }, 1000);

      if (!gameOver.value) {
        nextQuestion();
      }
    };

    const handleIncorrectAnswer = () => { 
      playSound(false);
      correctStreak.value = 0; // Remove streak.
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

    const generatedQuestions = new Set(); // Set to store unique questions, 

    const generateUniqueQuestion = () => { // Added on 01NOV24 due to duplicate questions appearing while still awarding points.
      let question;
      let attempts = 0;
      const maxAttempts = 100; // Prevent infinite loop

      do {
        question = generateQuestion();
        attempts++;
        if (attempts > maxAttempts) {
          console.warn('Max attempts reached. Resetting generated questions.'); 
          generatedQuestions.clear();
          break;
        }
      } while (generatedQuestions.has(JSON.stringify(question)));
      
      generatedQuestions.add(JSON.stringify(question));
      return question;
    };
    
    const nextQuestion = () => {
      if (gameOver.value) return;
      userInput.value = '';
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

    // 1/2 RestartGame accounted for.
    const restartGame = () => {
      gameOver.value = false;
      completionMessage.value = '';
      medals.value = 0;
      correctStreak.value = 0;
      userInput.value = '';
      score.value = 0;
      isBonusRound.value = false;
      currentQuestion.value = generateQuestion();
      startTimer();
    };

    // 2/2 EndGame to be added below once directories are sorted 04NOV24
    const exitGame = () => {
      console.log('Exiting game');
    };
    // END EndGame
    
    // Multiplication Game taken out, working on local file.
    // const generateMultiplicationGrid = (left, right) => {
    //   const grid = [];
    //   for (let i = 0; i < left; i++) {
    //     const row = [];
    //     for (let j = 0; j < right; j++) {
    //       row.push(1);
    //     }
    //     grid.push(row);
    //   }
    //   return grid;
    // };
    
    // Multiplication Game taken out
    // const multiplicationGrid = computed(() => { 
    //   if (currentQuestion.value.operator === '×') {
    //     return generateMultiplicationGrid(currentQuestion.value.leftNumber, currentQuestion.value.rightNumber);
    //   }
    //   return null;
    // });


    // Compare current attempt to highest recorded score on local storage, if higher then replace.
    watch(score, (newScore) => { 
      if (newScore > highScore.value) {
        highScore.value = newScore;
        localStorage.setItem('highScore', newScore);
      }
    });

    onMounted(() => {  // Timer bar starts depleting once page is loaded.
      startTimer();
    });

    onUnmounted(() => { 
      clearInterval(timerInterval);
    });

    return { 
      timerWidth, currentQuestion, userInput, correctStreak, medals,
      hasCorrectStreak, streakClass, // Streak related returned here.
      checkAnswer, hoverDivisor, clearHover, getEmojiClass,
      earnedMedal, restartGame, exitGame,
      score, highScore, isBonusRound, gameOver, completionMessage,
      // Multiplication Game taken out
      // multiplicationGrid
    };
  }
};
</script>

<style scoped> /* Scope to local variable*/ 
@import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
@import url('https://unpkg.com/nes.css/css/nes.min.css');

.math-game { /* README: Should you add extra CSS, please add .math-game infront as this is the multiplication/division game specific CSS. */
  font-family: 'Press Start 2P', cursive;
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
  box-shadow: 0 4px 6px rgba(0, 0, 0, 

 0.1);
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
  transition: transform 0.3s ease, background-color  0.3s ease;
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

.math-game .medals-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  justify-items: center;
  margin-top: 1rem;
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

.math-game .hover-red { background-color: lightpink; }
.math-game .hover-blue { background-color: lightblue; }
.math-game .hover-yellow { background-color: lightyellow; }
.math-game .hover-green { background-color: lightgreen; }
.math-game .hover-purple { background-color: lightcoral; }

/* Taking out this part for demo to prof. Will fix this agn. */
/* .math-game .multiplication-grid {
  display: inline-grid;
  gap: 2px;
  margin: 10px 0;
}

.math-game .multiplication-cell {
  width: 20px;
  height: 20px;
  background-color: #4CAF50;
  border: 1px solid #45a049;
} */
</style>