<template>
  <div v-if="!loader">
    <template v-if="canEdit">
      <ModalSimple
        class="max1200"
        :is-visible="modals.about"
        @close="modals.about = false"
      >
        <bioModal
          @cancel="modals.about = false"
          :is-loading="isModalLoading"
          @upload="updateBio($event, 'about')"
          :value="individual.biography"
        />
      </ModalSimple>
      <ModalSimple
        class="max830"
        :is-visible="modals.postUpdate"
        @close="modals.postUpdate = false"
      >
        <postUpdateModal
          @close="modals.postUpdate = false"
          @upload="updatePost"
          :is-loading="isModalLoading"
        />
      </ModalSimple>
      <ModalSimple
        class="max830"
        :is-visible="modals.updateEdit"
        @close="modals.updateEdit = false"
      >
        <editUpdateModal
          @close="modals.updateEdit = false"
          @upload="editUpdate"
          :fields="editUploadFields"
          :is-loading="isModalLoading"
        />
      </ModalSimple>
    </template>
    <bannerOrganization
      anchorName="#individualDonate"
      :isBtnDonate="donationAllowed"
      :fields="{ ...bannerInfo, daysRemains: time.daysRemains }"
      :fundraiser="fundraiser"
      @shareAction="
        !shared ? sharedAction() : false
        shared = true
      "
    />
    <div class="grid">
      <div class="column">
        <TabsContainer style="margin-top: 0" class="empty no-padding-top" :tabs="tabs.about">
          <template #individual>
            <div class="column-title empty">
              <router-link
                :to="`/admin/account/fundraisers/${fundraiser.url}/individual-edit/${individual.id}`"
                v-if="canEdit"
                class="local-edit-button"
                @click="modals.about = !modals.about"
              >
                <span>Edit My Page</span>
                <icon-base width="20" height="20" viewBox="0 1.5 20 20">
                  <icon-edit />
                </icon-base>
              </router-link>
            </div>
            <div class="team-banner">
              <div class="header">
                <div
                  class="header__logo"
                  :style="{ backgroundImage: `url(${individual.photo})` }"
                ></div>
                <div>
                  <p class="header__title">{{ individual.name }}</p>
                  <router-link
                    v-if="individualTeam"
                    :to="`/fundraisers/${fundraiser.url}/teams/${individualTeam.id}`"
                    class="header__link"
                  >
                    Team: {{ individualTeam.name }}
                  </router-link>
                </div>
              </div>
              <donationProgress
                :raised="individual.amount_raised / 100"
                raisedText="RAISED:"
                :goal="individual.goal / 100"
                goalText="GOAL:"
                class="remains-none"
              />
              <div class="donation-progress">
                <div class="donation-progress__results">
                  <div class="item">
                    <icon-base>
                      <icon-like></icon-like>
                    </icon-base>
                    <span class="title">{{ individual.number_of_donors }} DONORS</span>
                  </div>
                  <div class="item">
                    <icon-base>
                      <icon-telegram></icon-telegram>
                    </icon-base>
                    <span class="title">{{ individual.shared_count }} SHARES</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="html_editor" v-html="individual.biography"/>
          </template>
          <template #fundraiser>
            <div class="html_editor" v-html="fundraiser.story"/>
          </template>
        </TabsContainer>
        <TabsContainer
          class="empty"
          v-if="isUpdatesTabs"
          :tabs="updatesTab"
        >
          <template #updates>
            <button
              v-if="canEdit"
              class="btn btn-yellow"
              @click="modals.postUpdate = true"
            >
              + POST A NEW UPDATE
            </button>
            <div
              class="updates"
              v-for="(update, index) in updates"
              :key="`u-${index}`"
            >
              <div class="column-title">
                Published {{ update.created_at | _moment('MM/DD/YY', 'YYYY-MM-DD HH:mm') }}
                <button
                  v-if="canEdit"
                  class="updates__edit local-edit-icon"
                  @click="
                    openUpdateEdit({
                      ...update,
                      published: dateTransformCreated(update.created_at),
                    })
                  "
                >
                  <span>Edit</span>
                  <icon-base width="20" height="20" viewBox="0 1.5 20 20">
                    <icon-edit />
                  </icon-base>
                </button>
              </div>
              <p class="updates__subtitle">By {{ update.author }}</p>
              <p class="updates__description" v-html="update.post"></p>
            </div>
          </template>
          <template #milestones>
            <div
              class="milestone"
              v-for="(milestone, index) in milestones"
              :key="index"
            >
              <p class="milestone__title">
                Milestone #{{ index + 1 }}: Raise ${{ milestone.amount / 100 }}
              </p>
              <p class="milestone__subtitle" v-if="milestone.reached_on">
                Reached on {{ milestone.reached_on | _moment('MM/DD/YY', 'YYYY-MM-DD HH:mm') }}
              </p>
              <p class="milestone__subtitle" v-else>
                Remaining ${{ (milestone.amount - individual.amount_raised) / 100 }}
              </p>
              <p class="milestone__description">{{ milestone.incentive }}</p>
            </div>
          </template>
        </TabsContainer>
      </div>
      <div class="column" id="individualDonate">
        <TabsContainer :tabs="tabs.donate" v-if="donationAllowed">
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
                class="btn btn-yellow"
                @click="
                  createCheck(`/admin/account/teams/fundraiser/${fundraiser.url}/p2p-team-creation`)
                "
              >
                create a new team
              </button>
            </div>
            <div class="participate__container">
              <span>Or, support "{{ fundraiser.name }}" as an individual.</span>
              <button
                class="btn btn-yellow"
                @click="
                  createCheck(
                    `/admin/account/campaigns/fundraiser/${fundraiser.url}/p2p-contributor-creation`
                  )
                "
              >
                start fundraising
              </button>
            </div>
          </template>
        </TabsContainer>
        <TabsContainer :tabs="tabs.ranking" class="pt-0">
          <template #ranking>
            <div class="individual-banner no-border">
              <p class="header__title">My progress</p>
              <donationProgress
                :raised="individual.amount_raised / 100"
                raisedText="RAISED:"
                :goal="individual.goal / 100"
                goalText="GOAL:"
                class="remains-none"
              />
              <div class="donation-progress">
                <div class="donation-progress__results">
                  <div class="item">
                    <icon-base>
                      <icon-like></icon-like>
                    </icon-base>
                    <span class="title">{{ individual.number_of_donors }} DONORS</span>
                  </div>
                  <div class="item">
                    <icon-base>
                      <icon-telegram></icon-telegram>
                    </icon-base>
                    <span class="title">{{ individual.shared_count }} SHARES</span>
                  </div>
                </div>
              </div>
            </div>
            <NumberedList
              title="Top Individuals"
              :items="individuals"
              :headers="rankingHeaders"
              :activeIdx="individual.individual_place"
              :clickable="true"
              :style="{
                marginBottom: individual.individual_place > 4 ? '0px' : '20px',
                maxWidth: '100%',
              }"
              @action="$router.push({ path: $event.url })"
            />

            <div class="additional-number-list" v-if="individual.individual_place > 4">
              <p>...</p>
              <NumberedList
                :items="individualPlace"
                :headers="rankingHeaders"
                :activeIdx="individual.individual_place"
                style="margin-bottom: 30px; max-width: 100%"
              />
            </div>
            <NumberedList
              title="Top Teams"
              :items="teams"
              :headers="rankingHeaders"
              :clickable="true"
              style="max-width: 100%"
              :activeIdx="teamPlace"
              @action="$router.push({ path: $event.url })"
            >
            </NumberedList>
            <div class="additional-number-list" v-if="teamPlace > 4">
              <p>...</p>
              <NumberedList
                :items="individualTeamPlace"
                :headers="rankingHeaders"
                :activeIdx="teamPlace"
                style="margin-bottom: 30px; max-width: 100%"
              />
            </div>
          </template>
          <template #donations>
            <div class="individual-banner no-border">
              <p class="header__title">Donations Made Through {{ individual.name }}</p>
              <donationProgress
                :raised="individual.amount_raised / 100"
                raisedText="RAISED:"
                :goal="individual.goal / 100"
                goalText="GOAL:"
                class="remains-none"
              />
              <div class="donation-progress">
                <div class="donation-progress__results">
                  <div class="item">
                    <icon-base>
                      <icon-like></icon-like>
                    </icon-base>
                    <span class="title">{{ individual.number_of_donors }} DONORS</span>
                  </div>
                  <div class="item">
                    <icon-base>
                      <icon-telegram></icon-telegram>
                    </icon-base>
                    <span class="title">{{ individual.shared_count }} SHARES</span>
                  </div>
                </div>
              </div>
            </div>

            <NumberedList
              v-if="lastDonations.length > 0"
              :items="lastDonations"
              :headers="donationsHeaders"
              style="max-width: 100%"
            >
            </NumberedList>
            <button-input
              v-if="donationAllowed"
              id="scrollDonate"
              class="fundraiser"
              v-model="donations"
              @send="sendDonate($event)"
            />
          </template>
        </TabsContainer>
      </div>
    </div>
  </div>
