<template>
  <div class="tw-h-full tw-p-6 tw-gap-4 tw-bg-[#B7E0FF]">
    <div class="tw-grid tw-grid-cols-3 tw-w-[80%] tw-margin-auto">
      <CardComponent
        imgLocation="/assets/mainassets/morgana.png"
        furName="Morgana"
        furDesc="The Original. 
        This cat will steal your heart."
      />
      <CardComponent
        imgLocation="/assets/mainassets/morgana.png"
        furName="Calico"
        furDesc="A patchwork of warmth and mischief"
      />
      <CardComponent
        imgLocation="/assets/mainassets/morgana.png"
        furName="Midnight"
        furDesc="Sleek and shadowy"
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
};
</script>
