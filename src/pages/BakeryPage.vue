<template>
  <div
    :class="{
      'math-game': showChat,
      wrapper: showChat,
      'phone-cutscene': showPhone,
    }"
  >
    <div class="container-lg px-lg-0">
      <!-- Phone Section -->
      <div v-if="showPhone" class="row justify-content-center mb-4">
        <div class="col-auto">
          <div class="iphone">
            <div class="display">
              <div class="name">Prof Kyong calling...</div>
              <div class="contact-type">iPhone</div>
              <div class="avatar"></div>
            </div>
            <div class="buttons">
              <div @click="rejectCall" class="button decline">Decline</div>
              <div @click="acceptCall" class="button accept">Accept</div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="showDecline"
        class="d-flex justify-content-center"
        style="
          display: flex;
          align-items: center;
          height: 100vh;
          font-size: 30px;
        "
      >
        <div
          class="nes-container is-rounded is-centered with-title tw-max-w-3xl"
          style="background-color: rgba(255, 245, 205, 1)"
        >
          {{ declineMessageResult }}
        </div>
      </div>

      <div v-if="showChat" class="d-flex justify-content-center">
        <div
          class="nes-container is-rounded with-title mt-5"
          style="
            background-color: rgba(255, 245, 205, 1);
            width: 90%;
            padding: 10px;
          "
        >
          <p
            class="title math-game"
            style="
              background-color: rgba(255, 245, 205, 1);
              margin: -2rem auto 1rem;
            "
          >
            Fractions
          </p>
          <!-- Game Content -->
          <div v-if="showChat" class="row justify-content-center">
            <div class="col-11 text-center math-game">
              <TimerBar
                ref="timerBar"
                :initial-time="5"
                :is-running="isTimerRunning"
                @timerExpired="handleTimerExpired"
              />
            </div>
          </div>
          <transition name="fade">
            <div class="row justify-content-center">
              <div class="col-lg-11">
                <div
                  v-if="currentQuestion > 5"
                  class="bonus-round text-center math-game"
                  style="align-items: center"
                >
                  <i class="nes-icon trophy is-small"></i>
                  <span style="font-size: 15px"
                    >Bonus Round! x2 coins enabled!</span
                  >
                  <i class="nes-icon trophy is-small"></i>
                </div>
              </div>
            </div>
          </transition>

          <div class="row d-flex justify-content-center">
            <!-- Chat and Question -->
            <div
              v-if="showChat"
              class="col-12 col-lg-6 m-0 d-flex justify-content-center"
            >
              <div class="chat-container justify-content-center">
                <div
                  class="nes-container is-rounded text-wrap pinned-message math-game"
                >
                  {{ chatText }}
                </div>
                <div
                  class="scrollable-messages"
                  ref="scrollableMessages"
                  :class="{
                    'has-messages': messages.length > 0,
                    scrollable: messages.length > maxVisibleMessages,
                  }"
                  :style="{ height: scrollableHeight }"
                >
                  <div
                    v-for="(message, index) in messages"
                    :key="index"
                    class="nes-container is-rounded text-wrap math-game"
                    :class="{
                      correct: message.type === 'correct',
                      incorrect: message.type === 'incorrect',
                    }"
                  >
                    {{ message.text }}
                  </div>
                </div>
                <div
                  class="fraction-input"
                  :class="{
                    correct: correctAnswer,
                    incorrect: incorrectAnswer,
                    'input-vibrate': inputVibrate,
                  }"
                >
                  <span :class="{ blink: activeInput === 'numerator' }">{{
                    numerator || "?"
                  }}</span>
                  /
                  <span :class="{ blink: activeInput === 'denominator' }">{{
                    denominator || "?"
                  }}</span>
                </div>
              </div>
            </div>

            <!-- Cake Display -->
            <div
              v-if="showCakes"
              class="col-12 col-lg-6 d-flex align-items-center justify-content-center"
            >
              <div class="cake-display">
                <img :src="shelf" alt="Wooden shelf" class="shelf-image" />
                <div class="cakes-grid">
                  <div
                    v-for="(row, rowIndex) in 3"
                    :key="`row-${rowIndex}`"
                    class="shelf-row"
                    :style="{
                      '--row-offset':
                        rowIndex === 0
                          ? '5px'
                          : rowIndex === 1
                          ? '20px'
                          : rowIndex === 2
                          ? '30px'
                          : '0',
                    }"
                  >
                    <div
                      v-for="(cake, colIndex) in cakesMatrix[rowIndex]"
                      :key="`cake-${rowIndex}-${colIndex}`"
                      class="cake-slot"
                    >
                      <img
                        :src="cake.image"
                        :alt="cake.type"
                        class="cake"
                        style="width: 100px; height: 100px"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="showChat" class="row justify-content-center math-game">
            <div
              class="col-12 coins-earned text-center"
              style="font-size: 20px; padding: 0"
            >
              <p style="padding: 0px">
                Question {{ currentQuestion }}/{{ totalQuestions }} |
                <i
                  ref="earnedCoinIcon"
                  class="nes-icon coin is-small"
                  style="transform: scale(2); margin-bottom: 12px"
                ></i>
                Coins earned:
                <span :class="{ vibrate: isCoinsEarnedVibrating }">{{
                  coinsEarned
                }}</span
                >/ 15
              </p>
              <div
                v-if="showAnimatedCoin"
                class="animated-coin"
                :style="animatedCoinStyle"
              >
                <i class="nes-icon coin is-medium"></i>
              </div>
            </div>
          </div>

          <!-- <div v-if="gameOver" class="game-over-overlay math-game">
      <div class="game-over-content">
        <h2>{{ completionMessage }}</h2>
        <p>Total Coins Earned: {{ coinsEarned }}</p>
        <button @click='this.$router.push("/game")' class="nes-btn is-primary">
          Exit Game
        </button>
        <button @click="restartGame" class="nes-btn is-success">
          Restart Game
        </button>
      </div>
    </div> -->

          <div class="d-flex align-items-center">
            <dialog class="nes-dialog math-game" id="instructions-dialog">
              <form method="dialog">
                <h5 class="title" style="text-align: center">
                  Welcome to the Fractions Game!
                </h5>
                <p style="text-align: center; font-size: small">
                  <br />
                  Type into your keyboard the numbers that make up the <br />
                  numerator and denominator of the fraction. <br /><br />
                  You do not need to simplify the fractions.<br /><br />
                  You have <strong>5</strong> seconds for each question. Good
                  luck!
                </p>
                <menu class="dialog-menu center-button">
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

            <dialog class="nes-dialog math-game" id="finish-dialog">
              <form method="dialog">
                <h3 class="title math-game" style="text-align: center">
                  {{ completionMessage }}
                </h3>
                <p style="text-align: center; font-size: small">
                  Total Coins Earned: {{ coinsEarned }}
                </p>
                <menu class="dialog-menu center-button">
                  <button
                    @click="this.$router.push('/game')"
                    class="nes-btn is-primary"
                  >
                    Exit Game
                  </button>
                  <button
                    class="nes-btn is-success"
                    style="text-align: center"
                    @click="restartGame"
                  >
                    Restart Game
                  </button>
                </menu>
              </form>
            </dialog>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vanilla from "/assets/bakeryassets/Vanilla-Cake-nobg.png";
