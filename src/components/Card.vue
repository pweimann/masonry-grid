<template>
  <div
    class="card-container"
    :class="{ 'flip-vertical': pressed }"
    @click="pressed = !pressed"
  >
    <div class="back">
      <span>Author: {{ img.author }}</span>
      <span>Url: </span><a :href="img.url">{{ img.url }}</a>
    </div>
    <img class="front" ref="img" :src="img.download_url" />
  </div>
</template>

<script>
export default {
  name: "Card",
  props: {
    img: Object,
  },
  data() {
    return {
      pressed: false,
    };
  },
  mounted() {
    this.$refs.img.addEventListener("load", () => {
      this.$emit("loaded-image");
    });
  },
};
</script>

<style scoped>
.card-container {
  position: relative;
  transition: transform 1.5s;
  transform-style: preserve-3d;
}

.card-container.flip-vertical {
  transform: rotateY(180deg);
}

.front {
  position: relative;
  backface-visibility: hidden;
  max-width: 100%;
}

.back {
  position: absolute;
  top: 0;
  left: 0;
  transform: rotateY(180deg);
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #fff;
  background-color: #425563;
  overflow: hidden;
  padding: 10px;
}

img {
  display: block;
  max-width: 100%;
}
</style>
