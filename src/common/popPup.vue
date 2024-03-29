<template>
  <div class="popPup" :class="value ? 'active' : ''" @click.self="clouse">
    <div class="modal_wrap">
      <div class="modal" :style="{ maxWidth: maxWidthModalLocal }">
        <span class="icon_close" @click="clouse">
          <icon-base width="15" height="15" icon-name="close">
            <icon-close />
          </icon-base>
        </span>
        <div class="top" v-if="title">
          <h3>{{ title }}</h3>
        </div>
        <div class="body" :style="{ maxWidth }">
          <slot name="body" />
        </div>
        <div class="footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import IconBase from "@/components/IconBase";
import iconClose from "@/components/icons/iconClose";

export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    title: String,
    maxWidth: {
      type: [String, Number],
      default: 470,
    },
    maxWidthModal: {
      type: [String, Number],
      default: 1153,
    },
  },
  components: {
    IconBase,
    iconClose,
  },
  data() {
    let maxWidthStr;
    if (
      (this.maxWidth && String(this.maxWidth).search(/%/i) != -1) ||
      String(this.maxWidth).search(/px/i) != -1
    ) {
      maxWidthStr = this.maxWidth;
    } else {
      maxWidthStr = `${+this.maxWidth}px`;
    }

    let maxWidtModalhStr;
    if (
      (this.maxWidth && String(this.maxWidthModal).search(/%/i) != -1) ||
      String(this.maxWidthModal).search(/px/i) != -1
    ) {
      maxWidtModalhStr = this.maxWidthModal;
    } else {
      maxWidtModalhStr = `${+this.maxWidthModal}px`;
    }

    return {
      maxWidthLocal: maxWidthStr,
      maxWidthModalLocal: maxWidtModalhStr,
    };
  },
  created() {
    if (this.value) {
      document.getElementsByTagName("html")[0].style.overflow = "hidden";
    } else {
      document.getElementsByTagName("html")[0].style.overflow = "auto";
    }
  },
  destroyed() {
    document.getElementsByTagName("html")[0].style.overflow = "auto";
  },
  watch: {
    value(val) {
      if (val) {
        document.getElementsByTagName("html")[0].style.overflow = "hidden";
      } else {
        document.getElementsByTagName("html")[0].style.overflow = "auto";
      }
    },
  },
  methods: {
    clouse() {
      this.$emit("input", false);
      document.getElementsByTagName("html")[0].style.overflow = "auto";
    },
  },
};
</script>
<style lang="scss" scoped>
.popPup {
  position: fixed;
  z-index: -1;
  opacity: 0;
  transition: linear all 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
  .modal {
    max-width: 1153px;
    padding: 4.5rem;
    width: 100%;
    background: #fff;
    min-height: 350px;
    box-shadow: 0px 4px 54px 20px rgba(0, 0, 0, 0.05);
    border-radius: 32px;
    margin-left: 15px;
    margin-right: 15px;
    position: relative;
     @media only screen and (max-width: 425px) {
      padding: 2rem;
     }
    .icon_close {
      position: absolute;
      z-index: 1;
      top: 25px;
      right: 25px;
      cursor: pointer;
    }
    .top {
      text-align: center;
      margin-top: 1.5rem;
      margin-bottom: 4rem;
      h3 {
        font-family: Inter;
        font-style: normal;
        font-weight: 800;
        font-size: 3rem;
        text-align: center;
        color: #4b3d5b;
      }
    }
    .body,
    .footer {
      max-width: 470px;
      width: 100%;
      margin: auto;
    }
    .body {
      margin-bottom: 3.2rem;
    }
    .footer {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
    }
  }
}
.popPup.active {
  overflow-y: auto;
  transition: linear all 0.3s;
  opacity: 1;
  z-index: 1000;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.modal_wrap{
  height: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>