import hazelnut from "/assets/bakeryassets/hazelnut-nobg.png";
import strawberry from "/assets/bakeryassets/strawberry2.png";
import shelf from "/assets/bakeryassets/shelf.png";
import TimerBar from "/src/components/Timerbar.vue";
import confetti from "canvas-confetti";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

export default {
  components: {
    TimerBar,
  },
  data() {
    return {
      isTimerRunning: false, //declaring that the timer dont run on default
      isInputActive: false,
      showPhone: true,
      showChat: false,
      showDecline: false,
      showCakes: false,
      chatText: "",
      fullMessage:
        "Hello ah, I want to have a party but I only want vanilla cakes. What fraction of the total cakes are vanilla?",
      messageCaps: {
        small: 2,
        large: 3,
      },
      messageHeight: 80,
      messages: [],
      activeInput: "numerator",
      numerator: "",
      denominator: "",
      correctAnswer: false,
      incorrectAnswer: false,
      inputVibrate: false,
      shelf,
      cakesMatrix: [],
      correctFraction: { numerator: 0, denominator: 0 },
      totalCakes: 0,
      currentQuestion: 1,
      totalQuestions: 10,
      coinsEarned: 0,
      isCoinsEarnedVibrating: false,
      moneyBeforeGame: 0,
      moneyAfterGame: 0,
      db: getFirestore(),
      collectionName: "users",
      auth: "",
      gameOver: false,
      completionMessage: "Game Over! You've answered 10 questions.",
      replayed: 0,
      declineMessageResult: "",
    };
  },
  methods: {
    showInstructions() {
      document.getElementById("instructions-dialog").showModal();
    },
    startGame() {
      document.getElementById("instructions-dialog").close();
      this.isTimerRunning = true;
      this.$refs.timerBar.startTimer();
    },
    async acceptCall() {
      this.showPhone = false;
      this.showChat = true;
      this.showCakes = true;
      await this.typeChat();
      // this.$refs.timerBar.startTimer();
      this.showInstructions();
    },
    async rejectCall() {
      this.showDecline = true;
      this.showPhone = false;
      this.showCakes = false;

      const declineMessage = `How dare you decline Prof Kyong's call! 
      BOOYAH! 
      The bakery's boss has decided to kick you out! `;
      for (let i = 0; i < declineMessage.length; i++) {
        this.declineMessageResult += declineMessage[i];
        await new Promise((resolve) => setTimeout(resolve, 30));
        this.$forceUpdate();
      }
      await setTimeout(() => {
        this.$router.push("/game");
      }, 2000);
    },
    generateRandomCakes() {
      const cakeTypes = [
        { type: "vanilla", image: vanilla },
        { type: "strawberry", image: strawberry },
        { type: "hazelnut", image: hazelnut },
      ];

      const totalCakes = [9, 8, 7, 6][Math.floor(Math.random() * 3)];
      this.totalCakes = totalCakes;

      let cakes = [];
      for (let i = 0; i < totalCakes; i++) {
        const randomType =
          cakeTypes[Math.floor(Math.random() * cakeTypes.length)];
        cakes.push({ ...randomType });
      }

      const vanillaCakes = cakes.filter(
        (cake) => cake.type === "vanilla"
      ).length;
      this.correctFraction.numerator = vanillaCakes;
      this.correctFraction.denominator = totalCakes;

      this.cakesMatrix = [
        cakes.slice(0, Math.ceil(totalCakes / 3)),
        cakes.slice(Math.ceil(totalCakes / 3), Math.ceil((2 * totalCakes) / 3)),
        cakes.slice(Math.ceil((2 * totalCakes) / 3), totalCakes),
      ];

      // Pad the matrix with null values to always have 3 rows with 4 slots each
      // this.cakesMatrix = this.cakesMatrix.map(row => {
      //   while (row.length < 4) {
      //     row.push(null);
      //   }
      //   return row;
      // });
    },
    typeChat() {
      return new Promise((resolve) => {
        let i = 0;
        this.chatText = "";
        const interval = setInterval(() => {
          this.chatText += this.fullMessage[i];
          i++;
          if (i >= this.fullMessage.length) {
            clearInterval(interval);
            this.isInputActive = true;
            resolve(); // Resolves the Promise once the typing is complete
          }
        }, 10);
      });
    },
    async addMessage(text, type = "normal") {
      this.isInputActive = false;
      const newMessage = { text: "", type };
      this.messages.push(newMessage);

      for (let i = 0; i < text.length; i++) {
        newMessage.text += text[i];
        await new Promise((resolve) => setTimeout(resolve, 10));
        this.$forceUpdate();
      }

      this.isInputActive = true;
      this.$nextTick(() => {
        if (this.$refs.scrollableMessages) {
          this.$refs.scrollableMessages.scrollTop =
            this.$refs.scrollableMessages.scrollHeight;
        }
      });
    },
    handleInput(event) {
      if (!this.isInputActive) return;
      if (!/^[0-9]$/.test(event.key)) return;

      if (this.activeInput === "numerator") {
        this.numerator = event.key;
        this.activeInput = "denominator";
      } else if (this.activeInput === "denominator") {
        this.denominator = event.key;
        this.checkAnswer();
      }
    },
    async checkAnswer() {
      if (
        parseInt(this.numerator) === this.correctFraction.numerator &&
        parseInt(this.denominator) === this.correctFraction.denominator
      ) {
        this.activeInput = null;
        this.inputVibrate = true;
        this.correctAnswer = true;
        this.$refs.timerBar.pauseTimer();
        this.playSound(true);
        this.triggerConfetti();
        await this.addMessage(
          "Yay! I will take that amount. Let's move to the next question!",
          "correct"
        );
        await setTimeout(() => {
          this.inputVibrate = false;
        }, 1500);
        await this.awardCoins();
        this.nextQuestion();
      } else {
        this.playSound(false);
        this.incorrectAnswer = true;
        this.inputVibrate = true;
        this.isInputActive = false;
        this.activeInput = null;
        this.$refs.timerBar.pauseTimer();
        await this.addMessage(
          "Please retry! My friends and I want the cake badly!",
          "incorrect"
        );
        this.$refs.timerBar.startTimer();
        this.incorrectAnswer = false;
        this.inputVibrate = false;
        this.isInputActive = true;
        this.numerator = "";
        this.denominator = "";
        this.activeInput = "numerator";
      }
    },
    async awardCoins() {
      const coinsToAward = this.currentQuestion <= 5 ? 1 : 2; //to determine if need to award 1 or 2 coins
      this.coinsEarned += coinsToAward;
      // await this.animateCoinEarning(coinsToAward);
      await this.vibrateCoinsEarned(); // Wait for vibration to finish.. DOUBLE CHECK IF USE THIS OR PROMISE
    },
    animateCoinEarning(count) {
      const counterRect = this.$el
        .querySelector(".scrollable-messages")
        .getBoundingClientRect();
      const coinsEarnedRect = this.$refs.earnedCoinIcon.getBoundingClientRect();

      const startX = counterRect.left + counterRect.width / 2;
      const startY = counterRect.top + counterRect.height / 2;
      const endX = coinsEarnedRect.left + coinsEarnedRect.width / 2;
      const endY = coinsEarnedRect.top + coinsEarnedRect.height / 2;

      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          this.showAnimatedCoin = true;
          this.animatedCoinStyle = {
            top: `${startY}px`,
            left: `${startX}px`,
            transform: "scale(0.5)",
          };

          setTimeout(() => {
            this.animatedCoinStyle = {
              top: `${endY}px`,
              left: `${endX}px`,
              transform: "scale(1)",
            };
          }, 75);

          setTimeout(() => {
            this.showAnimatedCoin = false;
            // this.coinsEarned++;
            this.playCoinSound();
          }, 1000);
        }, i * 1200);
      }
    },
    vibrateCoinsEarned() {
      this.isCoinsEarnedVibrating = true;
      setTimeout(() => {
        this.isCoinsEarnedVibrating = false;
      }, 3000);
    },
    async nextQuestion() {
      if (this.currentQuestion < this.totalQuestions) {
        this.currentQuestion++;
        await this.resetQuestion();
        this.$refs.timerBar.resetTimer();
      } else {
        //game finished
        this.$refs.timerBar.pauseTimer();

        if (this.replayed == 0) {
          this.moneyAfterGame = this.moneyBeforeGame + this.coinsEarned;
        } else if (this.replayed >= 1) {
          this.moneyAfterGame += this.coinsEarned;
        }
        await this.updateCurrency(this.moneyAfterGame);

        document.getElementById("finish-dialog").showModal();
        // this.gameOver=true;
        // this.finishGame();
      }
    },
    async getCurrency() {
      const docRef = doc(this.db, this.collectionName, this.documentId);
      try {
        const doc = await getDoc(docRef);
        // console.log(doc);
        if (doc.exists()) {
          // console.log("Document data:", doc.data());
          // console.log("Currency data:", doc.data().currency);
          const moneyPromiseObject = doc.data().currency;
          return moneyPromiseObject;
        } else {
          // console.log("No such document!");
        }
      } catch (error) {
        console.error("Error getting document:", error);
      }
    },
    async updateCurrency(currency) {
      const docRef = doc(this.db, this.collectionName, this.documentId);
      try {
        await setDoc(docRef, { currency: currency }, { merge: true });
        // console.log("Currency successfully written!");
        return true;
      } catch (error) {
        console.error("Error writing document: ", error);
      }
    },
    async resetQuestion() {
      await this.generateRandomCakes();
      this.correctAnswer = false;
      this.incorrectAnswer = false;
      this.numerator = "";
      this.denominator = "";
      this.activeInput = "numerator";
      this.messages = [];
      this.chatText = "";
      await this.typeChat();
      this.$refs.timerBar.startTimer();
      this.isTimerRunning = true;
    },
    handleTimerExpired() {
      //from Timerbar.vue, when the component recognised time ran out
      // console.log("expired"); //we go to next question
      this.nextQuestion();
    },
    finishGame() {
      this.addMessage(
        "Congratulations! You've completed all questions. Thank you for helping with the cat party!",
        "correct"
      );
      setTimeout(() => {
        this.$router.push("/game");
      }, 3000);
    },
    restartGame() {
      this.coinsEarned = 0;
      this.replayed++;
      this.gameOver = false;
      this.currentQuestion = 1;
      this.$refs.timerBar.resetTimer();
      this.nextQuestion();
    },
    playSound(correct) {
      const audio = new Audio(
        correct
          ? "https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3"
          : "https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3"
      );
      audio.play();
    },
    triggerConfetti() {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    },
  },
  async mounted() {
    const auth = getAuth();
    this.documentId = auth.currentUser.uid;
    this.moneyBeforeGame = await this.getCurrency();
    document.addEventListener("keydown", this.handleInput);
    this.generateRandomCakes();
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.handleInput);
  },
  computed: {
    maxVisibleMessages() {
      return window.innerWidth >= 992
        ? this.messageCaps.large
        : this.messageCaps.small;
    },
    scrollableHeight() {
      if (this.messages.length === 0) return "0px";
      const visibleMessages = Math.min(
        this.messages.length,
        this.maxVisibleMessages
      );
      return `${visibleMessages * this.messageHeight}px`;
    },
  },
};
</script>

