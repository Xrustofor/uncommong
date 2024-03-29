<template>
  <div class="modal_form">
    <h3 v-if="title">{{title}}</h3>
    <p v-if="description">{{description}}</p>
    <ul class="button_group">
      <li
        v-for="(item, key) in buttonItems"
        :key="`button-${key}`"
      >
        <loaderButton
          :class="item.bgColorName"
          :text="item.name"
          @emitClick="send(item.url)"
        />
      </li>
    </ul>
  </div>
</template>
<script>

import LoaderButton from "@/components/buttons/loaderButton.vue";

export default {
  props:{
    title: String,
    description: String,
    buttonItems: Array
  },
  components: {
    LoaderButton
  },
  methods:{
    send(url){
      this.$router.push(url);
    }
  }
  
}
</script>
<style lang="scss" scoped>
  .modal_form{
    padding-top: 2rem;
    h3{
      font-family: Inter;
      font-style: normal;
      font-weight: 800;
      font-size: 2rem;
      text-align: center;
      color: $websiteViolet;
      margin-bottom: 1.8rem;
    }
    p{
      font-family: Inter;
      font-style: normal;
      font-weight: normal;
      font-size: 1.4rem;
      color: $websiteViolet;
      margin-bottom: 1.8rem;
    }
    .button_group{
      display: flex;
      text-align: center;
      justify-content: center;
      flex-wrap: wrap;
      li{
        margin: 1rem;
      }
    }
  }
</style>