<template>
  <ValidationObserver 
    ref="observer"
    tag="form"
    v-slot="{ invalid }"
  >
    <div class="form__row">
      <ValidationProvider
        tag="div"
        class="form__field"
        name="name"
        :rules="{ required: true, min: 3, max: 200 }"
        v-slot="{ errors }"
      >
        <div class="">
          <label class="input_title">Account holder name</label>
          <input
            v-model="account_holder_name"
            type="text"
            placeholder="Enter your account holder name"
            :class="errors.length != 0 ? 'in-valid' : ''"
          />
        </div>
        <span class="error">{{ errors[0] }}</span>
      </ValidationProvider>
      <label class="checkbox">
        <input v-model="defaultPayment" type="checkbox" />
        <span></span>
        Make default payment method
      </label>
    </div>
    <div class="btn_overlay">
      <a class="btn btn-small btn-cancel" @click.prevent="hideModal">Cancel</a>

      <LoaderButton
        class="btn-yellow btn-small"
        text="Save"
        :loading="saveLoading"
        :disabled="invalid"
        @emitClick="updateMethod"
      ></LoaderButton>
    </div>
  </ValidationObserver>
</template>
<script>
import { ValidationObserver, ValidationProvider } from "vee-validate";
import LoaderButton from "@/components/buttons/loaderButton.vue";

export default {
  props: {
    item: { type: Object },
    defaultEl: { type: Boolean },
  },
  components: {
    ValidationObserver,
    ValidationProvider,
    LoaderButton,
  },
  data() {
    return {
      account_holder_name: this.item.account_holder_name,
      defaultPayment: this.defaultEl,
      saveLoading: false,
    };
  },
  methods: {
    updateMethod() {
      this.saveLoading = true;
      var self = this,
        paymentMethod = {
          full_name: this.account_holder_name,
          default: this.defaultPayment,
        };

      this.axios
        .put(
          `/user/donor-billings/bank-accounts/${this.item.id}`,
          paymentMethod
        )
        .then((res) => {
          var data = res.data;
          this.$swal({
            title: "Bank account has been updated!",
            confirmButtonText: "OK",
          }).then((result) => {
            self.hideModal(data);
          });
        })
        .finally(() => {
          self.saveLoading = false;
        });
    },
    hideModal(data) {
      if (data.bank_accounts) {
        this.$emit("updateMethod", data);
      }
      this.$emit("hideModal");
    },
  },
};
</script>
<style lang="scss" scoped>
form {
  width: 100%;
  max-width: 330px;
  margin: 0 auto;
  .input_title {
    margin-bottom: 10px;
  }
}
.btn_overlay {
  margin-bottom: 15px;
  margin-top: 30px;
  .btn {
    width: calc(50% - 10px);
  }
  @media only screen and (max-width: 599px) {
    flex-direction: column;
    margin-bottom: 0;
    margin-top: 25px;
    .btn {
      width: 100%;
      margin-bottom: 15px;
    }
  }
}
</style>