<template>
  <AuthContainer>
    <SecurityQuestionForm @setAnswer="onSetAnswer"/>
  </AuthContainer>
</template>
<script>
import AuthContainer from "@/common/auth/authContainer.vue";
import SecurityQuestionForm from "@/common/auth/securityQuestionForm.vue";
export default {
  name: "security-question-login",
  methods: {
    onSetAnswer(data) {
      const answers_for_questions = data;
      this.axios
        .post("/security-questions", answers_for_questions)
        .then((res) => {
          this.checkAuthMethod();
        })
        .catch((error) => {
          //console.log(error);
        });
    },
    checkAuthMethod() {
      var two_factor_method = this.$store.getters["user/getUser"]
        .two_factor_method;
      if (two_factor_method == 1) {
        this.axios
          .post("/email/send-verification")
          .then((res) => {
            this.$router.push({ name: "code-verification" });
          })
          .catch((error) => {
            //console.log(error);
          });
      } else {
        this.$router.push({ name: "answer-security-question" });
      }
    },
  },
  components: {
    AuthContainer,
    SecurityQuestionForm,
  },
};
</script>