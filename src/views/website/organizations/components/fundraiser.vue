<template>
  <div
    class="fundraiser"
    @click="$router.push({ path: `/fundraisers/${item.slug}` })"
  >
    <span class="fundraiser_image" :style="{ backgroundImage: `url(${item.image})` }"></span>
    <div class="fundraiser_content">
      <h3>{{ item.headline }}</h3>
      <h4>{{ item.organization }}</h4>
      <p>{{ item.description }}</p>
      <div class="disperse"/>
      <donationProgress
        :raised="item.amount"
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
        }
      },
    },
  },
  components: {
    donationProgress,
  },
}
</script>
<style lang="scss" scoped>
.fundraiser {
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  height: 100%;
  overflow: hidden;
  box-shadow: 0px 4px 31px -3px rgba($color: $violet, $alpha: 0.14);
  background: #fff;
  cursor: pointer;
  &_image {
    display: block;
    width: 100%;
    height: 300px;
    background-size: cover;
    background-position: center;
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
