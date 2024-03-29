<template>
  <ValidationObserver ref="observer" tag="form" v-slot="{ invalid }">
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
    </div>
    <div class="form__row">
      <ValidationProvider
        tag="div"
        class="form__field"
        :rules="{ required: true }"
        v-slot="{ errors }"
      >
        <label class="input_title">Account holder type</label>
        <Select2
          :value="null"
          v-model="account_holder_type"
          :options="holder_types"
          :settings="{ minimumResultsForSearch: Infinity }"
          placeholder="Select account holder type"
          :class="errors.length != 0 ? 'in-valid' : ''"
        />
      </ValidationProvider>
    </div>
    <div class="form__row">
      <ValidationProvider
        tag="div"
        class="form__field"
        :rules="{ required: true }"
      >
        <div>
          <label class="input_title">Country</label>
          <country-select
            v-model="country"
            :country="country"
            topCountry="US"
            placeholder="Enter your country"
          />
        </div>
      </ValidationProvider>
    </div>
    <div class="form__row">
      <ValidationProvider
        tag="div"
        class="form__field"
        name="name"
        :rules="{ required: true, numeric: true, min: 3, max: 200 }"
        v-slot="{ errors }"
      >
        <div class="">
          <label class="input_title">Routing number</label>
          <input
            v-model="routing_number"
            type="text"
            placeholder="Enter routing number"
            :class="errors.length != 0 ? 'in-valid' : ''"
          />
        </div>
        <span class="error">{{ errors[0] }}</span>
      </ValidationProvider>
    </div>
    <div class="form__row">
      <ValidationProvider
        tag="div"
        class="form__field"
        name="name"
        :rules="{ required: true, numeric: true, min: 3, max: 200 }"
        v-slot="{ errors }"
      >
        <div class="">
          <label class="input_title">Account number</label>
          <input
            v-model="account_number"
            type="text"
            placeholder="Enter account number"
            :class="errors.length != 0 ? 'in-valid' : ''"
          />
        </div>
        <span class="error">{{ errors[0] }}</span>
      </ValidationProvider>
    </div>
    <div class="server_errors">
      <p>{{ serverErorrs.message }}</p>
    </div>
    <div class="btn_overlay">
      <a class="btn btn-small btn-cancel" @click.prevent="hideModal">Cancel</a>

      <LoaderButton
        class="btn-yellow btn-small"
        text="Save"
        :loading="saveLoading"
        :disabled="invalid"
        @emitClick="createBankToken"
      ></LoaderButton>
    </div>
  </ValidationObserver>
</template>
<script>
import { ValidationObserver, ValidationProvider } from "vee-validate";
import Select2 from "v-select2-component";
import LoaderButton from "@/components/buttons/loaderButton.vue";
export default {
  components: {
    ValidationObserver,
    ValidationProvider,
    Select2,
    LoaderButton,
  },
  data() {
    return {
      stripe: "",
      stripeAPIToken: process.env.VUE_APP_STRIPE_KEY,
      account_holder_name: "",
      account_holder_type: "individual",
      country: "",
      routing_number: "",
      account_number: "",

      holder_types: ["individual", "company"],
      serverErorrs: {
        message: null,
      },
      saveLoading: false,
    };
  },
  mounted() {
    this.configureStripe();
  },
  methods: {
    configureStripe() {
      this.stripe = Stripe(this.stripeAPIToken);
    },
    createBankToken() {
      this.saveLoading = true;
      var self = this;
      const setupIntent = this.stripe
        .createToken("bank_account", {
          country: this.country,
          currency: "usd",
          routing_number: this.routing_number,
          account_number: this.account_number,
          account_holder_name: this.account_holder_name,
          account_holder_type: this.account_holder_type,
        })
        .then(function (result) {
          if (result.error) {
            self.serverErorrs = result.error;
            this.saveLoading = false;
          } else self.sendPaymentMethodToApi(result);
        });
    },
    sendPaymentMethodToApi(result) {
      var self = this,
        paymentMethod = {
          bank_id: result.token.id,
          default: true,
        };

      this.axios
        .post("/user/donor-billings/bank-accounts", paymentMethod)
        .then((res) => {
          var data = res.data.bank;
          this.$swal({
            title: "Bank account has been added!",
            confirmButtonText: "OK",
          }).then((result) => {
            self.hideModal(data);
          });
        })
        .finally(() => {
          this.saveLoading = false;
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
  .btn {
    width: calc(50% - 10px);
  }
  @media only screen and (max-width: 599px) {
    flex-direction: column;
    margin-bottom: 0;
    .btn {
      width: 100%;
      margin-bottom: 15px;
    }
  }
}
.server_errors {
  p {
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 15px;
    color: $red;
  }
}
</style>