<template>
  <div 
    class="container_body"
    v-if="!localLoading"
    id="content"
  >
    <div class="content_donations" v-if="donationsAllowance">
      <h3>Make a Donation</h3>
      <donationsTable
        v-if="showDonationsTable"
        class="content_donations"
        :items="optionsDonate"
        :loading="false"
        @click="fillFormDonate($event, 'donation')"
      />
      <paymentForm
        class="content_form"
        v-else
        :payCommission="payСommission"
        :price="donateSelectPrice"
        :cardTypeOptions="cardTypeOptions"
        :cardTypeSelect="cardTypeSelect"
        :cards="cards"
        :bankAccounts="bankAccounts"
        :commission="commission"
        :loading="loadingLocal"
        :accountId="organization.account_id"
        :organization="organization"
        :donateType="donateType"
        :userContacts="userContacts"
        :showDonateType="true"
        @setCommission="payСommission = $event"
        @close="showDonationsTable = true"
        @cardTypeSelect="cardTypeSelect = $event"
      />
    </div>
    <div
      id="special_donation"
      class="specials_donations" 
      v-if="specialDonations.length > 0"
    >
      <div class="specials_donations_title">
        <h2>Special Donations</h2>
      </div>
      <div class="row animation_fade" v-if="showSpecialDonations">
        <div class="col-6" v-for="item in specialDonations" :key="`specia-${item.name}`">
          <SpecialDonation
            @purchase="
              fillFormDonate($event, 'special_donation')
              selectedSpecialDonate = item
            "
            @readMore="modalToggle(item, 'special_donation')"
            :specialDonation="item"
            :loading="false"
          ></SpecialDonation>
        </div>
      </div>
      <div class="content_donations" v-else>
        <paymentForm
          class="content_form"
          :payCommission="payСommission"
          :price="donateSelectPrice"
          :cardTypeOptions="cardTypeOptions"
          :cardTypeSelect="cardTypeSelect"
          :cards="cards"
          :bankAccounts="bankAccounts"
          :commission="commission"
          :loading="loadingLocal"
          :accountId="organization.account_id"
          :organization="organization"
          :donateType="donateType"
          :userContacts="userContacts"
          :productId="selectedSpecialDonate ? +selectedSpecialDonate.id : null"
          :countSpecialDonate="selectedSpecialDonate ? +count : null"
          @close="showSpecialDonations = true"
          @setCommission="payСommission = $event"
          @cardTypeSelect="cardTypeSelect = $event"
        />
      </div>
    </div>
    <popPup 
      v-model="popPup"
      class="special_donation_popup"
      maxWidth="100%"
    >
      <template #body v-if="showSpecialDonateModal">
        <SpecialDonationModal
          class="special__donation_modal"
          :item="{ ...selectedSpecialDonate }"
          @purchase="purchase({ id: $event, type: 'special_donation', isModal: true })"
          @hideModal="modalToggle"
        ></SpecialDonationModal>
      </template>
      <template #body v-else>
        <div class="content_donations">
          <paymentForm
            class="content_form"
            :btnClose="false"
            :payCommission="payСommission"
            :price="donateSelectPrice"
            :cardTypeOptions="cardTypeOptions"
            :cardTypeSelect="cardTypeSelect"
            :cards="cards"
            :bankAccounts="bankAccounts"
            :commission="commission"
            :loading="loadingLocal"
            :accountId="organization.account_id"
            :organization="organization"
            :donateType="donateType"
            :userContacts="userContacts"
            :productId="selectedSpecialDonate ? +selectedSpecialDonate.id : null"
            :countSpecialDonate="selectedSpecialDonate ? +count : null"
            @close="showSpecialDonations = true"
            @setCommission="payСommission = $event"
            @cardTypeSelect="cardTypeSelect = $event"
          />
        </div>
      </template>
    </popPup>
  </div>
</template>
<script>

