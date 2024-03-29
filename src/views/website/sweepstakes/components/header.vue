<template>
  <div
    class="banner"
    :style="`background-image: linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${data.image})`"
  >
    <div class="container">
      <div class="social">
        <ul class="items">
          <li>
            <a class="link_icon" @click="copy">
              <icon-base width="20" height="20" icon-name="share" icon-color="#fff">
                <iconShareCopy></iconShareCopy>
              </icon-base>
            </a>
          </li>
          <li v-for="(item, key) in optionsSocial" :key="`li-${key}`">
            <ShareNetwork
              class="link_icon"
              :network="item.network"
              :url="item.url"
              :title="data.headline"
              :description="data.subtitle"
              hashtags="#test"
              @close="changeNetwork"
            >
              <icon-base 
                width="20"
                height="20"
                :icon-name="item.network"
              >
                <component v-bind:is="item.iconType"></component>
              </icon-base>
            </ShareNetwork>
          </li>
        </ul>
      </div>
      <div class="left">
        <h1>{{ data.headline }}</h1>
        <p class="p_bottom">{{ data.subtitle }}</p>
      </div>
      <div class="right">
        <div class="donate_block">
          <h3>{{ data.widgetText }}</h3>
          <div class="donate_row drop">
            <p>
              <span class="icon">
                <icon-base
                  class="icon"
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  iconName="Donate to Enter"
                  icon-color="#71B078"
                >
                  <icon-drop />
                </icon-base> </span
              >{{ data.widgetFirstTag }}
            </p>
            <p>
              <span class="icon">
                <icon-base
                  class="icon"
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  iconName="Donate to Enter"
                  icon-color="#D3584B"
                >
                  <icon-drop />
                </icon-base>
              </span>
              {{ data.widgetSecondTag }}
            </p>
          </div>
          <div class="donate_row" v-if="time ? time.startTime.seconds > 0 : false">
            <div class="time_block center">
              <h5>
                <span>Start date:</span>
                {{ time.startDate | _moment('MM/DD/YYYY', 'YYYY.MM.DD HH:mm') }}
              </h5>
            </div>
            <div class="time_block">
              <span>Winner Announcement</span>
              <h4>
                <span>~ </span>{{ time.endDate | _add('DD', 'YYYY.MM.DD HH:mm', 14, 'days') }}
              </h4>
              <p>
                {{ time.endDate | _add('MMMM', 'YYYY.MM.DD HH:mm', 14, 'days') }}
              </p>
            </div>
          </div>
          <div class="donate_row" v-else-if="time ? time.endTime.seconds < 0 : false">
            <div class="time_block center">
              <h5>Sweepstake has ended</h5>
            </div>
            <div class="time_block">
              <span>Winner Announcement</span>
              <h4>
                <span>~ </span>{{ time.endDate | _add('DD', 'YYYY.MM.DD HH:mm', 14, 'days') }}
              </h4>
              <p>
                {{ time.endDate | _add('MMMM', 'YYYY.MM.DD HH:mm', 14, 'days') }}
              </p>
            </div>
          </div>
          <div class="donate_row" v-else>
            <div class="time_block">
              <span>End date</span>
              <h4>{{ time.endDate | _moment('DD', 'YYYY.MM.DD HH:mm') }}</h4>
              <p>{{ time.endDate | _moment('MMMM', 'YYYY.MM.DD HH:mm') }}</p>
            </div>
            <div class="time_block">
              <span>Winner Announcement</span>
              <h4>
                <span>~ </span>{{ time.endDate | _add('DD', 'YYYY.MM.DD HH:mm', 14, 'days') }}
              </h4>
              <p>
                {{ time.endDate | _add('MMMM', 'YYYY.MM.DD HH:mm', 14, 'days') }}
              </p>
            </div>
          </div>
          <a v-scroll-to="'.footer_section'" class="btn btn-yellow btn-uppercase btn-large"
            >enter now</a
          >
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

import iconDrop from '@/components/icons/iconDrop';

import { mapActions, mapGetters } from 'vuex';

