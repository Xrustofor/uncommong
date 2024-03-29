<template>
  <div class="content">
    <div class="content_header">
      <p>Please enter the amounts that were sent to the bank account below:</p>
    </div>

    <div>
      <ValidationObserver 
        ref="observer"
        tag="form"
        v-slot="{ invalid }"
      >
        <div class="form__row">
          <ValidationProvider
            tag="div"
            class="form__field"
            name="name"
            :rules="{ required: true, numeric: true }"
            v-slot="{ errors }"
          >
            <div class="">
              <label class="input_title">First Amount</label>
              <input
                v-model="first_amount"
                type="text"
                placeholder="Enter first amount"
                :class="errors.length != 0 ? 'in-valid' : ''"
              />
            </div>
            <span class="error">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
        <div class="form__row">
          <ValidationProvider
            tag="div"
            class="form__field"
            name="name"
            :rules="{ required: true, numeric: true }"
            v-slot="{ errors }"
          >
            <div class="">
              <label class="input_title">Second Amount</label>
              <input
                v-model="second_amount"
                type="text"
                placeholder="Enter second amount"
                :class="errors.length != 0 ? 'in-valid' : ''"
              />
            </div>
            <span class="error">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
        <div class="server_errors">
          <p>{{ serverErrors }}</p>
        </div>
        <div class="btn_overlay">
          <a class="btn btn-small btn-cancel" @click.prevent="hideModal"
            >Cancel</a
          >
          <LoaderButton
            class="btn-yellow btn-small"
            text="Send"
            :loading="sendVefiryNumbers"
            :disabled="invalid"
            @emitClick="verifyAccount"
          ></LoaderButton>
        </div>
      </ValidationObserver>
    </div>
  </div>
</template>
<script>
import { ValidationObserver, ValidationProvider } from "vee-validate";
import LoaderButton from "@/components/buttons/loaderButton.vue";
export default {
  components: {
    ValidationObserver,
    ValidationProvider,
    LoaderButton,
  },
  props: {
    verifyAccountId: { type: String },
  },
  data() {
    return {
      first_amount: 32,
      second_amount: 45,
      bank_id: this.verifyAccountId,
      serverErrors: null,
      sendVefiryNumbers: false,
    };
  },
  methods: {
    verifyAccount() {
      this.sendVefiryNumbers = true;
      var self = this;
      var verify = {
        first_amount: this.first_amount,
        second_amount: this.second_amount,
        bank_id: this.bank_id,
      };
      this.axios
        .put(
          `/user/donor-billings/bank-accounts/verify/${this.bank_id}`,
          verify
        )
        .then((res) => {
          this.sendVefiryNumbers = false;
          var data = res.data;
          this.$swal({
            title: "Account verified",
            confirmButtonText: "OK",
          }).then((result) => {
            self.hideModal(data);
          });
        })
        .catch((error) => {
          if (error.response.status === 403) {
            this.serverErrors = error.response.data.message;
          }
        })
        .finally(() => {});
    },
    hideModal(data) {
      if (data.bank_accounts) {
        this.$emit("updateMethod", data);
      }
      this.$emit("hideModal");
    },
  },
};
</script>
<style lang="scss" scoped>
.content {
  max-height: 70vh;
  padding-left: 35px;
  &_header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-bottom: 40px;
    p {
      width: 100%;
      font-size: 16px;
      font-weight: 600;
      color: $violet;
      text-align: center;
      &:empty {
        margin-bottom: 0;
      }
      &.error {
        color: $red;
        margin-bottom: 0;
      }
    }
  }
  & > div {
    display: flex;
  }
}

form {
  width: 100%;
  max-width: 330px;
  margin: 0 auto;
  .input_title {
    margin-bottom: 10px;
  }
}
.btn_overlay {
  margin-bottom: 15px;
  .btn {
    width: calc(50% - 10px);
  }
}
.server_errors {
  p {
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 15px;
    color: $red;
  }
}
</style>