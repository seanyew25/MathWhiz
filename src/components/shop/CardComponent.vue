<template>
  <div class="tw-w-48 tw-rounded-lg border border-dark border-5">
    <div
      class="tw-p-2 tw-bg-[#FFCFB3] tw-text-center tw-items-center border-bottom border-dark border-5"
    >
      <p class="tw-font-press-start tw-text-sm">
        {{ furName }}
      </p>
    </div>
    <div class="tw-flex tw-justify-center tw-items-center tw-bg-white">
      <img class="tw-h-24" :src="imgLocation" />
    </div>
    <div
      class="tw-h-20 tw-flex border-top border-dark border-5 tw-p-2 tw-justify-center tw-text-center tw-items-center tw-bg-[#D5F5E3]"
    >
      <p class="tw-text-sm" style="font-family: monospace">
        {{ furDesc }}
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
  <!-- <div></div> -->
</template>
<style scoped>
p {
  margin: 0px;
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
  props: ["imgLocation", "furName", "furDesc"],
};
</script>
