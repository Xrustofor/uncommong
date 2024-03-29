<template>
  <AuthContainer>
    <ValidationObserver v-slot="{ invalid }" tag="div">
      <form class="form">
        <div class="instruction__text">
          <h4>Please, enter the password for access!</h4>
        </div>
        <div class="form__row">
          <ValidationProvider
            tag="div"
            class="form__field form__field_icon"
            name="password"
            :rules="{ required: true }"
            v-slot="{ errors }"
          >
            <input
              v-model="password"
              type="password"
              placeholder="Password"
              @input="changeField"
              :class="errors.length != 0 ? 'in-valid' : ''"
            />
            <span class="icon" :class="errors.length != 0 ? 'in-valid' : ''">
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path
                  d="M8.1601 8.60098L2.39841 13.7884C2.22937 13.9399 2.12685 14.1557 2.11694 14.3805L2.00086 16.9954C1.99068 17.2231 2.07129 17.4409 2.22807 17.6088C2.38459 17.7767 2.5985 17.8749 2.83014 17.8849L5.49173 17.9992C5.72338 18.0089 5.94511 17.9297 6.11571 17.7762L6.81013 17.151C6.963 17.0134 7.05899 16.8309 7.08482 16.631L7.37516 15.4967L8.55139 15.3114C8.97764 15.2935 9.3439 14.9636 9.3992 14.5479L9.6898 13.4126L10.865 13.2273C11.0703 13.2193 11.2641 13.1414 11.4162 13.0038L11.8782 12.588C13.4723 12.9699 15.1765 12.5473 16.3963 11.4489C17.3696 10.5726 17.9373 9.3748 17.9952 8.07552C18.0528 6.77649 17.5937 5.53436 16.7018 4.57804C15.8089 3.62042 14.5893 3.06139 13.2688 3.00474C11.9478 2.9481 10.6837 3.40025 9.7091 4.27788C8.48905 5.3757 7.91202 7.00692 8.1601 8.60098ZM13.9586 6.00574C14.251 6.0183 14.5207 6.14184 14.7185 6.35356C15.1265 6.79136 15.0965 7.47394 14.6512 7.87482C14.4349 8.06911 14.155 8.16908 13.8628 8.15652C13.5709 8.14396 13.3009 8.02041 13.1032 7.80843C12.9052 7.5962 12.8032 7.32117 12.816 7.03384C12.8288 6.7465 12.9548 6.48147 13.1705 6.28692C13.3868 6.09314 13.6664 5.99318 13.9586 6.00574Z"
                  fill="#63517A"
                />
              </svg>
            </span>
            <span class="error">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
        <p v-if="errors" class="error">
          <strong v-for="(error, id) in errors.password" :key="id">{{
            error
          }}</strong>
        </p>
        <div class="btn_wrapper">
          <LoaderButton
            class="btn-yellow"
            text="Continue"
            :loading="loading"
            :disabled="invalid"
            :class="invalid ? 'disable' : ''"
            @emitClick="verifyPassword"
          ></LoaderButton>
        </div>
      </form>
    </ValidationObserver>
  </AuthContainer>
</template>
<script>

import AuthContainer from "@/common/auth/authContainer.vue";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import LoaderButton from "@/components/buttons/loaderButton.vue";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    AuthContainer,
    ValidationObserver,
    ValidationProvider,
    LoaderButton,
  },
  data() {
    return {
      password: "",
      errors: null,
      loading: false,
    };
  },
  mounted() {
    this.$store.dispatch("setLoader", false);
    if (this.underConstruction == false) {
      this.$router.push({ path: "/" });
    }
  },
  computed: {
    ...mapGetters("underConstructionPage", {
      underConstruction: "getUnderConstruction",
    }),
  },
  watch: {
    underConstruction() {
      if (this.underConstruction == false) {
        this.$router.push({ path: "/" });
      }
    },
  },
  methods: {
    ...mapActions("underConstructionPage", ["underConstractionVerifPass"]),
    async verifyPassword() {
      this.loading = true;
      if (this.underConstruction) {
        var result = await this.underConstractionVerifPass(this.password);
        if (result.result) {
          this.$router.push("/");
        } else {
          this.errors = result.errors;
        }
      } else this.$router.push("/");
      this.loading = false;
    },
    changeField() {
      this.serverErrors = null;
    },
  },
};
</script>
<style lang="scss" scoped>
.error {
  color: $red;
}
</style>