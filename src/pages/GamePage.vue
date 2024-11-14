<template>
  <div class="tw-relative">
    <div class="tw-absolute tw-left-[10px] tw-top-[10px]">
      <button
        class="nes-btn is-primary tw-font-press-start tw-text-xs md:tw-text-base xl:tw-text-lg"
        @click="handleToDoClick"
      >
        {{ checklistToggled ? "Hide" : "Show" }} Quest Log
      </button>
    </div>
    <transition
      name="checklist"
      enter-active-class="animate__animated animate__slideInLeft"
      leave-active-class="animate__animated animate__slideOutLeft"
    >
      <div
        v-if="checklistToggled"
        id="checklist"
        class="tw-absolute tw-left-[10px] tw-top-[60px] md:tw-top-[70px] xl:tw-top-[75px] tw-p-2 tw-bg-[#B7E0FF] tw-max-w-[30%] border border-3 border-white tw-opacity-75"
      >
        <ul class="tw-ml-[-10px] tw-mb-0 tw-mr-2 tw-overflow-hidden">
          <li
            class="tw-font-russo-one tw-text-xs md:tw-text-sm lg:tw-text-base 2xl:tw-text-lg"
            v-for="(task, key) in allTasks"
            :key="key"
            :class="checkCompletion(task)"
          >
            {{ task.description }}
          </li>
        </ul>
      </div>
    </transition>
    <div id="phaser-container"></div>
  </div>
</template>
<script>
import { onMounted } from "vue";
import MainScene, { initializePhaser } from "../game/MainScene.js";
import { useRouter } from "vue-router";
import { getAuth } from "firebase/auth";
import { getFirestore, getDoc, doc } from "firebase/firestore";
import { eventEmitter } from "../game/Events.js";
import { globalState } from "../components/globalState.js";

