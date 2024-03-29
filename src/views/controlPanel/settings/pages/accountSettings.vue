<template>
  <div>
    <Loader v-if="loader"/>
    <template>
      <PageHeader title="Profile">
        <template #rightPart>
          <a @click.stop="logout" class="btn btn-underline"> LogOut </a>
          <ImageButton
            title="Edit"
            :img="{ alt: 'edit', path: 'edit.svg' }"
            @buttonEmit="openModal = true"
          ></ImageButton>
        </template>
      </PageHeader>
      <div class="profile_overlay">
        <ProfilePicture
          name="user-picture"
          :userPic="userInfo.image"
          :initials="userInfo.initials"
          @setImage="setUserImage($event)"
        ></ProfilePicture>
        <MainProfileInfo
          :userInfo="userInfo"
          :btnLoader="resendLoader"
          @resendEmail="resendEmail"
        ></MainProfileInfo>
      </div>
      <ProfileVisibility/>
      <ModalOverlay 
        :showModal="this.openModal"
        @hideModal="hideModal"
      >
        <ProfileInfoEdit
          :userInfo="userInfo"
          :serverErrors="serverErrors"
          :btnLoader="saveLoader"
          @saveUserInfo="saveChanges"
        ></ProfileInfoEdit>
      </ModalOverlay>
    </template>
  </div>
</template>
<script>

import Loader from '@/common/dashboard/loader.vue';
import MainProfileInfo from '../components/profile/mainProfileInfo';
import ProfilePicture from '@/common/setImage';
import ProfileVisibility from '../components/profile/profileVisibility';
import PageHeader from '../components/pageHeader';
import ModalOverlay from '@/common/modalOverlay.vue';
import ProfileInfoEdit from '../components/profile/profileInfoEdit';
import ImageButton from '@/components/buttons/imageButton.vue';

import { mapActions, mapGetters, mapMutations } from 'vuex';

export default {
  name: 'account-settings',
  components: {
    Loader,
    PageHeader,
    MainProfileInfo,
    ProfilePicture,
    ProfileVisibility,
    ModalOverlay,
    ProfileInfoEdit,
    ImageButton,
  },
  data() {
    return {
      loader: false,
      userInfo: {},
      serverErrors: {
        errors: null,
      },
      resendLoader: false,
      saveLoader: false,
      openModal: false,
    }
  },
  async mounted() {
    this.loader = true;
    await this.getApiUser();
    this.userInfo = JSON.parse(JSON.stringify(this.user));
    this.loader = false;
  },
  computed: {
    ...mapGetters('user', {
      user: 'getUser',
    }),
  },
  watch: {
    user() {
      this.userInfo = JSON.parse(JSON.stringify(this.user));
    },
  },
  methods: {
    ...mapActions(['logout']),
    ...mapActions('user', [
      'getApiUser',
      'resendEmailVerifiation',
      'setUserImage',
      'updateUserInfo',
    ]),
    ...mapMutations('user', ['setUser']),
    async saveChanges({ user, image }) {
      this.saveLoader = true;
      var result = await this.updateUserInfo(user);
      if (result.result) {
        this.saveLoader = false;
        if (this.userInfo.image != image) {
          this.setUserImage(image);
        }
        this.serverErrors.errors = null;
        this.somethingChanged = false;
        this.$swal({
          title: result.message,
          confirmButtonText: 'OK',
        })
      } else {
        this.serverErrors.errors = result.message;
      }
    },
    async resendEmail() {
      this.resendLoader = true;
      var result = await this.resendEmailVerifiation();
      this.$swal({
        title: result,
        confirmButtonText: 'OK',
      })
      this.resendLoader = false;
    },
    hideModal() {
      this.openModal = false;
    },
  },
}
</script>
<style lang="scss" scoped>
.profile_overlay {
  display: flex;
  flex-wrap: wrap;
  & > div:first-of-type {
    margin-right: 50px;
  }
}
label.radio {
  width: auto;
  margin: 10px;
}
.btn-underline {
  margin-right: 30px;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  text-transform: uppercase;
  color: #317d9b;
  border-bottom-color: #317d9b;
  &:hover {
    color: $green;
    border-bottom-color: $green;
  }
}
</style>