<style scoped>
.nes-container.is-rounded {
  border-image-slice: 3;
  border-image-width: 3;
  border-image-repeat: stretch;
  border-image-source: url('data:image/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8" ?><svg version="1.1" width="8" height="8" xmlns="http://www.w3.org/2000/svg"><path d="M3 1 h1 v1 h-1 z M4 1 h1 v1 h-1 z M2 2 h1 v1 h-1 z M5 2 h1 v1 h-1 z M1 3 h1 v1 h-1 z M6 3 h1 v1 h-1 z M1 4 h1 v1 h-1 z M6 4 h1 v1 h-1 z M2 5 h1 v1 h-1 z M5 5 h1 v1 h-1 z M3 6 h1 v1 h-1 z M4 6 h1 v1 h-1 z" fill="rgb(33,37,41)" /></svg>');
  border-image-outset: 2;
}

.phone-cutscene {
  font-family: Arial, sans-serif;
  align-items: center;
  display: flex;
  height: 100vh;
}

.wrapper {
  font-family: Arial, sans-serif;
  /* background-color: #B7E0FF; */
  display: flex;
  justify-content: center;
  /* align-items: center; */
  height: 100vh;
  margin: 0;
  transform: scale(0.8);
  transform-origin: top;
}

.wrapper.container-fluid {
  padding-top: 0 !important;
  margin-top: 0 !important;
}

