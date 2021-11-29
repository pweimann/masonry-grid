<template>
  <div class="grid-item grid-item-width">
    <img class="" ref="img" :src="img.download_url" />
  </div>
</template>

<script>
export default {
  name: "Card",
  props: {
    img: Object,
  },
  data() {
    return {};
  },
  mounted() {
    this.$refs.img.addEventListener("load", () => {
      this.$emit("loaded-image");
    });
  },
};
</script>

<style scoped>
img {
  display: block;
  max-width: 100%;
}
</style>
