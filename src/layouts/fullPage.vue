<template>
  <transition name="fade">
    <slot></slot>
  </transition>
</template>
<script>
export default {
  methods: {
    reloadPage() {
      window.location.reload();
    },
  },
  created() {
    this.$eventHub.$on("reload", this.reloadPage);
  },
};
</script>