<template>
  <span>
    {{ title }}
    <span class="icon">
      <icon-base
        width="8"
        height="8"
        viewBox="0 0 6 8"
        icon-name="open"
        :icon-color="iconColor"
      >
        <icon-left />
      </icon-base>
    </span></span>
</template>
<script>
import IconBase from "@/components/IconBase";
import iconLeft from "@/components/icons/iconLeft";
export default {
  props: {
    title: { type: [String, Number] },
    iconColor: { type: String, default: "#63517A" },
  },
  components: {
    IconBase,
    iconLeft,
  },
};
</script>
<style lang="scss" scoped>
.icon {
  margin-left: 5px;
}
span.accordion {
  cursor: pointer;
  .icon {
    svg {
      transform: rotate(-90deg);
    }
  }
  &.open {
    .icon {
      svg {
        transform: rotate(-270deg);
      }
    }
  }
}
</style>