<template>
  <section class="intro">
    <div
      class="intro_image"
      :class="{ small: !image && !fullImage.url }"
      :style="{
        backgroundImage: 'url(' + introImage + ')',
      }"
    ></div>
    <div class="container">
      <div class="intro_text">
        <h1>{{ text.title }}</h1>
        <h6>{{ text.subtitle }}</h6>
        <h5>{{ text.contentTitle }}</h5>
        <p>{{ text.content }}</p>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  props: {
    image: { type: Object, require: false },
    fullImage: { type: Object, require: false },
    text: { type: Object },
  },
  computed: {
    introImage() {
      return this.image
        ? require(`@/assets/img/${this.image.url}`)
        : this.fullImage.url
        ? this.fullImage.url
        : require(`@/assets/img/logo-blue.svg`);
    },
  },
};
</script>
<style lang="scss" scoped>
.intro {
  display: flex;
  align-items: flex-end;
  position: relative;
  min-height: 600px;
  @media only screen and (max-width: 1499px) {
    min-height: 550px;
  }
  @media only screen and (max-width: 998px) {
    min-height: 400px;
  }
  &.small-height {
    min-height: 500px;
    @media only screen and (max-width: 1499px) {
      min-height: 450px;
    }
    @media only screen and (max-width: 998px) {
      min-height: 300px;
    }
  }
  &_image {
    position: absolute;
    width: calc(100% - 40px);
    height: 100%;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 20px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    background-color: #e9e2f1;
    z-index: 1;
    &.small {
      background-size: auto;
    }
    @media only screen and (max-width: 1299px) {
      width: calc(100% - 20px);
    }
    @media only screen and (max-width: 998px) {
      width: 100%;
      border-radius: 0;
    }
  }
  &_text {
    position: relative;
    max-width: 60%;
    padding: 32px 21px 32px 26px;
    background: rgba($color: #6db5d1, $alpha: 0.8);
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    z-index: 1;
    margin: 40px 0 0;
    @media only screen and (max-width: 1199px) {
      padding: 25px;
    }
    @media only screen and (max-width: 768px) {
      max-width: 100%;
      padding: 20px;
      margin: 30px 0 0;
    }
    h1 {
      font-family: $font;
      color: #fff;
      margin-bottom: 18px;
    }
    h6 {
      font-size: 14px;
      font-weight: 500;
      text-transform: uppercase;
      color: #fff;
      margin-bottom: 20px;
      &:empty {
        margin-bottom: 0;
      }
      @media only screen and (max-width: 599px) {
        margin-bottom: 15px;
      }
    }
    h5 {
      font-size: 25px;
      font-weight: 700;
      line-height: 1.55;
      color: #fff;
      margin-bottom: 20px;
      &:empty {
        margin-bottom: 0;
      }
      @media only screen and (max-width: 1399px) {
        font-size: 23px;
      }
      @media only screen and (max-width: 1999px) {
        font-size: 20px;
      }
    }
    p {
      font-size: 18px;
      line-height: 1.55;
      color: #fff;
      @media only screen and (max-width: 1399px) {
        font-size: 17px;
      }
      @media only screen and (max-width: 1999px) {
        font-size: 16px;
      }
      @media only screen and (max-width: 768px) {
        font-size: 15px;
      }
      @media only screen and (max-width: 499px) {
        font-size: 14px;
      }
    }
  }
  &.home {
    margin-bottom: 100px;
    @media only screen and (max-width: 998px) {
      margin-bottom: 60px;
    }
    @media only screen and (max-width: 768px) {
      margin-bottom: 0;
    }
    .intro_text {
      margin-left: -10%;
      margin-bottom: -55px;
      background: rgba($color: #edbc34, $alpha: 1);
      border-radius: 20px;
      @media only screen and (max-width: 1499px) {
        margin-left: -5%;
      }
      @media only screen and (max-width: 1399px) {
        max-width: 50%;
        margin-left: 0;
      }
      @media only screen and (max-width: 1199px) {
        max-width: 45%;
      }
      @media only screen and (max-width: 998px) {
        max-width: 50%;
        margin-bottom: -30px;
      }
      @media only screen and (max-width: 768px) {
        max-width: 100%;
        padding: 20px;
        margin: 30px 0 0;
        border-radius: 20px 20px 0 0;
      }
    }
    .intro_image {
      background-position: top right;
    }
  }
}
</style>