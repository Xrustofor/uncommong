import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    gallaryImages: [],
    organization: null,
    loading: false,
    organizationId: null,
    ourStory: "",
  },
  getters: {
    getGallaryImages(state) {
      return state.gallaryImages
    },
    geOrganization(state) {
      return state.organization
    },
    geOrganizationId(state) {
      return state.organizationId
    },
    getOurStory(state) {
      return state.ourStory
    },
    getLoading(state) {
      return state.loading
    },
  },
  mutations: {
    setGallaryImages(state, payload) {
      state.gallaryImages = [];
      if (!payload.length) return;
      state.gallaryImages = payload.sort((a, b) => a.order - b.order);
    },
    setOrganization(state, payload) {
      state.organization = payload
    },
    seOrganizationId(state, payload) {
      state.organizationId = payload
    },
    setLoading(state, payload) {
      state.loading = payload
    },
    setRemoveImage(state, payload) {
      let items = [];
      state.gallaryImages.map(g => {
        if (g.id !== +payload) items.push(g);
      })
      state.gallaryImages = items;
      // state.gallaryImages = payload
    },
    setOurStory(state, payload) {
      state.payload = "";
      state.ourStory = payload;
    },
    setGallaryImagesСlear(state) {
      state.gallaryImages = [];
    },
    setClearState(state) {
      state.ourStory = "";
    }
  },
  actions: {
    async apiGetOrganization({commit}, id) {
      commit('setLoading', true);
      try {
        await Vue.axios
          .get(`organizations/${id}`)
          .then(res => res.data)
          .then(data => {
            if (data.organization) {
              commit("setOurStory", data.organization.biography);
              commit('seOrganizationId', +data.organization.id);
              commit('setOrganization', data.organization);
              commit('setLoading', false);
            }
          })
      } catch (e) {
        console.log(e)
      }
      commit('setLoading', false);
    },

    async apiGetImagesGallary({commit}, payload) {
      commit('setLoading', true);
      const {idOrganization} = payload;
      try {
        await Vue.axios
          .get(`organizations/${idOrganization}/gallery`)
          .then(res => res.data)
          .then(data => {
            commit('setGallaryImages', data);
            commit('setLoading', false);
          })

      } catch (e) {
        console.log(e)
      }
      commit('setLoading', false);
    },

    async apiPostUploadImagesGallary({commit}, payload) {
      const {idOrganization, data} = payload;
      commit('setLoading', true);
      try {
        await Vue.axios
          .post(`organizations/${idOrganization}/gallery`, data)
          .then(res => res.data)
          .then(data => {
            commit('setOrganization', data);
            commit('setGallaryImages', data.organization.galleries);
            commit('setLoading', false);
          })

      } catch (e) {
        console.log(e)
      }
      commit('setLoading', false);
    },

    async apiDeleteImagesGallary({commit}, payload) {
      const {idOrganization, galleryImageId} = payload;
      commit('setLoading', true);
      try {
        await Vue.axios
          .delete(`organizations/${idOrganization}/gallery/${galleryImageId}`)
          .then(res => res.data)
          .then(() => {
            commit('setRemoveImage', galleryImageId);
            commit('setLoading', false);
          })

      } catch (e) {
        console.log(e)
      }
      commit('setLoading', false);
    },

    async apiPutShiftImagesGallary({commit}, payload) {
      const {idOrganization, data} = payload;
      commit('setLoading', true);
      try {
        await Vue.axios
          .put(`organizations/${idOrganization}/gallery`, data)
          .then(res => res.data)
          .then((data) => {
            commit('setGallaryImages', data.galleries);
            commit('setLoading', false);
          })

      } catch (e) {
        console.log(e)
      }
      commit('setLoading', false);
    },

    async apiDeletedImagesCKEditor(store, payload) {
      let response = null
      console.log('payload', payload)
      const data = { images: payload }
      try {
        await Vue.axios
          .delete(`delete-ckeditor-image`, {data})
          .then(res => response = res)
      } catch (e) {
        console.log(e)
      }

      console.log('delete-ckeditor-image', response)

      return response;
    }
  },
}
