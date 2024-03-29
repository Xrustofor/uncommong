<template>
  <AuthContainer class="bg_lines">
    <form @submit.prevent="sendEmail">
      <div class="instruction__text">
        <h5 class="instruction__text_title">
          Send email verification code to complete registration
        </h5>
      </div>
      <button class="btn btn-yellow">Send code</button>
    </form>
  </AuthContainer>
</template>
<script>
import AuthContainer from "@/common/auth/authContainer.vue";
export default {
  name: "email-confirmation",
  data() {
    return {};
  },
  methods: {
    sendEmail() {
      this.axios
        .post("/email/send-verification")
        .then((res) => {
          this.$router.push({ name: "email-verification" });
        })
        .catch((error) => {
          //console.log(error);
        });
    },
  },
  components: {
    AuthContainer,
  },
};
</script>