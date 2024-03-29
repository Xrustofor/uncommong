<template>
  <div class="container">
    <div class="center_title">
      <h2>Subscribe to our mailing list to see UncommonGood in action</h2>
    </div>
    <ValidationObserver ref="observer" v-slot="{ invalid }" tag="div">
      <form class="form">
        <div class="inputs-overlay">
          <div class="form__row">
            <ValidationProvider
              tag="div"
              class="form__field"
              name="email"
              :rules="{ email: true }"
              v-slot="{ errors }"
            >
              <input
                v-model="email"
                type="text"
                placeholder="Email"
                :class="errors.length != 0 ? 'in-valid' : ''"
              />
              <LoaderButton
                class="btn btn-yellow btn-small"
                text="Submit"
                :loading="subscribeLoading"
                :disabled="invalid"
                @emitClick="subscribe"
              ></LoaderButton>
            </ValidationProvider>
          </div>
          <div class="form__row">
            <ValidationProvider tag="div" class="terms" name="terms" rules="true">
              <label>
                <input v-model="is_accepted_terms" type="checkbox" />
                <span></span>
              </label>
              <p>
                I agree to UncommonGood
                <a :href="url + '/terms-of-service'" target="_blank" class="underline"
                  >Terms and Conditions</a
                >
                and
                <a :href="url + '/privacy-policy'" target="_blank" class="underline"
                  >Cookie & Privacy Policy.</a
                >
              </p>
            </ValidationProvider>
          </div>
        </div>
      </form>
    </ValidationObserver>
  </div>
</template>
<script>
import LoaderButton from '@/components/buttons/loaderButton.vue'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { mapActions } from 'vuex'
export default {
  components: {
    LoaderButton,
    ValidationObserver,
    ValidationProvider,
  },
  data() {
    return {
      url: process.env.VUE_APP_UNCOMMONGOOD || '',
      email: '',
      is_accepted_terms: false,
      subscribeLoading: false,
    }
  },
  methods: {
    ...mapActions(['subscribeToNews']),
    async subscribe() {
      this.subscribeLoading = true
      var success = await this.subscribeToNews(this.email)

      this.$swal({
        title: success,
        confirmButtonText: 'OK',
      })
      this.reset()
    },
    reset() {
      this.subscribeLoading = false
      this.$nextTick(() => {
        this.email = ''
        this.is_accepted_terms = false
        this.$refs.observer.reset()
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.container {
  margin-bottom: 2rem;
}
h2 {
  font-size: 26px;
  line-height: 1.2;
  font-weight: 900;
  margin-bottom: 20px;
  color: #fff;
}
.inputs-overlay {
  max-width: 650px;
  margin: 0 auto;
  .form__field {
    position: relative;
    max-width: 100%;
    input {
      max-width: 100%;
    }
    .btn {
      position: absolute;
      right: 10px;
      top: 10px;
      height: 4rem;
      line-height: 3.8rem;
      &:disabled {
        opacity: 1;
        background: rgba($color: $yellow, $alpha: 0.3);
      }
      @media only screen and (max-width: 1299px) {
        top: 5px;
        right: 5px;
      }
    }
  }
}
.terms {
  margin: 0 auto 15px;
  display: flex;
  p {
    @include type(inherit, 14px, 400, none, 1.45);
    color: #fff;
    @media only screen and (max-width: 599px) {
      font-size: 12px;
    }
  }
  label {
    align-items: center;
    width: auto;
  }
  a {
    position: relative;
    @include type(inherit, 14px, 400, none, 1.4);
    color: #fff;
    @media only screen and (max-width: 599px) {
      font-size: 12px;
    }
    &.underline:after {
      background-color: #fff;
    }
    &:hover {
      color: $textLightBlue;
      &.underline:after {
        background-color: $textLightBlue;
      }
    }
  }
}
</style>