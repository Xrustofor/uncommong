import profile from "@/views/website/organizations/pages/profile.vue";
import fundraisers from "@/views/website/organizations/pages/fundraisers.vue";
import gallery from "@/views/website/organizations/pages/gallery.vue";
import donate from "@/views/website/organizations/pages/donate";
export default [
  {
    path: 'profile',
    component: profile,
    name: 'organization-idOrganization-profile',
    meta: {
      layout: 'website',
      guest: true,
    },
  },
  {
    path: 'fundraisers',
    component: fundraisers,
    name: 'organization-idOrganization-fundraisers',
    meta: {
      layout: 'website',
      guest: true,
    },
  },
  {
    path: 'gallery',
    component: gallery,
    name: 'organization-idOrganization-gallery',
    meta: {
      layout: 'website',
      guest: true,
    },
  },
  {
    path: 'donate',
    component: donate,
    name: 'organization-idOrganization-donate',
    meta: {
      layout: 'website',
      guest: true,
      emailVerificated: true,
    },
  },
]