export default {
  props: {
    data: { type: Object },
    time: {
      type: Object,
      default: {
        startDate: '',
        endDate: '',
        startTime: {
          days: '',
          hours: '',
          minutes: '',
          seconds: { type: '', default: 0 },
        },
        endTime: {
          days: String,
          hours: String,
          minutes: String,
          seconds: String,
        },
      },
    },
  },
  components: {
    IconBase,
    iconFacebook,
    iconYoutube,
    iconInstagram,
    iconTwitter,
    iconShareCopy,
    iconDrop,
  },
  data() {
    return {
      shared: false,
      url: `${window.location}`,
      selectDonate: '',
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
      winnerAnnouncement: {
        day: '0',
        month: '0',
      },
    }
  },
  computed: {
    ...mapGetters('publicweb/sweepstake', {
      sharedCount: 'getSharedCount',
    }),
  },
  methods: {
    ...mapActions('publicweb/sweepstake', ['apiGetNumberShared']),
    sendData(val) {
      this.$emit('send', val);
    },
    copy() {
      const temp = document.createElement('input');
      temp.value = `${window.location}`;
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
    changeNetwork(val) {
      !this.shared ? this.apiGetNumberShared() : false;
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
  margin: 0 auto 0;
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
    min-height: 450px;
  }
  @media only screen and (max-width: 998px) {
    width: 100%;
    border-radius: 0;
    min-height: 360px;
    margin-bottom: 300px;
  }
  @media only screen and (max-width: 768px) {
    padding-bottom: 0;
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
    @media only screen and (max-width: 998px) {
      flex-direction: column;
    }
    .left {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      padding: 65px 0;
      padding-right: 24px;
      @media only screen and (max-width: 998px) {
        max-width: 600px;
        padding: 120px 0 50px;
      }
      .p_top {
        font-weight: 600;
        font-size: 14px;
        color: $white;
        margin-bottom: 2rem;
      }
      h1 {
        color: $white;
        margin-bottom: 15px;
        @media only screen and (max-width: 998px) {
          margin-bottom: 20px;
        }
      }
      .p_bottom {
        font-size: 20px;
        color: $white;
        font-weight: 600;
        max-width: 86%;
        @media only screen and (max-width: 998px) {
          max-width: 100%;
          font-size: 18px;
        }
      }
    }
    .right {
      padding-top: 80px;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      flex: 0.7;
      align-items: flex-end;
      @media only screen and (max-width: 998px) {
        align-items: center;
        padding-top: 0;
      }
    }
  }
}

.donate_block {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: -10vw;
  width: 100%;
  max-width: 480px;
  background: #ffffff;
  box-shadow: 0px 24px 20px rgba(154, 131, 183, 0.05), 0px 3px 2px rgba(154, 131, 183, 0.02),
    0px 8px 100px rgba(154, 131, 183, 0.1);
  border-radius: 10px;
  padding: 40px 20px 35px;
  z-index: 2;
  @media only screen and (max-width: 998px) {
    padding: 50px 20px 0;
    margin-top: 40px;
    margin-bottom: -20rem;
    .btn {
      position: absolute;
      top: 0;
    }
  }
  @media only screen and (max-width: 998px) {
    padding: 50px 15px 0;
  }
  p,
  h3 {
    color: $websiteViolet;
    margin-bottom: 15px;
  }
  h3 {
    max-width: 260px;
    margin: 0 auto 15px;
    text-align: center;
    font-size: 30px;
    font-weight: 900;
  }
  .donate_row {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 35px;
    &.drop {
      justify-content: center;
      p {
        display: flex;
        align-items: center;
        font-size: 18px;
        line-height: 1.55;
        padding: 0 15px;
        margin-bottom: 0;
        .icon {
          display: flex;
          align-items: center;
        }
        @media only screen and (max-width: 768px) {
          padding: 0 5px 0 0;
          font-size: 16px;
        }
        @media only screen and (max-width: 499px) {
          font-size: 14px;
        }
      }
    }
  }
  .time_block {
    width: calc((100% - 20px) / 2);
    background-color: #fff;
    border: 0.5px solid #9a83b7;
    box-shadow: 0px 24px 20px rgba(154, 131, 183, 0.05), 0px 3px 2px rgba(154, 131, 183, 0.02),
      0px 8px 100px rgba(154, 131, 183, 0.1);
    border-radius: 10px;
    padding: 15px 10px;
    @media only screen and (max-width: 1299px) {
      padding: 15px;
    }
    @media only screen and (max-width: 768px) {
      padding: 10px 15px;
    }
    &.center {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    h5 {
      font-weight: 700;
      font-size: 20px;
      span {
        text-transform: capitalize;
      }
    }
    h5,
    h4,
    p,
    span {
      display: block;
      color: $websiteViolet;
      text-align: center;
    }
    span {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      text-transform: uppercase;
      font-weight: 700;
      margin-bottom: 10px;
      @media only screen and (max-width: 1299px) {
        font-size: 13px;
        min-height: 36px;
        margin-bottom: 2px;
      }
      @media only screen and (max-width: 499px) {
        font-size: 11px;
      }
    }
    h4 {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 50px;
      font-weight: 900;
      span {
        display: inline-block;
        font-size: 18px;
        font-weight: 700;
        margin-bottom: 0;
        margin-right: 3px;
      }
    }
    p {
      font-size: 12px;
      text-transform: uppercase;
      font-weight: 500;
      margin-bottom: 10px;
    }
  }
}
</style>