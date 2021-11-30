<template>
  <div class="container">
    <h1>Masonry image grid - Paul Weimann</h1>
    <n-select
      :value="amountOfItems"
      :options="selectOptions"
      :disabled="!imagesLoaded"
      @update:value="updateAmountOfImages"
    />
    <masonry-grid-layout :items="images" :loadedItems="counterLoadedImages">
      <template v-slot:default="slotProps">
        <Card
          :img="slotProps.item"
          @loaded-image="increaseCounterLoadedImages"
        />
      </template>
    </masonry-grid-layout>
  </div>
</template>
<script>
import Card from "./components/Card.vue";
import MasonryGridLayout from "./layouts/MasonryGridLayout.vue";
import { NSelect } from "naive-ui";

const INITIAL_PAGE = 1;
const VERTICAL_SCROLL_OFFSET = 200;

export default {
  name: "App",
  components: {
    Card,
    NSelect,
    MasonryGridLayout,
  },
  data() {
    return {
      images: [],
      counterLoadedImages: 0,
      appendImagesLock: false,
      amountOfItems: 3, //TODO set to 20
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

.n-select {
  max-width: 200px;
  margin: 0 auto;
  margin-bottom: 20px;
}

a {
  color: #fff;
  text-decoration: none;
}

a:hover {
  transition: all 0.3s ease-in-out;
  text-decoration: underline;
  color: #1fb5c5;
}
</style>
