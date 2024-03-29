<template>
  <div class="functional_block" ref="sweepDonate">
    <h3 :style="`text-align: ${positionTitle}`">{{ title }}</h3>
    <p class="text">{{ text }}</p>
    <div class="top" v-if="isTopBlock">
      <div class="right">
        <icon-base 
          class="icon"
          width="18"
          height="18"
          icon-name="share"
        >
          <iconShare />
        </icon-base>
        <span>{{ `${sharedCount || 0} shares` }}</span>
      </div>
    </div>
    <ul class="content">
      <li v-for="(item, key) in items" :key="`donate-${key}`">
        <donate-select
          :colorIcon="item.colorIcon"
          :text="`Earn ${item.entries} entries`"
          :price="item.price"
          :focus="+priceSelect.price === item.price"
          :showIcon="showIcon"
          :disabled="!(time.active ? onlineEndSeconds > 0 : false)"
          @input="select($event, key)"
        />
      </li>
    </ul>
    <buttonInput
      class="button_input"
      :disabledBtn="false"
      :banInput="(time.active ? onlineEndSeconds > 0 : false)"
      v-model="inputDonat"
      @send="sendData($event)"
    />

    <div class="footer_link">
      <span
        :class="time.active && onlineEndSeconds > 1 ? 'active' : ''"
        @click="
          time.active && onlineEndSeconds > 1 ? $emit('sendFreeDonate') : ''
        "
        >Or Enter Without Contributing</span
      >
    </div>
    <p class="button_text">
      {{ visibleTime }}
    </p>
  </div>
</template>
<script>

import IconBase from "@/components/IconBase";
import iconPerson from "@/components/icons/iconPersonСircularEmpty";
import iconShare from "@/components/icons/iconShare";
import donateSelect from "@/views/website/sweepstakes/components/donateSelect";
import buttonInput from "@/views/website/sweepstakes/components/buttonInput";
import { mapGetters, mapMutations } from "vuex";

