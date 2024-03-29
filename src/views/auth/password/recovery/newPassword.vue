<template>
  <AuthContainer>
    <ValidationObserver
      ref="observer"
      v-slot="{ passes, invalid, errors }"
      tag="div"
    >
      <form @submit.prevent="passes(resetPassword)" class="form">
        <div class="instruction__text">
          <transition name="fade">
            <p v-if="serverErrors" class="error">
              <strong
                v-for="err in serverErrors.errors.email"
                :key="err"
                class="error error_long"
                >{{ err }}</strong
              >
              <strong
                v-for="err in serverErrors.errors.password"
                :key="err"
                class="error error_long"
                >{{ err }}</strong
              >
            </p>
            <p v-else>
              <strong>Fill this form to change the password</strong>
            </p>
          </transition>
        </div>
        <div class="form__row">
          <ValidationProvider
            tag="div"
            class="form__field form__field_icon"
            name="email"
            :rules="{ required: true }"
            v-slot="{ errors, valid }"
          >
            <input
              v-model="recovery.email"
              type="text"
              placeholder="Email"
              :class="errors.length != 0 ? 'in-valid' : ''"
            />
            <span class="icon" :class="errors.length != 0 ? 'in-valid' : ''">
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path
                  d="M16.6087 4H3.3913C3.02231 4 2.66842 4.14969 2.4075 4.41613C2.14658 4.68258 2 5.04396 2 5.42077V15.5792C2 15.956 2.14658 16.3174 2.4075 16.5839C2.66842 16.8503 3.02231 17 3.3913 17H16.6087C16.9777 17 17.3316 16.8503 17.5925 16.5839C17.8534 16.3174 18 15.956 18 15.5792V5.42077C18 5.04396 17.8534 4.68258 17.5925 4.41613C17.3316 4.14969 16.9777 4 16.6087 4ZM15.433 7.95683L10.953 10.571C10.6637 10.7433 10.3349 10.834 10 10.834C9.66513 10.834 9.33625 10.7433 9.04696 10.571L4.56696 7.95683C4.40665 7.86431 4.28881 7.71066 4.23926 7.52956C4.18971 7.34846 4.21249 7.15469 4.30261 6.99071C4.34806 6.90931 4.40882 6.83789 4.48141 6.78058C4.554 6.72326 4.63698 6.68117 4.72556 6.65674C4.81415 6.63231 4.90659 6.62602 4.99757 6.63823C5.08854 6.65043 5.17625 6.6809 5.25565 6.72787L9.73565 9.34208C9.81667 9.38747 9.90759 9.41126 10 9.41126C10.0924 9.41126 10.1833 9.38747 10.2643 9.34208L14.7443 6.72787C14.8237 6.6809 14.9115 6.65043 15.0024 6.63823C15.0934 6.62602 15.1859 6.63231 15.2744 6.65674C15.363 6.68117 15.446 6.72326 15.5186 6.78058C15.5912 6.83789 15.6519 6.90931 15.6974 6.99071C15.7875 7.15469 15.8103 7.34846 15.7607 7.52956C15.7112 7.71066 15.5933 7.86431 15.433 7.95683Z"
                  fill="#63517A"
                />
              </svg>
            </span>
          </ValidationProvider>
        </div>
        <div class="form__row">
          <ValidationProvider
            tag="div"
            class="form__field form__field_icon"
            name="password"
            :rules="{ required: true, verify_password: true, max: 50 }"
            v-slot="{ errors, valid }"
          >
            <input
              v-model="recovery.password"
              type="password"
              placeholder="Password"
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
            <span class="error error_long" v-if="errors[0] == 'too weak'"
              >Must have at least 8 characters, contain capitals “A”, numbers
              “9” and symbols “%”</span
            >
          </ValidationProvider>
        </div>
        <div class="form__row">
          <ValidationProvider
            tag="div"
            class="form__field form__field_icon"
            name="password_confirmation"
            rules="required|confirmed:password|max: 50"
            v-slot="{ errors, valid }"
          >
            <input
              v-model="recovery.password_confirmation"
              type="password"
              placeholder="Confirm Password"
              :class="valid ? 'valid' : errors.length != 0 ? 'in-valid' : ''"
            />
            <span
              class="icon confirm"
              :class="valid ? 'valid' : errors.length != 0 ? 'in-valid' : ''"
            >
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20ZM13.2261 6.32955C13.4134 6.12672 13.6682 6.0087 13.9366 6.00045C14.1444 5.99416 14.3491 6.054 14.524 6.17218C14.699 6.29036 14.8361 6.46138 14.9175 6.66293C14.9988 6.86447 15.0207 7.08719 14.9802 7.30202C14.9396 7.51685 14.8386 7.71382 14.6903 7.86723C13.7876 8.82081 12.9222 9.77683 12.0517 10.7384C11.171 11.7114 10.285 12.69 9.35018 13.6775C9.17081 13.8683 8.93093 13.9824 8.67659 13.9981C8.42225 14.0138 8.17137 13.93 7.97209 13.7627L5.38817 11.5838C5.28212 11.4944 5.19381 11.3838 5.12829 11.2584C5.06278 11.1331 5.02133 10.9953 5.00633 10.853C4.99133 10.7108 5.00306 10.5668 5.04085 10.4293C5.07864 10.2918 5.14176 10.1635 5.2266 10.0517C5.31143 9.93994 5.41633 9.84687 5.53529 9.77783C5.65425 9.70878 5.78495 9.66511 5.91993 9.64931C6.0549 9.63351 6.19151 9.64588 6.32194 9.68573C6.45238 9.72558 6.57409 9.79213 6.68013 9.88156L8.52656 11.4419C9.18452 10.7337 9.82891 10.0249 10.4759 9.31326C11.3733 8.3261 12.2757 7.3335 13.2261 6.32955Z"
                  fill="#63517A"
                />
              </svg>
            </span>
            <span class="error">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
        <button
          class="btn btn-yellow hidden"
          :disabled="invalid"
          :class="!invalid ? 'visible' : ''"
        >
          Login
        </button>
      </form>
    </ValidationObserver>
  </AuthContainer>
</template>
<script>
import AuthContainer from "@/common/auth/authContainer.vue";
import { ValidationObserver, ValidationProvider } from "vee-validate";

import { mapActions } from "vuex";
export default {
  props: {
    text: {
      type: String,
    },
  },
  components: {
    AuthContainer,
    ValidationObserver,
    ValidationProvider,
  },
  data() {
    return {
      serverErrors: null,
      recovery: {
        email: "",
        password: "",
        password_confirmation: "",
      },
    };
  },
  computed: {
    serverError() {
      if (this.serverErrors != null) {
        return this.serverErrors;
      }
    },
  },
  methods: {
    ...mapActions("auth", ["accountLocked"]),
    resetPassword() {
      var recovery = {
        email: this.recovery.email,
        password: this.recovery.password,
        password_confirmation: this.recovery.password_confirmation,
      };
      this.axios
        .post("/passwords/recovery-password", recovery)
        .then((res) => {
          var accountLocked = {
            isUserBlocked: false,
            errorText: "",
          };
          this.accountLocked(accountLocked);
          this.$router.push({ name: "login" });
        })
        .catch((error) => {
          this.serverErrors = error.response.data;
          //console.log(error.response.data);
        });
    },
  },
};
</script>