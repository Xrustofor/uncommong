<template>
  <div class="box_column_container box_column_container-small full_height">
    <div class="content_center">
      <h6>You don't have any payment method</h6>
      <a @click.prevent="openAddModal" class="btn btn-yellow">
        Add Payment Method
      </a>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    openAddModal() {
      this.$emit("open");
    },
  },
};
</script>
<style lang="scss" scoped>
h6 {
  margin-bottom: 28px;
  text-align: center;
}
.btn {
  text-transform: uppercase;
  font-size: 14px;
  font-weight: 500;
  min-width: 20rem;
}
</style>