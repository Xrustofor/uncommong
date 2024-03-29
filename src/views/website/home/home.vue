<template>
  <div>
    <Banner 
      :time="time"
      :restOfTime="restOfTime"
      :starts="starts"
      :finished="finished"
    />
    <div class="container">
      <div class="about_new">
        <h2>Your place to drive <br />real change.</h2>
        <h6>
          We believe your impact comes in many shapes and sizes, your stories have power, and
          together, we can inspire remarkable social impact.
        </h6>
      </div>
    </div>
    <div class="horizontal_animation_switch" v-if="Object.keys(horizontalNavOptions).length != 0">
      <div class="container">
        <ul class="nav_radio_buttons" v-if="horizontalNavOptions">
          <li
            class="radio"
            :style="`left: ${item.position * 175}px`"
            :class="item.active ? 'active' : ''"
            v-for="(item, key) in horizontalNavOptions"
            :key="`radio_${key}`"
          >
            <input
              type="radio"
              :id="item.id"
              name="contact"
              :value="item.id"
              :checked="item.active"
              v-model="horizontalNavSelect"
            />
            <label :for="item.id">{{ item.name }}</label>
          </li>
        </ul>
      </div>
      <div class="switch_container" ref="switchContainer">
        <Fundraisers
          class="block"
          v-if="fundraisers.length > 0 && !loader"
          :items="fundraisers"
          v-scroll="handleScroll"
          :class="selectNav === 'fundraisers' ? 'active' : 'hidden'"
          :style="{ left: `${+horizontalNavOptions.fundraisers.position * widthWindow}px` }"
        />
        <Sweepstakes
          class="block"
          v-if="sweepstakes.length > 0 && !loader"
          :items="sweepstakes"
          v-scroll="handleScroll"
          :class="selectNav === 'sweepstakes' ? 'active' : 'hidden'"
          :style="{ left: `${+horizontalNavOptions.sweepstakes.position * widthWindow}px` }"
        ></Sweepstakes>
      </div>
    </div>
    <Organizations
      v-scroll="handleScroll"
      class="circle_scroll"
      v-if="organizations.length > 0 && !loader"
      :items="organizations"
    ></Organizations>
    <div class="about">
      <div class="container">
        <h2 class="title">About UncommonGood</h2>
        <div>
          <div
            class="image"
            :style="{
              backgroundImage: 'url(' + require(`@/assets/img/logo-blue.svg`) + ')',
            }"
          ></div>
          <div>
            <p>
              UncommonGood’s engagement platform cultivates a community oriented towards progress,
              providing access to fundraising tools, value-driven sweepstakes, volunteer
              opportunities, branding and storytelling support, and so much more.
            </p>
            <p>
              We dismantle the complexity and break down the barriers of nonprofit marketing and
              fundraising, allowing organizations to be more efficient, strategic, and nimble to
              achieve their goals.
            </p>
            <p>
              Through it all, we never lose sight of the power of storytelling and personal
              connection to drive change. At UncommonGood, we’ll harness your story’s power and
              build a better world together.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import { mapActions, mapGetters } from 'vuex';
import Banner from './components/banner';
import Sweepstakes from './components/sweepstakes';
import Fundraisers from '@/views/website/home/components/fundraisers';
import Organizations from './components/organizations.vue';
import { handleScroll } from '@/mixins/handleScroll';

