<template>
  <div
    class="tw-flex tw-flex-col tw-items-center tw-min-h-[calc(100vh-110.31px)]"
  >
    <div
      class="nes-container tw-bg-[#FFCFB3] tw-mb-2 tw-mt-6 tw-mx-auto tw-w-fit tw-text-center"
    >
      <span class="tw-font-press-start tw-text-2xl">
        Welcome to the Character Changing Room!</span
      >
      <br />
      <br />
      <span class="tw-font-press-start tw-text-md"
        >What character would you like to be today?</span
      >
    </div>
    <div
      id="carouselExample"
      class="carousel slide tw-h-fit tw-w-[100vw] md:tw-w-[75vh] lg:tw-w-[50vw] tw-inline-block tw-mt-6"
    >
      <div class="carousel-inner">
        <div
          v-for="(character, index) in characters"
          :key="index"
          :class="index === 0 ? 'carousel-item active' : 'carousel-item'"
        >
          <div class="tw-flex tw-justify-center">
            <div
              class="tw-w-full sm:tw-w-[75%] xl:tw-w-[50%] tw-h-fit nes-container is-rounded tw-bg-[#FFF5CD] tw-flex tw-justify-center tw-flex-col tw-relative"
              style="padding: 0; border-width: 3px"
            >
              <div class="tw-flex tw-justify-center tw-my-4">
                <img
                  :src="character.imgLocation"
                  alt="Cropped Image"
                  class="tw-w-[30%]"
                />
              </div>

              <div
                class="border-top border-bottom border-dark border-3 tw-bg-[#E78F81] tw-mx-[-3px] tw-relative tw-px-4 tw-pt-2"
              >
                <h5 class="tw-font-russo-one">
                  {{ character.name }}
                </h5>
                <p class="tw-font-mono">
                  {{ character.description }}
                </p>
                <!-- <a href="#" class="btn btn-primary">Go somewhere</a> -->
              </div>
              <div class="tw-pb-[-100px]">
                <button
                  type="button"
                  @click="handleEquipAction(character)"
                  class="nes-btn is-success tw-font-press-start tw-w-[102%] tw-relative tw-left-[-8px] tw-top-[-2px]"
                >
                  {{
                    character.name === equippedPlayer.name
                      ? "Equipped"
                      : "Equip"
                  }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        class="carousel-control-prev carousel-cursor"
        type="button"
        data-bs-target="#carouselExample"
        data-bs-slide="prev"
      >
        <!-- <span class="carousel-control-prev-icon" aria-hidden="true"></span> -->
        <img
          src="/assets/profileassets/carousel-left-arrow.png"
          class="tw-h-20"
        />
        <span class="visually-hidden">Previous</span>
      </button>
      <button
        class="carousel-control-next carousel-cursor"
        type="button"
        data-bs-target="#carouselExample"
        data-bs-slide="next"
      >
        <img
          src="/assets/profileassets/carousel-right-arrow.png"
          class="tw-h-20"
        />
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  </div>
</template>
<script>
import { getAuth } from "firebase/auth";
import { getFirestore, getDoc, doc, setDoc } from "firebase/firestore";
import { globalState } from "../../components/globalState";

export default {
  data() {
    return {
      characters: [
        {
          name: "Hoodie Boy",
          imgLocation: "/assets/profileassets/character/Hoodie Boy.png",
          description:
            "A casual cool kid in his comfortable hoodie, ready for any relaxed adventure",
        },

        {
          name: "Beanie Boy",
          imgLocation: "/assets/profileassets/character/Beanie Boy.png",
          description:
            "A laid-back youth sporting his favorite knit beanie, ready for any casual adventure",
        },
        {
          name: "Beanie Girl",
          imgLocation: "/assets/profileassets/character/Beanie Girl.png",
          description:
            "A trendy girl with a cozy beanie, bringing street style to every scene",
        },
        {
          name: "Bespectacled Boy 2",
          imgLocation: "/assets/profileassets/character/Bespectacled Boy 2.png",
          description:
            "A clever young scholar with glasses, bringing a different perspective to challenges",
        },
        {
          name: "Bespectacled Boy",
          imgLocation: "/assets/profileassets/character/Bespectacled Boy.png",
          description:
            "An intelligent youngster with glasses, always ready to solve puzzles",
        },
        {
          name: "Boy 2",
          imgLocation: "/assets/profileassets/character/Boy 2.png",
          description:
            "A cheerful young lad with a bright personality and adventurous spirit",
        },
        {
          name: "Boy Suit",
          imgLocation: "/assets/profileassets/character/Boy Suit.png",
          description:
            "A dapper young gentleman in formal attire, bringing class to any occasion",
        },
        {
          name: "Boy",
          imgLocation: "/assets/profileassets/character/Boy.png",
          description:
            "A typical young boy with boundless energy and curiosity",
        },
        {
          name: "Cap Boy",
          imgLocation: "/assets/profileassets/character/Cap Boy.png",
          description:
            "A sporty kid wearing his favorite baseball cap, always ready for action",
        },
        {
          name: "Coloured Hair Boy",
          imgLocation: "/assets/profileassets/character/Coloured Hair Boy.png",
          description:
            "A bold youngster with vibrantly dyed hair, expressing his unique personality",
        },
        {
          name: "Dress Girl",
          imgLocation: "/assets/profileassets/character/Dress Girl.png",
          description:
            "A graceful young lady in a pretty dress, bringing elegance to every scene",
        },
        {
          name: "Girl",
          imgLocation: "/assets/profileassets/character/Girl.png",
          description:
            "A cheerful young girl with a bright smile and positive attitude",
        },
        {
          name: "Goatee Boy",
          imgLocation: "/assets/profileassets/character/Goatee Boy.png",
          description:
            "A teenage boy sporting a goatee, trying to look more mature than his years",
        },
        {
          name: "Shirt Boy",
          imgLocation: "/assets/profileassets/character/Shirt Boy.png",
          description:
            "A neat young man in a simple shirt, representing everyday charm",
        },
        {
          name: "Spiky Boy",
          imgLocation: "/assets/profileassets/character/Spiky Boy.png",
          description:
            "A energetic boy with spiky hair, bringing attitude and style wherever he goes",
        },
        {
          name: "Suit Girl 2",
          imgLocation: "/assets/profileassets/character/Suit Girl 2.png",
          description:
            "A professional young lady in formal attire, bringing sophistication to any situation",
        },
        {
          name: "Suit Girl",
          imgLocation: "/assets/profileassets/character/Suit Girl.png",
          description:
            "An elegant girl in a business suit, showing leadership and confidence",
        },
        {
          name: "Twintails Girl",
          imgLocation: "/assets/profileassets/character/Twintails Girl.png",
          description:
            "A playful girl with cute twintail hairstyle, full of youthful energy",
        },
      ],
      equippedPlayer: {},
    };
  },
  methods: {
    async getEquippedPlayer(db, collectionName, documentId) {
      const docRef = doc(db, collectionName, documentId);
      try {
        const doc = await getDoc(docRef);
        // console.log(doc);
        if (doc.exists()) {
          // console.log("Document data:", doc.data());
          if (doc.data().equippedPlayer) {
            this.equippedPlayer = doc.data().equippedPlayer;
          } else {
            // console.log("No equippedPlayer data!");
          }
        } else {
          // console.log("No such document!");
        }
      } catch (error) {
        console.error("Error getting document:", error);
      }
    },
    async setEquippedPlayer(db, collectionName, documentId, playerObj) {
      const docRef = doc(db, collectionName, documentId);
      // console.log(playerObj);
      this.equippedPlayer = playerObj;
      globalState.playerImgLink = playerObj.imgLocation;
      try {
        const doc = await setDoc(
          docRef,
          {
            equippedPlayer: playerObj,
          },
          { merge: true }
        );
        // console.log(doc);
      } catch (error) {
        console.error("Error setting document:", error);
      }
    },
    handleEquipAction(playerObj) {
      // console.log(playerObj);
      // console.log(`equippedPlayer=${this.equippedPlayer}`);
      // console.log(typeof this.equippedPlayer);
      if (playerObj.name !== this.equippedPlayer.name) {
        // console.log("Proceeding to change equip");
        this.equippedPlayer = playerObj;
        this.setEquippedPlayer(
          this.db,
          "users",
          this.auth.currentUser.uid,
          playerObj
        );
      }
    },
  },
  mounted() {
    const auth = getAuth();
    // console.log(`uid=${auth.currentUser.uid}`);
    const db = getFirestore();
    this.db = db;
    this.auth = auth;
    // console.log(db);
    this.getEquippedPlayer(db, "users", auth.currentUser.uid);
    // this.getPurchasedCatsAndequippedPlayer(db, "users", auth.currentUser.uid);
  },
};
</script>
<style scoped>
.carousel-cursor {
  cursor: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC)
      14 0,
    pointer;
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
  margin: 4px 4px -2px 4px;
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
.nes-btn.is-success {
  /* color: #fff; */
  background-color: #92cc41;
  color: #36454f;
}
.nes-container.is-rounded {
  border-image-slice: 3;
  border-image-width: 3;
  border-image-repeat: stretch;
  border-image-source: url('data:image/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8" ?><svg version="1.1" width="8" height="8" xmlns="http://www.w3.org/2000/svg"><path d="M3 1 h1 v1 h-1 z M4 1 h1 v1 h-1 z M2 2 h1 v1 h-1 z M5 2 h1 v1 h-1 z M1 3 h1 v1 h-1 z M6 3 h1 v1 h-1 z M1 4 h1 v1 h-1 z M6 4 h1 v1 h-1 z M2 5 h1 v1 h-1 z M5 5 h1 v1 h-1 z M3 6 h1 v1 h-1 z M4 6 h1 v1 h-1 z" fill="rgb(33,37,41)" /></svg>');
  border-image-outset: 2;
  /* padding: 1rem 1.5rem; */
  margin: 4px;
}
</style>
