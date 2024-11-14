<template>
  <div class="progress-container position-relative is-rounded">
    <div class="progress nes-progress is-success">
      <div class="progress-bar" role="progressbar" :style="{ width: `${timerWidth}%` }" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
    </div>
    <p class="timer-text position-absolute top-50 start-50 translate-middle">{{ Math.ceil(timerSeconds) }}s</p>
  </div>
</template>

<script>
export default {
  name: 'TimerBar',
  props: {
    initialTime: {  //is able to accept the values (from where it's called)
      type: Number,  //In this case, Timerbar.vue accepts initialTime and isRunning
      default: 10    //initialTime: The time in seconds for each question (default is 10)
    },
    isRunning: {   //isRunning: A boolean to control when the timer should start or stop.
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      timerWidth: 100,
      timerSeconds: this.initialTime,
      timerInterval: null
    };
  },
  methods: {
    startTimer() {
      if (this.timerInterval) return;
      this.timerInterval = setInterval(() => {
        if (this.timerSeconds > 0) {
          this.timerSeconds = Math.max(0, this.timerSeconds - 0.1);
          this.timerWidth = (this.timerSeconds / this.initialTime) * 100;
        } else {
          this.stopTimer();
          this.$emit('timerExpired');
        }
      }, 100);
    },
    pauseTimer() {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    },
    stopTimer() {
      this.pauseTimer();
      this.$emit('timerStopped');
    },
    resetTimer() {
    this.pauseTimer();
    this.timerSeconds = this.initialTime;
    this.timerWidth = 100;
    if (this.isRunning) {
      this.startTimer();
    }
  },
    resumeTimer() {
      if (this.isRunning && !this.timerInterval) {
        this.startTimer();
      }
    },
  },
  watch: {
    isRunning(newValue) {
      if (newValue) {
        this.startTimer();
      } else {
        this.pauseTimer();
      }
    }
  },
  mounted() {
    if (this.isRunning) {
      this.startTimer();
    }
  },
  beforeUnmount() {
    this.stopTimer();
  }
};
</script>

<style scoped>
.progress-container {
  width: 100%;
  margin-bottom: 1rem;
}

.progress {
  height: 50px;
  background-color: white;
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
.nes-progress {
  border-image-slice: 2;
  border-image-width: 2;
  border-image-repeat: stretch;
  border-image-source: url('data:image/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8" ?><svg version="1.1" width="5" height="5" xmlns="http://www.w3.org/2000/svg"><path d="M2 1 h1 v1 h-1 z M1 2 h1 v1 h-1 z M3 2 h1 v1 h-1 z M2 3 h1 v1 h-1 z" fill="rgb(33,37,41)" /></svg>');
  border-image-outset: 2;
  width: 100%;
  height: 48px;
  margin: 4px;
  color: #212529;
  background-color: #fff;
  -webkit-appearance: none;
  -moz-appearance: none;
       appearance: none;
}
</style>