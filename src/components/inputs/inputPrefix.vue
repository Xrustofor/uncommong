<template>
  <div class="input_block">
    <input
      id="input-prefix"
      type="text"
      :placeholder="placeholder"
      v-model="input"
      required
      :disabled="disabled"
    />
    <span class="input_left">{{ prefix }}</span>
  </div>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: 'Enter amount (USD)',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    prefix: {
      type: String,
      default: '$',
    },
    value: [String, Number],
  },
  data() {
    return {
      input: this.value || '',
    }
  },
  watch: {
    value(val) {
      this.input = val
    },
    input(val) {
      this.input = String(val).replace(/[^\d]/g, '')
      if (+val[0] === 0) this.input = val.substr(1)
      this.$emit('input', this.input)
    },
  },
}
</script>
<style lang="scss" scoped>
@import '@/assets/style/variables.scss';

.input_block {
  position: relative;
  padding: 5px 5px 5px 30px;
  border-radius: 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  input {
    border: 0;
    font-style: normal;
    font-weight: normal;
    font-size: 1.8rem;
    color: $websiteViolet;
    & + span.input_left {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 35px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 18px;
      color: $websiteViolet;
      opacity: 0;
    }
    &:required:invalid {
      & + span.input_left {
        opacity: 0;
      }
      &:focus {
        & + span.input_left {
          opacity: 1;
        }
      }
    }
    &:required:valid {
      & + span.input_left {
        opacity: 1;
      }
    }
  }
}
.goal {
  padding: 0;
  input {
    max-width: 51rem;
    font-family: inherit;
    font-size: 18px;
    line-height: 28px;
    font-weight: 600;
    text-transform: none;
    height: 6rem;
    color: $violet;
    background: $white;
    border: 1px solid #efefef;
    border-radius: 3rem;
    padding-left: 35px;
    padding-right: 2rem;
    margin: 0;
    transition: all 0.3s ease 0s;
    & + span.input_left {
      color: $violet;
      left: 20px;
      font-weight: 600;
    }
  }
}
</style>
