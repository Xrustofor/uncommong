<template>
  <ValidationObserver ref="observer" tag="div" class="fields" v-slot="{invalid}">
    <p class="fields__title">
      Editing “Published {{ fields.published }}” for {{ individual.name }}
    </p>
    <ValidationProvider
        tag="div"
        class="fields__field"
        name="fundraiser"
        :rules="{ required: true, max: 200 }"
        v-slot="{ errors }"
    >
      <textarea
          v-model="postLocal"
          :class="errors.length !== 0 ? 'in-valid' : ''"
          type="text"
          placeholder="Enter the Upload"
      />
      <span class="error">{{ errors[0] }}</span>
    </ValidationProvider>
    <div class="fields__actions">
      <button class="btn btn-cancel" @click="$emit('close')">Cancel</button>
      <LoaderButton
          :disabled="invalid"
          class="btn-yellow"
          text="Save & Publish"
          :loading="isLoading"
          @emitClick="upload"
      ></LoaderButton>
    </div>
  </ValidationObserver>
</template>

<script>
import {ValidationObserver, ValidationProvider} from 'vee-validate';
import IconBase from '@/components/IconBase';
import IconDelete from '@/components/icons/iconDelete';
import LoaderButton from "@/components/buttons/loaderButton.vue";
import {mapGetters, mapState} from "vuex";

export default {
  components: {
    IconDelete,
    IconBase,
    LoaderButton,
    ValidationObserver,
    ValidationProvider,
  },
  props: {
    fields: {
      type: Object,
      default: {},
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
      required: true,
    }
  },
  data() {
    return {
      postLocal: this.fields.post,
    }
  },
  watch: {
    fields(val) {
      this.postLocal = val.post;
    }
  },
  computed: {
    ...mapState('individual', ['fundraiser', 'individual']),
  },
  methods: {
    upload() {
      this.$emit('upload', {post: this.postLocal, id: this.fields.id});
    }
  },
}
</script>

<style lang="scss" scoped>
.fields {
  padding: 0 90px;

  &__title {
    font-weight: 800;
    font-size: $fs5;
    line-height: $lh5;
    text-align: center;
    color: $black;
    padding-bottom: 55px;
  }

  &__field {
    margin-top: 20px;
    max-width: 600px;
    width: 100%;

    label {
      padding: 0 0 8px 24px;
      font-size: $fs5;
      line-height: $lh5;
    }

    input {
      font-size: $fs5;
      line-height: $lh5;
    }
  }

  &__actions {
    display: grid;
    grid-template-columns: auto auto auto;
    grid-gap: 25px;
    justify-content: center;
    margin-top: 30px;

    .btn-delete {
      display: flex;
      align-items: center;
      color: #317d9b;
      background-color: transparent;
      border: solid 1px transparent;

      &:hover {
        border: solid 1px #317d9b;
      }
    }

    .btn {
      line-height: 120%;
      white-space: normal;
    }
  }

  @media (max-width: $md) {
    padding: 0;
    &__actions {
      grid-gap: 20px;
    }
  }
  @media (max-width: $xs) {
    &__actions {
      grid-template-columns: auto auto;

      .btn-yellow {
        grid-column: 1/-1;
      }
    }
  }
}
</style>
