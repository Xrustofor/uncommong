<template>
  <ul class="list fade" v-if="fundraiserTabData.length">
    <li v-for="(item, key) in fundraiserTabData" :key="`fundraiserTabData-${key}`">
      <Fundaiser v-if="item.type === 'fundraiser'" :item="item" />
      <Sweepstake v-if="item.type === 'sweepstake'" :item="item" />
    </li>
  </ul>
</template>
<script>

import Fundaiser from '../components/fundraiser';
import Sweepstake from '../components/sweepstake';
import { mapActions, mapGetters } from 'vuex';

export default {
  components: {
    Fundaiser,
    Sweepstake,
  },
  async created() {
    await this.apiGetFundraisersData(this.organizationId);
  },
  computed: {
    ...mapGetters('organizations/organizations', {
      organizationId: 'getIdOrganization',
      localLoading: 'getlocalLoading',
      fundraiserTabData: 'getFundraiserTabData',
    }),
  },
  methods: {
    ...mapActions('organizations/organizations', ['apiGetFundraisersData']),
  },
}
</script>
<style lang="scss" scoped>
.list {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -2rem;
  li {
    width: calc(50% - 4rem);
    background: #ffffff;
    border-radius: 20px;
    margin: 2rem;
    & > div {
      box-shadow: 0px 4px 31px -3px rgba(99, 81, 122, 0.14);
    }
    @media (max-width: $lg) {
      width: 100%;
    }
  }
}
</style>