export default {
  mounted() {
    this.router = useRouter();
    this.auth = getAuth();
    // console.log(this.auth.uid);
    this.db = getFirestore();
    this.checklistSetup();
    // this.setSpawnPoint();
    // this.handleGetSelectedOptions(this.db, "users", this.auth.currentUser.uid);
    // console.log(globalState.playerPosition);
    this.gameSetup();
    document.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });
    const navbar = document.querySelector(".navbar");
    if (navbar) {
      this.navbarHeight = navbar.offsetHeight;
    }

    document.getElementById(
      "phaser-container"
    ).style.height = `calc(100vh - ${this.navbarHeight}px)`;

    window.addEventListener("resize", () => {
      if (navbar) {
        this.navbarHeight = navbar.offsetHeight;
      }
      document.getElementById(
        "phaser-container"
      ).style.height = `calc(100vh - ${this.navbarHeight}px)`;
    });

    const resizeObserver = new ResizeObserver(() => {
      if (navbar) {
        this.navbarHeight = navbar.offsetHeight;
      }
      document.getElementById(
        "phaser-container"
      ).style.height = `calc(100vh - ${this.navbarHeight}px)`;
    });
    resizeObserver.observe(navbar);
  },
  data() {
    return {
      navbarHeight: 0,
      game: null,
      router: null,
      doorAnimationCompleted: false,
      auth: null,
      db: null,
      prevRoute: null,
      spawnPoint: null,
      allTasks: {
        additionAndSubtraction: {
          description: "Help the school add the library items",
        },
        multiplicationAndDivision: {
          description: "Help the school multiply the library items",
        },
        fractions: {
          description: "Help the bakery customers with their orders",
        },
        ordering: {
          description: "Help the supermarket manage the queues",
        },
        counting: {
          description: "Help the supermarket count the apples",
        },
        countingMoney: {
          description: "Help the bank customers count their money",
        },
      },
      checklistToggled: false,
    };
  },
  //DESTROY GAME BEFORE ROUTE LEAVE ELSE WEBGL ERROR WILL APPEAR
  beforeRouteLeave() {
    if (this.game && this.game.destroy) {
      this.game.destroy(true); // destroys all phaser dom elements
    }
  },
  methods: {
    checkCompletion(task) {
      return {
        "tw-line-through custom-strikethrough tw-opacity-50": task.completed,
      };
    },
    handleToDoClick() {
      this.checklistToggled = !this.checklistToggled;
    },
    async checklistSetup() {
      const docRef = doc(this.db, "users", this.auth.currentUser.uid);
      try {
        const doc = await getDoc(docRef);
        // console.log(doc);
        if (doc.exists()) {
          // console.log("Document data:", doc.data());
          if (doc.data().completedTasks) {
            const completedTasks = doc.data().completedTasks;
            for (const task in this.allTasks) {
              // console.log(task);
              if (completedTasks.includes(task)) {
                this.allTasks[task].completed = true;
              } else {
                this.allTasks[task].completed = false;
              }
            }
            // console.log(this.completedTasks);
          } else {
            // console.log("No completedTasks data!");
          }
        } else {
          // console.log("No such document!");
        }
      } catch (error) {
        console.error("Error getting document:", error);
      }
    },
    async gameSetup() {
      const docRef = doc(this.db, "users", this.auth.currentUser.uid);
      try {
        const doc = await getDoc(docRef);
        // console.log(doc);
        if (doc.exists()) {
          // console.log("Document data:", doc.data());
          if (doc.data().equippedCat && doc.data().equippedPlayer) {
            this.equippedCat = doc.data().equippedCat;
            const equippedPlayer = doc.data().equippedPlayer;
            // console.log(equippedPlayer);
            // console.log(this.equippedCat);
            this.game = initializePhaser(
              equippedPlayer.name,
              this.equippedCat.name,
              globalState.playerPosition
            );
            // this.game.scene.start("MainScene");
            // console.log(this.game.scene);
            this.getSceneStatus().then(() => {
              // console.log(`scene: ${this.game.scene.getScene("MainScene")}`);
              this.handleDoorCollision();
            });
          } else {
            // console.log("No equippedCats data!");
          }
        } else {
          // console.log("No such document!");
        }
      } catch (error) {
        console.error("Error getting document:", error);
      }
    },
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
      // console.log(`main scene: ${scene}`);

      if (!scene) {
        // console.error("Scene not found!");
        return;
      }
      // console.log(scene);

      eventEmitter.on("playerMovement", (playerObj) => {
        // console.log(`player: ${playerObj.x}, ${playerObj.y}`);
        globalState.setPlayerPosition(playerObj.x, playerObj.y);
      });

      scene.events.on("doorCollision", (doorObj) => {
        // console.log(`door: ${doorObj.name}`);
        const name = doorObj.name;
        if (name === "homeDoor" && !this.doorAnimationCompleted) {
          this.doorAnimationCompleted = true;
          const homeDoor = scene.add.sprite(744, 736, "homeDoor", 0);
          homeDoor.setDepth(10000);
          // console.log(homeDoor);
          //every time i collide with the door, anims will restart
          homeDoor.anims.play("homeDoor-open", false);
          homeDoor.once("animationcomplete", (animation, frame) => {
            // console.log(frame.index);
            this.router.push("/profile");
          });
        } else if (name === "bankDoor" && !this.doorAnimationCompleted) {
          this.doorAnimationCompleted = true;
          const bankDoor = scene.add.sprite(264, 192, "bankDoor", 0);
          // console.log(`player = ${this.game.player.depth}`);
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
          shoppingCentreDoor.setDepth(0);
          shoppingCentreDoor.anims.play("shoppingCentreDoor-open", false);
          shoppingCentreDoor.once("animationcomplete", (animation, frame) => {
            this.router.push("/market");
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
          // console.log("bakery door");
          this.doorAnimationCompleted = true;
          // console.log(this.doorAnimationCompleted);
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
.custom-strikethrough {
  text-decoration-color: white;
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

.nes-btn.is-primary::after {
  position: absolute;
  top: -4px;
  right: -4px;
  bottom: -4px;
  left: -4px;
  content: "";
  box-shadow: inset -4px -4px #006bb3;
}

.nes-btn.is-primary:hover {
  color: #fff;
  text-decoration: none;
  background-color: #108de0;
}

.nes-btn.is-primary:hover::after {
  box-shadow: inset -6px -6px #006bb3;
}

.nes-btn.is-primary:focus {
  box-shadow: 0 0 0 6px rgba(0, 107, 179, 0.3);
}

.nes-btn.is-primary:active:not(.is-disabled)::after {
  box-shadow: inset 4px 4px #006bb3;
}
#checklist {
  border-width: 10px;
  border-color: black;
}

#phaser-container {
  overflow: hidden;
  /* height: calc(100vh - var(--navbar-height)); */
}
</style>
