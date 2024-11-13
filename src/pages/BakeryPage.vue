<template>
  <div :class="{ wrapper: showChat, 'phone-cutscene': showPhone }">
    <div class="container-lg px-lg-0">
      <!-- Phone Section -->
      <div v-if="showPhone" class="row justify-content-center mb-4">
        <div class="col-auto">
          <div class="iphone">
            <div class="display">
              <div class="name">MewTwo calling...</div>
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

      <!-- Game Content -->
      <div v-if="showChat" class="row justify-content-center mb-3">
        <div class="col-12 text-center math-game">
          <TimerBar
            ref="timerBar"
            :initial-time="10"
            :is-running="isTimerRunning"
            @timerExpired="handleTimerExpired"
          />
        </div>
      </div>

      <div class="row d-flex justify-content-center">
        <!-- Chat and Question -->
        <div
          v-if="showChat"
          class="col-12 col-lg-6 m-0 d-flex justify-content-center"
        >
          <div class="chat-container justify-content-center">
            <div class="chat-bubble text-wrap pinned-message">
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
                class="chat-bubble text-wrap"
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

      <div v-if="showChat" class="row justify-content-center mt-5">
        <div class="col-12 coins-earned text-center math-game">
          <h3>
            Question {{ currentQuestion }} of {{ totalQuestions }} |
            <i ref="earnedCoinIcon" class="nes-icon coin is-medium"></i>Coins
            earned:
            <span :class="{ vibrate: isCoinsEarnedVibrating }">{{
              coinsEarned
            }}</span
            >/ 15
          </h3>
          <div
            v-if="showAnimatedCoin"
            class="animated-coin"
            :style="animatedCoinStyle"
          >
            <i class="nes-icon coin is-medium"></i>
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
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  arrayUnion,
} from "firebase/firestore";

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
      showCakes: false,
      chatText: "",
      fullMessage:
        "Hello ah, I want to have a cat party. But i can't eat chocolate. We want only vanilla cupcakes. What fraction of the total cakes are vanilla?",
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
      db: "",
      auth: "",
    };
  },
  methods: {
    async acceptCall() {
      this.showPhone = false;
      this.showChat = true;
      this.showCakes = true;
      await this.typeChat();
      this.$refs.timerBar.startTimer();
    },
    rejectCall() {
      this.showPhone = false;
      this.$router.push("/game");
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
        await this.addMessage(
          "Yay! I will take that amount. Let's move to the next question!",
          "correct"
        );

        await new Promise((resolve) => setTimeout(resolve, 1500));
        this.inputVibrate = await false;
        await this.awardCoins();
        await this.nextQuestion();
      } else {
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
      this.vibrateMessage();
    },
    async awardCoins() {
      const coinsToAward = this.currentQuestion <= 5 ? 1 : 2; //to determine if need to award 1 or 2 coins
      await this.animateCoinEarning(coinsToAward);
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
            this.coinsEarned++;
            // this.playCoinSound();
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
        this.$refs.timerBar.pauseTimer();
        await this.updateCurrency(
          this.db,
          "users",
          this.auth.currentUser.uid,
          this.moneyBeforeGame + this.coinsEarned
        );
        await this.updateCompletedTasks(
          this.db,
          "users",
          this.auth.currentUser.uid,
          "fractions"
        );
        this.finishGame();
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
      console.log("expired"); //we go to next question
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
    async getCurrency(db, collectionName, documentId) {
      const docRef = doc(db, collectionName, documentId);
      try {
        const doc = await getDoc(docRef);
        console.log(doc);
        if (doc.exists()) {
          console.log("Document data:", doc.data());
          console.log("Currency data:", doc.data().currency);
          const moneyPromiseObject = doc.data().currency;
          return moneyPromiseObject;
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error getting document:", error);
      }
    },
    async updateCurrency(db, collectionName, documentId, currency) {
      const docRef = doc(db, collectionName, documentId);
      try {
        await setDoc(docRef, { currency: currency }, { merge: true });
        console.log("Currency successfully written!");
        return true;
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
        console.log("Task successfully added to completedTasks!");
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    },
  },
  created() {
    document.addEventListener("keydown", this.handleInput);
    this.generateRandomCakes();
  },
  async mounted() {
    const auth = getAuth();
    console.log(`uid=${auth.currentUser.uid}`);
    const db = getFirestore();
    this.db = db;
    this.auth = auth;
    console.log(db);
    this.moneyBeforeGame = await this.getCurrency(
      db,
      "users",
      auth.currentUser.uid
    );
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

/* iPhone Call UI */
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
  font-size: 24px;
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
  background-image: url("/assets/bakeryassets/mewtwo.png");
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
  margin: 0 5px;
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
  font-size: 24px;
  margin-top: 20px;
}

.animated-coin {
  position: absolute;
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
</style>
