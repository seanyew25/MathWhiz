<template>
    <div class="game-container">
      <h1 class="game-title">
        {{ currentQuestion.operator === '+' ? 'Addition Game' : 'Subtraction Game' }}
      </h1>
  
      <div class="progress-container">
        <progress class="nes-progress is-primary" :value="timerValue" max="100"></progress>
        <p class="timer-text">{{ Math.ceil(timerValue / 10) }} seconds</p>
      </div>
  
      <button @click="showHintDialog" class="nes-btn is-primary hint-button">
        Hint
      </button>
  
      <dialog ref="hintDialog" class="nes-dialog">
        <form method="dialog">
          <p class="title">Hint</p>
          <p>Hover over the emojis to visualize the addition and subtraction</p>
          <menu class="dialog-menu">
            <button @click="closeHintDialog" class="nes-btn">Close</button>
          </menu>
        </form>
      </dialog>
  
      <div class="question-container">
        <div class="question-text">
          <span>{{ currentQuestion.leftNumber }}</span>
          <span>{{ currentQuestion.operator }}</span>
          <span>{{ currentQuestion.rightNumber }}</span>
        </div>
  
        <div class="emoji-container" @mouseover="handleHover" @mouseleave="clearHover">
          <div class="emoji-group left">
            <span v-for="(item, index) in currentQuestion.leftItems" :key="'left-' + index" :class="{ hide: item.hide }">
              {{ item.item }}
            </span>
          </div>
  
          <div class="operator">{{ currentQuestion.operator }}</div>
  
          <div class="emoji-group right">
            <span v-for="(item, index) in currentQuestion.rightItems" :key="'right-' + index" :class="{ hide: item.hide }">
              {{ item.item }}
            </span>
          </div>
  
          <span>=</span>
  
          <div v-if="showAdditionTable" class="addition-table-overlay">
            <div class="addition-grid-header">
              <span v-for="col in 10" :key="'col-' + col" class="column-number">{{ col }}</span>
            </div>
            <div v-for="(row, rowIndex) in additionTableRows" :key="rowIndex" class="addition-grid-row">
              <span class="row-label">{{ rowIndex + 1 }}</span>
              <span v-for="(emoji, index) in row" :key="index" class="addition-emoji">
                {{ emoji }}
              </span>
            </div>
          </div>
        </div>
      </div>
  
      <div class="input-container">
        <input 
          v-model="userInput"
          @keyup.enter="checkAnswer"
          type="number" 
          class="nes-input"
          placeholder="Enter Your Answer"
          :disabled="gameOver"
        >
      </div>
  
      <button @click="checkAnswer" :disabled="gameOver" class="nes-btn is-primary submit-button">
        Submit Answer
      </button>
  
      <div v-if="streakActive && timerValue > 0" class="streak-message">
        <p>You are on a streak! x2 coins enabled!</p>
      </div>
  
      <div class="stats">
        <p>Coins Earned: {{ coins }} <i class="nes-icon coin is-small"></i></p>
        <p>Questions Answered: {{ questionsAnswered }} / 10</p>
      </div>
  
      <div v-if="gameOver" class="game-over-overlay">
        <div class="game-over-content">
          <h2>{{ completionMessage }}</h2>
          <p>Total Coins Earned: {{ coins }}</p>
          <button @click="exitGame" class="nes-btn is-error">Exit Game</button>
          <button @click="restartGame" class="nes-btn is-success">Restart Game</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  
  const emojiSet = ['🚗', '🏀', '🌍', '💡', '📚', '💻', '🏫', '👨‍🏫', '📏', '🔢']
  const getRandomEmoji = () => emojiSet[Math.floor(Math.random() * emojiSet.length)]
  
  const generateQuestion = () => {
    const operators = ['+', '-']
    const operator = operators[Math.floor(Math.random() * operators.length)]
    let leftNumber, rightNumber, correct, leftItems, rightItems, selectedEmoji
  
    selectedEmoji = getRandomEmoji()
  
    if (operator === '+') {
      leftNumber = Math.floor(Math.random() * 50) + 1
      rightNumber = Math.floor(Math.random() * 50) + 1
      correct = leftNumber + rightNumber
    } else {
      leftNumber = Math.floor(Math.random() * 50) + 1
      rightNumber = Math.floor(Math.random() * leftNumber)
      correct = leftNumber - rightNumber
    }
  
    leftItems = Array(leftNumber).fill(selectedEmoji).map((item) => ({ item, hide: false }))
    rightItems = Array(rightNumber).fill(selectedEmoji).map((item) => ({ item, hide: false }))
  
    return { leftItems, rightItems, operator, leftNumber, rightNumber, correct, selectedEmoji }
  }
  
  export default {
    setup() {
      const gameOver = ref(false)
      const completionMessage = ref('')
      const score = ref(0)
      const highScore = ref(localStorage.getItem('highScore') || 0)
      const streakActive = ref(false)
      const coins = ref(0)
      const correctAnswersInRow = ref(0)
      const questionsAnswered = ref(0)
      const questions = ref([generateQuestion(), generateQuestion(), generateQuestion(), generateQuestion()])
      const questionIndex = ref(0)
      const timerValue = ref(100)
      const userInput = ref('')
      const showAdditionTable = ref(false)
      const additionTableRows = ref([])
      const timerInterval = ref(null)
      const hintDialog = ref(null)
      const pausedTimerValue = ref(100)
  
      const currentQuestion = computed(() => questions.value[questionIndex.value])
  
      const startTimer = () => {
        clearInterval(timerInterval.value)
  
        timerInterval.value = setInterval(() => {
          timerValue.value = Math.max(0, timerValue.value - 1)
          if (timerValue.value <= 0) {
            clearInterval(timerInterval.value)
            streakActive.value = false
            nextQuestion()
          }
        }, 100)
      }
  
      const showHintDialog = () => {
        hintDialog.value.showModal()
        clearInterval(timerInterval.value)
        pausedTimerValue.value = timerValue.value
      }
  
      const closeHintDialog = () => {
        hintDialog.value.close()
        timerValue.value = pausedTimerValue.value
        startTimer()
      }
  
      const playSound = (correct) => {
        const audio = new Audio(correct 
          ? 'https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3' 
          : 'https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3')
        audio.play()
      }
  
      const handleCorrectAnswer = () => {
        playSound(true)
        correctAnswersInRow.value += 1
        questionsAnswered.value += 1
  
        if (correctAnswersInRow.value >= 5) {
          streakActive.value = true
        }
  
        coins.value += streakActive.value ? 2 : 1
  
        if (questionsAnswered.value >= 10) {
          endGame()
          return
        }
  
        nextQuestion()
      }
  
      const handleIncorrectAnswer = () => {
        playSound(false)
        correctAnswersInRow.value = 0
        streakActive.value = false
        questionsAnswered.value += 1
  
        if (questionsAnswered.value >= 10) {
          endGame()
          return
        }
  
        nextQuestion()
      }
  
      const checkAnswer = () => {
        const userAnswer = parseInt(userInput.value, 10)
  
        if (userAnswer === currentQuestion.value.correct) {
          handleCorrectAnswer()
        } else {
          handleIncorrectAnswer()
        }
      }
  
      const handleHover = () => {
        if (currentQuestion.value.operator === '-') {
          currentQuestion.value.rightItems.forEach(item => item.hide = true)
          currentQuestion.value.leftItems.forEach((item, i) => {
            if (i >= currentQuestion.value.leftItems.length - currentQuestion.value.rightNumber) {
              item.hide = true
            }
          })
        } else if (currentQuestion.value.operator === '+') {
          const totalEmojis = currentQuestion.value.leftNumber + currentQuestion.value.rightNumber
          const emoji = currentQuestion.value.selectedEmoji
          additionTableRows.value = Array(Math.ceil(totalEmojis / 10))
            .fill()
            .map((_, i) => Array(Math.min(10, totalEmojis - i * 10)).fill(emoji))
          showAdditionTable.value = true
        }
      }
  
      const clearHover = () => {
        if (currentQuestion.value.operator === '-') {
          currentQuestion.value.leftItems.forEach(item => item.hide = false)
          currentQuestion.value.rightItems.forEach(item => item.hide = false)
        } else if (currentQuestion.value.operator === '+') {
          showAdditionTable.value = false
          additionTableRows.value = []
        }
      }
  
      const nextQuestion = () => {
        userInput.value = ''
        questionIndex.value = (questionIndex.value + 1) % questions.value.length
  
        currentQuestion.value.leftItems.forEach(item => {
          item.hide = false
        })
        currentQuestion.value.rightItems.forEach(item => {
          item.hide = false
        })
        showAdditionTable.value = false
        additionTableRows.value = []
  
        if (questionIndex.value === 0) {
          questions.value = [generateQuestion(), generateQuestion(), generateQuestion(), generateQuestion()]
        }
  
        timerValue.value = 100
        startTimer()
      }
  
      const endGame = () => {
        gameOver.value = true
        completionMessage.value = "Game Over! You've answered 10 questions."
        clearInterval(timerInterval.value)
      }
  
      const restartGame = () => {
        gameOver.value = false
        completionMessage.value = ''
        coins.value = 0
        correctAnswersInRow.value = 0
        streakActive.value = false
        questionsAnswered.value = 0
        userInput.value = ''
        questions.value = [generateQuestion(), generateQuestion(), generateQuestion(), generateQuestion()]
        questionIndex.value = 0
        timerValue.value = 100
        startTimer()
      }
  
      const exitGame = () => {
        console.log('Exiting game')
      }
  
      onMounted(() => { 
        startTimer()
      })
  
      onUnmounted(() => { 
        clearInterval(timerInterval.value)
      })
  
      return { 
        timerValue, currentQuestion, userInput, coins, streakActive,
        checkAnswer, restartGame, exitGame, score, highScore,
        gameOver, completionMessage, questionsAnswered, handleHover, clearHover,
        showAdditionTable, additionTableRows, hintDialog, showHintDialog, closeHintDialog
      }
    }
  }
  </script>
  
  <style scoped>
  @import url('https://unpkg.com/nes.css/css/nes.min.css');
  
  .game-container {
    font-family: 'Press Start 2P', sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 2rem;
    background-color: #f0f0f0;
  }
  
  .game-title {
    font-size: 2rem;
    margin-bottom: 2rem;
    text-align: center;
  }
  
  .progress-container {
    width: 100%;
    max-width: 600px;
    margin-bottom: 1rem;
  }
  
  .nes-progress {
    height: 20px;
  }
  
  .timer-text {
    text-align: center;
    margin-top: 0.5rem;
  }
  
  .hint-button {
    margin-bottom: 1rem;
  }
  
  .question-container {
    position: relative;
    margin-bottom: 2rem;
    width: 100%;
  }
  
  .question-text {
    font-size: 2rem;
    margin-bottom: 1rem;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .question-text span {
    margin: 0 0.5rem;
  }
  
  .emoji-container {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    position: relative;
    width: 100%;
  }
  
  .emoji-group {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    flex: 1;
  }
  
  .emoji-group span {
    margin: 0.2rem;
    transition: opacity 0.3s ease;
  }
  
  .emoji-group span.hide {
    opacity: 0;
  }
  
  .operator {
    margin: 0 1rem;
  }
  
  .addition-table-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(255, 255, 255, 0.95);
    border: 2px solid #209cee;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    z-index: 10;
    display: grid;
    grid-template-columns: auto repeat(10, 1fr);
    gap: 0.5rem;
  }
  
  .addition-grid-header {
    display: contents;
  }
  
  .column-number, .row-label {
    font-weight: bold;
    text-align: center;
  }
  
  .addition-grid-row {
    display: contents;
  }
  
  .addition-emoji {
    text-align: center;
  }
  
  .input-container {
    margin-bottom: 1rem;
    width: 100%;
    max-width: 400px;
  }
  
  .nes-input {
    width: 100%;
  }
  
  .submit-button {
    margin-bottom: 1rem;
  }
  
  .streak-message {
    margin-bottom: 1rem;
    color: #28a745;
    font-weight: bold;
  }
  
  .stats {
    text-align: center;
    margin-bottom: 1rem;
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
  
  .game-over-content button {
    margin: 0.5rem;
  }
  </style>