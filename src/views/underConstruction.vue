<template>
  <div
    class="full_page"
    :style="`background-image: url(${require(`@/assets/img/underConstruction.svg`)})`"
  >
    <div class="container">
      <div class="content">
        <img :src="require(`@/assets/img/logo-blue.svg`)" alt="logo" />
        <div>
          <h1>Site Under Construction</h1>
          <p>
            We are currently working on a few things to make your experience
            better. If you need any assistance or are interested in joining our
            platform feel free to subscribe or email us at
            <a :href="`mailto:${staticMail}`">{{staticMail}}</a>
            so we can keep you updated on all the fun things we have planned!
          </p>
          <div class="subscribe">
            <div class="center_title">
              <h4>Subscribe to get latest news and updates</h4>
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
                        placeholder="Enter your mail"
                        :class="errors.length != 0 ? 'in-valid' : ''"
                      />
                      <LoaderButton
                        class="btn btn-yellow"
                        text="SUBMIT"
                        :loading="loading"
                        :disabled="invalid || email === ''"
                        @emitClick="subscribe"
                      ></LoaderButton>
                    </ValidationProvider>
                  </div>
                </div>
              </form>
            </ValidationObserver>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import LoaderButton from "@/components/buttons/loaderButton.vue";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    LoaderButton,
    ValidationObserver,
    ValidationProvider,
  },
  data() {
    return {
      email: "",
      loading: false,
      staticMail: process.env.VUE_APP_MAIL_UNCOMMONGOOD || '',
    };
  },
  mounted() {
    this.$store.dispatch("setLoader", false);
    if (this.underConstruction == false) {
      this.$router.push({ path: "/" });
    }
  },
  computed: {
    ...mapGetters("underConstructionPage", {
      underConstruction: "getUnderConstruction",
    }),
  },
  watch: {
    underConstruction() {
      if (this.underConstruction == false) {
        this.$router.push({ path: "/" });
      }
    },
  },
  methods: {
    ...mapActions(["subscribeToNews"]),
    async subscribe() {
      this.loading = true;
      var success = await this.subscribeToNews(this.email);

      this.$swal({
        title: success,
        confirmButtonText: "OK",
      });
      this.reset();
    },
    reset() {
      this.loading = false;
      this.$nextTick(() => {
        this.email = "";
        this.$refs.observer.reset();
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.full_page {
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    min-height: 100vh;
    padding: 5rem 0;
    @media only screen and (max-width: 768px) {
      padding: 3rem 0;
    }
    img {
      width: 150px;
      @media only screen and (max-width: 768px) {
        width: 135px;
      }
    }
    & > div {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex: 1;
      max-width: 925px;
      margin: 0 auto;
      padding-top: 5rem;
      @media only screen and (max-width: 768px) {
        padding-top: 4rem;
      }
      h1 {
        text-align: center;
        color: $websiteText;
        margin-bottom: 25px;
      }
      p {
        font-size: 18px;
        line-height: 1.55;
        font-weight: 700;
        color: $websiteText;
        margin-bottom: 60px;
        text-align: center;
        @media only screen and (max-width: 768px) {
          font-size: 16px;
          margin-bottom: 40px;
        }
        a {
          color: $textLightBlue;
          &:hover {
            color: $green;
          }
        }
      }
      .subscribe {
        width: 100%;
        max-width: 570px;
        margin: 0 auto;
        h4 {
          color: $websiteText;
          text-align: center;
          margin-bottom: 20px;
          @media only screen and (max-width: 1299px) {
            font-size: 18px;
          }
        }
        .inputs-overlay {
          .form__field {
            position: relative;
            max-width: 100%;
            input {
              height: 7rem;
              max-width: 100%;
              border-color: #bdbdbd;
              border-radius: 4rem;
              color: $violet;
              font-size: 18px;
              padding-right: 13.5rem;
              &::-moz-placeholder,
              &::-ms-input-placeholder,
              &::-webkit-input-placeholder {
                color: $violet;
                opacity: 1;
              }
              @media only screen and (max-width: 599px) {
                padding-right: 1.5rem;
              }
            }
            .btn {
              min-width: 12.5rem;
              position: absolute;
              right: 5px;
              top: 5px;
              @media only screen and (max-width: 1299px) {
                height: 6rem;
                line-height: 5.8rem;
              }
              @media only screen and (max-width: 599px) {
                position: relative;
                margin: 10px auto 0;
              }
            }
          }
        }
      }
    }
  }
}
</style>