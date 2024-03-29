<template>
  <AuthContainer>
    <ValidationObserver v-slot="{ passes, invalid }" tag="div">
      <form @submit.prevent="passes(sendInfo)" class="form">
        <div class="inputs-overlay">
          <div class="form__row">
            <div class="form__row_side">
              <ValidationProvider
                tag="div"
                class="form__field"
                name="name"
                :rules="{ required: true, max: 200 }"
                v-slot="{ errors }"
              >
                <input
                  v-model="registerForm.first_name"
                  type="text"
                  placeholder="First name"
                  :class="errors.length != 0 ? 'in-valid' : ''"
                />
                <span class="error">{{ errors[0] }}</span>
              </ValidationProvider>
            </div>
            <div class="form__row_side">
              <ValidationProvider
                tag="div"
                class="form__field"
                name="last_name"
                :rules="{ required: true, max: 200 }"
                v-slot="{ errors }"
              >
                <input
                  v-model="registerForm.last_name"
                  type="text"
                  placeholder="Last name"
                  :class="errors.length != 0 ? 'in-valid' : ''"
                />
                <span class="error">{{ errors[0] }}</span>
              </ValidationProvider>
            </div>
          </div>
          <div class="form__row">
            <ValidationProvider
              tag="div"
              class="form__field form__field_icon"
              name="email"
              :rules="{ required: true, email: true, max: 200 }"
              v-slot="{ errors }"
            >
              <input
                v-model="registerForm.email"
                type="text"
                placeholder="Email"
                :class="errors.length != 0 ? 'in-valid' : ''"
              />
              <span class="icon" :class="errors.length != 0 ? 'in-valid' : ''">
                <svg width="20" height="20" viewBox="0 0 20 20">
                  <path
                    d="M16.6087 4H3.3913C3.02231 4 2.66842 4.14969 2.4075 4.41613C2.14658 4.68258 2 5.04396 2 5.42077V15.5792C2 15.956 2.14658 16.3174 2.4075 16.5839C2.66842 16.8503 3.02231 17 3.3913 17H16.6087C16.9777 17 17.3316 16.8503 17.5925 16.5839C17.8534 16.3174 18 15.956 18 15.5792V5.42077C18 5.04396 17.8534 4.68258 17.5925 4.41613C17.3316 4.14969 16.9777 4 16.6087 4ZM15.433 7.95683L10.953 10.571C10.6637 10.7433 10.3349 10.834 10 10.834C9.66513 10.834 9.33625 10.7433 9.04696 10.571L4.56696 7.95683C4.40665 7.86431 4.28881 7.71066 4.23926 7.52956C4.18971 7.34846 4.21249 7.15469 4.30261 6.99071C4.34806 6.90931 4.40882 6.83789 4.48141 6.78058C4.554 6.72326 4.63698 6.68117 4.72556 6.65674C4.81415 6.63231 4.90659 6.62602 4.99757 6.63823C5.08854 6.65043 5.17625 6.6809 5.25565 6.72787L9.73565 9.34208C9.81667 9.38747 9.90759 9.41126 10 9.41126C10.0924 9.41126 10.1833 9.38747 10.2643 9.34208L14.7443 6.72787C14.8237 6.6809 14.9115 6.65043 15.0024 6.63823C15.0934 6.62602 15.1859 6.63231 15.2744 6.65674C15.363 6.68117 15.446 6.72326 15.5186 6.78058C15.5912 6.83789 15.6519 6.90931 15.6974 6.99071C15.7875 7.15469 15.8103 7.34846 15.7607 7.52956C15.7112 7.71066 15.5933 7.86431 15.433 7.95683Z"
                    fill="#63517A"
                  />
                </svg>
              </span>
              <span class="error">{{ errors[0] }}</span>
              <span v-if="serverErrors">
                <span
                  v-for="err in serverErrors.errors.email"
                  :key="err"
                  class="error error_long"
                  >{{ err }}</span
                >
              </span>
            </ValidationProvider>
          </div>
          <div class="form__row">
            <ValidationProvider
              tag="div"
              class="form__field form__field_icon"
              name="email_confirmation"
              rules="required|confirmed:email|max: 200"
              v-slot="{ errors, valid }"
            >
              <input
                v-model="registerForm.email_confirmation"
                type="text"
                placeholder="Confirm Email"
                :class="valid ? 'valid' : errors.length != 0 ? 'in-valid' : ''"
              />
              <span
                class="icon confirm"
                :class="valid ? 'valid' : errors.length != 0 ? 'in-valid' : ''"
              >
                <svg width="20" height="20" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20ZM13.2261 6.32955C13.4134 6.12672 13.6682 6.0087 13.9366 6.00045C14.1444 5.99416 14.3491 6.054 14.524 6.17218C14.699 6.29036 14.8361 6.46138 14.9175 6.66293C14.9988 6.86447 15.0207 7.08719 14.9802 7.30202C14.9396 7.51685 14.8386 7.71382 14.6903 7.86723C13.7876 8.82081 12.9222 9.77683 12.0517 10.7384C11.171 11.7114 10.285 12.69 9.35018 13.6775C9.17081 13.8683 8.93093 13.9824 8.67659 13.9981C8.42225 14.0138 8.17137 13.93 7.97209 13.7627L5.38817 11.5838C5.28212 11.4944 5.19381 11.3838 5.12829 11.2584C5.06278 11.1331 5.02133 10.9953 5.00633 10.853C4.99133 10.7108 5.00306 10.5668 5.04085 10.4293C5.07864 10.2918 5.14176 10.1635 5.2266 10.0517C5.31143 9.93994 5.41633 9.84687 5.53529 9.77783C5.65425 9.70878 5.78495 9.66511 5.91993 9.64931C6.0549 9.63351 6.19151 9.64588 6.32194 9.68573C6.45238 9.72558 6.57409 9.79213 6.68013 9.88156L8.52656 11.4419C9.18452 10.7337 9.82891 10.0249 10.4759 9.31326C11.3733 8.3261 12.2757 7.3335 13.2261 6.32955Z"
                    fill="#63517A"
                  />
                </svg>
              </span>

              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
          <div class="form__row">
            <ValidationProvider
              tag="div"
              class="form__field form__field_icon"
              name="password"
              :rules="{ required: true, verify_password: true, max: 50 }"
              v-slot="{ errors }"
            >
              <input
                v-model="registerForm.password"
                type="password"
                placeholder="Password"
                :class="errors.length != 0 ? 'in-valid' : ''"
              />
              <span class="icon" :class="errors.length != 0 ? 'in-valid' : ''">
                <svg width="20" height="20" viewBox="0 0 20 20">
                  <path
                    d="M8.1601 8.60098L2.39841 13.7884C2.22937 13.9399 2.12685 14.1557 2.11694 14.3805L2.00086 16.9954C1.99068 17.2231 2.07129 17.4409 2.22807 17.6088C2.38459 17.7767 2.5985 17.8749 2.83014 17.8849L5.49173 17.9992C5.72338 18.0089 5.94511 17.9297 6.11571 17.7762L6.81013 17.151C6.963 17.0134 7.05899 16.8309 7.08482 16.631L7.37516 15.4967L8.55139 15.3114C8.97764 15.2935 9.3439 14.9636 9.3992 14.5479L9.6898 13.4126L10.865 13.2273C11.0703 13.2193 11.2641 13.1414 11.4162 13.0038L11.8782 12.588C13.4723 12.9699 15.1765 12.5473 16.3963 11.4489C17.3696 10.5726 17.9373 9.3748 17.9952 8.07552C18.0528 6.77649 17.5937 5.53436 16.7018 4.57804C15.8089 3.62042 14.5893 3.06139 13.2688 3.00474C11.9478 2.9481 10.6837 3.40025 9.7091 4.27788C8.48905 5.3757 7.91202 7.00692 8.1601 8.60098ZM13.9586 6.00574C14.251 6.0183 14.5207 6.14184 14.7185 6.35356C15.1265 6.79136 15.0965 7.47394 14.6512 7.87482C14.4349 8.06911 14.155 8.16908 13.8628 8.15652C13.5709 8.14396 13.3009 8.02041 13.1032 7.80843C12.9052 7.5962 12.8032 7.32117 12.816 7.03384C12.8288 6.7465 12.9548 6.48147 13.1705 6.28692C13.3868 6.09314 13.6664 5.99318 13.9586 6.00574Z"
                    fill="#63517A"
                  />
                </svg>
              </span>
              <span class="error">{{ errors[0] }}</span>
              <span class="error error_long" v-if="errors[0] == 'too weak'"
                >Must have at least 8 characters, contain capitals “A”, numbers “9” and symbols
                “%”</span
              >
            </ValidationProvider>
          </div>
          <div class="form__row">
            <ValidationProvider
              tag="div"
              class="form__field form__field_icon"
              name="password_confirmation"
              rules="required|confirmed:password|max: 50"
              v-slot="{ errors, valid }"
            >
              <input
                v-model="registerForm.password_confirmation"
                type="password"
                placeholder="Confirm Password"
                :class="valid ? 'valid' : errors.length != 0 ? 'in-valid' : ''"
              />
              <span
                class="icon confirm"
                :class="valid ? 'valid' : errors.length != 0 ? 'in-valid' : ''"
              >
                <svg width="20" height="20" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20ZM13.2261 6.32955C13.4134 6.12672 13.6682 6.0087 13.9366 6.00045C14.1444 5.99416 14.3491 6.054 14.524 6.17218C14.699 6.29036 14.8361 6.46138 14.9175 6.66293C14.9988 6.86447 15.0207 7.08719 14.9802 7.30202C14.9396 7.51685 14.8386 7.71382 14.6903 7.86723C13.7876 8.82081 12.9222 9.77683 12.0517 10.7384C11.171 11.7114 10.285 12.69 9.35018 13.6775C9.17081 13.8683 8.93093 13.9824 8.67659 13.9981C8.42225 14.0138 8.17137 13.93 7.97209 13.7627L5.38817 11.5838C5.28212 11.4944 5.19381 11.3838 5.12829 11.2584C5.06278 11.1331 5.02133 10.9953 5.00633 10.853C4.99133 10.7108 5.00306 10.5668 5.04085 10.4293C5.07864 10.2918 5.14176 10.1635 5.2266 10.0517C5.31143 9.93994 5.41633 9.84687 5.53529 9.77783C5.65425 9.70878 5.78495 9.66511 5.91993 9.64931C6.0549 9.63351 6.19151 9.64588 6.32194 9.68573C6.45238 9.72558 6.57409 9.79213 6.68013 9.88156L8.52656 11.4419C9.18452 10.7337 9.82891 10.0249 10.4759 9.31326C11.3733 8.3261 12.2757 7.3335 13.2261 6.32955Z"
                    fill="#63517A"
                  />
                </svg>
              </span>
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
          <div class="form__row">
            <ValidationProvider
              tag="div"
              class="form__field form__field_icon datapicker"
              :class="{
                left: dateFocus || pick,
                right: !pick,
              }"
              name="birth_day"
              :rules="{ datapicker: true }"
              v-slot="{ errors }"
            >
              <DatePicker
                format="MM/DD/YYYY"
                name="birth_day"
                v-model="registerForm.birth_day"
                value-type="MM/DD/YYYY"
                placeholder="MM/DD/YYYY"
                input-class="input"
                @focus="dateFocus = true"
                @blur="dateFocus = false"
                @pick="pick = true"
                :class="errors.length != 0 ? 'in-valid' : ''"
                :disabled-date="(date) => date >= disabledAfter"
              ></DatePicker>
              <span class="icon" :class="errors.length != 0 ? 'in-valid' : ''">
                <svg width="20" height="20" viewBox="0 0 20 20">
                  <path
                    d="M18.1429 4.57143H1C1 4.00311 1.22576 3.45806 1.62763 3.0562C2.02949 2.65434 2.57454 2.42857 3.14286 2.42857H3.85714V1.71429C3.85714 1.52485 3.9324 1.34316 4.06635 1.20921C4.20031 1.07525 4.38199 1 4.57143 1C4.76087 1 4.94255 1.07525 5.0765 1.20921C5.21046 1.34316 5.28571 1.52485 5.28571 1.71429V2.42857H8.85714V1.71429C8.85714 1.52485 8.9324 1.34316 9.06635 1.20921C9.20031 1.07525 9.38199 1 9.57143 1C9.76087 1 9.94255 1.07525 10.0765 1.20921C10.2105 1.34316 10.2857 1.52485 10.2857 1.71429V2.42857H13.8571V1.71429C13.8571 1.52485 13.9324 1.34316 14.0664 1.20921C14.2003 1.07525 14.382 1 14.5714 1C14.7609 1 14.9425 1.07525 15.0765 1.20921C15.2105 1.34316 15.2857 1.52485 15.2857 1.71429V2.42857H16C16.5683 2.42857 17.1134 2.65434 17.5152 3.0562C17.9171 3.45806 18.1429 4.00311 18.1429 4.57143ZM1 6H18.1429V15.8571C18.1429 16.4255 17.9171 16.9705 17.5152 17.3724C17.1134 17.7742 16.5683 18 16 18H3.14286C2.57454 18 2.02949 17.7742 1.62763 17.3724C1.22576 16.9705 1 16.4255 1 15.8571V6ZM12.4286 8.85714C12.4286 9.04658 12.5038 9.22826 12.6378 9.36222C12.7717 9.49617 12.9534 9.57143 13.1429 9.57143H14.5714C14.7609 9.57143 14.9425 9.49617 15.0765 9.36222C15.2105 9.22826 15.2857 9.04658 15.2857 8.85714C15.2857 8.6677 15.2105 8.48602 15.0765 8.35207C14.9425 8.21811 14.7609 8.14286 14.5714 8.14286H13.1429C12.9534 8.14286 12.7717 8.21811 12.6378 8.35207C12.5038 8.48602 12.4286 8.6677 12.4286 8.85714ZM12.4286 11.7143C12.4286 11.9037 12.5038 12.0854 12.6378 12.2194C12.7717 12.3533 12.9534 12.4286 13.1429 12.4286H14.5714C14.7609 12.4286 14.9425 12.3533 15.0765 12.2194C15.2105 12.0854 15.2857 11.9037 15.2857 11.7143C15.2857 11.5248 15.2105 11.3432 15.0765 11.2092C14.9425 11.0753 14.7609 11 14.5714 11H13.1429C12.9534 11 12.7717 11.0753 12.6378 11.2092C12.5038 11.3432 12.4286 11.5248 12.4286 11.7143ZM12.4286 14.5714C12.4286 14.7609 12.5038 14.9426 12.6378 15.0765C12.7717 15.2105 12.9534 15.2857 13.1429 15.2857H14.5714C14.7609 15.2857 14.9425 15.2105 15.0765 15.0765C15.2105 14.9426 15.2857 14.7609 15.2857 14.5714C15.2857 14.382 15.2105 14.2003 15.0765 14.0664C14.9425 13.9324 14.7609 13.8571 14.5714 13.8571H13.1429C12.9534 13.8571 12.7717 13.9324 12.6378 14.0664C12.5038 14.2003 12.4286 14.382 12.4286 14.5714ZM8.14286 8.85714C8.14286 9.13969 8.22664 9.41589 8.38361 9.65082C8.54059 9.88574 8.7637 10.0688 9.02474 10.177C9.28577 10.2851 9.57301 10.3134 9.85013 10.2583C10.1272 10.2031 10.3818 10.0671 10.5816 9.8673C10.7814 9.66751 10.9174 9.41296 10.9726 9.13584C11.0277 8.85873 10.9994 8.57149 10.8913 8.31045C10.7831 8.04942 10.6 7.8263 10.3651 7.66933C10.1302 7.51236 9.85397 7.42857 9.57143 7.42857C9.19255 7.42857 8.82919 7.57908 8.56128 7.84699C8.29337 8.1149 8.14286 8.47826 8.14286 8.85714ZM8.14286 11.7143C8.14286 11.9037 8.21811 12.0854 8.35207 12.2194C8.48602 12.3533 8.6677 12.4286 8.85714 12.4286H10.2857C10.4752 12.4286 10.6568 12.3533 10.7908 12.2194C10.9247 12.0854 11 11.9037 11 11.7143C11 11.5248 10.9247 11.3432 10.7908 11.2092C10.6568 11.0753 10.4752 11 10.2857 11H8.85714C8.6677 11 8.48602 11.0753 8.35207 11.2092C8.21811 11.3432 8.14286 11.5248 8.14286 11.7143ZM8.14286 14.5714C8.14286 14.7609 8.21811 14.9426 8.35207 15.0765C8.48602 15.2105 8.6677 15.2857 8.85714 15.2857H10.2857C10.4752 15.2857 10.6568 15.2105 10.7908 15.0765C10.9247 14.9426 11 14.7609 11 14.5714C11 14.382 10.9247 14.2003 10.7908 14.0664C10.6568 13.9324 10.4752 13.8571 10.2857 13.8571H8.85714C8.6677 13.8571 8.48602 13.9324 8.35207 14.0664C8.21811 14.2003 8.14286 14.382 8.14286 14.5714ZM3.85714 8.85714C3.85714 9.13969 3.94093 9.41589 4.0979 9.65082C4.25487 9.88574 4.47799 10.0688 4.73902 10.177C5.00006 10.2851 5.2873 10.3134 5.56441 10.2583C5.84153 10.2031 6.09608 10.0671 6.29587 9.8673C6.49566 9.66751 6.63171 9.41296 6.68684 9.13584C6.74196 8.85873 6.71367 8.57149 6.60554 8.31045C6.49742 8.04942 6.31431 7.8263 6.07939 7.66933C5.84446 7.51236 5.56826 7.42857 5.28571 7.42857C4.90683 7.42857 4.54347 7.57908 4.27556 7.84699C4.00765 8.1149 3.85714 8.47826 3.85714 8.85714ZM3.85714 11.7143C3.85714 11.9037 3.9324 12.0854 4.06635 12.2194C4.20031 12.3533 4.38199 12.4286 4.57143 12.4286H6C6.18944 12.4286 6.37112 12.3533 6.50508 12.2194C6.63903 12.0854 6.71429 11.9037 6.71429 11.7143C6.71429 11.5248 6.63903 11.3432 6.50508 11.2092C6.37112 11.0753 6.18944 11 6 11H4.57143C4.38199 11 4.20031 11.0753 4.06635 11.2092C3.9324 11.3432 3.85714 11.5248 3.85714 11.7143ZM3.85714 14.5714C3.85714 14.7609 3.9324 14.9426 4.06635 15.0765C4.20031 15.2105 4.38199 15.2857 4.57143 15.2857H6C6.18944 15.2857 6.37112 15.2105 6.50508 15.0765C6.63903 14.9426 6.71429 14.7609 6.71429 14.5714C6.71429 14.382 6.63903 14.2003 6.50508 14.0664C6.37112 13.9324 6.18944 13.8571 6 13.8571H4.57143C4.38199 13.8571 4.20031 13.9324 4.06635 14.0664C3.9324 14.2003 3.85714 14.382 3.85714 14.5714Z"
                    fill="#63517A"
                  />
                </svg>
              </span>
              <span class="name" v-if="!pick && !dateFocus">Birthday</span>
              <transition-group name="fadeEl" tag="span" v-if="serverErrors">
                <span
                  v-for="err in serverErrors.errors.birth_day"
                  :key="err"
                  class="error error_long"
                  >{{ err }}</span
                >
              </transition-group>
            </ValidationProvider>
          </div>

          <ValidationProvider tag="div" class="terms" name="terms" rules="true">
            <label>
              <input v-model="registerForm.is_accepted_terms" type="checkbox" />
              <span></span>
            </label>
            <p>
              I agree to all
              <a href="#" @click.prevent="showModal()" class="underline">Terms and Conditions</a>
              for Platform Use
            </p>
          </ValidationProvider>
        </div>
        <div class="btn_wrapper">
          <button class="btn btn-yellow" :disabled="invalid">Continue</button>
          <div class="to__login">
            Already have an account?
            <router-link to="/login">Sign In</router-link>
          </div>
        </div>
      </form>
    </ValidationObserver>
    <PrivacyTermsModal :showModal="modal" :actions="true" @hideModal="hideModal" @accept="accept">
    </PrivacyTermsModal>
  </AuthContainer>
