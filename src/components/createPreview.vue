<template>
  <div class="prev">
    <BannerOrganization :fields="fundraiser" :fundraiser="fundraiser" />
    <div class="grid">
      <div class="column">
        <TabsContainer style="margin-top: 0" class="empty no-padding-top" :tabs="tabs.about">
          <template #individual>
            <div class="team-banner">
              <div class="header">
                <img
                  v-if="!dynamicData.photo && isTeam"
                  :src="require(`@/assets/img/teams.jpg`)"
                  alt="logo"
                  class="header__logo"
                />
                <img
                  v-if="dynamicData.photo"
                  :src="dynamicData.photo"
                  alt=""
                  class="header__logo"
                />
                <div v-if="!dynamicData.photo && !isTeam" class="header__logo-fake" />

                <p class="header__title">{{ dynamicData.name }}</p>
              </div>
              <donationProgress
                :raised="0"
                raisedText="RAISED:"
                :goal="dynamicData.goal / 100"
                goalText="GOAL:"
                class="remains-none"
              />
            </div>
            <div class="html_editor" v-html="dynamicData.biography"></div>
          </template>
          <template #fundraiser>
            <div class="html_editor" v-html="fundraiser.story"></div>
          </template>
        </TabsContainer>
        <!--        -->

        <TabsContainer class="empty mode-content-scroll" :tabs="tabsUpdates">
          <template #updates>
            <div class="updates" v-for="(update, index) in fundraiser.updates" :key="`u-${index}`">
              <div class="updates__title">
                Published {{ dateTransformCreated(update.created_at) }}
              </div>
              <p class="html_editor updates__text" v-html="update.post"></p>
            </div>
          </template>
          <template #milestones>
            <div class="update" v-for="(milestone, key) in fundraiser.milestones" :key="key">
              <p class="update__title">Milestone #{{ key + 1 }}: Raise {{ milestone.amount }}</p>
              <p class="update__description">{{ milestone.incentive }}</p>
            </div>
          </template>
        </TabsContainer>
      </div>
      <div class="column">
        <TabsContainer :tabs="tabs.donate">
          <template #donate>
            <DonationTable :items="[1, 25, 50, 100, 250, 500]" class="fundraiser" />
          </template>
          <template #participate>
            <p class="participate__title">
              Looking for more ways to spread <br />
              UncommonGood?
            </p>
            <template v-if="isTeam">
              <div class="participate__container" v-if="dynamicData.join_allowance">
                <span
                  >Join "{{ dynamicData.name }}" and help them reach their team fundraising
                  goal.</span
                >
                <button class="btn btn-yellow">Join {{ dynamicData.name }}</button>
              </div>
              <div class="participate__container">
                <span>
                  Start your own fundraising team and invite friends and family to support "{{
                    fundraiser.name
                  }}".
                </span>
                <button class="btn btn-yellow">create a new team</button>
              </div>
              <div class="participate__container">
                <span>Or, support "{{ dynamicData.name }}" as an individual.</span>
                <button class="btn btn-yellow">start fundraising</button>
              </div>
            </template>
            <template v-else>
              <div class="participate__container">
                <span>
                  Start your own fundraising team and invite friends and family to support "{{
                    fundraiser.name
                  }}".
                </span>
                <button class="btn btn-yellow">create a new team</button>
              </div>
              <div class="participate__container">
                <span>Or, support "{{ fundraiser.name }}" as an individual.</span>
                <button class="btn btn-yellow">start fundraising</button>
              </div>
            </template>
          </template>
        </TabsContainer>
        <TabsContainer class="pt-0" :tabs="tabs.ranking">
          <template #ranking>
            <div class="team-banner no-border">
              <div class="header">
                <div
                  v-if="dynamicData.photo"
                  class="header__logo"
                  :style="{ backgroundImage: `url(${dynamicData.photo})` }"
                ></div>
                <img
                  v-else
                  :src="require(`@/assets/img/teams.jpg`)"
                  alt="logo"
                  class="header__logo-fake"
                />
                <p class="header__title">{{ dynamicData.name }}’s Progress</p>
              </div>
              <donationProgress
                :raised="0"
                raisedText="RAISED:"
                :goal="dynamicData.goal / 100"
                goalText="GOAL:"
                class="remains-none"
              />
              <div class="donation-progress">
                <div class="donation-progress__results">
                  <div class="item">
                    <icon-base>
                      <icon-like></icon-like>
                    </icon-base>
                    <span class="title">0 DONORS</span>
                  </div>
                  <div class="item">
                    <icon-base>
                      <icon-telegram></icon-telegram>
                    </icon-base>
                    <span class="title">0 SHARES</span>
                  </div>
                </div>
              </div>
            </div>
            <NumberedList
              v-if="fundraiser.individuals.length > 0"
              title="Top Individuals"
              :items="fundraiser.individuals"
              :headers="rankingHeaders"
              style="margin-top: 0; max-width: 100%"
            />

            <NumberedList
              title="Top Teams"
              :items="fundraiser.teams"
              :headers="rankingHeaders"
              style="margin-top: 20px"
            />
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
              :style="{ marginTop: '30px', maxWidth: '100%' }"
            >
            </NumberedList>
            <button-input class="fundraiser" />
          </template>
        </TabsContainer>
      </div>
    </div>
  </div>
</template>

<script>
import BannerOrganization from '@/common/bannerOrganization'
import TabsContainer from '@/common/tabsContainer'
import donationProgress from '@/components/donationProgress'
import ButtonInput from '@/components/buttons/buttonInput'
import DonationTable from '@/components/donationsTable.vue'
import IconBase from '@/components/IconBase'
import iconTelegram from '@/components/icons/iconTelegram'
import iconLike from '@/components/icons/iconLike'
import NumberedList from '@/components/numberedList.vue'
import { mapGetters } from 'vuex'
import iconTeams from '@/components/icons/iconTeams'

