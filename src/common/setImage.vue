<template>
  <div class="settings_blocks_block">
    <div class="settings_blocks_header">
      <h3>{{ title }}</h3>
    </div>
    <div class="form__row">
      <div class="user_picture">
        <div class="picture">
          <div 
            v-if="userPic"
            :style="{ backgroundImage: `url(${userPic})` }"
          ></div>
          <div v-else>
            <span v-if="defaultPicture" class="default-picture"></span>
            <span v-else class="name">{{ initials }}</span>
          </div>
        </div>
        <label 
          :for="name"
          class="add_picture"
          :class="className"
          v-if="edit"
        >
          <img 
            v-if="className == 'center'"
            :src="require(`@/assets/img/upload.svg`)"
            alt="edit"
          />
          <img v-else :src="require(`@/assets/img/edit.svg`)" alt="edit" />
        </label>
        <input
          type="file"
          class="input-upload"
          name="myfile"
          accept="image/*"
          :id="name"
          @change="changeListener($event)"
        />
      </div>
    </div>
  </div>
</template>
<script>
const fileUpload = require('fuctbase64')
export default {
  props: {
    edit: { type: Boolean, default: true },
    name: { type: String },
    className: { type: String, default: 'left' },
    title: { type: String, default: 'Profile Picture' },
    userPic: { type: String },
    defaultPicture: { type: Boolean, default: false },
    initials: { type: String, required: false },
  },
  data() {
    return {
      url: null,
      base64: '',
      error: '',
    }
  },
  methods: {
    changeListener(e) {
      let image = e.target.files;
      if (typeof image != 'undefined') {
        let size = parseFloat(image[0].size / (1024 * 1024)).toFixed(2);
        if (size > 2) {
          let instance = this.$toast.error('Please select image size less than 2 MB', {
            position: 'top',
            duration: 5000,
            queue: true,
          })
        } else {
          fileUpload(e).then((data) => {
            this.base64 = 'data:image/jpeg;base64,' + data.base64;
            this.$emit('setImage', this.base64);
          })
        }
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.user_picture {
  position: relative;
  margin-bottom: 30px;
  .add_picture {
    width: 4.4rem;
    height: 4.4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    background-color: #fff;
    box-shadow: 0px 10px 30px rgba(145, 133, 159, 0.2);
    border-radius: 50%;
    margin: 0;
    padding: 0;
    &.left {
      bottom: 0;
      right: 0;
    }
    &.center {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .picture {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 16rem;
    height: 16rem;
    background-color: $violetBorder;
    border-radius: 50%;
    overflow: hidden;
    @media only screen and (max-width: 998px) {
      width: 12rem;
      height: 12rem;
    }
    @media only screen and (max-width: 768px) {
      width: 10rem;
      height: 10rem;
    }
    div {
      background-size: cover;
      background-position: center;
      width: 100%;
      height: 100%;
      span {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        &.default-picture {
          background-size: auto;
          background-repeat: no-repeat;
          background-position: center;
          background-image: url(../assets/img/default_user.svg);
        }
        &.name {
          font-size: 30px;
          font-weight: 700;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
      }
    }
    img.user {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  input {
    display: none;
  }
}
</style>