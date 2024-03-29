<template>
  <Loader v-if="isLoading"></Loader>
  <ValidationObserver v-slot="{ invalid }" ref="observer" tag="div" v-else class="fundraiser-page">
    <SaveIndicator :type="indicatorType" class="mode-fixed" />

    <div class="fundraiser-fields">
      <p class="fundraiser-page__title">Become a Contributor</p>
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

      <p class="fundraiser-page__subtitle">Your information</p>
      <label class="fundraiser-fields__label" for="browse">Cover Photo</label>
      <dragAndDropCreation
        class="mode-team"
        accept="image/png,image/jpeg,image/jpg"
        @upload="CoverPhotoUpload"
        @removeImage="removeImage"
        :disabled="indicatorType === 'LOADING'"
        :image="fields.photo"
      />
      <ValidationProvider
        tag="div"
        class="fundraiser-fields__field"
        name="goal"
        :rules="{ required: true }"
        v-slot="{ errors }"
      >
        <label class="fundraiser-fields__label" for="input-prefix">Personal Goal</label>
        <inputPrefix
          :value="fields.goal"
          :class="errors.length !== 0 ? 'in-valid' : ''"
          class="goal"
          @input="goalInput"
        />
        <span v-show="errors.length !== 0" class="error">{{ errors[0] }}</span>
      </ValidationProvider>

      <p class="fundraiser-fields__label">Personal notes / bio</p>
      <div id="ckeditor" class="fundraiser-ckeditor" ref="ckeditor">
        <ckeditor
          :editor="editor"
          v-model="fields.biography"
          :config="editorConfig"
          @input="saveCkeditor"
        />
      </div>
    </div>

    <div class="fundraiser-preview">
      <div class="fundraiser-preview__actions fundraiser-preview__actions--mobile">
        <button @click="autoSave" class="btn btn-outline">Save for Later</button>
        <button
          class="btn btn-yellow"
          :disabled="invalid || !fields.biography || indicatorType === 'LOADING' || isDisabledStart"
          @click="publish"
        >
          Save and Preview
        </button>
      </div>
      <p class="fundraiser-preview__title">Preview</p>
      <createPreview :is-team="false" :fundraiser="fundraiser" :dynamicData="individual" />

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
import ModalSimple from '@/components/modalSimple.vue'
import dragAndDropCreation from '@/components/dragAndDropCreation.vue'
import SaveIndicator from '@/components/saveIndicator.vue'
import createPreview from '@/components/createPreview.vue'
import inputPrefix from '@/components/inputs/inputPrefix.vue'

import { mapActions, mapGetters, mapState } from 'vuex'

const fileUpload = require('fuctbase64')

export default {
  name: 'P2PContributorCreation',
  components: {
    ValidationObserver,
    ValidationProvider,
    Loader,
    IconBase,
    iconDelete,
    donationProgress,
    ModalSimple,
    dragAndDropCreation,
    SaveIndicator,
    createPreview,
    inputPrefix,
  },
  data() {
    return {
      individualId: null,
      fundraiserSlug: this.$router.history.current.params.fundraiserSlug,
      fundraiser_team_id: this.$router.history.current.params.teamId,
      indicatorType: 'NONE', // NONE LOADING SAVED ERROR
      isLoading: false,
      isDisabledStart: false,
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
        photo: '',
        biography: '',
        goal: '',
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
      await this.apiGetIndividual(this.fundraiser.id)
      this.$store.dispatch('setLoader', false)

      if (this.individual.status) {
        this.$swal({
          title: '<strong>You already have an Individual Page for this Fundraiser.</strong>',
          html: "<p class='subtitle'>Do you want to go to this page?</p>",
          showCancelButton: true,
          cancelButtonText: 'Go back',
          confirmButtonText: 'Yes',
        }).then((result) => {
          if (result.value === true)
            this.$router.push(
              `/fundraisers/${this.fundraiser.url}/individuals/${this.individual.id}`
            )
          else {
            this.$router.go(-1)
          }
        })
      } else if (!this.individual.status && this.individual.id) {
        this.fields = {
          photo: this.individual.photo,
          biography: this.individual.biography,
          goal: this.individual.goal / 100,
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
    ...mapState('individualCreation', ['individual']),
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
    ...mapActions('individualCreation', [
      'apiGetIndividual',
      'apiPostIndividual',
      'apiPutIndividual',
      'apiPatchIndividual',
    ]),
    ...mapActions('fundraisers/fundraiser', ['getApiFundraiser']),
    removeImage() {
      this.fields.photo = ''
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
        await this.apiPatchIndividual(this.individual.id)

        if (this.individual.status) {
          this.$toast.success('Contributor Published!', {
            position: 'top',
            duration: 5000,
            queue: true,
          })
          this.$swal({
            title: '<strong>Contributor Fundraiser Published Successfully!</strong>',
            html: "<p class='subtitle'>Do you want go to your page?</p>",
            showCancelButton: true,
            cancelButtonText: 'Go back',
            confirmButtonText: 'Ok',
          }).then((result) => {
            //TODO: ROUTE TO INDIVIDUAL PAGE
            if (result.value === true) {
              const { teamId } = this.$route.params
              if (teamId) {
                this.$router.push(`/fundraisers/fundraiser/teams/${teamId}#participate`)
              } else {
                this.$router.push(
                  `/fundraisers/${this.fundraiser.url}/individuals/${this.individual.id}`
                )
              }
            } else {
              //this.$router.go(-1) TODO: why does not work?
              history.back()
            }
          })
        } else
          this.$toast.error('OOps! something went wrong. Please try later', {
            position: 'top',
            duration: 5000,
            queue: true,
          })
      })
    },
    uploader(editor) {
      const router = `/upload-ckeditor-image/individual`
      editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return new UploadAdapter(loader, router)
      }
    },
    async autoSave(timeout = 2000) {
      this.isDisabledStart = true
      clearTimeout(this.delayTimer)

      const vm = this

      this.delayTimer = setTimeout(async function () {
        vm.indicatorType = 'LOADING'
        if (!vm.individual.status && !vm.individual.id) {
          const data = {
            fundraiserId: vm.fundraiser.id,
            body: {},
          }
          if (vm.fundraiser_team_id) {
            data.body.fundraiser_team_id = vm.fundraiser_team_id
          }
          try {
            await vm.apiPostIndividual(data)
            vm.indicatorType = 'SAVED'
            vm.isDisabledStart = false
          } catch (e) {
            vm.indicatorType = 'NONE'
            vm.isDisabledStart = false
          }
        } else {
          const data = {}
          if (vm.fields.biography) {
            data.biography = vm.fields.biography
          }
          if (vm.fields.goal) {
            data.goal = vm.fields.goal * 100
          }
          if (!vm.fields.photo) {
            data.photo = ''
          }
          const regex = RegExp(
            /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/
          )
          const isUrlPhoto = regex.test(vm.fields.photo)
          if (!isUrlPhoto && vm.fields.photo) {
            data.photo = vm.fields.photo
          }

          const draftUpdate = await vm.apiPutIndividual({
            individualId: vm.individual.id,
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
          if (!vueValue.includes(e)) itemsToDelete.push(e)
          else itemsToSave.push(e)
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
