<template>
  <div class="page-overlay-center">
    <div class="loader">
      <div class="loader-inner ball-clip-rotate">
        <div></div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  name: "check-forgot-token",
  data() {
    return {
      userToken: this.$route.params.token,
    };
  },
  methods: {
    ...mapActions("auth", ["authUser", "resetPassword"]),
    async checkToken() {
      try {
        var userToken = {
          token: this.userToken,
        };
        const resp = await this.axios.post(
          "/passwords/forgot-password/check-token",
          userToken
        );
        this.authUser(resp.data);

        await this.resetPassword(true);
        this.$router.push({ name: "answer-security-question" });

        return resp;
      } catch (error) {
        this.$router.push({ name: "404" });
        console.log("error", error);
        // appropriately handle the error
      }
    },
  },
  mounted() {
    this.checkToken();
  },
};
</script>