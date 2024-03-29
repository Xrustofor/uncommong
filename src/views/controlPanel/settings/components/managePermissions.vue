<template>
  <div class="permission-block">
    <h2 class="swal2-title">Manage permissions</h2>
    <div class="swal2-content">
      <p class="subtitle">Change permissions for {{ member.full_name }}</p>
      <div class="permission-block_list">
        <simpleCheckbox
          class="square"
          :checked="newPermissions.edit_team"
          v-model="newPermissions.edit_team"
          label="Edit team page"
          @changed="changed = true"
        />
        <simpleCheckbox
          class="square"
          :checked="newPermissions.edit_member"
          v-model="newPermissions.edit_member"
          label="Edit member permissions"
          @changed="changed = true"
        />
      </div>
    </div>
    <div class="btn-overlay">
      <button
        class="btn swal2-styled swal2-cancel btn-alt"
        @click.prevent="reset"
        :disabled="!changed || saved"
      >
        CANCEL
      </button>
      <LoaderButton
        class="swal2-styled swal2-confirm"
        :text="saved ? 'Saved' : 'SAVE AND CLOSE'"
        :loading="loading"
        :disabled="!changed || saved"
        @emitClick="managePermission"
      ></LoaderButton>
    </div>
  </div>
</template>
<script>
import simpleCheckbox from '@/components/inputs/simpleCheckbox';
import LoaderButton from '@/components/buttons/loaderButton.vue';
import { mapActions, mapGetters } from 'vuex';
export default {
  props: {
    team: [String, Number],
    member: { type: Object },
  },
  components: { simpleCheckbox, LoaderButton },
  data() {
    return {
      newPermissions: {
        edit_member: false,
        edit_team: false,
      },
      changed: false,
      loading: false,
      saved: false,
    }
  },
  async created() {
    await this.getMemberPermissions({ idTeam: this.team, idMember: this.member.id });
    this.newPermissions = JSON.parse(JSON.stringify(this.permissions));
  },
  computed: {
    ...mapGetters('settings/p2pTeams/roster', {
      permissions: 'getMemberPermissions',
    }),
  },
  watch: {
    saved(val) {
      if (val == true) {
        this.$emit('hideModal')
      }
    },
  },
  methods: {
    ...mapActions('settings/p2pTeams/roster', ['getMemberPermissions', 'savePermission']),
    reset() {
      this.newPermissions = JSON.parse(JSON.stringify(this.permissions))
    },
    async managePermission() {
      this.loading = true
      let success = await this.savePermission({
        idTeam: this.team,
        idMember: this.member.id,
        value: this.newPermissions,
      })
      this.loading = false
      if (success) {
        this.saved = true
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.permission-block {
  padding: 15px 0;
  &_list {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    .checkbox-label {
      display: inline-flex;
      width: auto;
      margin-bottom: 16px;
    }
  }
  .swal2-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    p.subtitle {
      margin-top: 5px;
      margin-bottom: 35px;
    }
  }
  .btn-overlay {
    display: flex;
    justify-content: center;
    margin-top: 30px;
    .btn {
      margin: 0 18px;
    }
  }
}
</style>