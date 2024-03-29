<template>
  <div class="settings_blocks">
    <div class="settings_blocks_header">
      <h3>Profile visibility</h3>
    </div>
    <div class="form__row">
      <div class="form__row_side">
        <div class="form__row_col">
          <div class="form__field">
            <div class="title_overlay">
              <p class="light">Show profile information to other users</p>
              <Swither
                :switchDate="profileVisibility"
                @changeSwitchVal="changeVisibility"
              ></Swither>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Swither from "@/components/inputs/swither.vue";
export default {
  components: { Swither },
  data() {
    return {
      profileVisibility: this.$store.getters["user/getUser"].profile_visibility,
    };
  },
  methods: {
    changeVisibility(val) {
      let profileVisibility = {
        profile_visibility: val,
      };
      let message = val ? "Visible" : "Invisible";
      this.axios
        .patch("/user/profile-visibility", profileVisibility)
        .then((res) => {
          this.$swal({
            title: "Profile set to " + message,
            confirmButtonText: "OK",
          });
        })
        .catch((error) => {});
    },
  },
};
</script>
<style lang="scss" scoped>
.form__row_col {
  @media only screen and (max-width: 998px) {
    max-width: 100%;
    .title_overlay {
      justify-content: flex-start;
    }
  }
}
.form__row_side {
  @media only screen and (max-width: 998px) {
    width: 50rem;
  }
}
</style>