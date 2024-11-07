<template>
  <div class="container-fluid">
    <h1 class="text-center">Mummy wants you to deposit ${{ targetAmount.toFixed(2) }}</h1>
    <h2 class="text-center">Question {{ currentQuestion }} of 10</h2>
    <div class="row">
      <div class="col-lg-6 mb-4">
        <div class="counter bg-light p-3 rounded" @dragover.prevent @drop="onDrop($event, 'counter')">
          <h2>Counter</h2>
          <div class="d-flex flex-wrap">
            <div v-for="coin in counterCoins" :key="coin.uniqueId" class="m-2">
              <img :src="coin.image" :alt="coin.value" class="coin" :data-coin-id="coin.uniqueId" draggable="true"
                @dragstart="onDragStart($event, coin.uniqueId, 'counter')" @dragend="onDragEnd">
            </div>
          </div>
          <div class="total mt-3">Total: ${{ total.toFixed(2) }}</div>
          <div v-if="showMessage" :class="['message', messageClass, { 'vibrate': isVibrating }]">
            {{ message }}
          </div>
        </div>
      </div>
      <div class="col-lg-6 mb-4">
        <div class="piggy-bank-container p-3 rounded" @dragover.prevent @drop="onDrop($event, 'piggyBank')">
          <img src="/assets/bankassets/piggybank2.png" alt="Piggy Bank" class="piggy-bank">
          <div class="coin-container d-flex flex-wrap justify-content-center align-items-center">
            <div v-for="coin in piggyBankCoins" :key="coin.uniqueId" class="col-auto m-1 p-1">
              <img :src="coin.image" :alt="coin.value" class="coin" :data-coin-id="coin.uniqueId" draggable="true"
                @dragstart="onDragStart($event, coin.uniqueId, 'piggyBank')" @dragend="onDragEnd">
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row justify-content-evenly">
      <div class="col-auto">
        <div class="button-container">
          <button class="btn btn-custom px-5" @click="resetGame">Reset</button>
          <button class="btn btn-custom px-5" @click="submitAnswer">Submit</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import oneDollarImage from '/assets/bankassets/1dollar.png';
import fiftyCentsImage from '/assets/bankassets/50cents.png';
import twentyCentsImage from '/assets/bankassets/20cents.png';
import tenCentsImage from '/assets/bankassets/10cents.png';
import fiveCentsImage from '/assets/bankassets/5cents.png';

