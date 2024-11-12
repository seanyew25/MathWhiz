<template>
  <div class="wrapper min-vh-100 py-3">
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
      <div class="row d-flex justify-content-center">
        <!-- Chat and Question -->
        <div v-if="showChat" class="col-12 col-lg-6 m-0 d-flex justify-content-center">
          <div class="chat-container justify-content-center">
            <div class="chat-bubble text-wrap pinned-message">{{ chatText }}</div>
            <div class="scrollable-messages" ref="scrollableMessages" :class="{
              'has-messages': messages.length > 0,
              'scrollable': messages.length > maxVisibleMessages
            }" :style="{ height: scrollableHeight }">
              <div v-for="(message, index) in messages" :key="index" class="chat-bubble text-wrap"
                :class="{ 'correct': message.type === 'correct', 'incorrect': message.type === 'incorrect' }">
                {{ message.text }}
              </div>
            </div>
            <div class="fraction-input"
              :class="{ correct: correctAnswer, incorrect: incorrectAnswer, 'input-vibrate': inputVibrate }">
              <span :class="{ 'blink': activeInput === 'numerator' }">{{ numerator || '?' }}</span> /
              <span :class="{ 'blink': activeInput === 'denominator' }">{{ denominator || '?' }}</span>
            </div>
          </div>
        </div>

        <!-- Cake Display -->
        <div v-if="showCakes" class="col-12 col-lg-6 d-flex align-items-center justify-content-center">
          <!-- to change from here -->
          <div class="cake-display">
            <img :src="shelf" alt="Wooden shelf" class="shelf-image">
            <div class="cakes-grid">
              <div v-for="(row, rowIndex) in 3" :key="`row-${rowIndex}`" class="shelf-row"
                :style="{ '--row-offset': rowIndex === 0 ? '5px' : rowIndex === 1 ? '20px' : rowIndex === 2 ? '30px' : '0' }">
                <div v-for="(cake, colIndex) in cakesMatrix[rowIndex]" :key="`cake-${rowIndex}-${colIndex}`"
                  class="cake-slot">
                  <img :src="cake.image" :alt="cake.type" class="cake">
                </div>
              </div>
            </div>
          </div>
          <!-- to change ending here -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vanilla from '/assets/bakeryassets/vanilla-nobg.png';
