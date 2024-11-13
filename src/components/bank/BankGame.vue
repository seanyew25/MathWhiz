<template>
  <div class="container-fluid math-game">
    <div class="row justify-content-center mb-3">
      <div class="col-lg-8">
        <h3
          class="text-center nes-container is-rounded"
          style="background-color: #fff5cd"
        >
          The person in front of you has asked for <br />
          your help to deposit ${{ targetAmount.toFixed(2) }}
        </h3>
      </div>
    </div>

    <div class="row justify-content-center my-4">
      <div class="col-lg-8">
        <TimerBar
          ref="timerBar"
          :initial-time="20"
          :is-running="isTimerRunning"
          @timerExpired="handleTimerExpired"
        />
      </div>
    </div>

    <h2 class="text-center">Question {{ currentQuestion }} of 10</h2>
    <div class="row">
      <div
        class="left-portion col-lg-6 d-flex justify-content-lg-end justify-content-center"
      >
        <div class="counter-container d-flex flex-column align-items-center">
          <!-- Counter Frame Area (Droppable) -->
          <div
            class="counter-frame-container"
            @dragover.prevent
            @drop="onDrop($event, 'counter')"
          >
            <div class="frame-pieces">
              <img
                src="/assets/bankassets/Living_Room_Singles_Left-cropped.png"
                alt="Left frame"
              />
              <div class="frame-middle-container">
                <img
                  v-for="n in 3"
                  :key="n"
                  src="/assets/bankassets/Living_Room_Singles_Middle.png"
                  alt="Middle frame"
                />
              </div>
              <img
                src="/assets/bankassets/Living_Room_Singles_Right.png"
                alt="Right frame"
              />
            </div>
            <!-- Coin display area -->
            <div
              class="coins-area d-flex flex-wrap justify-content-start align-items-start"
            >
              <div
                v-for="coin in counterCoins"
                :key="coin.uniqueId"
                class="m-2"
              >
                <img
                  :src="coin.image"
                  :alt="coin.value"
                  class="game-coin"
                  :data-coin-id="coin.uniqueId"
                  draggable="true"
                  @dragstart="onDragStart($event, coin.uniqueId, 'counter')"
                  @dragend="onDragEnd"
                />
              </div>
            </div>
          </div>

          <!-- Counter Info Box -->
          <div class="counter-info">
            <h2>Counter</h2>
            <div class="total">Total: ${{ total.toFixed(2) }}</div>
            <div
              v-if="showMessage"
              :class="['message', messageClass, { vibrate: isVibrating }]"
            >
              {{ message }}
            </div>
          </div>
        </div>
      </div>
      <div
        class="col-lg-6 d-flex justify-content-lg-start justify-content-md-center"
      >
        <div
          class="piggy-bank-container p-3 rounded"
          @dragover.prevent
          @drop="onDrop($event, 'piggyBank')"
        >
          <img
            src="/assets/bankassets/piggybank2.png"
            alt="Piggy Bank"
            class="piggy-bank"
          />
          <div
            class="coin-container d-flex flex-wrap justify-content-center align-items-center"
          >
            <div
              v-for="coin in piggyBankCoins"
              :key="coin.uniqueId"
              class="col-auto m-1 p-1"
            >
              <img
                :src="coin.image"
                :alt="coin.value"
                class="game-coin"
                :data-coin-id="coin.uniqueId"
                draggable="true"
                @dragstart="onDragStart($event, coin.uniqueId, 'piggyBank')"
                @dragend="onDragEnd"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row justify-content-evenly">
      <div class="col-auto">
        <div class="button-container">
          <button class="btn btn-custom px-5" @click="resetGame">
            Reset Coins
          </button>
          <button class="btn btn-custom px-5" @click="submitAnswer">
            Submit Answer
          </button>
        </div>
      </div>
    </div>

    <div class="row justify-content-center">
      <div class="col coins-earned d-flex justify-content-center mt-5">
        <i ref="earnedCoinIcon" class="nes-icon coin is-medium"></i>Coins
        earned:
        <span :class="{ vibrate: isCoinsEarnedVibrating }">{{
          coinsEarned
        }}</span
        >/15
      </div>
    </div>

    <div
      v-if="showAnimatedCoin"
      class="animated-coin"
      :style="animatedCoinStyle"
    >
      <i class="nes-icon coin is-medium"></i>
    </div>

    Money before game:{{ moneyBeforeGame }}... <br />
    Money after game: {{ moneyAfterGame }}...previous + coins earned<br />
    how many coins you have earned so far here:{{ coinsEarned }} Coins earned
  </div>
