<template>
  <label class="checkbox-label">
    <input
      type="checkbox"
      :checked="checked"
      :disabled="disabled"
      v-model="input"
      @change="$emit('changed')"
    />
    <span class="checkbox-custom"></span>
    {{ label }}
  </label>
</template>
<script>
export default {
  props: {
    label: String,
    checked: {
      type: Boolean,
      default: false,
    },
    id: Number,
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    input: false,
  }),
  created() {
    this.input = this.checked;
  },
  watch: {
    checked(val) {
      this.input = val;
    },
    input(val) {
      this.$emit('input', val);
      this.$emit('select', { value: val, id: this.id });
    },
  },
}
</script>
<style lang="scss" scoped>
.checkbox-label {
  display: flex;
  justify-content: center;
  align-items: center;
}

.checkbox-custom {
  border: 2px solid #9a83b7;
  width: 16px;
  height: 16px;
}
input:checked ~ span {
  background: #6db5d1;
  border-color: #6db5d1;
  &::after {
    margin-right: 0px;
  }
}
</style>