<template>
  <div class="carousel">
    <carousel
      v-if="items.length > 1"
      class="carousel_wrapper btn_offset_small hidden"
      :per-page="1"
      :autoplay="false"
      :navigationEnabled="true"
      :navigation-enabled="true"
      :paginationEnabled="false"
      :perPage="1"
      :loop="false"
      :speed="500"
      :centerMode="true"
      :navigation-next-label="navigationNext"
      :navigation-prev-label="navigationPrev"
    >
      <slide class="slide" v-for="(item, key) in items" :key="`slide-${key}`">
        <div
          class="image"
          :style="`background-image: url(${item.image})`"
        ></div>
      </slide>
    </carousel>
    <div
      v-for="(item, key) in items"
      :key="`slide-${key}`"
      class="image"
      :style="`background-image: url(${item.image})`"
      v-else
    ></div>
  </div>
</template>
<script>

import { Carousel, Slide } from "vue-carousel";

export default {
  props: { items: { type: Array } },
  components: {
    Carousel,
    Slide,
  },
  computed: {
    navigationPrev: function () {
      return `<svg width="11" height="18" viewBox="0 0 11 18" fill="none">
            <path d="M0 9L8.5109 0.48912L10.6386 2.61684L2.12772 11.1277L0 9Z" fill="#454545"/>
            <path d="M0 9L2.12772 6.87228L10.6386 15.3832L8.5109 17.5109L0 9Z" fill="#454545"/>
            </svg>`;
    },
    navigationNext: function () {
      return `<svg width="11" height="18" viewBox="0 0 11 18" fill="none" >
            <path d="M11 9L2.4891 0.48912L0.361378 2.61684L8.87228 11.1277L11 9Z" fill="#454545"/>
            <path d="M11 9L8.87228 6.87228L0.361378 15.3832L2.4891 17.5109L11 9Z" fill="#454545"/>
            </svg>`;
    },
  },
};
</script>
<style lang="scss" scoped>
.image {
  height: 100%;
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  min-height: 670px;
  @media only screen and (max-width: 1299px) {
    min-height: 600px;
  }
  @media only screen and (max-width: 998px) {
    min-height: 500px;
    border-radius: 0;
  }
}
.carousel {
  position: relative !important;
  flex: 1;
}
</style>