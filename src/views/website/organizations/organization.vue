<template>
  <div>
    <organizationHeader class="header" :image="banner.image" />
    <div class="container main">
      <section>
        <div class="section_top">
          <div class="left">
            <div
              class="logo"
              :style="{
                backgroundImage: `url(${logoImage})`,
                backgroundPosition: 'center',
                backgroundSize: organization.image ? '100%' : '80%',
              }"
            />
          </div>
          <div class="right">
            <h1>{{ organization.name }}</h1>
            <div class="button_soc">
              <router-link
                v-if="donationsAllowance"
                class="btn btn-yellow"
                :to="{
                  path: `/nonprofits/${organization.slug}/donate`,
                  hash: '#content',
                }"
                v-scroll-to="'#content'"
                >Donate</router-link
              >
              <iconsMedia
                v-if="socItem.length"
                class="social_list"
                :indent="7"
                :items="socItem"
                :sizeIcon="20"
                icon-color="#454545"
                icon-background="#ededed"
              />
            </div>
            <p>{{ organization.about_us }}</p>
          </div>
        </div>
      </section>
      <section class="section_navbar_body" id="content">
        <nav class="navbar">
          <localNavigation :items="localMenu" :rules="localMenuRules" />
        </nav>
        <div class="body">
          <ProgressBar class="progress_bar" :loading="localLoading" />
          <router-view></router-view>
        </div>
      </section>
    </div>
  </div>
</template>
<script>

import organizationHeader from './components/organizationHeader';
import iconsMedia from '@/common/website/iconsMedia';
import localNavigation from '@/common/website/localNavigation';
import ProgressBar from '@/components/progressBar.vue';
import IntroSection from '@/common/website/introSection.vue';
import { scroller } from "vue-scrollto/src/scrollTo";

import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    organizationHeader,
    IntroSection,
    iconsMedia,
    localNavigation,
    ProgressBar,
  },
  data() {
    return {
      banner: {
        image: {
          url: null,
          alt: '',
        },
        text: {
          title: '',
          subtitle: '',
          contentTitle: '',
          content: '',
        },
      },
      isDonate: false,
      localMenu: [
        {
          name: 'About Us',
          url: `/nonprofits/${this.$route.params.idNonprofits}/profile/`,
          bgColor: '#D3584B',
          key: 'about_us',
          hash: '#content',
        },
        {
          name: 'Fundraisers',
          url: `/nonprofits/${this.$route.params.idNonprofits}/fundraisers/`,
          bgColor: '#6DB5D1',
          key: 'fundraisers',
          hash: '#content',
        },
        {
          name: 'Gallery',
          url: `/nonprofits/${this.$route.params.idNonprofits}/gallery`,
          bgColor: '#71B078',
          key: 'gallery',
          hash: '#content',
        },
        {
          name: 'Donate',
          url: `/nonprofits/${this.$route.params.idNonprofits}/donate`,
          bgColor: '#EDBC33',
          key: 'donate',
          hash: '#content',
        },
      ],
      localMenuRules: {
        about_us: true,
        gallery: true,
        donate: false,
        fundraisers: false,
      },
    }
  },
  async mounted() {

    this.$store.dispatch('setLoader', true);
    await this.getApiOrganization(this.$route.params.idNonprofits);
    this.bannerCreate();
    await this.checkDonationsAllowance(this.organization.id);
    await this.apiGetIsFundraisers(this.organization.id);
    this.$store.dispatch('setLoader', false);

    const localMenuRules = {
      ...this.localMenuRules,
      about_us: true,
      gallery: this.isGalleryPage,
      donate: this.donationsAllowance,
      fundraisers: this.isFundraisersPage,
    }
    this.localMenuRules = localMenuRules;
  },
  watch:{
    loader(val){
      if(!val){
        const firstScrollTo = scroller();
        const { hash } = this.$route;
        if(hash){
          firstScrollTo(hash);
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      loader:'getWebsiteLoader',
    }),
    ...mapGetters('organizations/organizations', {
      organization: 'getOrganization',
      colors: 'getOrganizationColors',
      donationsAllowance: 'getDonationsAllowance',
      socItem: 'getSocialNetworks',
      localLoading: 'getlocalLoading',
      isGalleryPage: 'getIsGalleryPage',
      isFundraisersPage: 'getIsFundraisersPage',
    }),
    logoImage() {
      return this.organization.image
        ? this.organization.image
        : require(`@/assets/img/logo-blue.svg`)
    },
  },
  methods: {
    ...mapActions('organizations/organizations', [
      'getApiOrganization',
      'checkDonationsAllowance',
      'apiGetIsFundraisers',
    ]),
    bannerCreate() {
      var banner = {
        image: {
          url: this.organization.banner_image,
          alt: 'organization banner',
        },
        text: {
          title: this.organization.name,
          subtitle: this.organization.focus.title,
          content: this.organization.about_us,
        },
      }
      this.banner = banner;
    },
  },
}
</script>
<style lang="scss" scoped>
.header {
  margin: 0 2rem;
  margin-bottom: 5rem;
}
.main {
  margin-bottom: 16rem;
  flex: 1;
  position: relative;
  background-image: url('../../../assets/img/circule.svg');
  background-repeat: no-repeat;
  background-position-x: 90%;
  background-position-y: 200px;
  background-size: 50%;
}

