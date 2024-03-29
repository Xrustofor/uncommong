<template>
  <div class="dashboard__content_inner">
    <h4>Hi, {{ user.first_name }}</h4>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "control-panel-home",
  mounted() {
    this.pageSettingsTitle("");
  },
  computed: {
    ...mapGetters("user", {
      user: "getUser",
    }),
  },
  methods: {
    ...mapActions("pageSettings", ["pageSettingsTitle"]),
  },
};
</script>
<style lang="scss" scoped>
h4 {
  padding: 20px;
}
</style>