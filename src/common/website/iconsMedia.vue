<template>
  <ul class="socials">
    <li
      v-for="(item, key) in items"
      :key="`${key}-network-share`"
      class="link_icon"
      :style="item.type === 'socialNetwork' ? { background: iconBackground } : ''"
      :class="item.type === 'website' ? 'text' : ''"
    >
      <a :href="item.url" target="_blank" v-if="item.type === 'socialNetwork'">
        <icon-base width="20" height="20" :icon-name="`share in ${item.name}`">
          <component
            :icon-color="iconColor"
            :background="iconBackground"
            v-bind:is="`icon-${item.name}`"
          ></component>
        </icon-base>
      </a>
      <a v-if="item.type === 'website' && item.url && item.name" :href="item.url" target="_blank">
        {{ item.name }}
      </a>
    </li>
  </ul>
</template>
<script>
import IconBase from '@/components/IconBase'
import iconFacebook from '@/components/icons/iconFacebook'
import iconYoutube from '@/components/icons/iconYoutube'
import iconTwitter from '@/components/icons/iconTwitter'
import iconInstagram from '@/components/icons/iconInstagram'

export default {
  props: {
    items: {
      type: Array,
      default: [],
    },
    indent: {
      type: [String, Number],
      default: '10',
    },
    sizeIcon: {
      type: [String, Number],
      default: '50',
    },
    iconColor: {
      type: String,
      default: '#fff',
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
  },
  data() {
    let indentStr
    if (
      (this.indent && String(this.indent).search(/%/i) != -1) ||
      String(this.indent).search(/px/i) != -1
    ) {
      indentStr = this.indent
    } else {
      indentStr = `${+this.indent}px`
    }
    return {
      indentLocal: indentStr,
    }
  },
}
</script>
<style lang="scss" scoped>
ul {
  display: flex;
  justify-content: flex-end;
  align-content: center;
}
.link_icon {
  display: flex;
  align-content: center;
  border-radius: 50%;
  opacity: 0.8;
  transition: opacity linear 0.3s;
  cursor: pointer;
  min-height: 5.5rem;
  min-width: 5.5rem;
  margin: 0 0.8rem;
  &:first-child {
    margin-left: 0;
  }
  &:last-child {
    margin-right: 0;
  }
  &:hover {
    opacity: 1;
    transition: opacity linear 0.3s;
  }
  &.text {
    border-radius: 0;
    display: flex;
    align-items: center;
    font-family: Inter;
    font-style: normal;
    font-weight: bold;
    font-size: 1.8rem;
    color: $websiteText;
  }
}
</style>
