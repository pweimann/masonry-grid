<template>
  <div class="container">
    <h1>Masonry image grid - Paul Weimann</h1>

    <div class="grid images-unloaded">
      <div class="grid-sizer"></div>
      <div class="grid-gutter"></div>
      <Card
        v-for="item in images"
        :key="item.id"
        :img="item"
        @loaded-image="increaseCounterLoadedImages"
      />
    </div>
  </div>
</template>
<script>
import Masonry from "masonry-layout";
import Card from "./components/Card.vue";

export default {
  name: "App",
  components: {
    Card,
  },
  data() {
    return {
      images: [],
      msnry: null,
      counterLoadedImages: 0,
    };
  },
  computed: {
    imagesLoaded() {
      return this.counterLoadedImages === this.images.length;
    },
  },
  watch: {
    imagesLoaded(newValue) {
      if (newValue) {
        const grid = document.querySelector(".grid");
        grid.classList.remove("images-unloaded");
        this.msnry.options.itemSelector = ".grid-item";
        let items = grid.querySelectorAll(".grid-item");
        this.msnry.appended(items);
      }
    },
  },
  methods: {
    async fetchImages(page) {
      const res = await fetch(
        `https://picsum.photos/v2/list?page=${page}&limit=30`
      );
      let data = await res.json();
      console.log("Fetched Images");
      return data;
    },
    increaseCounterLoadedImages() {
      this.counterLoadedImages++;
      console.log("counter: " + this.counterLoadedImages);
    },
  },
  async created() {
    //fetch initial pictures
    const data = await this.fetchImages(0);
    this.images.push(...data);
  },
  mounted() {
    let grid = document.querySelector(".grid");

    this.msnry = new Masonry(grid, {
      itemSelector: "none",
      columnWidth: ".grid-sizer",
      gutter: ".grid-gutter",
      percentPosition: true,
      stagger: 30,
      visibleStyle: { opacity: 1 },
      hiddenStyle: { opacity: 0 },
    });
  },
};
</script>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.container {
  margin: 0 auto;
  max-width: 1200px;
}

.grid.images-unloaded {
  opacity: 0;
}

.grid-item,
.grid-sizer {
  width: 32%;
}

.grid-gutter {
  width: 2%;
}

.grid-item {
  margin-bottom: 20px;
}

.grid-item-width {
  width: 32%;
}
</style>
