<template>
  <AuthContainer>
    <ValidationObserver v-slot="{ invalid }" tag="div" ref="observer" v-if="serverErrors == null">
      <form class="form">
        <div class="instruction__text">
          <p>Answer security question to proceed:</p>
          <p class="question">
            <strong>{{ question }}</strong>
          </p>
        </div>
        <div class="form__row">
          <ValidationProvider
            tag="div"
            class="form__field"
            :rules="{ required: true, min: 3, max: 200 }"
            v-slot="{ errors }"
            key="answer-input"
          >
            <input
              v-model="answer"
              placeholder="Enter your answer"
              :class="errors.length != 0 ? 'in-valid' : ''"
            />
            <span class="error">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
        <button
          class="btn btn-yellow"
          :disabled="invalid"
          :class="invalid ? 'disable' : ''"
          @click.prevent="sendAnswer"
        >
          Submit
        </button>
      </form>
    </ValidationObserver>
    <ValidationObserver v-slot="{ invalid }" tag="div" ref="observer-two" v-else>
      <form class="form">
        <div class="instruction__text">
          <p class="error error_long">
            {{ serverErrors.error }}
          </p>

          <p class="question">
            <strong>{{ serverErrors.second_question }}</strong>
          </p>
        </div>
        <div class="form__row">
          <ValidationProvider
            tag="div"
            class="form__field"
            :rules="{ required: true, min: 3, max: 200 }"
            v-slot="{ errors }"
            key="second-answer-input"
          >
            <input
              v-model="secondAnswer"
              placeholder="Enter your answer"
              :class="errors.length != 0 ? 'in-valid' : ''"
            />
            <span class="error">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
        <button
          class="btn btn-yellow hidden"
          :disabled="invalid"
          :class="invalid ? 'disable' : ''"
          @click.prevent="sendSecondAnswer"
        >
          Submit
        </button>
      </form>
    </ValidationObserver>
  </AuthContainer>
</template>
<script>
import AuthContainer from '@/common/auth/authContainer.vue'
import { ValidationObserver, ValidationProvider } from 'vee-validate'

import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'answer-security-question',
  components: {
    AuthContainer,
    ValidationObserver,
    ValidationProvider,
  },
  data() {
    return {
      answer: null,
      secondAnswer: null,
      counter: 0,
      serverErrors: null,
    }
  },
  mounted() {
    this.getQuestion()
  },
  computed: {
    ...mapGetters('organizations/donation', {
      donateSlug: 'getStartedDonateSlug',
    }),
    question() {
      return this.$store.getters['securityQuestions/securityQuestion']
    },
    serverError() {
      if (this.serverErrors != null) {
        return this.serverErrors
      }
    },
  },
  methods: {
    ...mapActions('auth', ['login', 'authUser']),
    ...mapActions('securityQuestions', ['securityQuestionOne']),
    getQuestion() {
      this.axios
        .get('/two-factor/get-question')
        .then((res) => {
          const payload = res.data
          this.securityQuestionOne(payload)
        })
        .catch((error) => {
          //console.log(error);
        })
    },
    async sendAnswer() {
      try {
        var answer = {
          answer: this.answer,
        }
        const resp = await this.axios.post('/two-factor/verify-answer', answer)
        this.login(resp.data)

        var accountLocked = this.$store.getters['auth/accountLocked'],
          resetPassword = this.$store.getters['auth/resetPassword']

        if (accountLocked.isUserBlocked == true) {
          this.$router.push({ name: 'new-password' })
        } else if (resetPassword == true) {
          this.$router.push({ name: 'forgot-password-confirme' })
        } else if (localStorage.startDonation == 'true') {
          this.$router.push({ path: '/organization/' + this.donateSlug })
        } else {
          this.$router.push({ path: '/admin/account/profile' })
        }

        return resp
      } catch (error) {
        if (error.response.status === 422) {
          this.serverErrors = error.response.data
        }
      }
    },
    async sendSecondAnswer() {
      var answer = {
        answer: this.secondAnswer,
      }
      await this.axios
        .post('/two-factor/verify-second-answer', answer)
        .then((res) => {
          this.login(res.data)

          var accountLocked = this.$store.getters['auth/accountLocked'],
            resetPassword = this.$store.getters['auth/resetPassword']

          if (accountLocked.isUserBlocked == true) {
            this.$router.push({ name: 'new-password' })
          } else if (resetPassword == true) {
            this.$router.push({ name: 'forgot-password-confirme' })
          } else if (localStorage.startDonation == 'true') {
            this.$router.push({ path: '/organization/' + this.donateSlug })
          } else {
            this.$router.push({ path: '/admin/account/profile' })
          }
        })
        .catch((error) => {})
    },
    async resetForm() {
      this.$refs.observer.reset()
      const result = await this.$refs.observer.validate()
      if (result != true) {
        this.message = 'error'
      }
    },
  },
}
</script>