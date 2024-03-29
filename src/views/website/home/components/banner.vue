<template>
  <div
    class="banner"
    :style="`background-image: linear-gradient(to bottom, rgba(43,35, 52,0.4), rgba(43,35, 52,0.4)), url(${sweepstake.details.image})`"
  >
    <div class="container">
      <div class="social">
        <ul class="items">
          <li>
            <a class="link_icon" @click="copy">
              <icon-base 
                width="20"
                height="20"
                icon-name="share"
                icon-color="#fff"
              >
                <iconShareCopy></iconShareCopy>
              </icon-base>
            </a>
          </li>
          <li 
            v-for="(item, key) in optionsSocial"
            :key="`li-${key}`"
          >
            <ShareNetwork
              class="link_icon"
              :network="item.network"
              :url="item.url"
              :title="sweepstake.details.headline"
              :description="sweepstake.details.subtitle"
              @close="changeNetwork"
            >
              <icon-base width="20" height="20" :icon-name="item.network">
                <component v-bind:is="item.iconType"></component>
              </icon-base>
            </ShareNetwork>
          </li>
        </ul>
      </div>
      <div class="left">
        <h1>{{ sweepstake.details.headline }}</h1>
        <p class="p_bottom">{{ sweepstake.details.subtitle }}</p>
      </div>
      <div class="right">
        <div class="time_block">
          <div v-if="!starts">
            <div class="date">
              <span class="message">Coming Soon</span>
            </div>
            <router-link class="btn btn-large btn-yellow" :to="`/sweepstakes/${sweepstake.slug}`"
              >View</router-link
            >
          </div>
          <div v-else-if="time.active">
            <h6>time remaining</h6>
            <div class="date">
              <div class="date_time">
                <strong>{{ restOfTime.days }}</strong>
                <span>{{ `${restOfTime.days > 1 ? ' Days' : ' Day'} ` }}</span>
              </div>
              <div class="date_time">
                <strong>{{ restOfTime.hours }}</strong>
                <span>{{ `${restOfTime.hours > 1 ? ' Hours' : ' Hour'} ` }}</span>
              </div>
              <div class="date_time">
                <strong>{{ restOfTime.minutes }}</strong>
                <span>{{ `${restOfTime.minutes > 1 ? ' Minutes' : ' Minute'} ` }}</span>
              </div>
              <div class="date_time">
                <strong>{{ restOfTime.seconds }}</strong>
                <span>{{ `${restOfTime.seconds > 1 ? ' Seconds' : ' Second'} ` }}</span>
              </div>
            </div>
            <router-link class="btn btn-large btn-yellow" :to="`/sweepstakes/${sweepstake.slug}`"
              >enter to win</router-link
            >
          </div>
          <div v-else-if="finished">
            <span class="message">Sweepstake has ended</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import IconBase from '@/components/IconBase';
import iconFacebook from '@/components/icons/iconFacebook';
import iconYoutube from '@/components/icons/iconYoutube';
import iconInstagram from '@/components/icons/iconInstagram';
import iconTwitter from '@/components/icons/iconTwitter';
import iconShareCopy from '@/components/icons/iconShareCopy';
import { mapActions, mapGetters } from 'vuex';
import { shareControl } from '@/helpers/social-media-share';