</template>

<script>
import iconDelete from '@/components/icons/iconDelete';
import bannerOrganization from '@/common/bannerOrganization';
import TabsContainer from '@/common/tabsContainer';
import donationProgress from '@/components/donationProgress';
import ButtonInput from '@/views/website/sweepstakes/components/buttonInput';
import DonationTable from '@/views/website/organizations/components/donationsTable.vue';
import BreadCrumbs from '@/common/breadCrumbs';
import ModalSimple from '@/components/modalSimple.vue';
import bioModal from '@/components/modalsIndividual/bioModal.vue';
import postUpdateModal from '@/components/modalsIndividual/postUpdateModal.vue';
import editUpdateModal from '@/components/modalsIndividual/editUpdateModal.vue';
import NumberedList from '@/components/numberedList.vue';
import LoaderButton from '@/components/buttons/loaderButton';
import IconBase from '@/components/IconBase';
import iconTelegram from '@/components/icons/iconTelegram';
import iconLike from '@/components/icons/iconLike';
import iconEdit from '@/components/icons/iconEdit';

import { mapActions, mapGetters, mapState } from 'vuex';
import { register } from 'register-service-worker';

export default {
  name: 'p2pIndividualManagement',
  components: {
    iconDelete,
    ModalSimple,
    postUpdateModal,
    editUpdateModal,
    bioModal,
    DonationTable,
    ButtonInput,
    bannerOrganization,
    TabsContainer,
    donationProgress,
    BreadCrumbs,
    IconBase,
    LoaderButton,
    iconTelegram,
    iconLike,
    iconEdit,
    NumberedList,
  },
  data() {
    return {
      isAuthorized: false,
      fundSlug: this.$router.history.current.params.fundraiserSlug,
      individualId: this.$router.history.current.params.individualID,
      donations: '',
      shared: false,

      modals: {
        about: false,
        updateEdit: false,
        postUpdate: false,
      },

      isModalLoading: false,
      editUploadFields: {},

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
  async created() {
    this.isAuthorized = (await this.$cookies.get('access_token')) ? true : false;

    this.$store.dispatch('setLoader', true);
    await this.apiGetIndividual({ fundId: this.fundSlug, individualId: this.individualId });
    this.$store.dispatch('setLoader', false);
  },
  computed: {
    ...mapGetters({ loader: 'getWebsiteLoader' }),
    ...mapGetters('individual', {
      time: 'getTime',
      bannerInfo: 'getBannerInfo',
      updates: 'getUpdates',
      milestones: 'getMilestones',
      individuals: 'getIndividuals',
      teams: 'getTeams',
      lastDonations: 'getLastDonations',
      individualPlace: 'getIndividualPlace',
      individualTeamPlace: 'getIndividualTeamPlace',
      teamPlace: 'getTeamPlace',
      donationAllowed: 'getDonationAllowed',
    }),
    ...mapState('individual', ['fundraiser', 'individual', 'individualTeam', 'canEdit']),
    isUpdatesTabs() {
      if (this.canEdit) {
        return true
      }
      else {
        return !!(this.updates.length || this.milestones.length);
      }
    },
    updatesTab() {
      if (this.canEdit) {
        return [
          {
            title: 'Updates',
            key: 'updates',
            isActive: true,
          },
          {
            title: 'Milestones',
            key: 'milestones',
            isActive: false,
            isHidden: !this.milestones.length,
          },
        ]
      } else {
        return [
          {
            title: 'Updates',
            key: 'updates',
            isActive: this.updates.length && !this.milestones.length,
            isHidden: !this.updates.length,
          },
          {
            title: 'Milestones',
            key: 'milestones',
            isActive: !this.updates.length,
            isHidden: !this.milestones.length,
          },
        ]
      }
    },
    tabs() {
      return {
        about: [
          { title: 'My Story', key: 'individual', isActive: true },
          { title: 'About This Fundraiser', key: 'fundraiser', isActive: false },
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
  watch: {
    $route(to, from) {
      this.apiGetIndividual({
        fundId: this.$router.history.current.params.fundraiserSlug,
        individualId: this.$router.history.current.params.individualID,
      })
    },
  },
  methods: {
    ...mapActions('individual', [
      'apiGetIndividual',
      'apiGetNumberShared',
      'apiPutIndividual',
      'apiPutUpdate',
      'apiPostUpdate',
    ]),
    sharedAction() {
      this.apiGetNumberShared({
        fundId: this.fundSlug,
        individualId: this.individualId
      })
    },
    createCheck(route) {
      if (!this.isAuthorized) {
        this.$store.commit('setReturnLink', { url: route });
        this.$router.push({ path: '/login' });
      } else {
        this.$router.push({ path: route });
      }
    },
    updateBio(field) {
      this.isModalLoading = true;
      this.apiPutIndividual({ body: { biography: field } });
      this.isModalLoading = false;
      this.modals.about = false;
    },
    async updatePost(field) {
      this.isModalLoading = true;
      await this.apiPostUpdate({ body: { post: field } });
      this.isModalLoading = false;
      this.modals.postUpdate = false;
    },
    async editUpdate(data) {
      this.isModalLoading = true;
      await this.apiPutUpdate({ updateId: data.id, body: { post: data.post } });
      this.isModalLoading = false;
      this.modals.updateEdit = false;
    },
    openUpdateEdit(fields) {
      this.editUploadFields = fields;
      this.modals.updateEdit = !this.modals.updateEdit;
    },
    dateTransformCreated(date) {
      if (!date) {
        return '-'
      }

      const inMilliseconds = Date.parse(date);
      return new Date(inMilliseconds).toLocaleDateString();
    },
    async updateFundraiser(data, modal) {
      this.isModalLoading = true;
      const success = await this.putFundraiser({ id: this.fundId, body: data });
      this.isModalLoading = false;

      if (success) {
        this.modals[modal] = false
      }
    },
    sendDonate(val) {
      const { path } = this.$route;
      this.$router.push({
        path: `${path}/payment`,
        query: { price: val }
      });
    },
  },
}
</script>

<style lang="scss" scoped>
.alert-actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 30px;

  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 15px;
  }
}
.alert-title {
  padding: 0 20px;
  font-size: 25px;
  text-align: center;
}

.column {
  &-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
    &.empty {
      justify-content: flex-end;
      margin-bottom: 20px;
    }
  }
}
.local-edit-icon {
  display: flex;
  align-items: center;
  color: $violet;
  &:hover {
    color: $blue;
  }
  span {
    font-size: 14px;
    margin: 0 5px;
  }
}
.team-banner {
  padding: 15px 25px;
  border-radius: 20px;
  border: solid 1px $violet;
  margin-top: 20px;
  margin-bottom: 20px;
}

.header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 25px;

  &__logo {
    width: 100px;
    height: 100px;
    min-width: 100px;
    min-height: 100px;
    border-radius: 20px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    background-color: $violetBorder;
  }

  &__title {
    padding-left: 20px;
    font-weight: 800;
    font-size: 25px;
    line-height: 30px;
  }
  &__link {
    margin: 20px 0 0 20px;
    display: block;
    font-weight: 800;
    font-size: 18px;
    line-height: 25px;
  }
}

.local-edit-button {
  display: flex;
  align-items: center;
  color: $violet;
  &:hover {
    color: $blue;
  }
  span {
    font-size: 14px;
    margin: 0 5px;
  }
}

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

.milestone {
  &__title {
    padding-top: 35px;
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

.participate__title {
  font-weight: 800;
  font-size: 20px;
  line-height: 24px;
  text-align: center;
  color: #63517a;
}

.updates {
  margin-top: 25px;
  color: $violet;
  font-size: $fs5;
  line-height: $lh5;

  .column-title {
    position: relative;
    font-weight: bold;
    margin-bottom: 0;
  }

  &__subtitle {
    padding-top: 5px;
    font-size: $fs3;
    line-height: $lh3;
    color: $websiteViolet;
  }

  &__description {
    margin-top: 15px;
  }

  &__edit {
    right: 0;
  }

  @media (max-width: $md) {
    &__title {
      font-size: $fs5;
      line-height: $lh5;
    }
  }
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
    padding: 5px 10px;
    text-transform: uppercase;
    font-weight: bold;
    font-size: $fs3;
    line-height: $lh3;
    border-radius: 30px;
    box-shadow: none;
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
  margin-top: 20px;
  &__results {
    display: flex;
    justify-content: center;
    padding: 20px 0 20px;

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

.additional-number-list {
  p {
    font-size: 40px;
    text-align: center;
    line-height: 0;
    margin-bottom: 20px;
  }
}

.individual-banner {
  padding: 0 0 40px;
  & > p {
    font-size: 20px;
    text-align: center;
    margin-bottom: 20px;
    padding: 0;
  }
}
</style>
