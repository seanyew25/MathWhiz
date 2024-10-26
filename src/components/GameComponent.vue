<template>
  <div class="tw-min-h-screen tw-bg-gray-100 tw-flex tw-flex-col">
    <!-- Timer Bar -->
    <div class="tw-w-full tw-h-8 tw-bg-gray-200">
      <div
        class="tw-h-full tw-transition-all tw-duration-100 tw-ease-linear tw-rounded-r-full"
        :style="{
          width: `${timerWidth}%`,
          backgroundColor: `rgb(${
            255 - Math.floor(2.55 * timerWidth)
          }, ${Math.floor(2.55 * timerWidth)}, 0)`,
        }"
      ></div>
    </div>

    <!-- Main game content area -->
    <div class="tw-flex-grow tw-flex tw-items-center tw-justify-center tw-p-4">
      <div
        class="tw-w-full tw-max-w-4xl tw-bg-white tw-rounded-lg tw-shadow-xl tw-overflow-hidden"
      >
        <div class="tw-p-6">
          <h1 class="tw-text-3xl tw-font-bold tw-text-center tw-mb-6">
            Multiplication and Division Game
          </h1>

          <!-- Numeric Question Section -->
          <div class="tw-text-center tw-mb-4">
            <div class="tw-text-4xl" v-if="currentQuestion">
              {{ currentQuestion.leftNumber }} {{ currentQuestion.operator }}
              {{ currentQuestion.rightNumber }} = ?
            </div>
          </div>

          <!-- Emoji Question Section -->
          <div class="tw-text-center tw-mb-6">
            <div class="tw-text-4xl tw-mb-4" v-if="currentQuestion">
              <span
                v-for="(item, index) in currentQuestion.leftItems"
                :key="`left-${index}`"
                :class="getEmojiClass(index)"
                class="emoji-group"
              >
                {{ item }}
              </span>
              <span class="tw-mx-2">{{ currentQuestion.operator }}</span>
              <span
                v-for="(item, index) in currentQuestion.rightItems"
                :key="`right-${index}`"
                class="emoji-group"
                @mouseover="hoverDivisor(index)"
                @mouseleave="clearHover"
              >
                {{ item }}
              </span>
              <span class="tw-mx-2">=</span>
            </div>
          </div>

          <!-- Answer Input Section -->
          <div class="tw-text-center mb-6">
            <input
              type="number"
              v-model="userInput"
              class="border-2 border-gray-300 p-2 rounded-lg text-2xl text-center"
              placeholder="Enter your answer"
            />
          </div>

          <!-- Submit Button -->
          <div class="tw-text-center">
            <button
              @click="checkAnswer"
              class="tw-bg-blue-500 hover:tw-bg-blue-600 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-rounded tw-transition tw-duration-300"
            >
              Submit Answer
            </button>
          </div>

          <!-- Streak and Medal Display (only visible if streak >= 3) -->
          <div class="tw-text-center tw-mt-6" v-if="correctStreak >= 3">
            <p class="tw-text-xl">
              Streak Count: {{ correctStreak }} Good Job! Medals earned:
              <span v-for="n in medals" :key="n" class="tw-text-2xl">🏅</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      questions: [
        this.generateQuestion(),
        this.generateQuestion(),
        this.generateQuestion(),
        this.generateQuestion(),
      ],
      questionIndex: 0,
      correctStreak: 0,
      medals: 0,
      timerWidth: 100,
      userInput: "",
      hoverIndex: null,
      timerInterval: null,
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.questionIndex];
    },
  },
  methods: {
    generateQuestion() {
      const operators = ["×", "÷"];
      const operator = operators[Math.floor(Math.random() * operators.length)];
      let leftNumber,
        rightNumber,
        correct,
        leftItems,
        rightItems,
        selectedEmoji;

      // Emoji selection
      const emojiSet = [
        "😀",
        "🐶",
        "🍕",
        "🚗",
        "🎉",
        "🏀",
        "🌍",
        "💡",
        "📚",
        "💻",
      ];
      selectedEmoji = emojiSet[Math.floor(Math.random() * emojiSet.length)];

      if (operator === "×") {
        const tables = [2, 3, 4, 5, 10];
        leftNumber = tables[Math.floor(Math.random() * tables.length)];
        rightNumber = Math.floor(Math.random() * 8) + 2;
        correct = leftNumber * rightNumber;

        leftItems = Array(leftNumber).fill(selectedEmoji);
        rightItems = Array(rightNumber).fill(selectedEmoji);
      } else {
        const tables = [2, 3, 4, 5, 10];
        rightNumber = tables[Math.floor(Math.random() * tables.length)];
        leftNumber = rightNumber * (Math.floor(Math.random() * 4) + 2);
        correct = leftNumber / rightNumber;

        leftItems = Array(leftNumber).fill(selectedEmoji);
        rightItems = Array(rightNumber).fill(selectedEmoji);
      }

      return {
        leftItems,
        rightItems,
        operator,
        leftNumber,
        rightNumber,
        correct,
      };
    },
    getEmojiClass(index) {
      const colors = [
        "hover-red",
        "hover-blue",
        "hover-yellow",
        "hover-green",
        "hover-purple",
      ];
      if (this.hoverIndex !== null && this.currentQuestion.operator === "÷") {
        const groupSize = this.currentQuestion.rightNumber; // Grouping for hover
        const groupIndex = Math.floor(index / groupSize);
        return colors[groupIndex % colors.length];
      }
      return "";
    },
    hoverDivisor(index) {
      this.hoverIndex = index;
    },
    clearHover() {
      this.hoverIndex = null;
    },
    checkAnswer() {
      const userAnswer = parseInt(this.userInput, 10);
      if (userAnswer === this.currentQuestion.correct) {
        this.correctStreak += 1;
        if (this.correctStreak >= 3) {
          this.medals += 1;
        }
        alert("Correct! Moving to next question.");
        this.nextQuestion();
      } else {
        this.correctStreak = 0;
        alert("Wrong! Try again.");
      }
    },
    nextQuestion() {
      this.userInput = "";
      this.hoverIndex = null;
      this.questionIndex = (this.questionIndex + 1) % this.questions.length;
      if (this.questionIndex === 0) {
        this.questions = [
          this.generateQuestion(),
          this.generateQuestion(),
          this.generateQuestion(),
          this.generateQuestion(),
        ];
      }
      this.startTimer();
    },
    startTimer() {
      this.timerWidth = 100;
      clearInterval(this.timerInterval);
      this.timerInterval = setInterval(() => {
        this.timerWidth -= 0.1;
        if (this.timerWidth <= 0) {
          clearInterval(this.timerInterval);
          alert("Time is up! Next question.");
          this.nextQuestion();
        }
      }, 100);
    },
  },
  mounted() {
    this.startTimer();
  },
  unmounted() {
    clearInterval(this.timerInterval);
  },
};
</script>

<style scoped>
.emoji-group {
  display: inline-block;
  padding: 0.2em;
  border-radius: 0.25em;
}
.hover-red {
  background-color: red;
}
.hover-blue {
  background-color: blue;
}
.hover-yellow {
  background-color: yellow;
}
.hover-green {
  background-color: green;
}
.hover-purple {
  background-color: purple;
}
.hover-magenta {
  background-color: magenta;
}
.hover-lightblue {
  background-color: lightblue;
}
</style>
