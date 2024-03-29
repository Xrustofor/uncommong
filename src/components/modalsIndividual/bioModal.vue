<template>
  <div class="fields">
    <p class="fields__title">Editing “Our Story” for {{individual.name}}</p>
    <div id="ckeditor" class="scrolable" ref="ckeditor">
      <ckeditor
        :disabled="false"
        :editor="editor"
        v-model="editorData"
        :config="editorConfig"
        @input="saveCkeditor"
      />
    </div>
    <div class="fields__actions">
      <button class="btn btn-cancel" @click="cancel">Cancel</button>
      <LoaderButton
        :disabled="!editorData"
        class="btn-yellow"
        text="Save & Publish"
        :loading="isLoading"
        @emitClick="$emit('upload', editorData)"
      />
    </div>
  </div>
</template>

<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import UploadAdapter from '@/plugins/ckeditor5/upload-adapter';
import LoaderButton from "@/components/buttons/loaderButton.vue";
import {mapState} from "vuex";

export default {
  components: {LoaderButton},
  props: {
    isLoading: {
      type: Boolean,
      default: false,
      required: true,
    },
    value: {
      type: String,
      default: '',
    }
  },
  data() {
    return {
      editorData: this.value,
      editor: ClassicEditor,
      editorConfig: {
        extraPlugins: [this.uploader],
        mediaEmbed: {
          previewsInData: true,
        },
        toolbar: [
          "heading",
          "|",
          "alignment",
          "|",
          "bold",
          "italic",
          "mediaEmbed",
          "|",
          "bulletedList",
          "numberedList",
          "|",
          "ImageUpload",
          "mediaEmbed",
          "|",
          "undo",
          "redo",
        ],
      },
    }
  },
  computed: {
    ...mapState('individual', ['fundraiser', 'individual']),
  },
  watch: {
    value(val) {
      val ? this.editorData = val : this.editorData = '';
    }
  },
  methods: {
    cancel() {
      this.editorData = this.value;
      this.$emit('cancel');
    },
    async uploader(editor) {
      const router = '/upload-ckeditor-image/individual';
      editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return new UploadAdapter(loader, router, true);
      }
    },
    getArrayDeletedImages(vueValue) {
      const editorImgItems = JSON.parse(localStorage.getItem("editorImgItems"));

      const itemsToDelete = [];
      const itemsToSave = []

      if (editorImgItems && vueValue.length) {
        editorImgItems.forEach(e => {
          if (!vueValue.includes(e)){
            itemsToDelete.push(e);
          }
          else {
            itemsToSave.push(e);
          };
        })
      }

      if (editorImgItems && !vueValue.length) {
        editorImgItems.forEach(i => itemsToDelete.push(i));
        localStorage.setItem("editorImgItems", JSON.stringify([]));
      }

      if (itemsToSave.length) {
        localStorage.setItem("editorImgItems", JSON.stringify(itemsToSave));
      }
      
      return itemsToDelete;
    },
    findImagesUrl(val) {
      const items = [];
      let toHtmlObject = document.createElement("div");
      toHtmlObject.innerHTML = val;
      let imgObj = toHtmlObject.getElementsByTagName("img");
      imgObj.forEach((img) => items.push(img.src));
      return items;
    },
    async saveCkeditor() {
      const html = this.editorData || "";
      if (html) {
        const urlImages = this.findImagesUrl(html);
        const itemsDeleted = this.getArrayDeletedImages(urlImages);

        if (itemsDeleted.length) {
          await this.$store.dispatch(
            'apiDeletedImagesCKEditor',
            {
              route: '/delete-ckeditor-image',
              data: itemsDeleted,
              isFundraser: true,
            }
          );
        }
      }
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
    grid-template-columns: auto auto;
    grid-gap: 80px;
    justify-content: center;
    margin-top: 30px;

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
}
</style>
