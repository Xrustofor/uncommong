<template>
  <div class="dashboard__sidebar">
    <nav class="sidebar__nav">
      <ul class="menu">
        <li v-for="(item, id) in menu" :key="id" :class="item.className">
          <router-link :to="item.url" custom v-slot="{ href, navigate, isActive, isExactActive }">
            <div class="element">
              <a
                :href="href"
                @click="navigate"
                :class="[
                  isActive && 'router-link-active',
                  isExactActive && 'router-link-exact-active',
                ]"
              >
                <span>
                  <icon-base
                    class="icon"
                    width="20"
                    height="20"
                    :iconName="item.title"
                    :viewBox="item.viewBox ? item.viewBox : '0 0 18 18'"
                  >
                    <component :is="item.iconName" />
                  </icon-base>
                </span>
              </a>
              <p @click="navigate">{{ item.title }}</p>
            </div>
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>
<script>
import IconBase from '@/components/IconBase'
import iconProfile from '@/components/icons/iconProfile'
import iconDonations from '@/components/icons/iconDonations'
import iconCampaigns from '@/components/icons/iconCampaigns'
import iconSecurity from '@/components/icons/iconSecurity'
import iconSettings from '@/components/icons/iconSettings'
import iconFundraisers from '@/components/icons/iconFundraisers'
import iconTeams from '@/components/icons/iconTeams'
import iconBilling from '@/components/icons/iconBilling'
import iconMenu from '@/components/icons/iconMenu'

export default {
  props: {
    menu: {
      type: Array,
    },
  },
  components: {
    IconBase,
    iconProfile,
    iconDonations,
    iconSecurity,
    iconSettings,
    iconFundraisers,
    iconBilling,
    iconMenu,
    iconTeams,
    iconCampaigns,
  },
  computed: {
    currentPage() {
      return this.$route.path
    },
  },
}
</script>
<style lang="scss" scoped>
.dashboard__sidebar {
  max-width: 23.3rem;
  width: 100%;
  background: #ffffff;
  overflow: hidden;
  -webkit-transition: all 0.3s ease-in-out 0s;
  -moz-transition: all 0.3s ease-in-out 0s;
  transition: all 0.3s ease-in-out 0s;
  z-index: 2;
  .sidebar__nav {
    border: 1px solid $websiteViolet;
    display: flex;
    box-shadow: 0px 10px 20px rgba(142, 51, 31, 0.05);
    border-radius: 2rem;
    padding: 1.9rem 3rem;
    margin-bottom: 1.5rem;
    @media (max-width: 425px) {
      padding: 0;
    }
  }
  /* ---------- sidebar menu component ---------- */
  .menu {
    width: 100%;
    list-style: none;
    margin: 0;
    padding: 0;
    @include transition();
    @media (max-width: 425px) {
      display: flex;
      justify-content: space-between;
    }
    li {
      margin-bottom: 2rem;
      &:last-child {
        margin-bottom: 0;
      }
      a {
        display: flex;
        align-items: center;
        @include transition();
        span {
          background-color: #e5e8ea;
          transition: all linear 0.3s;
        }

        &.router-link-exact-active,
        &.router-link-active {
          span {
            background-color: $violet;
            transition: all linear 0.3s;
            svg {
              -webkit-filter: contrast(1) brightness(0) invert(1);
              filter: contrast(1) brightness(0) invert(1);
            }
          }
        }
      }
      .element {
        display: flex;
        align-items: center;
        .icon {
          margin-left: -2px;
          margin-top: -2px;
        }
        a span {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 4rem;
          height: 4rem;
          border-radius: 50%;
          svg {
            display: flex;
            justify-content: center;
            align-items: center;
            display: inline-block;
            stroke-width: 0;
            g {
              border: 1px solid red;
              display: inline-block;
              display: flex;
              stroke-width: 0;
            }
          }
        }
        p {
          font-size: 10px;
          font-weight: 700;
          color: $violet;
          margin-left: 1.5rem;
          cursor: pointer;
        }
      }
    }
  }

  @media only screen and (max-width: 768px) {
    max-width: none;
    width: auto;
    -webkit-transition: all 0.3s ease-in-out 0s;
    -moz-transition: all 0.3s ease-in-out 0s;
    transition: all 0.3s ease-in-out 0s;
    margin-right: 1.5rem;
    .sidebar__nav {
      padding: 0 1rem 1rem 0;
      border: 0;
    }
    .element {
      p {
        display: none;
      }
    }
  }
  @media (max-width: 425px) {
    .sidebar__nav {
      padding: 1.5rem 1.5rem 0;
    }
    margin-right: 0;
  }
}
</style>