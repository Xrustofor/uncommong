<template>
  <div
    class="image_overlay"
    :style="{
      borderColor: iconColor,
      borderStyle: url ? 'solid' : 'dashed',
      backgroundImage: url ? `url(${url})` : '',
    }"
  >
    <div class="actions">
      <span class="icon" @click="$emit('removeImage')">
        <icon-base
          width="18"
          height="21"
          viewBox="0 0 18 21"
          icon-name="delete"
          :icon-color="iconColor"
        >
          <iconDelete />
        </icon-base>
      </span>
      <span class="icon">
        <input
          class="hidden"
          type="file"
          :name="`image_${id}`"
          :id="id"
          @change="onChange"
          ref="file"
          :accept="accept"
        />
        <label :for="id">
          <icon-base
            width="19"
            height="20"
            viewBox="0 0 19 20"
            icon-name="edit"
            :icon-color="iconColor"
          >
            <iconEdit />
          </icon-base>
        </label>
      </span>
    </div>
  </div>
</template>
<script>
import IconBase from "@/components/IconBase";
import iconEdit from "@/components/icons/iconEdit";
import iconDelete from "@/components/icons/iconDelete";

const fileUpload = require("fuctbase64");
export default {
  props: {
    id: { type: [String, Number], default: 1 },
    url: { type: String, default: "" },
    iconColor: { type: String, default: "#63517A" },
    accept: {
      type: Array,
      default: function () {
        return ["image/png", "image/jpg"];
      },
    },
  },
  components: {
    IconBase,
    iconEdit,
    iconDelete,
  },
  data() {
    return {
      formatTypeMessage: "",
    };
  },
  created() {
    this.formatType();
  },
  methods: {
    formatType() {
      this.formatTypeMessage = this.accept.join("/");
    },
    async onChange(event) {
      let accept = this.accept;

      event.target.files.forEach((element, id) => {
        let sizeMB = parseFloat(element.size / (1024 * 1024)).toFixed(2);

        let typeValid = accept.includes(element.type),
          sizeValid = sizeMB < 2,
          valid = typeValid && sizeValid;

        if (valid) {
          this.toBase64(event);
        } else {
          if (!sizeValid) {
            let instance = this.$toast.error(
              "Please select image size less than 2 MB",
              {
                position: "top",
                duration: 5000,
                queue: true,
              }
            );
          }
          if (!typeValid) {
            let instance = this.$toast.error(
              `Please select image in ${this.formatTypeMessage} format`,
              {
                position: "top",
                duration: 5000,
                queue: true,
              }
            );
          }
          this.$emit("validationError");
        }
      });
    },
    async toBase64(event) {
      let base64;
      await fileUpload(event).then((data) => {
        base64 = "data:image/jpeg;base64," + data.base64;
      });
      this.$emit("createBase64", base64);
    },
  },
};
</script>
<style lang="scss" scoped>
.image_overlay {
  display: flex;
  align-items: flex-end;
  width: 325px;
  height: 160px;
  border-radius: 20px;
  border: 2px dashed transparent;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(../../assets/img/teamDefaultImage.png);
  .actions {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    padding: 8px 13px 10px;
    background: #fff;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    .icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      margin-left: 10px;
    }
  }
}

.hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}
</style>