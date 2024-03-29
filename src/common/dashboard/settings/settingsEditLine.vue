<template>
  <div class="box_column_header">
    <div class="left_part">
      <div class="title">
        <div
          v-if="image"
          :style="{ backgroundImage: 'url(' + image + ')' }"
          class="title_image"
        />
        <h5>{{ title }}</h5>
      </div>
      <slot name="leftPart"></slot>
    </div>
    <div class="search_part"><slot name="search"></slot></div>

    <div class="right_part">
      <slot name="rightPart"></slot>
      <div v-if="editRight">
        <div v-if="editDisabled">
          <ImageButton
            title="Edit"
            :img="{ alt: 'edit', path: 'edit.svg' }"
            @buttonEmit="editDisabledChange"
          ></ImageButton>
        </div>
        <div v-else class="edit_button">
          <ImageButton
            title="Save changes"
            :img="{ alt: 'save', path: 'save.svg' }"
            @buttonEmit="saveChanges"
          ></ImageButton>

          <ImageButton
            title="Discard changes"
            :img="{ alt: 'remove', path: 'close-circle.svg' }"
            @buttonEmit="discardChanges"
            :disabled="!somethingChanged"
          ></ImageButton>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ImageButton from "@/components/buttons/imageButton.vue";
export default {
  props: {
    editPart: {
      type: Boolean,
      default: true,
    },
    title: { type: String },
    image: { type: String },
    editDisabled: {
      type: Boolean,
      default: true,
    },
    somethingChanged: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      editRight: this.editPart,
    };
  },
  watch: {
    editPart() {
      this.editRight = this.editPart;
    },
  },
  methods: {
    editDisabledChange() {
      this.$emit("editDisabledChange", true);
    },
    discardChanges() {
      this.$emit("discardChanges", true);
    },
    saveChanges() {
      this.$emit("saveChanges", true);
    },
  },
  components: {
    ImageButton,
  },
};
</script>
<style lang="scss" scoped>
.right_part {
  display: flex;
  .edit_button {
    @media only screen and (max-width: 768px) {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      button {
        margin: 2px 0;
      }
    }
  }
}
.left_part {
  display: flex;
  align-items: center;
  a {
    margin-right: 20px;
    @media only screen and (max-width: 1399px) {
      margin-right: 10px;
    }
    @media only screen and (max-width: 998px) {
      margin-right: 5px;
    }
  }
  h5 {
    font-size: 24px;
    font-weight: 900;
    color: #000;
    @media only screen and (max-width: 1399px) {
      font-size: 20px;
    }
    @media only screen and (max-width: 998px) {
      font-size: 18px;
    }
  }
}
.rotate {
  transform: rotate(45deg);
}
.title {
  display: flex;
  align-items: center;
  &_image {
    width: 40px;
    height: 40px;
    min-width: 40px;
    min-height: 40px;
    border-radius: 50%;
    background-size: cover;
    background-position: center;
    margin-right: 20px;
    @media only screen and (max-width: 1399px) {
      margin-right: 10px;
    }
    @media only screen and (max-width: 998px) {
      width: 30px;
      height: 30px;
      min-width: 30px;
      min-height: 30px;
    }
  }
}
.select_no_overlay {
  display: flex;
  width: auto;
  margin: 0 0 0 2.5rem;
  p {
    font-size: 13px;
    margin: 0 5px 0 0;
  }
  .settings_select {
    min-width: 15rem;
  }
}
.search_part {
  max-width: 40%;
  min-width: 230px;
  width: 400px;
  &:empty {
    display: none;
  }
}
</style>