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
          <label class="input_title">Name on Card</label>
          <input
            v-model="name"
            type="text"
            placeholder="Name on card"
            :class="errors.length != 0 ? 'in-valid' : ''"
          />
        </div>
        <span class="error">{{ errors[0] }}</span>
      </ValidationProvider>
    </div>
    <div class="form__row">
      <div class="form__field">
        <label class="input_title">Credit or Debit Card</label>
        <div class="card_field_overlay">
          <div ref="cardElement" class="card_field"></div>
        </div>
      </div>
    </div>
    <div>
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
          >
          </country-select>
        </div>
      </ValidationProvider>
      <ValidationProvider
        tag="div"
        class="form__field"
        :rules="{ required: true }"
      >
        <div>
          <label class="input_title">State/Province</label>
          <region-select
            v-model="region"
            :country="country"
            :region="region"
            placeholder="Enter your state"
          />
        </div>
      </ValidationProvider>
    </div>
    <div class="form__row">
      <ValidationProvider
        tag="div"
        class="form__field"
        name="name"
        :rules="{ required: true, min: 3, max: 200 }"
        v-slot="{ errors }"
      >
        <div class="">
          <label class="input_title">City</label>
          <input
            v-model="city"
            type="text"
            placeholder="Enter you city"
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
        :rules="{ required: true, min: 3, max: 200 }"
        v-slot="{ errors }"
      >
        <div class="">
          <label class="input_title">Address</label>
          <input
            v-model="address"
            type="text"
            placeholder="Enter you address"
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
        :rules="{ required: true, numeric: true, min: 3, max: 10 }"
        v-slot="{ errors }"
      >
        <div class="">
          <label class="input_title">Postal Code</label>
          <input
            v-model="postCode"
            type="text"
            placeholder="Enter your postal code"
            :class="errors.length != 0 ? 'in-valid' : ''"
          />
        </div>
        <span class="error">{{ errors[0] }}</span>
      </ValidationProvider>
    </div>
    <div class="form__row">
      <label class="checkbox">
        <input v-model="defaultPayment" type="checkbox" />
        <span></span>
        Make default payment method
      </label>
    </div>
    <div class="server_errors">
      <p>{{ serverErorrs.message }}</p>
    </div>
    <div class="btn_overlay">
      <a class="btn btn-small btn-cancel" @click.prevent="hideModel">Cancel</a>

      <LoaderButton
        class="btn-yellow btn-small"
        text="Save"
        :loading="saveLoading"
        :disabled="invalid"
        @emitClick="getPaymentMethod"
      ></LoaderButton>
    </div>
  </ValidationObserver>
</template>
<script>
import { ValidationObserver, ValidationProvider } from "vee-validate";
import LoaderButton from "@/components/buttons/loaderButton.vue";
export default {
  components: {
    ValidationObserver,
    ValidationProvider,
    LoaderButton,
  },
  data() {
    return {
      stripe: "",
      stripeAPIToken: process.env.VUE_APP_STRIPE_KEY,
      clientSecret: "",
      cardElement: "",

      name: null,
      country: "",
      region: "",
      address: "",
      city: "",
      postCode: "",
      defaultPayment: false,

      serverErorrs: {
        message: null,
      },
      saveLoading: false,
    };
  },
  mounted() {
    this.configureStripe();
    this.getSetupIntent();
  },
  methods: {
    configureStripe() {
      this.stripe = Stripe(this.stripeAPIToken);
      var elements = this.stripe.elements();

      this.cardElement = elements.create("card", {
        hidePostalCode: true,
        style: {
          base: {
            iconColor: "#666EE8",
            color: "#63517A",
            fontWeight: 600,
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",

            "::placeholder": {
              color: "#63517A",
            },
          },
          invalid: {
            color: "#D3584B",
            ":focus": {
              color: "#D3584B",
            },
            "::placeholder": {
              color: "#D3584B",
            },
          },
        },
      });
      this.cardElement.mount(this.$refs.cardElement);
    },
    getSetupIntent() {
      this.axios.get("/user/donor-billings/get-setup-intent").then((res) => {
        this.clientSecret = res.data.intent.client_secret;
      });
    },
    getPaymentMethod() {
      this.saveLoading = true;
      var self = this;
      const setupIntent = this.stripe
        .confirmCardSetup(this.clientSecret, {
          payment_method: {
            card: this.cardElement,
            billing_details: {
              name: this.name,
              address: {
                country: this.country,
                state: this.region,
                city: this.city,
                line1: this.address,
                postal_code: this.postCode,
              },
            },
          },
        })
        .then(function (result) {
          if (result.error) {
            self.serverErorrs = result.error;
            self.saveLoading = false;
          } else self.sendPaymentMethodToApi(result);
        });
    },
    sendPaymentMethodToApi(result) {
      var self = this,
        paymentMethod = {
          payment_id: result.setupIntent.payment_method,
          default: this.defaultPayment,
        };

      this.axios
        .post("/user/donor-billings/cards", paymentMethod)
        .then((res) => {
          var data = res.data.payment_method;
          this.$swal({
            title: "Credit card has been added!",
            confirmButtonText: "OK",
          }).then((result) => {
            self.hideModel(data);
          });
        })
        .finally(() => {
          this.saveLoading = false;
        });
    },
    hideModel(data) {
      if (data.payment_methods) {
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
  .card_field_overlay {
    .card_field {
      width: 100%;
      background: #ffffff;
      border: 1px solid $fieldBorderColor;
      border-radius: 3rem;
      padding: 20.5px 2rem;
      @media only screen and (max-width: 1299px) {
        //height: 5rem;
        padding: 15.5px 2rem;
      }
      &.StripeElement--invalid {
        border: 1px solid $red;
        .InputElement.is-invalid {
          color: $red;
        }
      }
    }
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
.server_errors {
  margin: 20px 0;
  p {
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 15px;
    color: $red;
  }
}
</style>