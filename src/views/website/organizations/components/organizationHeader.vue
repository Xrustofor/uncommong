<template>
  <div
    ref="header"
    class="header"
    role="img"
    :aria-label="image.alt"
    :style="{
      backgroundImage: `url(${image.url})`,
    }"
  >
    <section></section>
  </div>
</template>
<script>

import shareSocialNetwork from '@/common/shareSocialNetwork';
import IconBase from '@/components/IconBase';
import iconShareCopy from '@/components/icons/iconShareCopy';

export default {
  props: {
    image: {
      type: Object,
      default: { url: require(`@/assets/img/logo-blue.svg`), alt: '' },
    },
  },
  components: {
    shareSocialNetwork,
    iconShareCopy,
    IconBase,
  },
  data() {
    return {
      icons: ['facebook', 'twitter'],
    }
  },
  methods: {
    copy() {
      const temp = document.createElement('input');
      temp.value = window.location.href;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand('copy');
      document.body.removeChild(temp);
      let instance = this.$toast.success('Copied!', {
        position: 'top',
        duration: 3000,
        queue: true,
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.header {
  min-height: 550px;
  height: 100%;
  background: center;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 2rem;
  padding: 2rem;
  @media only screen and (max-width: 998px) {
    min-height: 300px;
  }
}
</style>