<template>
  <div id="parent" class="tw-h-[95vh]">
    <div class="tw-flex tw-justify-center tw-items-center tw-flex-col">
      <h3 class="tw-font-press-start tw-p-6 tw-mt-10">Welcome home!</h3>
      <h3 class="tw-font-press-start tw-mb-14 tw-px-6 tw-text-center">
        What would you like to do?
      </h3>
      <div
        class="tw-grid tw-gap-y-8 tw-gap-x-8 tw-grid-cols-1 md:tw-grid-cols-2"
      >
        <ShadowBox class="tw-justify-self-center">
          <span class="tw-font-press-start tw-text-center">
            Dress yourself up!
          </span></ShadowBox
        >
        <ShadowBox @click="handleNavigateCat">
          <span class="tw-font-press-start tw-text-center">
            Dress your cat up!
          </span></ShadowBox
        >
      </div>
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
  },
  mounted() {
    this.router = useRouter();
  },
};
</script>
