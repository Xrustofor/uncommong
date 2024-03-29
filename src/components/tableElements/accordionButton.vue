<template>
  <button
    class="accordion"
    @click.prevent.stop="$emit('clickBtn')"
    :disabled="disabled"
  >
    <icon-base
      width="11"
      height="11"
      viewBox="0 0 8 8"
      icon-name="download"
      icon-color="#63517A"
    >
      <icon-left />
    </icon-base>
  </button>
</template>
<script>
import IconBase from "@/components/IconBase";
import iconLeft from "@/components/icons/iconLeft";
export default {
  props: {
    iconColor: { type: String, default: "#63517A" },
    disabled: { type: Boolean, default: false },
  },
  components: {
    IconBase,
    iconLeft,
  },
};
</script>
<style lang="scss" scoped>
.accordion {
  cursor: pointer;
  width: 100%;
  height: 100%;
  &:disabled {
    cursor: default;
    opacity: 0.5;
  }
  svg {
    transform: rotate(-90deg);
    @include transition();
  }
  &.open {
    svg {
      transform: rotate(-270deg);
    }
  }
}
</style>