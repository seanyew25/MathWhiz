<template>
  <div
    class="shop tw-flex tw-flex-col tw-items-center tw-justify-center tw-min-h-screen"
  >
    <!-- Currency Display -->
    <div
      class="nes-container is-rounded is-centered tw-bg-[#FFCFB3] tw-w-fit"
      style="margin-top: 24px"
    >
      <h2 class="tw-text-lg">
        {{ money }} Destress Coins <i class="nes-icon coin"></i>
      </h2>
    </div>

    <div
      class="tw-grid tw-gap-x-2 tw-gap-y-16 tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 xl:tw-grid-cols-4 tw-w-full md:tw-w-[80%] tw-mt-6 tw-mb-6"
    >
      <div v-for="cat in cats" class="tw-m-auto tw-h-[330px]">
        <CardComponent
          :key="cat.name"
          :catObj="cat"
          @buyAction="handleBuyAction"
        />
      </div>
    </div>

    <!-- Insufficient Currency Alert -->
    <dialog class="nes-dialog md:tw-max-w-[50%]" id="dialog-default">
      <form method="dialog">
        <p class="tw-font-press-start tw-text-xs">{{ dialogMessage }}</p>
        <button class="nes-btn is-primary tw-font-press-start tw-text-xs">
          Done
        </button>
      </form>
    </dialog>
  </div>
</template>
<style scoped>
.shop {
  font-family: "Press Start 2P";
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
.nes-dialog {
  padding: 1.5rem 2rem;
  border-width: 4px;
}

.nes-dialog > .backdrop,
.nes-dialog::-webkit-backdrop {
  background-color: rgba(0, 0, 0, 0.3);
}

.nes-dialog > .backdrop,
.nes-dialog::backdrop {
  background-color: rgba(0, 0, 0, 0.3);
}

.nes-dialog > :last-child {
  margin-bottom: 0;
}
</style>
<script>
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  updateDoc,
} from "firebase/firestore";
import CardComponent from "../components/shop/CardComponent.vue";
export default {
  components: {
    CardComponent,
  },
  data() {
    return {
      cats: [
        {
          name: "Tuxedo",
          cuteness: 100,
          fluffiness: 100,
          coolness: 100,
          color: "Siamese",
          imgLocation: "/assets/shopassets/morgana.png",
          description:
            "Morgana's Original Look. This cat will steal your heart.",
          rarity: "Common",
          price: 20,
        },
        {
          name: "Peach",
          cuteness: 95,
          fluffiness: 75,
          coolness: 68,
          color: "Calico",
          imgLocation: "/assets/shopassets/peach.png",
          description: "Soft and sweet, just like a peach.",
          rarity: "Common",
          price: 20,
        },
        {
          name: "Midnight",
          cuteness: 85,
          fluffiness: 97, // Adjusted for Rare rarity
          coolness: 96, // Adjusted for Rare rarity
          color: "Black",
          imgLocation: "/assets/shopassets/midnight.png",
          description: "A sleek shadow that prowls through the night.",
          rarity: "Rare",
          price: 40,
        },
        {
          name: "Luminous",
          cuteness: 85,
          fluffiness: 97, // Adjusted for Rare rarity
          coolness: 98, // Adjusted for Rare rarity
          color: "Silver",
          imgLocation: "/assets/shopassets/luminous.png",
          description: "A glowing beauty that lights up any room.",
          rarity: "Super Rare",
          price: 80,
        },
        {
          name: "Calico",
          cuteness: 88,
          fluffiness: 78, //
          coolness: 65, //
          color: "Calico",
          imgLocation: "/assets/shopassets/calico.png",
          description: "A colorful friend full of personality.",
          rarity: "Common",
          price: 20,
        },
        {
          name: "Cream",
          cuteness: 92,
          fluffiness: 85, // Adjusted for Rare rarity
          coolness: 78, // Adjusted for Rare rarity
          color: "Cream",
          imgLocation: "/assets/shopassets/cream.png",
          description: "Soft, creamy, and always ready to cuddle.",
          rarity: "Rare",
          price: 40,
        },
        {
          name: "Mocha",
          cuteness: 87,
          fluffiness: 88, // Adjusted for Rare rarity
          coolness: 80, // Adjusted for Rare rarity
          color: "Chocolate",
          imgLocation: "/assets/shopassets/mocha.png",
          description: "Warm and cozy, just like your favorite drink.",
          rarity: "Rare",
          price: 40,
        },
        {
          name: "Snowy",
          cuteness: 98,
          fluffiness: 95, // Adjusted for Super Rare rarity
          coolness: 95, // Adjusted for Super Rare rarity
          color: "White",
          imgLocation: "/assets/shopassets/snowy.png",
          description: "As pure and cool as freshly fallen snow.",
          rarity: "Super Rare",
          price: 80,
        },
      ],
      money: 0,
      dialogMessage: "",
      auth: "",
      db: "",
      purchasedCats: [],
    };
  },
  methods: {
    async getCurrencyAndPurchasedCats(db, collectionName, documentId) {
      const docRef = doc(db, collectionName, documentId);
      try {
        const doc = await getDoc(docRef);
        console.log(doc);
        if (doc.exists()) {
          console.log("Document data:", doc.data());
          this.money = doc.data().currency;
          if (doc.data().purchasedCats) {
            this.purchasedCats = doc.data().purchasedCats;
            const purchasedCatNames = new Set(
              this.purchasedCats.map((cat) => cat.name)
            );
            this.cats = this.cats.filter(
              (cat) => !purchasedCatNames.has(cat.name)
            );
          } else {
            console.log("No purchasedCats data!");
          }
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error getting document:", error);
      }
    },
    async updateCurrency(db, collectionName, documentId, currency) {
      const docRef = doc(db, collectionName, documentId);
      try {
        await setDoc(docRef, { currency: currency }, { merge: true });
        console.log("Currency successfully written!");
      } catch (error) {
        console.error("Error writing document: ", error);
      }
    },
    async updateCats(db, collectionName, documentId, purchasedCats) {
      const docRef = doc(db, collectionName, documentId);
      try {
        await setDoc(docRef, { purchasedCats: purchasedCats }, { merge: true });
        console.log("purchasedCats successfully written!");
      } catch (error) {
        console.error("Error writing document: ", error);
      }
    },
    async handleBuyAction(catObj) {
      
    console.log(this.money)
      console.log(catObj.price);
      if (this.money >= catObj.price) {
        this.money -= catObj.price;
        this.purchasedCats.push(catObj);
        console.log(this.purchasedCats);
        this.cats = this.cats.filter((cat) => cat.name !== catObj.name);
        this.updateCats(
          this.db,
          "users",
          this.auth.currentUser.uid,
          this.purchasedCats
        );
        this.dialogMessage = `You have successfully bought ${catObj.name}!`;
        document.getElementById("dialog-default").showModal();
      } else {
        this.dialogMessage = `
        Morgana is too stressed to grow this coat of fur.
        Play more games to earn more Destress Coins!`;
        document.getElementById("dialog-default").showModal();
      }
    },
  },
  watch: {
    money() {
      if (this.money !== "") {
        this.updateCurrency(
          this.db,
          "users",
          this.auth.currentUser.uid,
          this.money
        );
      }
    },
  },
  mounted() {
    const auth = getAuth();
    console.log(`uid=${auth.currentUser.uid}`);
    const db = getFirestore();
    this.db = db;
    this.auth = auth;
    console.log(db);
    this.getCurrencyAndPurchasedCats(db, "users", auth.currentUser.uid);
  },
};
</script>
