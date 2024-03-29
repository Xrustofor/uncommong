import Vue from 'vue';
import App from './App.vue';
import VueMeta from 'vue-meta'
import VueMoment from 'vue-moment'
import './filters';
import moment from 'moment-timezone'
import VueProgressBar from 'vue-progressbar';
import VueSocialSharing from 'vue-social-sharing';
import VueTheMask from 'vue-the-mask';
import VueCookies from 'vue-cookies'

Vue.use(VueMeta)
Vue.use(VueCookies)
Vue.use(VueSocialSharing);

import CKEditor from '@ckeditor/ckeditor5-vue2';
Vue.use(CKEditor);

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
const options = {
  showCloseButton: true,
  customClass: {
    container: "block_container",
    popup: "block_container_body",
    confirmButton: "btn",
    cancelButton: "btn",
  },
};

Vue.use(VueSweetalert2, options);
Vue.use(VueMoment, {
  moment,
})
Vue.use(VueTheMask);

import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

Vue.use(VueToast);

Vue.use(VueProgressBar, {
  color: '#c5e1ed',
  failedColor: '#6DB5D1',
  thickness: '2px',
  position: 'absolute',
  transition: {
    speed: '0.2s',
    opacity: '0.6s',
    termination: 300
  },

});

var VueScrollTo = require('vue-scrollto');
Vue.use(VueScrollTo, {
  container: 'body',
  duration: 700,
  easing: 'ease-in-out',
  lazy: false,
  force: true,
});

import router from './router';
import store from './store';
import './axios';

import vueCountryRegionSelect from 'vue-country-region-select'
Vue.use(vueCountryRegionSelect)

import "./validate";
import { ValidationProvider } from 'vee-validate';
Vue.component('ValidationProvider', ValidationProvider);

import AdminPanel from '@/layouts/adminPage.vue'
import FullPage from '@/layouts/fullPage.vue'
import Website from '@/layouts/websitePage.vue'

Vue.component('admin-page', AdminPanel)
Vue.component('full-page', FullPage)
Vue.component('website', Website)

import VueHtmlToPaper from 'vue-html-to-paper';
Vue.use(VueHtmlToPaper);

var infiniteScroll = require('vue-infinite-scroll');
Vue.use(infiniteScroll)

import "./assets/style.scss";
import './registerServiceWorker'

Vue.config.productionTip = false
Vue.prototype.$eventHub = new Vue()

router.beforeEach((to, from, next) => {
  const matchingPaths = {
    params: to.params,
    items: to.matched.map(m => ({
      params: to.params,
      path: m.path,
      key: m.meta.key ? m.meta.key : ''
    })),
  };
  store.commit('setMatchingPaths', matchingPaths);

  const item = {
    params: to.params,
    path: to.path,
    name: to.name ? to.name : '',

  };
  store.commit('setRouterData', item);

  const breadItems = {
    params: to.params,
    matched: to.matched,
    mainPath: to.meta.mainPath ? to.meta.mainPath : { path: '', title: '' },
  }
  store.commit('setBreadItems', breadItems);

  next();
});


import '@/plugins/google-analytics';
import '@/plugins/google-tag-manager';

Vue.directive('scroll', {
  inserted: function (el, binding) {
    let f = function (evt) {
      if (binding.value(evt, el)) {
        window.removeEventListener('scroll', f);
      }
    }
    window.addEventListener('scroll', f);
  }
})

new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App)
})

