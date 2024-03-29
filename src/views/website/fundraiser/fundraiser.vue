<template>
  <div v-if="fundraiser">
    <bannerOrganization
      anchorName="#donate"
      :fields="{ ...bannerInfo, daysRemains: time.daysRemains }"
      :fundraiser="fundraiserFull"
      :isBtnDonate="donationAllowed"
      @donate="isPushDonate"
      @shareAction="
        !shared ? apiGetNumberShared() : false
        shared = true
      "
    />
    <div class="grid">
      <div class="column">
        <p class="article-title">About This Fundraiser</p>
        <div class="html_editor" v-html="fundraiser.story"></div>

        <TabsContainer
          v-if="updates.length || milestones.length"
          class="empty"
          :tabs="tabs.updates"
        >
          <template #updates>
            <div class="update" v-for="(update, index) in updates" :key="index">
              <p class="update__title">
                Published {{ update.created_at | _moment('MM/DD/YY', 'YYYY-MM-DD HH:mm') }}
              </p>
              <p class="update__subtitle">By {{ update.author }}</p>
              <p class="update__description" v-html="update.post"></p>
            </div>
          </template>
          <template #milestones>
            <div class="update" v-for="(milestone, index) in milestones" :key="index">
              <p class="update__title">
                Milestone #{{ index + 1 }}: Raise ${{ toThousands(milestone.amount / 100) }}
              </p>
              <p class="update__subtitle" v-if="milestone.reached_on">
                Reached on {{ milestone.reached_on | _moment('MM/DD/YY', 'YYYY-MM-DD HH:mm') }}
              </p>
              <p class="update__subtitle" v-else>
                Remaining ${{ toThousands((milestone.amount - fundraiser.amount_raised) / 100) }}
              </p>
              <p class="update__description">{{ milestone.incentive }}</p>
            </div>
          </template>
        </TabsContainer>
      </div>
      <div class="column" id="donate">
        <TabsContainer
          v-if="donationAllowed"
          :tabs="resetTypeDonate || tabs.donate"
          @selectTab="selectTab"
        >
          <template #donate>
            <DonationTable
              :items="[1, 25, 50, 100, 250, 500]"
              class="fundraiser"
              @click="sendDonate($event)"
              @sendFreeDonate="sendDonate($event)"
            />
          </template>
          <template #participate>
            <p class="participate__title">
              Looking for more ways to spread <br />
              UncommonGood?
            </p>
            <div class="participate__container">
              <span
                >Start your own fundraising team and invite friends and family to support "{{
                  fundraiser.name
                }}".
              </span>
              <button
                @click.prevent="
                  goTo(`/admin/account/teams/fundraiser/${fundSlug}/p2p-team-creation#participate`)
                "
                class="btn btn-yellow"
                style="height: 60px"
              >
                create a new team
              </button>
            </div>
            <div class="participate__container">
              <span>Or, support "{{ fundraiser.name }}" as an individual.</span>
              <button
                @click.prevent="
                  goTo(
                    `/admin/account/campaigns/fundraiser/${fundSlug}/p2p-contributor-creation#participate`
                  )
                "
                class="btn btn-yellow"
                style="height: 60px"
              >
                start fundraising
              </button>
            </div>
          </template>
        </TabsContainer>
        <TabsContainer :tabs="tabs.ranking" class="pt-0">
          <template #ranking>
            <NumberedList
              title="Top Individuals"
              :items="individuals"
              :headers="rankingHeaders"
              :clickable="true"
              :style="{ marginBottom: '30px', maxWidth: '100%' }"
              @action="$router.push({ path: $event.url })"
            >
            </NumberedList>
            <NumberedList
              title="Top Teams"
              :items="teams"
              :headers="rankingHeaders"
              :clickable="true"
              :style="{ maxWidth: '100%' }"
              @action="$router.push({ path: $event.url })"
            >
            </NumberedList>
          </template>
          <template #donations>
            <donationProgress
              :raised="fundraiser.amount_raised / 100"
              raisedText="RAISED:"
              :goal="fundraiser.goal / 100"
              goalText="GOAL:"
              class="remains-none"
            />
            <div class="donation-progress">
              <div class="donation-progress__results">
                <div class="item">
                  <icon-base>
                    <icon-like></icon-like>
                  </icon-base>
                  <span class="title">{{ fundraiser.uniqueDonorsCount }} DONORS</span>
                </div>
                <div class="item">
                  <icon-base>
                    <icon-telegram></icon-telegram>
                  </icon-base>
                  <span class="title">{{ fundraiser.shared_count }} SHARES</span>
                </div>
              </div>
            </div>
            <NumberedList
              :items="lastDonations"
              :headers="donationsHeaders"
              style="margin-top: 30px; max-width: 100%"
            >
            </NumberedList>

            <button-input
              class="fundraiser"
              v-model="donations"
              @send="sendDonate($event)"
              v-if="donationAllowed"
            />
          </template>
        </TabsContainer>
      </div>
    </div>
  </div>
</template>

