<template>
  <section class="organizations">
    <div class="container">
      <div>
        <h2>Organizations</h2>
        <p>
          Our innovative and dedicated partner organizations drive change in
          their communities every day. Learn more about the causes they advocate
          for and hear the stories that bring their missions to life. As
          501(c)(3) organizations any contributions you make are tax deductible.
        </p>
      </div>
    </div>
    <div class="organizations_list">
      <div class="carousel container">
        <carousel
          v-if="sliderInit"
          class="carousel_wrapper"
          :per-page="1"
          :autoplay="false"
          :paginationEnabled="false"
          :navigationEnabled="true"
          :navigation-enabled="true"
          :perPageCustom="[
            [320, 1],
            [599, 2],
            [768, 3],
            [1024, 3],
            [1199, 4],
          ]"
          :perPage="1"
          :loop="false"
          :centerMode="true"
          :speed="500"
          :navigation-next-label="navigationNext"
          :navigation-prev-label="navigationPrev"
          @page-change="transitionstart"
        >
          <slide
            class="slide hover_translate"
            v-for="(item, key) in items"
            :key="`organization-${key}`"
            :class="{ clicked: item.id === +activeItem }"
            @slideclick="handleSlideClick(item.id)"
          >
            <div
              class="image_blok"
              :style="`background-image: url(${item.image})`"
            >
              <div class="bottom">
                <span class="title">{{ item.name }}</span>
                <div class="hidden">
                  <p>{{ item.about_us }}</p>
                  <router-link
                    :to="`/nonprofits/${item.slug}`"
                    v-slot="{ href, navigate }"
                    custom
                  >
                    <a
                      :href="href"
                      @click="navigate"
                      class="btn btn-alt btn-alt-white"
                      >view</a
                    >
                  </router-link>
                </div>
              </div>
            </div>
          </slide>
        </carousel>
        <div class="carousel_wrapper no-slider" v-else>
          <a
            class="slide hover_translate"
            v-for="(item, key) in items"
            :key="`organization-${key}`"
            :class="{ clicked: item.id === +activeItem }"
            @click="handleSlideClick(item.id)"
          >
            <div
              class="image_blok"
              :style="`background-image: url(${item.image})`"
            >
              <div class="bottom">
                <span class="title">{{ item.name }}</span>
                <div class="hidden">
                  <p>{{ item.about_us }}</p>
                  <router-link
                    :to="`/nonprofits/${item.slug}`"
                    v-slot="{ href, navigate }"
                    custom
                  >
                    <a
                      :href="href"
                      @click="navigate"
                      class="btn btn-alt btn-alt-white"
                      >view</a
                    >
                  </router-link>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
    <div class="container bg_circles">
      <div class="circle_overlay green">
        <router-link
          to="/nonprofits"
          class="circle_btn"
          v-slot="{ href, navigate }"
          custom
        >
          <a :href="href" @click="navigate">
            View All Organizations</a
          ></router-link
        >
        <span></span>
      </div>
    </div>
  </section>
</template>
<script>
import { Carousel, Slide } from "vue-carousel";
export default {
  props: { items: { type: Array } },
  components: {
    Carousel,
    Slide,
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
.container {
  &.bg_circles {
    margin: 0 0 0 46%;
    @media only screen and (max-width: 1299px) {
      margin: 0 0 0 25%;
    }
  }
  & > div:not(.carousel_wrapper) {
    max-width: 600px;
  }
  h2 {
    color: $websiteText;
    font-weight: 900;
    margin-bottom: 43px;
  }
  p {
    font-size: 16px;
    font-weight: 500;
    color: $websiteText;
    line-height: 1.4;
    margin-bottom: 50px;
    @media only screen and (max-width: 768px) {
      margin-bottom: 20px;
    }
  }
}
.organizations {
  position: relative;
  padding-bottom: 80px;
  .organizations_list {
    position: relative;
    z-index: 2;
    margin-top: 100px;
    @media only screen and (max-width: 768px) {
      margin-top: 30px;
    }
  }
}

.carousel {
  position: initial !important;
  .slide {
    min-width: 150px;
    .image_blok {
      position: relative;
      z-index: 1;
      padding-bottom: 144%;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      background-color: $white;
      border-radius: 1rem;
      width: 100%;
      display: block;
      @media only screen and (max-width: 768px) {
        border-radius: 1rem;
        padding-bottom: 380px;
      }
      @media only screen and (max-width: 599px) {
        max-width: 350px;
        margin: 0 auto;
      }
      .bottom {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        padding: 18px 20px 8px 20px;
        color: $white;
        display: flex;
        flex-direction: column;
        border-radius: 10px;
        background-color: rgba($color: $blue, $alpha: 0.87);
        .btn {
          text-transform: uppercase;
          margin-bottom: 15px;
          font-size: 12px;
          min-width: 0;
          padding: 0 25px;
          @media only screen and (max-width: 599px) {
            width: 100%;
          }
        }
      }
      .title {
        font-weight: 900;
        font-size: 20px;
        margin-bottom: 10px;
        @media only screen and (max-width: 768px) {
          font-size: 18px;
        }
        @media only screen and (max-width: 599px) {
          font-size: 16px;
        }
      }
      p {
        font-size: 14px;
        line-height: 1.5;
        margin-bottom: 15px;
        color: $white;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
      }
    }
  }
  .slide {
    padding: 4rem 2rem;
    @media only screen and (max-width: 768px) {
      padding: 4rem 1.5rem;
    }
    @media only screen and (max-width: 599px) {
      padding: 4rem 2.5rem;
    }
    @media only screen and (max-width: 349px) {
      padding: 4rem 2rem;
    }
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