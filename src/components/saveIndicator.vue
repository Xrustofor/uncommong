<template>
  <div>
    <div class="indicator" v-show="type === 'LOADING'">
      <span class="loader"/>
      Saving...
    </div>
    <div class="indicator" v-show="type === 'SAVED'">
      <icon-base
        class="icon"
        width="20"
        height="22"
        viewBox="0 0 20 22"
        icon-name="check"
        icon-color="#63517A"
      >
        <iconCheck/>
      </icon-base>
      Saved
    </div>
    <div 
      class="indicator indicator--error"
      v-show="type === 'ERROR'"
    >Failed to Save.</div>
  </div>
</template>
<script>
import IconBase from '@/components/IconBase';
import iconCheck from '@/components/icons/iconCheck';
export default {
  props: {
    type: {
      type: String,
      default: 'NONE', // NONE LOADING SAVED ERROR
      required: true,
    },
  },
  components: {
    IconBase,
    iconCheck,
  },
}
</script>
<style lang="scss" scoped>
.indicator {
  background-color: $white;
  padding: 10px;
  border-radius: 10px;
  border: solid 1px #454545;
  display: flex;
  align-items: center;
  justify-content: center;

  .loader {
    margin-right: 10px;
    border-radius: 100%;
    border: 2px solid #454545;
    border-bottom-color: transparent;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    height: 20px;
    width: 20px;
    max-width: 20px;
    max-height: 20px;
    min-height: 20px;
    min-width: 20px;
    background: transparent !important;
    -webkit-animation: rotate 0.75s 0s linear infinite;
    animation: rotate 0.75s 0s linear infinite;
  }
  .icon {
    margin-left: 10px;
  }
  &--error {
    border: 1px solid $red;
    color: $red;
  }
}
.mode-fixed {
  grid-column: 1/-1;
  position: fixed;
  top: 20px;
  left: calc(50% + 140px);
  z-index: 1;
}
</style>
