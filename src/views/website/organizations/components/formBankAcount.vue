<template>
  <section class="form">
    <div class="input_wrap">
      <label>Choose a Bank Accounts</label>
      <vSelect
        placeholder="Choose a Bank Account"
        :options="bankAccounts"
        :reduce="(bank_name) => bank_name.id"
        v-model="bankAccountSelectId"
        label="name"
      />
    </div>

    <div class="input_wrap">
      <inputLabel
        label="Email"
        type="email"
        placeholder="Your email"
        :required="true"
        v-model="email"
        @input="
          email = $event.val
          emailValid = $event.valid
        "
      />
    </div>
    <div class="group_input">
      <div class="input_wrap" style="max-width: 50%">
        <inputLabel
          label="Account holder type"
          placeholder="Choose an account holder type"
          :required="true"
          :min="3"
          :max="11"
          v-model="accountHolderType"
          :disabled="true"
          @input="
            accountHolderType = $event.val
            accountHolderTypeValid = $event.valid
          "
        />
      </div>
      <div class="input_wrap" style="max-width: 50%">
        <inputLabel
          label="Routing number"
          placeholder="Enter your routing number"
          :required="true"
          :disabled="true"
          :min="3"
          :max="11"
          v-model="routingNumber"
          @input="
            routingNumber = $event.val
            routingNumberValid = $event.valid
          "
        />
      </div>
    </div>

    <div class="input_wrap">
      <inputLabel
        label="Account number"
        placeholder="Enter your account number"
        :required="true"
        :min="3"
        :max="11"
        :disabled="true"
        v-model="accountNumber"
        @input="
          accountNumber = $event.val
          accountNumberValid = $event.valid
        "
      />
    </div>
    <div class="input_wrap">
      <label class="input_title">Country <span class="required">*</span></label>
      <country-select
        className="country_region"
        placeholder="Choose:"
        v-model="country"
        :country="country"
        topCountry="US"
      />
    </div>
    <div class="group_input">
      <inputLabel
        class="input_label_group"
        label="First name"
        placeholder="Your first name"
        :required="true"
        :min="3"
        :max="12"
        v-model="firstName"
        @input="
          firstName = $event.val
          firstNameValid = $event.valid
        "
      />
      <inputLabel
        class="input_label_group"
        label="Last name"
        placeholder="Your last name"
        :required="true"
        :min="3"
        :max="12"
        v-model="lastName"
        @input="
          lastName = $event.val
          lastNameValid = $event.valid
        "
      />
    </div>

    <div class="input_wrap">
      <inputLabel
        label="Address"
        placeholder="Your address"
        :required="true"
        :min="3"
        :max="30"
        v-model="address"
        @input="
          address = $event.val
          addressdValid = $event.valid
        "
      />
    </div>
    <div class="input_wrap">
      <inputLabel
        label="City"
        type="text"
        placeholder="Your City"
        :required="true"
        v-model="city"
        @input="
          city = $event.val
          cityValid = $event.valid
        "
      />
    </div>

    <div class="group_input">
      <div class="input_wrap">
        <label class="input_title">State <span class="required">*</span></label>
        <region-select
          className="country_region"
          :country="country"
          placeholder="Choose:"
          :region="region"
          v-model="region"
        />
      </div>
      <div class="input_wrap zip">
        <inputLabel
          label="ZIP Code"
          placeholder="ZIP"
          :required="true"
          type="text"
          :min="5"
          :max="5"
          mask="#####"
          v-model="zipCode"
          @input="
            zipCode = $event.val
            zipCodeValid = $event.valid
          "
        />
      </div>
    </div>

    <div class="bottom">
      <LoaderButton
        class="btn-yellow"
        :disabled="!isValid"
        :text="`PAY $ ${priceCommissionRound}`"
        :loading="loadingLocal"
        @emitClick="send()"
      />
    </div>
  </section>
</template>
<script>
import inputLabel from '@/components/inputs/inputLabel'
import vSelect from 'vue-select'
import LoaderButton from '@/components/buttons/loaderButton.vue'
import { mapActions } from 'vuex'

