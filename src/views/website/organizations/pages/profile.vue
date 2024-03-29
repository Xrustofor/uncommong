<template>
  <div  v-if="!localLoading" class="html_editor fade">
    <div 
      class="html_editor"
      v-html="organization.biography"
      v-if="organization.biography"
    />
    <div class="message" v-else>
      <h3>No information available</h3>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters("organizations/organizations", {
      organization: "getOrganization",
      localLoading: "getlocalLoading",
    }),
  },
};
</script>
