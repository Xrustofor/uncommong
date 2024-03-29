<template>
  <div class="content">
    <div class="image-title-list-text" v-if="prizes">
      <div class="image_title">
        <div class="left">
          <PrizeImageSlider :items="prizes.images"/>
        </div>
        <div class="right">
          <div class="square">
            <div class="circle">
              <h5>{{ prizes.caption }}</h5>
              <h1 class="title">{{ prizes.prize }}</h1>
              <div class="text">
                <p>{{ prizes.aboutPrize }}</p>
              </div>
              <div class="button">
                <a v-scroll-to="'.footer_section'">donate to enter</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ul
        v-if="prizes"
        :class="`prizes_count prizes_count_${prizes.descriptions.length}`"
      >
        <li
          v-for="(item, key) in prizes.descriptions"
          :key="`descriptions-${key}`"
        >
          <span class="icon">
            <icon-base
              width="68"
              height="68"
              viewBox="0 0 48 48"
              iconName="drop"
              :icon-color="
                key === 0
                  ? '#71B078'
                  : key === 1
                  ? '#D3584B'
                  : key === 2
                  ? '#315B9C'
                  : '#EDBC33'
              "
            >
              <icon-drop />
            </icon-base>
          </span>
          <p>{{ item ? item.description : "" }}</p>
        </li>
      </ul>
    </div>
    <div class="title_text_list_img" v-if="details">
      <div class="left">
        <h3>{{ details.helpingToHeader }}</h3>
        <div class="description">
          <p>{{ details.helpingToDescription }}</p>
        </div>
        <div class="button">
          <a v-scroll-to="'.footer_section'">donate to enter</a>
        </div>
      </div>
      <div class="right">
        <slideSweepstake class="collage_slider" :items="sliderItems" />
      </div>
    </div>
    <div>
      <slot name="footer" />
    </div>
  </div>
</template>
<script>

import IconBase from "@/components/IconBase";
import iconDrop from "@/components/icons/iconDrop";
import slideSweepstake from "@/views/website/sweepstakes/components/slideSweepstake";
import PrizeImageSlider from "./prizeImageSlider.vue";

