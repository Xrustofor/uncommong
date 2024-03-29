const fundraiser = () => import('@/views/website/fundraiser/fundraiser.vue');
const fundraiserPayment = () => import('@/views/website/fundraiser/pages/fundraiserPayment.vue');
const Team = () => import('@/views/website/fundraiser/team.vue');
const TeamPayment = () => import('@/views/website/fundraiser/pages/teamPayment.vue');
const Individual = () => import('@/views/website/fundraiser/individual.vue');
const IndividualPayment = () => import('@/views/website/fundraiser/pages/individualPayment.vue');
export default [
  {
    path: '/fundraisers/:idFund',
    component: fundraiser,
    name: 'fundraiser-main',
    meta: {
      layout: 'website',
      guest: true,
    },
  },
  {
    path: '/fundraisers/:idFund/payment',
    component: fundraiserPayment,
    name: 'fundraiser-payment',
    meta: {
      layout: 'website',
      guest: true,
    },
  },
  {
    path: '/fundraisers/:fundraiserSlug/teams/:teamID',
    component: Team,
    name: 'team-main',
    meta: {
      layout: 'website',
      guest: true,
    },
  },
  {
    path: '/fundraisers/:fundraiserSlug/teams/:teamID/payment',
    component: TeamPayment,
    name: 'team-payment',
    meta: {
      layout: 'website',
      guest: true,
    },
  },
  {
    path: '/fundraisers/:fundraiserSlug/individuals/:individualID',
    component: Individual,
    name: 'individual-main',
    meta: {
      layout: 'website',
      guest: true,
    },
  },
  {
    path: '/fundraisers/:fundraiserSlug/individuals/:individualID/payment',
    component: IndividualPayment,
    name: 'individual-payment',
    meta: {
      layout: 'website',
      guest: true,
    },
  },
]
