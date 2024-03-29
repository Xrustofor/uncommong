<template>
  <div class="loader">
    <div class="ball-clip-rotate small">
      <div></div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.loader {
  width: 100%;
  height: 100%;
  max-width: 100%;
  flex: 1;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  z-index: 9999999;
}
</style>