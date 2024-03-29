<template>
  <ValidationObserver ref="observer" tag="form" v-slot="{ invalid }">
    <div class="settings_blocks">
      <h4 class="title">Reset Password</h4>
      <h4 class="sub_title">1. Verify Current Password</h4>
      <div class="form__row">
        <ValidationProvider
          tag="div"
          class="form__field form__field_icon"
          name="curent_password"
          :rules="{ verify_password: true, max: 50, min: 8 }"
          v-slot="{ errors }"
        >
          <label>Current Password</label>
          <div>
            <input
              v-model="currentPassword"
              :type="showCurrentPassword ? 'text' : 'password'"
              placeholder="Current Password"
              :class="
                errors.length != 0 || errors.current_password != null
                  ? 'in-valid'
                  : ''
              "
              @input="canCreatePass = errors.length == 0 ? true : false"
              @change="canCreatePass = errors.length == 0 ? true : false"
            />
            <span class="icon" @click="viewMethod('current')">
              <icon-base
                width="10"
                height="10"
                icon-name="eye-group"
                icon-color="#63517a"
              >
                <icon-eye v-if="showCurrentPassword" />
                <icon-eye-hide v-else />
              </icon-base>
            </span>
          </div>
          <transition name="fade">
            <span class="error error_long" v-if="errors[0] == 'too weak'">{{
              weakPass
            }}</span>
          </transition>
          <span v-if="serverErrors">
            <span
              v-for="err in serverErrors.current_password"
              :key="err"
              class="error error_long"
              >{{ err }}</span
            >
          </span>
        </ValidationProvider>
      </div>
      <h4 class="sub_title">2. Create New Password</h4>
      <div class="form__row">
        <ValidationProvider
          tag="div"
          class="form__field form__field_icon"
          name="password"
          :rules="{ verify_password: true, max: 50, min: 8 }"
          v-slot="{ errors }"
          ><label>New Password</label>
          <div>
            <input
              v-model="newPassword"
              :type="showNewPassword ? 'text' : 'password'"
              placeholder="New Password"
              :class="
                errors.length != 0 || errors.password != null ? 'in-valid' : ''
              "
              :disabled="!canCreatePass || currentPassword.length < 8"
              @input="changeInformation"
            />
            <span class="icon" @click="viewMethod('new')">
              <icon-base
                width="10"
                height="10"
                icon-name="eye-group"
                icon-color="#63517a"
              >
                <icon-eye v-if="showNewPassword" />
                <icon-eye-hide v-else />
              </icon-base>
            </span>
          </div>
          <transition name="fade">
            <span class="error error_long" v-if="errors[0] == 'too weak'">{{
              weakPass
            }}</span>
          </transition>
          <span v-if="serverErrors">
            <span
              v-for="err in serverErrors.password"
              :key="err"
              class="error error_long"
              >{{ err }}</span
            >
          </span>
        </ValidationProvider>
      </div>
      <div class="form__row">
        <ValidationProvider
          tag="div"
          class="form__field form__field_icon"
          name="password_confirmation"
          rules="required|confirmed:password|max: 50|min: 8"
          v-slot="{ errors }"
        >
          <label>Confirm Password</label>
          <div>
            <input
              v-model="passwordConfirmation"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Confirm Password"
              :class="
                errors.length != 0 || errors.current_password != null
                  ? 'in-valid'
                  : ''
              "
              :disabled="!canCreatePass || currentPassword.length < 8"
              @input="changeInformation"
            />
            <span
              class="icon confirm"
              @click="viewMethod('confirm')"
              :class="
                errors.length != 0 || errors.password != null ? 'in-valid' : ''
              "
            >
              <icon-base
                width="10"
                height="10"
                icon-name="eye-group"
                icon-color="#63517a"
              >
                <icon-eye v-if="showConfirmPassword" />
                <icon-eye-hide v-else />
              </icon-base>
            </span>
          </div>
          <span class="error">{{ errors[0] }}</span>
        </ValidationProvider>
      </div>
      <div class="btn_overlay">
        <LoaderButton
          text="Save"
          :disabled="!somethingChange || invalid"
          :loading="loadingPassword"
          class="btn-yellow"
          @emitClick="save"
        ></LoaderButton>
      </div>
    </div>
  </ValidationObserver>
</template>
<script>
import { ValidationObserver, ValidationProvider } from "vee-validate";
import LoaderButton from "@/components/buttons/loaderButton.vue";
import IconBase from "@/components/IconBase";
import iconEye from "@/components/icons/iconEye";
import iconEyeHide from "@/components/icons/iconEyeHide";
import { mapActions } from "vuex";

export default {
  components: {
    ValidationObserver,
    ValidationProvider,
    IconBase,
    iconEye,
    iconEyeHide,
    LoaderButton,
  },
  data() {
    return {
      weakPass:
        "Must have at least 8 characters, contain capitals “A”, numbers “9” and symbols “%”",
      currentPassword: "",
      newPassword: "",
      passwordConfirmation: "",
      canCreatePass: false,
      showCurrentPassword: false,
      showNewPassword: false,
      showConfirmPassword: false,
      loadingPassword: false,
      serverErrors: {
        current_password: null,
        password: null,
      },
      somethingChange: false,
    };
  },
  methods: {
    ...mapActions("user", ["resetPassword"]),
    viewMethod(name) {
      switch (name) {
        case "current": {
          this.showCurrentPassword = !this.showCurrentPassword;
          break;
        }
        case "new": {
          this.showNewPassword = !this.showNewPassword;
          break;
        }
        case "confirm": {
          this.showConfirmPassword = !this.showConfirmPassword;
          break;
        }
      }
    },
    changeInformation() {
      this.somethingChange = true;
      this.$emit("somethingChanged", true);
    },
    resetForm() {
      this.$nextTick(() => {
        this.currentPassword = "";
        this.password = "";
        this.passwordConfirmation = "";
        this.$refs.observer.reset();
        this.serverErrors = {
          current_password: null,
          password: null,
        };
        this.somethingChange = false;
        this.$emit("somethingChanged", false);
      });
    },
    async save() {
      this.loadingPassword = true;
      var user = {
        currentPassword: this.currentPassword,
        newPassword: this.newPassword,
        passwordConfirmation: this.passwordConfirmation,
      };
      var errors = await this.resetPassword(user);
      this.loadingPassword = false;
      if (errors != false) {
        this.serverErrors = {
          ...errors,
        };
      } else {
        this.resetForm();
        this.$swal({
          title: "Your password was successfully updated",
          confirmButtonText: "OK",
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.settings_blocks {
  padding-bottom: 60px;
  border-bottom: 1px solid $violetBorder;
  .sub_title {
    font-size: 24px;
    font-weight: 400;
    margin: 20px 0 35px;
    @media only screen and (max-width: 768px) {
      font-size: 20px;
    }
  }
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
.icon {
  cursor: pointer;
  margin-top: -2px;
}
</style>