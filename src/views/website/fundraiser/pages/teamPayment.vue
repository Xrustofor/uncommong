<template>
  <div>
    <bannerOrganization
      anchorName="#teamDonate"
      :fields="{ ...bannerItem }"
      :fundraiser="fundraiser"
      @shareAction="
        !shared ? sharedAction() : false
        shared = true
      "
    />
    <section class="body">
      <div class="section_top container">
        <router-link :to="`/fundraisers/${slug}/teams/${teamID}`">Return to Team Page</router-link>
      </div>
      <div class="section_body" id="donation">
        <div class="body_top">
          <h3>{{ `Donate to Team ${fundraiser.organization.name}` }}</h3>
        </div>
        <div class="body_main">
          <div class="body_left">
            <div class="body_left_top">
              <p>Donation Amount:</p>
              <p>
                <strong>${{ (+price + +commission) | _round }}</strong>
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
            <cardTypeSelect class="card_type" :options="cardTypeOptions" v-model="cardTypeSelect" />
            <ProgressBar class="progress_bar" :loading="loadingLocal" />
            <transition name="fade" v-if="!loadingLocal">
              <formCreditCard
                v-if="cardTypeSelect === 'credit'"
                :cards="cards"
                :cardType="cardTypeSelect"
                :organization="fundraiser.organization"
                :isAuthorized="isAuthorized"
                :payCommission="payСommission"
                :userContacts="userContacts"
                :priceCommission="+price + +commission"
                :modelType="'team'"
                :id="fundraiser.id"
                :modelId="team.id"
              />
            </transition>
            <transition name="fade" v-if="!loadingLocal">
              <formBankAcount
                v-if="cardTypeSelect === 'bank'"
                :bankAccounts="bankAccounts"
                :cardType="cardTypeSelect"
                :organization="fundraiser.organization"
                :isAuthorized="isAuthorized"
                :payCommission="payСommission"
                :userContacts="userContacts"
                :priceCommission="+price + +commission"
                :modelType="'team'"
                :id="fundraiser.id"
                :modelId="team.id"
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
    </section>
  </div>
</template>
<script>
import bannerOrganization from '@/common/bannerOrganization'
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

import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  components: {
    bannerOrganization,
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
      slug: this.$route.params.fundraiserSlug || '',
      teamID: +this.$route.params.teamID || '',
      payСommission: false,
      commission: 0,
      isAuthorized: false,
      price: +this.$route.query.price || 0,
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

    const { fundraiserSlug, teamID } = this.$route.params
    const data = {
      slug: fundraiserSlug,
      organizationFundraiserTeam: +teamID,
    }

    await this.apiGetfundraiserTeamData(data)

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
          break
        }
      }

      this.loadingLocal = false
    }
    this.$store.dispatch('setLoader', false)
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
            break
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
    ...mapGetters('fundraisers/team', {
      team: 'getTeam',
      fundraiser: 'getFundraiser',
      bannerItem: 'getBannerItem',
    }),

    ...mapGetters('fundraisers', {
      organization: 'getOrganization',
      bannerItems: 'getFundraiserItem',
    }),

    ...mapGetters({ loader: 'getWebsiteLoader' }),
    ...mapGetters('user', {
      userContacts: 'getUserContacts',
    }),

    ...mapGetters('publicweb/general', {
      cards: 'getCards',
      bankAccounts: 'getBankAccounts',
    }),
  },

  methods: {
    ...mapActions('team', ['apiGetNumberShared']),
    ...mapActions('fundraisers/team', ['apiGetfundraiserTeamData']),

    ...mapActions('publicweb/general', [
      'apiGetIsBillingsExists',
      'apiGetCards',
      'apiGetBankAccounts',
    ]),
    sharedAction() {
      this.apiGetNumberShared({
        fundId: this.fundraiser.url,
        teamId: this.team.id,
      })
    },
    commissionCalculation() {
      const cardType = this.cardTypeSelect
      const price = +this.price
      const percent = 'default'
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
section.body {
  min-height: 50vh;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  &::before,
  &::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    background-color: #77599b;
    opacity: 0.1;
    z-index: -1;
  }
  &::before {
    top: 700px;
    left: -400px;
    width: 800px;
    height: 800px;
  }
  &::after {
    top: 200px;
    right: -400px;
    width: 800px;
    height: 800px;
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
        min-height: 180px;
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
}
</style>
