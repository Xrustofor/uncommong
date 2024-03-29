<template>
  <div class="switcher_overlay">
    <div class="switcher">
      <input
        type="checkbox"
        id="switch"
        v-model="switcher"
        @change="changeSwitchVal"
      />
      <label for="switch"></label>
    </div>
    <p>{{ title }}</p>
  </div>
</template>
<script>
export default {
  props: {
    switchDate: [Boolean, Number],
    title: { type: String, required: false },
  },
  data() {
    return {
      switcher: false,
    };
  },
  created() {
    this.switcher = this.switchDate;
  },
  watch: {
    switchDate() {
      this.switcher = this.switchDate;
    },
  },
  methods: {
    changeSwitchVal() {
      this.$emit("changeSwitchVal", this.switcher);
    },
  },
};
</script>
<style lang="scss" scoped>
.switcher_overlay {
  display: flex;
  align-items: center;
  margin-left: 10px;
  @media only screen and (max-width: 399px) {
    width: 100%;
    margin: 10px 0 0;
  }
  .switcher {
    input[type="checkbox"] {
      position: absolute;
      height: 0 !important;
      width: 0 !important;
      visibility: hidden;
      &:checked + label {
        background: $green;
        &:after {
          left: calc(100% - 2px);
          transform: translateX(-100%) translateY(-50%);
        }
      }
    }
    label {
      min-width: 0 !important;
      cursor: pointer;
      width: 32px;
      height: 22px;
      background: $red;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #efefef;
      border-radius: 30px;
      position: relative;
      margin-bottom: 0 !important;
      span {
        position: relative;
        display: inline-block;
        width: 16px;
        height: 16px;
        margin: 0;
        z-index: 2;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        @include transition();
      }
      &:after {
        content: "";
        position: absolute;
        top: 50%;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background-color: #fff;
        transition: 0.3s;
        left: 2px;
        transform: translateY(-50%);
      }
    }
  }
  p {
    font-size: 14px;
    color: #808080;
    font-weight: 700;
    margin-left: 10px;
    &:empty {
      margin: 0;
    }
  }
}
</style>