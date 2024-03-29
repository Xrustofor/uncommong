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
  name: "check-recovery-token",
  data() {
    return {
      userToken: this.$route.params.token,
    };
  },
  methods: {
    ...mapActions("auth", ["authUser", "accountLocked"]),
    async checkToken() {
      try {
        var userToken = {
          token: this.userToken,
        };
        var accountLocked = {
          isUserBlocked: true,
        };
        const resp = await this.axios.post(
          "/passwords/recovery-password/check-token",
          userToken
        );

        this.accountLocked(accountLocked);
        this.authUser(resp.data);
        this.authUser(resp.data);
        var accountLocked = {
          isUserBlocked: true,
        };
        this.accountLocked(accountLocked);

        this.$router.push({ name: "answer-security-question" });
        return resp;
      } catch (error) {
        this.$router.push({ name: "404" });
      }
    },
  },
  mounted() {
    this.checkToken();
  },
};
</script>