.section_top {
  display: flex;
  @media only screen and (max-width: 768px) {
    flex-direction: column;
  }
  .left {
    max-width: 305px;
    width: 100%;
    min-height: 305px;
    height: 100%;
    margin-top: -120px;
    position: relative;
    @media only screen and (max-width: 768px) {
      max-width: 200px;
      min-height: 200px;
    }
    .logo {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 100%;
      background: center;
      background-repeat: no-repeat;
      background-color: #ffffff;
      border: 1px solid #63517a;
      box-sizing: border-box;
      box-shadow: 0px 5px 25px 3px rgba(154, 131, 183, 0.29);
      border-radius: 20px;
    }
  }
  .right {
    flex: 1;
    margin: 0 4rem;
    @media only screen and (max-width: 768px) {
      margin: 40px 0 0;
    }
    h1 {
      font-size: 4rem;
      font-weight: 900;
      margin-bottom: 1.8rem;
    }
    .button_soc {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      @media only screen and (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
      }
      & > * {
        margin-bottom: 20px;
      }
      .btn {
        text-transform: uppercase;
        font-family: Inter;
        font-style: normal;
        font-weight: bold;
        font-size: 1.4rem;
        box-shadow: 0px 6px 10px rgba(237, 188, 51, 0.3);
        opacity: 0.8;
        transition: linear 0.3s;
        &:hover {
          opacity: 1;
          transition: linear 0.3s;
        }
      }
    }
    p {
      color: $websiteText;
      font-family: Inter;
      font-style: normal;
      font-weight: normal;
      font-size: 1.8rem;
    }

    .social_list {
      display: flex;
      align-items: center;
      margin: 0 3rem 20px;
      @media only screen and (max-width: 768px) {
        margin: 0 0 20px;
        flex-wrap: wrap;
      }
    }
  }
}

.section_navbar_body {
  display: flex;
  flex-direction: row-reverse;
  padding-top: 11rem;
  @media only screen and (max-width: 768px) {
    flex-direction: column;
    padding-top: 6rem;
  }
  .navbar {
    max-width: 22rem;
    width: 100%;
    @media only screen and (max-width: 768px) {
      max-width: 100%;
      margin-bottom: 40px;
    }
  }
  .body {
    flex: 1;
    margin-right: 4.4rem;
    box-shadow: 0px 24px 20px rgba(154, 131, 183, 0.05), 0px 3px 2px rgba(154, 131, 183, 0.02),
      0px 8px 100px rgba(154, 131, 183, 0.1);
    border-radius: 10px;
    padding: 4.7rem 5rem;
    background: #fff;
    min-height: 500px;
    max-width: calc(100% - 22rem);
    @media only screen and (max-width: 768px) {
      margin-right: 0;
      padding: 40px;
      max-width: none;
    }

    @media only screen and (max-width: 425px) {
      padding: 1rem;
    }
    .message {
      h3 {
        text-align: center;
      }
    }
  }
}

.biography {
  display: flex;
  justify-content: space-between;
  padding-top: 75px;
  padding-bottom: 65px;
  @media only screen and (max-width: 998px) {
    padding-top: 50px;
    flex-direction: column;
  }
  &_text {
    flex: 1;
    padding-top: 22px;
    margin-right: 100px;
    @media only screen and (max-width: 1299px) {
      margin-right: 60px;
    }
    @media only screen and (max-width: 998px) {
      margin-bottom: 35px;
    }
    @media only screen and (max-width: 768px) {
      margin-right: 0;
    }
    p {
      font-size: 18px;
      line-height: 1.55;
      color: $websiteViolet;
      @media only screen and (max-width: 599px) {
        font-size: 16px;
      }
    }
  }
  .donation {
    width: 100%;
    max-width: 360px;
    min-height: 340px;
    border: 1px solid $websiteViolet;
    border-radius: 20px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    @media only screen and (max-width: 499px) {
      min-height: 300px;
    }
    h6 {
      max-width: 210px;
      margin: 0 auto;
      font-size: 20px;
      font-weight: 900;
      color: $websiteViolet;
      text-align: center;
      padding: 15px 0 20px;
    }
    .btn {
      min-width: 13rem;
    }
    .image {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      width: 16rem;
      height: 16rem;
      background-color: $violetBorder;
      border-radius: 50%;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      &.small {
        background-size: 80%;
      }
      @media only screen and (max-width: 998px) {
        width: 12rem;
        height: 12rem;
      }
      @media only screen and (max-width: 768px) {
        width: 10rem;
        height: 10rem;
      }
    }
  }
}
.footer_banner {
  .image {
    display: flex;
    justify-content: flex-end;
    position: relative;
    width: 100%;
    margin-bottom: 85px;
    @media only screen and (max-width: 998px) {
      margin-bottom: 40px;
    }
    img {
      position: relative;
      z-index: 2;
      width: calc(100% - ((100% - 1180px) / 2));
      height: 100%;
      border-top-left-radius: 20px;
      border-bottom-left-radius: 20px;
      @media only screen and (max-width: 1299px) {
        width: calc(100% - 10px);
      }
    }
    .bg {
      position: absolute;
      bottom: -85px;
      left: 0;
      width: 100vw;
      height: 78%;
      background-color: $textLightBlue;
      z-index: -1;
      @media only screen and (max-width: 998px) {
        height: 60%;
        bottom: -50px;
      }
    }
  }
}
</style>
