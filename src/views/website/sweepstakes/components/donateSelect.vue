<template>
  <div
    class="select_block"
    :class="focus ? 'active' : ''"
    :disabled="disabled"
    @click="select()"
  >
    <div class="icon_text">
      <span
        class="circle"
        :style="`background-color: rgba(${background}, .2) `"
        v-if="showIcon"
      >
        <icon-base
          class="icon"
          width="18"
          height="18"
          icon-name="ticket"
          :iconColor="colorIcon"
        >
          <iconTicket />
        </icon-base>
      </span>
      <span class="text">{{ text }}</span>
    </div>
    <button type="submit" :disabled="disabled">{{ `Donate $${price}` }}</button>
  </div>
</template>
<script>

import IconBase from "@/components/IconBase";
import iconTicket from "@/components/icons/iconTicket";

export default {
  props: {
    colorIcon: {
      type: String,
      default: "#6DB5D1",
    },
    focus: {
      type: Boolean,
      default: false,
    },
    showIcon: {
      type: Boolean,
      default: true,
    },
    text: {
      type: String,
      default: "Earn 100 entries",
    },
    price: {
      type: Number,
      default: 10,
    },
    disabled: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    IconBase,
    iconTicket,
  },
  computed: {
    background() {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
        this.colorIcon
      );
      return result
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
            result[3],
            16
          )}`
        : "0, 0, 0";
    },
  },
  methods: {
    select() {
      this.$emit("input", this.price);
    },
  },
};
</script>
<style lang="scss" scoped>
.select_block {
  border: 1px solid #f2eef9;
  border-radius: 30px;
  transition: opacity 0.3s;
  padding: 1.2rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  justify-content: space-between;
  &[disabled] {
    pointer-events: none;
  }
  &.active,
  &:hover {
    border-color: rgba($color: $yellow, $alpha: 0.4);
  }
  @media (max-width: 599px) {
    flex-direction: column;
  }
  .icon_text {
    display: flex;
    align-items: center;
    cursor: pointer;
    @media (max-width: 480px) {
      justify-content: space-between;
      margin-bottom: 1rem;
    }
  }
  .circle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    .icon {
      margin-top: -5px;
      margin-left: -5px;
    }
  }
  .text {
    font-family: Inter;
    font-style: normal;
    font-weight: normal;
    font-size: 1.8rem;
    color: $websiteViolet;
    margin: 0 1rem;
  }
  button {
    font-family: Inter;
    font-style: normal;
    font-weight: 500;
    font-size: 1.4rem;
    color: $websiteText;
    background: $yellow;
    border-radius: 20px;
    text-transform: uppercase;
    min-width: 140px;
    &:hover {
      background: $yellowHover;
      color: $websiteText;
    }
    &.disable,
    &:disabled {
      opacity: 1;
      background: rgba($color: $yellow, $alpha: 0.3);
      &:hover {
        background: rgba($color: $yellow, $alpha: 0.3);
        color: $websiteText;
      }
    }
  }
}
</style>