<template>
  <div class="duration">
    <div 
      class="range"
      :style="{ width: `${duration}%` }"
    />
    <div 
      class="text"
      :class="{ flex_end: !showEndDate }"
    >
      <p>
        Start Date:
        {{ this.startDate | _moment("MM/DD/YY, hh:mm a", "YYYY-MM-DD HH:mm") }}
      </p>
      <p v-if="showEndDate">
        End Date:
        <span v-if="this.endDate">
          {{ this.endDate | _moment("MM/DD/YY, hh:mm a", "YYYY-MM-DD HH:mm") }}</span>
        <span v-else>None</span>
      </p>
    </div>
  </div>
</template>
<script>
import moment from "moment";
export default {
  props: {
    startDate: { type: String },
    endDate: { type: String, required: false },
    showEndDate: { type: Boolean, default: true },
    dataType: { type: String, default: "time" },
  },
  data() {
    return {
      duration: 0,
      timer: null,
    };
  },
  created() {
    switch (this.dataType) {
      case "time":
        this.timing();
        this.timer = setInterval(() => this.timing(), 1000 * 60);
        break;

      case "count":
        break;
    }
  },
  destroyed() {
    if (this.timer != null) {
      clearInterval(this.timer);
    }
  },
  methods: {
    timing() {
      const FORMAT = "MM.DD.YYYY HH:mm:ss";
      const today = this.$moment().tz("America/New_York").format(FORMAT);
      var end = this.endDate
          ? this.$moment(this.endDate, "YYYY-MM-DD HH:mm").format(FORMAT)
          : moment().format(FORMAT),
        start = this.startDate
          ? this.$moment(this.startDate, "YYYY-MM-DD HH:mm").format(FORMAT)
          : moment().format(FORMAT);

      var result;
      if (!this.endDate) {
        if (moment(today, FORMAT).diff(moment(start, FORMAT), "minuts") < 0) {
          result = 0;
        } else {
          result = 100;
        }
      } else {
        if (
          moment(today, FORMAT).diff(moment(start, FORMAT), "minuts") >= 0 &&
          moment(end, FORMAT).diff(moment(today, FORMAT), "minuts") >= 0
        ) {
          var minutesLeft = moment(end, FORMAT).diff(
              moment(today, FORMAT),
              "minuts"
            ),
            minutesTotal = moment(end, FORMAT).diff(
              moment(start, FORMAT),
              "minuts"
            );
          result = Math.floor(
            ((minutesTotal - minutesLeft) / minutesTotal) * 100
          );
        } else if (
          moment(today, FORMAT).diff(moment(start, FORMAT), "minuts") < 0
        ) {
          result = 0;
        } else if (
          moment(end, FORMAT).diff(moment(today, FORMAT), "minuts") < 0
        ) {
          result = 100;
        }
      }

      this.duration = result;
    },
  },
};
</script>
<style lang="scss" scoped>
.duration {
  position: relative;
  width: 100%;
  height: 10px;
  background: $violetBorder;
  border-radius: 10px;
  .range {
    position: absolute;
    height: 100%;
    background: $violet;
    border-radius: 10px;
    left: 0;
  }
  .text {
    width: calc(100% + 10px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    bottom: -8px;
    left: -5px;
    transform: translateY(100%);
    &.flex_end {
      justify-content: flex-end;
    }
    p {
      font-size: 10px;
      padding: 0 5px;
      color: $violet;
      &:last-of-type {
        text-align: right;
      }
    }
  }
}
</style>