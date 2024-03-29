<template>
  <div>
    <header
      :style="`background-image: linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${headerImg})`"
      class="sweepstake_payment"
    >
      <div class="container">
        <div class="header_footer">
          <p>{{ headerDescription }}</p>
        </div>
      </div>
    </header>
    <section>
      <div class="container">
        <div class="section_top">
          <router-link :to="`/sweepstakes/${slug}`">Return to Sweepstake Page</router-link>
        </div>
        <div class="section_body" id="donation">
          <div class="body_top">
            <h3>Make a Donation</h3>
          </div>

          <div class="body_main">
            <div class="body_left">
              <div class="body_left_top">
                <p>Donation Amount:</p>
                <p>
                  <strong>${{ (+price + +commission) | _round }}</strong>
                </p>
                <p>Donation entries:</p>
                <p>
                  <strong>{{ entries }}</strong>
                </p>
                <checkboxLabel
                  title="I would like my donation to cover transaction fees for this organization."
                  v-model="payСommission"
                />
              </div>
              <div class="body_left_bottom desc">
                <p>
                  Powered by <strong>stripe:</strong>
                  <router-link to="/terms-of-service" v-slot="{ href }" custom>
                    <a :href="href" target="_blank"> Terms of Service</a>
                  </router-link>
                  |
                  <router-link to="/privacy-policy" v-slot="{ href }" custom>
                    <a :href="href" target="_blank">Privacy Policy</a>
                  </router-link>
                  |
                  <router-link to="/sweepstake-rules" v-slot="{ href }" custom>
                    <a :href="href" target="_blank">Official Rules</a>
                  </router-link>
                </p>
              </div>
            </div>
            <div class="body_right">
              <cardTypeSelect
                class="card_type"
                :options="cardTypeOptions"
                v-model="cardTypeSelect"
              />
              <ProgressBar class="progress_bar" :loading="loadingLocal" />
              <transition name="fade" v-if="!loadingLocal">
                <formCreditCard
                  v-if="cardTypeSelect === 'credit'"
                  :organizations="organizationsOptions"
                  :cardType="cardTypeSelect"
                  :cards="cards"
                  :isMicro="prizes.isMicro"
                  :isAuthorized="isAuthorized"
                  :payCommission="payСommission"
                  :sweepstakeName="details.name"
                  :priceCommission="+price + +commission"
                  :sweepstakeId="sweepstakeId"
                  :userContacts="userContacts"
                />
              </transition>
              <transition name="fade" v-if="!loadingLocal">
                <formBankAcount
                  v-if="cardTypeSelect === 'bank'"
                  :organizations="organizationsOptions"
                  :cardType="cardTypeSelect"
                  :bankAccounts="bankAccounts"
                  :isMicro="prizes.isMicro"
                  :isAuthorized="isAuthorized"
                  :payCommission="payСommission"
                  :priceCommission="+price + +commission"
                  :sweepstakeId="sweepstakeId"
                  :userContacts="userContacts"
                />
              </transition>
              <div class="body_left_bottom mob">
                <p>
                  Powered by <strong>stripe:</strong>
                  <router-link to="/terms-of-service" v-slot="{ href }" custom>
                    <a :href="href" target="_blank"> Terms of Service</a>
                  </router-link>
                  |
                  <router-link to="/privacy-policy" v-slot="{ href }" custom>
                    <a :href="href" target="_blank">Privacy Policy</a>
                  </router-link>
                  |
                  <router-link to="/sweepstake-rules" v-slot="{ href }" custom>
                    <a :href="href" target="_blank">Official Rules</a>
                  </router-link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import inputLabel from '@/components/inputs/inputLabel'
