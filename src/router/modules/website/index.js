const Home = () => import('@/views/website/home/home.vue');
const PrivacyPolicy = () => import('@/views/website/privacyPolicy.vue');
const TermsOfService = () => import('@/views/website/termsOfService.vue');
const SweepstakesRules = () => import('@/views/website/rulesPage.vue');

const Organizations = () => import('@/views/website/organizations/organizations.vue');

const Sweepstakes = () => import('@/views/website/sweepstakes/sweepstakes.vue');
const Sweepstake = () => import('@/views/website/sweepstakes/pages/sweepstake.vue');

import sweepstakePayment from "@/views/website/sweepstakes/pages/sweepstakePayment";
import checkoutDonation from "@/views/website/sweepstakes/pages/checkoutDonation";
import alternativeDonation from "@/views/website/sweepstakes/pages/alternativeDonation";

import organizationPages from "@/router/modules/website/organization/index";
const Organization = () => import('@/views/website/organizations/organization.vue')

const fundraisers = () => import('@/views/website/fundraiser/fundraisers.vue');
import fundraiserPages  from "@/router/modules/website/fundraiser/index";

import store from '@/store';

export default [
    {
        path: '/',
        name: 'home',
        component: Home,
        meta: {
            layout: 'website',
            guest: true,
        },
    },
    {
        path: '/privacy-policy',
        name: 'privacy-policy',
        component: PrivacyPolicy,
        meta: {
            layout: 'website',
            guest: true,
        },
    },
    {
        path: '/terms-of-service',
        name: 'terms-of-service',
        component: TermsOfService,
        meta: {
            layout: 'website',
            guest: true,
        },
    },
    {
        path: '/sweepstake-rules',
        name: 'sweepstake-rules',
        component: SweepstakesRules,
        meta: {
            layout: 'website',
            guest: true,
        },
    },
    {
        path: '/nonprofits',
        name: 'organization',
        component: Organizations,
        meta: {
            layout: 'website',
            guest: true,
        },
    },
    {
        path: '/nonprofits/:idNonprofits',
        name: 'organization-id',
        redirect: { path: '/nonprofits/:idNonprofits/profile', hash: '#content' },
        component: Organization,
        meta: {
            layout: 'website',
            guest: true,
        },
        children: [...organizationPages]
    },
    {
        path: '/sweepstakes',
        name: 'sweepstakes',
        component: Sweepstakes,
        meta: {
            layout: 'website',
            guest: true,
        },
    },
    {
        path: '/sweepstakes/:sweepstakeId',
        name: 'sweepstakes-sweepstakeId',//don't change (watch alternative donate)
        component: Sweepstake,
        meta: {
            layout: 'website',
            guest: true,
            title: 'sweepstake'
        },
    },
    {
        path: '/sweepstakes/:sweepstakeId/sweepstake-payment',
        name: 'sweepstakes-sweepstakeId-sweepstake-payment',
        component: sweepstakePayment,
        meta: {
            layout: 'website',
            guest: true,
        },
    },
    {
        path: '/sweepstakes/:sweepstakeId/checkout-donation',
        name: 'sweepstakes-sweepstakeId-checkout-donation',
        component: checkoutDonation,
        meta: {
            layout: 'website',
            guest: true,
        },
    },
    {
        path: '/sweepstakes/:sweepstakeId/alternative-donation',
        name: 'sweepstakes-sweepstakeId-alternative-donation',
        component: alternativeDonation,
        meta: {
            layout: 'website',
            guest: true,
        },
        beforeEnter: (to, from, next) => {
            const url = store.getters['publicweb/sweepstake/getPageFreeDonation'];
            if (url) {
                next();
            }
            else {
                if (from.name === 'sweepstakes-sweepstakeId') {
                    next();
                }
                else {
                    next({ path: `/sweepstakes/${to.params.sweepstakeId}` });
                }
            }
        },
    },
    {
        path: '/fundraisers',
        component: fundraisers,
        name: 'fundraisers',
        meta: {
            layout: 'website',
            guest: true,
        },
    },
    ...fundraiserPages,
]
