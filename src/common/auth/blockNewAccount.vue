<template>
  <div class="instruction__text">
    <h4 v-if="text">Thank you for registering</h4>
    <p>
      We are not currently accepting new users. We will reach out to you as soon
      as possible.
    </p>
    <p>Thank you for your understanding</p>
  </div>
</template>
<script>
export default {
  props: {
    text: {
      default: false,
      type: Boolean,
    },
  },
};
</script>