<template>
  <div>
    <div class="tw-px-5 lg:tw-px-40 tw-py-20 tw-bg-[#B7E0FF] tw-flex-1">
      <div class="nes-container is-centered is-rounded tw-bg-[#FFF5CD]">
        <p class="tw-font-press-start">
          You live in Mathropolis with your cat Morgana
        </p>
        <section class="nes-container">
          <section class="message-list">
            <section class="message -left flex">
              <div>
                <div
                  class="nes-balloon from-left tw-bg-inherit tw-font-press-start md:tw-order-1"
                >
                  <p>Hello Morgana! You're so cute!</p>
                </div>
                <img
                  src="/assets/mainassets/player.png"
                  class="tw-h-20 md:tw-order-2"
                />
              </div>
            </section>

            <section class="message -right flex">
              <!-- Balloon -->
              <div class="nes-balloon from-right tw-font-press-start">
                <p>Yeah, I know right</p>
              </div>
              <img
                src="/assets/mainassets/morgana.png"
                class="tw-h-[80px] tw-justify-end"
              />
            </section>
          </section>
        </section>
      </div>
      <div class="nes-container is-centered is-rounded tw-bg-[#FFF5CD]">
        <p class="tw-font-press-start">Morgana likes to explore Mathropolis</p>
        <section class="nes-container">
          <p>insert image of cat in city</p>
        </section>
      </div>
      <div class="nes-container is-centered is-rounded tw-bg-[#FFF5CD]">
        <p class="tw-font-press-start">
          However, one day, you find Morgana had shed all his fur after
          exploring the city
        </p>
        <section class="nes-container">
          <section class="message-list">
            <section class="message -left">
              <div>
                <img src="/assets/mainassets/player.png" class="tw-h-20" />
                <div
                  class="nes-balloon from-left tw-bg-inherit tw-font-press-start"
                >
                  <p>Omg Morgana! What happened to your fur?😱</p>
                </div>
              </div>
            </section>

            <section class="message -right">
              <!-- Balloon -->
              <div class="nes-balloon from-right tw-font-press-start">
                <p>There're so much problems in the city today😭😭</p>
              </div>
              <img src="/assets/shopassets/furless.png" class="tw-h-[80px]" />
            </section>

            <section class="message -right">
              <!-- Balloon -->
              <div class="nes-balloon from-right tw-font-press-start">
                <p>Something happened in the bank, bakery and school</p>
              </div>
              <img src="/assets/shopassets/furless.png" class="tw-h-[80px]" />
            </section>

            <section class="message -right">
              <!-- Balloon -->
              <div class="nes-balloon from-right tw-font-press-start">
                <p>I got so stressed and all my fur fell off😭😭</p>
              </div>
              <img src="/assets/shopassets/furless.png" class="tw-h-[80px]" />
            </section>
          </section>
        </section>
      </div>
      <div class="nes-container is-centered is-rounded tw-bg-[#FFF5CD]">
        <p class="tw-font-press-start">
          You decide to help Morgana solve the city's problems and get back his
          fur
        </p>
        <section class="nes-container">
          <section class="message-list">
            <section class="message -left">
              <div>
                <img src="/assets/mainassets/player.png" class="tw-h-20" />
                <div
                  class="nes-balloon from-left tw-bg-inherit tw-font-press-start"
                >
                  <p>I'm gonna help you solve the problems!!</p>
                </div>
              </div>
            </section>
            <section class="message -left">
              <div>
                <img src="/assets/mainassets/player.png" class="tw-h-20" />
                <div
                  class="nes-balloon from-left tw-bg-inherit tw-font-press-start"
                >
                  <p>And you can destress and get your fur back!</p>
                </div>
              </div>
            </section>

            <section class="message -right">
              <!-- Balloon -->
              <div class="nes-balloon from-right tw-font-press-start">
                <p>Omg thanks~ 🥺🥺</p>
              </div>
              <img src="/assets/shopassets/furless.png" class="tw-h-[80px]" />
            </section>
          </section>
        </section>
      </div>

      <div class="nes-container is-centered is-rounded tw-bg-[#FFF5CD]">
        <p class="tw-font-press-start">
          Everything you need to get started!
        </p>
        <section class="nes-container">
          <section class="message-list">
            <!-- First chatbox introducing the arrow controls--> 
            <section class="message -left">
              <div>
                <img src="/assets/mainassets/player.png" class="tw-h-20" />
                <div
                  class="nes-balloon from-left tw-bg-inherit tw-font-press-start"
                >
                  <p>You will be moving around with the <strong>arrow keys</strong>, give them a try!</p>
                </div>
              </div>
            </section>        
          
          <!-- Arrow Key Div-->
          <div> 
            <button 
              @mousedown="toggleButtonState('up', true)" 
              @mouseup="toggleButtonState('up', false)" 
              @mouseleave="toggleButtonState('up', false)" 
              :class="buttonClass('up')">↑
            </button><br>

            <button 
              @mousedown="toggleButtonState('left', true)" 
              @mouseup="toggleButtonState('left', false)" 
              @mouseleave="toggleButtonState('left', false)" 
              :class="buttonClass('left')">←
            </button>

            <button 
              @mousedown="toggleButtonState('down', true)" 
              @mouseup="toggleButtonState('down', false)" 
              @mouseleave="toggleButtonState('down', false)" 
              :class="buttonClass('down')">↓
            </button>

            <button 
              @mousedown="toggleButtonState('right', true)" 
              @mouseup="toggleButtonState('right', false)" 
              @mouseleave="toggleButtonState('right', false)" 
              :class="buttonClass('right')">→
            </button>
          </div>

            <br>
            <section class="message -right">
              <div>
                <div
                  class="nes-balloon from-right tw-font-press-start"
                >
                  <p>Keep a lookout on the minimap for these signs and complete your challenges there!</p>
                </div>
                <img src="/assets/mainassets/player.png" class="tw-h-[80px]" />
              </div>
            </section>

            <div>
              <img src="/assets/mainassets/warning.png" class="tw-h-[160px]">
            </div>

            <br>
            <section class="message -left">
              <!-- Balloon -->
              <img src="/assets/shopassets/furless.png" class="tw-h-[80px]" />
              <div class="nes-balloon from-left tw-font-press-start">
                <p>Spot yourself on the minimap as a red dot!</p> <!-- Want change to light blue? 06NOV24-->
              </div>
            </section>

            <div>
              <img src="/assets/mainassets/StoryPage_minimap.png" class="tw-h-[300px]">
            </div>

            <br>
            <section class="message -right">
              <!-- Balloon -->
              <div class="nes-balloon from-right tw-font-press-start">
                <p>Be a law-abiding citizen and follow these signs on the way to your challenges!</p>
              </div>
              <img src="/assets/shopassets/furless.png" class="tw-h-[80px]" />
            </section>

            <div>
              <img src="/assets/mainassets/DirectionalSignboards/LEFT.png" class="tw-h-[80px]">
              |
              <img src="/assets/mainassets/DirectionalSignboards/LEFTBEND.png" class="tw-h-[80px]">
              |
              <img src="/assets/mainassets/DirectionalSignboards/LEFTDOWN.png" class="tw-h-[80px]">
              |
              <img src="/assets/mainassets/DirectionalSignboards/LEFTRIGHT.png" class="tw-h-[80px]">
              |
              <img src="/assets/mainassets/DirectionalSignboards/RIGHT.png" class="tw-h-[80px]">
            </div>

            <br>
            <section class="message">
              <i class="nes-icon trophy is-medium"></i>
              <!-- Balloon -->
              <div class="nes-balloon tw-font-press-start">
                <p>Are you ready?</p>
              </div>
              <i class="nes-icon trophy is-medium"></i>
            </section>

            <!-- <button type="button" class="nes-btn is-success" href="HomePage.vue">Let's get started!</button> -->
            <button @click="goToHome" class="nes-btn">Let's get started!</button>
            <!-- <a href="/src/components/Environment.js">Click</a> -->



          </section>
        </section>
      </div>
    </div>
  </div>