<script>
import bannerOrganization from '@/common/bannerOrganization'
import TabsContainer from '@/common/tabsContainer'
import donationProgress from '@/components/donationProgress'
import NumberedList from '@/components/numberedList.vue'
import ButtonInput from '@/views/website/sweepstakes/components/buttonInput'
import DonationTable from '@/views/website/organizations/components/donationsTable.vue'
import BreadCrumbs from '@/common/breadCrumbs'
import LoaderButton from '@/components/buttons/loaderButton'
import IconBase from '@/components/IconBase'
import iconTelegram from '@/components/icons/iconTelegram'
import iconLike from '@/components/icons/iconLike'
import { scroller } from 'vue-scrollto/src/scrollTo'

import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Fundraiser',
  components: {
    DonationTable,
    ButtonInput,
    bannerOrganization,
    TabsContainer,
    donationProgress,
    NumberedList,
    BreadCrumbs,
    IconBase,
    LoaderButton,
    iconTelegram,
    iconLike,
  },
  data() {
    return {
      isAuthorized: false,
      fundSlug: this.$router.history.current.params.idFund,
      donateSizeOptions: [],
      donations: '',

      shared: false,

      rankingHeaders: [
        { key: 'number', className: 'xsmall' },
        { key: 'image', className: 'small' },
        { key: 'name' },
        { key: 'amount', className: 'right' },
      ],
      donationsHeaders: [
        { key: 'image', className: 'small' },
        { key: 'name', className: 'medium' },
        { key: 'time' },
        { key: 'amount', className: 'right' },
      ],
      resetTypeDonate: undefined,
    }
  },
  async created() {
    this.$store.dispatch('setLoader', true)
    this.isAuthorized = (await this.$cookies.get('access_token')) ? true : false
    await this.getApiFundraiser(this.fundSlug)
    this.$store.dispatch('setLoader', false)

    const hash = this.$route.hash.replace('#', '')
    let tabs = JSON.parse(JSON.stringify(this.tabs))
    let donate = tabs.donate
    if (hash) {
      switch (hash) {
        case 'donate': {
          donate = donate.map((d) => {
            return d.key === hash ? { ...d, isActive: true } : { ...d, isActive: false }
          })
          break
        }
        case 'participate': {
          donate = donate.map((d) => {
            return d.key === hash ? { ...d, isActive: true } : { ...d, isActive: false }
          })
          break
        }
      }
      this.resetTypeDonate = donate
    }
  },

  beforeRouteEnter(to, from, next) {
    const fromUrl = from.path
    const toUrl = to.path

    next((vm) => {
      if (fromUrl === toUrl + 'payment') {
        setTimeout(() => {
          vm.getApiFundraiser(vm.fundSlug)
        }, 5000)
      }
    })
  },
  watch: {
    globalLoader(val) {
      if (!val) {
        const firstScrollTo = scroller()
        const { hash } = this.$route
        if (hash === '#donate' || hash === '#participate') {
          firstScrollTo('#donate')
        }
      }
    },
  },
  computed: {
    ...mapGetters({
      globalLoader: 'getWebsiteLoader',
    }),
    ...mapGetters('fundraisers/fundraiser', {
      fundraiser: 'getItem',
      time: 'getTime',
      bannerInfo: 'getBannerInfo',
      updates: 'getUpdates',
      milestones: 'getMilestones',
      individuals: 'getIndividuals',
      teams: 'getTeams',
      lastDonations: 'getLastDonations',
      donationAllowed: 'getDonationAllowed',
      fundraiserFull: 'getFundraiserFull',
    }),
    tabs() {
      return {
        updates: [
          {
            title: 'Updates',
            key: 'updates',
            isActive: this.updates.length,
            isHidden: !this.updates.length,
          },
          {
            title: 'Milestones',
            key: 'milestones',
            isActive: !this.updates.length && this.milestones.length,
            isHidden: !this.milestones.length,
          },
        ],
        donate: [
          { title: 'Donate', key: 'donate', isActive: true },
          {
            title: 'Participate',
            key: 'participate',
            isActive: false,
            isHidden: !this.fundraiser.p2p_available,
          },
        ],
        ranking: [
          {
            title: 'Ranking',
            key: 'ranking',
            isActive: !this.fundraiser.p2p_available ? false : true,
            isHidden: !this.fundraiser.p2p_available,
          },
          {
            title: 'Donations',
            key: 'donations',
            isActive: !this.fundraiser.p2p_available ? true : false,
          },
        ],
      }
    },
  },
  methods: {
    selectTab(key) {
      let { path } = this.$route
      switch (key) {
        case 'participate': {
          this.$router.push({ path, hash: key })
          break
        }
        case 'donate': {
          this.$router.push({ path, hash: key })
          break
        }
      }
    },
    isPushDonate(val) {
      let hash = this.$route.hash.replace('#', '')
      let tabs = JSON.parse(JSON.stringify(this.tabs))
      let donate = tabs.donate
      if (hash === 'participate') {
        donate = donate.map((d) => {
          return d.key === 'donate' ? { ...d, isActive: true } : { ...d, isActive: false }
        })
        this.resetTypeDonate = donate
      }
    },
    toThousands(number) {
      if (!number) {
        return '0'
      }
      const nf = new Intl.NumberFormat()
      return nf.format(number)
    },
    ...mapActions('fundraisers/fundraiser', ['getApiFundraiser', 'apiGetNumberShared']),
    async sendDonate(val) {
      const slug = this.$route.params.idFund
      this.$router.push({ path: `/fundraisers/${slug}/payment`, query: { price: +val } })
    },
    goTo(url) {
      if (!this.isAuthorized) {
        this.$store.commit('setReturnLink', { url: `${this.$route.path}${this.$route.hash}` })
        this.$router.push({ path: '/login' })
      } else {
        this.$router.push({ path: url })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.grid {
  position: relative;
  display: grid;
  grid-template-columns: 0.6fr 0.4fr;
  grid-gap: 80px;
  max-width: 1400px;
  padding: 75px 20px;
  margin: 0 auto;
  @media (max-width: $lg) {
    display: block;
  }

  &:before {
    content: '';
    position: absolute;
    top: 700px;
    left: -400px;
    width: 800px;
    height: 800px;
    border-radius: 50%;
    background-color: #77599b;
    opacity: 0.1;
    z-index: -1;
  }

  &:after {
    content: '';
    position: absolute;
    top: 200px;
    right: -400px;
    width: 800px;
    height: 800px;
    border-radius: 50%;
    background-color: #77599b;
    opacity: 0.1;
    z-index: -1;
  }

  @media (max-width: $lg) {
    &:before {
      top: 1000px;
      left: -200px;
      width: 400px;
      height: 400px;
    }
    &:after {
      right: -200px;
      width: 400px;
      height: 400px;
    }
  }

  @media (max-width: $xs) {
    &:before {
      content: none;
    }
    &:after {
      content: none;
    }
  }
}

.article-title {
  font-size: $fs2;
  line-height: $lh2;
  color: #63517a;
  font-weight: bold;
  padding-bottom: 30px;
}

.html_editor {
  ::v-deep img {
    margin: 50px 0;
    max-width: 100%;
    border-radius: 20px;
  }
  ::v-deep p {
    font-size: 18px;
  }
}

.update {
  padding-top: 35px;

  &__title {
    font-size: 18px;
    line-height: 28px;
    color: $websiteViolet;
    font-weight: bold;
  }

  &__subtitle {
    padding-top: 5px;
    font-size: $fs3;
    line-height: $lh3;
    color: $websiteViolet;
  }

  &__description {
    font-size: 18px;
    line-height: 28px;
    padding-top: 15px;
    color: $websiteViolet;
  }
}
.update:first-child {
  padding-top: 0;
}
.participate__title {
  font-weight: 800;
  font-size: 20px;
  line-height: 24px;
  text-align: center;
  color: #63517a;
}

.participate__container {
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 30px;
  align-items: start;
  margin-top: 40px;
  font-size: 18px;
  line-height: 28px;
  color: #63517a;
  .btn-yellow {
    padding: 15px 10px;
    text-transform: uppercase;
    font-weight: bold;
    font-size: $fs3;
    line-height: $lh3;
    border-radius: 30px;
    box-shadow: none;
  }
  button {
    padding: 15px 10px;
  }
  @media (max-width: 1300px) {
    grid-template-columns: auto;
    grid-gap: 15px;
  }
  @media (max-width: $lg) {
    grid-template-columns: auto auto;
    grid-gap: 30px;
  }
  @media (max-width: $sm) {
    grid-template-columns: auto;
    grid-gap: 15px;
  }
}

.donation-progress {
  &__results {
    display: flex;
    justify-content: center;
    padding: 20px 0 0;

    .item {
      display: flex;
      align-items: center;
      margin: 0 20px;
    }

    .icon {
      height: 17px;
    }

    .title {
      padding-left: 10px;
      font-weight: 500;
      font-size: 14px;
      line-height: 17px;
      letter-spacing: 0.02em;
      text-transform: uppercase;
    }

    @media (max-width: $sm) {
      padding: 20px 20px 0;
    }
    @media (max-width: $xs) {
      padding: 20px 0 0;
    }
  }

  &__donate {
    padding-top: 25px;
    display: flex;
    justify-content: center;
    align-items: center;

    .title {
      padding-right: 14px;
      font-weight: bold;
      font-size: 14px;
      line-height: 17px;
      letter-spacing: 0.02em;
      text-transform: uppercase;
    }
  }
}

::v-deep.tabs-container {
  margin-top: 60px;
  @media (max-width: $lg) {
    max-width: 700px;
    margin: 60px auto 0;
  }
}

::v-deep.tabs-container:first-child {
  margin-top: 0px;
  @media (max-width: $lg) {
    margin-top: 60px;
  }
}

::v-deep.people-list {
  padding-top: 30px;
}

::v-deep.people-list:first-child {
  padding-top: 0px;
}
</style>
