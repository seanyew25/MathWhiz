<template>
  <button @click="handleCardClick" class="card" ref="cardButton">
    <div
      class="card-front tw-w-60 tw-h-[327px] tw-rounded-lg border border-dark border-5 animate__animated animate__zoomIn"
      :class="rarityShadow"
    >
      <div
        class="tw-p-2 tw-text-center tw-items-center border-bottom border-dark border-5"
        :class="rarityHeaders"
      >
        <p class="tw-font-russo-one tw-text-xl">
          {{ catObj.name }}
        </p>
        <div
          class="rarity tw-text-xs tw-mt-1 tw-font-bold"
          :class="rarityTextColor"
        >
          {{ catObj.rarity }}
        </div>
      </div>

      <div
        class="tw-flex tw-justify-center tw-items-center tw-bg-white tw-py-1 tw-relative"
      >
        <div
          class="tw-absolute tw-inset-0 tw-opacity-20"
          :class="rarityImgBackgrounds"
        ></div>
        <img class="tw-h-24 tw-relative tw-z-10" :src="catObj.imgLocation" />
      </div>

      <div
        class="tw-h-20 tw-flex-1 border-top border-dark border-5 tw-p-2 tw-justify-center tw-text-center tw-items-center"
        :class="rarityDescriptions"
      >
        <p class="tw-text-sm" style="font-family: monospace">
          {{ catObj.description }}
        </p>
      </div>

      <div
        class="tw-grid border-dark border-5 border-top tw-p-2 tw-grid-cols-2"
        :class="rarityPrices"
      >
        <div class="tw-flex tw-items-center tw-ml-1">
          <span class="tw-font-russo-one tw-mr-1">{{ catObj.price }} </span>
          <i class="nes-icon coin is-small"></i>
        </div>

        <button
          @click.stop="handleBuyClick"
          type="button"
          class="nes-btn tw-font-press-start tw-text-xs tw-justify-self-end"
          :class="rarityButtons"
        >
          Buy
        </button>
      </div>
    </div>

    <div
      class="card-back tw-w-60 tw-rounded-lg tw-h-[328px] border border-dark border-5"
      :class="rarityShadow"
    >
      <div
        class="tw-p-2 tw-text-center tw-items-center border-bottom border-dark border-5"
        :class="rarityHeaders"
      >
        <p class="tw-font-russo-one tw-text-xl">
          {{ catObj.name }}
        </p>
        <div
          class="rarity tw-text-xs tw-mt-1 tw-font-bold"
          :class="rarityTextColor"
        >
          {{ catObj.rarity }}
        </div>
      </div>

      <div
        class="tw-flex tw-justify-center tw-items-center tw-bg-white tw-py-1 tw-relative"
      >
        <div
          class="tw-absolute tw-inset-0 tw-opacity-20"
          :class="rarityImgBackgrounds"
        ></div>
        <img class="tw-h-24 tw-relative tw-z-10" :src="catObj.imgLocation" />
      </div>

      <div
        class="tw-h-[146px] tw-p-2 border-top border-5 border-dark"
        :class="rarityStatsBackgrounds"
      >
        <div class="tw-space-y-3">
          <div class="tw-pl-2 tw-pr-4">
            <div class="tw-flex tw-justify-between tw-mb-1">
              <span
                class="tw-text-xs tw-font-medium"
                style="font-family: monospace"
                >Coolness</span
              >
              <span class="tw-text-xs" style="font-family: monospace"
                >{{ catObj.coolness }}%</span
              >
            </div>
            <progress
              class="nes-progress"
              :class="rarityStatBars"
              :value="catObj.coolness"
              max="100"
            ></progress>
          </div>

          <div class="tw-pl-2 tw-pr-4">
            <div class="tw-flex tw-justify-between tw-mb-1">
              <span
                class="tw-text-xs tw-font-medium"
                style="font-family: monospace"
                >Fluffiness</span
              >
              <span class="tw-text-xs" style="font-family: monospace"
                >{{ catObj.fluffiness }}%</span
              >
            </div>
            <progress
              class="nes-progress"
              :class="rarityStatBars"
              :value="catObj.fluffiness"
              max="100"
            ></progress>
          </div>
        </div>
      </div>
    </div>
  </button>
</template>

<style scoped>
.nes-btn.is-success {
  color: #fff;
  background-color: #92cc41;
}

.nes-btn.is-success::after {
  position: absolute;
  top: -4px;
  right: -4px;
  bottom: -4px;
  left: -4px;
  content: "";
  box-shadow: inset -4px -4px #4aa52e;
}

.nes-btn.is-success:hover {
  color: #fff;
  text-decoration: none;
  background-color: #76c442;
}

.nes-btn.is-success:hover::after {
  box-shadow: inset -6px -6px #4aa52e;
}

.nes-btn.is-success:focus {
  box-shadow: 0 0 0 6px rgba(74, 165, 46, 0.3);
}

.nes-btn.is-success:active:not(.is-disabled)::after {
  box-shadow: inset 4px 4px #4aa52e;
}

.nes-btn.is-warning {
  color: #212529;
  background-color: #f7d51d;
}

