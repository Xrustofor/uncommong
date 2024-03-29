<template>
  <div class="donations_table">
    <p class="title">Pick an amount</p>
    <div class="donations_table_donate-list">
      <a
        href="#"
        class="btn btn-white btn--fundraiser"
        :class="item.active ? 'active' : ''"
        v-for="(item, key) in elements"
        :key="`donate-${key}`"
        :value="item.value"
        @click.prevent="
          selectedItem = item.value
          processing(key)
        "
        >donate ${{ item.value }}</a
      >
    </div>
    <p class="title">Or enter custom amount</p>
    <form>
      <NumberInput
        placeholder="Enter amount (USD)"
        :value="selectedItem"
        @input="numberInput($event)"
      ></NumberInput>
      <LoaderButton
        class="btn btn-yellow"
        :disabled="!selectedItem"
        :loading="loading"
        text="DONATE"
        @emitClick="$emit('click', selectedItem)"
      ></LoaderButton>
    </form>
  </div>
</template>
<script>
import LoaderButton from '@/components/buttons/loaderButton.vue';
import NumberInput from '@/components/inputs/numberInput.vue';

export default {
  props: {
    items: {
      type: Array,
      default: [1],
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    LoaderButton,
    NumberInput,
  },
  data() {
    return {
      selectedItem: null,
      elements: [
        {
          value: null,
          active: false,
        },
      ],
    }
  },
  created() {
    this.elements = this.items.map((i) => ({ value: i, active: false }));
  },
  computed: {
    isSelected() {
      return this.elements.find((e) => e.active);
    },
  },
  methods: {
    numberInput(val) {
      let items = [];
      items = this.elements.map((e) => {
        return +e.value === +val ? { ...e, active: true } : { ...e, active: false };
      })

      this.elements = items;

      if (!this.isSelected) {
        this.selectedItem = +val;
      } else {
        this.selectedItem = +this.isSelected.value;
      }
    },
    processing(index) {
      const items = this.elements.map((e, key) => {
        return index === key ? { ...e, active: true } : { ...e, active: false };
      })
      this.elements = items;
    },
  },
}
</script>
<style lang="scss" scoped>
@import '@/assets/style/variables.scss';

.donations_table {
  border-radius: 10px;
  border: 1px solid $websiteViolet;
  background-color: white;
  padding: 48px 64px 56px;
  margin-bottom: 90px;
  border: 1px solid #4b3d5b;
  box-shadow: 0px 24px 20px rgba(154, 131, 183, 0.05), 0px 3px 2px rgba(154, 131, 183, 0.02),
    0px 8px 100px rgba(154, 131, 183, 0.1);
  border-radius: 20px;
  @media only screen and (max-width: 1299px) {
    padding: 40px 35px;
  }
  @media only screen and (max-width: 499px) {
    padding: 30px 20px;
  }
  p {
    font-size: 14x;
    font-weight: 700;
    line-height: 1.4;
    margin-bottom: 30px;
    color: $websiteViolet;
  }
  &_donate-list {
    width: calc(100% + 52px);
    margin-left: -26px;
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 20px;
    @media only screen and (max-width: 768px) {
      width: calc(100% + 30px);
      margin-left: -15px;
    }
    @media only screen and (max-width: 599px) {
      width: calc(100% + 20px);
      margin-left: -10px;
    }
    @media only screen and (max-width: 399px) {
      width: calc(100% + 10px);
      margin-left: -5px;
    }
  }
  .btn-white {
    font-size: 14px;
    font-weight: 500;
    color: $websiteViolet;
    text-transform: uppercase;
    min-width: calc((100% - 208px) / 4);
    width: calc((100% - 208px) / 4);
    margin: 0 26px 27px;
    padding: 0;
    &:hover {
      color: #fff;
    }
    &.active {
      color: $white;
      background: $violet;
    }
    @media only screen and (max-width: 768px) {
      min-width: calc((100% - 90px) / 3);
      width: calc((100% - 90px) / 3);
      margin: 0 15px 20px;
    }
    @media only screen and (max-width: 599px) {
      width: calc((100% - 40px) / 2);
      min-width: auto;
      margin: 0 10px 20px;
    }
    @media only screen and (max-width: 399px) {
      font-size: 13px;
      width: calc((100% - 20px) / 2);
      margin: 0 5px 20px;
    }
  }
  form {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 40px;
    border: 1px solid #bbbbbb;
    padding-right: 5px;
    box-shadow: 0 24px 20px rgba($color: #9a83b7, $alpha: 0.05);
    @media only screen and (max-width: 499px) {
      flex-wrap: wrap;
      border: 1px solid transparent;
    }
    .btn {
      font-weight: 700;
      min-width: 125px;
      color: #454545;
      box-shadow: none;
      @media only screen and (max-width: 499px) {
        width: 100%;
      }
    }
    input {
      max-width: 100%;
      height: 7rem;
      padding-left: 35px;
      border: none;
      border-radius: 40px;
      @media only screen and (max-width: 1299px) {
        height: 6rem;
      }
      @media only screen and (max-width: 499px) {
        border: 1px solid #bbbbbb;
        margin-bottom: 15px;
      }
    }
  }
  .btn-link {
    font-size: 14px;
    font-weight: 400;
  }
}

.fundraiser {
  padding: 0;
  border: none;
  box-shadow: none;
  margin: 0;

  .donations_table_donate-list {
    justify-content: center;
  }

  .btn--fundraiser {
    min-width: 140px;
    margin: 25px 10px 0;
  }
  .title:first-child {
    margin-bottom: 0;
  }
  .title {
    margin-bottom: 20px;
  }
  @media (max-width: $xs) {
    .donations_table_donate-list {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 10px;
    }
    .btn--fundraiser {
      width: 100%;
      min-width: 0px;
      margin: 20px 0 0;
    }
  }
}
</style>
