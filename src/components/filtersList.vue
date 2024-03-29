<template>
  <div class="filters_overlay">
    <button
      v-for="item in items"
      :key="item.key"
      :class="{ active: item.key == activeFilter }"
      @click.prevent="selectFilter(item)"
    >
      <span v-if="item.count !== false" class="count">{{ item.count }}</span>
      {{ item.title }}
      <span class="icon">
        <img :src="require(`@/assets/img/add.svg`)" alt="logo" />
      </span>
    </button>
  </div>
</template>
<script>
export default {
  props: { items: { type: Array }, active: { type: String } },
  data() {
    return {
      activeFilter: "all",
    };
  },
  watch: {
    active() {
      this.activeFilter = this.active;
    },
  },
  methods: {
    selectFilter(item) {
      this.activeFilter = item.key;
      this.$emit("selectFilter", item.key);
    },
  },
};
</script>
<style lang="scss" scoped>
.filters_overlay {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  flex: 1;
  padding: 5px 0;
  @media only screen and (max-width: 1299px) {
    min-width: 100%;
  }
  p {
    font-size: 14px;
    font-weight: 700;
    color: $websiteViolet;
    margin-right: 14.5px;
    margin-bottom: 0;
  }
  button {
    display: flex;
    align-items: center;
    font-size: 14px;
    line-height: 1.4;
    font-weight: 600;
    color: $websiteText;
    background-color: #fff;
    box-shadow: 0 3px 10px rgba(99, 81, 122, 0.22);
    border-radius: 20px;
    padding: 8px 5px 8px 15px;
    margin: 5px 12.5px;
    white-space: nowrap;
    @media only screen and (max-width: 1299px) {
      margin: 5px;
    }
    @media only screen and (max-width: 599px) {
      font-size: 13px;
    }
    .count {
      margin-right: 5px;
    }
    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 0;
      height: 0;
      margin-left: 5px;
      margin-right: 5px;
      img {
        width: 10px;
        transform: rotate(45deg);
      }
    }
    &.active {
      background-color: $violetLight;
      color: #fff;
      .icon {
        width: 15px;
        height: 15px;
      }
    }
  }
}
</style>