import store from '@/store'

const General = () => import('@/views/controlPanel/settings/General.vue')
const ConsumerSecuritySettings = () =>
  import('@/views/controlPanel/settings/pages/securitySettings.vue')
const ConsumerAccountSettings = () =>
  import('@/views/controlPanel/settings/pages/accountSettings.vue')
const ConsumerSecurityBilling = () => import('@/views/controlPanel/settings/pages/billing.vue')
const DonationHistory = () => import('@/views/controlPanel/settings/pages/donationHistory.vue')
const EnteredSweepstakes = () =>
  import('@/views/controlPanel/settings/pages/enteredSweepstakes.vue')
const SupportedFundraisers = () =>
  import('@/views/controlPanel/settings/pages/supportedFundraisers.vue')
const Campaigns = () => import('@/views/controlPanel/settings/pages/campaigns.vue')

const P2PTeams = () => import('@/views/controlPanel/settings/pages/teams/P2PTeams.vue')
const P2PTeamEdit = () => import('@/views/controlPanel/settings/pages/teams/P2PTeamEdit.vue')
const P2PTeamsRoster = () => import('@/views/controlPanel/settings/pages/teams/teamRoster.vue')
const P2PIndividualEdit = () =>
  import('@/views/controlPanel/settings/pages/teams/P2PIndividualEdit.vue')

const P2PTeamsRosterDonations = () =>
  import('@/views/controlPanel/settings/pages/teams/teamRosterDonations.vue')

const p2pContributorCreation = () =>
  import('@/views/controlPanel/settings/pages/fundraiser/p2pContributorCreation.vue')
const p2pTeamCreation = () =>
  import('@/views/controlPanel/settings/pages/fundraiser/p2pTeamCreation.vue')

const NewEmailConfirme = () => import('@/views/controlPanel/settings/newEmailConfirme.vue')

export default [
  {
    path: '/admin',
    name: 'control-panel-home',
    component: General,
    redirect: '/admin/account/profile',
    meta: {
      layout: 'admin-page',
      requiresAuth: true,
      emailVerificated: true,
      key: 'admin',
      title: 'Home',
      isLink: false,
    },
    children: [
      {
        path: 'account',
        component: General,
        meta: {
          requiresAuth: true,
          layout: 'admin-page',
          emailVerificated: true,
          title: 'Account',
          key: 'admin',
          isLink: false,
        },
        children: [
          {
            path: 'profile',
            name: 'account-settings',
            component: ConsumerAccountSettings,
            meta: {
              layout: 'admin-page',
              requiresAuth: true,
              emailVerificated: true,
              isLink: true,
              title: 'Profile',
              key: 'admin',
            },
            beforeEnter: (to, from, next) => {
              const { url, query } = store.getters.getReturnLink
              if (url) {
                store.commit('setReturnLink', {})
                next({ path: url, query: { ...query } })
              } else {
                next()
              }
            },
          },
          {
            path: 'security-settings',
            name: 'security-settings',
            component: ConsumerSecuritySettings,
            meta: {
              layout: 'admin-page',
              requiresAuth: true,
              emailVerificated: true,
              title: 'Security settings',
              key: 'admin',
              isLink: true,
            },
          },
          {
            path: 'fundraisers/:slugFundraiser/teams-edit/:idTeam',
            name: 'team-edit',
            component: P2PTeamEdit,
            meta: {
              layout: 'admin-page',
              requiresAuth: true,
              emailVerificated: true,
              title: 'id',
              key: 'admin',
              isLink: true,
              idName: 'idTeam',
            },
          },
          {
            path: 'fundraisers/:slugFundraiser/individual-edit/:idIndividual',
            name: 'individual-roster-edit',
            component: P2PIndividualEdit,
            meta: {
              layout: 'admin-page',
              requiresAuth: true,
              emailVerificated: true,
              title: 'id',
              key: 'admin',
              isLink: true,
              idName: 'idIndividual',
            },
          },
          {
            path: 'teams',
            name: 'teams',
            component: P2PTeams,
            meta: {
              layout: 'admin-page',
              requiresAuth: true,
              emailVerificated: true,
              title: 'Teams',
              key: 'admin',
              isLink: true,
            },
            children: [
              {
                path: ':idTeam/roster',
                name: 'team-roster',
                component: P2PTeamsRoster,
                meta: {
                  layout: 'admin-page',
                  requiresAuth: true,
                  emailVerificated: true,
                  title: 'id',
                  key: 'admin',
                  isLink: true,
                  idName: 'idTeam',
                },
                children: [
                  {
                    path: ':idIndividual/donations',
                    name: 'team-roster-donations',
                    component: P2PTeamsRosterDonations,
                    meta: {
                      layout: 'admin-page',
                      requiresAuth: true,
                      emailVerificated: true,
                      title: 'Donations',
                      key: 'admin',
                      isLink: false,
                      idName: 'idIndividual',
                    },
                  },
                ],
              },
              {
                path: 'fundraiser/:fundraiserSlug/p2p-team-creation',
                name: 'p2p-team-creation',
                component: p2pTeamCreation,
                meta: {
                  layout: 'admin-page',
                  requiresAuth: true,
                  emailVerificated: true,
                  title: 'Team Creation',
                  isLink: true,
                  key: 'admin',
                },
              },
            ],
          },
          {
            path: 'billing',
            name: 'billing',
            component: ConsumerSecurityBilling,
            meta: {
              layout: 'admin-page',
              requiresAuth: true,
              emailVerificated: true,
              title: 'Billing',
              isLink: true,
            },
          },
          {
            path: 'donations-history',
            name: 'donations-history',
            component: DonationHistory,
            meta: {
              layout: 'admin-page',
              requiresAuth: true,
              emailVerificated: true,
              title: 'Donations',
              isLink: true,
            },
          },
          {
            path: 'entered-sweepstakes',
            name: 'entered-sweepstakes',
            component: EnteredSweepstakes,
            meta: {
              layout: 'admin-page',
              requiresAuth: true,
              emailVerificated: true,
              title: 'Entered sweepstakes',
              isLink: true,
            },
          },
          {
            path: 'supported-fundraisers',
            name: 'supported-fundraisers',
            component: SupportedFundraisers,
            meta: {
              layout: 'admin-page',
              requiresAuth: true,
              emailVerificated: true,
              title: 'Supported fundraisers',
              isLink: true,
            },
          },
          {
            path: 'campaigns',
            name: 'campaigns',
            component: Campaigns,
            meta: {
              layout: 'admin-page',
              requiresAuth: true,
              emailVerificated: true,
              title: 'Campaigns',
              isLink: true,
            },
            children: [
              {
                path: 'fundraiser/:fundraiserSlug/p2p-contributor-creation',
                name: 'p2p-contributor-creation',
                component: p2pContributorCreation,
                meta: {
                  layout: 'admin-page',
                  requiresAuth: true,
                  emailVerificated: true,
                  title: 'Contributor Creation',
                  isLink: true,
                  key: 'admin',
                },
              },
              {
                path: 'fundraiser/:fundraiserSlug/team/:teamId/p2p-contributor-creation',
                name: 'p2p-contributor-creation-team',
                component: p2pContributorCreation,
                meta: {
                  layout: 'admin-page',
                  requiresAuth: true,
                  emailVerificated: true,
                  title: 'Contributor Creation',
                  isLink: true,
                  key: 'admin',
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/new-email/confirm/:token',
    name: 'check-new-email-token',
    component: NewEmailConfirme,
    meta: {
      layout: 'full-page',
      guest: true,
    },
  },
]
