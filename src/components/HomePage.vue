<template>
  <div id="phaser-container"></div>
</template>
<script>
import { onMounted } from "vue";
import { initializePhaser } from "./Environment.js";
import { useRouter } from "vue-router";
export default {
  mounted() {
    this.game = initializePhaser();
    this.game.scene.start("MainScene");
    console.log(this.game.scene);
    this.getSceneStatus().then(() => {
      console.log(`scene: ${this.game.scene.getScene("MainScene")}`);
      this.handleDoorCollision();
    });
    this.router = useRouter();
  },
  data() {
    return {
      game: null,
      router: null,
    };
  },
  //DESTROY GAME BEFORE ROUTE LEAVE ELSE WEBGL ERROR WILL APPEAR
  beforeRouteLeave() {
    if (this.game && this.game.destroy) {
      this.game.destroy(true); // destroys all phaser dom elements
    }
  },
  methods: {
    getSceneStatus() {
      let game = this.game;
      function getSceneStatus(gameObj) {
        // console.log(gameObj.scene.getScene("MainScene"));
        if (gameObj.scene.getScene("MainScene")) {
          return true;
        } else {
          return false;
        }
      }
      return new Promise((resolve, reject) => {
        // let status = false;
        // let count = 0;
        // status = checkSceneStatus(game);
        function checkStatus(game) {
          // console.log("Scene not found!");
          setInterval(() => {
            if (getSceneStatus(game)) {
              resolve("scene found");
            } else {
              getSceneStatus(game);
            }
          }, 500);
        }
        checkStatus(game);
      });
    },
    handleDoorCollision() {
      // console.log(`from collision: ${this.game}`);
      let scene = this.game.scene.getScene("MainScene");
      console.log(`main scene: ${scene}`);

      if (!scene) {
        console.error("Scene not found!");
        return;
      }
      console.log(scene);

      scene.events.on("doorCollision", (doorObj) => {
        console.log(`door: ${doorObj.name}`);
        const name = doorObj.name;
        if (name === "homeDoor") {
          this.router.push("/profile");
        } else if (name === "bankDoor") {
          this.router.push("/bank");
        } else if (
          name === "shoppingCentreDoor1" ||
          name === "shoppingCentreDoor2"
        ) {
          this.router.push("/shoppingCentre");
        } else if (name === "schoolDoor1" || name === "schoolDoor2") {
          this.router.push("/school");
        } else if (name === "bakeryDoor") {
          this.router.push("/bakery");
        }
      });
    },
  },
};
</script>
<style scoped>
#phaser-container {
  overflow: hidden;
  height: calc(100vh - 56px);
}
</style>
