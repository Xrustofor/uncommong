<template>
  <div class="body_main">
    <span class="icon_close" @click="$emit('close')" v-if="btnClose">
      <icon-base width="15" height="15" icon-name="close">
        <icon-close />
      </icon-base>
    </span>

    <div class="body_left">
      <div class="body_left_top">
        <p>Donation Amount:</p>
        <p>
          <strong>${{ (+price + +commission) | _round }}</strong>
        </p>
        <checkboxLabel
          title="I would like my donation to cover transaction fees for this organization."
          :value="payCommission"
          @input="
            $emit('setCommission', !payCommission)
            isPayCommission = !payCommission
          "
        />
      </div>
      <radioButtons
        v-if="showDonateType"
        class="radio_buttons"
        :options="donateTypeOptions"
        v-model="donateTypeSelect"
      />
      <div class="spacer"></div>
      <div class="body_left_bottom">
        <p>
          Powered by <strong>stripe: </strong>
          <router-link to="/terms-of-service" v-slot="{ href }" custom>
            <a :href="href" target="_blank">Terms of Service</a>
          </router-link>
          |
          <router-link to="/privacy-policy" v-slot="{ href }" custom>
            <a :href="href" target="_blank">Privacy Policy</a>
          </router-link>
        </p>
      </div>
    </div>
    <div class="body_right">
      <cardTypeSelect
        class="card_type"
        :options="cardTypeOptions"
        :value="cardTypeSelect"
        @input="setCardType"
      />
      <ProgressBar class="progress_bar" :loading="loading" />
      <div class="group_form">
        <formCreditCard
          v-if="cardTypeSelect === 'credit' && !loading"
          class="animation_block"
          :cards="cards"
          :accountId="organization.account_id"
          :organizationId="organization.id"
          :organizationName="organization.name"
          :price="price"
          :isPayCommission="isPayCommission"
          :priceCommission="+price + +commission"
          :donateType="donateType"
          :productId="productId"
          :userContacts="userContacts"
          :countSpecialDonate="countSpecialDonate"
          :paymentType="currentDonorType"
          @isValid="isValid = $event"
        />
        <formBankAcount
          v-if="cardTypeSelect === 'bank' && !loading"
          class="animation_block"
          :bankAccounts="bankAccounts"
          :organizationId="organization.id"
          :organizationName="organization.name"
          :price="price"
          :isPayCommission="isPayCommission"
          :priceCommission="+price + +commission"
          :donateType="donateType"
          :productId="productId"
          :userContacts="userContacts"
          :countSpecialDonate="countSpecialDonate"
          :donationType="currentDonorType"
          :paymentType="currentDonorType"
        />
      </div>
    </div>
  </div>
</template>
<script>
import IconBase from '@/components/IconBase'
import iconClose from '@/components/icons/iconClose'
import checkboxLabel from '@/components/checkboxLabel'
import cardTypeSelect from '@/common/cardTypeSelect'
import ProgressBar from '@/components/progressBar.vue'
import formCreditCard from '@/views/website/organizations/components/formCreditCard'
import formBankAcount from '@/views/website/organizations/components/formBankAcount'
import LoaderButton from '@/components/buttons/loaderButton.vue'
import radioButtons from '@/views/website/organizations/components/radioButtons'

export default {
  props: {
    btnClose: { type: Boolean, default: true },
    loading: { type: Boolean, default: false },
    payCommission: { type: Boolean, default: false },
    commission: { type: Number, default: 0 },
    organization: { tupe: Object, default: {} },
    donateType: { type: String, default: '' },
    cardTypeSelect: String,
    price: Number,
    cardTypeOptions: {
      type: Array,
      default: [
        {
          title: 'Credit Card',
          icons: ['iconVisaCard', 'iconMasterCard'],
          value: 'credit',
        },
      ],
    },
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
    bankAccounts: Array,
    productId: { type: Number, default: null },
    countSpecialDonate: { type: Number, default: null },
    userContacts: {
      type: Object,
      default: { email: '', firstName: '', lastName: '' },
    },
    showDonateType: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    IconBase,
    iconClose,
    cardTypeSelect,
    checkboxLabel,
    ProgressBar,
    formCreditCard,
    formBankAcount,
    LoaderButton,
    radioButtons,
  },
  data() {
    return {
      isValid: false,
      isPayCommission: false,
      donateTypeOptions: [
        { id: 1, name: 'Donate Once', key: 'donate_once', active: true },
        { id: 2, name: 'Donate Monthly', key: 'donate_monthly' },
      ],
      donateTypeSelect: null,
      currentDonorType: Object,
    }
  },
  watch: {
    donateTypeSelect(val) {
      this.donateTypeOptions = this.donateTypeOptions.map((d) => {
        if (d.id === +val) {
          this.currentDonorType = { id: d.id, key: d.key, name: d.name }
          return { ...d, active: true }
        } else {
          return { ...d, active: false }
        }
      })
    },
  },
  methods: {
    setCardType(type) {
      this.$emit('cardTypeSelect', type)
      this.isValid = false
    },
  },
}
</script>
<style lang="scss" scoped>
.body_main {
  background: $white;
  border: 1px solid #4b3d5b;
  box-shadow: 0px 24px 20px rgba(154, 131, 183, 0.05), 0px 3px 2px rgba(154, 131, 183, 0.02),
    0px 8px 100px rgba(154, 131, 183, 0.1);
  border-radius: 20px;
  min-height: 50rem;
  display: flex;
  position: relative;
  & .body_right,
  & .body_left {
    padding: 4.3rem 5.5rem;
    width: 50%;
    display: flex;
    flex-direction: column;
  }
  @media (max-width: 768px) {
    flex-direction: column;
    & .body_right,
    & .body_left {
      padding: 2rem;
      width: 100%;
      min-height: 350px;
    }
  }
}
.icon_close {
  position: absolute;
  z-index: 1;
  top: 2rem;
  right: 2rem;
  cursor: pointer;
}
.body_left {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    width: 0.7rem;
    background: linear-gradient(89.97deg, #f1f1f1 0.03%, rgba(241, 241, 241, 0) 99.97%);
    transform: matrix(-1, 0, 0, 1, 0, 0);
  }
}
.body_left_top {
  p {
    font-family: Inter;
    font-style: normal;
    font-weight: normal;
    font-size: 2.4rem;
    line-height: 2.9rem;
    color: $violet;
    margin-bottom: 2.6rem;
    strong {
      font-weight: 800;
    }
  }
}
.body_left_bottom p {
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 1.4rem;
  color: $violet;
  strong {
    font-weight: bold;
  }
}
.section_bootom {
  h4 {
    font-family: Inter;
    font-style: normal;
    font-weight: 900;
    font-size: 2.4rem;
    color: $violet;
    margin-bottom: 2rem;
  }
  p {
    color: $violet;
    font-size: 2rem;
    font-size: 1.4rem;
  }
}
.card_type {
  margin-bottom: 3rem;
}

.bottom {
  margin-top: 2.7rem;
  button {
    width: 100%;
  }
}

.group_form {
  flex: 1;
}

.animation_block {
  animation-name: fade;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}
.progress_bar {
  margin: 0;
  padding-bottom: 0.5rem;
}

.radio_buttons {
  margin-top: 35px;
}

@keyframes fade {
  0% {
    opacity: 0;
    transition: opacity linear 0.3s;
  }
  100% {
    opacity: 1;
    transition: opacity linear 0.3s;
  }
}
</style>