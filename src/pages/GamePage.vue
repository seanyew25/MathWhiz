<template>
  <div class="tw-relative">
    <div
      id="checklist"
      class="tw-absolute tw-left-[10px] tw-top-[10px] tw-p-2 tw-bg-[#B7E0FF] tw-max-w-[30%] border border-3 border-white"
    >
      <span
        class="tw-font-press-start tw-text-xs tw-underline tw-cursor-pointer"
        @click="handleToDoClick"
      >
        To Do List
      </span>
      <transition name="checklist-expand">
        <ul
          v-if="checklistToggled"
          class="nes-list is-disc tw-mb-0 tw-overflow-hidden"
        >
          <transition-group name="list" tag="div">
            <li
              class="tw-font-press-start tw-text-[0.5rem] animate__animated animate__lightSpeedInLeft"
              v-for="(task, key) in allTasks"
              :key="key"
              :class="checkCompletion"
            >
              {{ task.description }}
            </li>
          </transition-group>
        </ul>
      </transition>
    </div>
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
    this.db = getFirestore();
    // this.setSpawnPoint();
    // this.handleGetSelectedOptions(this.db, "users", this.auth.currentUser.uid);
    console.log(globalState.playerPosition);
    this.gameSetup();
    document.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });
  },
  data() {
    return {
      game: null,
      router: null,
      doorAnimationCompleted: false,
      auth: null,
      db: null,
      prevRoute: null,
      spawnPoint: null,
      allTasks: {
        ordering: {
          description: "Help the supermarket count the apples",
        },
        additionAndSubtraction: {
          description: "Help the school add the library items",
        },
        multiplicationAndDivision: {
          description: "Help the school multiply the library items",
        },
        fractions: {
          description: "Help the bakery customers with their orders",
        },
        counting: {
          description: "Help the supermarket manage the queues",
        },
        orderingItems: {
          description: "Help the supermarket order the apples",
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
        "tw-line-through": task.completed === true,
      };
    },
    handleToDoClick() {
      this.checklistToggled = !this.checklistToggled;
    },
    async checklistSetup() {
      const docRef = doc(this.db, "users", this.auth.currentUser.uid);
      try {
        const doc = await getDoc(docRef);
        console.log(doc);
        if (doc.exists()) {
          console.log("Document data:", doc.data());
          if (doc.data().completedTasks) {
            const completedTasks = doc.data().completedTasks;
            for (task in this.allTasks) {
              if (completedTasks.includes(task)) {
                this.allTasks[task].completed = true;
              } else {
                this.allTasks[task].completed = false;
              }
            }
            console.log(this.completedTasks);
          } else {
            console.log("No completedTasks data!");
          }
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error getting document:", error);
      }
    },
    async gameSetup() {
      const docRef = doc(this.db, "users", this.auth.currentUser.uid);
      try {
        const doc = await getDoc(docRef);
        console.log(doc);
        if (doc.exists()) {
          console.log("Document data:", doc.data());
          if (doc.data().equippedCat) {
            this.equippedCat = doc.data().equippedCat;
            console.log(this.equippedCat);
            this.game = initializePhaser(
              this.equippedCat.name,
              globalState.playerPosition
            );
            // this.game.scene.start("MainScene");
            console.log(this.game.scene);
            this.getSceneStatus().then(() => {
              console.log(`scene: ${this.game.scene.getScene("MainScene")}`);
              this.handleDoorCollision();
            });
          } else {
            console.log("No equippedCats data!");
          }
        } else {
          console.log("No such document!");
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
      console.log(`main scene: ${scene}`);

      if (!scene) {
        console.error("Scene not found!");
        return;
      }
      console.log(scene);

      eventEmitter.on("playerMovement", (playerObj) => {
        // console.log(`player: ${playerObj.x}, ${playerObj.y}`);
        globalState.setPlayerPosition(playerObj.x, playerObj.y);
      });

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
/* Smooth transition for checklist expansion */
#checklist {
  border-width: 10px;
  border-color: black;
  border-radius: 0.5rem;
}
.checklist-expand-enter-active,
.checklist-expand-leave-active {
  transition: max-height 0.4s ease-in-out, opacity 0.4s ease-in-out;
}

.checklist-expand-enter-from,
.checklist-expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.checklist-expand-enter-to,
.checklist-expand-leave-from {
  max-height: 500px; /* Adjust based on content height */
  opacity: 1;
}

/* Smooth transition for list items */
.list-enter-active,
.list-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.list-enter-from {
  transform: translateX(-20px) scale(0.9);
  opacity: 0;
}

.list-enter-to {
  transform: translateX(0) scale(1);
  opacity: 1;
}

.list-leave-from {
  transform: translateX(0) scale(1);
  opacity: 1;
}

.list-leave-to {
  transform: translateX(-20px) scale(0.9);
  opacity: 0;
}
#phaser-container {
  overflow: hidden;
  height: calc(100vh - 56px);
}
</style>
