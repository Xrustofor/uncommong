<template>
  <section class="form">
    <div class="input_wrap">
      <label>Choose an organization to support <span class="required">*</span></label>
      <vSelect
        placeholder="Choose a Organization"
        v-model="idOrganizationSelect"
        :options="organizations"
        :reduce="(name) => name.id"
        label="name"
      />
    </div>
    <div class="input_wrap" v-if="isAuthorized">
      <label>Choose a card</label>
      <vSelect
        placeholder="Choose a card"
        v-model="cardSelectId"
        :options="cardsForSelection"
        :reduce="(name) => name.id"
        :selectable="(option) => !option.disabled"
        label="name"
      />
    </div>
    <div class="input_wrap">
      <inputLabel
        label="Email"
        type="email"
        placeholder="Your email"
        :required="true"
        @input="
          email = $event.val
          emailValid = $event.valid
        "
        v-model="email"
      />
    </div>
    <div class="form__field">
      <label class="input_title">Credit or Debit Card <span>*</span></label>

      <creditCardBox
        v-show="cardSelect"
        :brand="cardSelect && cardSelect.card.brand"
        :last4="cardSelect && cardSelect.card.last4"
        :expMonth="cardSelect && cardSelect.card.exp_month"
        :expYear="cardSelect && cardSelect.card.exp_year"
      >
        <template #right>
          <div ref="cvcElement" />
        </template>
      </creditCardBox>

      <div class="card_field_overlay" v-show="!cardSelect">
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
        :loading="stripeLoader"
        :text="`PAY $ ${priceCommissionRound}`"
        :disabled="!isValid"
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
import { mapActions, mapGetters } from 'vuex'
import { round } from '@/helpers/script.js'

export default {
  props: {
    isAuthorized: { type: Boolean, default: false },
    sweepstakeName: { type: String, default: '' },
    organizations: { tyoe: Array, default: [] },
    cards: {
      type: Array,
      default: [
        {
          billing_details: Object,
          card: Object,
          created: null,
          customer: null,
          id: '',
          livemode: false,
          metadata: Array,
          object: '',
          type: '',
        },
      ],
    },
    payCommission: { type: Boolean, default: false },
    cardType: { type: String, default: '' },
    isMicro: { type: Boolean, default: true },
    priceCommission: { type: Number, default: 0 },
    sweepstakeId: { type: Number, default: null },
    userContacts: {
      type: Object,
      default: { email: '', firstName: '', lastName: '' },
    },
  },
  components: {
    inputLabel,
    vSelect,
    LoaderButton,
    creditCardBox,
  },
  data() {
    return {
      price: +this.$route.query.price || 0,
      entries: +this.$route.query.entries || 0,
      cardSelectId: '',
      cardSelect: null,
      cardElement: null,
      cvcElement: null,
      idOrganizationSelect: null,
      organizationSelect: null,
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
      stripe: Object,
      email: this.userContacts ? this.userContacts.email : '',
      emailValid: false,
      firstName: this.userContacts ? this.userContacts.firstName : '',
      firstNameValid: false,
      lastName: this.userContacts ? this.userContacts.lastName : '',
      lastNameValid: false,
      country: '',
      address: '',
      addressdValid: false,
      city: '',
      cityValid: false,
      zipCode: '',
      zipCodeValid: false,
      region: '',
      cardsForSelection: [],
      accountId: '',
    }
  },
  mounted() {
    let cardsCreated = []
    if (this.cardType === 'credit') {
      cardsCreated.push({
        id: null,
        name: 'New card',
      })
    }
    this.cards.map((c) => {
      cardsCreated.push({
        id: c.id,
        name: c.card ? `${c.card.brand || ''} ${c.card.last4 || ''}` : '',
        disabled: true,
      })
    })
    this.cardsForSelection = cardsCreated

    let recaptchaScript = document.createElement('script')
    recaptchaScript.setAttribute('src', 'https://js.stripe.com/v3/')
    document.head.appendChild(recaptchaScript)
    this.configureStripe()
  },

  watch: {
    cardSelectId(val) {
      const candidate = this.cards.find((c) => c.id === this.cardSelectId)
      if (candidate) {
        this.cardSelect = candidate
        this.email = candidate.billing_details.email || this.email
        this.country = candidate.billing_details.address.country || ''
        this.address = candidate.billing_details.address.line1 || ''
        this.city = candidate.billing_details.address.city || ''
        this.region = candidate.billing_details.address.state || ''
        this.zipCode = candidate.billing_details.address.postal_code || ''
      } else {
        this.cardSelect = null
        this.country = ''
        this.address = ''
        this.city = ''
        ;(this.region = ''), (this.zipCode = '')
      }
      this.configureStripe()
    },
    idOrganizationSelect(val) {
      if (val) {
        this.cardsForSelection = this.cardsForSelection.map((c) => {
          return c.disabled ? { ...c, disabled: false } : c
        })

        this.organizationSelect = this.organizations.find((o) => o.id === val)
        this.accountId = this.organizationSelect.accountId
      } else {
        this.cardSelectId = null
        this.cardsForSelection = this.cardsForSelection.map((c) => {
          return c.disabled === false ? { ...c, disabled: true } : c
        })
      }
    },
    message(val) {
      if (val) {
        this.stripeLoader = false
        this.$swal({
          title: val,
          denyButtonClass: 'confirm',
        })
      }
    },
  },
  computed: {
    ...mapGetters('publicweb/general', {
      message: 'getMessage',
    }),
    isValid() {
      return (
        !!this.idOrganizationSelect &&
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
    ...mapActions('publicweb/general', ['apiDonationCardPaymentSweepstake']),

    configureStripe() {
      this.updateStripe()

      this.cardElement = null
      this.cvcElement = null
      this.elementsStripe = null

      this.elementsStripe = this.stripe.elements()
      if (this.cardSelect) {
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
    async send() {
      const sweepstakeName = this.sweepstakeName
      const nonprofitName = (this.organizationSelect && this.organizationSelect.name) || ''

      const thankText = `Thank you for entering the sweepstakes in support of  ${nonprofitName}. We're thrilled to have your support. Your donation will help us continue to work towards our purpose and accomplish our goals. It truly makes a difference for us, and we're extremely grateful!`

      if (this.cardSelect) {
        const result = {
          organizationId: this.organizationSelect.id,
          sweepstakeId: this.sweepstakeId,
          data: {
            amount: +this.price * 100,
            with_commission: this.payCommission,
            payment_method: this.cardSelectId,
            amount: +this.price * 100,
            with_commission: this.payCommission,
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
        this.paymentSelectedCard(result, thankText)
      } else {
        const result = {
          organizationId: this.organizationSelect.id,
          sweepstakeId: this.sweepstakeId,
          data: {
            amount: +this.price * 100,
            with_commission: this.payCommission,
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
        this.paymentNewCard(result, thankText)
      }
    },

    async paymentSelectedCard(data, thankText) {
      this.stripeLoader = true
      const result = await this.apiDonationCardPaymentSweepstake(data)
      if (!result) {
        this.stripeLoader = false
        return
      }
      await this.stripe
        .confirmCardPayment(result.clientSecret, {
          payment_method: result.paymentMethod,
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
              confirmButtonText: 'Back to Sweepstakes',
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

    async paymentNewCard(result, thankText) {
      const name = `${this.firstName} ${this.lastName}`
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
        let item
        result.data.payment_method = paymentMethod.id

        item = await this.apiDonationCardPaymentSweepstake(result)

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
                  title: thankText,
                  confirmButtonText: 'Back to Sweepstakes',
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
      }

      this.stripeLoader = false
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