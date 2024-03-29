<template>
  <section>
    <h3 class="title">All Organizations</h3>
    <div class="row" v-if="organizations.length > 0">
      <div 
        class="col-3"
        v-for="organization in organizations"
        :key="organization.id"
      >
        <div
          class="organization"
          @click="$router.push({ path: `/nonprofits/${organization.slug}` })"
        >
          <div
            class="organization_image"
            :class="{
              small: !organization.profile_picture && !organization.image,
            }"
            :style="{
              backgroundImage: organization.profile_picture
                ? 'url(' + organization.profile_picture + ')'
                : organization.image
                ? 'url(' + organization.image + ')'
                : 'url(' + require(`@/assets/img/logo-blue.svg`) + ')',
            }"
          ></div>
          <div class="organization_text">
            <div>
              <h3>{{ organization.name }}</h3>
              <p>{{ organization.about_us }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="row_empty">There are no organizations here</div>
    <div 
      class="divider"
      v-infinite-scroll="loadMore"
      :infinite-scroll-disabled="busy"
    />
  </section>
</template>
<script>
export default {
  props: {
    organizations: { type: Array },
  },
  data() {
    return {
      busy: true,
    }
  },
  mounted() {
    this.busy = true
  },
  watch: {
    organizations(newVal, oldVal) {
      if (newVal == oldVal) {
        this.busy = true;
      } else this.busy = false;
    },
  },
  methods: {
    loadMore() {
      this.busy = true;
      this.$emit('loadMore');
    },
  },
}
</script>
<style lang="scss" scoped>
.container {
  margin-top: 50px;
  .divider {
    @include divider(125px);
    @media only screen and (max-width: 998px) {
      @include divider(75px);
    }
  }
}
h3.title {
  margin-bottom: 55px;
  color: $websiteText;
}
.row {
  display: flex;
  width: calc(100% + 4rem);
  margin: 0 -2rem;
  align-items: stretch;
  justify-content: flex-start;
  flex-wrap: wrap;
  @media only screen and (max-width: 499px) {
    width: 100%;
    margin: 0;
  }
  .col-3 {
    width: calc(100% / 3);
    padding: 0 2rem;
    margin-bottom: 35px;
    @media only screen and (max-width: 998px) {
      width: calc(100% / 2);
    }
    @media only screen and (max-width: 499px) {
      width: 100%;
      padding: 0;
    }
  }
}
.organization {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: 20px;
  box-shadow: 0px 4px 31px -3px rgba(99, 81, 122, 0.14);
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  &:hover {
    box-shadow: 0px 0px 43px -4px rgba(99, 81, 122, 0.8);
  }
  &_image {
    width: 100%;
    height: 350px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    border: 1px solid transparent;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    &.small {
      border-color: (rgba($color: $violet, $alpha: 0.2));
      background-color: (rgba($color: $violet, $alpha: 0.05));
      background-size: auto;
      @media only screen and (max-width: 599px) {
        background-size: 80%;
      }
    }
  }
  &_text {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    padding: 20px 20px 26px;
    h3 {
      font-size: 20px;
      color: $websiteText;
      font-weight: 800;
      margin-bottom: 7px;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    p {
      font-size: 16px;
      line-height: 1.3;
      color: $text;
      margin-bottom: 0;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 5;
      -webkit-box-orient: vertical;
    }
    .btn {
      width: 100%;
      height: 35px;
      font-weight: 500;
      text-transform: uppercase;
      line-height: 33px;
    }
  }
}
</style>