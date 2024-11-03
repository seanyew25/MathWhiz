<template>
  <button @click="handleCardClick" class="card" ref="cardButton">
    <div class="card-front tw-w-60 tw-rounded-lg border border-dark border-5">
      <div
        class="tw-p-2 tw-bg-[#FFCFB3] tw-text-center tw-items-center border-bottom border-dark border-5"
      >
        <p class="tw-font-press-start tw-text-sm">
          {{ catObj.name }}
        </p>
      </div>
      <div class="tw-flex tw-justify-center tw-items-center tw-bg-white">
        <img class="tw-h-24" :src="catObj.imgLocation" />
      </div>
      <div
        class="tw-h-20 tw-flex border-top border-dark border-5 tw-p-2 tw-justify-center tw-text-center tw-items-center tw-bg-[#D5F5E3]"
      >
        <p class="tw-text-sm" style="font-family: monospace">
          {{ catObj.description }}
        </p>
      </div>
      <div
        class="tw-grid border-dark border-5 border-top tw-p-2 tw-grid-cols-2 tw-bg-[#FFF5CD]"
      >
        <div class="tw-flex tw-items-center tw-ml-1">
          <span class="tw-font-press-start">200</span>
          <i class="nes-icon coin is-small"></i>
        </div>

        <button
          type="button"
          class="nes-btn is-primary tw-font-press-start tw-text-xs tw-justify-self-end"
        >
          Buy
        </button>
      </div>
    </div>
    <div class="card-back tw-w-60 tw-rounded-lg border border-dark border-5">
      <div
        class="tw-p-2 tw-bg-[#FFCFB3] tw-text-center tw-items-center border-bottom border-dark border-5"
      >
        <p class="tw-font-press-start tw-text-sm">
          {{ catObj.name }}
        </p>
      </div>
      <div class="tw-flex tw-justify-center tw-items-center tw-bg-white">
        <img class="tw-h-24" :src="catObj.imgLocation" />
      </div>
      <div class="tw-h-full tw-p-2 border-top border-5 border-dark">
        <div class="tw-space-y-3">
          <div class="tw-pl-2 tw-pr-4">
            <div class="tw-flex tw-justify-between tw-mb-1">
              <span
                class="tw-text-xs tw-font-medium tw-text-gray-700"
                style="font-family: monospace"
                >Coolness</span
              >
              <span
                class="tw-text-xs tw-text-gray-600"
                style="font-family: monospace"
                >{{ catObj.cuteness }}%</span
              >
            </div>
            <!-- <div class="tw-w-full tw-p-6 tw-h-2 tw-bg-gray-200 tw-rounded-full"> -->
            <!-- <div
                class="tw-h-full tw-bg-pink-400 tw-rounded-full tw-transition-all tw-duration-300"
                :style="{ width: catObj.cuteness + 'px' }"
              /> -->
            <progress
              class="nes-progress is-primary"
              :value="catObj.cuteness"
              max="100"
            ></progress>
            <!-- </div> -->
          </div>

          <div class="tw-pl-2 tw-pr-4">
            <div class="tw-flex tw-justify-between tw-mb-1">
              <span
                class="tw-text-xs tw-font-medium tw-text-gray-700"
                style="font-family: monospace"
                >Fluffiness</span
              >
              <span
                class="tw-text-xs tw-text-gray-600"
                style="font-family: monospace"
                >{{ catObj.fluffiness }}%</span
              >
            </div>
            <progress
              class="nes-progress is-error"
              :value="catObj.fluffiness"
              max="100"
            ></progress>
            <!-- <div class="tw-w-full tw-h-2 tw-bg-gray-200 tw-rounded-full">
              <div
                class="tw-h-full tw-bg-orange-400 tw-rounded-full tw-transition-all tw-duration-300"
                :style="{ width: catObj.fluffiness + 'px' }"
              />
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </button>
  <!-- <div></div> -->
</template>
<style scoped>
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
.card {
  position: relative;
  width: 15rem;
  height: 291px;
  perspective: 1000px;
  transform-style: preserve-3d;
  transition: rotate 500ms linear;
  background-color: #b7e0ff;
  border: transparent;
  transition: transform 0.4s ease;
  cursor: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC)
      14 0,
    pointer;
}

.card:hover {
  transform: scale(1.05);
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
  background-color: #d5f5e3;
  transform: rotateY(180deg);
}
.card.show {
  transform: rotateY(180deg) scale(1);
}
.card.show:hover {
  transform: rotateY(180deg) scale(1.05);
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
export default {
  props: ["catObj"],
  methods: {
    handleCardClick() {
      this.$refs.cardButton.classList.toggle("show");
    },
  },
};
</script>
