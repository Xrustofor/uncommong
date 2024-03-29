<template>
  <div class="loader">
    <div class="ball-clip-rotate small">
      <div></div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  .ball-clip-rotate {
    & > div {
      border-radius: 100%;
      -webkit-animation-fill-mode: both;
      animation-fill-mode: both;
      border: 2px solid $indigoDark;
      border-bottom-color: transparent;
      height: 16px;
      width: 16px;
      background: transparent !important;
      display: inline-block;
      -webkit-animation: rotate 1s 0s linear infinite;
      animation: rotate 1s 0s linear infinite;
    }
  }
}
</style>