import IntroSection from '@/common/website/introSection.vue';
import LoaderButton from '@/components/buttons/loaderButton.vue';
import NumberInput from '@/components/inputs/numberInput.vue';
import SpecialDonation from '../components/specialDonation.vue';
import popPup from '@/common/popPup';
import SpecialDonationModal from '../components/specialDonationModal';
import { mapGetters, mapActions } from 'vuex';
import CreatePaymentMethod from '../components/createPaymentMethod.vue';
import { commissionCalculation } from '@/helpers/script';
import donationsTable from '@/views/website/organizations/components/donationsTable';
import paymentForm from '../../../../views/website/organizations/components/paymentForm';

export default {
  name: 'organization-donate',
  components: {
    IntroSection,
    LoaderButton,
    SpecialDonation,
    SpecialDonationModal,
    CreatePaymentMethod,
    NumberInput,
    popPup,
    donationsTable,
    paymentForm,
  },
  data() {
    return {
      loadingDonate: false,
      specialDonationLoading: true,
      isAuthenticated: false,
      billingInfoModal: false,
      special: true,
      stripe: '',
      stripeAPIToken: process.env.VUE_APP_STRIPE_KEY,
      modal: false,
      donate: '',
      specialAmount: '',
      count: 1,
      isAuthorized: false,
      isBillingInfo: false,
      payСommission: false,
      optionsDonate: [1, 5, 10, 20, 50, 100, 500, 1000],
      showDonationsTable: true,
      donateSelectPrice: null,
      cardTypeOptions: [
        {
          default: true,
          title: 'Credit Card',
          icons: ['iconVisaCard', 'iconMasterCard'],
          value: 'credit',
        },
      ],
      cardTypeSelect: 'credit',
      cards: [],
      bankAccounts: [],
      commission: 0,
      loadingLocal: false,
      specialDonationsSelect: null,
      showSpecialDonations: true,
      showSpecialDonateModal: false,
      donateType: '',
      selectedSpecialDonate: null,
      popPup: false,
    }
  },
  async created() {
    const token = await this.$cookies.get('access_token');

    if (token) {
      this.isAuthorized = true;
      this.isBillingInfo = await this.apiGetIsBillingsExists();
    } else {
      this.isAuthorized = false;
    }

    if (this.isBillingInfo) {
      this.cardTypeOptions.push({
        title: 'Bank Account',
        icons: ['iconBankAccount'],
        value: 'bank',
      })

      this.getDataForPay(this.cardTypeSelect);
    }

    this.checkAuthenticated();
    localStorage.setItem('startDonation', false);
    await this.getApiOrganization(this.$route.params.idNonprofits);
    await this.checkDonationsAllowance(this.organization.id);
  },
  mounted() {
    const { id, type, isModal, price, count } = this.$route.query;
    let modal = false;
    if (isModal) {
      modal = JSON.parse(isModal);
    }

    if (type) {
      switch (type) {
        case 'donation': {
          if (price) this.paymentStart(price, type);
          break;
        }
        case 'special_donation': {
          const candidate = this.specialDonations.find((s) => +s.id === +id);
          if (candidate) {
            this.selectedSpecialDonate = candidate;
          }

          if (price && !modal) {
            this.paymentStart(price, type);
          }

          if (candidate && modal) {
            this.modalToggle(candidate, type);
            this.showSpecialDonateModal = false;
          }
          break;
        }
        default:
          break;
      }
    }
  },

  watch: {
    cardTypeSelect(val) {
      this.commissionCalculation();
      this.getDataForPay(val);
    },
    payСommission() {
      this.commissionCalculation();
    },

    donate(val) {
      this.donate = String(val).replace(/[^\d]/g, '');
      if (+val[0] === 0) {
        this.donate = val.substr(1);
      }
    },
  },

  computed: {
    ...mapGetters('user', {
      userContacts: 'getUserContacts',
    }),
    ...mapGetters('publicweb/general', {
      loading: 'getLoading',
      getCards: 'getCards',
    }),
    ...mapGetters('organizations/organizations', {
      specialDonations: 'getSpecialDonations',
      donationsAllowance: 'getDonationsAllowance',
      organization: 'getOrganization',
      localLoading: 'getlocalLoading',
    }),

    ...mapGetters('billing', {
      billingInfo: 'getBillingExists',
      checkoutBase: 'getCheckoutBase',
      checkoutSpecial: 'getCheckoutSpecial',
      specialDonateMessage: 'getSpecialDonateMessage',
      baseDonateMessage: 'getBaseDonateMessage',
      specialDonateError: 'getSpecialDonateError',
      donateError: 'getDonateError',
    }),
  },

  methods: {
    ...mapActions('publicweb/general', [
      'apiGetIsBillingsExists',
      'apiGetCards',
      'apiGetBankAccounts',
    ]),
    ...mapActions('organizations/organizations', [
      'getApiOrganization',
      'checkDonationsAllowance',
      'getSpecialDonation',
    ]),

    commissionCalculation() {
      const cardType = this.cardTypeSelect;
      let result = 0;
      if (this.payСommission) {
        result = commissionCalculation(this.donateSelectPrice, cardType);
      }
      this.commission = result;
    },
    async getDataForPay(cardType = this.cardTypeSelect) {
      switch (cardType) {
        case 'credit': {
          this.loadingLocal = true;
          await this.apiGetCards();
          this.cards = [];
          const items = [];
          this.getCards.map(p => {
            items.push({
              ...p,
              name: p.card ? `${p.card.brand || ""} ${p.card.last4 || ""}` : "",
            })
          })
          items.push({ id: null, name: 'New card' });
          this.cards = items;
          this.loadingLocal = false;
          break;
        }
        case 'bank': {
          this.loadingLocal = true;
          this.bankAccounts = [];
          this.bankAccounts = await this.apiGetBankAccounts();
          this.loadingLocal = false;
          break;
        }
      }
    },

    modalToggle(data, donateType) {
      this.donateType = donateType;
      this.selectedSpecialDonate = data;
      this.showSpecialDonateModal = true;
      this.donateSelectPrice = +data.price;
      this.popPup = true;
    },
    async purchase(val) {
      
      const { id, type, isModal } = val;
      const urlData = {
        url: this.$route.fullPath,
        query: { id, type, isModal },
      }

      let success = false

      if (this.isAuthorized) {
        const { isModal } = this.$route.query;
        this.showSpecialDonateModal = false;
        return
      } else {
        success = await this.authorizationMessage(urlData);
      }
      if (success) {
        this.showSpecialDonateModal = false;
      }
    },

    ...mapActions('billing', [
      'checkBillingExists',
      'getCheckoutSpecial',
      'getCheckoutBase',
      'baseDonate',
      'specialDonate',
      'setDonateError',
      'setSpecialDonateError',
    ]),

    async fillFormDonate(val, donateType) {
      
      const { count, id, price } = val;
      let urlData = {};

      switch(donateType){
        case 'donation':{
          urlData = {
            url: `${this.$route.path}#content`,
            query: {
              id: id,
              price: +val,
              count: count,
              type: donateType,
            }
          }
          break;
        };
        case 'special_donation': {
          urlData = {
            url: `${this.$route.path}#${donateType}`,
            query: {
              id: id,
              price: +price,
              count: count,
              type: donateType,
            }
          }
          break;
        }
      }

      let success = false

      if (this.isAuthorized) {
        this.paymentStart(val, donateType);
        return;
      } else {
        success = await this.authorizationMessage(urlData);
      }
      if (success) {
        this.paymentStart(val, donateType);
        return;
      }
    },

    paymentStart(val, donateType) {
      this.donateType = donateType;
      this.donateSelectPrice = null;
      this.showDonationsTable = this.showSpecialDonations = true;
      switch (donateType) {
        case 'donation': {
          this.donateSelectPrice = +val;
          this.showDonationsTable = false;
          break;
        }
        case 'special_donation': {
          this.donateSelectPrice = val.price ? +val.price : +val;
          this.showSpecialDonations = false;
          break;
        }
      }
    },

    async authorizationMessage(urlData) {
      let success = false
      await this.$swal({
        title: 'Please sign up for a better experience',
        showDenyButton: true,
        denyButtonText: 'Sign Up',
        denyButtonClass: 'confirm',
        confirmButtonText: 'Continue as Guest',
        confirmButtonClass: 'cancel',
        showCloseButton: true,
      }).then((result) => {
        if (result.isDenied) {
          this.$store.commit('setReturnLink', urlData);
          this.$router.push({ path: '/login' });
          return;
        }
        if (result.isConfirmed) {
          success = true;
        }
      })
      return success;
    },

    priceInput(val) {
      this.donate = val;
    },
    checkAuthenticated() {
      const token = this.$cookies.get('access_token');
      if (token != null) {
        this.isAuthenticated = true;
      } else this.isAuthenticated = false;
    },
    async useCheckoutBase() {
      var data = {
        id: this.organization.id,
        product: {
          amount: this.donate * 100,
          success_url: window.location.origin + '/nonprofits/' + this.organization.slug,
          cancel_url: window.location.origin + '/nonprofits/' + this.organization.slug + '/donate',
        },
      }

      await this.stripeConfiguration();
      await this.getCheckoutBase(data);

      if (this.checkoutBase != null) {
        this.stripe.redirectToCheckout({ sessionId: this.checkoutBase });
      }
      this.loadingDonate = false
    },
    async useCheckoutSpecial() {
      var data = {
        id: this.organization.id,
        product: {
          product_id: this.specialAmount,
          count: this.count,
          success_url: window.location.origin + '/nonprofits/' + this.organization.slug,
          cancel_url: window.location.origin + '/nonprofits/' + this.organization.slug + '/donate',
        },
      }

      await this.stripeConfiguration();
      await this.getCheckoutSpecial(data);

      if (this.specialDonateError !== null) {
        this.hideModal();
        this.$swal({
          title: this.specialDonateError,
          confirmButtonText: 'OK',
        })
      } else if (this.checkoutSpecial != null && this.specialDonateError == null) {
        this.stripe.redirectToCheckout({ sessionId: this.checkoutSpecial });
      }
      this.specialDonationLoading = false;
    },
    stripeConfiguration() {
      const accountId = this.organization.account_id;
      this.stripe = Stripe(this.stripeAPIToken, { stripeAccount: accountId });
    },

    hideModal() {
      this.modal = false;
      this.specialDonationLoading = false;
      this.loadingDonate = false;
    },

    setDonate(data) {
      this.donate = data;
    },

    async donateFinish(base) {
      var self = this;
      await this.baseDonate(base);
      if (this.donateError !== null) {
        this.$swal({
          title: this.donateError,
          showConfirmButton: false,
          showDenyButton: true,
          denyButtonText: 'OK',
        })
      } else {
        this.$swal({
          title: this.baseDonateMessage,
          confirmButtonText: 'OK',
        }).then(() => {
          self.goBack()
        })
      }
      this.setDonateError(null);
      this.loadingDonate = false;
    },
    async specialFinish(special) {
      var self = this;
      await this.specialDonate(special);
      if (this.specialDonateError !== null) {
        this.$swal({
          title: this.specialDonateError,
          showConfirmButton: false,
          showDenyButton: true,
          denyButtonText: 'OK',
        })
      } else
        this.$swal({
          title: this.specialDonateMessage,
          confirmButtonText: 'OK',
        }).then(() => {
          self.goBack()
        })
      this.setSpecialDonateError(null)
      this.specialDonationLoading = false;
    },
    restrictChars($event) {
      if (
        event.charCode == 8 || event.charCode == 0
          ? null
          : event.charCode >= 48 && event.charCode <= 57
      ) {
        return true
      } else {
        $event.preventDefault();
      }
    },
    goBack() {
      this.$router.push({
        path: '/nonprofits/' + this.organization.slug,
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.special_donation_popup {
  align-items: baseline;
  @media only screen and (max-width: 992px) {
    .special__donation_modal {
      flex-direction: column;
      align-items: center;
    }
  }
}
.container_body {
  min-height: 450px;
}
.content_donations {
  max-width: 865px;
  margin: 0 auto;
  animation-name: fade;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  .donations_table {
    border-radius: 10px;
    border: 1px solid $websiteViolet;
    background-color: white;
    padding: 48px 64px 56px;
    margin-bottom: 90px;
    border: 1px solid #4b3d5b;
    box-shadow: 0px 24px 20px rgba(154, 131, 183, 0.05), 0px 3px 2px rgba(154, 131, 183, 0.02),
      0px 8px 100px rgba(154, 131, 183, 0.1);
    border-radius: 20px;
    @media only screen and (max-width: 1299px) {
      padding: 40px 35px;
    }
    @media only screen and (max-width: 499px) {
      padding: 30px 20px;
    }
    p {
      font-size: 14x;
      font-weight: 700;
      line-height: 1.4;
      margin-bottom: 30px;
      color: $websiteViolet;
    }
    &_donate-list {
      width: calc(100% + 52px);
      margin-left: -26px;
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 13px;
      @media only screen and (max-width: 768px) {
        width: calc(100% + 30px);
        margin-left: -15px;
      }
      @media only screen and (max-width: 599px) {
        width: calc(100% + 20px);
        margin-left: -10px;
      }
      @media only screen and (max-width: 399px) {
        width: calc(100% + 10px);
        margin-left: -5px;
      }
    }
    .btn-white {
      font-size: 14px;
      font-weight: 500;
      color: $websiteViolet;
      text-transform: uppercase;
      min-width: calc((100% - 208px) / 4);
      width: calc((100% - 208px) / 4);
      margin: 0 26px 27px;
      padding: 0;
      &:hover {
        color: #fff;
      }
      @media only screen and (max-width: 768px) {
        min-width: calc((100% - 90px) / 3);
        width: calc((100% - 90px) / 3);
        margin: 0 15px 20px;
      }
      @media only screen and (max-width: 599px) {
        width: calc((100% - 40px) / 2);
        min-width: auto;
        margin: 0 10px 20px;
      }
      @media only screen and (max-width: 399px) {
        font-size: 13px;
        width: calc((100% - 20px) / 2);
        margin: 0 5px 20px;
      }
    }
    form {
      position: relative;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 40px;
      border: 1px solid #bbbbbb;
      padding-right: 5px;
      box-shadow: 0 24px 20px rgba($color: #9a83b7, $alpha: 0.05);
      @media only screen and (max-width: 499px) {
        flex-wrap: wrap;
        border: 1px solid transparent;
      }
      .btn {
        font-weight: 700;
        min-width: 125px;
        color: #454545;
        box-shadow: none;
        @media only screen and (max-width: 499px) {
          width: 100%;
        }
      }
      input {
        max-width: 100%;
        height: 7rem;
        padding-left: 35px;
        border: none;
        border-radius: 40px;
        @media only screen and (max-width: 1299px) {
          height: 6rem;
        }
        @media only screen and (max-width: 499px) {
          border: 1px solid #bbbbbb;
          margin-bottom: 15px;
        }
      }
    }
    .btn-link {
      font-size: 14px;
      font-weight: 400;
    }
  }
  h3 {
    font-size: 30px;
    line-height: 1.2;
    font-weight: 900;
    color: $websiteViolet;
    margin-bottom: 27px;
  }
}

.btn-underline {
  border-bottom-color: #6db5d1;
  &:hover {
    border-bottom-color: $green;
  }
}
.specials_donations {
  .row {
    align-items: stretch;
    .col-6 {
      display: flex;
    }
  }
  &_title {
    margin-bottom: 7rem;
    h2 {
      font-size: 30px;
      line-height: 1.2;
      font-weight: 900;
      color: $websiteViolet;
    }
  }
}
.content_form {
  margin-bottom: 9rem;
  animation-name: fade;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}

.animation_fade {
  animation-name: fade;
  animation-duration: 1s;
  animation-fill-mode: forwards;
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