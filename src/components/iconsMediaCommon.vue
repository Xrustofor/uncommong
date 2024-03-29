<template>
  <div class="socials">
    <a
      :style="{ width: `${sizeIcon}px`, height: `${sizeIcon}px` }"
      v-for="(item, key) in items"
      :key="key"
      class="socials__icon"
      :href="item.url"
      target="_blank"
    >
      <icon-base :icon-name="`share in ${item.name}`">
        <component
          :icon-color="iconColor"
          :background="iconBackground"
          v-bind:is="`icon-${item.name}`"
        />
      </icon-base>
    </a>
  </div>
</template>
<script>
import IconBase from '@/components/IconBase';
import iconFacebook from '@/components/icons/iconFacebook';
import iconYoutube from '@/components/icons/iconYoutube';
import iconTwitter from '@/components/icons/iconTwitter';
import iconInstagram from '@/components/icons/iconInstagram';
import iconShareCircle from '@/components/icons/iconShareCircle';

export default {
  props: {
    items: {
      type: Array,
      default: [],
    },
    sizeIcon: {
      type: [String, Number],
      default: '50',
    },
    iconColor: {
      type: String,
      default: '#fff',
      required: true,
    },
    iconBackground: {
      type: String,
      default: '#fff',
    },
  },
  components: {
    IconBase,
    iconFacebook,
    iconYoutube,
    iconTwitter,
    iconInstagram,
    iconShareCircle,
  },
}
</script>

<style lang="scss" scoped>
.socials {
  display: flex;
  justify-content: flex-end;
  align-content: center;
  flex-wrap: wrap;

  &__icon {
    margin: 8px;
    transition: opacity linear 0.3s;
    cursor: pointer;
  }
}
</style>