export default {
  props: {
    title: { type: String, default: "Donate Now" },
    text: String,
    items: {
      type: Array,
      default: [{ text: "Earn 100 entries", colorIcon: "#6DB5D1", price: 10 }],
    },
    isTopBlock: { type: Boolean, default: false },
    showIcon: { type: Boolean, default: false },
    positionTitle: { type: String, default: "left" },
    donorsCount: { type: Number, default: 0 },
    restOfTime: {
      type: Object,
      default() {
        return { starts: false, days: 0, hours: 0, minutes: 0 };
      },
    },
    sharedCount: { type: Number, default: 0 },
    banInput: { type: Boolean, default: true },
    organizations: { type: Array, default: [] },
    loade: { type: Boolean, default: false },
    time: {
      type: Object,
      default() {
        return {
          startDate: this.moment().format("YYYY.MM.DD HH:mm:ss"),
          endDate: this.moment().format("YYYY.MM.DD HH:mm:ss"),
          active: false,
          startTime: {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
          },
          endTime: {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
          },
        };
      },
    },
  },
  components: {
    IconBase,
    iconPerson,
    iconShare,
    donateSelect,
    buttonInput,
  },
  data() {
    setInterval(() => {
      this.onlineEndSeconds = this.onlineEndSeconds - 1;
    }, 1000);
    return {
      priceSelect: { price: 0, entries: null },
      selectData: { price: 0, entries: null },
      onlineEndSeconds: 0,
      visibleTime: "",
      inputDonat: '',
    };
  },
  watch: {
    time(val) {
      this.onlineEndSeconds = this.time.endTime.seconds;
      this.showRestOfTime();
    },
  },
  computed: {
    isSelect() {
      return !!(this.restOfTime.days >= 0)
        && this.restOfTime.hours >= 0
        && this.restOfTime.minutes > 0
    },
  },
  methods: {
    showRestOfTime() {
      var time = this.time;
      const FORMAT = "YYYY.MM.DD HH:mm:ss";

      if (time.startTime.seconds > 0) {
        this.visibleTime = `Start Date: ${this.$moment(
          time.startDate,
          FORMAT
        ).format("MM/DD/YYYY, hh:mm a")}`;
      }

      if (time.endTime.seconds < 0) {
        this.visibleTime = "Sweepstake has ended"
      };

      if (time.active) {
        let str = "Time left:";
        let strDay = `${time.endTime.days} ${
            time.endTime.days > 1 ? "days" : "day"
          }`,
          strHour = `${time.endTime.hours} ${
            time.endTime.hours > 1 ? "hours" : "hour"
          }`,
          strMinute = `${time.endTime.minutes} ${
            time.endTime.minutes > 1 ? "minutes" : "minute"
          }`;
        if (time.endTime.days > 0 && time.endTime.hours > 0)
          this.visibleTime = `${str} ${strDay} | ${strHour} | ${strMinute}`;

        if (time.endTime.days > 0 && time.endTime.hours === 0)
          this.visibleTime = `${str} ${strDay}`;

        if (time.endTime.days === 0 && time.endTime.hours > 0)
          this.visibleTime = `${str} ${strHour} | ${strMinute}`;

        if (time.endTime.days === 0 && time.endTime.hours === 0)
          this.visibleTime = `${str} ${strMinute}`;
      }
    },
    select(value, index) {
      const candidate = {
        entries: this.items[index].entries,
        price: this.items[index].price,
      };
      this.priceSelect = candidate;
      this.setSelectData();
    },
    sendData(val) {
      
      const data = {
        price: this.inputDonat,
        entries: this.inputDonat * 10,
      }

      this.$emit("sendData", data);
    },
    setSelectData() {
      this.$emit("sendData", this.priceSelect);
      this.selectData = this.priceSelect;
    },
  },
};
</script>
<style lang="scss" scoped>
.functional_block {
  max-width: 360px;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  background: $white;
  overflow: hidden;
  @media only screen and (max-width: 998px) {
    max-width: 100%;
  }

  p.text {
    font-size: 18px;
    color: $websiteText;
    margin-bottom: 32px;
  }
  h3 {
    font-weight: 700;
    font-size: 40px;
    text-align: center;
    color: $websiteText;
    margin-bottom: 20px;
  }
  .top {
    display: flex;
    justify-content: space-between;
    padding: 0 2rem;
    flex-wrap: wrap;
    margin-bottom: 2.9rem;
    @media (max-width: 1000px) {
      padding: 0;
    }
    @media (max-width: 480px) {
      display: block;
      max-width: 200px;
      width: 100%;
      margin: 0 auto;
    }
    .left,
    .right {
      @media (max-width: 480px) {
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
    .left,
    .right,
    .right a {
      display: flex;
      justify-content: center;

      .icon {
        margin-right: 12px;
      }
      span {
        margin-top: 4px;
        white-space: nowrap;
        font-weight: 500;
        font-size: 1.4rem;
        line-height: 1.4rem;
      }
    }
  }
  .content {
    margin-bottom: 3.5rem;
    li {
      margin-bottom: 0.4rem;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  .button_input {
    box-shadow: 0px 24px 20px rgba(154, 131, 183, 0.05),
      0px 3px 2px rgba(154, 131, 183, 0.02),
      0px 8px 100px rgba(154, 131, 183, 0.1);
    margin-bottom: 3.3rem;
  }
  .button_text {
    font-weight: bold;
    font-size: 1.4rem;
    text-align: center;
    color: $websiteViolet;
    @media only screen and (max-width: 998px) {
      display: none;
    }
  }
  .footer_link {
    text-align: center;
    margin-bottom: 2.9rem;
    span {
      color: $websiteViolet;
      font-size: 1.8rem;
      line-height: 2.8rem;
      border-bottom: 1px solid $websiteViolet;
      opacity: 0.6;
      transition: opacity linear 0.3s;
      &.active {
        cursor: pointer;
        opacity: 1;
        transition: opacity linear 0.3s;
      }
    }
  }
}
</style>