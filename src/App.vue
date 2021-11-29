<template>
  <div class="container">
    <h1>Masonry image grid - Paul Weimann</h1>

    <div class="grid">
      <div class="grid-sizer"></div>
      <div class="grid-gutter"></div>
      <div
        class="grid-item grid-item-width images-unloaded"
        v-for="item in images"
        :key="item.id"
      >
        <Card :img="item" @loaded-image="increaseCounterLoadedImages" />
      </div>
    </div>
  </div>
</template>
<script>
import Masonry from "masonry-layout";
import Card from "./components/Card.vue";

const INITIAL_PAGE = 1;
const GRID = ".grid";
const GRID_ITEM = ".grid-item";
const UNLOADED_GRID_ITEMS = ".grid-item.images-unloaded";
const VERTICAL_SCROLL_OFFSET = 200;
const CLASS_IMAGES_UNLOADED = "images-unloaded";

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
      appendImagesLock: false,
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
        const grid = document.querySelector(GRID);
        const newGridItems = grid.querySelectorAll(UNLOADED_GRID_ITEMS);
        for (let item of newGridItems) {
          item.classList.remove(CLASS_IMAGES_UNLOADED);
        }
        this.msnry.options.itemSelector = GRID_ITEM;
        this.msnry.appended(newGridItems);
      }
    },
  },
  methods: {
    async fetchImages(nextPage) {
      //nextPage is not index based
      const res = await fetch(
        `https://picsum.photos/v2/list?nextPage=${nextPage}&limit=9`
      );
      let data = await res.json();
      console.log("Fetched Images");
      this.images.push(...data);
      return data;
    },
    increaseCounterLoadedImages() {
      this.counterLoadedImages++;
      console.log("counter: " + this.counterLoadedImages);
    },
    async appendImages() {
      if (this.appendImagesLock === false && this.imagesLoaded) {
        this.appendImagesLock = true;
        const nextPage = parseInt(this.images.length / 30, 10) + 1;
        console.log("appends images - next Page: " + nextPage);
        await this.fetchImages(nextPage);
        this.appendImagesLock = false;
      }
    },
    initScrollListener() {
      window.onscroll = () => {
        let bottomOfWindow =
          document.documentElement.scrollTop + window.innerHeight >=
          document.documentElement.offsetHeight - VERTICAL_SCROLL_OFFSET;

        if (bottomOfWindow) {
          this.appendImages();
        }
      };
    },
  },
  created() {
    //fetch initial pictures
    this.fetchImages(INITIAL_PAGE);
  },
  mounted() {
    this.initScrollListener();
    let grid = document.querySelector(GRID);

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

.images-unloaded {
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