import vSelect from 'vue-select'
import LoaderButton from '@/components/buttons/loaderButton'
import formCreditCard from '../components/formCreditCard'
import formBankAcount from '../components/formBankAcount'
import cardTypeSelect from '@/common/cardTypeSelect'
import ProgressBar from '@/components/progressBar.vue'
import checkboxLabel from '@/components/checkboxLabel'
import { commissionCalculation } from '@/helpers/script'
import { scroller } from 'vue-scrollto/src/scrollTo'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    inputLabel,
    vSelect,
    LoaderButton,
    formCreditCard,
    cardTypeSelect,
    formBankAcount,
    checkboxLabel,
    ProgressBar,
  },
  data() {
    return {
      payСommission: false,
      commission: 0,
      isAuthorized: false,
      price: +this.$route.query.price || 0,
      entries: +this.$route.query.entries || 0,
      slug: this.$route.params.sweepstakeId || '',
      headerImg: '',
      headerDescription: '',
      organizationsOptions: [],
      cardTypeOptions: [
        {
          title: 'Credit Card',
          icons: ['iconVisaCard', 'iconMasterCard'],
          value: 'credit',
        },
      ],
      cardTypeSelect: 'credit',
      isBillingInfo: false,
      loadingLocal: false,
    }
  },
  async created() {
    this.$store.dispatch('setLoader', true)
    const token = await this.$cookies.get('access_token')
    await this.apiGetSweepstakData(this.slug)

    if (token) {
      this.isAuthorized = true
      this.$store.dispatch('setLoader', true)
      this.isBillingInfo = await this.apiGetIsBillingsExists()
    } else {
      this.isAuthorized = false
    }
    this.$store.dispatch('setLoader', false)

    if (this.isBillingInfo) {
      this.cardTypeOptions.push({
        title: 'Bank Account',
        icons: ['iconBankAccount'],
        value: 'bank',
      })
      this.loadingLocal = true
      switch (this.cardTypeSelect) {
        case 'credit': {
          await this.apiGetCards()
          break
        }
        case 'bank': {
          await this.apiGetBankAccounts()
        }
      }
      this.loadingLocal = false
    }

    this.headerImg = this.details.image
    this.headerDescription = this.details.headline
    this.organizationsOptions = this.organizations.map((o) => ({
      name: o.name,
      id: +o.id,
      accountId: o.account_id,
    }))
  },
  watch: {
    loader(newVal) {
      if (!newVal) {
        const firstScrollTo = scroller()
        firstScrollTo('#donation')
      }
    },
    async cardTypeSelect(val) {
      this.commissionCalculation()

      if (this.isBillingInfo) {
        this.loadingLocal = true
        switch (val) {
          case 'credit': {
            await this.apiGetCards()
            break
          }
          case 'bank': {
            await this.apiGetBankAccounts()
          }
        }
        this.loadingLocal = false
      }
    },

    payСommission() {
      this.commissionCalculation()
    },
  },

  computed: {
    ...mapGetters({ loader: 'getWebsiteLoader' }),
    ...mapGetters('user', {
      userContacts: 'getUserContacts',
    }),
    ...mapGetters('publicweb/sweepstake', {
      details: 'getDetails',
      organizations: 'getOrganizations',
      cards: 'getCards',
      bankAccounts: 'getBankAccounts',
      prizes: 'getPrizes',
      sweepstakeId: 'getSweepstakeId',
    }),
  },
  methods: {
    ...mapActions('publicweb/sweepstake', [
      'apiGetSweepstakData',
      'apiGetCards',
      'apiGetBankAccounts',
      'apiGetIsBillingsExists',
    ]),

    commissionCalculation() {
      const cardType = this.cardTypeSelect
      const price = +this.$route.query.price || 0
      const percent = 'heightened'
      let result = 0

      if (this.payСommission) {
        result = commissionCalculation(price, cardType, percent)
      }

      this.commission = result
    },
  },
}
</script>
<style lang="scss" scoped>
header {
  min-height: 550px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  padding-top: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin-bottom: 3.2rem;
  @media (max-width: 992px) {
    min-height: 460px;
  }
  @media (max-width: 768px) {
    min-height: 360px;
  }
  .header_footer {
    max-width: 65%;
    background-color: rgba(99, 81, 122, 0.8);
    border-radius: 20px 20px 0px 0px;
    padding: 2.3rem 2.3rem 4.3rem 3rem;
    @media only screen and (max-width: 768px) {
      max-width: 100%;
      padding: 25px 15px;
    }
    p {
      color: $white;
      @include type(inherit, 56px, 900, none, 1.2);
      @media only screen and (max-width: 1299px) {
        @include type(inherit, 45px, 900, none, 1.2);
      }
      @media only screen and (max-width: 998px) {
        @include type(inherit, 40px, 900, none, 1.2);
      }
      @media only screen and (max-width: 768px) {
        @include type(inherit, 30px, 900, none, 1.2);
      }
    }
  }
}
section {
  margin-bottom: 6.5rem;
}
.section_top {
  a {
    color: $textLightBlue;
    font-family: Inter;
    font-style: normal;
    font-weight: normal;
    font-size: 1.8rem;
    text-decoration-line: underline;
  }
}
.section_body {
  max-width: 999px;
  width: 100%;
  padding-top: 65px;
  margin: 0 auto 10rem;
}
.body_top {
  margin-bottom: 2.7rem;
  h3 {
    color: $violet;
    font-family: Inter;
    font-style: normal;
    font-weight: 800;
    font-size: 3rem;
    line-height: 3.6rem;
  }
}
.body_main {
  background: $white;
  border: 1px solid #4b3d5b;
  box-shadow: 0px 24px 20px rgba(154, 131, 183, 0.05), 0px 3px 2px rgba(154, 131, 183, 0.02),
    0px 8px 100px rgba(154, 131, 183, 0.1);
  border-radius: 20px;
  min-height: 50rem;
  display: flex;
  & .body_right,
  & .body_left {
    padding: 4.3rem 5.5rem;
    width: 50%;
    min-height: 100%;
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
.body_left_bottom {
  &.mob {
    display: none;
    @media (max-width: 768px) {
      display: block;
      margin: -10px 0 15px;
    }
  }
  &.desc {
    @media (max-width: 768px) {
      display: none;
    }
  }
  p {
    font-family: Inter;
    font-style: normal;
    font-weight: normal;
    font-size: 1.4rem;
    color: $violet;
    strong {
      font-weight: bold;
    }
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

.progress_bar {
  margin: 0;
  padding-bottom: 0.5rem;
}

.card_type {
  margin-bottom: 3rem;
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
