<template>
  <ul class="section">
    <li
      v-for="(item, key) in options"
      :key="`card-${key}`"
      :class="item.value === value ? 'active' : ''"
      @click="$emit('input', item.value)"
    >
      <ul class="icons">
        <li class="icon"
          v-for="(icon, key) in item.icons"
          :key="`icon-${key}`"
        >
        <icon-base
          width="20"
          height="20"
          :icon-name="icon"
        >
          <component :is="icon" />
        </icon-base>
        </li>
      </ul>
      <span>{{item.title}}</span>
    </li>
  </ul>
</template>
<script>
import IconBase from "@/components/IconBase";
import iconVisaCard from "@/components/icons/iconVisaCard";
import iconMasterCard from "@/components/icons/iconMasterCard";
import iconBankAccount from "@/components/icons/iconBankAccount";

export default {
  props:{
    options: {
      type: Array,
      default: []
    },
    value:{
      type: String,
      default: ''
    }
  },
  components:{
    IconBase,
    iconVisaCard,
    iconMasterCard,
    iconBankAccount
  },
}
</script>
<style lang="scss" scoped>
  ul.section{
    display: flex;
    justify-content: center;
    &>li{
      opacity: 0;
      border-radius: 16px;
      cursor: pointer;
      margin: 0 1.5rem;
      min-width: 14rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1.5rem;
      background: $violetBorder;
      animation-name: emerging;
      animation-duration: 1s;  
      animation-fill-mode: forwards;
      @media (max-width: 425px) {
        min-width: 10rem;
        max-width: 11rem;
        width: 100%;
        margin: 0 1rem;
      }
    }
    &>li.active {
      transition: all ease .3s;
      background-color: #fff;
      box-shadow: 0px 10px 50px -1px rgba(154, 131, 183, 0.25);
      border-color: #9A83B7;
    }
  }
  ul.icons{
    display: flex;
    margin-bottom: 1rem;
    li{
      margin: 0 .7rem;
    }
  }


  @keyframes emerging {
    0% {
      opacity: 0;
      transition: opacity linear .3s;
    }   
    100% { 
      opacity: 1;
      transition: opacity linear .3s;
    }
   }
  
</style>