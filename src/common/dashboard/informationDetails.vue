<template>
  <div>
    <h5>{{ title }}</h5>
    <div class="info_text" v-for="i in info" :key="i.title">
      <h6>{{ i.title }}</h6>
      <p>{{ i.info }}</p>
    </div>
    <div class="info_text duration_overlay" v-if="duration">
      <h6>Duration:</h6>
      <slot name="duration"></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: { type: String, required: false },
    info: { type: Array },
    duration: { type: Boolean, default: false },
  },
};
</script>
<style lang="scss" scoped>
h5 {
  margin: 25px 0;
}
.info_text {
  display: flex;
  margin-bottom: 20px;
  &.duration_overlay {
    margin-bottom: 45px;
    @media only screen and (max-width: 998px) {
      margin-bottom: 25px;
    }
  }
  &_column {
    width: 100%;
    p {
      margin-bottom: 15px;
    }
  }
  h6,
  p {
    font-size: 14px;
    color: $violet;
    line-height: initial;
  }
  h6 {
    font-weight: 600;
    margin-right: 16px;
    min-width: 145px;
    max-width: 145px;
    @media only screen and (max-width: 998px) {
      min-width: 160px;
      max-width: 160px;
    }
  }
}
</style>