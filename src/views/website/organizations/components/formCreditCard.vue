<template>
  <section class="form">
    <div class="input_wrap" v-if="cards.length">
      <label>Choose a card</label>
      <vSelect
        placeholder="Choose a card"
        :options="cards"
        :reduce="(name) => name.id"
        v-model="cardSelectId"
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
    <div class="form__field">
      <label class="input_title">Credit or Debit Card <span>*</span></label>
      <creditCardBox
        v-show="cardSelectId"
        :brand="cardSelect && cardSelect.card.brand"
        :last4="cardSelect && cardSelect.card.last4"
        :expMonth="cardSelect && cardSelect.card.exp_month"
        :expYear="cardSelect && cardSelect.card.exp_year"
        :cvc="true"
      >
        <template #right>
          <div ref="cvcElement" />
        </template>
      </creditCardBox>

      <div class="card_field_overlay" v-show="!cardSelectId">
        <div ref="cardElement" class="card_field"></div>
      </div>
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
      <label class="input_title">Country <span class="required">*</span></label>
      <country-select
        className="country_region"
        placeholder="Choose:"
        v-model="country"
        :country="country"
        topCountry="US"
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
      <div class="input_wrap">
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
        :text="`PAY $ ${priceCommissionRound}`"
        :disabled="!isValid"
        :loading="stripeLoader"
        @emitClick="send()"
      />
    </div>
  </section>
</template>
<script>
import inputLabel from '@/components/inputs/inputLabel'
import vSelect from 'vue-select'
import LoaderButton from '@/components/buttons/loaderButton.vue'
import creditCardBox from '@/components/inputs/creditCardBox'
import { mapActions } from 'vuex'

