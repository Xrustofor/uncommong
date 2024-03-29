import Vue from 'vue';
import VueRouter from 'vue-router';

import VueCookies from 'vue-cookies';
Vue.use(VueCookies);

const NotFound = () => import("@/views/notFound.vue");
const UnderConstruction = () => import("@/views/underConstruction.vue");
const UnderConstructionSecret = () => import("@/views/underConstructionSecret.vue");

import controlPanelRoutes from './modules/controlPanelRoutes.js';
import websiteRoutes from './modules/website/index';

import loginRoutes from './modules/auth/loginRoutes.js';
import registrationRoutes from './modules/auth/registrationRoutes.js';
import changePasswordRoutes from './modules/auth/changePasswordRoutes.js';
import code from './modules/auth/code.js'


import store from '../store'
Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
}

const routes = [
  ...websiteRoutes,
  ...controlPanelRoutes,
  ...loginRoutes,
  ...registrationRoutes,
  ...changePasswordRoutes,
  ...code,
  {
    path: '/404',
    name: '404',
    component: NotFound,
    meta: {
      layout: 'website',
      guest: true,
    }
  },
  {
    path: '/under-construction',
    name: 'under construction',
    component: UnderConstruction,
    meta: {
      layout: 'full-page',
      guest: true,
    },
  },
  {
    path: '/under-construction-secret',
    name: 'under construction secret',
    component: UnderConstructionSecret,
    meta: {
      layout: 'full-page',
      guest: true,
    },
  },
  {
    path: '/cancel-subscription',
    redirect: '/nonprofits',
  },
  {
    path: '/widget',
    redirect: '/',
  },
  {
    path: '*',
    redirect: '/404',
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    else {
      const position = {};
      if (to.hash) {
        position.selector = to.hash;
        position.behavior = 'smooth';
        if (document.querySelector(to.hash)) {
          return position;
        }
        return false;
      }
      else {
        return { x: 0, y: 0 };
      }
    }
  }
})

router.beforeEach((to, from, next) => {
  const underConstruction = store.getters['underConstructionPage/getUnderConstruction'];
  if (to.name != "under construction" && to.name != 'under construction secret') {
    if (underConstruction == false) {
      if (to.matched.some(record => record.meta.requiresAuth)) {
        const token = Vue.$cookies.get("access_token");
        if (token == null) {
          next({
            path: '/login',
          })
        }
        else if (to.matched.some(record => record.meta.emailVerificated)) {
          var emailVerified = Vue.$cookies.get('user').email_verified_at;
          var registerAllowance = Vue.$cookies.get('user').is_accepted;
          if (registerAllowance == 0) {
            next({ path: '/login' });
          }
          else if (emailVerified == null) {
            next({ path: '/email-confirmation' });
          }
          else next();
        }
        else {
          next();
        }
      } else if (to.matched.some(record => record.meta.guest)) {
        next();
      }
    }
    else {
      next({
        path: '/under-construction',
      })
    }
  } else {
    let returnLink = JSON.parse(JSON.stringify(store.getters.getReturnLink));
      returnLink = {
        query: returnLink ? returnLink.query : {},
        url: returnLink ? returnLink.url : '',
      }
      if(returnLink.url){
          store.commit('setReturnLink', {});
          next({path: returnLink.url, query: {...returnLink.query} });
      }else{
          next();
      }
  }
})

export default router;
