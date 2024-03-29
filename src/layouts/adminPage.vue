<template>
  <transition name="fade">
    <Loader v-if="loader" key="1"/>
    <div
      class="dashboard"
      key="2"
      v-else
      @click="pageClick"
    >
      <Header
        @menuOpen="menuOpen"
        :menuVisible="menuVisible"
        @profileOpen="profileOpen"
        :profileVisible="profileVisible"
      />
      <div class="container">
        <BreadCrumbs />
      </div>
      <div class="dashboard__content container">
        <Sidebar :menu="menu" />
        <slot></slot>
      </div>
      <Footer></Footer>
    </div>
  </transition>
</template>
<script>
import Loader from '@/common/dashboard/loader.vue';
import BreadCrumbs from '../common/breadCrumbs';
import Header from '@/common/website/header/header.vue';
import Sidebar from '@/common/dashboard/sidebar.vue';
import Footer from '@/common/website/footer/footer.vue';

import { mapActions } from 'vuex'
export default {
  components: {
    Loader,
    Header,
    Sidebar,
    Footer,
    BreadCrumbs,
  },
  data() {
    return {
      loader: true,
      menuVisible: false,
      profileVisible: false,
      menu: [
        {
          id: 1,
          title: 'Profile',
          url: '/admin/account/profile',
          iconName: 'iconProfile',
        },
        {
          id: 2,
          title: 'Donations',
          url: '/admin/account/donations-history',
          iconName: 'iconDonations',
        },
        {
          id: 3,
          title: 'Entered Sweepstakes',
          url: '/admin/account/entered-sweepstakes',
          iconName: 'iconSettings',
        },
        {
          id: 4,
          title: 'Campaigns',
          url: '/admin/account/campaigns',
          iconName: 'iconCampaigns',
          viewBox: '0 0 15 15',
        },
        {
          id: 5,
          title: 'Supported Fundraisers',
          url: '/admin/account/supported-fundraisers',
          iconName: 'iconFundraisers',
          viewBox: '0 0 19 19',
        },
        {
          id: 6,
          title: 'Fundraisers Teams',
          url: '/admin/account/teams',
          iconName: 'iconTeams',
        },
        {
          id: 7,
          title: 'Billing',
          url: '/admin/account/billing',
          iconName: 'iconBilling',
        },
        {
          id: 8,
          title: 'Security',
          url: '/admin/account/security-settings',
          iconName: 'iconSecurity',
        },
      ],
    }
  },

  created() {
    this.$eventHub.$on('reload', this.reloadPage);
  },
  async mounted() {
    this.loader = true;
    await this.userInfo();
    this.loader = false;
  },
  methods: {
    ...mapActions('user', ['getApiUser']),
    async userInfo() {
      const token = this.$cookies.get('access_token');
      if (token != null) {
        await this.getApiUser();
      }
    },
    menuOpen(data) {
      this.menuVisible = true;
    },
    profileOpen() {
      this.profileVisible = true;
    },
    reloadPage() {
      window.location.reload();
    },
    pageClick() {
      this.menuVisible ? (this.menuVisible = !this.menuVisible) : false;
      this.profileVisible ? (this.profileVisible = !this.profileVisible) : false;
    },
  },
}
</script>
<style lang="scss" scoped>
.dashboard {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  .dashboard__content {
    @media (max-width: 425px) {
      padding-top: 0;
      flex-direction: column;
    }
  }
  &__content {
    position: relative;
    display: flex;
    height: 100%;
    background: #fff;
    -webkit-transition: all 0.3s ease 0s;
    -moz-transition: all 0.3s ease 0s;
    transition: all 0.3s ease 0s;
    overflow-y: auto;
    overflow-x: hidden;
    padding-top: 30px;
  }
}
</style>