/* body {
  font-family: Arial, sans-serif;
  background-color: #B7E0FF;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
} */

.math-game {
  font-size: 15px;
}

.iphone {
  width: 250px;
  height: 500px;
  background-color: #000;
  border-radius: 40px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
  animation: vibrate 0.5s ease infinite, pauseShake 2s infinite;
}

/* Vibration animation */
@keyframes vibrate {
  0%,
  100% {
    transform: translate(0, 0);
  }

  10% {
    transform: translate(3px, 3px) rotate(1deg);
  }

  20% {
    transform: translate(-3px, -3px) rotate(-1deg);
  }

  30% {
    transform: translate(3px, -3px) rotate(1deg);
  }

  40% {
    transform: translate(-3px, 3px) rotate(-1deg);
  }

  50% {
    transform: translate(3px, 3px) rotate(1deg);
  }
}

/* Pause animation */
@keyframes pauseShake {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 1;
  }

  50.1%,
  100% {
    transform: none;
  }
}

.display {
  padding: 20px;
  text-align: center;
  color: white;
  /* text-transform: uppercase; */
}

.name {
  font-size: 20px;
  font-weight: bold;
  margin-top: 10px;
}

.contact-type {
  font-size: 16px;
  color: #aaa;
  margin-bottom: 15px;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin: 0 auto 15px auto;
  background-image: url("/assets/bakeryassets/KyongJinShim.png");
  /* Placeholder image URL */
  background-size: cover;
  background-position: center;
  background-color: white;
}

