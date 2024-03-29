<template>
  <div class="footer" :class="isSweepstakePage ? 'footer_slider' : ''">
    <div class="carousel_title" v-if="isSweepstakePage && sweepstakesData.length > 0">
      <div class="top_title container">
        <p>Check out more Prizes</p>
      </div>
      <CarouselSlider v-show="!loade" :items="sweepstakesData || []" />
    </div>
    <Subscribe></Subscribe>
    <div class="container">
      <LegalStuff :rules="details.rules" v-if="isSweepstakePage"></LegalStuff>
      <div class="content">
        <div>
          <h2>Let’s build change together.</h2>
          <Social class="dark"></Social>
        </div>
        <Menu :menu="menu"></Menu>
      </div>
    </div>
    <div class="bottom_line container">
      <p>© 2021 UncommonGood</p>
      <p>
        <router-link to="/privacy-policy">Privacy Policy</router-link
        ><router-link to="/terms-of-service">Terms of Use</router-link>
      </p>
    </div>
  </div>
</template>
<script>
import Social from '@/common/website/social.vue'
import Subscribe from './components/subscribe.vue'
import Menu from './components/menu.vue'
import CarouselSlider from './components/carouselSlider'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import LegalStuff from './components/legalStuff.vue'
export default {
  components: {
    Subscribe,
    Social,
    Menu,
    CarouselSlider,
    LegalStuff,
  },
  data() {
    return {
      menu: [
        { id: 1, title: 'Home', url: '/' },
        { id: 2, title: 'Sweepstakes', url: '/sweepstakes' },
        { id: 3, title: 'Causes', url: '/nonprofits' },
        { id: 4, title: 'Privacy Policy', url: '/privacy-policy' },
        { id: 5, title: 'Terms of Service', url: '/terms-of-service' },
        { id: 6, title: 'Nonprofit Login', path: process.env.VUE_APP_UNCOMMONGOOD_TEAMS },
        { id: 7, title: 'Organizations', path: process.env.VUE_APP_UNCOMMONGOOD_BUSINESS },
      ],
      isSweepstakePage: false,
    }
  },
  async created() {
    const title = this.$route.meta.title
    this.isSweepstakePage = false
    this.setLoade(false)
    switch (title) {
      case 'sweepstake': {
        this.isSweepstakePage = true
        await this.apiGetSweepstakesData(this.details.id)
        break
      }
      default: {
        this.isSweepstakePage = false
      }
    }
  },
  watch: {
    async details() {
      await this.apiGetSweepstakesData(this.details.id)
    },
    async $route(val) {
      const title = val.meta.title
      this.isSweepstakePage = false
      this.setLoade(false)
      switch (title) {
        case 'sweepstake': {
          await this.apiGetSweepstakesData(this.details.id)
          this.isSweepstakePage = true
          break
        }
        default: {
          this.isSweepstakePage = false
        }
      }
    },
  },
  computed: {
    ...mapGetters('publicweb/footer', {
      sweepstakesData: 'getSweepstakesData',
      loade: 'getLoade',
    }),
    ...mapGetters('publicweb/sweepstake', {
      details: 'getDetails',
    }),
  },
  methods: {
    ...mapMutations('publicweb/footer', ['setLoade']),
    ...mapActions('publicweb/footer', ['apiGetSweepstakesData']),
  },
}
</script>
<style lang="scss" scoped>
.footer_slider {
  padding-top: 0px;
}
.carousel_title {
  margin-top: -20rem;
  display: block;
  margin-left: -15rem;
  margin-right: -15rem;
  margin-bottom: 0;
  z-index: 1;
  @media (max-width: 1299px) {
    margin-bottom: 0;
    margin-left: 0rem;
    margin-right: 0rem;
  }
  .top_title {
    margin-bottom: 50px;
    @media only screen and (max-width: 768px) {
      margin-bottom: 90px;
    }
    p {
      font-weight: 800;
      font-size: 30px;
      line-height: 3.6rem;
      color: #317d9b;
    }
  }
}
.footer {
  padding-top: 4.5rem;
  background-color: $violetLight;
}
.content {
  background-color: #fff;
  border-radius: 10px;
  padding: 35px;
  margin: 30px auto 15px;
  & > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: 45px;
    @media only screen and (max-width: 1299px) {
      margin-bottom: 15px;
    }
    @media only screen and (max-width: 998px) {
      margin-bottom: 15px;
    }
  }
  h2 {
    font-size: 30px;
    color: $violetDark;
    font-weight: 900;
    margin-bottom: 15px;
    margin-right: 15px;
  }
}
.bottom_line {
  display: flex;
  justify-content: space-between;
  padding-top: 15px;
  padding-bottom: 20px;
  @media only screen and (max-width: 499px) {
    flex-direction: column-reverse;
    align-items: center;
  }
  p {
    padding: 0 15px;
    font-size: 13px;
    color: #fff;
    a {
      padding: 0 0 0 15px;
      font-size: 13px;
      color: #fff;
      &:hover {
        color: $textLightBlue;
      }
    }
    @media only screen and (max-width: 499px) {
      padding: 0;
      margin-bottom: 15px;
      &:first-of-type {
        margin-bottom: 0;
      }
      a {
        padding: 0 10px;
      }
    }
  }
}
</style>