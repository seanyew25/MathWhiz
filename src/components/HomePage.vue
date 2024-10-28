<template>
  <div id="phaser-container"></div>
</template>
<script>
import { onMounted } from "vue";
import MainScene, { initializePhaser } from "./Environment.js";
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
      doorAnimationCompleted: false,
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
        function checkStatus(game) {
          if (getSceneStatus(game)) {
            resolve("scene found");
          } else {
            // console.log("Scene not found!");
            setTimeout(() => {
              checkStatus(game);
            }, 500);
          }
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
        if (name === "homeDoor" && !this.doorAnimationCompleted) {
          this.doorAnimationCompleted = true;
          const homeDoor = scene.add.sprite(744, 736, "homeDoor", 0);
          homeDoor.setDepth(10000);
          // console.log(homeDoor);
          //every time i collide with the door, anims will restart
          homeDoor.anims.play("homeDoor-open", false);
          homeDoor.once("animationcomplete", (animation, frame) => {
            console.log(frame.index);
            this.router.push("/profile");
          });
        } else if (name === "bankDoor" && !this.doorAnimationCompleted) {
          this.doorAnimationCompleted = true;
          const bankDoor = scene.add.sprite(264, 192, "bankDoor", 0);
          // console.log(`player = ${MainScene.player.depth}`);
          // console.log(bankDoor.depth);
          bankDoor.anims.play("bankDoor-open", false);
          bankDoor.once("animationcomplete", (animation, frame) => {
            this.router.push("/bank");
          });
        } else if (
          (name === "shoppingCentreDoor1" || name === "shoppingCentreDoor2") &&
          !this.doorAnimationCompleted
        ) {
          let shoppingCentreDoor;
          this.doorAnimationCompleted = true;
          if (name === "shoppingCentreDoor1") {
            shoppingCentreDoor = scene.add.sprite(
              704,
              168,
              "shoppingCentreDoor1",
              0
            );
          } else {
            shoppingCentreDoor = scene.add.sprite(
              800,
              168,
              "shoppingCentreDoor2",
              0
            );
          }
          shoppingCentreDoor.setDepth(MainScene.player.depth - 2);
          shoppingCentreDoor.anims.play("shoppingCentreDoor-open", false);
          shoppingCentreDoor.once("animationcomplete", (animation, frame) => {
            this.router.push("/shoppingcentre");
          });
        } else if (
          (name === "schoolDoor1" || name === "schoolDoor2") &&
          !this.doorAnimationCompleted
        ) {
          this.doorAnimationCompleted = true;
          let schoolDoor;
          if (name === "schoolDoor1") {
            schoolDoor = scene.add.sprite(1632, 232, "schoolDoor", 0);
          } else {
            schoolDoor = scene.add.sprite(1728, 232, "schoolDoor", 0);
          }
          schoolDoor.anims.play("schoolDoor-open", false);
          schoolDoor.once("animationcomplete", (animation, frame) => {
            this.router.push("/school");
          });
        } else if (name === "bakeryDoor" && !this.doorAnimationCompleted) {
          console.log("bakery door");
          this.doorAnimationCompleted = true;
          console.log(this.doorAnimationCompleted);
          const bakeryDoor = scene.add.sprite(1048, 176, "bakeryDoor", 0);
          bakeryDoor.setDepth(10000);

          // bakeryDoor.on("animationstart", (animation, frame) => {
          //   console.log("Animation started:", animation.key);
          // });
          bakeryDoor.on("animationcomplete", (animation, frame) => {
            // console.log("Animation completed:", animation.key);
            this.router.push("/bakery");
          });
          bakeryDoor.anims.play("bakeryDoor-open", false);
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
