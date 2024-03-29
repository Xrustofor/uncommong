<template>
  <div class="content_center">
    <h1>404 Page Not Found</h1>
    <button class="btn btn-yellow" @click.prevent="goBack">
      click here to return
    </button>
    <p>
      If you reached this page in error please reach out to us at
      <a :href="`mailto:${mail}`">{{mail}}</a>
    </p>
  </div>
</template>
<script>
export default {
  data() {
    return {
      mail: process.env.VUE_APP_MAIL_UNCOMMONGOOD || '',
    }
  },
  metaInfo() {
    return {
      meta: [{ name: "robots", content: "noindex" }],
    };
  },
  created() {
    this.$store.dispatch("setLoader", false);
  },
  mounted() {
    document.querySelector('meta[name="robots"]').content = "noindex";
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>
<style lang="scss" scoped>
.content_center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 600px;
  padding: 105px 15px 80px;
  margin: 0 auto;
  @media only screen and (max-width: 1299px) {
    padding: 80px 15px;
  }
  h1 {
    text-align: center;
    margin-bottom: 30px;
    color: $websiteText;
    @media only screen and (max-width: 599px) {
      font-size: 36px;
    }
  }
  p {
    font-size: 18px;
    line-height: 1.55;
    color: $websiteText;
    text-align: center;
    @media only screen and (max-width: 998px) {
      font-size: 16px;
    }
    @media only screen and (max-width: 599px) {
      font-size: 14px;
      padding: 0 20px;
    }
    a {
      position: relative;
      color: $websiteText;
      &:after {
        position: absolute;
        bottom: -1px;
        left: 0;
        content: "";
        height: 1px;
        width: 100%;
        background-color: $websiteText;
      }
      &:hover {
        color: $websiteText;
      }
    }
  }
  .btn {
    margin-bottom: 65px;
    &-yellow {
      height: 80px;
      padding: 0 45px;
      border-radius: 40px;
      font-size: 14px;
      font-weight: 500;
      text-transform: uppercase;
      color: $websiteText;
      @media only screen and (max-width: 1299px) {
        height: 70px;
      }
      @media only screen and (max-width: 998px) {
        height: 60px;
        padding: 0 30px;
        margin-bottom: 50px;
      }
      &:hover {
        color: $websiteText;
      }
    }
  }
}
</style>