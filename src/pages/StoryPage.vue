<!--MAKE BUTTON BIGGER, REMOVE TEXT BOX TAIL LOL-->

<template>
  <div class="story-carousel-wrapper">
    <div id="storyCarousel" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
        <!-- Carousel 1 -->
        <div class="carousel-item active">
          <div class="nes-container is-centered is-rounded tw-bg-[#FFF5CD]">
            <p class="tw-font-press-start">
              You live in Mathropolis with your cat Morgana
            </p>
            <section class="nes-container">
              <section class="message-list">
                <section class="message -left flex">
                  <div>
                    <img
                      src="/assets/mainassets/player.png"
                      class="tw-h-20 md:tw-order-2"
                    />
                    <div
                      class="nes-balloon tw-bg-inherit tw-font-press-start md:tw-order-1"
                    >
                      <p>Hello Morgana! You're so cute!</p>
                    </div>
                  </div>
                </section>
                <section class="message -right flex">
                  <div class="nes-balloon tw-font-press-start">
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
        </div>

        <!-- Carousel 2 -->
        <div class="carousel-item">
          <div class="nes-container is-centered is-rounded tw-bg-[#FFF5CD]">
            <p class="tw-font-press-start">
              Morgana likes to explore Mathropolis
            </p>
            <section class="nes-container">
              <div class="nes-balloon tw-bg-inherit tw-font-press-start">
                <p>Morgana strolls along the Bakery today! </p>
              </div>
              <p><img src="/assets/mainassets/MorganaExploringMathropolis.png"
                      class="tw-h-[300px] tw-justify-end"></p>
            </section>
          </div>
        </div>

        <!-- Carousel 3 -->
        <div class="carousel-item">
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
                    <div class="nes-balloon tw-bg-inherit tw-font-press-start">
                      <p>Omg Morgana! What happened to your fur?😱</p>
                    </div>
                  </div>
                </section>
                <section class="message -right">
                  <div class="nes-balloon tw-font-press-start">
                    <p>There're so much problems in the city today😭😭</p>
                  </div>
                  <img
                    src="/assets/shopassets/furless.png"
                    class="tw-h-[80px]"
                  />
                </section>
                <section class="message -right">
                  <div class="nes-balloon tw-font-press-start">
                    <p>I got so stressed and all my fur fell off😭😭</p>
                  </div>
                  <img
                    src="/assets/shopassets/furless.png"
                    class="tw-h-[80px]"
                  />
                </section>
              </section>
            </section>
          </div>
        </div>

        <!-- Carousel 4 -->
        <div class="carousel-item">
          <div class="nes-container is-centered is-rounded tw-bg-[#FFF5CD]">
            <p class="tw-font-press-start">
              You decide to help Morgana solve the city's problems and get back
              his fur
            </p>
            <section class="nes-container">
              <section class="message-list">
                <section class="message -left">
                  <div>
                    <img src="/assets/mainassets/player.png" class="tw-h-20" />
                    <div class="nes-balloon tw-bg-inherit tw-font-press-start">
                      <p>I'm gonna help you solve the problems!!</p>
                    </div>
                  </div>
                </section>
                <section class="message -left">
                  <div>
                    <img src="/assets/mainassets/player.png" class="tw-h-20" />
                    <div class="nes-balloon tw-bg-inherit tw-font-press-start">
                      <p>And you can destress and get your fur back!</p>
                    </div>
                  </div>
                </section>
                <section class="message -right">
                  <div class="nes-balloon tw-font-press-start">
                    <p>Omg thanks~ 🥺🥺</p>
                  </div>
                  <img
                    src="/assets/shopassets/furless.png"
                    class="tw-h-[80px]"
                  />
                </section>
              </section>
            </section>
          </div>
        </div>

        <!-- Carousel 5 -->
        <div class="carousel-item">
          <div class="nes-container is-centered is-rounded tw-bg-[#FFF5CD]">
            <p class="tw-font-press-start">
              Everything you need to get started!
            </p>
            <section class="nes-container">
              <section class="message-list">
                <section class="message -left">
                  <div>
                    <img src="/assets/mainassets/player.png" class="tw-h-20" />
                    <div class="nes-balloon tw-bg-inherit tw-font-press-start">
                      <p>Move around with the <strong>arrow keys</strong>!</p>
                    </div>
                  </div>
                </section>

                <!-- Arrow Key Div-->
                <div>
                  <button
                    @mousedown="toggleButtonState('up', true)"
                    @mouseup="toggleButtonState('up', false)"
                    @mouseleave="toggleButtonState('up', false)"
                    :class="buttonClass('up')"
                  >
                    ↑</button
                  ><br />
                  <button
                    @mousedown="toggleButtonState('left', true)"
                    @mouseup="toggleButtonState('left', false)"
                    @mouseleave="toggleButtonState('left', false)"
                    :class="buttonClass('left')"
                  >
                    ←
                  </button>
                  <button
                    @mousedown="toggleButtonState('down', true)"
                    @mouseup="toggleButtonState('down', false)"
                    @mouseleave="toggleButtonState('down', false)"
                    :class="buttonClass('down')"
                  >
                    ↓
                  </button>
                  <button
                    @mousedown="toggleButtonState('right', true)"
                    @mouseup="toggleButtonState('right', false)"
                    @mouseleave="toggleButtonState('right', false)"
                    :class="buttonClass('right')"
                  >
                    →
                  </button>
                </div>

                <br />
                <section class="message -right">
                  <div>
                    <div class="nes-balloon tw-font-press-start">
                      <p>
                        The caution sign will direct you to your challenges!
                      </p>
                    </div>
                    <img
                      src="/assets/mainassets/player.png"
                      class="tw-h-[80px]"
                    />
                  </div>
                </section>

                <div>
                  <img
                    src="/assets/mainassets/warning.png"
                    class="tw-h-[100px]"
                  />
                </div>
              </section>
            </section>
          </div>
        </div>

        <!-- Carousel 6 -->
        <div class="carousel-item">
          <div class="nes-container is-centered is-rounded tw-bg-[#FFF5CD]">
            <p class="tw-font-press-start">Locate yourself!</p>
            <section class="nes-container">
              <section class="message-list">
                <section class="message -left">
                  <img
                    src="/assets/shopassets/furless.png"
                    class="tw-h-[80px]"
                  />
                  <div class="nes-balloon tw-font-press-start">
                    <p>Spot yourself on the minimap as a yellow star!</p>
                  </div>
                </section>

                <div>
                  <img src="/assets/mainassets/minimap.png" class="tw-h-[200px]">
                </div>
                <section class="message -right">
                  <div class="nes-balloon tw-font-press-start">
                    <p>Follow these signboards to your challenges!</p>
                  </div>
                  <img
                    src="/assets/shopassets/furless.png"
                    class="tw-h-[80px]"
                  />
                </section>

                <div>
                  <img
                    src="/assets/mainassets/DirectionalSignboards/LEFT.png"
                    class="tw-h-[80px]"
                  />
                  |
                  <img
                    src="/assets/mainassets/DirectionalSignboards/LEFTBEND.png"
                    class="tw-h-[80px]"
                  />
                  |
                  <img
                    src="/assets/mainassets/DirectionalSignboards/LEFTDOWN.png"
                    class="tw-h-[80px]"
                  />
                  |
                  <img
                    src="/assets/mainassets/DirectionalSignboards/LEFTRIGHT.png"
                    class="tw-h-[80px]"
                  />
                  |
                  <img
                    src="/assets/mainassets/DirectionalSignboards/RIGHT.png"
                    class="tw-h-[80px]"
                  />
                </div>
              </section>
            </section>
          </div>
        </div>

        <div class="carousel-item">
          <div class="nes-container is-centered is-rounded tw-bg-[#FFF5CD]">
            <section class="message">
              <i class="nes-icon trophy is-medium"></i>
              <div class="nes-balloon tw-font-press-start">
                <p>Are you ready?</p>
              </div>
              <i class="nes-icon trophy is-medium"></i>
            </section>

            <button type="button" @click="goToHome" class="nes-btn is-success">
              <!-- Adding a span component here to make text nes, not sure why it doesnt work with class.-->
              <span class="nes-text">Click me to get started!</span>
            </button>
          </div>
        </div>
      </div>

      <button
        class="carousel-control-prev"
        type="button"
        data-bs-target="#storyCarousel"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button
        class="carousel-control-next"
        type="button"
        data-bs-target="#storyCarousel"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      buttonPressed: {
        up: false,
        left: false,
        down: false,
        right: false,
      },
    };
  },
  mounted() {
    window.addEventListener("keydown", this.handleKeydown);
    window.addEventListener("keyup", this.handleKeyup);
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.handleKeydown);
    window.removeEventListener("keyup", this.handleKeyup);
  },
  methods: {
    goToHome() {
      this.$router.push("/game");
    },
    toggleButtonState(direction, isPressed) {
      this.buttonPressed[direction] = isPressed;
    },
    handleKeydown(event) {
      if (event.key === "ArrowUp") {
        this.toggleButtonState("up", true);
      } else if (event.key === "ArrowLeft") {
        this.toggleButtonState("left", true);
      } else if (event.key === "ArrowDown") {
        this.toggleButtonState("down", true);
      } else if (event.key === "ArrowRight") {
        this.toggleButtonState("right", true);
      }
    },
    handleKeyup(event) {
      if (event.key === "ArrowUp") {
        this.toggleButtonState("up", false);
      } else if (event.key === "ArrowLeft") {
        this.toggleButtonState("left", false);
      } else if (event.key === "ArrowDown") {
        this.toggleButtonState("down", false);
      } else if (event.key === "ArrowRight") {
        this.toggleButtonState("right", false);
      }
    },
    buttonClass(direction) {
      return {
        "nes-btn": true,
        "is-primary": !this.buttonPressed[direction],
        "is-success": this.buttonPressed[direction],
      };
    },
  },
};
</script>

