import Vue from 'vue'
import VueGtm from '@gtm-support/vue2-gtm';

const id = process.env.VUE_APP_API_GOOGLE_TAG_MANAGER || '';

if(id){
  Vue.use(VueGtm, {
    id: process.env.VUE_APP_API_GOOGLE_TAG_MANAGER || '', // Your GTM single container ID or array of container ids ['GTM-xxxxxx', 'GTM-yyyyyy'] or array of objects [{id: 'GTM-xxxxxx', queryPararms: { gtm_auth: 'abc123', gtm_preview: 'env-4', gtm_cookies_win: 'x'}}, {id: 'GTM-yyyyyy', queryParams: {gtm_auth: 'abc234', gtm_preview: 'env-5', gtm_cookies_win: 'x'}}]
    queryParams: {
      // Add url query string when load gtm.js with GTM ID (optional)
      // gtm_auth: 'AB7cDEf3GHIjkl-MnOP8qr',
      // gtm_preview: 'env-4',
      // gtm_cookies_win: 'x'
    },
    defer: false, // defaults to false. Script can be set to `defer` to increase page-load-time at the cost of less accurate results (in case visitor leaves before script is loaded, which is unlikely but possible)
    enabled: true, // defaults to true. Plugin can be disabled by setting this to false for Ex: enabled: !!GDPR_Cookie (optional)
    debug: true, // Whether or not display console logs debugs (optional)
    loadScript: true, // Whether or not to load the GTM Script (Helpful if you are including GTM manually, but need the dataLayer functionality in your components) (optional)
    ignoredViews: ['homepage'], // Don't trigger events for specified router names (case insensitive) (optional)
    trackOnNextTick: false // Whether or not call trackView in Vue.nextTick
  });
}