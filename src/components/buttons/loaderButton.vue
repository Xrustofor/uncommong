<template>
  <button
    class="btn"
    :style="{ color: textColor }"
    :disabled="disabled || loading"
    @click.prevent="emitClick"
  >
    {{ text }}
    <span
      class="loader"
      :style="`border: 2px solid ${textColor}; border-bottom-color: transparent`"
      v-if="loading"
    ></span>
  </button>
</template>
<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      default: 'Send',
    },
    textColor: {
      type: String,
      default: '#454545',
    },
  },
  methods: {
    emitClick() {
      this.$emit('emitClick')
    },
  },
}
</script>

<style lang="scss" scoped>
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  .loader {
    margin-left: 10px;
    border-radius: 100%;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    height: 20px;
    width: 20px;
    max-width: 20px;
    max-height: 20px;
    min-height: 20px;
    min-width: 20px;
    background: transparent !important;
    -webkit-animation: rotate 0.75s 0s linear infinite;
    animation: rotate 0.75s 0s linear infinite;
  }
}

.second {
  padding: 8px 34px;
  color: $websiteText;
  background-color: $yellow;
  font-weight: bold;
  font-size: $fs3;
  line-height: $lh3;
  text-transform: uppercase;
  @media (max-width: $md) {
    padding: 22px 34px;
  }
}
</style>
