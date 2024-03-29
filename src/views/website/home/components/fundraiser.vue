<template>
  <div class="fundraiser">
    <div class="image_blok" :style="`background-image: url(${item.image})`">
      <div class="bottom">
        <span class="with_icon">{{ orgCount }}</span>
        <span class="title">{{ item.organization | kitcut(25) }}</span>
        <div class="hidden">
          <div class="btn_overlay" v-if="item.headline">
            <h4>{{ item.headline | kitcut(80)}}</h4>
          </div>
        </div>
        <donationProgress
          :raised="item.amount"
          :goal="item.goal"
          goalText="GOAL - "
          :percent="true"
          :height="8"
          color="#fff"
          class="revers text-bold progress"
        />
      </div>
    </div>
  </div>
</template>
<script>

import IconBase from '@/components/IconBase';
import iconOrganization from '@/components/icons/iconPerson';
import iconOrganizations from '@/components/icons/iconPersons';
import donationProgress from '@/components/donationProgress';

export default {
  props: { item: { type: Object } },
  components: {
    IconBase,
    iconOrganization,
    iconOrganizations,
    donationProgress,
  },
  data() {
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
      orgCount: '',
    }
  },
}
</script>
<style lang="scss" scoped>
.fundraiser {
  display: block;
  position: relative;
  z-index: 1;
  cursor: pointer;
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
      background-color: rgba($color: #317d9b, $alpha: 0.85);
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
      .hidden {
        h4 {
          font-family: Inter;
          font-style: normal;
          font-weight: bold;
          font-size: 1.8rem;
        }
      }
    }
    .title {
      font-family: Inter;
      font-style: normal;
      font-weight: 600;
      font-size: 1.4rem;
      margin-bottom: 10px;
    }
    .progress {
      color: #fff;
      margin-bottom: 1rem;
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
</style>
