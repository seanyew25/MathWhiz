import { reactive } from "vue";

export const store = reactive({
  playerPosition: { x: 736, y: 770 },
  setPlayerPosition(x, y) {
    this.playerPosition = { x: x, y: y + 10 };
  },
});