export default {
  props: {
    cards: Array,
    accountId: { tupe: String, default: '' },
    organizationName: { type: String, default: '' },
    organizationId: { type: Number, default: null },
    price: { type: Number, default: 0 },
    isPayCommission: { type: Boolean, default: false },
    priceCommission: { type: Number, default: 0 },
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
    creditCardBox,
  },
  data() {
    return {
      cardSelectId: '',
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
      cardSelect: null,
      cardElement: null,
      cvcElement: null,
      stripeAPIToken: process.env.VUE_APP_STRIPE_KEY,
      elementsStripe: null,
      styleStripe: {
        base: {
          iconColor: '#A098AB',
          color: '#63517A',
          fontWeight: 600,
          fontFamily: 'Inter, sans-serif',
          fontSize: '13px',
          '::placeholder': {
            color: '#A098AB',
          },
        },
        invalid: {
          color: '#D3584B',
          ':focus': {
            color: '#D3584B',
          },
          '::placeholder': {
            color: '#D3584B',
          },
        },
      },
      stripeLoader: false,
    }
  },
  mounted() {
    let recaptchaScript = document.createElement('script')
    recaptchaScript.setAttribute('src', 'https://js.stripe.com/v3/')
    document.head.appendChild(recaptchaScript)
    this.configureStripe()
  },

  watch: {
    cardSelectId(val) {
      const candidate = this.cards.find((c) => c.id === val)
      if (val) {
        this.cardSelect = candidate
        this.email = candidate.billing_details.email || this.email
        this.country = candidate.billing_details.address.country || ''
        this.city = candidate.billing_details.address.city || ''
        this.address = candidate.billing_details.address.line1 || ''
        this.region = candidate.billing_details.address.state || ''
        this.zipCode = candidate.billing_details.address.postal_code || ''
      } else {
        this.cardSelect = null
        ;(this.country = ''), (this.address = '')
        this.city = ''
        ;(this.region = ''), (this.zipCode = '')
      }
      this.configureStripe()
    },
  },

  computed: {
    isValid() {
      return (
        this.emailValid &&
        this.firstNameValid &&
        this.lastNameValid &&
        !!this.country &&
        this.addressdValid &&
        !!this.city &&
        !!this.region &&
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
      'apiDonationCardPaymentBase',
      'apiDonationSpecialCardPayment',
      'apiDonationTypeCardPaymentBase',
    ]),

    configureStripe() {
      const accountId = this.accountId
      this.updateStripe()

      this.cardElement = null
      this.cvcElement = null
      this.elementsStripe = null

      this.elementsStripe = this.stripe.elements()
      if (this.cardSelectId) {
        this.cvcElement = this.elementsStripe.create('cardCvc', {
          style: {
            ...this.styleStripe,
            base: {
              ...this.styleStripe.base,
              '::placeholder': { color: '#D3584B' },
            },
          },
        })
        this.cvcElement.mount(this.$refs.cvcElement)
      } else {
        this.cardElement = this.elementsStripe.create('card', {
          hidePostalCode: true,
          style: this.styleStripe,
        })
        this.cardElement.mount(this.$refs.cardElement)
      }
    },

    generateData() {
      let cardType = ''
      let result
      if (this.cardSelect) {
        result = {
          organizationId: this.organizationId,
          data: {
            amount: +this.price * 100,
            with_commission: this.isPayCommission,
            payment_method: this.cardSelectId,
            donor_email: this.email,
            first_name: this.firstName,
            last_name: this.lastName,
            city: this.region,
            country: this.cardSelect.billing_details.address.country || this.country,
            state: this.region,
            address: this.address,
            zip: this.zipCode,
          },
        }

        if (this.productId) {
          result.productId = this.productId
        }
        if (this.countSpecialDonate) {
          result.data.count = 1
          delete result.data.amount
        }

        cardType = 'selected-card'
      } else {
        result = {
          organizationId: this.organizationId,
          data: {
            amount: +this.price * 100,
            with_commission: this.isPayCommission,
            donor_email: this.email,
            first_name: this.firstName,
            last_name: this.lastName,
            city: this.city,
            country: this.country,
            state: this.region,
            address: this.address,
            zip: this.zipCode,
          },
        }

        if (this.productId) {
          result.productId = this.productId
        }
        if (this.countSpecialDonate) {
          delete result.data.amount
          result.data.count = 1
        }

        cardType = 'new-card'
      }

      return { result, cardType }
    },

    async send() {
      const { result, cardType } = this.generateData()
      const thankText = `Thank you for your generous gift to ${this.organizationName}. We are thrilled to have your support. Through your donation we'll be able to accomplish our goals and continue working towards our purpose. You truly make the difference for us, and we are extremely grateful!`
      result.message = thankText
      switch (cardType) {
        case 'new-card': {
          this.paymentNewCard(result)
          break
        }
        case 'selected-card': {
          this.paymentSelectedCard(result, thankText)
          break
        }
      }
    },

    async paymentNewCard(result) {
      const name = `${this.firstName} ${this.lastName}`
      const message = result.message
      this.stripeLoader = true
      const { paymentMethod, error } = await this.stripe.createPaymentMethod(
        'card',
        this.cardElement,
        {
          billing_details: { name: name },
        }
      )

      if (error) {
        console.log(error)
      } else {
        result.data.payment_method = paymentMethod.id
        let item = null
        switch (this.donateType) {
          case 'donation': {
            item = await this.getPaymentCard(result)
            break
          }
          case 'special_donation': {
            item = await this.apiDonationSpecialCardPayment(result)
            break
          }
        }

        const { clientSecret, paymentMethodId } = item

        if (clientSecret && paymentMethodId) {
          this.stripe = await Stripe(this.stripeAPIToken, {
            stripeAccount: this.accountId,
          })

          await this.stripe
            .confirmCardPayment(clientSecret, {
              payment_method: paymentMethodId,
            })
            .then((result) => {
              if (result.error) {
                console.log(result.error.message)
              } else {
                this.$swal({
                  title: message,
                  confirmButtonText: 'Back to Organization',
                }).then(() => {
                  const item = this.$route.path.split('/')
                  const url = `${item[0]}/${item[1]}/${item[2]}/`
                  this.$router.push(url)
                })
              }
            })
            .finally(() => {
              this.stripeLoader = false
            })
        }

        this.stripeLoader = false
        this.stripe = null
      }

      this.stripeLoader = false
    },

    async paymentSelectedCard(data, thankText) {
      this.stripeLoader = true

      let result = null
      switch (this.donateType) {
        case 'donation': {
          result = await this.getPaymentCard(data)
          break
        }
        case 'special_donation': {
          result = await this.apiDonationSpecialCardPayment(data)
          break
        }
      }

      if (!result) {
        this.stripeLoader = false
        return
      }

      await this.stripe
        .confirmCardPayment(result.clientSecret, {
          payment_method: result.paymentMethodId,
          payment_method_options: {
            card: {
              cvc: this.cvcElement,
            },
          },
        })
        .then((result) => {
          if (result.error) {
            console.log(result.error.message)
          } else {
            this.$swal({
              title: thankText,
              confirmButtonText: 'Back to Organization',
            }).then(() => {
              const item = this.$route.path.split('/')
              const url = `${item[0]}/${item[1]}/${item[2]}/`
              this.$router.push(url)
            })
          }
        })
        .finally(() => {
          this.stripeLoader = false
        })
    },

    async getPaymentCard(data) {
      const paymentType = this.paymentType.key
      let result = null
      switch (paymentType) {
        case 'donate_monthly': {
          result = await this.apiDonationTypeCardPaymentBase(data)
          break
        }
        case 'donate_once': {
          result = await this.apiDonationCardPaymentBase(data)
          break
        }
        default: {
          result = await this.apiDonationCardPaymentBase(data)
          break
        }
      }
      return result
    },

    updateStripe() {
      if (this.cardSelectId) {
        this.stripe = Stripe(this.stripeAPIToken, {
          stripeAccount: this.accountId,
        })
      } else {
        this.stripe = Stripe(this.stripeAPIToken)
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.group_input {
  display: flex;
  .input_wrap {
    &:first-child {
      margin-right: 1rem;
    }
    &.input_wrap:last-child {
      margin-top: 3px;
      margin-left: 1rem;
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