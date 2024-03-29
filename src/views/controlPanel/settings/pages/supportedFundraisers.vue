<template>
  <div>
    <PageHeader title="Supported Fundraisers">
      <template #rightPart>
        <ImageButton
          title="Export"
          :img="{ alt: 'export', path: 'export.svg' }"
          @buttonEmit="exportCSV"
          :disabled="!rowIdSelect.length"
        ></ImageButton>
      </template>
    </PageHeader>
    <h4 class="title">Fundraiser Transactions</h4>
    <simpleTable
      tableWrapPadding="100"
      :headerItems="headerItems"
      :items="localItems"
      :total="total"
      :countPages="total ? +total : 0"
      :loader="linearLoading"
      :checkboxSelectAll="selectAll"
      :numberPages="numberPages"
      @selectRow="selectRow"
      @getDownload="getDownload"
      @selectActions="selectActions"
      @selectCount="selectCount"
      @pageSelection="pageSelection"
      @selectAll="changeAllSelect"
      @clear="rowIdSelectClear()"
    >
      <template #loader>
        <vue-progress-bar />
      </template>
    </simpleTable>
  </div>
</template>
<script>
import simpleTable from '@/components/simpleTable';
import simpleSearch from '@/components/inputs/simpleSearch';
import IconBase from '@/components/IconBase';
import iconDownload from '@/components/icons/iconDownload';

import SimpleSearchNew from '@/components/inputs/simpleSearchNew.vue';
import PageHeader from '../components/pageHeader';
import ImageButton from '@/components/buttons/imageButton.vue';

import { mapGetters, mapMutations, mapActions } from 'vuex';
import { changeCheckboxList } from '@/helpers/script';
export default {
  components: {
    simpleTable,
    simpleSearch,
    IconBase,
    iconDownload,

    SimpleSearchNew,
    PageHeader,
    ImageButton,
  },
  data: () => ({
    sendingData: {
      id: null,
      sort: 'timestamp',
      perPage: 10,
      order: 'desc',
      search: '',
      page: 0,
    },
    sortSelect: {
      sort: '',
      order: '',
    },
    rowIdSelect: [],
    selectAll: false,
    localItems: [],
  }),
  async created() {
    await this.apiFundraisersList(this.sendingData);
    this.$Progress.finish();
  },
  watch: {
    linearLoading(val) {
      val ? this.$Progress.start() : this.$Progress.finish();
    },
    items(val) {
      this.localItems = val;
      this.selectAll = false;
    },
  },
  computed: {
    ...mapGetters('settings/fundraisers', {
      items: 'getItems',
      headerItems: 'getHeaderItems',
      total: 'getTotal',
      linearLoading: 'getLoader',
      numberPages: 'getNumberPages',
    }),
  },

  methods: {
    ...mapMutations('settings/fundraisers', ['setHeaderItems']),
    ...mapActions('settings/fundraisers', ['apiFundraisersList', 'apiDownloadExport']),
    async selectCount(val) {
      const data = {
        ...this.sendingData,
        page: 1,
        perPage: val,
      }

      const success = await this.apiFundraisersList(data);
      if (success) {
        this.sendingData = data;
      }

      const items = changeCheckboxList(this.headerItems);
      this.setHeaderItems(items);
    },
    async pageSelection(page) {
      const data = {
        ...this.sendingData,
        page: page,
      }

      const success = await this.apiFundraisersList(data);
      if (success) {
        this.sendingData = data;
      }

      const items = changeCheckboxList(this.headerItems);
      this.setHeaderItems(items);
    },
    async search({ text, valid }) {
      let data = {
        ...this.sendingData,
        search: text,
      }

      if (valid) {
        this.searchText = text;

        const success = await this.apiFundraisersList(data);
        if (success) {
          this.sendingData = data;
        }
      } else {
        if (text === '') {
          const success = await this.apiFundraisersList(data);
          if (success) {
            this.sendingData = data;
          }
        }
      }

      this.rowIdSelectClear();
    },
    async exportCSV() {
      await this.apiDownloadExport(this.rowIdSelect);
    },

    selectRow(data) {
      const items = [];
      const id = data.id;

      this.localItems.map((item) => {
        if (item.id === id) {
          items.push({
            ...item,
            checked: !item.checked,
          })
        } else {
          items.push(item);
        }
      })

      this.localItems = items;

      const candidate = this.localItems.find((item) => {
        return item.checked === false ? true : false;
      })

      this.selectAll = candidate ? false : true;

      const selectId = [];
      items.map((item) => {
        if (item.checked) selectId.push(item.id);
      })
      this.rowIdSelect = selectId;
    },

    rowIdSelectClear() {
      this.rowIdSelect = [];
    },

    changeAllSelect(val) {
      this.selectAll = val;
      const items = [];
      if (val) {
        this.localItems.map((item) => {
          items.push({ ...item, checked: true });
        })
      } else {
        this.localItems.map((item) => {
          items.push({ ...item, checked: false });
        })
      }
      this.localItems = items;

      const selectId = [];
      items.map((item) => {
        if (item.checked) selectId.push(item.id);
      })

      this.rowIdSelect = selectId;
    },

    async getDownload(id) {
      const data = [id];
      await this.apiDownloadExport(data);
    },

    async selectActions(sort) {
      let sortSelect = this.sortSelect;
      let data = this.sendingData;

      if (sortSelect.sort === '') {
        this.sortSelect = { sort, order: 'desc' };
      }

      if (sortSelect.sort === sort) {
        if (sortSelect.order === 'asc') {
          this.sortSelect = { ...this.sortSelect, order: 'desc' };
        }

        if (sortSelect.order === 'desc') {
          this.sortSelect = { ...this.sortSelect, order: 'asc' };
        }
      } else {
        this.sortSelect = { sort, order: 'asc' };
      }

      data = {
        ...this.sendingData,
        ...this.sortSelect,
      }
      const success = await this.apiFundraisersList(data);
      if (success) {
        this.sendingData = data;
      }

      const items = changeCheckboxList(this.headerItems);
      this.setHeaderItems(items);
    },
  },
}
</script>
<style lang="scss" scoped>
.header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  & > div {
    padding: 10px 0;
    display: flex;
    align-items: center;
    &:first-child {
      padding-right: 15px;
    }
    &:last-child {
      padding-left: 15px;
    }
  }
  .center {
    width: 45%;
    min-width: 250px;
  }
}
.download {
  font-size: 12px;
  font-weight: 600;
  color: #6db5d1;
  cursor: pointer;
  opacity: 0.8;
  transition: all 0.3s;
  &:hover {
    opacity: 1;
    transition: all 0.3s;
  }
  .round_icon {
    height: 23px;
    width: 23px;
    overflow: hidden;
    border-radius: 50%;
    background: #6db5d1;
    position: relative;
    z-index: 1;
    margin-left: 10px;
    svg {
      position: absolute;
      top: 4px;
      left: 6px;
    }
  }
}
</style>
