
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

import VueCookies from 'vue-cookies'
Vue.use(VueCookies)

import router from './router'
import store from './store'

axios.defaults.baseURL = process.env.VUE_APP_URL;

axios.interceptors.request.use(function (config) {
    const token = Vue.$cookies.get("access_token");
    if (token != null) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, function (error) {
    return Promise.reject(error);
})

axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, function (error) {
    console.log(error);
    if (401 === error.response.status) {
        store.dispatch("cleanAllData");
        router.push("/login");
    }
    else if (404 === error.response.status) {
        router.push("/404");
    }
    else if (500 <= error.response.status) {
        Vue.swal({
            title: 'Sorry, something went wrong!',
            showCancelButton: true,
            confirmButtonText: "Reload",
            cancelButtonText: "Go Back",
        }).then((result) => {
            if (result.value) {
                Vue.prototype.$eventHub.$emit("reload");
            }
        });
    }
    else {
        return Promise.reject(error);
    }
});