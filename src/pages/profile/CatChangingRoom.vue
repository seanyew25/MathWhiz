<template>
  <div class="tw-flex-1 tw-bg-[#B7E0FF] tw-min-h-screen tw-pb-10">
    <br />
    <div
      class="nes-container tw-bg-[#FFCFB3] tw-mb-6 tw-mx-auto tw-w-fit tw-text-center"
    >
      <span class="tw-font-press-start tw-text-2xl">
        Welcome to the Cat Changing Room!</span
      >
      <br />
      <br />
      <span class="tw-font-press-start tw-text-md"
        >What fur coat should Morgana wear today?</span
      >
    </div>
    <div
      class="tw-grid tw-gap-x-2 tw-gap-y-16 tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 xl:tw-grid-cols-4 tw-w-full md:tw-w-[80%] tw-m-auto tw-mb-10"
    >
      <div v-for="cat in cats" class="tw-m-auto">
        <CardComponent
          :key="cat.name"
          :catObj="cat"
          :equippedCat="equippedCat"
          @equipAction="handleEquipAction"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import CardComponent from "../../components/profile/CardComponent.vue";
export default {
  // Reactive Data
  components: {
    CardComponent,
  },
  data() {
    return {
      cats: "",
      equippedCat: {},
    };
  },

  // Computed Properties
  computed: {
    exampleComputed() {
      return this.exampleData.toUpperCase();
    },
  },

  // Methods
  methods: {
    async getPurchasedCatsAndEquippedCat(db, collectionName, documentId) {
      const docRef = doc(db, collectionName, documentId);
      try {
        const doc = await getDoc(docRef);
        // console.log(doc);
        if (doc.exists()) {
          // console.log("Document data:", doc.data());
          if (doc.data().purchasedCats) {
            this.cats = doc.data().purchasedCats;
          } else {
            // console.log("No purchasedCats data!");
          }
          if (doc.data().equippedCat) {
            this.equippedCat = doc.data().equippedCat;
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
    async setEquippedCat(db, collectionName, documentId, catObj) {
      const docRef = doc(db, collectionName, documentId);
      // console.log(catObj);
      this.equippedCat = catObj;
      try {
        const doc = await setDoc(
          docRef,
          {
            equippedCat: catObj,
          },
          { merge: true }
        );
        // console.log(doc);
      } catch (error) {
        console.error("Error setting document:", error);
      }
    },
    handleEquipAction(catObj) {
      // console.log(catObj);
      // console.log(`equippedCat=${this.equippedCat}`);
      // console.log(typeof this.equippedCat);
      if (catObj.name !== this.equippedCat.name) {
        // console.log("Proceeding to change equip");
        this.equippedCat = catObj;
        this.setEquippedCat(
          this.db,
          "users",
          this.auth.currentUser.uid,
          catObj
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
    this.getPurchasedCatsAndEquippedCat(db, "users", auth.currentUser.uid);
  },
};
</script>
