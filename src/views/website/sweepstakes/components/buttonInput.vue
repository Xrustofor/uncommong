<template>
  <div class="input_block">
    <input 
      type="text"
      :placeholder="placeholder"
      v-model="input"
      required :disabled="!banInput"
    />
    <span class="input_left">$</span>
    <loaderButton
      class="btn-yellow"
      text="DONATE"
      :disabled="(!input && !banInput) || !value"
      :loading="loading"
      @emitClick="send()"
    />
  </div>
</template>
<script>

import LoaderButton from '@/components/buttons/loaderButton.vue';

export default {
  props: {
    placeholder: {
      type: String,
      default: 'Enter amount (USD)',
    },
    disabledBtn: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    value: [String, Number],
    banInput: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    LoaderButton,
  },
  data: () => {
    return {
      input: '',
    }
  },
  watch: {
    value(val) {
      this.input = val;
    },
    input(val) {
      this.input = String(val).replace(/[^\d]/g, '');
      if (+val[0] === 0) {
        this.input = val.substr(1)
      }
      this.$emit('input', this.input);
    },
  },
  methods: {
    send() {
      this.$emit('send', this.input);
    },
  },
}
</script>
<style lang="scss" scoped>
.input_block {
  position: relative;
  padding: 5px 5px 5px 15px;
  border-radius: 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  input {
    border: 0;
    font-size: 16px;
    color: $websiteViolet;
    & + span.input_left {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 18px;
      color: $websiteViolet;
      opacity: 0;
      line-height: 1;
      font-weight: 500;
    }
    padding-left: 10px;
    transition: padding 0.3s ease;
    &:required:invalid {
      & + span.input_left {
        opacity: 0;
      }
      &:focus {
        padding-left: 20px;
        & + span.input_left {
          opacity: 1;
        }
      }
    }
    &:required:valid {
      padding-left: 20px;
      & + span.input_left {
        opacity: 1;
      }
    }
  }
}

.fundraiser {
  margin-top: 20px;
  border: 1px solid #bdbdbd;
  border-radius: 40px;

  ::v-deep.btn {
    font-weight: 700;
    min-width: 125px;
    box-shadow: none;
  }
}
</style>
