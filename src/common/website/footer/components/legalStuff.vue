<template>
  <div class="legal_text container">
    <h2>
      Legal stuff and
      <router-link to="/sweepstake-rules" v-slot="{ href, navigate }" custom
        ><a :href="href" @click="navigate"> Official Rules </a>
      </router-link>
    </h2>
    <div v-html="rules" class="rules"></div>
  </div>
</template>
<script>
export default {
  props: { rules: { type: [String, Object] } },
};
</script>
<style lang="scss" scoped>
.legal_text {
  padding-top: 5rem;
  padding-bottom: 5rem;
  h2 {
    font-size: 30px;
    line-height: 1.2;
    font-weight: 900;
    color: $white;
    margin-bottom: 24px;
    a {
      color: $violetBorder;
      text-decoration: underline;
      &:hover {
        color: $indigo;
      }
    }
  }
  div.rules {
    color: $white;
  }
}
</style>