<template>
  <input type="text" :placeholder="placeholder" v-model="input" />
</template>
<script>
export default {
  props: {
    placeholder: {
      type: [String, Number],
    },
    value: {
      type: [String, Number],
    }
  },
  data() {
    return {
      input: "",
    };
  },
  watch: {
    value(val) {
      this.input = val;
    },
    input(val) {
      this.input = String(val).replace(/[^\d]/g, "");
      if (+val[0] === 0) this.input = val.substr(1);
      this.$emit("input", this.input);
    },
  },
};
</script>