export default {
  data() {
    return {
      coins: [
        { id: 1, value: 1.00, image: oneDollarImage },
        { id: 2, value: 0.50, image: fiftyCentsImage },
        { id: 3, value: 0.20, image: twentyCentsImage },
        { id: 4, value: 0.10, image: tenCentsImage },
        { id: 5, value: 0.05, image: fiveCentsImage }
      ],
      piggyBankCoins: [],
      counterCoins: [],
      targetAmount: 0,
      draggedCoin: null,
      optimalCoinCount: 0,
      currentQuestion: 1,
      showMessage: false,
      messageClass:'',
      message: '',
      isVibrating: false
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
        uniqueId: `${id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };
    },
    onDragStart(event, coinId, source) {
      event.dataTransfer.setData('text/plain', JSON.stringify({ coinId, source }));
      event.target.style.opacity = '0.5';
      document.body.style.cursor = 'grabbing';
    },
    onDragEnd(event) {
      event.target.style.opacity = '1';
      document.body.style.cursor = 'default';
    },
    onDrop(event, target) {
      event.preventDefault();
      const data = JSON.parse(event.dataTransfer.getData('text/plain'));
      const { coinId, source } = data;

      if (source !== target) {
        if (source === 'piggyBank' && target === 'counter') {
          this.moveCoin(coinId, this.piggyBankCoins, this.counterCoins);
        } else if (source === 'counter' && target === 'piggyBank') {
          this.moveCoin(coinId, this.counterCoins, this.piggyBankCoins);
        }
      }
    },
    moveCoin(coinId, fromArray, toArray) {
      const index = fromArray.findIndex(c => c.uniqueId === coinId);
      if (index !== -1) {
        const [coin] = fromArray.splice(index, 1);
        toArray.push(coin);
      }
    },
    resetGame() {
      // Move all coins from counter back to piggy bank
      while (this.counterCoins.length > 0) {
        this.moveCoin(this.counterCoins[0].uniqueId, this.counterCoins, this.piggyBankCoins);
      }
      this.showMessage = false;
    },
    calculateOptimalCoinCount() {
      let remainingAmount = this.targetAmount;
      let coinCount = 0;
      const sortedCoins = [...this.coins].sort((a, b) => b.value - a.value);

      for (const coin of sortedCoins) {
        while (remainingAmount >= coin.value) {
          remainingAmount = parseFloat((remainingAmount - coin.value).toFixed(2));
          coinCount++;
        }
      }

      this.optimalCoinCount = coinCount;
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

      do {
        this.targetAmount = 0;
        const shuffledCoins = [...this.piggyBankCoins].sort(() => 0.5 - Math.random());
        const selectedCoins = shuffledCoins.slice(0, Math.floor(Math.random() * (maxCoins - minCoins + 1)) + minCoins);
        this.targetAmount = selectedCoins.reduce((sum, coin) => sum + coin.value, 0);
        this.calculateOptimalCoinCount();
      } while (this.optimalCoinCount < minCoins || this.optimalCoinCount > maxCoins);

      // Round to 2 decimal places
      this.targetAmount = parseFloat(this.targetAmount.toFixed(2));
    },
    submitAnswer() {
      this.showMessage = true;
      if (this.isCorrect && this.isOptimal) {
        this.message = `Correct! You have deposited $${this.targetAmount.toFixed(2)}`;
        this.setMessageClass('text-success');
        // else if (this.isCorrect && !this.isOptimal) {
        //   return 'text-warning';
        // } 
        this.nextQuestion();
      } else {
        this.setMessageClass( 'text-danger')
        if (this.isCorrect && !this.isOptimal) {
          this.message = "Correct amount, but try using fewer coins to reach the target.";
        } else if (this.total < this.targetAmount) {
          this.message = "Keep adding!";
        } else {
          this.message = "Too much! Try removing some coins.";
        }
      }

      this.vibrateMessage();
    },
    setMessageClass(textColor){
      this.messageClass=textColor
    },
    vibrateMessage() {
      this.isVibrating = true;
      setTimeout(() => {
        this.isVibrating = false;
      }, 2000);
    },
    nextQuestion() {
      if (this.currentQuestion < 10) {
        this.currentQuestion++;
        this.generateTargetAmount();
        this.resetGame();
      } else {
        alert("Congratulations! You've completed all 10 questions!");
        // Here you can add logic for what happens after all questions are answered
      }
    }
  },
  created() {
    this.piggyBankCoins = [...this.coins, ...this.coins, ...this.coins].map(coin =>
      this.createCoin(coin.id, coin.value, coin.image)
    );
    this.generateTargetAmount();
  }
};
</script>
<style scoped>
.container-fluid {
  background-color: #B7E0FF;
}

.counter {
  background: url('https://www.transparenttextures.com/patterns/wood.png');
  /* Wood texture */
  color: #333;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

}

.piggy-bank-container {
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
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

.coin {
  width: 60px;
  height: 60px;
  cursor: grab;
  margin: 0;
  transition: transform 0.1s;
}

@media (max-width: 515px) {
  .coin {
    width: 10vw;
    /* Adjust this size to fit smaller screens */
    height: 10vw;
  }
}

.coin:hover {
  transform: scale(1.05);
}

.coin:active {
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
  animation: shake 0.82s cubic-bezier(.36, .07, .19, .97) both;
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
</style>