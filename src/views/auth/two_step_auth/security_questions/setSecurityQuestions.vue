<template>
  <AuthContainer>
    <BlockNewAccount
      v-if="registrationBlock"
      :register="true"
    ></BlockNewAccount>
    <SecurityQuestionForm
      @setAnswer="onSetAnswer"
      v-else
    ></SecurityQuestionForm>
  </AuthContainer>
</template>
<script>
import AuthContainer from "@/common/auth/authContainer.vue";
import SecurityQuestionForm from "@/common/auth/securityQuestionForm.vue";
import BlockNewAccount from "@/common/auth/blockNewAccount.vue";
import { mapActions } from "vuex";
export default {
  name: "security-question-register",
  components: {
    AuthContainer,
    SecurityQuestionForm,
    BlockNewAccount,
  },
  data() {
    return {
      registrationBlock: false,
    };
  },
  methods: {
    ...mapActions("auth", ["registrationBlock"]),
    async onSetAnswer(data) {
      // let returnLink = this.$store.getters.getReturnLink;
      // returnLink = {
      //   query: returnLink ? returnLink.query : {},
      //   url: returnLink ? returnLink.url : '',
      // }
      try {
        const answers_for_questions = data;
        const res = await this.axios.post(
          "/security-questions",
          answers_for_questions
        );

        var registerAllowance = this.$store.getters["user/getUser"].is_accepted;
        if (registerAllowance == 0) {
          await this.registrationBlock(true);
          this.$router.push({
            name: "login",
          });
        }
        // else if(returnLink.url){
        //   this.$router.push({ path: returnLink.url, query: {...returnLink.query }  });
        // } 
        else {
          this.$router.push({ path: "/admin/account/profile" });
        };
      } catch (error) {
        //console.log(error);
      }
    },
  },
};
</script>