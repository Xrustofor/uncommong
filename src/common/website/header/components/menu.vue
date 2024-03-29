<template>
  <div class="menu">
    <div class="menu_icon" @click.stop="menuOpen()">
      <img :src="require(`@/assets/img/menu.svg`)" alt="menu" />
      <p>Menu</p>
    </div>
    <ul class="menu_content" :class="{ open: menuVisible }">
      <li v-for="i in menu" :key="i.id">
        <router-link 
          v-if="i.url"
          :to="i.url"
          v-slot="{ href, navigate }"
          custom
        >
          <a 
            :href="href"
            @click="navigate"
          >
            {{ i.title }}
          </a>
        </router-link>
        <a :href="i.path" target="_blank" v-else>
          {{ i.title }}
        </a>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: { 
    menu: { type: Array },
    menuClosed: { type: Boolean },
  },
  data() {
    return {
      menuVisible: false,
    };
  },
  watch: {
    menuClosed(val) {
      this.menuVisible = !this.menuClosed;
    },
  },
  methods: {
    menuOpen() {
      this.menuVisible = !this.menuVisible;
      this.$emit("menuOpen");
    },
  },
};
</script>
<style lang="scss">
.menu {
  position: relative;
  &_icon {
    display: flex;
    align-items: center;
    cursor: pointer;
    p {
      font-size: 14px;
      font-weight: 700;
      color: $websiteViolet;
      @media only screen and (max-width: 499px) {
        margin-left: 5px;
      }
    }
  }
  &_content {
    min-width: 284px;
    bottom: -20px;
    transform: translateY(100%);
    position: absolute;
    border-radius: 18px;
    border: 1px solid $fieldBorderColor;
    background: #fff;
    opacity: 0;
    z-index: -1;
    visibility: hidden;
    @include transition();
    &.open {
      opacity: 1;
      visibility: visible;
      z-index: 9;
    }
    li {
      &:first-of-type {
        border-top-left-radius: 18px;
        border-top-right-radius: 18px;
      }
      &:last-of-type {
        border-bottom-left-radius: 18px;
        border-bottom-right-radius: 18px;
      }
      background: transparent;
      &:hover {
        background: $fieldBorderColor;
      }
      a {
        display: block;
        padding: 15px 20px;
        font-size: 14px;
        line-height: 1;
        color: $violet;

        &.router-link-exact-active {
          font-weight: 700;
        }
      }
    }
  }
}
</style>