</template>

<script>
import oneDollarImage from "/assets/bankassets/1dollar.png";
import fiftyCentsImage from "/assets/bankassets/50cents.png";
import twentyCentsImage from "/assets/bankassets/20cents.png";
import tenCentsImage from "/assets/bankassets/10cents.png";
import fiveCentsImage from "/assets/bankassets/5cents.png";
import TimerBar from "../Timerbar.vue";
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
      coins: [
        { id: 1, value: 1.0, image: oneDollarImage },
        { id: 2, value: 0.5, image: fiftyCentsImage },
        { id: 3, value: 0.2, image: twentyCentsImage },
        { id: 4, value: 0.1, image: tenCentsImage },
        { id: 5, value: 0.05, image: fiveCentsImage },
      ],
      piggyBankCoins: [],
      counterCoins: [],
      targetAmount: 0,
      draggedCoin: null,
      optimalCoinCount: 0,
      currentQuestion: 1,
      showMessage: false,
      messageClass: "",
      message: "",
      isVibrating: false,
      coinsEarned: 0,
      showAnimatedCoin: false,
      animatedCoinStyle: {
        top: "0px",
        left: "0px",
        transform: "scale(1)",
      },
      isCoinsEarnedVibrating: false,
      moneyBeforeGame: 0,
      moneyAfterGame: 0,
      db: "",
      auth: "",
    };
  },
  computed: {
    total() {
      const sum = this.counterCoins.reduce((sum, coin) => sum + coin.value, 0);
      return parseFloat(sum.toFixed(2)); // Round to 2 decimal places
    },
    isCorrect() {
      return Math.abs(this.total - this.targetAmount) < 0.01; // Allow for small floating-point errors
    },
    isOptimal() {
      return this.counterCoins.length === this.optimalCoinCount;
    },
    // messageClass() {
    //   // if (this.isCorrect && this.isOptimal) {
    //   //   return 'text-success';
    //   // }
    //   // // else if (this.isCorrect && !this.isOptimal) {
    //   // //   return 'text-warning';
    //   // // }
    //   // else {
    //   //   return 'text-danger';
    //   // }
    // }
  },
  methods: {
    createCoin(id, value, image) {
      return {
        id,
        value,
        image,
        uniqueId: `${id}-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
      };
    },
    onDragStart(event, coinId, source) {
      event.dataTransfer.setData(
        "text/plain",
        JSON.stringify({ coinId, source })
      );
      event.target.style.opacity = "0.5";
      document.body.style.cursor = "grabbing";
    },
    onDragEnd(event) {
      event.target.style.opacity = "1";
      document.body.style.cursor = "default";
    },
    onDrop(event, target) {
      event.preventDefault();
      const data = JSON.parse(event.dataTransfer.getData("text/plain"));
      const { coinId, source } = data;

      if (source !== target) {
        if (source === "piggyBank" && target === "counter") {
          this.moveCoin(coinId, this.piggyBankCoins, this.counterCoins);
        } else if (source === "counter" && target === "piggyBank") {
          this.moveCoin(coinId, this.counterCoins, this.piggyBankCoins);
        }
      }
    },
    moveCoin(coinId, fromArray, toArray) {
      const index = fromArray.findIndex((c) => c.uniqueId === coinId);
      if (index !== -1) {
        const [coin] = fromArray.splice(index, 1);
        toArray.push(coin);
      }
    },
    resetGame() {
      // Move all coins from counter back to piggy bank
      while (this.counterCoins.length > 0) {
        this.moveCoin(
          this.counterCoins[0].uniqueId,
          this.counterCoins,
          this.piggyBankCoins
        );
      }
      this.showMessage = false;
    },
    calculateOptimalCoinCount() {
      // Convert target amount to cents to avoid floating-point issues
      const targetAmount = Math.round(this.targetAmount * 100);

      // Group coins by denomination and calculate the count for each
      const coinsMap = this.piggyBankCoins.reduce((map, coin) => {
        const denominationInCents = Math.round(coin.value * 100);
        if (!map[denominationInCents]) {
          map[denominationInCents] = {
            denomination: denominationInCents,
            count: 0,
          };
        }
        map[denominationInCents].count += 1;
        return map;
      }, {});

      // Convert coinsMap to an array with denomination and count properties
      const coins = Object.values(coinsMap);

      // Initialize dp array with Infinity, representing unreachable states
      const dp = Array(targetAmount + 1).fill(Infinity);
      dp[0] = 0; // Base case: 0 coins are needed to make 0 cents

      // Apply the bounded knapsack algorithm with available counts of each coin
      for (const { denomination, count } of coins) {
        for (let amount = targetAmount; amount >= 0; amount--) {
          // Try using each coin up to `count` times
          for (let k = 1; k <= count && k * denomination <= amount; k++) {
            dp[amount] = Math.min(
              dp[amount],
              dp[amount - k * denomination] + k
            );
            // if (dp[amount] !== oldValue) {
            //   console.log(`dp[${amount}] updated from ${oldValue} to ${dp[amount]} using ${k} coins of ${denomination}`);
            // }
          }
        }
      }

      // Check the final result in dp[targetAmount]
      this.optimalCoinCount =
        dp[targetAmount] === Infinity ? -1 : dp[targetAmount];

      // Debug output to verify calculations
      console.log("targetAmount (cents):", targetAmount);
      console.log("dp[targetAmount]:", dp[targetAmount]);
      console.log("optimalCoinCount:", this.optimalCoinCount);
      console.log("coinsMap:", coinsMap);

      // return this.optimalCoinCount      // return this.optimalCoinCount;
    },
    generateTargetAmount() {
      const totalCoins = this.piggyBankCoins.length;
      let maxCoins, minCoins;

      if (this.currentQuestion <= 5) {
        // Easier questions: use less than half of the coins, but at least 3
        maxCoins = Math.floor(totalCoins / 2);
        minCoins = 3;
      } else {
        // Harder questions: use more than half of the coins
        minCoins = Math.floor(totalCoins / 2) + 1;
        maxCoins = totalCoins;
      }

      // do {
      // this.targetAmount = 0;
      const shuffledCoins = [...this.piggyBankCoins].sort(
        () => 0.5 - Math.random()
      );
      const selectedCoins = shuffledCoins.slice(
        0,
        Math.floor(Math.random() * (maxCoins - minCoins + 1)) + minCoins
      );
      this.targetAmount = parseFloat(
        selectedCoins.reduce((sum, coin) => sum + coin.value, 0).toFixed(2)
      );
      this.calculateOptimalCoinCount();
      // } while (this.optimalCoinCount < minCoins || this.optimalCoinCount > maxCoins);

      // Round to 2 decimal places
      // this.targetAmount = parseFloat(this.targetAmount.toFixed(2));
      // console.log(this.targetAmount)
    },
    async submitAnswer() {
      // this.isTimerRunning = false;
      this.showMessage = true;
      if (this.isCorrect && this.isOptimal) {
        this.message = `Correct! You have deposited $${this.targetAmount.toFixed(
          2
        )}`;
        this.setMessageClass("text-success");
        await this.awardCoins();
        this.nextQuestion();
      } else {
        this.setMessageClass("text-danger");
        if (this.isCorrect && !this.isOptimal) {
          this.message =
            "Correct amount, but use fewer coins to reach the target.";
        } else if (this.total < this.targetAmount) {
          this.message = "Keep adding!";
        } else {
          this.message = "Too much! Try removing some coins.";
        }
      }

      this.vibrateMessage();
    },
    setMessageClass(textColor) {
      this.messageClass = textColor;
    },
    vibrateMessage() {
      this.isVibrating = true;
      setTimeout(() => {
        this.isVibrating = false;
      }, 2000);
    },
    async awardCoins() {
      const coinsToAward = this.currentQuestion <= 5 ? 1 : 2; //to determine if need to award 1 or 2 coins
      await this.animateCoinEarning(coinsToAward);
      await this.vibrateCoinsEarned(); // Wait for vibration to finish.. DOUBLE CHECK IF USE THIS OR PROMISE
    },
    animateCoinEarning(count) {
      const counterRect = this.$el
        .querySelector(".counter-frame-container")
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
            this.playCoinSound();
          }, 1000);
        }, i * 1200);
      }
    },

    // playCoinSound() {
    //   const audio = new Audio('/assets/sounds/coin-clink.mp3');
    //   audio.play();
    // },
    vibrateCoinsEarned() {
      this.isCoinsEarnedVibrating = true;
      setTimeout(() => {
        this.isCoinsEarnedVibrating = false;
      }, 3000);
    },
    async nextQuestion() {
      if (this.currentQuestion < 10) {
        this.currentQuestion++;
        await this.resetGame(); //make sure all coins have moved back to counter
        await this.generateTargetAmount(); //before we calculate optimalCoinCount
        this.resetTimer(); //necessary to decalre await before this because theres animation here
        this.moneyAfterGame = this.moneyBeforeGame + this.coinsEarned;
      } else {
        //Finished 10 qns
        alert(
          "Congratulations! You've completed all 10 questions! Awarded coins"
        );
        this.$refs.timerBar.pauseTimer();
        this.moneyBeforeGame += this.coinsEarned;
        // this.getCurrency()
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
          "countingMoney"
        );
        this.$router.push("/game");
        // this.moneyAfterGame = this.getCurrency(db, "users", auth.currentUser.uid);
      }
    },
    handleTimerExpired() {
      //from Timerbar.vue, when the component recognised time ran out
      console.log("expired"); //we go to next question
      this.nextQuestion();
    },
    resetTimer() {
      //created method to access Timerbar.vue methods
      this.$refs.timerBar.resetTimer();
      this.isTimerRunning = true;
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
    this.piggyBankCoins = [...this.coins, ...this.coins, ...this.coins].map(
      (coin) => this.createCoin(coin.id, coin.value, coin.image)
    );
    this.generateTargetAmount();
    this.isTimerRunning = true;
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
};
</script>
<style scoped>
.space-between {
  padding-top: 30px;
  padding-bottom: 30px;
}

.container-fluid {
  min-height: 100vh;
  padding-top: 30px;
}

.left-portion {
  position: relative;
}

.counter-container {
  width: 100%;
  max-width: 500px;
}

.counter-frame-container {
  /* width: 100%;
  max-width: 500px;
  aspect-ratio: 90/54;
  position: relative;
  margin-bottom: 20px; */
  width: 100%;
  aspect-ratio: 90/54;
  position: relative;
  margin-bottom: 20px;
}

.frame-pieces {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  pointer-events: none;
  /*DK  what this is for */
}

.frame-pieces img {
  height: 100%;
  object-fit: cover;
}

.frame-piece {
  height: 100%;
  width: 48px;
  background-size: contain;
  background-repeat: no-repeat;
  image-rendering: pixelated;
}

.frame-middle-container {
  flex: 1;
  display: flex;
  /* justify-content: space-between; */
}

.frame-middle-container img {
  flex: 1;
}

.coins-area {
  /* position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 0;
  line-height: 0;
  padding: 20px; */
  position: absolute;
  top: 41%;
  left: 44%;
  width: 100%;
  /* Adjust to fit within the piggy bank area */
  transform: translate(-40%, -40%);
  /*Shifting the vertical, horizontal alignment */
  /*MUST HAVE--> to set the positioning of the coins */
  /* padding:10px */
}

.counter-info {
  /* position: absolute; */
  background-color: #fff5cd;
  border-radius: 8px;
  padding: 15px;
  width: 100%;
  max-width: 500px;
  text-align: center;
  margin-top: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  /* right:0; */
}

.counter-info h2 {
  margin-bottom: 10px;
  color: #333;
}

.piggy-bank-container {
  position: relative;
  width: 100%;
  max-width: 500px;
  /* margin: 0 auto; */
  overflow: hidden;
  /* display: flex; */
  /* justify-content: center; */
  /* align-items: center; */
}

.piggy-bank {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.coin-container {
  position: absolute;
  top: 40%;
  left: 50%;
  width: 70%;
  /* Adjust to fit within the piggy bank area */
  transform: translate(-50%, -50%);
  /*MUST HAVE--> to set the positioning of the coins */
  gap: 0;
  /* Removes any space between coins */
  line-height: 0;
}

.game-coin {
  width: 60px;
  height: 60px;
  cursor: grab;
  margin: 0;
  transition: transform 0.1s;
}

@media (max-width: 515px) {
  .game-coin {
    width: 10vw;
    /* Adjust this size to fit smaller screens */
    height: 10vw;
  }
}

.game-coin:hover {
  transform: scale(1.05);
}

.game-coin:active {
  cursor: grabbing;
}

.total {
  font-size: 24px;
  font-weight: bold;
}

.message {
  font-size: 18px;
  font-weight: bold;
  margin-top: 10px;
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

.button-container {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.btn-custom {
  background-color: #d27b7b;
  color: white;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 18px;
}

.btn-custom:hover {
  background-color: #bf6464;
  color: white;
}

/*Coins display */
.coins-earned {
  text-align: center;
  font-size: 24px;
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
</style>