.buttons {
  display: flex;
  justify-content: space-around;
  position: absolute;
  bottom: 30px;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: white;
  cursor: pointer;
}

.button.decline {
  background-color: red;
}

.button.accept {
  background-color: green;
}

/* Chat UI */
.chat-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  /* max-height:500px; */
  /* height: 400px; */
  margin-top: 20px;
}

.chat-bubble {
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 10px;
  width: 80%;
  margin-top: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.nes-container.is-rounded {
  background-color: white;
  width: 90%;
  padding: 10px;
  margin-top: 20px;
}

.pinned-message {
  /* background-color: #e8f5e9; */
  /* border-left: 4px solid #4caf50; */
  margin-bottom: 10px;
  margin-top: 30px;
  box-shadow: 0 4px 2px -2px gray;
}

.chat-bubble.correct {
  background-color: #e8f5e9;
  border-left: 4px solid #4caf50;
}

.chat-bubble.incorrect {
  background-color: #ffebee;
  border-left: 4px solid #f44336;
}

.nes-container.correct {
  background-color: #e8f5e9;
  border-left: 4px solid #4caf50;
}

.nes-container.incorrect {
  background-color: #ffebee;
  border-left: 4px solid #f44336;
}

.scrollable-messages {
  /* width: 100%;
flex-grow: 1;
overflow-y: auto; */
  width: 100%;
  /* overflow-y: auto; */
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: height 0.3s ease;
  /* padding: 0 !important;
    margin: 0 !important; */

  /* overflow: hidden; */
}

.scrollable-messages.has-messages {
  margin: 10px 0;
}

.scrollable-messages.scrollable {
  overflow-y: auto;
}

.blink {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }
}

