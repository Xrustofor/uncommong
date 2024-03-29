<template>
  <div class="page_header">
    <ul>
      <router-link
        v-for="item in menu"
        :to="item.url"
        :key="item.id"
        custom
        v-slot="{isActive, isExactActive, navigate }"
        >
          <li 
            :class="[isActive && 'router-link-active', isExactActive && 'router-link-exact-active']"
            :active="isActive"
            @click="navigate"
          >{{ item.title }}</li>
        </router-link
      >
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    menu: {
      type: Array,
    },
  },
};
</script>