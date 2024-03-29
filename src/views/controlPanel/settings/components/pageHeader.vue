<template>
  <div class="page_header">
    <h3>{{ title }}</h3>
    <div>
      <slot name="rightPart"></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: { title: { type: String } },
}
</script>
<style lang="scss" scoped>
.page_header {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 15px;
  @media only screen and (max-width: 599px) {
    margin-bottom: 0;
  }
  h3 {
    font-size: 30px;
    font-weight: 900;
    color: $websiteViolet;
  }
  & > * {
    margin-bottom: 15px;
    flex: 1;
  }
  & > div {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>