<template>
  <div>
    <h3>Add New Payment Method</h3>
    <div class="content">
      <div class="card_type">
        <MethodsSwitcher
          v-for="item in buttons"
          :key="item.methodType"
          :class="type === item.methodType ? 'selected' : ''"
          :title="item.title"
          :methodType="item.methodType"
          @changeForm="changeForm"
        ></MethodsSwitcher>
      </div>
      <div>
        <CreditCardInfo
          v-if="type === 1"
          @hideModal="hideModal"
          @updateMethod="updateMethod"
        ></CreditCardInfo>
        <BankAccountInfo
          v-else-if="type === 2"
          @hideModal="hideModal"
          @updateMethod="updateMethod"
        ></BankAccountInfo>
      </div>
    </div>
  </div>
</template>
<script>
import MethodsSwitcher from "./methodsSwitcher.vue";
import CreditCardInfo from "./addCardModal.vue";
import BankAccountInfo from "./addBankModal.vue";

export default {
  components: { 
    MethodsSwitcher,
    CreditCardInfo,
    BankAccountInfo
  },
  props: {},
  data() {
    return {
      buttons: [
        { methodType: 1, title: "Credit Card" },
        { methodType: 2, title: "Bank Account" },
      ],
      type: 1,
      editDisabled: false,
    };
  },
  methods: {
    changeForm(data) {
      this.type = data;
    },
    hideModal() {
      this.$emit("hideModal");
    },
    updateMethod(data) {
      this.$emit("updateMethod", data);
    },
  },
};
</script>
<style lang="scss" scoped>
.btn_overlay {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  margin-bottom: 20px;
  .btn {
    width: calc(50% - 7px);
  }
}
.content {
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 2rem;
  margin-top: 3rem;
  padding-left: 3rem;
  @media only screen and (max-width: 1399px) {
    margin-top: 2.5rem;
  }
  @media only screen and (max-width: 998px) {
    padding-left: 2rem;
  }
}
h3 {
  width: 100%;
  font-size: 20px;
  font-weight: 900;
  color: $violet;
  text-align: center;
  margin-bottom: 40px;
  @media (max-height: 499px) and (max-width: 899px), (max-width: 767px) {
    margin-bottom: 20px;
    font-size: 18px;
  }
}
.content {
  & > div {
    display: flex;
  }
}
.card_type {
  display: flex;
  justify-content: center;
  margin-bottom: 45px;
  padding-top: 20px;
  & > button {
    width: calc((100% - 120px) / 4);
    margin: 0 15px;
    background: $violetBorder;
    padding: 20px 15px 25px;
    border-radius: 16px;
    border: 1px solid transparent;
    div {
      display: flex;
      justify-content: center;
      margin-bottom: 10px;
      span {
        width: 24px;
        height: 24px;
        min-width: 24px;
        min-height: 24px;
        margin: 0 2px;
        &.card {
          img {
            mix-blend-mode: luminosity;
            opacity: 0.6;
          }
        }
      }
    }
    p {
      font-size: 16px;
      color: $violetLight;
      font-weight: 700;
      text-transform: capitalize;
      margin-bottom: 0;
    }
    &.selected {
      background-color: #fff;
      box-shadow: 0px 10px 50px -1px rgba(154, 131, 183, 0.25);
      border-color: $violetLight;
      .icon svg path {
        @include transition();
        fill: $violet;
      }
      .card {
        img {
          @include transition();
          mix-blend-mode: initial;
          opacity: 1;
        }
      }
      p {
        @include transition();
        color: $violet;
      }
    }
  }
}
</style>