<template>
  <div class="instruction__text">
    <p>
      <strong>{{ accountLocked }}</strong>
    </p>
    <div class="btn_wrapper center">
      <a class="btn btn-yellow" @click.prevent="toLogin">OK</a>
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    accountLocked() {
      return this.$store.getters["auth/accountLocked"].errorText;
    },
  },
  methods: {
    toLogin() {
      this.$emit("toLogin", false);
    },
  },
};
</script>
<style lang="scss" scoped>
.instruction__text p {
  max-width: 100%;
}
</style>