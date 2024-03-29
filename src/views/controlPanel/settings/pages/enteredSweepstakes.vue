<template>
  <div>
    <PageHeader title="Entered Sweepstakes"/>
    <h4 class="title">Sweepstake Transactions</h4>
    <SimpleTable
      :headerItems="headerItems"
      :items="items"
      :total="total"
      :countPages="total ? +total : 0"
      :numberPages="numberPages"
      :accordion="true"
      @selectActions="selectActions"
      @selectCount="selectCount"
      @pageSelection="pageSelection"
      @selectMenu="selectMenu"
    >
      <template #loader>
        <ProgressBar :loading="loading"/>
      </template>
    </SimpleTable>
  </div>
</template>
<script>
import PageHeader from "../components/pageHeader";
import SimpleTable from "@/components/simpleTable.vue";
import ProgressBar from "@/components/progressBar.vue";

import { changeCheckboxList } from "@/helpers/script";
import { mapGetters, mapMutations, mapActions } from "vuex";

export default {
  name: "entered-sweepstakes",
  components: { PageHeader, SimpleTable, ProgressBar },
  data() {
    return {
      sendingData: {
        sort: "title",
        per_page: 10,
        order: "asc",
        page: 1,
      },
      sortSelect: {
        sort: "title",
        order: "asc",
      },
    };
  },
  async mounted() {
    await this.getApiSweepstakesList(this.sendingData);
  },
  computed: {
    ...mapGetters("settings/sweepstakes", {
      items: "getItems",
      headerItems: "getHeaderItems",
      total: "getTotal",
      numberPages: "getNumberPages",
      loading: "getLoader",
    }),
  },
  methods: {
    ...mapActions("settings/sweepstakes", ["getApiSweepstakesList"]),
    ...mapMutations("settings/sweepstakes", ["setHeaderItems"]),
    async selectActions(sort) {
      this.sendingData.sort = sort;
      let sortSelect = this.sortSelect;
      let data = this.sendingData;

      if (sortSelect.sort === "") {
        this.sortSelect = { sort, order: "desc" };
      } else {
      }

      if (sortSelect.sort === sort) {
        if (sortSelect.order === "asc") {
          this.sortSelect = { ...this.sortSelect, order: "desc" };
        }

        if (sortSelect.order === "desc") {
          this.sortSelect = { ...this.sortSelect, order: "asc" };
        }
      } else {
        this.sortSelect = { sort, order: "asc" };
      }

      data = {
        ...this.sendingData,
        ...this.sortSelect,
      };

      const success = await this.getApiSweepstakesList(data);
      if (success) {
        this.sendingData = data;
      }
    },
    async selectCount(val) {
      const data = {
        ...this.sendingData,
        page: 1,
        per_page: val,
      };

      const success = this.getApiSweepstakesList(data);
      if (success) this.sendingData = data;
    },
    async pageSelection(page) {
      const data = {
        ...this.sendingData,
        page: page,
      };

      const success = this.getApiSweepstakesList(data);
      if (success) this.sendingData = data;
    },
    async selectMenu(params) {
      const items = changeCheckboxList(this.headerItems, params);
      this.setHeaderItems(items);

      const data = {
        ...this.sendingData,
        page: 1,
        filter: params.name,
        filterBy: params.key,
      };

      const success = await this.apiEntrantsList(data);
      if (success) this.sendingData = data;
    },
  },
};
</script>