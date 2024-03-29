<template>
  <div class="main-page">
    <Loader v-show="loader" key="1"/>
    <div 
      class="page_overlay"
      v-show="!loader"
      key="2"
      @click="pageClick"
    >
      <Header
        @menuOpen="menuOpen"
        :menuVisible="menuVisible"
        @profileOpen="profileOpen"
        :profileVisible="profileVisible"
      ></Header>
      <div class="content"><slot></slot></div>
      <Footer/>
    </div>
  </div>
</template>
<script>
import Loader from "@/common/dashboard/loader.vue";
import Header from "@/common/website/header/header.vue";
import Footer from "@/common/website/footer/footer.vue";

import { mapGetters } from "vuex";
export default {
  components: {
    Loader,
    Header,
    Footer,
  },
  data() {
    return {
      menuVisible: false,
      profileVisible: false,
    };
  },
  created() {
    this.$eventHub.$on("reload", this.reloadPage);
  },
  computed: {
    ...mapGetters({
      loader: "getWebsiteLoader",
    }),
  },
  methods: {
    reloadPage() {
      window.location.reload();
    },
    menuOpen() {
      this.menuVisible = true;
    },
    profileOpen() {
      this.profileVisible = true;
    },
    pageClick() {
      this.menuVisible ? (this.menuVisible = !this.menuVisible) : false;
      this.profileVisible
        ? (this.profileVisible = !this.profileVisible)
        : false;
    },
  },
};
</script>
<style lang="scss" scoped>
.main-page {
  position: relative;
  min-height: 100vh;
}
</style>