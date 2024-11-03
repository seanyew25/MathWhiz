<template>
  <div class="tw-h-full tw-p-6 tw-bg-[#B7E0FF]">
    <div
      class="tw-grid tw-gap-x-2 tw-gap-y-4 md:tw-gap-y-8 tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 xl:tw-grid-cols-4 tw-w-full md:tw-w-[80%] tw-mx-auto"
    >
      <CardComponent
        class="tw-justify-self-center"
        v-for="cat in cats"
        :key="cat.name"
        :catObj="cat"
      />
    </div>
  </div>
</template>
<script>
import CardComponent from "../components/shop/CardComponent.vue";
export default {
  components: {
    CardComponent,
  },
  data() {
    return {
      cats: [
        {
          name: "Morgana",
          cuteness: 92,
          fluffiness: 85,
          coolness: 90,
          color: "Siamese",
          imgLocation: "/assets/mainassets/morgana.png",
          description: "The Original. This cat will steal your heart.",
          rarity: "Rare",
        },
        {
          name: "Calico",
          cuteness: 88,
          fluffiness: 75,
          coolness: 78,
          color: "Calico",
          imgLocation: "/assets/mainassets/morgana.png",
          description: "Cute, cuddly and colourful",
          rarity: "Common",
        },
        {
          name: "Midnight",
          cuteness: 80,
          fluffiness: 90,
          coolness: 95,
          color: "Black",
          imgLocation: "/assets/mainassets/morgana.png",
          description: "Dark and sleek",
          rarity: "Ultra Rare",
        },
      ],
    };
  },
};
</script>