<style scoped>
@import "../../node_modules/nes.css/css/nes.css";

.nes-btn {
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

.nes-text {
  font-family: "Press Start 2P", sans-serif; /* NES-style font added this here because inline doesnt work.*/
}

.story-carousel-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 20px 0;
}

.carousel {
  width: 100%;
}

.carousel-item {
  transition: transform 0.5s ease;
  padding:20px;
  height:60%;
}

.carousel-inner {
  height: 80%;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.nes-container {
  margin-bottom: 20px;
  position: relative;
  padding: 1.5rem 2rem;
  border-color: black;
  border-style: solid;
  border-width: 4px;
}

.nes-container.is-rounded {
  border-image-slice: 3;
  border-image-width: 3;
  border-image-repeat: stretch;
  border-image-source: url('data:image/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8" ?><svg version="1.1" width="8" height="8" xmlns="http://www.w3.org/2000/svg"><path d="M3 1 h1 v1 h-1 z M4 1 h1 v1 h-1 z M2 2 h1 v1 h-1 z M5 2 h1 v1 h-1 z M1 3 h1 v1 h-1 z M6 3 h1 v1 h-1 z M1 4 h1 v1 h-1 z M6 4 h1 v1 h-1 z M2 5 h1 v1 h-1 z M5 5 h1 v1 h-1 z M3 6 h1 v1 h-1 z M4 6 h1 v1 h-1 z" fill="rgb(33,37,41)" /></svg>');
  border-image-outset: 2;
  padding: 1rem 1.5rem;
  margin: 4px;
}

.carousel-control-prev,
.carousel-control-next {
  width: 5%;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.carousel-control-prev {
  left: 10px;
}

.carousel-control-next {
  right: 10px;
}

.carousel-control-prev:focus,
.carousel-control-next:focus {
  outline: none; /* Ensures no outline appears on focus */
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
  background-color: #000;
  border-radius: 50%;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 20px; /* Space between each message */
  align-items: center; /* Centers all messages in the main container */
}

.message {
  display: flex;
  align-items: center; /* Centers icon and text box vertically */
  justify-content: center; /* Centers icon and text box horizontally */
  gap: 10px; /* Space between the icon and text box */
}

.nes-balloon {
  flex: 1;
  max-width: 80%;
  text-align: center; /* Centers text within the balloon */
  border-image-slice: 3;
  border-image-width: 3;
  border-image-repeat: stretch;
  border-image-source: url('data:image/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8" ?><svg version="1.1" width="8" height="8" xmlns="http://www.w3.org/2000/svg"><path d="M3 1 h1 v1 h-1 z M4 1 h1 v1 h-1 z M2 2 h1 v1 h-1 z M5 2 h1 v1 h-1 z M1 3 h1 v1 h-1 z M6 3 h1 v1 h-1 z M1 4 h1 v1 h-1 z M6 4 h1 v1 h-1 z M2 5 h1 v1 h-1 z M5 5 h1 v1 h-1 z M3 6 h1 v1 h-1 z M4 6 h1 v1 h-1 z" fill="rgb(33,37,41)" /></svg>');
  border-image-outset: 2;
  position: relative;
  display: inline-block;
  padding: 1rem 1.5rem;
  margin: 8px;
  margin-bottom: 30px;
  background-color: #fff;
}

/* @media (max-width: 768px) {
  .carousel-control-prev,
  .carousel-control-next {
    display: none;
  }
} */
</style>
