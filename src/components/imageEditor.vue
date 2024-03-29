<template>
  <div
    class="image-editor"
    :class="{ 'image-editor--upload': !url, 'image-editor--disabled': disabled }"
    :style="{
      borderColor: iconColor,
      borderStyle: url ? 'solid' : 'dashed',
      backgroundImage: url ? `url(${url})` : '',
    }"
  >
    <button class="icon-delete" @click="$emit('removeImage')">
      <icon-base
        width="20"
        height="20"
        viewBox="0 0 20 20"
        icon-name="delete"
        :icon-color="iconColor"
      >
        <iconDelete />
      </icon-base>
    </button>
    <input
      class="input-file"
      type="file"
      :name="`image_${id}`"
      :id="id"
      @change="onChange"
      ref="file"
      :accept="accept"
    />
    <label :for="id" class="upload-area">
      <icon-base
        class="team-icon"
        width="89"
        height="81"
        viewBox="0 0 81 89"
        :icon-color="iconColor"
      >
        <iconTeam />
      </icon-base>
      <icon-base
        class="edit-icon"
        width="19"
        height="20"
        viewBox="0 0 19 20"
        icon-name="edit"
        :icon-color="iconColor"
      >
        <iconEdit />
      </icon-base>
      <span class="plus">+</span>
    </label>
  </div>
</template>
<script>
import IconBase from '@/components/IconBase';
import iconEdit from '@/components/icons/iconEdit';
import iconDelete from '@/components/icons/iconDelete';
import iconTeam from '@/components/icons/iconTeam';

const fileUpload = require('fuctbase64');

export default {
  props: {
    disabled: {type: Boolean, default: false},
    id: { type: [String, Number], default: 1 },
    url: { type: String, default: '', required: true },
    iconColor: { type: String, default: '#63517A' },
    accept: {
      type: Array,
      default: function () {
        return ['image/png', 'image/jpg'];
      },
    },
  },
  components: { IconBase, iconEdit, iconDelete, iconTeam },
  data() {
    return {
      formatTypeMessage: '',
    }
  },
  created() {
    this.formatType()
  },
  methods: {
    formatType() {
      this.formatTypeMessage = this.accept.join('/');
    },
    async onChange(event) {
      let accept = this.accept;

      event.target.files.forEach((element, id) => {
        let sizeMB = parseFloat(element.size / (1024 * 1024)).toFixed(2)

        let typeValid = accept.includes(element.type),
            sizeValid = sizeMB < 2,
            valid = typeValid && sizeValid

        if (valid) {
          this.toBase64(event)
          this.$emit('upload', event)
        } else {
          if (!sizeValid) {
            let instance = this.$toast.error('Please select image size less than 2 MB', {
              position: 'top',
              duration: 5000,
              queue: true,
            })
          }
          if (!typeValid) {
            let instance = this.$toast.error(
              `Please select image in ${this.formatTypeMessage} format`,
              {
                position: 'top',
                duration: 5000,
                queue: true,
              }
            )
          }
          this.$emit('validationError')
        }
      })
    },
    async toBase64(event) {
      let base64
      await fileUpload(event).then((data) => {
        base64 = 'data:image/jpeg;base64,' + data.base64;
      })
      this.$emit('createBase64', base64)
    },
  },
}
</script>
<style lang="scss" scoped>
@import '@/assets/style/variables.scss';

.image-editor {
  width: 100%;
  height: 170px;
  border-radius: 20px;
  border: 2px dashed transparent;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;

  .icon-delete {
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
    padding-left: 4px;
  }
  .input-file {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
  }
  .team-icon {
    display: none;
  }
  .upload-area {
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
  .plus {
    display: none;
  }
}

.image-editor--upload {
  border-color: #c4c4c4 !important;
  .upload-area {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
  }
  .edit-icon {
    display: none;
  }
  .plus {
    display: block;
    font-size: 60px;
    line-height: 73px;
    color: #c4c4c4;
  }
  .team-icon {
    display: none;
  }
  .icon-delete {
    display: none;
  }

  &.mode-team {
    .team-icon {
      display: block;
    }
    .plus {
      display: none;
    }
  }
}

.image-editor--disabled {
  opacity: 0.5;
  cursor: wait;
}
</style>
