<template>
  <Loader v-if="isLoading"></Loader>
  <ValidationObserver v-slot="{ invalid }" ref="observer" tag="div" v-else class="fundraiser-page">
    <SaveIndicator :type="indicatorType" class="mode-fixed" />

    <div class="fundraiser-fields">
      <p class="fundraiser-page__title">Create a team</p>
      <p class="fundraiser-page__subtitle">Fundraiser info</p>

      <div class="fundraiser-info">
        <div class="fundraiser-info__title">Fundraiser Name:</div>
        <div class="fundraiser-info__content">{{ fundraiser.name }}</div>
        <div class="fundraiser-info__title">Headline:</div>
        <div class="fundraiser-info__content">{{ fundraiser.short_description }}</div>
        <div class="fundraiser-info__title">Duration:</div>

        <donationProgress
          raisedText="RAISED: "
          goalText="GOAL: "
          class="mode-violet"
          :start-date="fundraiser.start_date"
          :end-date="fundraiser.end_date"
          :raised="fundraiser.amount_raised / 100"
          :goal="fundraiser.goal / 100"
        />
      </div>

      <p class="fundraiser-page__subtitle">Team information</p>
      <ValidationProvider
        tag="div"
        class="fundraiser-fields__field"
        name="name"
        :rules="{ required: true, max: 200 }"
        v-slot="{ errors }"
      >
        <label class="fundraiser-fields__label" for="name">Team Name</label>
        <input
          id="name"
          v-model="fields.name"
          type="text"
          placeholder="Enter Team Name"
          :class="errors.length !== 0 ? 'in-valid' : ''"
          @input="autoSave()"
        />
        <span class="fundraiser-fields__error">{{ errors[0] }}</span>
      </ValidationProvider>

      <label class="fundraiser-fields__label" for="browse">Team Image</label>
      <DragAndDropCreation
        class="mode-team"
        accept="image/png,image/jpeg,image/jpg"
        @upload="CoverPhotoUpload"
        @removeImage="removeCoverPhoto"
        :disabled="indicatorType === 'LOADING'"
        :image="fields.photo"
      />

      <ValidationProvider
        tag="div"
        class="fundraiser-fields__field"
        name="goal"
        :rules="{ limitNumber: true }"
        v-slot="{ errors }"
      >
        <label class="fundraiser-fields__label" for="input-prefix">Team Goal (optional)</label>
        <inputPrefix
          :value="fields.goal"
          :class="errors.length !== 0 ? 'in-valid' : ''"
          class="goal"
          @input="goalInput"
        />
        <span v-show="errors.length" class="error">{{ errors[0] }}</span>
      </ValidationProvider>

      <p class="fundraiser-fields__label">Team Story</p>
      <div id="ckeditor" class="fundraiser-ckeditor" ref="ckeditor">
        <ckeditor
          :editor="editor"
          v-model="fields.biography"
          :config="editorConfig"
          @input="saveCkeditor"
        />
      </div>
      <div class="fundraiser-switch">
        <div>
          <p class="fundraiser-switch__title">Allow individuals to join this team</p>
          <p class="fundraiser-switch__description">
            Allow supporters to join your team, create their own fundraising pages, and help your
            team reach your goal! By disabling this feature, individual supporters will not be
            allowed to join and individually fundraise for your team.
          </p>
        </div>
        <Swither
          :switch-date="fields.join_allowance"
          @changeSwitchVal="switchAvailable"
          :title="fields.join_allowance ? 'Enabled' : 'Disabled'"
        />
      </div>
      <div class="fundraiser-preview__actions fundraiser-preview__actions__actions--mobile">
        <button @click="autoSave" class="btn btn-outline">Save for Later</button>
        <button
          class="btn btn-yellow"
          :disabled="invalid || !fields.biography || indicatorType === 'LOADING' || isDisabledStart"
          @click="publish"
        >
          Save and Preview
        </button>
      </div>
    </div>

    <div class="fundraiser-preview">
      <p class="fundraiser-preview__title">Preview</p>
      <createPreview :is-team="true" :fundraiser="fundraiser" :dynamicData="team" />
      <div class="fundraiser-preview__actions fundraiser-preview__actions--desktop">
        <button @click="autoSave" class="btn btn-outline">Save for Later</button>
        <button
          class="btn btn-yellow"
          :disabled="invalid || !fields.biography || indicatorType === 'LOADING' || isDisabledStart"
          @click="publish"
        >
          Save and Preview
        </button>
      </div>
    </div>
  </ValidationObserver>
</template>

<script>
import Loader from '@/common/dashboard/loader.vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import UploadAdapter from '@/plugins/ckeditor5/upload-adapter'
import IconBase from '@/components/IconBase'
import iconDelete from '@/components/icons/iconDelete'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import donationProgress from '@/components/donationProgress'
import Swither from '@/components/inputs/swither.vue'
import ModalSimple from '@/components/modalSimple.vue'
import DragAndDropCreation from '@/components/dragAndDropCreation.vue'
import SaveIndicator from '@/components/saveIndicator.vue'
import createPreview from '@/components/createPreview.vue'
import inputPrefix from '@/components/inputs/inputPrefix.vue'

