<template>
  <div
    class="drag-area"
    :class="{
      'drag-area--upload': !image,
      'drag-area--disabled': disabled,
      error: errors,
    }"
    :style="{ backgroundImage: image ? `url(${image})` : '' }"
  >
    <label v-show="image" for="browse" class="drag-area__edit">
      <icon-base
        width="19"
        height="20"
        viewBox="0 0 19 20"
        icon-name="edit"
        icon-color="#63517A"
      >
        <iconEdit />
      </icon-base>
    </label>
    <button
      v-show="image && isDeleteAvailable"
      class="drag-area__delete"
      @click="$emit('removeImage')"
    >
      <icon-base
        width="20"
        height="20"
        viewBox="0 0 20 20"
        icon-name="delete"
        icon-color="#63517A"
      >
        <iconDelete />
      </icon-base>
    </button>
    <div
      @dragover="dragover"
      @dragleave="dragleave"
      @drop="drop"
      class="drop-input"
    >
      <input
        class="drop-input__input"
        type="file"
        name="fields[browse][]"
        id="browse"
        @change="onChange"
        ref="file"
        :accept="accept"
        :disabled="disabled"
      />
      <label v-show="!image" class="drop-input__plus" for="browse">+</label>
      <label v-show="!image" class="drop-input__team" for="browse">
        <icon-base
          class="team-icon"
          width="89"
          height="81"
          viewBox="0 0 81 89"
          icon-color="#63517A"
        >
          <iconTeam />
        </icon-base>
      </label>
      <p v-show="!image" class="drop-input__text">
        Drag and Drop <br />or <br />
        <label for="browse"> Browse </label>
      </p>
      <template v-if="errors != null">
        <p class="drop-input__error">{{ typeError }}</p>
        <p class="drop-input__error" v-for="(error, id) in errors" :key="id">
          <span v-for="(i, id) in error" :key="id">{{ i }}</span>
        </p>
      </template>
    </div>
  </div>
</template>
<script>
import IconBase from "@/components/IconBase";
import iconEdit from "@/components/icons/iconEdit";
import iconDelete from "@/components/icons/iconDelete";
import iconTeam from '@/components/icons/iconTeam';

export default {
  props: {
    accept: { type: String },
    saveError: { type: Object },
    disabled: { type: Boolean },
    image: { type: String, require: true },
    isDeleteAvailable: { type: Boolean, default: true}
  },
  components: { IconBase, iconEdit, iconDelete, iconTeam },
  data() {
    return {
      fileList: null,
      typeError: null,
      errors: null,
    };
  },
  watch: {
    saveError() {
      this.fileList = null;
      this.errors = this.saveError;
    },
  },
  methods: {
    async onChange(event) {
      const size = parseFloat(
        event.target.files[0].size / (1024 * 1024)
      ).toFixed(2);
      if (size > 2) {
        this.$toast.error("Please select image size less than 2 MB", {
          position: "top",
          duration: 5000,
          queue: true,
        });
      } else {
        this.fileList = this.$refs.file.files[0].name;
        this.$emit("upload", event);
      }
    },
    drop(event) {
      event.preventDefault();

      this.$refs.file.files = event.dataTransfer.files;
      const accept = this.accept.split(",");
      const eventEl = { target: { files: event.dataTransfer.files } };

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
        this.fileList = null;
        this.typeError = null;
        this.errors = null;
        this.$emit("upload", { event: event, switcher: false });
      }
      //event.currentTarget.classList.remove("error");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/variables.scss";

.drag-area {
  width: 100%;
  height: 160px;
  border-radius: 20px;
  border: 2px solid $violet;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;

  &--disabled {
    opacity: 0.5;
    cursor: wait;
  }

  &--upload {
    border: 2px dashed #c4c4c4;
  }

  &__edit {
    position: absolute;
    right: 15px;
    bottom: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    background-color: $white;
    border-radius: 5px;
  }

  &__delete {
    position: absolute;
    right: 55px;
    bottom: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    background-color: $white;
    border-radius: 5px;
    padding-left: 2px;
  }
}

.drop-input {
  height: 100%;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;

  &.error {
    border-color: $red;
  }

  &__input {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    opacity: 0;
  }

  &__text {
    color: $violet;
    font-size: $fs3;
    line-height: $lh3;
    text-align: center;
    margin-bottom: 0;

    label {
      width: auto;
      font-weight: 600;
      text-decoration: underline;
    }
  }

  &__plus {
    display: none;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    font-size: 60px;
    color: #c4c4c4;
  }
  &__team {
    display: none;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  &__error {
    padding: 15px 0 0;
    font-size: 12px;
    color: $red;
  }
}

.mode-plus {
  .drop-input__text {
    display: none;
  }
  .drop-input__plus {
    display: flex;
  }
}

.mode-team {
  .drop-input__text {
    display: none;
  }
  .drop-input__team {
    display: flex;
  }
}

.mode-page-edit {
  height: 250px;
}
</style>
