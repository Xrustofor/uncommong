<template>
  <div class="fields">
    <p class="fields__title">
      Editing “Published {{ fields.published}}” for {{ team.name }}
    </p>
    <div class="ckeditor-upload">
      <ckeditor
        :disabled="false"
        :editor="editor"
        v-model="editorData"
        :config="editorConfig"
      />
    </div>
    <div class="fields__actions">
      <button class="btn btn-cancel" @click="$emit('close')">Cancel</button>
      <LoaderButton
          :disabled="!editorData"
          class="btn-yellow"
          text="Save & Publish"
          :loading="isLoading"
          @emitClick="upload"
      ></LoaderButton>
    </div>
  </div>
</template>

<script>
import {ValidationObserver, ValidationProvider} from 'vee-validate';
import IconBase from '@/components/IconBase';
import IconDelete from '@/components/icons/iconDelete';
import LoaderButton from "@/components/buttons/loaderButton.vue";
import {mapState} from "vuex";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

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
      editorData: this.fields.post,
      editor: ClassicEditor,
      editorConfig: {
        toolbar: [""],
      }
    }
  },
  computed: {
    ...mapState('team', ['fundraiser', 'team']),
  },
  watch: {
    fields(val) {
      this.editorData = val.post;
    }
  },
  methods: {
    upload() {
      this.$emit('upload', {post: this.editorData, id: this.fields.id});
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
