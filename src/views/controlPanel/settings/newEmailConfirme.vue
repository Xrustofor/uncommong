<template>
  <div>
    <div class="page-overlay-center">
      <div class="loader">
        <div class="loader-inner ball-clip-rotate">
          <div></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  name: "check-new-email-token",
  data() {
    return {
      emailToken: this.$route.params.token,
    };
  },
  mounted() {
    this.checkToken();
  },
  methods: {
    ...mapActions("user", ["verifyNewEmail"]),
    async checkToken() {
      var data = {
          token: this.emailToken,
        },
        self = this;
      var result = await this.verifyNewEmail(data);
      this.$swal({
        title: result.message,
        confirmButtonText: "OK",
      }).then(() => {
        self.$router.push({ path: "/settings" });
      });
    },
  },
};
</script>