export default {
  props: {
    prizes: Object,
    details: Object,
    organizationsImg: Array,
    loaded: {
      type: Boolean,
      default: false,
    },
    sliderItems: Object,
  },
  components: {
    IconBase,
    iconDrop,
    slideSweepstake,
    PrizeImageSlider,
  },
  data() {
    return {
      images: [{ image: "" }],
    };
  },

  created() {
    this.images = this.organizationsImg;
  },
  computed: {
    countImgMax() {
      const countImg = +this.organizationsImg.length;
      return countImg < 10 ? countImg - 1 : 6;
    },
  },
};
</script>
<style lang="scss" scoped>
.content {
  .top {
    min-height: 35rem;
    margin-bottom: 13.8rem;
    @media only screen and (max-width: 998px) {
      margin-bottom: 3rem;
      min-height: auto;
    }
  }
  .top_left {
    max-width: calc(100% - 500px);
    @media (max-width: 1024px) {
      max-width: calc(100% - 515px);
    }
    @media only screen and (max-width: 998px) {
      max-width: 100%;
    }
    h3 {
      font-weight: 800;
      font-size: 30px;
      color: $websiteViolet;
      margin-bottom: 1.5rem;
    }
    p {
      font-size: 1.8rem;
      line-height: 2.8rem;
      color: $websiteViolet;
    }
  }
  .image-title-list-text {
    margin-bottom: 110px;
    .image_title {
      margin-bottom: 160px;
      min-height: 480px;
      display: flex;
      align-items: stretch;
      @media only screen and (max-width: 998px) {
        flex-direction: column-reverse;
        min-height: auto;
        margin-bottom: 100px;
      }
      .left {
        display: flex;
        flex: 1;
        border-right: 10px solid white;
        background-color: white;
        z-index: 2;
        @media only screen and (max-width: 998px) {
          width: 100vw;
          margin-left: -20px;
          display: flex;
          flex: auto;
          align-items: stretch;
          border-right: none;
        }
        .image {
          height: 100%;
          width: 100%;
          border-radius: 10px;
          overflow: hidden;
          background-repeat: no-repeat;
          background-position: center;
          background-size: 130%;
          @media only screen and (max-width: 998px) {
            min-height: 400px;
          }
        }
      }
      .right {
        flex: 0.8;
        position: relative;
        @media (max-width: 1220px) {
          flex: 1;
        }
        @media only screen and (max-width: 998px) {
          min-height: 480px;
          margin-bottom: 90px;
          position: static;
          display: flex;
          align-items: center;
        }
        .square {
          height: 100%;
          width: 100%;
          @media only screen and (max-width: 998px) {
            display: flex;
            justify-content: center;
          }
        }
        .circle {
          position: relative;
          max-width: 520px;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 4rem 3rem 0;
          @media only screen and (max-width: 998px) {
            text-align: center;
            padding: 4rem 1rem;
          }
          @media (max-width: 570px) {
            border-radius: 3rem;
            width: 100%;
            height: auto;
            .text {
              overflow: visible;
              max-height: none;
            }
          }
          &:after {
            background: #f2eef9;
            width: 520px;
            height: 520px;
            content: "";
            display: block;
            border-radius: 50%;
            bottom: 0;
            left: calc(50% - 44px);
            transform: translate(-50%, 0);
            position: absolute;
            z-index: -1;
            @media only screen and (max-width: 998px) {
              width: 480px;
              height: 480px;
              top: 50%;
              bottom: initial;
              left: 50%;
              transform: translate(-50%, -50%);
            }
          }
        }
        .title {
          font-weight: 900;
          color: $websiteText;
          margin-bottom: 15px;
        }
        h5 {
          font-weight: 900;
          font-size: 30px;
          color: $websiteText;
          margin-bottom: 30px;
        }
        p {
          font-size: 18px;
          line-height: 1.44;
          color: $websiteText;
          margin-bottom: 40px;
          @media only screen and (max-width: 998px) {
            margin-bottom: 0;
          }
        }
      }
    }
    .prizes_count {
      display: flex;
      flex-wrap: wrap;
      margin-left: -20px;
      margin-right: -20px;
      @media only screen and (max-width: 998px) {
        padding-top: 40px;
      }
      li {
        position: relative;
        width: 100%;
        padding: 0 15px 30px 10px;
        border-radius: 10px;
        box-shadow: 0px 24px 20px rgba(154, 131, 183, 0.05),
          0px 3px 2px rgba(154, 131, 183, 0.02),
          0px 8px 100px rgba(154, 131, 183, 0.1);
        margin: 0 20px;
        @media (max-width: 475px) {
          padding: 15px;
        }
        .icon {
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }
      &_1 {
        li {
          max-width: 100%;
          padding: 48px 123px 48px 117px;
          @media only screen and (max-width: 998px) {
            padding: 40px 30px 40px 50px;
            .icon {
              left: 10px;
            }
          }
          @media only screen and (max-width: 599px) {
            padding: 55px 20px 35px;
            .icon {
              left: 50%;
              top: 0;
              transform: translate(-50%, -50%) rotate(90deg);
            }
          }
        }
      }
      &_2 {
        li {
          max-width: calc(50% - 40px);
          padding: 40px 33px 40px 46px;
          @media only screen and (max-width: 998px) {
            padding: 40px 30px 40px 50px;
            .icon {
              left: 10px;
            }
          }
          @media only screen and (max-width: 599px) {
            max-width: 100%;
            margin-bottom: 80px;
            padding: 55px 20px 35px;
            .icon {
              left: 50%;
              top: 0;
              transform: translate(-50%, -50%) rotate(90deg);
            }
          }
        }
      }
      &_3,
      &_4 {
        margin-left: -12.5px;
        margin-right: -12.5px;
        @media only screen and (max-width: 768px) {
          margin: 0 -15px;
        }
        li {
          max-width: calc((100% / 3) - 25px);
          margin: 0 12.5px;
          padding: 41px 31px 30px 35px;
          @media only screen and (max-width: 998px) {
            max-width: calc(50% - 30px);
            padding: 40px 30px 20px;
            margin: 0 15px;
            margin-bottom: 80px;
          }
          @media only screen and (max-width: 599px) {
            max-width: 100%;
            padding: 55px 20px 35px;
          }
          .icon {
            left: 50%;
            top: 0;
            transform: translate(-50%, -50%) rotate(90deg);
          }
        }
      }
      &_4 {
        margin-left: -8px;
        margin-right: -8px;
        @media only screen and (max-width: 768px) {
          margin: 0 -5px;
        }
        li {
          max-width: calc(25% - 16px);
          margin: 0 8px;
          padding: 55px 22px 30px 35px;
          @media only screen and (max-width: 998px) {
            max-width: calc(50% - 30px);
            margin: 0 15px;
            margin-bottom: 80px;
          }
          @media only screen and (max-width: 599px) {
            max-width: 100%;
            padding: 55px 20px 35px;
          }
        }
      }
      p {
        font-size: 18px;
        line-height: 1.45;
        font-weight: 700;
        color: $websiteText;
        margin-bottom: 0;
        @media only screen and (max-width: 599px) {
          text-align: center;
          font-size: 16px;
        }
      }
    }
  }
  .title_text_list_img {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding-bottom: 150px;
    @media only screen and (max-width: 998px) {
      flex-direction: column;
      padding-bottom: 50px;
    }
    .left {
      flex: 0.8;
      @media only screen and (max-width: 768px) {
        flex: auto;
        margin-bottom: 6rem;
      }
      h3 {
        font-weight: 900;
        font-size: 56px;
        color: $websiteText;
        margin-bottom: 20px;
        @media only screen and (max-width: 1299px) {
          font-size: 45px;
        }
        @media only screen and (max-width: 998px) {
          font-size: 40px;
        }
        @media only screen and (max-width: 768px) {
          text-align: center;
        }
      }
      .description {
        margin-bottom: 30px;
        p {
          font-size: 18px;
          color: $websiteText;
          @media only screen and (max-width: 768px) {
            text-align: center;
          }
        }
      }
    }
    .right {
      &::before {
        content: "";
        display: block;
        padding-bottom: 100%;
      }
      flex: 1;
      position: relative;
      &::after {
        content: "";
        position: absolute;
        z-index: -1;
        top: 50%;
        left: 88%;
        transform: translate(-50%, -50%);
        width: 98%;
        height: 98%;
        border-radius: 100%;
        background: #f2eef9;
        @media only screen and (max-width: 768px) {
          left: 50%;
          width: 110%;
          height: 110%;
        }
        @media only screen and (max-width: 599px) {
          width: 120%;
          height: 120%;
        }
      }
      @media (max-width: 991px) {
        width: 100%;
      }
    }
  }
  .button {
    display: flex;
    @media only screen and (max-width: 998px) {
      display: none;
    }
    a {
      padding: 2.5rem 4rem;
      background: $yellow;
      font-weight: 500;
      transition: all linear 0.3s;
      border-radius: 4rem;
      color: $websiteText;
      text-transform: uppercase;
      box-shadow: 0px 6px 10px rgba(237, 188, 51, 0.3);
      cursor: pointer;
      &:hover {
        background: $yellowHover;
        color: $websiteText;
      }
    }
  }
  .collage_slider {
    position: absolute;
    top: 0;
    left: 20%;
    right: 0;
    bottom: 0;
    @media (max-width: 991px) {
      left: 0;
    }
  }
}
</style>