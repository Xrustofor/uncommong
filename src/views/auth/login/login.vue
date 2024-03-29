<template>
  <AuthContainer :class="isBlockedForSomeTime || accountBlock ? 'bg_pink' : ''">
    <BlockNewAccount
      v-if="registerBlock"
      :text="registationBlockText"
    ></BlockNewAccount>
    <AccountBlocked
      v-else-if="accountBlock"
      @toLogin="toLogin"
    ></AccountBlocked>
    <ValidationObserver 
      ref="observer"
      v-slot="{ invalid }"
      tag="div" v-else
    >
      <form class="form">
        <div class="instruction__text">
          <transition name="fade">
            <p v-if="serverErrors.errors.email != null" class="error">
              <strong
                v-for="err in serverErrors.errors.email"
                :key="err"
                class="error error_long"
                >{{ err }}</strong
              >
            </p>
          </transition>
          <transition name="fade">
            <p v-if="serverErrors.errors.password != null" class="error">
              <strong
                v-for="err in serverErrors.errors.password"
                :key="err"
                class="error error_long"
                >{{ err }}</strong
              >
            </p>
          </transition>
          <transition name="fadeEl">
            <p v-if="roleError.error != null" class="error">
              <strong class="error error_long">{{ roleError.error }}</strong>
            </p>
          </transition>
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
                errors.length != 0 || serverErrors.errors.email != null
                  ? 'in-valid'
                  : ''
              "
              :disabled="isBlockedForSomeTime"
            />
            <span
              class="icon"
              :class="
                errors.length != 0 || serverErrors.errors.email != null
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
            <transition name="fade">
              <span class="error">{{ errors[0] }}</span>
            </transition>
          </ValidationProvider>
        </div>
        <div class="form__row">
          <!-- Password -->
          <ValidationProvider
            tag="div"
            class="form__field form__field_icon"
            name="password"
            :rules="{ required: true }"
            v-slot="{ errors }"
          >
            <input
              v-model="user.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Password"
              :class="
                errors.length != 0 ||
                serverErrors.errors.email != null ||
                serverErrors.errors.password != null
                  ? 'in-valid'
                  : ''
              "
              :disabled="isBlockedForSomeTime"
            />
            <span
              class="icon icon_eye"
              :class="
                errors.length != 0 ||
                serverErrors.errors.email != null ||
                serverErrors.errors.password != null
                  ? 'in-valid'
                  : ''
              "
              @click="showPassword = !showPassword"
            >
              <icon-base
                width="10"
                height="10"
                icon-name="eye"
                icon-color="#63517a"
              >
                <icon-eye v-if="showPassword" />
                <icon-eye-hide v-else />
              </icon-base>
            </span>
            <router-link to="/forgot-password" class="reset underline"
              >Forgot Password
            </router-link>
          </ValidationProvider>
        </div>
        <div class="form__actions">
          <label
            class="checkbox"
            :class="isBlockedForSomeTime ? 'disabled' : ''"
          >
            <input
              v-model="user.remember_me"
              type="checkbox"
              :disabled="isBlockedForSomeTime"
            />
            <span></span>
            Remember Me
          </label>

          <LoaderButton
            class="btn-yellow"
            :class="invalid || isBlockedForSomeTime ? 'disable' : 'visible'"
            text="Login"
            :loading="saveLoading"
            :disabled="invalid || isBlockedForSomeTime"
            @emitClick="loginUser"
          ></LoaderButton>
        </div>
        <div class="btn_wrapper">
          <div class="to__login">
            Haven’t got an account yet?
            <router-link to="/register">Sign up!</router-link>
          </div>
        </div>
      </form>
    </ValidationObserver>
  </AuthContainer>
</template>
<script>
import AuthContainer from "@/common/auth/authContainer.vue";
import BlockNewAccount from "@/common/auth/blockNewAccount.vue";
import AccountBlocked from "./components/accountLocked";

