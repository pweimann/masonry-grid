<template>
  <div class="container">
    <h1>Masonry image grid - Paul Weimann</h1>
    <n-select
      :value="amountOfItems"
      :options="selectOptions"
      :disabled="!imagesLoaded"
      @update:value="updateAmountOfImages"
    />
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
import { NSelect } from "naive-ui";

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
    NSelect,
  },
  data() {
    return {
      images: [],
      msnry: null,
      counterLoadedImages: 0,
      appendImagesLock: false,
      amountOfItems: 20,
      selectOptions: [
        {
          label: "20 Bilder",
          value: 20,
        },
        {
          label: "30 Bilder",
          value: 30,
        },
        {
          label: "50 Bilder",
          value: 50,
        },
      ],
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
      const url = `https://picsum.photos/v2/list?page=${nextPage}&limit=${this.amountOfItems}`;
      const res = await fetch(url);
      let data = await res.json();
      console.log("Fetched Images: " + url);
      return data;
    },
    increaseCounterLoadedImages() {
      this.counterLoadedImages++;
      console.log("counter: " + this.counterLoadedImages);
    },
    async appendImages(amount) {
      if (amount < 1) {
        return;
      }
      let addedImages = 0;
      let p = this.getNextPage();
      while (addedImages < amount) {
        const data = await this.fetchImages(p);
        const calcRemainingImages = amount - addedImages;
        if (data.length > calcRemainingImages) {
          //requested more images than necessary -> reduce
          this.images.push(...data.slice(0, calcRemainingImages));
          addedImages += calcRemainingImages;
        } else {
          this.images.push(...data);
          addedImages += data.length;
        }
        p++;
      }
    },
    async appendNextPage() {
      if (this.appendImagesLock === false && this.imagesLoaded) {
        this.appendImagesLock = true;
        const isDivisible =
          parseInt(this.images.length / this.amountOfItems, 10) ===
          this.images.length / this.amountOfItems;
        if (isDivisible) {
          const data = await this.fetchImages(this.getNextPage());
          this.images.push(...data);
        } else {
          //amountOfItems was reduced -> request only remaining images of actual page
          const remaining =
            this.amountOfItems - (this.images.length % this.amountOfItems);
          const data = await this.fetchImages(this.getNextPage());
          //get last n number of data
          this.images.push(...data.reverse().slice(0, remaining));
        }
        this.appendImagesLock = false;
      }
    },
    getNextPage() {
      const nextPage =
        parseInt(this.images.length / this.amountOfItems, 10) + 1;
      return nextPage;
    },
    async updateAmountOfImages(newValue) {
      if (this.amountOfItems < newValue) {
        await this.appendImages(newValue - this.amountOfItems);
      }
      this.amountOfItems = newValue;
    },
    initScrollListener() {
      window.onscroll = () => {
        let bottomOfWindow =
          document.documentElement.scrollTop + window.innerHeight >=
          document.documentElement.offsetHeight - VERTICAL_SCROLL_OFFSET;

        if (bottomOfWindow) {
          this.appendNextPage();
        }
      };
    },
  },
  async created() {
    //fetch initial pictures
    const data = await this.fetchImages(INITIAL_PAGE);
    this.images.push(...data);
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

.n-select {
  max-width: 200px;
  margin: 0 auto;
  margin-bottom: 20px;
}
</style>
