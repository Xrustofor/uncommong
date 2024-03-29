<template>
  <div class="sweepstake" @click="$router.push({ path: `/sweepstakes/${item.slug}` })">
    <span class="sweepstake_image" :style="{ backgroundImage: `url(${item.image})` }"></span>
    <div class="sweepstake_content">
      <h3>{{ item.headline }}</h3>
      <h4>{{ item.organization }}</h4>
      <div class="footer">
        <div class="left">
          <p>{{ item.description }}</p>
          <span>{{ visibleTime }}</span>
        </div>
        <div class="right">
          <loaderButton class="btn btn-yellow btn-small" text="ENTER" textColor="#454545" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import loaderButton from '@/components/buttons/loaderButton';

export default {
  props: {
    item: {
      type: Object,
      default() {
        return {
          slug: '',
          image: '',
          headline: '',
          organization: '',
          description: '',
          amount: 0,
          startDate: '',
          endDate: '',
        }
      },
    },
  },
  data() {
    return {
      day: { title: '' },
      visibleTime: '',
    }
  },
  mounted() {
    this.setTime();
  },
  watch: {
    item() {
      this.setTime();
    },
  },
  components: {
    loaderButton,
  },
  methods: {
    async setTime() {
      let sweep = this.item;
      const FORMAT = 'YYYY-MM-DD HH:mm:ss';
      const currentDate = this.$moment().tz('America/New_York').format(FORMAT);

      const startDate = sweep.startDate
                        ? this.$moment(sweep.startDate, 'YYYY-MM-DD HH:mm:ss').format(FORMAT)
                        : currentDate;
      const endDate = sweep.endDate
                      ? this.$moment(sweep.endDate, 'YYYY-MM-DD HH:mm:ss').format(FORMAT)
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
        this.$moment(endDate, FORMAT).diff(this.$moment(currentDate, FORMAT), 'hour') * 60
      const endSecondsDiff = this.$moment(endDate, FORMAT).diff(
        this.$moment(currentDate, FORMAT),
        'seconds'
      );

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
      var time = time;
      const FORMAT = 'YYYY.MM.DD HH:mm:ss';

      if (time.startTime.seconds > 0) {
        if (time.startTime.days > 0) this.visibleTime = `Starting in ${time.startTime.days} days`;
        if (time.startTime.days == 0 && time.startTime.hours > 0)
          this.visibleTime = `Starting in ${time.startTime.hours} hours`;
        if (time.startTime.days == 0 && time.startTime.hours == 0)
          this.visibleTime = `Starting in ${time.startTime.minutes} mins`;
      }

      if (time.endTime.seconds < 0) {
        this.visibleTime = 'Sweepstake has ended'
      }

      if (time.active) {
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
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0px 4px 31px -3px rgba($color: $violet, $alpha: 0.14);
  background: #fff;
  cursor: pointer;
  height: 100%;
  &_image {
    display: block;
    width: 100%;
    height: 300px;
    background-size: cover;
    background-position: center;
  }
  &_content {
    padding: 17px 22px 19px;
    h3 {
      font-size: 20px;
      color: $text;
      font-weight: 900;
      margin-bottom: 10px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    h4 {
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
      color: $websiteText;
      margin-bottom: 10px;
      max-width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    p {
      font-size: 16px;
      line-height: 1.3;
      color: $websiteText;
      margin-bottom: 1rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }
}
</style>