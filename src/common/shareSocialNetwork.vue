<template>
  <ul>
    <li class="link_icon">
      <slot name="left"></slot>
    </li>
    <li 
      v-for="(item, key) in items" 
      :key="`${key}-network-share`"
      class="link_icon"
    >
      <icon-base 
        width="20"
        height="20"
        :icon-name="`share in ${item}`"
        icon-color="#fff"
      >
        <component v-bind:is="`icon-${item}`"></component>
      </icon-base>
    </li>
  </ul>
</template>
<script>
import IconBase from "@/components/IconBase";
import iconFacebook from "@/components/icons/iconFacebook";
import iconTwitter from "@/components/icons/iconTwitter";

export default {
  props:{
    items:{
      type: Array,
      default: []
    }
  },  
  components: {
    IconBase,
    iconFacebook,
    iconTwitter
  }
}
</script>
<style lang="scss" scoped>
  ul{
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .link_icon {
    display: block;
    opacity: 0.8;
    transition: opacity linear 0.3s;
    cursor: pointer;
    min-height: 5.5rem;
    min-width: 5.5rem;
    margin: 0 .8rem;
    &:first-child{ margin-left: 0; }
    &:last-child{ margin-right: 0; }
    &:hover { opacity: 1; }
  }
</style>