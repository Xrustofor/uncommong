<template>
  <div class="settings_blocks">
    <div class="settings_blocks_header">
      <h4 class="title">2-Step Authentication Method</h4>
    </div>
    <label class="radio">
      <input
        name="verificationMethod"
        type="radio"
        :value="1"
        :checked="true"
        v-model="twoFactorMethod"
        @change="changeFactorMethodChanged"
      />
      <span class="circle"></span>
      <span class="text">Email</span>
    </label>
    <label class="radio">
      <input
        name="verificationMethod"
        type="radio"
        :value="2"
        v-model="twoFactorMethod"
        @change="changeFactorMethodChanged"
      />
      <span class="circle"></span>
      <span class="text"> Security Question</span>
    </label>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      twoFactorMethod: 1,
    };
  },
  async mounted() {
    this.twoFactorMethod = JSON.parse(
      JSON.stringify(this.user)
    ).two_factor_method;
  },
  computed: {
    ...mapGetters("user", {
      user: "getUser",
    }),
  },
  methods: {
    ...mapActions("user", ["twoFactorChange"]),
    async changeFactorMethodChanged() {
      var result = await this.twoFactorChange(this.twoFactorMethod);
      if (result) {
        this.$swal({
          title: "Your 2-Step Authentication Method was successfully updated",
          confirmButtonText: "OK",
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
label.radio {
  width: auto;
  margin: 10px;
}
</style>