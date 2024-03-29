<template>
  <div>
    <h3>Update Payment Method</h3>
    <div class="content">
      <div>
        <CreditCardInfo
          v-if="type === 1"
          :item="item"
          :defaultEl="defaultEl"
          @hideModal="hideModal"
          @updateMethod="updateMethod"
        ></CreditCardInfo>
        <BankAccountInfo
          v-else-if="type === 2"
          :item="item"
          :defaultEl="defaultEl"
          @hideModal="hideModal"
          @updateMethod="updateMethod"
        ></BankAccountInfo>
      </div>
    </div>
  </div>
</template>
<script>
import CreditCardInfo from "./editCardModal.vue";
import BankAccountInfo from "./editBankModal.vue";
export default {
  props: {
    type: { type: Number },
    item: { type: Object },
    defaultEl: {
      type: Boolean,
    },
  },
  methods: {
    hideModal() {
      this.$emit("hideEditMethodModal");
    },
    updateMethod(data) {
      this.$emit("updateMethod", data);
    },
  },
  components: {
    BankAccountInfo,
    CreditCardInfo,
  },
};
</script>
<style lang="scss" scoped>
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
</style>