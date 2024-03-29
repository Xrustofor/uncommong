<template>
  <div class="drop_overlay">
    <div v-if="readyImage" class="drop_overlay_image">
      <button :class="disabled ? 'disabled' : ''" @click.prevent="clean">
        <icon-base
          class="icon"
          width="15"
          height="15"
          icon-name="edit"
          icon-color="#63517A"
        >
          <icon-edit />
        </icon-base>
        <span>
          {{ filelist != null ? filelist : "Edit" }}
        </span>
      </button>
      <img v-if="image" :src="image" />
    </div>
    <div
      @dragover="dragover"
      @dragleave="dragleave"
      @drop="drop"
      class="drop"
      :class="errors ? 'error' : ''"
      v-else
    >
      <input
        type="file"
        name="fields[assetsFieldHandle][]"
        id="assetsFieldHandle"
        @change="onChange"
        ref="file"
        :accept="accept"
        :disabled="disabled"
      />

      <div class="text">
        Drag and Drop <br />
        or <br /><label for="assetsFieldHandle">
          <span class="underline">Browse</span>
        </label>
      </div>
    </div>

    <h6 class="error_type" v-if="typeError != null">{{ typeError }}</h6>
    <div v-if="errors != null">
      <h6 class="error_type" v-for="(error, id) in errors" :key="id">
        <span v-for="(i, id) in error" :key="id">{{ i }}</span>
      </h6>
    </div>
  </div>
</template>
<script>
import IconBase from "@/components/IconBase";
import iconEdit from "@/components/icons/iconEdit";
export default {
  props: {
    accept: { type: String },
    saveError: { type: Object, require: false },
    reset: { type: Boolean, default: false },
    disabled: { type: Boolean, require: false },
    image: { type: String, require: false },
  },
  components: {
    IconBase,
    iconEdit,
  },
  data() {
    return {
      filelist: null,
      typeError: null,
      errors: null,
      readyImage: false,
    };
  },
  watch: {
    saveError() {
      this.filelist = null;
      this.errors = this.saveError;
    },
    reset() {
      this.reset ? this.clean() : false;
    },
    image() {
      if (this.image != null) {
        this.readyImage = true;
      }
    },
  },
  methods: {
    async onChange(event) {
      var size = parseFloat(event.target.files[0].size / (1024 * 1024)).toFixed(2);
      if (size > 2) {
        let instance = this.$toast.error(
          "Please select image size less than 2 MB",
          {
            position: "top",
            duration: 5000,
            queue: true,
          }
        );
      } else {
        this.filelist = this.$refs.file.files[0].name;
        this.$emit("upload", { event: event, switcher: true });
        this.readyImage = false;
      }
    },
    drop(event) {
      event.preventDefault();

      this.$refs.file.files = event.dataTransfer.files;
      var accept = this.accept.split(","),
          eventEl = { target: { files: event.dataTransfer.files } };

      if (accept.includes(this.$refs.file.files[0].type)) {
        this.onChange(eventEl);
      } else {
        this.typeError = "Incorrect type";
        event.currentTarget.classList.add("error");
      }
    },
    dragover(event) {
      event.preventDefault();
      this.$emit("dragoverEmit");
      this.clean(event);
      if (!event.currentTarget.classList.contains("active")) {
        event.currentTarget.classList.add("active");
      }
    },
    dragleave(event) {
      this.$emit("dragleaveEmit");
      event.currentTarget.classList.remove("active");
    },
    clean(event) {
      if (!this.disabled) {
        this.readyImage = false;
        this.filelist = null;
        this.typeError = null;
        this.errors = null;
        this.$emit("upload", { event: event, switcher: false });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.drop_overlay {
  margin-bottom: 20px;
  &_image {
    img {
      max-width: 150px;
    }
  }
  button {
    font-size: 14px;
    font-weight: 700;
    color: $violet;
    margin: 5px 0 15px 0;
    cursor: pointer;
    &.disabled {
      opacity: 0.6;
      cursor: default;
    }
    .icon {
      margin-right: 8px;
    }
  }
}
.drop {
  border: 1px dashed $violet;
  background-color: transparent;
  padding: 20px;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  &.active {
    background: rgba($color: $disabledColor, $alpha: 0.1);
  }
  &.error {
    border-color: $red;
  }
  label {
    width: auto;
    font-size: 12px;
    font-weight: 600;
    span {
      margin: 0;
      padding: 0;
      font-size: 12px;
      font-weight: 600;
    }
  }
  input {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    opacity: 0;
  }
  .text {
    color: $violet;
    font-size: 12px;
    font-weight: 600;
    line-height: 1.5;
    text-align: center;
  }
}
h6.error_type {
  padding: 15px 0 0;
  font-size: 12px;
  color: $red;
}
</style>