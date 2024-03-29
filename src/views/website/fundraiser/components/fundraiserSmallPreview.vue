<template>
  <div class="fundraiser" @click="$router.push({ path: `/fundraisers/${item.url}` })">
    <span
      class="fundraiser_image"
      :style="{
        backgroundImage: `url(${
          item.cover_photo ? item.cover_photo : require('@/assets/img/default_picture.svg')
        })`,
        backgroundSize: `${item.cover_photo ? 'cover' : 'auto'}`,
      }"
    ></span>
    <div class="fundraiser_content">
      <h3>{{ item.name }}</h3>
      <h4>{{ item.focus_title }}</h4>
      <p>{{ item.short_description }}</p>
      <div class="disperse"/>
      <donationProgress
        :raised="item.amount_raised"
        :goal="item.goal"
        goalText="GOAL - "
        :percent="true"
        :height="8"
        class="revers text-bold"
      />
    </div>
  </div>
</template>
<script>

import donationProgress from '@/components/donationProgress';

export default {
  props: {
    item: { type: Object },
  },

  components: {
    donationProgress,
  },
}
</script>
<style lang="scss" scoped>
.fundraiser {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0px 4px 31px -3px rgba($color: $violet, $alpha: 0.14);
  background: #fff;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 500px;
  &_image {
    display: block;
    width: 100%;
    height: 300px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-color: $violetBorder;
  }
  &_content {
    display: flex;
    flex-direction: column;
    flex: 1;
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
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    p {
      font-size: 16px;
      line-height: 1.3;
      color: $websiteText;
      margin-bottom: 25px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
.disperse{
  display: flex;
  flex: 1;
}
</style>