.fraction-input {
  display: flex;
  align-items: center;
  font-size: 100px;
  margin-top: 10px;
}

.fraction-input.correct {
  color: green;
}

.fraction-input.incorrect {
  color: red;
}

@keyframes input-vibrate {
  0% {
    transform: rotate(0deg) translateX(0);
  }

  20% {
    transform: rotate(-2deg) translateX(-2px);
  }

  40% {
    transform: rotate(2deg) translateX(2px);
  }

  60% {
    transform: rotate(-1deg) translateX(-1px);
  }

  80% {
    transform: rotate(1deg) translateX(1px);
  }

  100% {
    transform: rotate(0deg) translateX(0);
  }
}

.input-vibrate {
  animation: input-vibrate 0.1s linear infinite;
}

.fraction-input span {
  /* margin: 0 5px; */
}

.cake-display {
  position: relative;
  width: 100%;
  max-width: 600px;
  aspect-ratio: 4/3;
}

.shelf-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.cakes-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 5% 10%;
}

.shelf-row {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 30%;
  transform: translateY(var(--row-offset, 0));
}

.cake-slot {
  width: 25%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.cake {
  position: absolute;
  bottom: 0;
  max-width: 90%;
  max-height: 90%;
  width: 105px;
  height: 105px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.vibrate {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}

.coins-earned {
  text-align: center;
  font-size: small;
  margin-top: 20px;
}

.animated-coin {
  position: fixed;
  z-index: 1000;
  transition: all 1s ease-in-out;
}

.nes-icon.coin.is-medium {
  transition: filter 0.3s ease-in-out;
}

.nes-icon.coin.is-medium:hover {
  filter: drop-shadow(0 0 5px gold);
}

@keyframes glow {
  0% {
    filter: drop-shadow(0 0 2px gold);
  }

  50% {
    filter: drop-shadow(0 0 10px gold);
  }

  100% {
    filter: drop-shadow(0 0 2px gold);
  }
}

.coins-earned .nes-icon.coin.is-medium {
  animation: glow 1s ease-in-out;
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

.nes-btn {
  border-style: solid;
  border-width: 4px;
  border-image-slice: 2;
  border-image-width: 2;
  border-image-repeat: stretch;
  border-image-source: url('data:image/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8" ?><svg version="1.1" width="5" height="5" xmlns="http://www.w3.org/2000/svg"><path d="M2 1 h1 v1 h-1 z M1 2 h1 v1 h-1 z M3 2 h1 v1 h-1 z M2 3 h1 v1 h-1 z" fill="rgb(33,37,41)" /></svg>');
  border-image-outset: 2;
  position: relative;
  display: inline-block;
  padding: 6px 8px;
  margin: 4px;
  text-align: center;
  vertical-align: middle;
  cursor: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC)
      14 0,
    pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  color: #212529;
  background-color: #fff;
}

.nes-btn.is-primary {
  color: #fff;
  background-color: #209cee;
}

.nes-btn.is-success {
  color: #fff;
  background-color: #92cc41;
}

.center-button {
  display: flex;
  justify-content: center;
}
</style>
