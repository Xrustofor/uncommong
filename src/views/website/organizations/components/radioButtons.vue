<template>
  <ul class="radio_buttons" v-if="options.length">
    <li class="radio" v-for="(item, key) in options" :key="`radio_${key}`">
      <input
        type="radio"
        :id="item.id"
        name="contact"
        :value="item.id"
        :checked="item.active"
        v-model="select"
      >
      <label :for="item.id">{{item.name}}</label>
    </li>
  </ul>
</template>
<script>
export default {
  props: {
    options:{
      type: Array,
      default(){
        return [];
      },
    } ,
  },
  data(){
    return {
      select: null
    }
  },
  created(){
    const element = this.options.find(o => o.active);
    if(element) this.select = element.id;
  },
  watch: {
    select(val){ this.$emit('input', val)},
  }
}
</script>
<style lang="scss" scoped>
  .radio_buttons{
    display: flex;
    width: 100%;
    flex-direction: row;
    margin: 0;
    padding: 0;
    .radio{
      list-style: none;
      margin: 0;
      width: 50%;
      input[type=radio] { display: none }
      label{
        display: flex;
        align-content: center;
        justify-content: center;
        border: 1px solid #63517a;
        background: #fff;
        color: #63517A;
        padding: 1rem;
        cursor: pointer;
        border-radius: 16px;
        transition: .3s linear all;
      }
      &:first-child label{ 
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
      &:last-child label{ 
        border-top-left-radius: 0; 
        border-bottom-left-radius: 0;
      }
      input:checked~label{
        border: 1px solid #63517a;
        background: #63517a;
        color: #fff;
        transition: .3s linear all;
      }
      
    }
  }
</style>