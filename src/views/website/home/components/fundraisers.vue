<template>
  <section class="main">
    <div class="main_list">
      <div class="carousel container">
        <carousel
          v-if="sliderInit"
          class="carousel_wrapper"
          :per-page="1"
          :autoplay="false"
          :navigationEnabled="true"
          :navigation-enabled="true"
          :paginationEnabled="false"
          :perPageCustom="[
            [320, 1],
            [599, 2],
            [768, 3],
            [1024, 3],
            [1199, 4],
          ]"
          :perPage="1"
          :loop="false"
          :speed="500"
          :centerMode="true"
          :navigation-next-label="navigationNext"
          :navigation-prev-label="navigationPrev"
          @page-change="transitionstart"
        >
          <slide
            class="slide hover_translate"
            v-for="(item, key) in items"
            :key="`fundraiser-${key}`"
            
            @slideclick="handleSlideClick(item.id, item.slug)"
          >
            <Fundraiser :item="item"/>
          </slide>
        </carousel>
        <div class="carousel_wrapper no-slider" v-else>
          <a
            :class="{ clicked: item.id === +activeItem }"
            class="slide hover_translate"
            v-for="(item, key) in items"
            :key="`organization-${key}`"
            
            @click="handleSlideClick(item.id, item.slug)"
          >
            <Fundraiser :item="item"/>
          </a>
        </div>
      </div>
    </div>
    <div class="container bg_circles">
      <div class="circle_overlay yellow">
        <router-link
          to="/fundraisers"
          class="circle_btn"
          v-slot="{ href, navigate }"
          custom
        >
          <a :href="href" @click="navigate">View All Fundraisers</a></router-link
        >
        <span></span>
      </div>
    </div>
  </section>
</template>
<script>

import { Carousel, Slide } from "vue-carousel";
import Fundraiser from "./fundraiser";

export default {
  props: { items: { type: Array } },
  components: {
    Carousel,
    Slide,
    Fundraiser,
  },
  data() {
    return {
      activeItem: null,
      sliderInit: true,
      windowSize: null,
    };
  },
  created() {
    this.windowWidth();
    this.windowSize = setInterval(() => this.windowWidth(), 1000);
  },
  destroyed() {
    clearInterval(this.windowSize);
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
  watch: {
    items() {
      this.sliderInit = false;
      this.windowWidth();
      this.sliderInit = true;
    },
  },
  methods: {
    windowWidth() {
      var innerWidth = window.innerWidth,
          itemLength = this.items.length;

      if (innerWidth < 599 && itemLength > 1) this.sliderInit = true;
      else if (innerWidth < 768 && itemLength > 2) this.sliderInit = true;
      else if (innerWidth < 1199 && itemLength > 3) this.sliderInit = true;
      else if (innerWidth > 1199 && itemLength > 4) this.sliderInit = true;
      else this.sliderInit = false;
    },
    handleSlideClick(id, slug) {
      this.activeItem = this.activeItem === id ? null : id;
      this.$router.push(`/fundraisers/${slug}`);
    },
    transitionstart() {
      this.activeItem = null;
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  & > div:not(.carousel_wrapper) {
    max-width: 600px;
    margin: 0 auto 0 28%;
  }
  h2 {
    position: relative;
    color: $websiteText;
    font-weight: 900;
    padding-bottom: 25px;
    margin-bottom: 70px;
    @media only screen and (max-width: 768px) {
      margin-bottom: 30px;
    }
    &:after {
      position: absolute;
      bottom: 0;
      left: 0;
      content: "";
      width: 60px;
      height: 3px;
      background-color: #EDBC33;
    }
  }
  p {
    font-size: 16px;
    font-weight: 500;
    color: $websiteText;
    line-height: 1.4;
    margin-bottom: 50px;
    @media only screen and (max-width: 768px) {
      margin-bottom: 30px;
    }
  }
}
.main {
  position: relative;
  padding-bottom: 40px;
  .main_list {
    position: relative;
    z-index: 2;
    margin-top: 10px;
  }
}

.carousel {
  position: initial !important;
  .slide {
    width: 100%;
    padding: 9rem 2.7rem;
    @media only screen and (max-width: 768px) {
      padding: 5rem 1.5rem;
    }
    @media only screen and (max-width: 599px) {
      padding: 4rem 2.5rem;
    }
    @media only screen and (max-width: 349px) {
      padding: 4rem 2rem;
    }
  }
}
.circle_overlay .circle_btn {
  margin: 30px 140px 70px;
  @media only screen and (max-width: 1299px) {
    margin: 30px 90px 70px;
  }
}

.no-slider {
  display: flex;
  justify-content: center;
  .slide {
    width: calc(100% / 4);
    @media only screen and (max-width: 1199px) {
      width: calc(100% / 3);
    }
    @media only screen and (max-width: 768px) {
      width: calc(100% / 2);
    }
    @media only screen and (max-width: 599px) {
      width: 100%;
      max-width: 350px;
    }
  }
}
</style>