export default {
  mixins: [handleScroll],
  components: {
    Banner,
    Sweepstakes,
    Fundraisers,
    Organizations,
  },
  data() {
    return {
      url: `${window.location}`,
      finished: false,
      starts: true,
      restOfTime: { days: 0, hours: 0, minutes: 0 },
      timingg: null,
      horizontalNavOptions: {},
      horizontalNavSelect: 1,
      selectNav: '',
      widthWindow: window.screen.width,
    }
  },

  async mounted() {

    await this.getMainSweepstake();
    const { headline, social_image, subtitle } = this.mainSweepstake.details;
    const title = headline || '';
    const description = subtitle || '';
    const image = social_image || '';

  },

  async created() {
    this.$store.dispatch('setLoader', true);
    await this.getApiOrganizations();
    await this.getApiSweepstakes();
    await this.apiGetFundraisers();

    let position = 0
    if (this.sweepstakes.length > 0) {
      this.horizontalNavOptions.sweepstakes = { id: 1, name: 'Sweepstakes', position };
      position++;
    }
    if (this.fundraisers.length > 0) {
      this.horizontalNavOptions.fundraisers = { id: 2, name: 'Fundraisers', position };
    }

    let horizontalNavOptionsActive = true;
    for (let key in this.horizontalNavOptions) {
      this.horizontalNavOptions[key].active = horizontalNavOptionsActive;
      horizontalNavOptionsActive = false;
    }

    this.timing()
    this.timingg = setInterval(() => this.timing(), 1000);
    this.$store.dispatch('setLoader', false);

    let items = JSON.parse(JSON.stringify(this.horizontalNavOptions));
    for (let key in items) {
      if (items[key].active) this.selectNav = key;
    }
  },
  watch: {
    horizontalNavSelect(id) {
      let items = JSON.parse(JSON.stringify(this.horizontalNavOptions));
      let count = 1;
      for (let key in items) {
        if (items[key].id === id) {
          items[key].active = true;
          items[key].position = 0;
          this.selectNav = key;
        } else {
          items[key].position = count;
          items[key].active = false;
          ++count;
        }
      }
      count = 1;
      this.horizontalNavOptions = items;
    },
  },
  destroyed() {
    clearInterval(this.timingg)
  },
  computed: {
    ...mapGetters({
      loader: 'getWebsiteLoader',
    }),
    ...mapGetters('publicweb/home', {
      organizations: 'getOrganizations',
      sweepstakes: 'getSweepstakes',
      mainIdSweepstake: 'getMainIdSweepstake',
      mainSweepstake: 'getMainSweepstake',
      time: 'getTime',
      fundraisers: 'getFundraisersData',
    }),
  },
  methods: {
    ...mapActions('publicweb/home', [
      'getApiOrganizations',
      'getApiSweepstakes',
      'getMainSweepstake',
      'apiGetFundraisers',
    ]),
    timing() {
      var time = this.time
      const FORMAT = 'YYYY-MM-DD HH:mm:ss';
      const currentDate = this.$moment().tz('America/New_York').format(FORMAT);

      if (time.startTime.seconds > 0) {
        this.starts = false;
        return
      }

      if (time.endTime.seconds < 0) {
        this.finished = true;
        return
      }
      if (time.active) {
        const viewTime = {
          days: time.endTime.days,
          hours:
            +this.$moment(time.endDate, FORMAT).diff(this.$moment(currentDate, FORMAT), 'hour') -
            +this.$moment(time.endDate, FORMAT).diff(this.$moment(currentDate, FORMAT), 'days') *
              24,
          minutes:
            +this.$moment(time.endDate, FORMAT).diff(this.$moment(currentDate, FORMAT), 'minutes') -
            +this.$moment(time.endDate, FORMAT).diff(this.$moment(currentDate, FORMAT), 'hour') *
              60,
          seconds:
            +this.$moment(time.endDate, FORMAT).diff(this.$moment(currentDate, FORMAT), 'seconds') -
            +this.$moment(time.endDate, FORMAT).diff(this.$moment(currentDate, FORMAT), 'minutes') *
              60,
        }
        this.restOfTime = viewTime;
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.about_new {
  margin-bottom: 65px;
  max-width: 700px;
  h2 {
    color: $websiteText;
    font-weight: 900;
    margin-bottom: 25px;
    span {
      color: #317d9b;
    }
  }
  h3 {
    color: $websiteText;
    margin-bottom: 25px;
  }
  h6 {
    font-weight: 500;
    color: $websiteText;
    line-height: 1.4;
  }
}
.horizontal_animation_switch {
  height: 910px;
  @media only screen and (max-width: 768px) {
    height: 850px;
  }
  .nav_radio_buttons {
    position: relative;
    padding-left: 170px;
    height: 30px;
    display: flex;
    align-items: center;
    margin-bottom: 100px;
    input[type='radio'] {
      display: none;
    }
    .radio {
      height: 28px;
      background: #fff;
      backdrop-filter: blur(8px);
      transition: all linear 0.5s;
      position: absolute;
      z-index: 1;
      top: 0;
      cursor: pointer;
      label {
        font-family: Inter;
        font-style: normal;
        font-weight: bold;
        font-size: 1.6rem;
        margin: 5px 0;
        color: $websiteText;
      }
      &::after {
        position: absolute;
        left: 0;
        top: 100%;
        content: '';
        height: 4px;
        overflow: hidden;
        opacity: 0;
        background: #317d9b;
        width: 6rem;
        transition: all linear 0.5s;
      }
    }
    .radio.active {
      transition: all linear 0.5s;
      background: rgba(255, 255, 255, 1);
      z-index: 2;
      label {
        margin: 0;
        font-weight: 900;
        font-size: 2.4rem;
      }
      &::after {
        left: 0;
        top: 110%;
        content: '';
        opacity: 1;
        transition: all linear 0.5s;
      }
    }
  }
  .switch_container {
    position: relative;
    transition: linear all 1s;
  }
  .block {
    position: absolute;
    z-index: 1;
    width: 100vw;
    top: 0;
    transition: linear all 1s;
    @media only screen and (max-width: 768px) {
      transition: linear all 0.5s;
    }
  }

  .block {
    &.active {
      z-index: 2;
      opacity: 1;
    }
    &.hidden {
      opacity: 0;
      z-index: 1;
    }
  }
}
.about {
  padding: 34px 0 44px;
  background-color: #f2eef9;
  .container > div {
    display: flex;
    justify-content: space-between;

    @media only screen and (max-width: 699px) {
      flex-wrap: wrap;
    }
    .image {
      width: 278px;
      min-width: 278px;
      height: 229px;
      border-radius: 20px;
      background-position: center;
      background-repeat: no-repeat;
      background-size: auto;
      margin-right: 53px;
      margin-bottom: 30px;
      @media only screen and (max-width: 768px) {
        min-width: 315px;
        margin-right: 30px;
      }
      @media only screen and (max-width: 499px) {
        width: 100%;
        min-width: 0;
        margin-right: 0;
      }
    }
    p {
      font-size: 18px;
      line-height: 1.5;
      color: $websiteViolet;
      margin-bottom: 25px;
      @media only screen and (max-width: 998px) {
        font-size: 16px;
      }
      &:last-of-type {
        margin-bottom: 0;
      }
    }
  }
}

@keyframes fade {
  0% {
    opacity: 0;
    transition: opacity linear 1s;
  }
  100% {
    opacity: 1;
    transition: opacity linear 1s;
  }
}
</style>
