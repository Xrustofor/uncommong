<template>
  <button
    class="btn btn-img"
    :class="standart ? 'btn-alt btn-alt-violet' : false"
    @click.prevent="buttonEmit"
  >
    <img
      :src="require(`@/assets/img/${img.path}`)"
      :alt="img.alt"
      :class="img.className ? img.className : ''"
    />
    <span>{{ title }}</span>
  </button>
</template>
<script>
export default {
  props: {
    title: { type: String },
    img: { type: Object },
    standart: { type: Boolean, default: true },
  },
  methods: {
    buttonEmit() {
      this.$emit("buttonEmit");
    },
  },
};
</script>
<style lang="scss" scoped>
span {
  text-transform: uppercase;
  font-weight: 600;
  margin-left: 5px;
}
.btn-img {
  &.right {
    flex-direction: row-reverse;
  }
}
.rotate {
  transform: rotate(45deg);
}
</style>