import hazelnut from '/assets/bakeryassets/hazelnut-nobg.png';
import strawberry from '/assets/bakeryassets/strawberry2.png';
import shelf from '/assets/bakeryassets/shelf.png';
export default {
  data() {
    return {
      // inside:'',
      // checker:true,
      isInputActive: false,
      showPhone: true,
      showChat: false,
      showCakes: false,
      chatText: '',
      fullMessage: "Hello ah, I want to have a cat party. But i can’t eat chocolate. We want only vanilla cupcakes. What fraction of the total cakes are vanilla?",
      messageCaps: {
        small: 2,
        large: 5
      },
      messageHeight: 80,
      messages: [],
      activeInput: 'numerator',
      numerator: '',
      denominator: '',
      correctAnswer:false,
      incorrectAnswer:false,
      inputVibrate: false,
      shelf,
      cakesMatrix: [], // Will hold the 3x3 matrix of cakes
      correctFraction: { numerator: 0, denominator: 9 } // Will be set during initialization
    }
  },
  methods: {
    acceptCall() {
      this.showPhone = false;
      this.showChat = true;
      this.showCakes = true;
      this.typeChat();
    },
    rejectCall() {
      this.showPhone = false;
      this.$router.push("/game");
    },
    generateRandomCakes() {
      const cakeTypes = [
        { type: 'vanilla', image: vanilla },
        { type: 'strawberry', image: strawberry },
        { type: 'hazelnut', image: hazelnut }
      ]

      // Create array of 9 random cakes
      let cakes = []
      for (let i = 0; i < 9; i++) {
        const randomType = cakeTypes[Math.floor(Math.random() * cakeTypes.length)]
        cakes.push({ ...randomType })
      }

      // Count vanilla cakes for fraction
      const vanillaCakes = cakes.filter(cake => cake.type === 'vanilla').length
      this.correctFraction.numerator = vanillaCakes

      // Convert to 3x3 matrix
      this.cakesMatrix = [
        cakes.slice(0, 3),
        cakes.slice(3, 6),
        cakes.slice(6, 9)
      ]
    },
    typeChat() {// synchronous control, I don't want anything to be happening in the background
      let i = 0;
      this.chatText = '';
      const interval = setInterval(() => {//setInterval to add characters at every 50 milliseconds
        this.chatText += this.fullMessage[i];
        i++;
        if (i >= this.fullMessage.length) {
          clearInterval(interval);
          this.isInputActive = true;
        }
      }, 10);
    },
    async addMessage(text, type = 'normal') {// I think i shouldn't be using async at all
      //especially if flow is like user ans correctly,
      //I want the "congratulations popup" to appear after text is fully rendered
      // In future if i got this logic error, think back if i should even use async vs sync
      this.isInputActive = false;
      const newMessage = { text: '', type };
      this.messages.push(newMessage);

      // Type out the message
      for (let i = 0; i < text.length; i++) {
        newMessage.text += text[i];
        await new Promise(resolve => setTimeout(resolve, 50));
        this.$forceUpdate();//Although on the backend we recognise that when reach await,
        //it pauses for 50ms, and loop continues. But UI doesn't re-render until the loop is finished
        // so we force Vue to recognise the text-update and re-render UI
        //This can be an async function (other things can run in the background) 
      }

      // if (type === 'initial') {
      this.isInputActive = true;
      // }
      this.$nextTick(() => {
        if (this.$refs.scrollableMessages) {
          this.$refs.scrollableMessages.scrollTop = this.$refs.scrollableMessages.scrollHeight;
        }
      });
    },
    handleInput(event) {
      if (!this.isInputActive) return;
      // Only process numeric keys
      if (!/^[0-9]$/.test(event.key)) return;

      if (this.activeInput === 'numerator') {
        this.numerator = event.key;
        this.activeInput = 'denominator';
      } else if (this.activeInput === 'denominator') {
        this.denominator = event.key;
        this.checkAnswer();
      }
    },
    async checkAnswer() {
      if (parseInt(this.numerator) === this.correctFraction.numerator && parseInt(this.denominator) === this.correctFraction.denominator) {
        // alert("Correct! Let's celebrate with vanilla cupcakes!");
        this.activeInput = null;
        this.inputVibrate = true;
        this.correctAnswer = true;
        this.addMessage("Yay! I will take that amount. You can move on!", 'correct');
        setTimeout(() => {
          this.inputVibrate = false;
        }, 1500);
        setTimeout(()=>{
          this.$router.push("/game");
        },4000)
        
      } else {
        // await this.addMessage("Please retry! My friends and I want the cake badly!", 'incorrect');
        // this.numerator = '';
        // this.denominator = '';
        // this.activeInput = 'numerator';
        this.incorrectAnswer = true; // Trigger incorrect style
        this.inputVibrate = true;
        this.isInputActive = false; // Disable input temporarily
        this.activeInput = null;
        await this.addMessage("Please retry! My friends and I want the cake badly!", "incorrect");
        // waits for addMessage to fully render then pause the effect
        // setTimeout(() => {
        this.incorrectAnswer = false; // Remove incorrect style
        this.inputVibrate = false;
        this.isInputActive = true; // Re-enable input
        this.numerator = '';
        this.denominator = '';
        this.activeInput = 'numerator';
        // }, 1500);
      }
    },

  },
  mounted() {
    document.addEventListener('keydown', this.handleInput);
    this.generateRandomCakes();
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.handleInput);
  },
  computed: {
    maxVisibleMessages() {
      return window.innerWidth >= 992 ? this.messageCaps.large : this.messageCaps.small
    },
    scrollableHeight() {
      if (this.messages.length === 0) return '0px'
      const visibleMessages = Math.min(this.messages.length, this.maxVisibleMessages)
      return `${visibleMessages * this.messageHeight}px`
    }
  }
}
</script>

<style scoped>
.wrapper {
  font-family: Arial, sans-serif;
  background-color: #B7E0FF;
  display: flex;
  justify-content: center;
  align-items: center;
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
  background-image: url('/assets/bakeryassets/mewtwo.png');
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
  justify-content: space-between;
  align-items: center;
  height: 30%;
  transform: translateY(var(--row-offset, 0));
}

.cake-slot {
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cake {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}
</style>