<template>
  <AuthContainer class="bg_lines">
    <form @submit.prevent="setVerifyCode" class="form">
      <div class="instruction__text">
        <p v-if="serverError" class="error">
          <strong v-for="err in serverErrors.errors.code" :key="err">{{ err }}</strong>
        </p>
        <h5 v-else class="instruction__text_title">2-Step Authentication</h5>
      </div>
      <div class="verify__code_box">
        <PincodeInput
          v-model="code"
          placeholder="-"
          :length="6"
          autoFocus="true"
          @input="onChange"
        />
      </div>
      <p>Please check your email for your account verification code.</p>

      <div class="btn_wrapper">
        <div class="to__login">
          Haven’t received the code?
          <a href="#" @click.prevent="sendEmail">Click here to resend it.</a
          ><span v-if="sendMessage">{{ sendMessage }}</span>
        </div>
        <button class="btn btn-yellow" :disabled="!visible" :class="!visible ? 'disable' : ''">
          Submit Code
        </button>
      </div>
    </form>
  </AuthContainer>
</template>
<script>
import AuthContainer from '@/common/auth/authContainer.vue'
import PincodeInput from 'vue-pincode-input'

import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
  name: 'email-varification',
  components: {
    AuthContainer,
    PincodeInput,
  },
  data() {
    return {
      code: '',
      visible: false,
      serverErrors: {
        errors: null,
      },
      sendMessage: null,
    }
  },
  watch: {
    code: function () {
      var code = this.code.split('')
      if (code.length == 6) {
        this.visible = true
      } else this.visible = false
    },
    sendMessage: function () {
      setTimeout(() => {
        this.sendMessage = null
      }, 5000)
    },
  },
  computed: {
    ...mapGetters('organizations/donation', {
      donateSlug: 'getStartedDonateSlug',
    }),
    serverError() {
      if (this.serverErrors.errors != null) {
        return this.serverErrors
      }
    },
  },
  methods: {

    ...mapMutations('user', ['setUser']),
    async sendEmail() {
      await this.axios
        .post('/email/send-verification')
        .then((res) => {
          this.sendMessage = 'Sent'
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async setVerifyCode() {
      let returnLink = this.$store.getters.getReturnLink;
      returnLink = {
        query: returnLink ? returnLink.query || {} : {},
        url: returnLink ? returnLink.url : '',
      }
      const code = {
        code: this.code,
      };
      await this.axios
        .post("/email/verify", code)
        .then((res) => {
          this.setUser(res.data.user);
          if (localStorage.startDonation == "true") {
            this.$router.push({ path: "/organization/" + this.donateSlug });
          } else {
            this.$router.push({ path: '/admin/account/profile' })
          }
        })
        .catch((error) => {
          this.serverErrors = error.response.data
          console.log(error)
        })
    },
    onChange(v) {
      this.visible = false
    },
    onComplete(v) {
      this.code = v
      this.visible = true
    },
  },
}
</script>