<template>
  <div class="header">
    <div class="header_top">
      <div class="top_line container">
        <p>Uncommon Solutions. Guaranteed to do Good.</p>
      </div>
    </div>
    <div class="header__content container">
      <div class="header__cntent_left">
        <Menu :menu="menu" :menuClosed="menuClosed" @menuOpen="menuOpen" />
      </div>
      <div class="logo">
        <router-link to="/">
          <img :src="require(`@/assets/img/logo-blue.svg`)" alt="logo" />
        </router-link>
      </div>
      <div class="header__content_right">
        <ProfileInfo
          v-if="isAuthenticated"
          :profileClosed="profileClosed"
          @profileOpen="profileOpen"
        ></ProfileInfo>
        <p v-else>
          <span> Are you a Member? </span>
          <router-link to="/register">Register/</router-link
          ><router-link to="/login">Login</router-link>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import ProfileInfo from './components/profileInfo'
import Menu from './components/menu'
export default {
  props: {
    menuVisible: {
      type: Boolean,
    },
    profileVisible: {
      type: Boolean,
    },
  },
  components: {
    ProfileInfo,
    Menu,
  },
  data() {
    return {
      menu: [
        { id: 1, title: 'Home', url: '/' },
        { id: 2, title: 'Sweepstakes', url: '/sweepstakes' },
        { id: 3, title: 'Causes', url: '/nonprofits' },
        { id: 4, title: 'Fundraisers', url: '/fundraisers' },
        { id: 6, title: 'Nonprofit Login', path: process.env.VUE_APP_UNCOMMONGOOD_TEAMS },
        { id: 7, title: 'Organizations', path: process.env.VUE_APP_UNCOMMONGOOD_BUSINESS },
      ],
      menuClosed: true,
      profileClosed: true,
    }
  },
  computed: {
    isAuthenticated() {
      const token = this.$cookies.get('access_token')
      if (token != null) {
        return true
      } else return false
    },
  },
  watch: {
    menuVisible() {
      this.menuClosed = !this.menuVisible
    },
    profileVisible() {
      this.profileClosed = !this.profileVisible
    },
  },
  methods: {
    ...mapActions(['logout']),
    menuOpen() {
      this.$emit('menuOpen')
      this.menuClosed = false
    },
    profileOpen() {
      this.$emit('profileOpen')
      this.profileClosed = false
    },
  },
}
</script>
<style lang="scss" scoped>
.header {
  position: relative;
  .top_line {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 17px;
    padding-bottom: 17px;
    p {
      font-size: 14px;
      font-weight: 700;
      color: $websiteViolet;
      text-align: center;
    }
  }
  &_top {
    border-bottom: 1px solid $fieldBorderColor;
  }
  &__content {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    padding-top: 22px;
    padding-bottom: 32px;
    & > div {
      flex: 1;
      @media only screen and (max-width: 599px) {
        width: 50%;
        order: 2;
      }
    }
    &_right {
      display: flex;
      justify-content: flex-end;
      p {
        font-size: 14px;
        font-weight: 500;
        padding: 15px 0 15px 10px;
        color: $websiteViolet;
        cursor: pointer;
        text-align: right;
        @media only screen and (max-width: 499px) {
          font-size: 13px;
        }
        span {
          @media only screen and (max-width: 499px) {
            display: none;
          }
        }
        a {
          font-weight: 700;
          color: $websiteViolet;
          cursor: pointer;
          &:hover {
            color: $violetLight;
          }
        }
        &.diver {
          padding-left: 25px;
          margin-left: 25px;
          border-left: 1px solid $fieldBorderColor;
        }
      }
    }
    &_left {
      display: flex;
      justify-content: flex-start;
    }
  }
  .logo {
    img {
      margin: 0 auto;
      @media only screen and (max-width: 768px) {
        max-width: 150px;
      }
    }
    @media only screen and (max-width: 599px) {
      flex: 100%;
      width: 100%;
      order: 1;
      margin: 0 auto 15px;
    }
  }
}
</style>