export default {
  props: {
    time: {
      type: Object,
      default() {
        return {
          startDate: this.moment().format('YYYY.MM.DD HH:mm:ss'),
          endDate: this.moment().format('YYYY.MM.DD HH:mm:ss'),
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
        }
      },
    },
    restOfTime: {
      type: Object,
      default() {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
        }
      },
    },
    starts: { type: Boolean, default: true },
    finished: { type: Boolean, default: false },
    idSweepstake: Number,
  },
  components: {
    IconBase,
    iconFacebook,
    iconYoutube,
    iconInstagram,
    iconTwitter,
    iconShareCopy,
  },
  data() {
    return {
      shared: false,
      optionsSocial: [
        {
          iconType: 'iconFacebook',
          network: 'facebook',
          url: `${window.location}`,
        },
        {
          iconType: 'iconTwitter',
          network: 'twitter',
          url: `${window.location}`,
        },
      ],
    }
  },
  computed: {
    ...mapGetters('publicweb/home', {
      sweepstake: 'getMainSweepstake',
    }),
  },
  methods: {
    ...mapActions('publicweb/sweepstake', ['apiGetNumberShared']),

    copy() {
      const temp = document.createElement('input');
      temp.value = `${window.location}sweepstakes/${this.sweepstake.slug}`;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand('copy');
      document.body.removeChild(temp);
      this.changeNetwork();
      let instance = this.$toast.success('Copied!', {
        position: 'top',
        duration: 3000,
        queue: true,
      })
    },
    changeNetwork() {
      !this.shared ? this.apiGetNumberShared(this.sweepstake.id) : false;
      this.shared = true;
    },
  },
}
</script>
<style lang="scss" scoped>
.banner {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  width: calc(100% - 40px);
  margin: 0 auto 120px;
  min-height: 650px;
  background-color: #e9e2f1;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  padding-top: 3rem;
  padding-bottom: 4rem;
  border-radius: 20px;
  @media only screen and (max-width: 1299px) {
    width: calc(100% - 20px);
    min-height: 550px;
  }
  @media only screen and (max-width: 998px) {
    width: 100%;
    border-radius: 0;
    min-height: 450px;
  }
  @media only screen and (max-width: 768px) {
    padding: 2rem 0 3rem;
    margin: 0 auto 80px;
  }
  .container {
    position: relative;
  }
  .social {
    position: absolute;
    right: 20px;
    z-index: 2;
    ul.items {
      display: flex;
    }
    li {
      width: 5.3rem;
      height: 5.3rem;
      margin: 0 7.5px;
      cursor: pointer;
      input {
        position: absolute;
        opacity: 0;
        visibility: hidden;
        z-index: -1;
      }
      &:first-child {
        margin-left: 0;
      }
      &:last-child {
        margin-right: 0;
      }
    }
    .link_icon {
      display: block;
      width: 100%;
      height: 100%;
      opacity: 0.8;
      transition: opacity linear 0.3s;
      &:hover {
        opacity: 1;
      }
    }
  }
  & > div {
    display: flex;
    justify-content: space-between;
    flex: 1;
    @media (max-width: 768px) {
      flex-direction: column;
    }
    .left {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      padding: 65px 0;
      @media only screen and (max-width: 768px) {
        padding: 70px 0 50px;
      }
      .p_top {
        font-weight: 600;
        font-size: 14px;
        color: $white;
        margin-bottom: 2rem;
      }
      h1 {
        color: $white;
        margin-bottom: 25px;
      }
      .p_bottom {
        font-size: 18px;
        color: $white;
        max-width: 75%;
        @media only screen and (max-width: 768px) {
          max-width: 100%;
        }
      }
    }
    .right {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      flex: 0.7;
      align-items: flex-end;
      @media only screen and (max-width: 768px) {
        align-items: center;
      }
    }
  }
  .time_block {
    position: absolute;
    bottom: -8.5rem;
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
    justify-content: center;
    background: #fff;
    padding: 35px 30px 32px;
    border: 1px solid $violet;
    border-radius: 20px;
    box-shadow: 0px 5px 22px 3px rgba(0, 0, 0, 0.17);
    @media only screen and (max-width: 1299px) {
      padding: 30px;
    }
    @media only screen and (max-width: 768px) {
      position: initial;
      padding: 20px 15px;
    }
    @media only screen and (max-width: 349px) {
      padding: 20px 10px;
    }
    & > div {
      h6 {
        font-size: 14px;
        color: $websiteViolet;
        font-weight: 700;
        text-transform: uppercase;
        margin-bottom: 8px;
      }
    }
    .date {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 32px;
      @media only screen and (max-width: 768px) {
        margin-bottom: 20px;
      }
      .date_time {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: $websiteViolet;
        padding: 0 7px;
        min-width: 105px;
        @media only screen and (max-width: 1299px) {
          min-width: 100px;
        }
        @media only screen and (max-width: 998px) {
          min-width: 90px;
        }
        @media only screen and (max-width: 768px) {
          min-width: 75px;
        }
        @media only screen and (max-width: 349px) {
          min-width: 62px;
        }
        &:after {
          position: absolute;
          top: 50%;
          right: 0;
          transform: translateY(-50%);
          content: '';
          height: 60%;
          width: 1px;
          background-color: #edecef;
        }
        &:last-child:after {
          width: 0;
        }
        strong {
          font-weight: 900;
          color: $websiteViolet;
          font-size: 50px;
          @media only screen and (max-width: 1299px) {
            font-size: 45px;
          }
          @media only screen and (max-width: 998px) {
            font-size: 40px;
          }
          @media only screen and (max-width: 768px) {
            font-size: 30px;
          }
          @media only screen and (max-width: 349px) {
            font-size: 20px;
          }
        }
        span {
          font-weight: 500;
          font-size: 12px;
          text-transform: uppercase;
          @media only screen and (max-width: 349px) {
            font-size: 10px;
          }
        }
      }
    }
    .btn {
      font-weight: 700;
      text-transform: uppercase;
    }
    .message {
      font-weight: 900;
      font-size: 26px;
      color: $websiteViolet;
      @media only screen and (max-width: 349px) {
        font-size: 22px;
      }
    }
  }
}
</style>