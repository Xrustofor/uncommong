<template>
  <div class="container">
    <div class="search">
      <SimpleSearch class="no-border" @search="search"/>
    </div>
    <div class="filter_overlay">
      <SortDropDown
        title="Sort by"
        :items="sortOrganiations"
        @selectElement="selectSortOrganiations"
      ></SortDropDown>
      <Filtration
        title="Filter by cause"
        :items="focuses"
        :selectedItems="selectedCauses"
        :filtrationClosed="filtrationClosed"
        @selectFilter="selectCause"
        @removeFilter="removeCause"
      >
        <template #sort>
          <Sort
            title="Sort:"
            :items="sortFocuses"
            @selectSort="selectSortFocuses"
          ></Sort>
        </template>
      </Filtration>
      <div></div>
    </div>
    <Organizations
      :organizations="organizations"
      @loadMore="loadMore"
    ></Organizations>
  </div>
</template>
<script>

import Organizations from "./components/organizations";
import Filtration from "@/components/filtrationDropdown.vue";
import Sort from "@/components/sortList";
import SortDropDown from "@/components/sortDropDown";
import SimpleSearch from "@/components/inputs/simpleSearchNew.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  components: { 
    Organizations,
    Filtration,
    Sort,
    SortDropDown,
    SimpleSearch
  },
  data() {
    return {
      sendingData: {
        search: "",
        sort_organizations: "newest",
        sort_focuses: "alphabetically",
        focuses: [],
        page: 1,
      },
      sortFocuses: [
        { title: "Alphabetically", key: "alphabetically", active: true },
        {
          title: "By Organization Count",
          key: "count",
          active: false,
        },
      ],
      sortOrganiations: [
        {
          title: "Newest",
          key: "newest",
          active: true,
        },
        { title: "Alphabetically", key: "alphabetically", active: false },
      ],
      filtrationClosed: true,
      selectedCauses: [],
      selectedSortes: [],
    };
  },
  async mounted() {
    this.$store.dispatch("setLoader", true);
    await this.getApiOrganizationsList(this.sendingData);
    this.$store.dispatch("setLoader", false);
 
    const query = this.$route.query;
    if(query.subscription) {
      this.censelDonateMonthly(query);
    };

  },
  computed: {
    ...mapGetters("organizations/organizations", {
      organizations: "getOrganizationsList",
      focuses: "getFocuses",
      page: "getPage",
      message: "getMessage",
    }),
  },
  methods: {
    ...mapActions("organizations/organizations", [
      "getApiOrganizationsList",
      "apiCenselDonateMonthly",
      "apiRestoreDonateMonthly",
    ]),

    async censelDonateMonthly(data){
      switch(data.subscription){
        case 'cancel' : {
          const { organizationName, token } = data;
          this.cancelSubscription( organizationName, token );
          break;
        };
        case 'restore': {
          const { organizationName, token } = data;
          this.restoreSubscription( organizationName, token );
          break;
        }
      }
    },

    async cancelSubscription(name, token){
      const message = `Would you like to cancel your recurring donation ${name}?`;
      let success = false;
      await this.$swal({
        title: message,
        showDenyButton: true,
        confirmButtonText: "Yes",
        confirmButtonClass: "confirm",
        denyButtonText: "No",
        denyButtonClass: "cancel",
        showCloseButton: true,
      }).then((result) => {
        if (result.isDenied) { 
          success = false;
        }
        if (result.isConfirmed) {
          success = true;
        }
      });
      if(success){
        await this.apiCenselDonateMonthly({token});
        if(this.message){
          this.$swal({ title: this.message, confirmButtonText: "OK" });
        }
      }
    },

    async restoreSubscription(name, token){
      const message = `You would like to restore your recurring donation ${name}?`;
      let success = false;
      await this.$swal({
        title: message,
        showDenyButton: true,
        confirmButtonText: "Yes",
        confirmButtonClass: "confirm",
        denyButtonText: "No",
        denyButtonClass: "cancel",
        showCloseButton: true,
      }).then((result) => {
        if (result.isDenied) { success = false }
        if (result.isConfirmed) { success = true }
      });
      if(success){
        await this.apiRestoreDonateMonthly({token});
        if(this.message){
          this.$swal({ title: this.message, confirmButtonText: "OK" });
        }
      }
    },

    selectCause(val) {
      var hasElement = this.selectedCauses.some((o) => o.id === val.id);
      if (!hasElement) {
        this.selectedCauses.push(val);
        this.filtration();
      }
    },
    removeCause(val) {
      this.selectedCauses = this.selectedCauses.filter((item) => item !== val);
      this.filtration();
    },
    async selectSortFocuses(val) {
      const data = {
        ...this.sendingData,
        page: 1,
        sort_focuses: val.key,
      };
      const success = await this.getApiOrganizationsList(data);
      if (success) {
        this.sendingData = data;
        this.sortFocuses.forEach((element) => {
          element.active = element.key === val.key ? true : false;
        });
      }
    },
    async selectSortOrganiations(val) {
      const data = {
        ...this.sendingData,
        page: 1,
        sort_organizations: val.key,
      };
      const success = await this.getApiOrganizationsList(data);
      if (success) {
        this.sendingData = data;
        this.sortOrganiations.forEach((element) => {
          element.active = element.key === val.key ? true : false;
        });
      }
    },
    async filtration() {
      var causes = [];
      this.selectedCauses.forEach((element) => {
        causes.push(element.id);
      });
      const data = {
        ...this.sendingData,
        page: 1,
        focuses: causes,
      };
      const success = await this.getApiOrganizationsList(data);
      if (success) this.sendingData = data;
    },
    async search({ text }) {
      const data = {
        ...this.sendingData,
        page: 1,
        search: text,
      };
      const success = await this.getApiOrganizationsList(data);
      if (success) {
        this.sendingData = data;
      }
    },
    async loadMore() {
      if (this.page) {
        var newPage = this.sendingData.page + 1;
        const data = {
          ...this.sendingData,
          page: newPage,
        };
        const success = await this.getApiOrganizationsList(data);
        if (success) {
          this.sendingData = data;
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.content {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100px;
}
.filter_overlay {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.search {
  max-width: 520px;
  margin-top: 55px;
}
</style>