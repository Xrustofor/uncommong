<template>
  <div class="sort">
    <h5>{{ title }}</h5>
    <div class="sort_overlay">
      <button
        v-for="(i, idx) in items"
        :key="idx"
        :class="{ active: i.active }"
        @click.prevent="selectSort(i)"
      >
        {{ i.title }}
      </button>
    </div>
  </div>
</template>
<script>
export default {
  props: { title: { type: String }, items: { type: Array } },
  methods: {
    selectSort(val) {
      this.$emit("selectSort", val);
    },
  },
};
</script>
<style lang="scss" scoped>
.sort {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  @media (max-width: 425px) {
    justify-content: space-between;
    padding-bottom: 1rem;
    border-bottom: 1px solid $fieldBorderColor;
  }
  h5 {
    font-size: 14px;
    font-weight: 700;
    color: $websiteViolet;
    margin-right: 7.5px;
  }
  &_overlay {
    display: flex;
    flex-wrap: wrap;
    button {
      font-size: 14px;
      font-weight: 700;
      color: $websiteViolet;
      padding: 7px 15px;
      margin: 0 7.5px;
      white-space: nowrap;
      border-radius: 40px;
      @media (max-width: 425px) {
        border: 1px solid $violet;
        margin: 5px 0;
      }
      &:hover {
        color: $settingsVioletText;
      }
      &.active {
        background: $websiteViolet;
        color: #fff;
      }
    }
  }
}
</style>