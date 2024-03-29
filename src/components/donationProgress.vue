<template>
  <div class="donation-progress remains-none">
    <div class="donation-progress__header" :class="{ 'no-goal': goal == 0 && raised != 0 }">
      <span class="title" :style="{ color }">
        {{ raisedText }}
        <b>
          {{ percent ? Math.round(duration) + '%' : '$' + raised | commasNumbers }}
        </b>
      </span>
      <span v-if="goal" class="title" :style="{ color }">
        {{ goalText }}
        <b>
          $ {{goal | commasNumbers}}
        </b>
      </span
      >
    </div>
    <div
      class="donation-progress__progress"
      :style="{ height: `${height}px` }"
    >
      <div
        class="duration"
        :style="{
          width: `${Math.round(duration)}%`,
          height: `${height}px`
        }"
      />
    </div>
    <div
      v-if="startDate || endDate"
      class="donation-progress__date"
    >
      <p class="title">Start Date: <br />{{ dateFix(startDate) }}</p>
      <p class="title" v-if="endDate">
        End Date: <br />{{ endDate ? dateFix(endDate) : 'None' }}</p>
    </div>
  </div>
</template>

<script>
import {dateTransform} from "@/helpers/script";

export default {
  props: {
    raisedText: { type: String, default: '' },
    raised: { type: [String, Number, Object], required: true },
    goal: { type: [String, Number], required: false },
    goalText: { type: String, default: '' },
    percent: { type: Boolean, default: false },
    startDate: {type: String, default: ''},
    endDate: {type: String, default: ''},
    height: { type: [String, Number], default: 16 },
    color: String,
  },
  computed: {
    duration() {
      let percent = 0
      if (this.raised) {
        if (this.goal) {
          percent = ((this.raised / this.goal) * 100).toFixed(2);
          percent = percent > 100 ? 100 : percent;
        } else {
          percent = 100;
        }
      }
      return percent;
    },
  },
  methods: {
    dateTransform,
    dateFix(date) {

      if (!date) {
        return 'NONE';
      }

      return this.$moment(date).format('YYYY/MM/DD');
    },
  },
}
</script>

<style lang="scss" scoped>
.donation-progress {
  display: flex;
  flex-direction: column;
  &__header {
    display: flex;
    justify-content: space-between;
    &.no-goal {
      justify-content: flex-end;
    }
    .title {
      font-weight: 500;
      font-size: 14px;
      line-height: 17px;
      text-transform: uppercase;
    }
  }

  &__progress {
    margin-top: 17px;
    border-radius: 10px;
    background-color: $white;
    border: 1px solid transparent;
    position: relative;
    overflow: hidden;

    .duration {
      position: absolute;
      top: -1px;
      left: -1px;
      height: 100%;
      background-color: $yellow;
      border-radius: 10px;
    }
  }

  &__date {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;

    .title {
      width: 130px;
      text-align: center;
      color: $black;
    }
  }
}
.revers {
  flex-direction: column-reverse;
  .donation-progress__progress {
    margin: 0 0 10px;
  }
}
.remains-none {
  .donation-progress__progress {
    background-color: #f6eeff;
  }
  .donation-progress__donate {
    display: none;
  }
}
.violet-content {
  .donation-progress__progress {
    background-color: transparent;
    border-color: rgba($color: $violet, $alpha: 0.5);
    .duration {
      background-color: $violet;
    }
  }
}
.text-bold {
  .donation-progress__header .title {
    font-weight: 700;
    color: $websiteText;
    b {
      font-weight: 700;
    }
  }
}

.mode-violet {
  .donation-progress__progress {
    background-color: $violetBorder;
  }
}
</style>
