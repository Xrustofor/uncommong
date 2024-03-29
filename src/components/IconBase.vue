<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    viewBox="0 0 18 18"
    :aria-labelledby="iconName"
    role="presentation"
    align="center"
  >
    <g :fill="iconColor">
      <slot :fill="iconColor" />
    </g>
  </svg>
</template>
<script>
export default {
  props: {
    iconName: {
      type: String,
      default: 'box',
    },
    width: {
      type: [Number, String],
      default: 18,
    },
    height: {
      type: [Number, String],
      default: 18,
    },
    iconColor: {
      type: String,
      default: 'currentColor',
    },
  },
  computed: {
    viewBox() {
      return `0 0 ${this.width} ${this.height}`
    },
  },
}
</script>
<style lang="scss" scoped>
svg {
  width: auto;
  height: auto;
}
</style>