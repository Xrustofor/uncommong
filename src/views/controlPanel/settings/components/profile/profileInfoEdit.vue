<template>
  <div>
    <h3>Editing Profile</h3>
    <div class="content">
      <ValidationObserver ref="observer" tag="form" v-slot="{ invalid }">
        <label>Profile Photo</label>
        <DragAndDrop
          accept="image/png,image/jpeg,image/jpg"
          @upload="upload"
          :reset="resetImage"
          :image="image"
        ></DragAndDrop>
        <div class="form__row">
          <ValidationProvider
            tag="div"
            class="form__field"
            name="name"
            :rules="{ required: true, min: 3, max: 200 }"
            v-slot="{ errors }"
          >
            <div class="title_overlay">
              <label>First name</label>
              <input
                v-model="user.first_name"
                type="text"
                placeholder="First name"
                :class="errors.length != 0 ? 'in-valid' : ''"
                @input="changeInformation"
              />
            </div>

            <span class="error">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
        <div class="form__row">
          <ValidationProvider
            tag="div"
            class="form__field"
            name="last_name"
            :rules="{ required: true, min: 3, max: 200 }"
            v-slot="{ errors }"
          >
            <div class="title_overlay">
              <label>Last name</label>
              <input
                v-model="user.last_name"
                type="text"
                placeholder="Last name"
                :class="errors.length != 0 ? 'in-valid' : ''"
                @input="changeInformation"
              />
            </div>
            <span class="error">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
        <div class="form__row">
          <ValidationProvider
            tag="div"
            class="form__field"
            name="email"
            :rules="{ required: true, email: true, max: 200 }"
            v-slot="{ errors }"
          >
            <div class="title_overlay">
              <label>Email</label>
              <input
                v-model="user.email"
                type="text"
                placeholder="Email"
                :class="errors.length != 0 ? 'in-valid' : ''"
                @input="changeInformation"
              />
            </div>
            <span class="error">{{ errors[0] }}</span>
            <span v-if="serverErrors.errors">
              <span v-for="err in serverErrors.errors.email" :key="err" class="error error_long">{{
                err
              }}</span>
            </span>
          </ValidationProvider>
        </div>
        <div class="form__row">
          <ValidationProvider
            tag="div"
            class="form__field form__field_icon datapicker left"
            name="birth_day"
            :rules="{ datapicker: true }"
            v-slot="{ errors }"
          >
            <div class="title_overlay">
              <label>Birthday</label>
              <div class="datapicker_overlay">
                <DatePicker
                  format="MM.DD.YYYY"
                  name="birth_day"
                  v-model="user.birth_day"
                  value-type="MM/DD/YYYY"
                  placeholder="MM.DD.YYYY"
                  input-class="input"
                  :class="errors.length != 0 ? 'in-valid' : ''"
                  :disabled-date="(date) => date >= disabledAfter"
                  @change="changeInformation"
                ></DatePicker>
                <span class="icon" :class="errors.length != 0 ? 'in-valid' : ''">
                  <svg width="20" height="20" viewBox="0 0 20 20">
                    <path
                      d="M18.1429 4.57143H1C1 4.00311 1.22576 3.45806 1.62763 3.0562C2.02949 2.65434 2.57454 2.42857 3.14286 2.42857H3.85714V1.71429C3.85714 1.52485 3.9324 1.34316 4.06635 1.20921C4.20031 1.07525 4.38199 1 4.57143 1C4.76087 1 4.94255 1.07525 5.0765 1.20921C5.21046 1.34316 5.28571 1.52485 5.28571 1.71429V2.42857H8.85714V1.71429C8.85714 1.52485 8.9324 1.34316 9.06635 1.20921C9.20031 1.07525 9.38199 1 9.57143 1C9.76087 1 9.94255 1.07525 10.0765 1.20921C10.2105 1.34316 10.2857 1.52485 10.2857 1.71429V2.42857H13.8571V1.71429C13.8571 1.52485 13.9324 1.34316 14.0664 1.20921C14.2003 1.07525 14.382 1 14.5714 1C14.7609 1 14.9425 1.07525 15.0765 1.20921C15.2105 1.34316 15.2857 1.52485 15.2857 1.71429V2.42857H16C16.5683 2.42857 17.1134 2.65434 17.5152 3.0562C17.9171 3.45806 18.1429 4.00311 18.1429 4.57143ZM1 6H18.1429V15.8571C18.1429 16.4255 17.9171 16.9705 17.5152 17.3724C17.1134 17.7742 16.5683 18 16 18H3.14286C2.57454 18 2.02949 17.7742 1.62763 17.3724C1.22576 16.9705 1 16.4255 1 15.8571V6ZM12.4286 8.85714C12.4286 9.04658 12.5038 9.22826 12.6378 9.36222C12.7717 9.49617 12.9534 9.57143 13.1429 9.57143H14.5714C14.7609 9.57143 14.9425 9.49617 15.0765 9.36222C15.2105 9.22826 15.2857 9.04658 15.2857 8.85714C15.2857 8.6677 15.2105 8.48602 15.0765 8.35207C14.9425 8.21811 14.7609 8.14286 14.5714 8.14286H13.1429C12.9534 8.14286 12.7717 8.21811 12.6378 8.35207C12.5038 8.48602 12.4286 8.6677 12.4286 8.85714ZM12.4286 11.7143C12.4286 11.9037 12.5038 12.0854 12.6378 12.2194C12.7717 12.3533 12.9534 12.4286 13.1429 12.4286H14.5714C14.7609 12.4286 14.9425 12.3533 15.0765 12.2194C15.2105 12.0854 15.2857 11.9037 15.2857 11.7143C15.2857 11.5248 15.2105 11.3432 15.0765 11.2092C14.9425 11.0753 14.7609 11 14.5714 11H13.1429C12.9534 11 12.7717 11.0753 12.6378 11.2092C12.5038 11.3432 12.4286 11.5248 12.4286 11.7143ZM12.4286 14.5714C12.4286 14.7609 12.5038 14.9426 12.6378 15.0765C12.7717 15.2105 12.9534 15.2857 13.1429 15.2857H14.5714C14.7609 15.2857 14.9425 15.2105 15.0765 15.0765C15.2105 14.9426 15.2857 14.7609 15.2857 14.5714C15.2857 14.382 15.2105 14.2003 15.0765 14.0664C14.9425 13.9324 14.7609 13.8571 14.5714 13.8571H13.1429C12.9534 13.8571 12.7717 13.9324 12.6378 14.0664C12.5038 14.2003 12.4286 14.382 12.4286 14.5714ZM8.14286 8.85714C8.14286 9.13969 8.22664 9.41589 8.38361 9.65082C8.54059 9.88574 8.7637 10.0688 9.02474 10.177C9.28577 10.2851 9.57301 10.3134 9.85013 10.2583C10.1272 10.2031 10.3818 10.0671 10.5816 9.8673C10.7814 9.66751 10.9174 9.41296 10.9726 9.13584C11.0277 8.85873 10.9994 8.57149 10.8913 8.31045C10.7831 8.04942 10.6 7.8263 10.3651 7.66933C10.1302 7.51236 9.85397 7.42857 9.57143 7.42857C9.19255 7.42857 8.82919 7.57908 8.56128 7.84699C8.29337 8.1149 8.14286 8.47826 8.14286 8.85714ZM8.14286 11.7143C8.14286 11.9037 8.21811 12.0854 8.35207 12.2194C8.48602 12.3533 8.6677 12.4286 8.85714 12.4286H10.2857C10.4752 12.4286 10.6568 12.3533 10.7908 12.2194C10.9247 12.0854 11 11.9037 11 11.7143C11 11.5248 10.9247 11.3432 10.7908 11.2092C10.6568 11.0753 10.4752 11 10.2857 11H8.85714C8.6677 11 8.48602 11.0753 8.35207 11.2092C8.21811 11.3432 8.14286 11.5248 8.14286 11.7143ZM8.14286 14.5714C8.14286 14.7609 8.21811 14.9426 8.35207 15.0765C8.48602 15.2105 8.6677 15.2857 8.85714 15.2857H10.2857C10.4752 15.2857 10.6568 15.2105 10.7908 15.0765C10.9247 14.9426 11 14.7609 11 14.5714C11 14.382 10.9247 14.2003 10.7908 14.0664C10.6568 13.9324 10.4752 13.8571 10.2857 13.8571H8.85714C8.6677 13.8571 8.48602 13.9324 8.35207 14.0664C8.21811 14.2003 8.14286 14.382 8.14286 14.5714ZM3.85714 8.85714C3.85714 9.13969 3.94093 9.41589 4.0979 9.65082C4.25487 9.88574 4.47799 10.0688 4.73902 10.177C5.00006 10.2851 5.2873 10.3134 5.56441 10.2583C5.84153 10.2031 6.09608 10.0671 6.29587 9.8673C6.49566 9.66751 6.63171 9.41296 6.68684 9.13584C6.74196 8.85873 6.71367 8.57149 6.60554 8.31045C6.49742 8.04942 6.31431 7.8263 6.07939 7.66933C5.84446 7.51236 5.56826 7.42857 5.28571 7.42857C4.90683 7.42857 4.54347 7.57908 4.27556 7.84699C4.00765 8.1149 3.85714 8.47826 3.85714 8.85714ZM3.85714 11.7143C3.85714 11.9037 3.9324 12.0854 4.06635 12.2194C4.20031 12.3533 4.38199 12.4286 4.57143 12.4286H6C6.18944 12.4286 6.37112 12.3533 6.50508 12.2194C6.63903 12.0854 6.71429 11.9037 6.71429 11.7143C6.71429 11.5248 6.63903 11.3432 6.50508 11.2092C6.37112 11.0753 6.18944 11 6 11H4.57143C4.38199 11 4.20031 11.0753 4.06635 11.2092C3.9324 11.3432 3.85714 11.5248 3.85714 11.7143ZM3.85714 14.5714C3.85714 14.7609 3.9324 14.9426 4.06635 15.0765C4.20031 15.2105 4.38199 15.2857 4.57143 15.2857H6C6.18944 15.2857 6.37112 15.2105 6.50508 15.0765C6.63903 14.9426 6.71429 14.7609 6.71429 14.5714C6.71429 14.382 6.63903 14.2003 6.50508 14.0664C6.37112 13.9324 6.18944 13.8571 6 13.8571H4.57143C4.38199 13.8571 4.20031 13.9324 4.06635 14.0664C3.9324 14.2003 3.85714 14.382 3.85714 14.5714Z"
                      fill="#63517A"
                    />
                  </svg>
                </span>
              </div>
            </div>

            <transition-group name="fadeEl" tag="span" v-if="serverErrors.errors">
              <span
                v-for="err in serverErrors.errors.birth_day"
                :key="err"
                class="error error_long"
                >{{ err }}</span
              >
            </transition-group>
          </ValidationProvider>
        </div>
        <div class="btn_overlay">
          <button
            class="btn btn-cancel"
            @click.prevent="discardChanged"
            :disabled="!somethingChanged"
          >
            Discard Changes
          </button>
          <LoaderButton
            text="Save"
            :loading="loading"
            :disabled="!somethingChanged || invalid"
            class="btn-yellow"
            @emitClick="save"
          ></LoaderButton>
        </div>
      </ValidationObserver>
    </div>
  </div>
