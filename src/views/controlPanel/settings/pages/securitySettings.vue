<template>
  <div>
    <template>
      <PageHeader title="Security"/>
      <div class="form_overlay">
        <ResetPassword @somethingChanged="passwordChanges"/>
        <TwoFactor/>
        <SecurityQuestions
          v-show="user.two_factor_method == 2"
          :somethingChanged="questionChanged"
          @changeQuestion="changeQuestion"
          @saveSecurityChanges="saveChanges"
        ></SecurityQuestions>
      </div>
    </template>
  </div>
</template>
<script>
import PageHeader from "../components/pageHeader";
import ResetPassword from "../components/security/resetPassword";
import TwoFactor from "../components/security/2FA";
import SecurityQuestions from "../components/security/securityQuestions";

import { mapActions, mapGetters, mapMutations } from "vuex";
export default {
  name: "security-settings",
  components: {
    PageHeader,
    ResetPassword,
    SecurityQuestions,
    TwoFactor,
  },
  data() {
    return {
      questionChanged: false,
      somethingChanged: false,
    };
  },
  computed: {
    ...mapGetters("user", { user: "getUser" }),
  },
  beforeRouteLeave(to, from, next) {
    if (this.somethingChanged) {
      const answer = window.confirm(
        "Do you want to leave? You have unsaved changes!"
      );
      if (answer) {
        next();
      } else {
        next(false);
      }
    } else next();
  },
  methods: {
    ...mapActions("user", ["getApiUser", "changeSecurity"]),
    ...mapMutations("user", ["setUser"]),
    changeQuestion() {
      this.questionChanged = true;
      this.somethingChanged = true;
    },
    passwordChanges(val) {
      this.somethingChanged = val;
    },
    async saveChanges(data) {
      var result = await this.changeSecurity(data);
      if (result) {
        this.$swal({
          title: "Your security questions was successfully updated",
          confirmButtonText: "OK",
        });
      }
      this.questionChanged = false;
      this.somethingChanged = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.form_overlay {
  width: 100%;
  max-width: 420px;
  .settings_blocks {
    padding-bottom: 60px;
    border-bottom: 1px solid $violetBorder;
    .btn_overlay {
      display: flex;
      justify-content: flex-end;
    }
  }
  .form__field {
    margin-bottom: 40px;
    label {
      margin-bottom: 15px;
    }
    div {
      position: relative;
    }
  }
  .sub_title {
    font-size: 24px;
    font-weight: 400;
    margin: 20px 0 35px;
    @media only screen and (max-width: 768px) {
      font-size: 20px;
    }
  }
}
</style>