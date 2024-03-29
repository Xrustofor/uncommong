<template>
  <AuthContainer>
    <ValidationObserver 
      ref="observer"
      v-slot="{ passes, invalid }"
      tag="div"
    >
      <form @submit.prevent="passes(forgotPassword)" class="form">
        <div class="instruction__text">
          <p v-if="serverErrors.errors.email" class="error">
            <strong
              v-for="(error, id) in serverErrors.errors.email"
              :key="id"
              >{{ error }}</strong
            >
          </p>
          <p v-else>
            <strong>Enter your account Email to reset your password</strong>
          </p>
        </div>
        <div class="form__row">
          <ValidationProvider
            tag="div"
            class="form__field form__field_icon"
            name="email"
            :rules="{ required: true, email: true, max: 200 }"
            v-slot="{ errors }"
          >
            <input
              v-model="user.email"
              type="text"
              placeholder="Email"
              @input="changeField"
              :class="
                errors.length != 0 || serverErrors.errors.email
                  ? 'in-valid'
                  : ''
              "
            />
            <span
              class="icon"
              :class="
                errors.length != 0 || serverErrors.errors.email
                  ? 'in-valid'
                  : ''
              "
            >
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path
                  d="M16.6087 4H3.3913C3.02231 4 2.66842 4.14969 2.4075 4.41613C2.14658 4.68258 2 5.04396 2 5.42077V15.5792C2 15.956 2.14658 16.3174 2.4075 16.5839C2.66842 16.8503 3.02231 17 3.3913 17H16.6087C16.9777 17 17.3316 16.8503 17.5925 16.5839C17.8534 16.3174 18 15.956 18 15.5792V5.42077C18 5.04396 17.8534 4.68258 17.5925 4.41613C17.3316 4.14969 16.9777 4 16.6087 4ZM15.433 7.95683L10.953 10.571C10.6637 10.7433 10.3349 10.834 10 10.834C9.66513 10.834 9.33625 10.7433 9.04696 10.571L4.56696 7.95683C4.40665 7.86431 4.28881 7.71066 4.23926 7.52956C4.18971 7.34846 4.21249 7.15469 4.30261 6.99071C4.34806 6.90931 4.40882 6.83789 4.48141 6.78058C4.554 6.72326 4.63698 6.68117 4.72556 6.65674C4.81415 6.63231 4.90659 6.62602 4.99757 6.63823C5.08854 6.65043 5.17625 6.6809 5.25565 6.72787L9.73565 9.34208C9.81667 9.38747 9.90759 9.41126 10 9.41126C10.0924 9.41126 10.1833 9.38747 10.2643 9.34208L14.7443 6.72787C14.8237 6.6809 14.9115 6.65043 15.0024 6.63823C15.0934 6.62602 15.1859 6.63231 15.2744 6.65674C15.363 6.68117 15.446 6.72326 15.5186 6.78058C15.5912 6.83789 15.6519 6.90931 15.6974 6.99071C15.7875 7.15469 15.8103 7.34846 15.7607 7.52956C15.7112 7.71066 15.5933 7.86431 15.433 7.95683Z"
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
          :class="invalid ? 'disable' : ''"
        >
          Reset Password
        </button>
      </form>
    </ValidationObserver>
  </AuthContainer>
</template>
<script>
import AuthContainer from "@/common/auth/authContainer.vue";
import { ValidationObserver, ValidationProvider } from "vee-validate";
export default {
  name: "forgot-password",
  data() {
    return {
      user: {
        email: "",
      },
      serverErrors: {
        errors: {
          email: null,
        },
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
    forgotPassword() {
      const email = {
        email: this.user.email,
      };
      this.axios
        .post("/passwords/forgot-password/donors/send-email", email)
        .then((res) => {
          var message = res.data.message;

          this.resetForm();
          this.$swal({
            title: message,
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.value) {
              this.$router.push({ name: "login" });
            }
          });
        })
        .catch((error) => {
          this.serverErrors = error.response.data;
          //console.log(error);
        });
    },
    changeField() {
      this.serverErrors.errors.email = null;
    },
    resetForm() {
      this.$nextTick(() => {
        this.user = {
          email: "",
        };
        this.$refs.observer.reset();
      });
    },
  },
  components: {
    AuthContainer,
    ValidationObserver,
    ValidationProvider,
  },
};
</script>