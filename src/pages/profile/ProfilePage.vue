<template>
  <div id="parent" class="tw-h-[95vh]">
    <div
      class="nes-container tw-bg-[#FFCFB3] tw-mb-2 tw-mt-6 tw-mx-auto tw-w-fit tw-text-center"
    >
      <span class="tw-font-press-start tw-text-2xl"> Welcome home!</span>
      <br />
      <br />
      <span class="tw-font-press-start tw-text-md"
        >What would you like to do today?</span
      >
    </div>
    <div
      class="tw-grid tw-mx-auto tw-max-w-[75vh] tw-mt-6 tw-gap-y-8 tw-gap-x-8 tw-grid-cols-1 md:tw-grid-cols-2"
    >
      <ShadowBox
        @click="handleNaviagteCharacter"
        class="tw-justify-self-center tw-text-center"
      >
        <span class="tw-font-press-start tw-text-center">
          Dress yourself up!
        </span></ShadowBox
      >
      <ShadowBox
        @click="handleNavigateCat"
        class="tw-justify-self-center tw-text-center"
      >
        <span class="tw-font-press-start tw-text-center">
          Dress your cat up!
        </span></ShadowBox
      >
    </div>
  </div>
</template>
<style scoped>
#parent {
  overflow: hidden;
}
</style>
<script>
import ShadowBox from "../../components/profile/ShadowBox.vue";
import { useRouter } from "vue-router";

export default {
  components: {
    ShadowBox,
  },
  data() {
    return {
      router: "",
    };
  },
  methods: {
    handleNavigateCat() {
      this.router.push("/catchangingroom");
    },

    handleNaviagteCharacter() {
      this.router.push("/characterchangingroom");
    },
  },
  mounted() {
    this.router = useRouter();
  },
};
</script>
