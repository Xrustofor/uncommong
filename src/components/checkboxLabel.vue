<template>
  <div>
    <label 
      class="checkbox"
      :class="disabled ? 'disabled' : ''"
    >
      <input
        type="checkbox"
        :disabled="disabled"
        :checked="value"
        @change="$emit('input', !value)"
      />
      <span class="square"></span>
      {{title}}
    </label>
</div>
</template>
<script>
export default {
  props:{
    disabled: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    value: {
      type: Boolean,
      default: false,
    }
  },
}
</script>

<style lang="scss" scoped>
  label {
    display: flex;
    align-items: center;
    font-size: 1.4rem;
    color: $violet;
    span{
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 1.6rem;
      max-width: 1.6rem;
      min-height: 1.6rem;
      max-height: 1.6rem;
      background: #FFFFFF;
      border-radius: 0.2rem;
      border: 2px solid #9A83B7;
      position: relative;
      transition: all 0.3s ease 0s;
      &.square{ margin-right: 1rem }
    }
    &.disabled { cursor: default; }
  }
  [type="checkbox"] ~ span {
    margin-right: 0;
  }
</style>