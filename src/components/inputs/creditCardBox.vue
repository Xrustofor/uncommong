<template>
  <div class="card_wrap">
    <div class="name">{{brand}}</div>
    <div class="count">{{`&bull;&bull;&bull;&bull;&bull;${last4}`}}</div>
    <div class="date">{{`${month}/${expYear}`}}</div>
    <div class="cvc" :class="cvc ? 'active': ''">
      <slot name="right"></slot>
    </div>
  </div>
</template>
<script>
export default {
  props:{
    brand: { type: String, default: 'visa' },
    last4: { type: [Number, String], default: '0000' },
    cvc: {type: Boolean, default: true},
    expMonth: { 
      type: [Number, String],
      default(){
        const month = this.$moment().format("MM");
        return month;
      },
    },
    expYear: { 
      type: [Number, String],
      default(){
        const year = this.$moment().format("YYYY");
        return +year + 5;
      }
    },
  },
  computed: {
    month(){
      return +this.expMonth < 10 ? '0' + this.expMonth : this.expMonth;
    }
  }
}
</script>
<style lang="scss" scoped>
  .card_wrap{
    padding: 15px 20px;
    border: 1px solid $fieldBorderColor;
    border-radius: 40px;
    display: flex;
    align-items: center;
    align-items: center;
    color: $violetDark;
    &>div{
      margin: 0 .6rem;
      color: #A098AB;
      font-size: 1.4rem;
      &:first-child{ margin-left: 0}
      &:last-child{ margin-right: 0}
    }
    .count{ flex: 1 }
    .cvc{
      height: 14px;
      &.active{
        min-width: 35px;
      }
    }
  }

</style>