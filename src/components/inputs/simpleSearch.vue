<template>
  <div class="input">
    <input 
      type="text"
      :placeholder="placeholder"
      :style="`color: ${color}`"
    >
    <span class="icon">
      <icon-base
      width="35" 
      height="35"
      icon-name="search"
      :icon-color="color"
    >
      <icon-search />
    </icon-base>
    </span>
    
  </div>
</template>
<script>

import IconBase from "@/components/IconBase";
import iconSearch from "@/components/icons/iconSearch";

export default {
  props: {
    placeholder: String,
    color: String,
  },
  components: {
    IconBase,
    iconSearch
  }
}
</script>
<style lang="scss" scoped>
  .input{
    position: relative;
    z-index: 1;
    min-width: 100%;
    input{
      padding-right: 40px;
      min-width: 100%;
      font-size: 14px;
    }
  }
  .icon{
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0px;
    padding: 17px 0;
  }
</style>