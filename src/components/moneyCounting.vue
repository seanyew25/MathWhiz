<template>
  <div class="container-fluid">
    <div class="progress-container">
            <progress
              class="nes-progress is-success"
              :value="timerWidth"
              :max="100"
            ></progress>
            <p class="nes-text is-primary">{{ Math.round(timerWidth) }}%</p>
          </div>
    <h1 class="text-center">Mummy wants you to deposit ${{ targetAmount.toFixed(2) }}</h1>
    
    <div class="row">
      <div class="col-lg-6 mb-4">
        <div class="counter bg-light p-3 rounded" @dragover.prevent @drop="onDrop($event, 'counter')">
          <h2>Counter</h2>
          <div class="d-flex flex-wrap">
            <div v-for="coin in counterCoins" :key="coin.uniqueId" class="m-2">
              <img :src="coin.image" :alt="coin.value" class="coin" 
                   :data-coin-id="coin.uniqueId"
                   draggable="true"
                   @dragstart="onDragStart($event, coin.uniqueId, 'counter')"
                   @dragend="onDragEnd">
            </div>
          </div>
          <div class="total mt-3">Total: ${{ total.toFixed(2) }}</div>
          <div class="message" :class="{ 'text-success': isCorrect, 'text-danger': !isCorrect && total > 0 }">
            {{ message }}
          </div>
        </div>
      </div>
      <div class="col-lg-6 mb-4">
        <div class="piggy-bank-container p-3 rounded" @dragover.prevent @drop="onDrop($event, 'piggyBank')">
          <!-- <h2>Piggy Bank</h2> -->
          <img src="../assets/piggybank2.png" alt="Piggy Bank" class="piggy-bank">
          <div class="coin-container d-flex flex-wrap justify-content-center align-items-center">
            <div v-for="coin in piggyBankCoins" :key="coin.uniqueId" class="col-auto m-1 p-1">
              <img :src="coin.image" :alt="coin.value" class="coin" 
                   :data-coin-id="coin.uniqueId"
                   draggable="true"
                   @dragstart="onDragStart($event, coin.uniqueId, 'piggyBank')"
                   @dragend="onDragEnd">
            </div>
          </div>
        </div>
      </div>
    </div>

<div class="row justify-content-evenly">
  <div class="col-auto">
    <div class="button-container">
            <button class="btn btn-custom px-5" @click="resetGame">Reset</button>
            <button class="btn btn-custom px-5">Next</button>
        </div>
  </div>
  
</div>
    

  </div>
</template>

<script>
import oneDollarImage from '../assets/1dollar.png';
import fiftyCentsImage from '../assets/50cents.png';
import twentyCentsImage from '../assets/20cents.png';
import tenCentsImage from '../assets/10cents.png';
import fiveCentsImage from '../assets/5cents.png';

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
      targetAmount: 1.80,
      draggedCoin: null
    };
  },
  computed: {
    total() {
      return this.counterCoins.reduce((sum, coin) => sum + coin.value, 0);
    },
    isCorrect() {
      return this.total === this.targetAmount;
    },
    message() {
      if (this.isCorrect) {
        return "Correct! You've reached $1.80!";
      } else if (this.total > 0) {
        return this.total < this.targetAmount ? "Keep adding!" : "Too much! Try removing some coins.";
      }
      return "";
    }
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
    resetGame(){
      this.counterCoins=[];
      this.piggyBankCoins = [...this.coins, ...this.coins,...this.coins].map(coin => 
      this.createCoin(coin.id, coin.value, coin.image)
    );
    }
  },
  created() {
    this.resetGame()
  }
};
</script>

<style scoped>
.container-fluid{
  background-color: #B7E0FF;
}
.counter{
  background: url('https://www.transparenttextures.com/patterns/wood.png'); /* Wood texture */
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
    width: 70%; /* Adjust to fit within the piggy bank area */
    transform: translate(-50%, -50%); /*MUST HAVE--> to set the positioning of the coins */
    gap: 0; /* Removes any space between coins */
    line-height: 0;
    }
.coin {
  width: 60px;
  height: 60px;
  cursor: grab;
  margin:0;
  transition: transform 0.1s;
}

@media (max-width: 515px) {
  .coin {
    width: 10vw; /* Adjust this size to fit smaller screens */
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