<template>
  <div class="input_label label_row">
    <label>
      {{ label }}
      <span>{{ required ? "*" : "" }}</span>
    </label>
    <template v-if="(type === 'text' || type === 'email') && !mask">
      <input
        :class="valid ? '' : 'error'"
        :type="type ? type : 'text'"
        :placeholder="placeholder"
        :disabled="disabled"
        v-model="input"
      />
    </template>
    <template v-if="mask">
      <input
        :class="valid ? '' : 'error'"
        :type="type"
        v-model="input"
        v-mask="mask"
        :disabled="disabled"
        :placeholder="placeholder"
      />
    </template>
  </div>
</template>
<script>
export default {
  props: {
    value: String,
    label: String,
    placeholder: String,
    required: { type: Boolean, default: false },
    type: { type: String, default: "text" },
    min: { type: Number, default: 3 },
    max: { type: Number, default: 50 },
    mask: String,
    disabled: { type: Boolean, default: false },
  },
  data: () => {
    return {
      input: "",
      valid: true,
    };
  },
  created() {
    this.input = this.value ? this.value : "";
  },
  watch: {
    value(val) {
      this.input = this.value;
    },
    input(val) {
      switch (this.type) {
        case "text": {
          if ((this.required && val) || (this.required && this.mask && val)) {
            this.valid = val.length >= this.min && val.length <= this.max;
          }
          break;
        }
        case "email": {
          const re =
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          this.valid = this.required ? re.test(val) : true;
          break;
        }
      }
      this.$emit("input", { val, valid: this.valid });
    },
  },
};
</script>
<style lang="scss" scoped>
.input_label.label_row {
  text-align: left;
  display: flex;
  flex-direction: column;
  label {
    display: block;
    font-family: Inter;
    font-style: normal;
    font-weight: 300;
    font-size: 12px;
    line-height: 16px;
    color: #63517a;
    margin-bottom: 6px;
  }
  span {
    color: #d3584b;
    font-weight: 300;
    font-size: 12px;
  }
  input {
    border: 1px solid #efefef;
    box-sizing: border-box;
    border-radius: 40px;
    padding: 15px 20px;
    width: 100%;
    max-width: none;
    font-family: Inter;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    color: #63517A;
    transition: all 0.3s;
    &:active,
    &:focus,
    &:target,
    &:visited {
      border: 1px solid #efefef;
      outline: none;
    }
    &.error {
      border: 1px solid red;
      transition: all 0.3s;
    }
  }
}
</style>
