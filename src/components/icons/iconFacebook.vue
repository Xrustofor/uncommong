<template>
  <g>
    <circle opacity="0.6" cx="25" cy="25" r="25" :fill="background" />
    <path
      d="M29.2792 26.165L29.8493 22.5728H26.2831V20.2417C26.2831 19.2589 26.7812 18.301 28.3786 18.301H30V15.2427C30 15.2427 28.5285 15 27.1217 15C24.1845 15 22.2648 16.7204 22.2648 19.835V22.5728H19V26.165H22.2648V34.849C22.9295 34.9497 23.6012 35.0002 24.274 35C24.9575 35 25.6284 34.9483 26.2831 34.849V26.165H29.2792Z"
      :fill="iconColor"
    />
  </g>
</template>
<script>
export default {
  props: {
    iconColor: {
      type: String,
      default: "#fff",
    },
    background: {
      type: String,
      default: "#fff",
    },
  },
};
</script>
