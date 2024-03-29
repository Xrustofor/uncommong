<template>
  <div class="special__donation">
    <div class="special__donation_price">${{ specialDonation.price }}</div>
    <div class="special__donation_img" :style="image"></div>
    <div class="special__donation_text">
      <div class="text_wrap">
        <div class="text">
          <h4>{{ specialDonation.name }}</h4>
          <p>{{ specialDonation.description }}</p>
        </div>
        <a class="btn btn-alt btn-alt-no-border" @click.prevent="readMore"
          >READ MORE</a
        >
      </div>
      <LoaderButton
        class="btn-yellow btn-medium"
        text="PURCHASE"
        :loading="loadingButton"
        @emitClick="purchase"
      ></LoaderButton>
    </div>
  </div>
</template>
<script>

import LoaderButton from "@/components/buttons/loaderButton.vue";

export default {
  props: {
    specialDonation: {
      type: Object,
    },
    loading: { type: Boolean },
  },
  components: {
    LoaderButton,
  },
  data() {
    return {
      loadingButton: false,
      count: 1,
    };
  },
  watch: {
    loading() {
      this.loadingButton = false;
    },
  },
  computed: {
    image() {
      var image = this.specialDonation.image,
        style = {
          backgroundImage: image ? "url(" + image + ")" : "",
          backgroundSize: image ? "cover" : "auto",
        };
      return style;
    },
  },
  methods: {
    readMore() {
      var data = {
        modal: true,
        specialDonation: this.specialDonation,
      };
      this.$emit("readMore", data);
    },
    purchase() {
      this.loadingButton = true;
      var special = {
        count: this.count,
        id: this.specialDonation.id,
        price: this.specialDonation.price,
      };
      this.$emit("purchase", special);
    },
  },
};
</script>
<style lang="scss" scoped>
.special__donation {
  display: flex;
  flex-direction: column;
  position: relative;
  margin-bottom: 50px;
  flex: 1;
  &_price {
    position: absolute;
    top: -35px;
    left: -20px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 95px;
    height: 95px;
    min-width: 95px;
    min-height: 95px;
    border-radius: 50%;
    background-color: white;
    box-shadow: 0 0 15px rgba(99, 81, 120, 0.08);
    font-size: 20px;
    line-height: 1.2;
    font-weight: 900;
    color: $websiteViolet;
    padding: 5px;
    border: 2px solid $violet;
    @media only screen and (max-width: 1299px) {
      width: 80px;
      height: 80px;
      min-width: 80px;
      min-height: 80px;
      font-size: 20px;
    }
  }
  &_img {
    width: 100%;
    height: 365px;
    border-radius: 10px;
    margin-bottom: 20px;
    background-image: url("../../../../assets/img/default_user.svg");
    background-color: $violetBorder;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    @media only screen and (max-width: 599px) {
      height: 200px;
    }
  }
  .text_wrap{
    @media only screen and (max-width: 599px) {
      padding-right: 0px;
    }
  }
  &_text {
    display: flex;
    justify-content: space-between;
    flex: 1;
    padding-bottom: 30px;
    .text {
      flex: 1;
      p {
        min-height: 50px;
      }
    }
    .btn-alt {
      position: relative;
      text-align: left;
      color: $text;
      line-height: 1.4;
      &:after {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 1px;
        content: "";
        background: $text;
        @include transition();
      }
      &:hover {
        color: $violet;
        &:after {
          background: $violet;
        }
      }
    }
    @media only screen and (max-width: 599px) {
      flex-wrap: wrap;
      .btn {
        width: 100%;
      }
      a.btn { width: auto }
      .btn-alt-no-border {
        margin-bottom: 15px;
      }
    }
    & > div {
      padding-right: 15px;
    }
    h4 {
      font-size: 20px;
      line-height: 1.2;
      margin-bottom: 13px;
      color: $text;
    }
    p {
      font-size: 14px;
      line-height: 1.28;
      margin-bottom: 9px;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      color: $text;
      font-weight: 400;
    }
  }
}
</style>