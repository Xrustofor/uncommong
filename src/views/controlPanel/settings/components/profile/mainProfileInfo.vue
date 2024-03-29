<template>
  <div class="profile_info">
    <div class="form__row">
      <div class="form__row_side">
        <div class="form__field">
          <label>First name</label>
          <p>{{ user.first_name }}</p>
        </div>
        <div class="form__field">
          <label>Email</label>
          <p>{{ user.email }}</p>
        </div>
      </div>
      <div class="form__row_side">
        <div class="form__field">
          <label>Last name</label>
          <p>{{ user.last_name }}</p>
        </div>
        <div class="form__field">
          <label>Birthday</label>
          <p>{{ user.birth_day | _moment("MM.DD.YYYY", "MM/DD/YYYY") }}</p>
        </div>
      </div>
    </div>
    <div class="form__row" v-if="user.new_email">
      <div class="form__field full_width">
        <div class="form__row_col">
          <label>New email</label>
          <p>{{ user.new_email }}</p>
        </div>
        <LoaderButton
          class="btn-yellow"
          text="Resend Email Verification"
          :loading="resendLoader"
          @emitClick="resendEmail"
        ></LoaderButton>
      </div>
    </div>
  </div>
</template>
<script>
import { ValidationObserver, ValidationProvider } from "vee-validate";
import LoaderButton from "@/components/buttons/loaderButton.vue";

import DatePicker from "vue2-datepicker";
export default {
  props: {
    userInfo: { type: Object },
    userNew: { type: Object },
    serverErrors: { type: Object },
    editDisabled: { type: Boolean },
    btnLoader: { type: Boolean },
  },
  components: {
    DatePicker,
    ValidationObserver,
    ValidationProvider,
    LoaderButton,
  },
  data() {
    return {
      disabledAfter: new Date(),
      user: this.userInfo,
      resendLoader: false,
    };
  },
  watch: {
    userInfo: function () {
      this.user = this.userInfo;
    },
    userNew() {
      this.user = this.userNew;
    },
    btnLoader(newVal, oldVal) {
      if (newVal == false) {
        this.resendLoader = false;
      }
    },
  },
  methods: {
    changeInformation() {
      this.$refs.observer.validate().then((valid) => {
        this.$emit("validateForm", valid);
        this.$emit("changeUserInformation", this.user);
      });
    },
    resendEmail() {
      this.resendLoader = true;
      this.$emit("resendEmail", this.user.id);
    },
  },
};
</script>
<style lang="scss" scoped>
.profile_info {
  flex: 1;
}
.full_width {
  .btn {
    margin-left: 40px;
    @media only screen and (max-width: 998px) {
      margin-left: 0;
      margin-top: 20px;
    }
    @media only screen and (max-width: 499px) {
      width: 100%;
    }
  }
}
.form__field {
  margin-bottom: 40px;
  label {
    margin-bottom: 15px;
  }
  p {
    font-weight: 600;
  }
}
</style>