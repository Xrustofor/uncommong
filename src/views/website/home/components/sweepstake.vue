<template>
  <div class="sweepstake">
    <div
      class="image_blok"
      :style="`background-image: url(${item.details.image})`"
    >
      <div class="bottom">
        <span class="with_icon">
          <span class="icon">
            <icon-base
              class="icon"
              :width="!orgLength ? '11' : '19'"
              :height="!orgLength ? '15' : '21'"
              :viewBox="!orgLength ? '0 0 11 15' : '0 0 19 21'"
              icon-name="download"
              icon-color="#fff"
            >
              <icon-organization v-if="!orgLength" />
              <icon-organizations v-else />
            </icon-base>
          </span>
          {{ orgCount }}</span
        >
        <span class="title">{{ item.details.name }}</span>
        <div class="hidden">
          <div class="btn_overlay">
            <router-link
              v-if="starts"
              :to="`/sweepstakes/${item.slug}`"
              v-slot="{ href, navigate }"
              custom
              ><a :href="href" @click="navigate" class="btn btn-yellow">
                Enter now
              </a>
            </router-link>
            <router-link
              v-else
              :to="`/sweepstakes/${item.slug}`"
              v-slot="{ href, navigate }"
              custom
              ><a
                :href="href"
                @click="navigate"
                class="btn btn-alt btn-alt-white"
              >
                view
              </a>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div class="circle" v-if="!starts">
      <span class="message">Coming Soon</span>
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
            {{ `${restOfTime.minutes > 1 ? " Minutes" : " Minute"} ` }}</span
          >
        </div>
      </div>
    </div>
    <div class="circle finish" v-else>
      <span class="message">Sweepstake has ended</span>
    </div>
  </div>
</template>
<script>

import IconBase from "@/components/IconBase";
import iconOrganization from "@/components/icons/iconPerson";
import iconOrganizations from "@/components/icons/iconPersons";
import {DateHandling} from '@/helpers/date'

export default {
  props: { item: { type: Object } },
  components: {
    IconBase,
    iconOrganization,
    iconOrganizations,
  },
  data() {
    setInterval(() => this.timing(), 1000 * 60);
    return {
      restOfTime: {
        days: 0,
        hours: 0,
        minutes: 0,
      },
      endDate: new Date(),
      startDate: new Date(),
      starts: false,
      orgLength: false,
      orgCount: "",
    };
  },
  mounted() {
    const FORMAT = "MM.DD.YYYY HH:mm";
    this.endDate = this.item
      ? this.$moment(this.item.details.end_date, "YYYY/MM/DD HH:mm").format(
          FORMAT
        )
      : this.$moment().format(FORMAT);

    this.startDate = this.item
      ? this.$moment(this.item.details.start_date, "YYYY/MM/DD HH:mm").format(
          FORMAT
        )
      : this.$moment().format(FORMAT);

      if(this.item.statuses){
        const isScheduledStatus = !!this.item.statuses.find(st => st.slug === 'scheduled');
        if(isScheduledStatus){
          this.starts = false;
        }
        const isActiveStatus = !!this.item.statuses.find(st => st.slug === 'active');
        if(isActiveStatus){
          this.starts = true;
        }
      }     

    this.timing();
    this.organizations();
  },
  methods: {
    timing() {
      const FORMAT = "MM.DD.YYYY HH:mm:ss";

      const currentDate = this.$moment().tz("America/New_York").format(FORMAT);

      const currentDateUnix = +this.$moment(currentDate, 'MM.DD.YYYY HH:mm:ss').format('x')
      const startDateUnix = +this.$moment(this.startDate, 'MM.DD.YYYY HH:mm:ss').format('x')

      if (currentDateUnix > startDateUnix) {
        this.starts = true;
        const time = {
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
    organizations() {
      var org = this.item.organizations,
        orgCount = org.length > 1 ? org.length + " Organizations" : org[0].name;
      if (org.length > 1) {
        this.orgLength = true;
      }
      this.orgCount = orgCount;
    },
  },
};
</script>
<style lang="scss" scoped>
.sweepstake {
  display: block;
  position: relative;
  z-index: 1;
  .image_blok {
    position: relative;
    z-index: 1;
    padding-bottom: 144%;
    background-color: $white;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    border-radius: 1rem;
    width: 100%;
    display: block;
    @media (max-width: 768px) {
      border-radius: 1rem;
      padding-bottom: 380px;
    }
    .bottom {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      overflow: hidden;
      padding: 10px 15px 0;
      color: $white;
      display: flex;
      flex-direction: column;
      border-radius: 10px;
      background-color: rgba($color: #4b3d5b, $alpha: 0.85);
      .with_icon {
        display: flex;
        margin-bottom: 10px;
        font-size: 14px;
        line-height: 1.2;
        .icon {
          display: block;
          margin-right: 3px;
          margin-top: -0.5px;
        }
      }
    }
    .title {
      font-weight: 900;
      font-size: 20px;
      margin-bottom: 10px;
      @media only screen and (max-width: 768px) {
        font-size: 18px;
      }
      @media only screen and (max-width: 599px) {
        font-size: 16px;
      }
    }
    .btn_overlay {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 0 15px;
      @media only screen and (max-width: 599px) {
        flex-wrap: wrap;
      }
      .btn {
        padding: 0 25px;
        text-transform: uppercase;
        margin-bottom: 15px;
        font-size: 12px;
        @media only screen and (max-width: 1299px) {
          padding: 0 20px;
        }
        @media only screen and (max-width: 1199px) {
          padding: 0 30px;
        }
        @media only screen and (max-width: 768px) {
          width: calc((100% - 20px) / 2);
        }
        @media only screen and (max-width: 599px) {
          width: 100%;
        }
      }
    }
  }
}
.circle {
  position: absolute;
  width: 10rem;
  height: 10rem;
  border-radius: 100%;
  background: #fff;
  top: -25px;
  left: -20px;
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  border: 2px solid $violet;
  z-index: 1;
  .date {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 5px;
    .date_time {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: $websiteViolet;
      border-right: 1px solid #edecef;
      padding: 0 5px;
      min-width: 45px;
      &:last-child {
        border-right: 0;
      }
      strong {
        font-weight: 900;
        font-size: 20px;
      }
      span {
        font-size: 8px;
        text-transform: uppercase;
      }
    }
  }
  .message {
    font-weight: 900;
    font-size: 14px;
    color: $websiteViolet;
  }
  .bottom {
    text-transform: uppercase;
    font-size: 12px;
    margin-top: 5px;
  }
}
</style>