import { ValidationObserver, ValidationProvider } from "vee-validate";
import LoaderButton from "@/components/buttons/loaderButton.vue";
import IconBase from "@/components/IconBase";
import iconEye from "@/components/icons/iconEye";
import iconEyeHide from "@/components/icons/iconEyeHide";

import { mapActions } from "vuex";
export default {
  name: "login",
  components: {
    AuthContainer,
    BlockNewAccount,
    AccountBlocked,
    ValidationObserver,
    ValidationProvider,
    LoaderButton,
    IconBase,
    iconEye,
    iconEyeHide,
  },
  data() {
    return {
      registerBlock: false,
      accountBlock: false,
      registationBlockText: null,
      user: {
        email: "",
        password: "",
        remember_me: false,
      },
      roleError: {
        error: null,
      },
      serverErrors: {
        errors: {
          email: null,
          password: null,
        },
      },
      isBlockedForSomeTime: false,
      isBlockedTimes: 0,
      saveLoading: false,
      showPassword: false,
    };
  },
  mounted() {
    this.registrationBlock();
  },
  watch: {
    isBlockedForSomeTime: function () {
      if (this.isBlockedForSomeTime === true) {
        setTimeout(() => {
          this.isBlockedForSomeTime = false;
          this.serverErrors.errors.password = null;
        }, this.isBlockedTimes);
      }
    },
  },
  computed: {
    serverError() {
      if (this.serverErrors != null) {
        return this.serverErrors;
      }
    },
  },
  methods: {
    ...mapActions("auth", ["login", "accountLocked"]),
    toLogin(data) {
      this.accountBlock = data;
      this.serverErrors.errors.password = null;
      this.user.password = "";
    },
    registrationBlock() {
      var registerBlock = this.$store.getters["auth/registrationBlock"];
      this.registerBlock = registerBlock;
      if (registerBlock) {
        this.registationBlockText = true;
      }
    },
    async loginUser() {
      this.saveLoading = true;
      try {
        const resp = await this.axios
          .post("/donors/login", this.user)
          .then((resp) => {
            if (resp.data.user.is_accepted == 0) {
              this.registerBlock = true;
            } else {
              this.login(resp.data);
              this.checkSecurityQuestion(resp.data);
            }
          })
          .catch((error) => {
            if (error.response.status === 403) {
              this.roleError = error.response.data;
            } else this.setErrorCredential(error.response.data);
          })
          .finally(() => {
            this.saveLoading = false;
          });
        return resp;
      } catch (error) {
        console.log(error);
      }
    },
    checkSecurityQuestion(data) {
      this.axios
        .post("/security-questions/check")
        .then((res) => {
          if (res.data.issetSecurityQuestions == true) {
            this.checkAuthMethod(data);
          } else if (res.data.issetSecurityQuestions == false) {
            this.$router.push({ name: "security-questions-login" });
          }
        })
        .catch((error) => {
          //console.log(error);
        });
    },
    checkAuthMethod(data) {
      if (data.user.two_factor_method == 1) {
        this.axios
          .post("/two-factor/send-email")
          .then((res) => {
            this.$router.push({ name: "verify-code" });
          })
          .catch((error) => {
            //console.log(error);
          });
      } else {
        this.$router.push({ name: "answer-security-question" });
      }
    },
    setErrorCredential(data) {
      if (data.isUserBlocked) {
        this.accountLocked(data);
        this.accountBlock = true;
      } else if (data.errors) {
        if (data.errors.blockedFor != null) {
          this.isBlockedForSomeTime = true;
          this.isBlockedTimes = data.errors.blockedFor;
          this.serverErrors = data;
        }
        this.serverErrors = data;
      }
    },
    changeField() {
      this.serverErrors.errors.email = null;
      this.serverErrors.errors.password = null;
    },
  },
};
</script>
<style lang="scss" scoped>
.icon_eye {
  cursor: pointer;
}
</style>