export default {
  props: {
    bankAccounts: { type: Array, default: [] },
    price: { type: Number, default: 0 },
    isPayCommission: { type: Boolean, default: false },
    priceCommission: { type: Number, default: 0 },
    organizationId: { type: Number, default: null },
    organizationName: { type: String, default: '' },
    donateType: { type: String, default: '' },
    productId: { type: Number, default: null },
    countSpecialDonate: { type: Number, default: null },
    userContacts: {
      type: Object,
      default: { email: '', firstName: '', lastName: '' },
    },
    paymentType: { id: null, key: '', name: '' },
  },
  components: {
    inputLabel,
    vSelect,
    LoaderButton,
  },
  data() {
    return {
      email: this.userContacts ? this.userContacts.email : '',
      emailValid: false,
      firstName: this.userContacts ? this.userContacts.firstName : '',
      firstNameValid: false,
      lastName: this.userContacts ? this.userContacts.lastName : '',
      lastNameValid: false,
      city: '',
      cityValid: false,
      country: '',
      region: '',
      zipCode: null,
      zipCodeValid: false,
      address: '',
      addressdValid: false,
      accountHolderType: '',
      accountHolderTypeValid: false,
      region: '',
      routingNumber: '',
      routingNumberValid: false,
      accountNumber: '',
      accountNumberValid: false,
      bankAccountSelectId: '',
      bankAccountsSelect: null,
      loadingLocal: false,
    }
  },

  watch: {
    bankAccountSelectId(val) {
      const candidate = this.bankAccounts.find((b) => b.id === val)
      if (candidate && !!val) {
        this.bankAccountsSelect = candidate
        this.accountHolderType = candidate.account_holder_type
        this.routingNumber = candidate.routing_number
        this.accountNumber = candidate.last4
        this.country = candidate.country
      } else {
        this.bankAccountsSelect = null
        this.accountHolderType = ''
        this.routingNumber = ''
        this.accountNumber = ''
        this.country = ''
        this.region = ''
      }
    },
  },
  computed: {
    isValid() {
      return (
        this.emailValid &&
        !!this.accountHolderType &&
        !!this.accountNumberValid &&
        this.routingNumberValid &&
        !!this.region &&
        !!this.country &&
        this.addressdValid &&
        !!this.city &&
        this.firstNameValid &&
        this.lastNameValid &&
        this.zipCodeValid
      )
    },
    priceCommissionRound() {
      let num = Math.round(this.priceCommission * 100) / 100
      return num.toFixed(2)
    },
  },

  methods: {
    ...mapActions('publicweb/general', [
      'apiBankAccountPayment',
      'apiBankAccountSpecialPayment',
      'apiBankAccountPaymentRecurring',
    ]),

    async getPaymentBankAccount(data) {
      const paymentType = this.paymentType.key
      let result = null
      switch (paymentType) {
        case 'donate_monthly': {
          result = await this.apiBankAccountPaymentRecurring(data)
          break
        }
        case 'donate_once': {
          result = await this.apiBankAccountPayment(data)
          break
        }
        default: {
          result = await this.apiBankAccountPayment(data)
          break
        }
      }
      return result
    },

    async send() {
      const thankText = `Thank you for your generous gift to ${this.organizationName}. We are thrilled to have your support. Through your donation we'll be able to accomplish our goals and continue working towards our purpose. You truly make the difference for us, and we are extremely grateful!`
      let result = {
        organizationId: this.organizationId,
        data: {
          amount: this.price * 100,
          with_commission: this.isPayCommission,
          bank_account: this.bankAccountSelectId,
          donor_email: this.email,
          first_name: this.firstName,
          last_name: this.lastName,
          country: this.country,
          city: this.city,
          state: this.region,
          address: this.address,
          zip: this.zipCode,
        },
      }

      if (this.productId) {
        result.productId = +this.productId
      }
      if (this.countSpecialDonate) {
        const item = JSON.parse(JSON.stringify(result))
        item.data.count = 1
        delete item.data.amount
        result = item
      }

      let item
      this.loadingLocal = true
      switch (this.donateType) {
        case 'donation': {
          item = await this.getPaymentBankAccount(result)
          break
        }
        case 'special_donation': {
          item = await this.apiBankAccountSpecialPayment(result)
          break
        }
      }
      this.loadingLocal = false

      if (item) {
        this.$swal({
          title: thankText,
          confirmButtonText: 'Back to Organization',
        }).then(() => {
          const item = this.$route.path.split('/')
          const url = `${item[0]}/${item[1]}/${item[2]}/`
          this.$router.push(url)
        })
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.group_input {
  display: flex;
  .input_wrap {
    .zip {
      margin-top: 3px;
    }
    &:first-child {
      margin-right: 0.5rem;
      max-width: 70%;
      width: 100%;
    }
    &.input_wrap:last-child {
      margin-left: 0.5rem;
      max-width: 30%;
      width: 100%;
    }
  }
  .input_label_group {
    margin-bottom: 1rem;
    &:first-child {
      margin-right: 1rem;
    }
    &.input_wrap:last-child {
      margin-left: 1rem;
    }
  }
}
.input_wrap {
  margin-bottom: 2.4rem;
  label {
    font-family: Inter;
    font-style: normal;
    font-weight: normal;
    font-size: 1.2rem;
    color: $violet;
    margin-bottom: 0.8rem;
  }
  .required {
    margin-left: 5px;
    color: $red;
  }
}
.form__field {
  margin-bottom: 18px;
  text-align: left !important;
  background: #fff;
  .input_title {
    font-family: Inter;
    font-style: normal;
    font-weight: 300;
    font-size: 12px;
    color: #63517a;
    background: #fff;
    margin-bottom: 0.6rem;
    span {
      font-family: Inter;
      font-style: normal;
      font-weight: 300;
      font-size: 12px;
      color: red;
      background: #fff;
    }
  }
}

.card_field_overlay {
  .card_field {
    width: 100%;
    background: #ffffff;
    border: 1px solid #efefef;
    border-radius: 3rem;
    padding: 20.5px 2rem;
    @media only screen and (max-width: 1299px) {
      padding: 15px 20px;
    }
    @media only screen and (max-width: 599px) {
      padding: 15px 20px;
    }
    &.StripeElement--invalid {
      border: 1px solid red;
      .InputElement.is-invalid {
        color: red;
      }
    }
  }
}

.bottom {
  margin-top: 2.7rem;
  button {
    width: 100%;
  }
}
</style>