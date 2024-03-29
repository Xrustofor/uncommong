<template>
  <div class="sweepstake">
    <div
      class="sweepstake_image"
      :class="{ small: !sweepstake.details.image }"
      :style="{
        backgroundImage: sweepstake.details.image
          ? 'url(' + sweepstake.details.image + ')'
          : 'url(' + require(`@/assets/img/logo-blue.svg`) + ')',
      }"
    ></div>
    <div class="sweepstake_text">
      <h3>{{ sweepstake.details.title }}</h3>
      <div class="sweepstake_text_content">
        <div>
          <h5>{{ sweepstake.details.focus.title }}</h5>
          <p>{{ visibleTime }}</p>
        </div>
        <router-link
          class="btn"
          :class="activeStatus ? 'btn-yellow' : 'btn-white'"
          :to="`/sweepstakes/${sweepstake.slug}`"
          >{{ activeStatus ? 'Enter' : 'View' }}</router-link
        >
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: { sweepstake: { type: Object } },
  data() {
    return {
      day: { title: '' },
      visibleTime: '',
      activeStatus: false,
    }
  },
  mounted() {
    this.setTime()
  },
  methods: {
    async setTime() {
      let sweep = {
        start_date: '',
        end_date: '',
      }
      sweep = this.sweepstake.details
      const FORMAT = 'YYYY-MM-DD HH:mm:ss';
      const currentDate = this.$moment().tz('America/New_York').format(FORMAT);

      const startDate = sweep.start_date
        ? this.$moment(sweep.start_date, 'YYYY-MM-DD HH:mm:ss').format(FORMAT)
        : currentDate;
      const endDate = sweep.end_date
        ? this.$moment(sweep.end_date, 'YYYY-MM-DD HH:mm:ss').format(FORMAT)
        : currentDate;

      const startDaysDiff = this.$moment(startDate, FORMAT).diff(
        this.$moment(currentDate, FORMAT),
        'days'
      )
      const starHoursDiff =
        this.$moment(startDate, FORMAT).diff(this.$moment(currentDate, FORMAT), 'hour') -
        startDaysDiff * 24;
      const starMinutesDiff =
        this.$moment(startDate, FORMAT).diff(this.$moment(currentDate, FORMAT), 'minutes') -
        startDaysDiff * 24;
      const starSecondsDiff = this.$moment(startDate, FORMAT).diff(
        this.$moment(currentDate, FORMAT),
        'seconds'
      );

      const endDaysDiff = this.$moment(endDate, FORMAT).diff(
        this.$moment(currentDate, FORMAT),
        'days'
      );
      const endHoursDiff =
        this.$moment(endDate, FORMAT).diff(this.$moment(currentDate, FORMAT), 'hour') -
        endDaysDiff * 24;
      const endMinutesDiff =
        this.$moment(endDate, FORMAT).diff(this.$moment(currentDate, FORMAT), 'minutes') -
        this.$moment(endDate, FORMAT).diff(this.$moment(currentDate, FORMAT), 'hour') * 60;
      const endSecondsDiff = this.$moment(endDate, FORMAT).diff(
        this.$moment(currentDate, FORMAT),
        'seconds'
      )

      const item = await {
        startDate,
        endDate,
        active: +starSecondsDiff < 0 && endSecondsDiff > 0,
        startTime: {
          days: startDaysDiff,
          hours: starHoursDiff,
          minutes: starMinutesDiff,
          seconds: starSecondsDiff,
        },
        endTime: {
          days: endDaysDiff,
          hours: endHoursDiff,
          minutes: endMinutesDiff,
          seconds: endSecondsDiff,
        },
      }
      this.setDate(item)
    },
    setDate(time) {

      const FORMAT = 'YYYY.MM.DD HH:mm:ss';

      if (time.startTime.seconds > 0) {
        this.visibleTime = `Starts ${this.$moment(time.startDate, 'YYYY-MM-DD HH:mm').format(
          'MMM DD'
        )}`;
      }

      if (time.endTime.seconds < 0){
        this.visibleTime = 'Complete'
      }

      if (time.active) {
        this.activeStatus = true
        let strDay = `${time.endTime.days} ${time.endTime.days > 1 ? 'days' : 'day'}`,
          strHour = `${time.endTime.hours} ${time.endTime.hours > 1 ? 'hours' : 'hour'}`,
          strMinute = `${time.endTime.minutes} ${time.endTime.minutes > 1 ? 'minutes' : 'minute'}`
        if (time.endTime.days > 0 && time.endTime.hours >= 0) {
          this.visibleTime = `${strDay}  left`;
        }

        if (time.endTime.days === 0 && time.endTime.hours > 0) {
          this.visibleTime = `${strHour}  left`;
        }

        if (time.endTime.days === 0 && time.endTime.hours === 0)
          this.visibleTime = `${strMinute}  left`;
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.sweepstake {
  display: flex;
  flex-direction: column;
  box-shadow: 0px 4px 31px -3px rgba(99, 81, 122, 0.14);
  transition: all 0.3s ease-in-out;
  border-radius: 20px;
  height: 100%;
  cursor: pointer;
  &:hover {
    box-shadow: 0px 0px 43px -4px rgba(99, 81, 122, 0.8);
  }
  &_image {
    width: 100%;
    height: 365px;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    border: 1px solid transparent;
    &.small {
      border-color: (rgba($color: $violet, $alpha: 0.2));
      background-color: (rgba($color: $violet, $alpha: 0.05));
      background-size: auto;
      @media only screen and (max-width: 599px) {
        background-size: 80%;
      }
    }
  }
  &_text {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px 20px;
    .btn {
      width: 100%;
      max-width: 125px;
      font-weight: 700;
      text-transform: uppercase;
    }
    &_content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      div {
        padding-right: 10px;
      }
      @media only screen and (max-width: 599px) {
        flex-direction: column;
        align-items: flex-start;
        .btn {
          max-width: 100%;
          margin-top: 15px;
        }
      }
    }
    h3 {
      font-size: 18px;
      color: $text;
      font-weight: 700;
      margin-bottom: 12px;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
    h5 {
      font-size: 14px;
      color: $text;
      font-weight: 600;
      margin-bottom: 3px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      line-height: 1.4;
    }
    p {
      font-size: 14px;
      color: $text;
    }
  }
}
</style>