<template>
  <div class="special__donation">
    <div class="special__donation_img" :style="image">
      <div class="special__donation_price">${{ item.price }}</div>
    </div>
    <div class="special__donation_text">
      <div class="text">
        <h4>{{ item.name }}</h4>
        <p>
          {{ item.description }}
        </p>
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
    loading: { type: Boolean },
    item: {
      type: Object,
      default() {
        return {
          id: null,
          price: null,
          name: "",
          description: "",
          image: "",
        };
      },
    },
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
      this.loadingButton = this.loading;
    },
  },
  computed: {
    image() {
      var image = this.item.image,
        style = {
          backgroundImage: image ? "url(" + image + ")" : "",
          backgroundSize: image ? "cover" : "auto",
        };
      return style;
    },
  },
  methods: {
    purchase() {
      this.$emit("purchase", this.item.id);
    },
  },
};
</script>
<style lang="scss" scoped>
.special__donation {
  display: flex;
  padding: 5rem 1rem;
  &_price {
    position: absolute;
    top: -45px;
    right: -45px;
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
    border: 2px solid $violet;
  }
  &_img {
    position: relative;
    width: 320px;
    min-width: 320px;
    min-height: 420px;
    border-radius: 10px;
    margin-right: 5.5rem;
    background-image: url("../../../../assets/img/default_user.svg");
    background-color: $violetBorder;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    @media only screen and (max-width: 425px) {
      min-width: 200px;
      width: 70%;
      min-height: 320px;
    }
  }
  &_text {
    display: flex;
    flex-direction: column;
    .text {
      flex: 1;
    }
    h4 {
      font-size: 38px;
      line-height: 1.2;
      margin-bottom: 20px;
    }
    p {
      font-size: 14px;
      line-height: 1.35;
      margin-bottom: 20px;
    }
  }
}
</style>