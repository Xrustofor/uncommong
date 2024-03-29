<template>
  <div>
    <div>
      <div class="gallery fade" v-if="!localLoading">
        <ul v-if="gallery.length">
          <li v-for="(item, key) in gallery" :key="`image-${key}`">
            <div
              class="image"
              :style="{ backgroundImage: `url(${item.image})` }"
              @click="showCarousel(key)"
            />
          </li>
        </ul>
        <div class="message" v-else>
          <h4>This organization does not have a gallery.</h4>
        </div>
      </div>

      <popPup
        class="gallery_poppup"
        v-model="popPup"
        :maxWidthModal="1190"
        maxWidth="100%"
        :title="organization ? organization.name : ''"
      >
        <template #body>
          <div class="carousel">
            <carousel
              :loop="true"
              :centerMode="true"
              :autoplayTimeout="4000"
              :speed="500"
              :per-page="1"
              :navigateTo="[indexImageSelect, false]"
              :paginationEnabled="false"
              @page-change="curentImage = $event"
            >
              <slide v-for="(item, key) in gallery" :key="`carousel-${key}`">
                <div class="carousel_image">
                  <img
                    class="fit-picture"
                    :src="item.image"
                    alt="Grapefruit slice atop a pile of other slices"
                  />
                </div>
              </slide>
            </carousel>
            <div class="prev" @click="prev">
              <icon-base
                class="icon_prev"
                width="60"
                height="60"
                icon-name="prev"
              >
                <icon-pre />
              </icon-base>
            </div>
            <div class="next" @click="next">
              <icon-base
                class="icon_next"
                width="60"
                height="60"
                icon-name="next"
              >
                <icon-next />
              </icon-base>
            </div>
          </div>
        </template>
      </popPup>
    </div>
  </div>
</template>
<script>

import { mapGetters, mapMutations, mapActions} from "vuex";
import { Carousel, Slide } from "vue-carousel";
import IconBase from "@/components/IconBase";
import iconNext from "@/components/icons/iconNext";
import iconPre from "@/components/icons/iconPre";

import popPup from "@/common/popPup";
export default {
  components: {
    Carousel,
    Slide,
    popPup,
    IconBase,
    iconNext,
    iconPre,
  },
  data() {
    return {
      popPup: false,
      indexImageSelect: null,
      curentImage: null,
    };
  },
  async created() {
    await this.apiGetGallary();
  },
  computed: {
    ...mapGetters("organizations/organizations", {
      organization: "getOrganization",
      gallery: "getGallery",
      localLoading: "getlocalLoading",
    }),
  },
  methods:{
    ...mapMutations("organizations/organizations", [
      "setGallaryImagesСlear",
    ]),

    ...mapActions("organizations/organizations", ["apiGetGallary"]),
    showCarousel(index){
      this.popPup = true;
      this.indexImageSelect = index;
    },
    prev() {
      if (this.indexImageSelect <= 0) {
        this.indexImageSelect = this.gallery.length - 1;
      } else {
        this.indexImageSelect = this.indexImageSelect - 1;
      }
    },
    next() {
      if (this.indexImageSelect >= this.gallery.length - 1) {
        this.indexImageSelect = 0;
      } else {
        this.indexImageSelect = this.indexImageSelect + 1;
      }
    },
  },
  destroyed(){
    this.setGallaryImagesСlear();
  }
};
</script>
<style lang="scss" scoped>
.gallery {
  ul {
    display: flex;
    flex-wrap: wrap;
    li {
      width: 33.33%;
      height: 374px;
      padding: 0.7rem;
      .image {
        height: 100%;
        width: 100%;
        border-radius: 10px;
        box-shadow: 0px 5px 25px 3px rgba(154, 131, 183, 0.29);
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        cursor: pointer;
      }
      &:nth-child(even) {
        height: 190px;
      }
      &:nth-child(6n + 5) {
        margin-top: -185px;
      }
      @media only screen and (max-width: 768px) {
        &:nth-child(6n + 5) { margin-top: 0px; }
        width: 100%;
      }
    }
  }
}
.gallery_poppup{
  overflow-y: auto;
  height: 100%;
  padding-top: 7%;
  padding-bottom: 7%;
  align-items: baseline;
}
.carousel {
  position: relative;
  z-index: 1;
  .prev,
  .next {
    position: absolute;
    z-index: 1;
    top: calc(50% - 34px);
    height: 61px;
    width: 68px;
    box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.25);
    background: #ffffff;
    border-radius: 50px;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    cursor: pointer;
    opacity: 0.7;
    transition: 0.3s all linear;
    &:hover {
      opacity: 1;
      transition: 0.3s all linear;
    }
     
  }
  .icon_prev,
  .icon_next {
    margin-top: 17px;
  }
  .icon_prev {
    margin-left: 19px;
  }
  .icon_next {
    margin-left: 21px;
  }
  .prev {
    left: 30px;
  }
  .next {
    right: 30px;
  }
  @media only screen and (max-width: 768px) {
    .prev,
    .next {
      height: 40px;
      width: 44px;
    }
    .prev { left: 15px; }
    .next { right: 15px }
    .icon_prev,
    .icon_next {
      margin-top: 8px;
    }
    .icon_prev {
      margin-left: 8px;
    }
    .icon_next {
      margin-left: 11px;
    }
  }
  @media only screen and (max-width: 425px) {
    .prev, .next {
    top: calc(50% - 20px);
  }
    .prev { left: -25px; }
    .next { right: -25px }
  }
  .carousel_image {
    height: 500px;
    width: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 1.6rem;
    display: flex;
    justify-content: center;
    align-items: center;
    img{
      height: 100%;
    }
    @media only screen and (max-width: 425px) {
      height: 200px;
    }
  }
}
</style>

