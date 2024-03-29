<template>
  <div>
    <form>
      <h4>You have not filled the billing information.</h4>
      <h4>Please fill in or use the checkout.</h4>
      <div class="form__row">
        <div class="form__field">
          <label class="input_title">Credit or Debit Card</label>
          <div class="card_field_overlay">
            <div ref="cardElement" class="card_field"></div>
          </div>
        </div>
      </div>
      <LoaderButton
        class="btn-yellow btn-small btn-uppercase"
        text="Save"
        :loading="loading"
        @emitClick="getPaymentMethod"
      ></LoaderButton>
      <LoaderButton
        class="btn-cancel btn-small btn-uppercase"
        text="Checkout"
        :loading="false"
        @emitClick="checkout"
      ></LoaderButton>
    </form>
  </div>
</template>
<script>

import LoaderButton from "@/components/buttons/loaderButton.vue";
import { mapActions, mapGetters } from "vuex";

export default {
  props: {
    donate: { type: Number },
    specialId: { type: String },
    organization: { type: Number },
    special: { type: Boolean },
  },
  components: {
    LoaderButton,
  },
  data() {
    return {
      stripe: "",
      stripeAPIToken: process.env.VUE_APP_STRIPE_KEY,
      clientSecret: "",
      cardElement: "",
      defaultPayment: true,
      serverErorrs: {
        message: null,
      },
      loading: false,
    };
  },
  mounted() {
    this.configureStripe();
    this.getSetupIntent();
  },
  computed: {
    ...mapGetters("billing", {
      specialDonateMessage: "getSpecialDonateMessage",
      baseDonateMessage: "getBaseDonateMessage",
      specialDonateError: "getSpecialDonateError",
    }),
  },
  methods: {
    ...mapActions("billing", ["baseDonate"]),
    getSetupIntent() {
      this.axios
        .get("/user/donor-billings/get-setup-intent")
        .then((res) => {
          this.clientSecret = res.data.intent.client_secret;
        })
        .catch(() => {
          this.loading = false;
        });
    },
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
    getPaymentMethod() {
      this.loading = true;
      var self = this;
      const setupIntent = this.stripe
        .confirmCardSetup(this.clientSecret, {
          payment_method: {
            card: this.cardElement,
          },
        })
        .then(function (result) {
          if (result.error) {
            self.serverErorrs = result.error;
          } else self.sendPaymentMethodToApi(result);
        })
        .catch(() => {
          this.loading = false;
        });
    },
    async sendPaymentMethodToApi(result) {
      var self = this,
        paymentMethod = {
          payment_id: result.setupIntent.payment_method,
          default: this.defaultPayment,
        },
        data = {
          id: this.organization,
        };
      if (this.special) {
        data.product_id = this.specialId;
      } else {
        data.donateAmount = this.donate * 100;
      }
      this.axios
        .post("/user/donor-billings/cards", paymentMethod)
        .then((res) => {
          this.makeDonation();
        })
        .finally(() => {
          this.loading = false;
        });
    },
    async makeDonation() {
      if (this.special === false) {
        await this.baseDonate(data);
        this.$swal({
          title: this.baseDonateMessage,
          confirmButtonText: "OK",
        }).then(() => {
          this.loadingDonate = false;
        });
      } else if (this.special == true) {
        await this.specialDonate(data);
        if (this.specialDonateError !== null) {
          this.hideModal();
          this.$swal({
            title: this.specialDonateError,
            confirmButtonText: "OK",
          });
        } else
          this.$swal({
            title: this.specialDonateMessage,
            confirmButtonText: "OK",
          });
      }
    },

    checkout() {
      this.$emit("hideModal");
      this.$emit("checkout");
    },
  },
};
</script>
<style lang="scss" scoped>
form {
  width: 100%;
  max-width: 350px;
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
  .btn {
    width: 100%;
    &:first-of-type {
      margin-bottom: 2rem;
      @media only screen and (max-width: 1299px) {
        margin-bottom: 1.5rem;
      }
    }
  }
  h4 {
    margin: 0 auto 10px;
    &:last-of-type {
      margin-bottom: 30px;
    }
  }
}
</style>