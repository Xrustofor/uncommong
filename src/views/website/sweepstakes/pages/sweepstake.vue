<template>
  <div>
    <Header
      :data="details"
      :restOfTime="restOfTime"
      :donate="donateList"
      :socialItems="socialItems"
      :donorsCount="donorsCount"
      :organizations="organizations"
      :loade="donateLoade"
      :time="time"
      @send="sendDonate($event)"
      @sendFreeDonate="sendFreeDonate()"
    />
    <section class="content_body container">
      <OrganizationContent
        :organizations="organizations"
        :prizes="prizes"
        :details="details"
        :sliderItems="sliderItems"
        :loaded="loadedDetails"
      >
        <template #footer>
          <div class="footer_section">
            <div class="left" id="top">
              <donateNow
                :items="donateList"
                :title="prizes.widgetTitle"
                :text="prizes.widgetText"
                :showIcon="false"
                positionTitle="left"
                :banInput="true"
                :restOfTime="restOfTime"
                :organizations="organizations"
                :time="time"
                :loade="donateLoade"
                @sendData="sendDonate($event)"
                @sendFreeDonate="sendFreeDonate()"
              />
            </div>
            <div class="right">
              <div class="image_wrap">
                <div class="circle" v-if="!restOfTime.starts">
                  <div class="date">
                    <div class="date_time">
                      <strong>{{
                        startDate | _moment("DD", "MM.DD.YYYY HH:mm")
                      }}</strong>
                      <span>{{
                        startDate | _moment("MMMM", "MM.DD.YYYY HH:mm")
                      }}</span>
                    </div>
                    <div class="date_time">
                      <strong>{{
                        endDate | _moment("DD", "MM.DD.YYYY HH:mm")
                      }}</strong>
                      <span>{{
                        endDate | _moment("MMMM", "MM.DD.YYYY HH:mm")
                      }}</span>
                    </div>
                  </div>
                </div>
                <div
                  class="circle"
                  v-else-if="restOfTime.days > 0 && restOfTime.hours >= 0"
                >
                  <div class="date">
                    <div class="date_time">
                      <strong>{{ restOfTime.days }}</strong>
                      <span>days</span>
                    </div>
                    <div class="date_time">
                      <strong>{{ restOfTime.hours }}</strong>
                      <span>Hours</span>
                    </div>
                  </div>
                  <div class="bottom"><p>time remaining</p></div>
                </div>
                <div
                  class="circle"
                  v-else-if="
                    (restOfTime.hours > 0 && restOfTime.minutes >= 0) ||
                    (restOfTime.hours == 0 && restOfTime.minutes > 0)
                  "
                >
                  <div class="date">
                    <div class="date_time">
                      <strong>{{ restOfTime.hours }}</strong>
                      <span>Hours</span>
                    </div>
                    <div class="date_time">
                      <strong>{{ restOfTime.minutes }}</strong>
                      <span>
                        {{
                          `${restOfTime.minutes > 1 ? " Minutes" : " Minute"} `
                        }}</span
                      >
                    </div>
                  </div>
                  <div class="bottom"><p>time remaining</p></div>
                </div>
                <div class="circle" v-else>
                  <span class="message">Sweepstake has ended</span>
                </div>
                <div
                  class="image"
                  :style="`background-image: url(${
                    prizes.widgetImage ? prizes.widgetImage : details.image
                  });`"
                ></div>
              </div>
              <p>{{ details.headline }}</p>
            </div>
          </div>
        </template>
      </OrganizationContent>
    </section>
    <popPup
      class="pop_pup"
      v-model="showModal"
      title="Choose Organization to support"
    >
      <template #body>
        <vSelect
          placeholder="Choose a Organization"
          v-model="organizationSelect"
          :options="organizations"
          :reduce="
            (name) => ({
              id: name.id,
              account_id: name.account_id,
              name: name.name,
            })
          "
          label="name"
        />
      </template>
      <template #footer>
        <button
          class="button_yellow"
          type="submit"
          :disabled="!organizationSelect"
          @click="continuePayment()"
        >
          ENTER NOW
        </button>
      </template>
    </popPup>
  </div>
</template>
<script>

import Header from "@/views/website/sweepstakes/components/header";
import OrganizationContent from "@/views/website/sweepstakes/components/organizationContent";
import donateNow from "@/views/website/sweepstakes/components/donateNow";
import MessageModal from "@/views/website/sweepstakes/components/messageModal";
import MessageAuthorization from "@/views/website/sweepstakes/components/messageAuthorization";
import vSelect from "vue-select";
import popPup from "@/common/popPup";
import fbTrackMixin from "@/trackMixin/facebookPixel.js";
import { mapGetters, mapMutations, mapActions } from "vuex";

export default {
  mixins: [fbTrackMixin],
  components: {
    Header,
    MessageModal,
    MessageAuthorization,
    OrganizationContent,
    donateNow,
    vSelect,
    popPup,
  },
  data() {
    return {
      url: `${window.location}`,
      showModal: false,
      isAuthorized: false,
      isBillingInfo: false,
      slug: "",
      endDate: this.$moment(new Date(), "YYYY.MM.DD HH:mm"),
      startDate: this.$moment(new Date(), "YYYY.MM.DD HH:mm"),
      restOfTime: {
        days: 0,
        hours: 0,
        minutes: 0,
      },
      paramsForDonate: null,
      showModalPopUp: false,
      stripe: "",
      stripeAPIToken: process.env.VUE_APP_STRIPE_KEY,
      donateLoade: false,
      organizationSelect: "",
      timingRefresh: null,
    };
  },
  
  async created() {
    const FORMAT = "MM.DD.YYYY HH:mm";
    this.$store.dispatch("setLoader", true);
    this.slug = this.$router.history.current.params.sweepstakeId;

    await this.apiGetSweepstakData(this.slug);
    this.endDate = this.details
      ? this.$moment(this.details.endDate, "YYYY-MM-DD HH:mm").format(FORMAT)
      : moment().format(FORMAT);

    this.startDate = this.details
      ? this.$moment(this.details.startDate, "YYYY-MM-DD HH:mm").format(FORMAT)
      : this.$moment().format(FORMAT);

    this.timing();
    this.timingRefresh = setInterval(() => this.setTime(this.simpleTime), 1000);

    const token = await this.$cookies.get("access_token");

    if (token) {
      this.isAuthorized = true;
      this.isBillingInfo = await this.apiGetIsBillingsExists();
    } else {
      this.isAuthorized = false;
    }

    this.$store.dispatch("setLoader", false);

  },
  destroyed() {
    clearInterval(this.timingRefresh);
  },
  computed: {
    ...mapGetters("publicweb/sweepstake", {
      socialItems: "getSocialItems",
      details: "getDetails",
      organizations: "getOrganizations",
      prizes: "getPrizes",
      sweepstakeDetailId: "getSweepstakeDetailId",
      sweepstakePrizeId: "getSweepstakePrizeId",
      donateList: "getDonateList",
      donorsCount: "getDonorsCount",
      organizationsImg: "getOrganizationsImg",
      loaded: "getLoaded",
      loadedDetails: "getLoadedDetails",
      sessionId: "getSessionId",
      message: "getMessage",
      time: "getTime",
      simpleTime: "getSimpleTime",
      sliderItems: "getSliderItems",
    }),
  },
  methods: {
    ...mapActions("publicweb/sweepstake", [
      "apiGetSweepstakData",
      "apiGetIsBillingsExists",
      "apiGetCheckout",
      "apiGetDonateDefault",
      "apiGetForUnauthorizedCheckout",
    ]),
    ...mapMutations("publicweb/sweepstake", ["setTime"]),
    async sendDonate(val) {
       const slag = this.$route.params.sweepstakeId;
       const strQuery = "entries=" + val.entries + "&price=" + val.price;
       let success = false;

       const urlData = {
         url: `/sweepstakes/${slag}/sweepstake-payment`,
         query: {
          entries: val.entries,
          price: val.price,
         }
       }

      if(this.isAuthorized){
        this.$router.push(`/sweepstakes/${slag}/sweepstake-payment?${strQuery}`);
      }else{
        success = await this.authorizationMessage(urlData);
      }

      if(success){ this.$router.push(`/sweepstakes/${slag}/sweepstake-payment?${strQuery}`); }

    },
    async sendFreeDonate() {
      let success = false;
      const urlData = {
         url: `/sweepstakes/${this.slag}/sweepstake-payment`,
         query: null,
      }

      if(this.isAuthorized){
        this.$router.push(`/sweepstakes/${this.slug}/alternative-donation`);
      }else{
        success = await this.authorizationMessage(urlData);
      }
      if(success){ this.$router.push(`/sweepstakes/${this.slug}/alternative-donation`) }

    },

    timing() {
      const FORMAT = "MM.DD.YYYY HH:mm:ss";
      const currentDate = this.$moment().tz("America/New_York").format(FORMAT);

      if (currentDate > this.startDate) {
        const time = {
          starts: true,
          days: +this.$moment(this.endDate, FORMAT).diff(
            this.$moment(currentDate, FORMAT),
            "days"
          ),
          hours:
            +this.$moment(this.endDate, FORMAT).diff(
              this.$moment(currentDate, FORMAT),
              "hour"
            ) -
            +this.$moment(this.endDate, FORMAT).diff(
              this.$moment(currentDate, FORMAT),
              "days"
            ) *
              24,
          minutes:
            +this.$moment(this.endDate, FORMAT).diff(
              this.$moment(currentDate, FORMAT),
              "minutes"
            ) -
            +this.$moment(this.endDate, FORMAT).diff(
              this.$moment(currentDate, FORMAT),
              "hour"
            ) *
              60,
        };
        this.restOfTime = time;
      }
    },
    async sendDonateDefault(item) {
      this.donateLoade = true;
      var result = await this.apiGetDonateDefault(item);
      this.donateLoade = false;
      let self = this;
      if (result.success) {
        const data = {
          content_type: "Sweepstake",
          content_name: "Donate",
          contents: [{ "Organizations name": this.organizationSelect.name }],
          value: `${this.paramsForDonate.price}`,
          currency: "USD",
        };
        this.fbTrack("Purchase", data);

        this.$swal({
          title: `Thank you for your Sweepstake Entry and your donation to ${this.organizationSelect.name}!`,
          confirmButtonText: "OK",
        });
      } else {
        this.$swal({ title: result.message, confirmButtonText: "OK" });
      }
    },

    async authorizationMessage(urlData){
      let success = false;
      await this.$swal({
        title: "Please sign up for a better experience",
        showDenyButton: true,
        denyButtonText: "Sign Up",
        denyButtonClass: "confirm",
        confirmButtonText: "Continue as Guest",
        confirmButtonClass: "cancel",
        showCloseButton: true,
      }).then((result) => {
        if (result.isDenied) {
          this.$store.commit("setReturnLink", urlData);
          this.$router.push({ path: "/login" });
          return;
        }
        if(result.isConfirmed){
          success = true;
        }
      });
      return success;
    }
  },
};
</script>
<style lang="scss" scoped>
.container {
  z-index: auto;
}
.content_body {
  padding-top: 125px;
  padding-bottom: 30rem;
  min-height: 45rem;
  @media only screen and (max-width: 998px) {
    padding-top: 0;
    min-height: auto;
  }
  @media only screen and (min-width: 3000px) {
    padding-top: 200px;
  }
  .footer_section {
    padding: 6.5rem 40px 30px 40px;
    box-shadow: 0px 24px 20px rgba(154, 131, 183, 0.05),
      0px 3px 2px rgba(154, 131, 183, 0.02),
      0px 8px 100px rgba(154, 131, 183, 0.1);
    border-radius: 1rem;
    background: $white;
    display: flex;
    @media (max-width: 998px) {
      display: block;
    }
    @media (max-width: 998px) {
      padding: 3rem 1.5rem;
    }
    .left {
      margin-right: 120px;
      @media (max-width: 1199px) {
        margin-right: 50px;
      }
      @media (max-width: 998px) {
        width: 100%;
        margin-bottom: 3rem;
      }
    }
    .right {
      flex: 1;
      @media (max-width: 998px) {
        width: 100%;
        flex: auto;
      }
      .image_wrap {
        position: relative;
        padding-bottom: 100%;
        margin-bottom: 2rem;
        @media (max-width: 998px) {
          width: 100%;
          padding-bottom: 1.5rem;
        }
      }
      .image {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: 60vw;
        border-radius: 2rem 0rem 0rem 2rem;
        overflow: hidden;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        background-color: $violetBorder;
        @media (max-width: 998px) {
          position: static;
          width: 100%;
          height: 450px;
          border-radius: 2rem;
          background-size: cover;
        }
        @media (max-width: 998px) {
          height: 350px;
        }
      }
      .circle {
        position: absolute;
        width: 18rem;
        height: 18rem;
        border-radius: 100%;
        background: #fff;
        top: -5rem;
        right: 0px;
        display: flex;
        flex-direction: column;
        text-align: center;
        align-items: center;
        justify-content: center;
        padding: 4rem 3rem;
        border: 3px solid $violet;
        z-index: 2;
        @media (max-width: 998px) {
          right: 25px;
        }
        @media only screen and (max-width: 998px) {
          flex-direction: column-reverse;
          position: static;
          border-radius: 0;
          border: none;
          height: auto;
          padding: 0;
          margin: 0 auto 50px;
        }
        .date {
          display: flex;
          justify-content: center;
          align-items: center;
          border-bottom: 1px solid #edecef;
          padding-bottom: 5px;
          @media only screen and (max-width: 998px) {
            border-bottom: none;
          }
          .date_time {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: $websiteViolet;
            border-right: 1px solid #edecef;
            padding: 0 5px;
            min-width: 55px;
            @media only screen and (max-width: 998px) {
              padding: 0 20px;
            }
            &:last-child {
              border-right: 0;
            }
            strong {
              font-weight: 900;
              font-size: 24px;
              @media only screen and (max-width: 998px) {
                font-size: 40px;
              }
            }
            span {
              font-size: 12px;
              text-transform: uppercase;
            }
          }
        }
        .message {
          font-weight: 900;
          font-size: 2rem;
          color: $websiteViolet;
        }
        .bottom {
          p {
            font-size: 12px;
            font-weight: 500;
            text-transform: uppercase;
            margin-top: 5px;
            color: $websiteViolet;
            @media only screen and (max-width: 998px) {
              font-size: 14px;
              font-weight: 700;
              margin: 0 auto 10px;
            }
          }
        }
      }
      p {
        font-size: 18px;
        color: $websiteText;
        @media only screen and (max-width: 998px) {
          text-align: center;
        }
      }
    }
  }
}
.pop_pup {
  .button_yellow {
    background: $yellow;
    padding: 2rem 4rem;
    height: auto;
    box-shadow: 0px 6px 10px rgba(237, 188, 51, 0.3);
    border-radius: 4rem;
    transition: all linear 0.3s;
    color: $websiteText;
    &.disable,
    &:disabled {
      opacity: 1;
      background: rgba($color: $yellow, $alpha: 0.3);
      &:hover {
        background: rgba($color: $yellow, $alpha: 0.3);
        color: $websiteText;
      }
    }
  }
}
</style>