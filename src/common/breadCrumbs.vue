<template>
  <ul>
    <li 
      v-for="(item, key) in items"
      :key="`item-${key}`"
      :class="item.active ? 'active' : ''"
    >
      <template v-if="item.isLink">
        <router-link :to="item.url">
          {{ item.title ? item.title : '' }}
        </router-link>
      </template>
      <template v-else>
        <span>{{ item.title ? item.title : '' }}</span>
      </template>
    </li>
  </ul>
</template>
<script>
import { substituteId } from '@/helpers/script';

export default {
  data() {
    return {
      items: [],
    }
  },
  created() {
    this.createdItems();
  },
  watch: {
    $route() {
      this.createdItems();
    },
    namesParams() {
      this.createdItems();
    },
  },
  computed: {
    namesParams() {
      return this.$store.getters.getNamesParams;
    },
  },
  methods: {
    createdItems() {
      const { matched, meta, params } = this.$router.history.current;
      const path = this.$router.history.current.path;
      const items = [];
      let candidate = Object;

      matched.map((m) => {
        if (m.meta.title === 'id' && m.meta.title != false) {
          candidate = this.namesParams.find((np) => np.idName === m.meta.idName);
          items.push({
            url: substituteId(m.path, params),
            title: candidate ? candidate.title : '',
            isLink: m.meta.isLink,
            active: false,
          })
        } else if (m.meta.title != false) {
          items.push({
            url: substituteId(m.path, params),
            title: m.meta.title ? m.meta.title : '',
            isLink: m.meta.isLink,
            active: m.meta.title ? true : false,
          })
        }
      })

      items[items.length - 1].active = false;

      this.items = items;
    },
  },
}
</script>
<style lang="scss" scoped>
@import '@/assets/style/variables.scss';

ul {
  padding: 0 0 20px;

  li {
    display: inline-block;
    font-family: Inter;
    font-style: normal;
    font-weight: normal;
    font-size: 1.8rem;
    &::after {
      content: '>';
      margin: 0 5px;
    }
    &:last-child {
      &::after {
        content: none;
      }
    }
    a,
    span {
      font-family: Inter;
      font-style: normal;
      font-weight: normal;
      font-size: 1.4rem;
      color: $black;
      transition: opacity linear 0.3s;
    }
    a {
      position: relative;
      &:after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: -2px;
        height: 1px;
        background: $black;
      }
    }
  }
}
</style>