</template>
<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import LoaderButton from '@/components/buttons/loaderButton.vue'

import DatePicker from 'vue2-datepicker'
import DragAndDrop from '../profile/dragAndDrop'
import { mapActions } from 'vuex'

const fileUpload = require('fuctbase64')

export default {
  props: {
    userInfo: { type: Object },
    serverErrors: { type: Object },
    btnLoader: { type: Boolean },
  },
  components: {
    DatePicker,
    ValidationObserver,
    ValidationProvider,
    LoaderButton,
    DragAndDrop,
  },
  data() {
    return {
      loading: false,
      disabledAfter: new Date(),
      user: this.userInfo,
      image: '',
      resetImage: false,
      somethingChanged: false,
    }
  },
  mounted() {
    this.image = JSON.parse(JSON.stringify(this.userInfo)).image;
    this.user = JSON.parse(JSON.stringify(this.userInfo));
  },
  watch: {
    userInfo: function () {
      this.image = JSON.parse(JSON.stringify(this.userInfo)).image;
      this.user = this.userInfo;
    },
    btnLoader(newVal, oldVal) {
      if (newVal == false) {
        this.loading = false;
        this.somethingChanged = false;
        this.setSomethingChanged(false);
      }
    },
  },
  methods: {
    ...mapActions(['setSomethingChanged']),
    discardChanged() {
      this.image = JSON.parse(JSON.stringify(this.userInfo)).image;
      this.user = JSON.parse(JSON.stringify(this.userInfo));

      this.somethingChanged = false;
      this.setSomethingChanged(false);
    },
    changeInformation() {
      this.somethingChanged = true;
      this.setSomethingChanged(true);
    },
    async upload({ event, switcher }) {
      if (switcher) {
        await fileUpload(event).then((data) => {
          this.image = 'data:image/jpeg;base64,' + data.base64;
        })
        this.resetImage = false;
        this.changeInformation();
      } else {
        this.image = null;
        this.resetImage = true;
      }
    },
    save() {
      if (this.somethingChanged) {
        this.loading = true
        this.$refs.observer.validate().then((valid) => {
          if (valid) {
            var data = {
              user: this.user,
              image: this.image,
            }
            this.$emit('saveUserInfo', data);
          }
        })
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.content {
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 2rem;
  margin-top: 3rem;
  padding-left: 3rem;
  @media only screen and (max-width: 1399px) {
    margin-top: 2.5rem;
  }
  @media only screen and (max-width: 998px) {
    padding-left: 2rem;
  }
  form {
    width: 100%;
    max-width: 440px;
    margin: 0 auto;
  }
}
h3 {
  font-size: 20px;
  font-weight: 900;
  color: $violet;
  text-align: center;
  margin-bottom: 40px;
  margin-top: 10px;
}
label {
  margin-bottom: 15px;
}
.title_overlay {
  display: block;
}
.datapicker_overlay {
  width: 100%;
  position: relative;
}
.btn_overlay {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 20px;
  margin-bottom: 20px;
  .btn {
    width: calc((100% / 2) - 20px);
    @media only screen and (max-width: 499px) {
      width: 100%;
    }
  }
  @media only screen and (max-width: 399px) {
    margin-top: 15px;
  }
}
</style>