import { mapActions, mapGetters, mapState } from 'vuex'

const fileUpload = require('fuctbase64')

export default {
  name: 'P2PTeamCreation',
  components: {
    ValidationObserver,
    ValidationProvider,
    Loader,
    IconBase,
    iconDelete,
    donationProgress,
    Swither,
    ModalSimple,
    DragAndDropCreation,
    SaveIndicator,
    createPreview,
    inputPrefix,
  },
  data() {
    return {
      teamId: null,
      fundraiserSlug: this.$router.history.current.params.fundraiserSlug,
      indicatorType: 'NONE', // NONE LOADING SAVED ERROR
      isDisabledStart: false,
      isLoading: false,
      info: [
        {
          title: 'Fundraiser Name:',
          info: 'Send the Boy Scouts to Idaho',
        },
        {
          title: 'Headline:',
          info: 'Send the Boy Scouts to Idaho',
        },
        {
          title: 'Duration:',
          info: '',
        },
      ],
      fields: {
        name: '',
        photo: '',
        biography: '',
        goal: '',
        join_allowance: true,
      },
      editor: ClassicEditor,
      editorConfig: {
        extraPlugins: [this.uploader],
        mediaEmbed: {
          previewsInData: true,
        },
        toolbar: [
          'heading',
          '|',
          'alignment',
          '|',
          'bold',
          'italic',
          'mediaEmbed',
          '|',
          'bulletedList',
          'numberedList',
          '|',
          'ImageUpload',
          'mediaEmbed',
          '|',
          'undo',
          'redo',
        ],
      },
      delayTimer: null,
      isTouched: false,
    }
  },
  async created() {
    this.$store.dispatch('setLoader', true)
    await this.getApiFundraiser(this.fundraiserSlug)

    if (this.fundraiser.p2p_available) {
      await this.apiGetTeam(this.fundraiser.id)
      this.$store.dispatch('setLoader', false)

      if (this.team.status) {
        this.$swal({
          title: '<strong>You already have a Team Page for this Fundraiser.</strong>',
          html: "<p class='subtitle'>Do you want to go to this page?</p>",
          showCancelButton: true,
          cancelButtonText: 'Go back',
          confirmButtonText: 'Yes',
        }).then((result) => {
          //TODO: HANDLE CASE WHEN HAS FUNDRAISER
          if (result.value === true) {
            this.$router.push(`/fundraisers/${this.fundraiser.url}/teams/${this.team.id}`)
          } else {
            this.$router.go(-1)
          }
        })
      } else if (!this.team.status && this.team.id) {
        this.fields = {
          name: this.team.name,
          photo: this.team.photo,
          biography: this.team.biography,
          goal: this.team.goal / 100,
          join_allowance: this.team.join_allowance,
        }
      }
    } else {
      this.$store.dispatch('setLoader', false)
      this.$swal({
        title: '<strong>You can not create Contributor in this fundraiser</strong>',
        html: "<p class='subtitle'>Do you want go to this find other fundraisers?</p>",
        showCancelButton: true,
        cancelButtonText: 'Go back',
        confirmButtonText: 'Ok',
      }).then((result) => {
        //TODO: HANDLE CASE WHEN HAS NO P2P
        if (result.value === true) {
          this.$router.push('/fundraisers')
        } else {
          this.$router.go(-1)
        }
      })
    }
  },
  computed: {
    ...mapState('teamCreation', ['team']),
    ...mapGetters('fundraisers/fundraiser', {
      fundraiser: 'getItem',
    }),
  },
  watch: {
    editorData(val) {
      this.fields.biography = val
      this.changeInformation()
    },
  },
  methods: {
    ...mapActions('organizations/organization', ['apiDeletedImagesCKEditor']),
    ...mapActions('teamCreation', ['apiGetTeam', 'apiPostTeam', 'apiPutTeam', 'apiPatchTeam']),
    ...mapActions('fundraisers/fundraiser', ['getApiFundraiser']),
    async removeCoverPhoto() {
      const draftUpdate = await this.apiPutTeam({
        teamId: this.team.id,
        body: { photo: '' },
      })
      this.fields.photo = ''
      draftUpdate.status === 200 ? (this.indicatorType = 'SAVED') : (this.indicatorType = 'ERROR')
      setTimeout(() => (this.indicatorType = 'NONE'), 2000)
    },
    switchAvailable(event) {
      this.fields.join_allowance = event
      this.autoSave(0)
    },
    goalInput(event) {
      this.fields.goal = event
      this.autoSave()
    },
    async CoverPhotoUpload(event) {
      let imageBase
      await fileUpload(event).then((data) => {
        imageBase = 'data:image/jpeg;base64,' + data.base64
      })

      this.fields.photo = imageBase
      this.autoSave(0)
    },
    publish() {
      this.$refs.observer.validate().then(async (valid) => {
        await this.apiPatchTeam(this.team.id)

        if (this.team.status) {
          this.$toast.success('Team Fundraiser Published!', {
            position: 'top',
            duration: 5000,
            queue: true,
          })

          if (this.team.join_allowance) {
            this.$swal({
              title: '<strong>Join as Individual</strong>',
              html: "<p class='subtitle'>Want to help even more? When you also join and create a fundraiser as an individual, you can help this cause raise more funds!</p>",
              showCancelButton: true,
              cancelButtonText: 'NO THANKS',
              confirmButtonText: 'YES',
            }).then((result) => {
              //TODO: ROUTE TO TEAM PAGE
              if (result.value === true) {
                window.location.assign(
                  `/admin/account/campaigns/fundraiser/${this.fundraiser.url}/team/${this.team.id}/p2p-contributor-creation`
                )

                // this.$router.push(
                //   `/admin/account/campaigns/fundraiser/${this.fundraiser.url}/team/${this.team.id}/p2p-contributor-creation`
                // )
              } else {
                history.back()
              }
            })
          } else {
            this.$swal({
              title: '<strong>Team Published Successfully!</strong>',
              html: "<p class='subtitle'>Do you want go to your page?</p>",
              showCancelButton: true,
              cancelButtonText: 'Go back',
              confirmButtonText: 'Ok',
            }).then((result) => {
              //TODO: ROUTE TO TEAM PAGE
              if (result.value === true) {
                this.$router.push(`/fundraisers/${this.fundraiser.url}/teams/${this.team.id}`)
              } else {
                history.back()
              }
            })
          }
        } else
          this.$toast.error('OOps! something went wrong. Please try later', {
            position: 'top',
            duration: 5000,
            queue: true,
          })
      })
    },
    uploader(editor) {
      const router = `/upload-ckeditor-image/team`
      editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return new UploadAdapter(loader, router)
      }
    },
    async autoSave(timeout = 2000) {
      clearTimeout(this.delayTimer)
      this.isDisabledStart = true

      const vm = this

      this.delayTimer = setTimeout(async function () {
        vm.indicatorType = 'LOADING'

        if (!vm.team.status && !vm.team.id) {
          try {
            await vm.apiPostTeam(vm.fundraiser.id)
            vm.indicatorType = 'SAVED'
            vm.isDisabledStart = false
          } catch (e) {
            vm.indicatorType = 'ERROR'
            vm.isDisabledStart = false
          }
        } else {
          const data = {
            join_allowance: vm.fields.join_allowance,
          }
          if (vm.fields.biography) {
            data.biography = vm.fields.biography
          }
          if (vm.fields.goal) {
            data.goal = vm.fields.goal * 100
          }
          if (vm.fields.name) {
            data.name = vm.fields.name
          }

          const regex = RegExp(
            /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/
          )
          const isUrlPhoto = regex.test(vm.fields.photo)
          if (!isUrlPhoto && vm.fields.photo) {
            data.photo = vm.fields.photo
          }

          const draftUpdate = await vm.apiPutTeam({
            teamId: vm.team.id,
            body: data,
          })

          draftUpdate.status === 200 ? (vm.indicatorType = 'SAVED') : (vm.indicatorType = 'ERROR')
          vm.isDisabledStart = false

          setTimeout(() => (vm.indicatorType = 'NONE'), 2000)
        }
      }, timeout)
    },
    getArrayDeletedImages(vueValue) {
      const editorImgItems = JSON.parse(localStorage.getItem('editorImgItems'))

      const itemsToDelete = []
      const itemsToSave = []

      if (editorImgItems && vueValue.length) {
        editorImgItems.forEach((e) => {
          if (!vueValue.includes(e)) {
            itemsToDelete.push(e)
          } else {
            itemsToSave.push(e)
          }
        })
      }

      if (editorImgItems && !vueValue.length) {
        editorImgItems.forEach((i) => itemsToDelete.push(i))
        localStorage.setItem('editorImgItems', JSON.stringify([]))
      }

      if (itemsToSave.length) {
        localStorage.setItem('editorImgItems', JSON.stringify(itemsToSave))
      }

      return itemsToDelete
    },
    findImagesUrl(val) {
      const items = []
      let toHtmlObject = document.createElement('div')
      toHtmlObject.innerHTML = val
      let imgObj = toHtmlObject.getElementsByTagName('img')

      imgObj.forEach((img) => items.push(img.src))

      return items
    },
    async saveCkeditor() {
      this.autoSave()
      const htmlBiography = this.fields.biography || ''
      if (htmlBiography) {
        const urlImages = this.findImagesUrl(htmlBiography)
        const itemsDeleted = this.getArrayDeletedImages(urlImages)

        if (itemsDeleted.length) {
          await this.apiDeletedImagesCKEditor(itemsDeleted)
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
$width: 1225px;

.fundraiser-fields {
  padding-bottom: 100px;
  &__label {
    margin-top: 30px;
  }
  @media (max-width: $width) {
    max-width: 600px;
    padding-bottom: 50px;
  }
}
</style>
