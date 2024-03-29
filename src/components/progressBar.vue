<template>
  <div class="loading_position">
    <vue-progress-bar />
  </div>
</template>
<script>
export default {
  props: { loading: { type: false, default: false } },
  watch: {
    loading() {
      this.loading ? this.$Progress.start() : this.$Progress.finish();
    },
  },
};
</script>
<style lang="scss" scoped>
.loading_position {
  position: relative;
  margin: 0 10px;
  margin-bottom: 1px;
  z-index: 1;
}
</style>