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
            v-model="info.billing_details.name"
            type="text"
            placeholder="Name on card"
            :class="errors.length != 0 ? 'in-valid' : ''"
          />
        </div>
        <span class="error">{{ errors[0] }}</span>
      </ValidationProvider>
    </div>
    <div class="form__row">
      <div class="form__row_side">
        <ValidationProvider
          tag="div"
          class="form__field"
          :rules="{ required: true }"
          v-slot="{ errors }"
        >
          <label class="input_title">Expiry Month</label>
          <Select2
            :value="info.card.exp_month"
            v-model="info.card.exp_month"
            :options="months"
            :settings="{ minimumResultsForSearch: Infinity }"
            placeholder="MM"
            :class="errors.length != 0 || expiryError ? 'in-valid' : ''"
            @change="changeSelect"
          />
        </ValidationProvider>
      </div>
      <div class="form__row_side">
        <ValidationProvider
          tag="div"
          class="form__field"
          :rules="{ required: true }"
          v-slot="{ errors }"
        >
          <label class="input_title">Expiry Year</label>
          <Select2
            :value="info.card.exp_year"
            v-model="info.card.exp_year"
            :options="years"
            :settings="{ minimumResultsForSearch: Infinity }"
            placeholder="YY"
            :class="errors.length != 0 || expiryError ? 'in-valid' : ''"
            @change="changeSelect"
          />
        </ValidationProvider>
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
            v-model="info.billing_details.address.country"
            :country="info.billing_details.address.country"
            topCountry="US"
            placeholder="Enter your country"
          />
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
            v-model="info.billing_details.address.state"
            :country="info.billing_details.address.country"
            :region="info.billing_details.address.state"
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
            v-model="info.billing_details.address.city"
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
            v-model="info.billing_details.address.line1"
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
            v-model="info.billing_details.address.postal_code"
            type="text"
            placeholder="Enter your postal code"
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
import Select2 from "v-select2-component";
import LoaderButton from "@/components/buttons/loaderButton.vue";
export default {
  props: {
    item: { type: Object },
    defaultEl: { type: Boolean },
  },
  components: {
    ValidationObserver,
    ValidationProvider,
    Select2,
    LoaderButton,
  },
  data() {
    return {
      months: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
      years: [],
      info: JSON.parse(JSON.stringify(this.item)),
      defaultPayment: this.defaultEl,
      expiryError: false,
      saveLoading: false,
    };
  },
  mounted() {
    this.allYears();
  },
  methods: {
    allYears() {
      var years = [];
      var thisYear = new Date().getFullYear();
      for (var i = thisYear; i <= thisYear + 10; i++) {
        years.push(i);
      }
      this.years = years;
    },
    updateMethod() {
      this.saveLoading = true;
      const expiryDate = new Date(
        this.info.card.exp_year + "-" + this.info.card.exp_month + "-01"
      );
      var self = this,
        paymentMethod = {
          full_name: this.info.billing_details.name,
          exp_month: this.info.card.exp_month,
          exp_year: this.info.card.exp_year,
          address: this.info.billing_details.address.line1,
          default: this.defaultPayment,
          city: this.info.billing_details.address.city,
          post_code: this.info.billing_details.address.postal_code,
          state_province: this.info.billing_details.address.state,
          country: this.info.billing_details.address.country,
        };

      if (expiryDate < new Date()) {
        this.expiryError = true;
      } else {
        this.axios
          .put(`/user/donor-billings/cards/${this.info.id}`, paymentMethod)
          .then((res) => {
            var data = res.data;
            this.$swal({
              title: "Credit card has been updated!",
              confirmButtonText: "OK",
            }).then((result) => {
              self.hideModal(data);
            });
          })
          .finally(() => {
            this.saveLoading = false;
          });
      }
    },
    hideModal(data) {
      if (data.payment_methods) {
        this.$emit("updateMethod", data);
      }
      this.$emit("hideModal");
    },
    changeSelect() {
      const expiryDate = new Date(
        this.info.card.exp_year + "-" + this.info.card.exp_month + "-01"
      );
      if (expiryDate < new Date()) {
        this.expiryError = true;
      } else this.expiryError = false;
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
</style>