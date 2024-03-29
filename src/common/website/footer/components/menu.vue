<template>
  <ul class="menu">
    <li v-for="i in menu" :key="i.id">
      <a v-if="i.url" :href="i.url" @click.prevent="handleClick(i.url)">
        {{ i.title }}</a
      >
      <a :href="i.path" target="_blank" v-else>
        {{ i.title }}
      </a>
    </li>
  </ul>
</template>
<script>
import { scrollToTop } from "@/mixins/scrollToTop";
export default {
  props: {
    menu: {
      type: Array,
    },
  },
  mixins: [scrollToTop],
  methods: {
    handleClick(url) {
      if (this.$route.path === url) this.scrollToTop();
      else this.$router.push(url);
    },
  },
};
</script>
<style lang="scss" scoped>
.menu {
  width: 100%;
  display: flex;
  margin: 0;
  @media only screen and (max-width: 599px) {
    flex-direction: column;
  }
  li {
    margin: 0 30px 8px 0;
    a {
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
      cursor: pointer;
    }
  }
}
</style>