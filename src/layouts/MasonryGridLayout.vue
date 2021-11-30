<template>
  <div>
    <div class="grid">
      <div class="grid-sizer"></div>
      <div class="grid-gutter"></div>
      <transition-group name="grid-item">
        <div
          class="grid-item grid-item-width item-unloaded"
          v-for="item in items"
          :id="item.id"
          :key="item.id"
        >
          <slot :item="item"></slot>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import Masonry from "masonry-layout";

const GRID = ".grid";
const GRID_ITEM = ".grid-item";
const UNLOADED_GRID_ITEMS = ".grid-item.item-unloaded";
const CLASS_IMAGES_UNLOADED = "item-unloaded";

export default {
  name: "MasonryGridLayout",
  props: {
    items: {
      type: Array,
      required: true,
    },
    loadedItems: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      msnry: Object,
    };
  },
  watch: {
    loadedItems(newValue) {
      if (this.items.length === newValue) {
        this.msnry.layout(); //unstamps removed items
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
  mounted() {
    let grid = document.querySelector(GRID);

    this.msnry = new Masonry(grid, {
      itemSelector: "none",
      columnWidth: ".grid-sizer",
      gutter: ".grid-gutter",
      percentPosition: true,
      stagger: 30,
      transitionDuration: "1.5s",
      visibleStyle: { opacity: 1 },
      hiddenStyle: { opacity: 0 },
    });
  },
};
</script>

<style>
.item-unloaded {
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

.grid-item-enter-active,
.grid-item-leave-active {
  transition: all 1.5s ease;
}
.grid-item-enter-from,
.grid-item-leave-to {
  opacity: 0;
}
</style>