</template>

<script scoped> // Seems to have a problem that the scoped js spillsover to home screen and prevents player from moving - 06NOV24 // TAKEN OUT temporarily - 07NOV24
  export default {
    data() {
      return {
        // Track the pressed state of each button
        buttonPressed: {
          up: false,
          left: false,
          down: false,
          right: false
        }
      };
    },
    mounted() {
      // Listen for keydown and keyup events when the component is mounted
      window.addEventListener('keydown', this.handleKeydown);
      window.addEventListener('keyup', this.handleKeyup);
    },
    beforeDestroy() {
      // Clean up the event listeners when the component is destroyed
      window.removeEventListener('keydown', this.handleKeydown);
      window.removeEventListener('keyup', this.handleKeyup);
    },
    methods: {
      //Redirect user back home
      goToHome(){
        this.$router.push('/home');
      },

      // Change the button state when the button is pressed or released (for both mouse and keyboard)
      toggleButtonState(direction, isPressed) {
        this.buttonPressed[direction] = isPressed;
      },
      
      // Handle the keydown event (when the arrow keys are pressed)
      handleKeydown(event) {
        if (event.key === 'ArrowUp') {
          this.toggleButtonState('up', true);
          // event.preventDefault() // Prevent default behaviour of scrolling up 
        } else if (event.key === 'ArrowLeft') {
          this.toggleButtonState('left', true);
          // event.preventDefault() // Prevent default behaviour of scrolling left  
        } else if (event.key === 'ArrowDown') {
          this.toggleButtonState('down', true);
          // event.preventDefault() // Prevent default behaviour of scrolling down
        } else if (event.key === 'ArrowRight') {
          this.toggleButtonState('right', true);
          // event.preventDefault() // Prevent default behaviour of scrolling right 
        }
      },

      // Handle the keyup event (when the arrow keys are released)
      handleKeyup(event) {
        if (event.key === 'ArrowUp') {
          this.toggleButtonState('up', false);
        } else if (event.key === 'ArrowLeft') {
          this.toggleButtonState('left', false);
        } else if (event.key === 'ArrowDown') {
          this.toggleButtonState('down', false);
        } else if (event.key === 'ArrowRight') {
          this.toggleButtonState('right', false);
        }
      },

      // Return the appropriate class based on whether the button is pressed
      buttonClass(direction) {
        return {
          'nes-btn': true,
          'is-primary': !this.buttonPressed[direction],
          'is-success': this.buttonPressed[direction]
        };
      }
    }
  };
</script>

<style scoped>
/* Spotlight effect */
.nes-container {
  margin-bottom: 20px;
}
</style>
