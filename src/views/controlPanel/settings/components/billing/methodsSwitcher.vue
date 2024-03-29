<template>
  <button @click.prevent="changeForm">
    <div v-if="methodType === 1">
      <span class="card">
        <img :src="require(`@/assets/img/visaCard.svg`)" alt="visa" />
      </span>
      <span class="card">
        <img
          :src="require(`@/assets/img/masterCardIcon.svg`)"
          alt="mastercard"
        />
      </span>
    </div>
    <div v-if="methodType === 2">
      <span class="icon"
        ><svg width="24" height="24" viewBox="0 0 24 24">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M4 11.5V15.5C4 16.33 4.67 17 5.5 17C6.33 17 7 16.33 7 15.5V11.5C7 10.67 6.33 10 5.5 10C4.67 10 4 10.67 4 11.5ZM10 11.5V15.5C10 16.33 10.67 17 11.5 17C12.33 17 13 16.33 13 15.5V11.5C13 10.67 12.33 10 11.5 10C10.67 10 10 10.67 10 11.5ZM3.5 22H19.5C20.33 22 21 21.33 21 20.5C21 19.67 20.33 19 19.5 19H3.5C2.67 19 2 19.67 2 20.5C2 21.33 2.67 22 3.5 22ZM16 11.5V15.5C16 16.33 16.67 17 17.5 17C18.33 17 19 16.33 19 15.5V11.5C19 10.67 18.33 10 17.5 10C16.67 10 16 10.67 16 11.5ZM10.57 1.49001L2.67 5.65001C2.26 5.86001 2 6.29001 2 6.75001C2 7.44001 2.56 8.00001 3.25 8.00001H19.76C20.44 8.00001 21 7.44001 21 6.75001C21 6.29001 20.74 5.86001 20.33 5.65001L12.43 1.49001C11.85 1.18001 11.15 1.18001 10.57 1.49001Z"
            fill="#9A83B7"
          />
        </svg>
      </span>
    </div>
    <p>{{ title }}</p>
  </button>
</template>
<script>
export default {
  props: {
    title: { type: String },
    methodType: { type: Number },
  },
  data() {
    return {};
  },
  methods: {
    changeForm() {
      this.$emit("changeForm", this.methodType);
    },
  },
};
</script>
<style lang="scss" scoped>
button {
  width: 150px;
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
    box-shadow: 0px 10px 100px -1px rgba(154, 131, 183, 0.25);
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
</style>