.nes-btn.is-warning::after {
  position: absolute;
  top: -4px;
  right: -4px;
  bottom: -4px;
  left: -4px;
  content: "";
  box-shadow: inset -4px -4px #e59400;
}

.nes-btn.is-warning:hover {
  color: #212529;
  text-decoration: none;
  background-color: #f2c409;
}

.nes-btn.is-warning:hover::after {
  box-shadow: inset -6px -6px #e59400;
}

.nes-btn.is-warning:focus {
  box-shadow: 0 0 0 6px rgba(229, 148, 0, 0.3);
}

.nes-btn.is-warning:active:not(.is-disabled)::after {
  box-shadow: inset 4px 4px #e59400;
}
p {
  margin: 0px;
}
.nes-progress {
  border-style: solid;
  border-width: 4px;
}
.nes-progress {
  border-image-slice: 2;
  border-image-width: 2;
  border-image-repeat: stretch;
  border-image-source: url('data:image/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8" ?><svg version="1.1" width="5" height="5" xmlns="http://www.w3.org/2000/svg"><path d="M2 1 h1 v1 h-1 z M1 2 h1 v1 h-1 z M3 2 h1 v1 h-1 z M2 3 h1 v1 h-1 z" fill="rgb(33,37,41)" /></svg>');
  border-image-outset: 2;
  width: 100%;
  height: 20px;
  margin: 4px;
  color: #212529;
  background-color: #fff;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.nes-progress.is-success::-webkit-progress-bar {
  background-color: #fff;
}

.nes-progress.is-success::-webkit-progress-value {
  background-color: #92cc41;
}

.nes-progress.is-warning::-webkit-progress-bar {
  background-color: #fff;
}

.nes-progress.is-warning::-webkit-progress-value {
  background-color: #f7d51d;
}

.card {
  position: relative;
  width: 15rem;
  height: 291px;
  perspective: 1000px;
  transform-style: preserve-3d;
  transition: rotate 500ms linear;
  background-color: transparent;
  border: transparent;
  transition: transform 0.4s ease;
  cursor: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC)
      14 0,
    pointer;
}

.card:hover {
  transform: scale(1.05);
  margin: 0;
}

.card.show {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  position: absolute;
  inset: 0;
  place-content: center;
  backface-visibility: hidden;
  transition: transform 0.4s ease;
}

.card-back {
  transform: rotateY(180deg);
}

.card.show {
  transform: rotateY(180deg) scale(1);
}

.card.show:hover {
  transform: rotateY(180deg) scale(1.05);
  margin: 0;
}

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
.nes-btn.is-primary {
  color: #fff;
  background-color: #209cee;
}
</style>

<script>
import "animate.css";
export default {
  props: ["catObj"],
  computed: {
    rarityShadow() {
      return {
        "tw-shadow-2xl tw-shadow-yellow-200":
          this.catObj.rarity === "Super Rare",
      };
    },
    rarityHeaders() {
      return {
        "tw-bg-gray-200": this.catObj.rarity === "Common",
        "tw-bg-green-300": this.catObj.rarity === "Rare",
        "tw-bg-yellow-200": this.catObj.rarity === "Super Rare",
      };
    },
    rarityDescriptions() {
      return {
        "tw-bg-gray-100": this.catObj.rarity === "Common",
        "tw-bg-green-200": this.catObj.rarity === "Rare",
        "tw-bg-yellow-100": this.catObj.rarity === "Super Rare",
      };
    },
    rarityPrices() {
      return {
        "tw-bg-gray-50": this.catObj.rarity === "Common",
        "tw-bg-green-100": this.catObj.rarity === "Rare",
        "tw-bg-yellow-50": this.catObj.rarity === "Super Rare",
      };
    },
    rarityStatsBackgrounds() {
      return {
        "tw-bg-gray-100": this.catObj.rarity === "Common",
        "tw-bg-green-200": this.catObj.rarity === "Rare",
        "tw-bg-yellow-100": this.catObj.rarity === "Super Rare",
      };
    },
    rarityButtons() {
      return {
        "is-primary": this.catObj.rarity === "Common",
        "is-success": this.catObj.rarity === "Rare",
        "is-warning": this.catObj.rarity === "Super Rare",
      };
    },
    rarityStatBars() {
      return {
        "is-primary": this.catObj.rarity === "Common",
        "is-success": this.catObj.rarity === "Rare",
        "is-warning": this.catObj.rarity === "Super Rare",
      };
    },
    rarityImgBackgrounds() {
      return {
        "tw-bg-gray-400": this.catObj.rarity === "Common",
        "tw-bg-green-400": this.catObj.rarity === "Rare",
        "tw-bg-yellow-400": this.catObj.rarity === "Super Rare",
      };
    },
    rarityTextColor() {
      return {
        "tw-text-gray-600 tw-font-russo-one": this.catObj.rarity === "Common",
        "tw-text-green-600 tw-font-russo-one": this.catObj.rarity === "Rare",
        "tw-text-yellow-600 tw-font-russo-one":
          this.catObj.rarity === "Super Rare",
      };
    },
  },
  methods: {
    handleCardClick() {
      this.$refs.cardButton.classList.toggle("show");
    },
    handleBuyClick() {
      this.$emit("buyAction", this.catObj);
    },
  },
};
</script>
