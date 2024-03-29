<template>
  <Loader v-if="isLoading"></Loader>
  <ValidationObserver v-slot="{ invalid }" ref="observer" tag="div" v-else class="fundraiser-page">
    <SaveIndicator :type="indicatorType" class="mode-fixed" />

    <div class="fundraiser-fields">
      <p class="fundraiser-page__title">Edit your contributor</p>
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
      <label for="browser" class="fundraiser-fields__label">Cover Photo</label>
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
        :rules="{ required: true, limitNumber: 200 }"
        v-slot="{ errors }"
      >
        <label class="fundraiser-fields__label" for="input-prefix">Personal Goal</label>
        <inputPrefix
          :value="fields.goal"
          :class="errors.length !== 0 ? 'in-valid' : ''"
          class="goal"
          @input="goalInput"
        />
        <span v-show="errors.length" class="error">{{ errors[0] }}</span>
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
        <button @click="cancel" class="btn btn-outline">Cancel</button>
        <button
          class="btn btn-yellow"
          :disabled="invalid || !fields.biography || indicatorType === 'LOADING'"
          @click="save"
        >
          Save and Preview
        </button>
      </div>
      <p class="fundraiser-preview__title">Preview</p>
      <createPreview :is-team="false" :fundraiser="fundraiser" :dynamicData="fields" />

      <div class="fundraiser-preview__actions fundraiser-preview__actions--desktop">
        <button @click="cancel" class="btn btn-outline">Cancel</button>
        <button
          class="btn btn-yellow"
          :disabled="invalid || !fields.biography || indicatorType === 'LOADING'"
          @click="save"
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
import ModalSimple from '@/components/modalSimple'
import dragAndDropCreation from '@/components/dragAndDropCreation'
import SaveIndicator from '@/components/saveIndicator'
import createPreview from '@/components/createPreview'
import inputPrefix from '@/components/inputs/inputPrefix'

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
      slugFundraiser: this.$router.history.current.params.slugFundraiser,
      idIndividual: this.$router.history.current.params.idIndividual,
      indicatorType: 'NONE', // NONE LOADING SAVED ERROR
      isLoading: true,
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
    await this.getApiFundraiser(this.slugFundraiser)
    const individual = await this.apiGetIndividual(this.fundraiser.id)

    this.defaultFields = {
      ...JSON.parse(JSON.stringify(individual)),
      goal: JSON.parse(JSON.stringify(individual)).goal / 100,
    }
    this.fields = {
      ...JSON.parse(JSON.stringify(individual)),
      goal: JSON.parse(JSON.stringify(individual)).goal / 100,
    }
    this.isLoading = false
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
    cancel() {
      this.fields = {
        ...JSON.parse(JSON.stringify(this.defaultFields)),
        goal: JSON.parse(JSON.stringify(this.defaultFields)).goal / 100,
      }
    },
    removeImage() {
      this.fields.photo = ''
    },
    goalInput(event) {
      this.fields.goal = event
    },
    async CoverPhotoUpload(event) {
      let imageBase
      await fileUpload(event).then((data) => {
        imageBase = 'data:image/jpeg;base64,' + data.base64
      })

      this.fields.photo = imageBase
    },
    uploader(editor) {
      const router = `/upload-ckeditor-image/individual`
      editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return new UploadAdapter(loader, router)
      }
    },
    async save(timeout = 2000) {
      clearTimeout(this.delayTimer)

      const vm = this

      this.delayTimer = setTimeout(async function () {
        vm.indicatorType = 'LOADING'

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
        } else if (!vm.fields.photo) {
          data.photo = ''
        }

        const draftUpdate = await vm.apiPutIndividual({
          individualId: vm.individual.id,
          body: data,
        })

        if (draftUpdate.status === 200) {
          vm.indicatorType = 'SAVED'
          vm.$router.push(`/fundraisers/${vm.slugFundraiser}/individuals/${vm.idIndividual}`)
        } else {
          vm.indicatorType = 'ERROR'
        }
        setTimeout(() => (vm.indicatorType = 'NONE'), 2000)
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
@import '@/assets/style/variables.scss';

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