</template>
<script>
import AuthContainer from '@/common/auth/authContainer.vue'
import PrivacyTermsModal from '@/components/privacyTermsModal.vue'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import DatePicker from 'vue2-datepicker'

import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  name: 'registration',
  components: {
    AuthContainer,
    PrivacyTermsModal,
    ValidationObserver,
    ValidationProvider,
    DatePicker,
  },
  data() {
    return {
      disabledAfter: new Date(),
      registerForm: {
        first_name: '',
        last_name: '',
        email: '',
        email_confirmation: '',
        password: '',
        password_confirmation: '',
        birth_day: null,
        is_accepted_terms: false,
      },
      serverErrors: null,
      modal: false,
      dateFocus: false,
      pick: false,
    }
  },
  computed: {
    serverError() {
      if (this.serverErrors != null) {
        return this.serverErrors
      }
    },
  },
  methods: {
    ...mapActions('auth', ['singup']),
    async sendInfo() {
      try {
        const user = {
          first_name: this.registerForm.first_name,
          last_name: this.registerForm.last_name,
          email: this.registerForm.email,
          password: this.registerForm.password,
          password_confirmation: this.registerForm.password_confirmation,
          birth_day: this.registerForm.birth_day,
          is_accepted_terms: this.registerForm.is_accepted_terms,
        }
        var res = await this.axios.post('/donors/register', user)
        this.singup(res.data)

        this.$router.push({ name: 'security-questions-register' })
      } catch (error) {
        this.serverErrors = error.response.data
        console.log(error)
      }
    },
    showModal() {
      this.modal = true
    },
    hideModal(data) {
      this.modal = false
    },
    accept(data) {
      this.registerForm.is_accepted_terms = true
    },
  },
}
</script>
<style lang="scss" scoped>
</style>