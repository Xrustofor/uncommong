<template>
  <div class="carousel container">
    <carousel
      class="carousel_wrapper"
      :per-page="1"
      :autoplay="true"
      :paginationEnabled="false"
      :perPageCustom="[
        [320, 1],
        [599, 2],
        [768, 3],
        [1024, 3],
        [1199, 4],
      ]"
      :perPage="4"
      :loop="true"
      :centerMode="true"
      :autoplayTimeout="4000"
      :speed="500"
      @page-change="transitionstart"
    >
      <slide
        class="slide hover_translate"
        v-for="(item, key) in items"
        :key="`sweepstake-${key}`"
        :class="{
          clicked: item.id === +activeItem,
          coming_soon: !item.time.starts,
        }"
        @slideclick="handleSlideClick(item.id)"
      >
        <router-link
          :to="`/sweepstakes/${item.slug}`"
          v-slot="{ href, navigate }"
          custom
        >
          <a
            target="_blank"
            class="image_blok"
            :style="`background-image: linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${item.details.image})`"
            :href="href"
            @click="navigate"
          >
            <label class="circle" v-if="!item.time.starts">
              <span class="message">Coming Soon</span>
            </label>

            <label
              class="circle"
              v-else-if="item.time.days > 0 && item.time.hours >= 0"
            >
              <span>
                <strong>{{ item.time ? item.time.days : "" }}</strong>
                Days
              </span>
              <span>
                <strong>{{ item.time ? item.time.hours : "" }}</strong>
                Hours
              </span>
            </label>
            <label
              class="circle"
              v-else-if="
                (item.time.hours > 0 && item.time.minutes >= 0) ||
                (item.time.hours == 0 && item.time.minutes > 0)
              "
            >
              <span>
                <strong>{{ item.time ? item.time.hours : "" }}</strong>
                Hours
              </span>
              <span>
                <strong>{{ item.time ? item.time.minutes : "" }}</strong>
                {{ `${item.time.minutes > 1 ? " Minutes" : " Minute"} ` }}
              </span>
            </label>
            <label class="circle" v-else>
              <span class="message">Sweepstake has ended</span>
            </label>
            <p class="bottom">
              <span class="title">{{ item.details.focus.title }}</span>
              <span class="text">{{ item.prizes.prize }}</span>
            </p>
          </a>
        </router-link>
      </slide>
    </carousel>
  </div>
</template>
<script>
import { Carousel, Slide } from "vue-carousel";

export default {
  props: {
    items: [Array, Object],
  },
  components: {
    Carousel,
    Slide,
  },
  data() {
    return {
      activeItem: null,
    };
  },
  methods: {
    handleSlideClick(id) {
      this.activeItem = this.activeItem === id ? null : id;
    },
    transitionstart() {
      this.activeItem = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.carousel {
  .slide .image_blok {
    position: relative;
    z-index: 1;
    background-color: $white;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    border-radius: 1rem;
    width: 100%;
    display: block;
    @media (max-width: 768px) {
      border-radius: 1rem;
    }
    .bottom {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 1rem;
      overflow: hidden;
      padding: 0 1rem;
      font-family: Inter;
      font-style: normal;
      color: $white;
      display: flex;
      flex-direction: column;
    }
    .title {
      font-weight: normal;
      font-size: 1.4rem;
      margin-bottom: 1rem;
    }
    .text {
      font-weight: bold;
      font-size: 1.8rem;
    }
    .circle {
      width: 9rem;
      height: 9rem;
      background-color: $white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: -3rem;
      left: -3rem;
      border: 2px solid $violet;
      @media (max-width: 768px) {
        left: calc(50% - 4rem);
      }
      span {
        font-family: Inter;
        font-style: normal;
        display: flex;
        flex-direction: column;
        text-align: center;
        justify-content: center;
        margin: 0;
        text-transform: uppercase;
        color: $websiteViolet;
        font-size: 0.8rem;
        border-right: 1px solid #e6e6e9;
        padding: 0 0.5rem;
        min-width: 40px;
        &:last-child {
          border-right: 0;
        }
      }
      strong {
        font-weight: 900;
        font-size: 2rem;
      }
      .message {
        font-family: Inter;
        font-style: normal;
        font-weight: 900;
        font-size: 1rem;
        color: $websiteViolet;
      }
    }
  }
  .slide {
    padding: 9rem 2.7rem 3rem;
    padding-top: 15rem;
    @media only screen and (max-width: 768px) {
      padding: 5rem 1.5rem 3rem;
      padding-top: 13rem;
    }
    @media only screen and (max-width: 599px) {
      padding: 4rem 2.5rem 3rem;
      .image_blok {
        max-width: 350px;
        margin: 0 auto;
      }
    }
    @media only screen and (max-width: 349px) {
      padding: 4rem 2rem 3rem;
    }
    &:not(.coming_soon) .image_blok {
      height: 400px;
      top: -120px;
      @media only screen and (max-width: 768px) {
        top: -140px;
      }
      @media only screen and (max-width: 599px) {
        height: 300px;
        top: -50px;
      }
    }
    &.coming_soon .image_blok {
      height: 300px;
      top: -75px;
      @media only screen and (max-width: 768px) {
        top: -90px;
      }
      @media only screen and (max-width: 599px) {
        height: 250px;
        top: -25px;
      }
    }
  }
}
</style>