import Vue from 'vue';
import VueGtag from 'vue-gtag';

Vue.use(VueGtag, {
  config: {
    id: process.env.VUE_APP_API_GOOGLE_ANALYTICS_KEY || '',
    params: { anonymize_ip: true },
  }
})
