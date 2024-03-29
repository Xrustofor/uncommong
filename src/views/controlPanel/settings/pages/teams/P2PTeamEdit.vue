<template>
  <Loader v-if="isLoading"></Loader>
  <ValidationObserver
    v-slot="{ invalid }"
    ref="observer"
    tag="div"
    v-else
    class="fundraiser-page"
  >
    <SaveIndicator :type="indicatorType" class="mode-fixed" />

    <div class="fundraiser-fields">
      <p class="fundraiser-page__title">Edit your team</p>
      <p class="fundraiser-page__subtitle">Fundraiser info</p>

      <div class="fundraiser-info">
        <div class="fundraiser-info__title">Fundraiser Name:</div>
        <div class="fundraiser-info__content">{{ fundraiser.name }}</div>
        <div class="fundraiser-info__title">Headline:</div>
        <div class="fundraiser-info__content">{{ fundraiser.short_description }}</div>
        <div class="fundraiser-info__title">Duration:</div>

        <donationProgress
          class="mode-violet"
          raisedText="RAISED: "
          goalText="GOAL: "
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
        <label for="name" class="fundraiser-fields__label">Team Name</label>
        <input
          id="name"
          v-model="fields.name"
          type="text"
          placeholder="Enter Team Name"
          :class="errors.length !== 0 ? 'in-valid' : ''"
        />
        <span class="fundraiser-fields__error">{{ errors[0] }}</span>
      </ValidationProvider>
      <label for="browse" class="fundraiser-fields__label">Team Image</label>
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
        :rules="{ max: 200, limitNumber: true }"
        v-slot="{ errors }"
      >
        <label for="input-prefix" class="fundraiser-fields__label">Team Goal (optional)</label>
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
    </div>

    <div class="fundraiser-preview">
      <p class="fundraiser-preview__title">Preview</p>
      <createPreview :is-team="true" :fundraiser="fundraiser" :dynamicData="fields" />
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
import {ValidationObserver, ValidationProvider} from 'vee-validate'
import donationProgress from '@/components/donationProgress'
import Swither from '@/components/inputs/swither.vue'
import ModalSimple from '@/components/modalSimple.vue'
import DragAndDropCreation from '@/components/dragAndDropCreation.vue'
import SaveIndicator from '@/components/saveIndicator.vue'
import createPreview from '@/components/createPreview.vue'
import inputPrefix from '@/components/inputs/inputPrefix.vue'

import {mapActions, mapGetters, mapState} from 'vuex'

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
      idTeam: this.$router.history.current.params.idTeam,
      slugFundraiser: this.$router.history.current.params.slugFundraiser,
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
      defaultFields: {},
      fields: {},
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
    const team = await this.apiGetTeamEdit(this.idTeam)
    this.defaultFields = {
      ...JSON.parse(JSON.stringify(team)),
      goal: JSON.parse(JSON.stringify(team)).goal / 100,
    }
    this.fields = {
      ...JSON.parse(JSON.stringify(team)),
      goal: JSON.parse(JSON.stringify(team)).goal / 100,
    }
    this.isLoading = false

    // if (this.fundraiser.p2p_available) {
    //   await this.apiGetTeam(this.fundraiser.id);
    //   this.$store.dispatch('setLoader', false);
    //
    //   if (this.team.status) {
    //     this.$swal({
    //       title: '<strong>You already have a Team Page for this Fundraiser.</strong>',
    //       html: "<p class='subtitle'>Do you want to go to this page?</p>",
    //       showCancelButton: true,
    //       cancelButtonText: 'Go back',
    //       confirmButtonText: 'Yes',
    //     }).then((result) => {
    //       if (result.value === true){
    //         this.$router.push(
    //           `/fundraisers/${this.fundraiser.url}/teams/${this.team.id}`
    //         )
    //       }
    //       else {
    //         history.back();
    //       }
    //     })
    //   }
    // }
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
    ...mapActions('teamCreation', ['apiGetTeamEdit', 'apiPostTeam', 'apiPutTeam', 'apiPatchTeam']),
    ...mapActions('fundraisers/fundraiser', ['getApiFundraiser']),
    removeCoverPhoto() {
      this.fields.photo = ''
    },
    switchAvailable(event) {
      this.fields.join_allowance = event
    },
    goalInput(event) {
      this.fields.goal = event
    },
    cancel() {
      this.fields = {
        ...JSON.parse(JSON.stringify(this.defaultFields)),
        goal: JSON.parse(JSON.stringify(this.defaultFields)).goal / 100,
      }
    },
    async CoverPhotoUpload(event) {
      let imageBase
      await fileUpload(event).then((data) => {
        imageBase = 'data:image/jpeg;base64,' + data.base64
      })

      this.fields.photo = imageBase
    },
    uploader(editor) {
      const router = `/upload-ckeditor-image/team`
      editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return new UploadAdapter(loader, router)
      }
    },
    async save(timeout = 2000) {
      clearTimeout(this.delayTimer)

      const vm = this

      this.delayTimer = setTimeout(async function () {
        vm.indicatorType = 'LOADING'

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
        } else if (!vm.fields.photo) {
          data.photo = ''
        }

        const draftUpdate = await vm.apiPutTeam({
          teamId: vm.idTeam,
          body: data,
        })
        if (draftUpdate.status === 200) {
          vm.indicatorType = 'SAVED'
          vm.$router.push(`/fundraisers/${vm.slugFundraiser}/teams/${vm.idTeam}`)
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
