import { reactive } from "vue";

export const globalState = reactive({
  playerPosition: { x: 736, y: 770 },
  setPlayerPosition(x, y) {
    this.playerPosition = { x: x, y: y };
  },
  playerImgLink: "",
  setPlayerImageLink(link) {
    this.playerImgLink = link;
  },
});
