<template>
  <div>
    <Loader v-if="loader"/>
    <div v-else>
      <PageHeader title="Payment Methods">
        <template #rightPart>
          <ImageButton
            :standart="false"
            class="btn-yellow"
            title="Add New Payment Method"
            :img="{
              alt: 'add',
              path: 'addWhite.svg',
            }"
            @buttonEmit="modalOpen(1)"
          ></ImageButton>
        </template>
      </PageHeader>
      <h4>Saved Payment Methods</h4>
      <div class="card_overlay">
        <template v-if="userPaymentMethods">
          <Card
            v-for="card in paymentMethods"
            :key="card.id"
            :item="card"
            type="card"
            :defaultId="defaultId"
            @editItem="editItem"
            @removeConfirme="removeConfirme"
            @makeDefaultConfirm="makeDefaultConfirm"
          ></Card>
        </template>
        <template v-if="userBankAccounts">
          <Card
            v-for="card in bankAccounts"
            :key="card.id"
            :item="card"
            type="bank"
            :defaultId="defaultId"
            @editItem="editItem"
            @removeConfirme="removeConfirme"
            @makeDefaultConfirm="makeDefaultConfirm"
            @verifyAccount="verifyAccount"
          ></Card>
        </template>
        <NotExistPaymentMethod
          v-else-if="!userPaymentMethods && !userBankAccounts"
          @open="modalOpen(1)"
        />
      </div>
      <ModalOverlay :showModal="this.openModal" @hideModal="hideModal">
        <AddMethodModal
          v-if="this.modalNumber === 1"
          @hideModal="hideModal"
          @updateMethod="updateMethods"
        ></AddMethodModal>

        <EditMethodModal
          v-else-if="this.modalNumber === 2"
          :item="modalElement"
          :defaultEl="defaultEl"
          :type="type"
          @hideEditMethodModal="hideModal"
          @updateMethod="updateMethods"
        ></EditMethodModal>

        <Verify
          v-else-if="this.modalNumber === 3"
          :verifyAccountId="verifyAccountId"
          @updateMethod="updateMethods"
          @hideModal="hideModal"
        ></Verify>
      </ModalOverlay>
    </div>
  </div>
</template>
<script>
import Loader from '@/common/dashboard/loader.vue';
import NotExistPaymentMethod from '../components/billing/notExistPaymentMethod';
import PageHeader from '../components/pageHeader';
import SettingsEditLine from '@/common/dashboard/settings/settingsEditLine.vue';
import ImageButton from '@/components/buttons/imageButton.vue';
import Card from '../components/billing/card';
import ModalOverlay from '@/common/modalOverlay.vue';
import AddMethodModal from '../components/billing/addMethodModal.vue';
import EditMethodModal from '../components/billing/editMethodModal.vue';
import Verify from '../components/billing/verify.vue';

export default {
  data() {
    return {
      loader: true,
      openModal: false,
      modalNumber: 1,
      modalElement: {},
      defaultEl: false,
      type: 1,
      paymentMethods: [],
      bankAccounts: [],
      defaultId: '',
      verifyAccountId: '',
    }
  },
  computed: {
    userPaymentMethods() {
      return this.paymentMethods.length > 0;
    },
    userBankAccounts() {
      return this.bankAccounts.length > 0;
    },
  },
  methods: {
    getUserPaymentMethods() {
      this.axios
        .get('/user/donor-billings')
        .then((res) => {
          this.paymentMethods = res.data.payment_methods;
          this.bankAccounts = res.data.bank_accounts;
          this.defaultId = res.data.default;
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.loader = false;
        })
    },

    hideModal() {
      this.openModal = false
      this.modalNumber = 0
    },
    modalOpen(value) {
      this.openModal = true
      this.modalNumber = value
    },

    removeConfirme(item) {
      var paymentMethod
      if (item.type === 'card') {
        paymentMethod = 'Credit Card'
      } else paymentMethod = 'Bank Account - ' + item.account_holder_name

      this.$swal({
        title: 'Delete Payment Method',
        html: '<h5>Are you sure you want to delete ' + paymentMethod + '? ',
        showCancelButton: true,
        showConfirmButton: false,
        showDenyButton: true,
        denyButtonText: 'Delete',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.value === false) {
          var url = null
          if (item.type === 'card') {
            url = `/user/donor-billings/cards/${item.id}`
            this.removeItem(url)
          } else {
            url = `/user/donor-billings/bank-accounts/${item.id}`
            this.removeItem(url)
          }
        }
      })
    },
    removeItem(url) {
      this.axios
        .delete(url)
        .then((res) => {
          this.updateMethods(res.data)
          this.$swal({
            title: 'Payment Method was successfully deleted.',
            confirmButtonText: 'OK',
          })
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {})
    },

    editItem({ item, defaultEl }) {
      this.modalOpen(2)
      if (item.type === 'card') {
        this.type = 1
      } else this.type = 2
      this.modalElement = item
      this.defaultEl = defaultEl
    },

    updateMethods(data) {
      this.paymentMethods = data.payment_methods
      this.bankAccounts = data.bank_accounts
      this.defaultId = data.default
    },

    makeDefaultConfirm(item) {
      var paymentMethod
      if (item.type === 'card') {
        paymentMethod = '<br/>Credit Card -  **** ' + item.card.last4
      } else paymentMethod = '<br/> Bank Account - ' + item.account_holder_name

      this.$swal({
        title: 'Are you sure you want to make ' + paymentMethod + ' default?',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.value) {
          var url = null
          if (item.type === 'card') {
            url = `/user/donor-billings/cards/${item.id}`
            this.makeDefault(url)
          } else {
            url = `/user/donor-billings/bank-accounts/${item.id}`
            this.makeDefault(url)
          }
        }
      })
    },
    makeDefault(url) {
      this.axios
        .patch(url)
        .then((res) => {
          this.defaultId = res.data.default
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {})
    },

    verifyAccount(item) {
      this.openModal = true
      this.modalNumber = 3
      this.verifyAccountId = item.id
    },
  },
  mounted() {
    this.getUserPaymentMethods()
  },
  components: {
    Loader,
    NotExistPaymentMethod,
    PageHeader,
    SettingsEditLine,
    ImageButton,

    Card,
    ModalOverlay,
    AddMethodModal,
    EditMethodModal,
    Verify,
  },
}
</script>
<style lang="scss" scoped>
@import '@/assets/style/variables.scss';
.card_overlay {
  padding-top: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  & > div {
    margin-bottom: 20px;
    p {
      font-size: 14px;
      font-weight: 600;
      color: $violet;
      text-align: center;
    }
  }
}
</style>