export default {
  components: {
    NumberedList,
    DonationTable,
    ButtonInput,
    BannerOrganization,
    TabsContainer,
    donationProgress,
    IconBase,
    iconTelegram,
    iconLike,
    iconTeams,
  },
  props: {
    fundraiser: {
      type: Object,
      default: {},
      required: true,
    },
    dynamicData: {
      type: Object,
      default: {},
      required: true,
    },
    isParticipate: {
      type: Boolean,
      default: true,
    },
    isTeam: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapGetters('fundraisers/fundraiser', {
      lastDonations: 'getLastDonations',
    }),
    tabsUpdates() {
      const updates = this.fundraiser.updates.length
      const milestones = this.fundraiser.milestones.length
      return [
        {
          title: 'Updates',
          key: 'updates',
          isActive: updates,
          isHidden: !updates,
        },
        {
          title: 'Milestones',
          key: 'milestones',
          isActive: !updates && milestones,
          isHidden: !milestones,
        },
      ]
    },
  },
  methods: {
    dateTransformCreated(date) {
      if (!date) {
        return 'NULL'
      }

      const inMilliseconds = Date.parse(date)
      return new Date(inMilliseconds).toLocaleDateString()
    },
  },
  data() {
    return {
      tabs: {
        ranking: [
          { title: 'Ranking', key: 'ranking', isActive: false },
          { title: 'Donations', key: 'donations', isActive: true },
        ],
        donate: [
          { title: 'Donate', key: 'donate', isActive: true },
          { title: 'Participate', key: 'participate', isActive: false },
        ],
        about: [
          { title: this.isTeam ? 'Our Story' : 'My Story', key: 'individual', isActive: true },
          { title: 'About This Fundraiser', key: 'fundraiser', isActive: false },
        ],
      },
      donateSizeOptions: [],
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
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/variables.scss';

$width: 1225px;
.team-banner {
  padding: 15px 70px 30px;
  border-radius: 20px;
  border: solid 1px $violet;
  margin-top: 20px;
  margin-bottom: 20px;

  &.no-border {
    padding: 0 0 30px;
    border-color: transparent;
    margin-top: 0;
  }
}

.list-title {
  color: $violet;
  font-weight: 600;
  font-size: $fs5;
  letter-spacing: 0.5px;
  margin-bottom: 30px;
}

.updates {
  margin-left: 20px;
  margin-top: 25px;
  color: $black;
  font-size: $fs5;
  line-height: $lh5;

  &__title {
    position: relative;
    padding-right: 160px;
    font-weight: bold;
  }

  &__text {
    margin-top: 15px;
  }

  &__edit {
    right: 90px;
  }

  @media (max-width: $md) {
    &__title {
      font-size: $fs5;
      line-height: $lh5;
    }
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
      display: block;
      .item {
        margin: 10px 0;
      }
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

@media (max-width: $width) {
  .column:first-child {
    margin-bottom: 60px;
  }
}

::v-deep.banner__content {
  display: block;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  &__logo {
    width: 100px;
    height: 100px;
    border-radius: 20px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }

  &__icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 100px;
    border-radius: 20px;
    background-color: $violetBorder;
  }

  &__logo-fake {
    width: 100px;
    height: 100px;
    border-radius: 20px;
    background-color: $violetBorder;
  }

  &__title {
    padding-left: 20px;
    font-weight: 800;
    font-size: 25px;
    line-height: 30px;
  }
}

.prev {
  width: 1400px;
  min-height: 2500px;
  margin-left: -5px;
  transform: scale(0.3) translate(-115%, -115%);
  border: 1px solid #63517a;
  border-radius: 50px;
  overflow-x: hidden;
  box-shadow: 0px 4px 15px rgba(99, 81, 122, 0.25);
  @media (max-width: $width) {
    margin-left: 0;
    width: 100%;
    min-height: auto;
    transform: none;
  }
}

.breadcrumbs {
  margin: 40px 20px 30px;
  font-size: $fs3;
  line-height: $fs3;
  color: $black;
}

.grid {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 80px;
  max-width: 1400px;
  padding: 75px 20px;
  margin: 0 auto;

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

  @media (max-width: $width) {
    display: block;
  }
  @media (max-width: $xs) {
    padding: 75px 5px;
  }
}

.article-title {
  font-size: $fs2;
  line-height: $lh2;
  color: #63517a;
  font-weight: bold;
  padding-bottom: 30px;
}

.article {
  font-size: 18px;
  line-height: 28px;
  color: $websiteViolet;

  img {
    margin-top: 50px;
    width: 100%;
    border-radius: 20px;
  }

  @media (max-width: $lg) {
    font-size: $fs3;
    line-height: $lh3;
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
    align-items: center;
    justify-content: center;
    display: flex;
    padding: 20px;
    text-transform: uppercase;
    font-weight: bold;
    font-size: $fs3;
    line-height: $lh3;
    border-radius: 30px;
    box-shadow: none;
  }
}

@media (min-width: 770px) and (max-width: 950px) {
  .participate__container {
    grid-template-columns: auto;
    grid-gap: 10px;
  }
}

@media (max-width: 600px) {
  .participate__container {
    grid-template-columns: auto;
    grid-gap: 10px;
  }
}

::v-deep.tabs-container {
  margin-top: 60px;
}

::v-deep.tabs-container:first-child {
  margin-top: 0px;
}

::v-deep.people-list {
  padding-top: 30px;
}

::v-deep.people-list:first-child {
  padding-top: 0px;
}
</style>
