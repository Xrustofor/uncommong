<template>
  <div>
    <header
      :style="`background-image: linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${headerImg})`"
      class="sweepstake_payment"
    >
      <div class="container">
        <div class="header_footer">
          <p>{{ headerDescription }}</p>
        </div>
      </div>
    </header>
    <section>
      <div class="container">
        <div class="section_top">
          <router-link :to="`/sweepstakes/${slug}`"
            >Return to Sweepstake Page</router-link
          >
        </div>
        <div class="section_body" id="checkoutDonation">
          <div class="body_top">
            <h3>Make a Donation</h3>
          </div>
          <div class="body_main">
            <div class="group_input">
              <div class="input_wrap">
                <inputLabel
                  label="Your First Name"
                  type="text"
                  placeholder="First Name"
                  :required="true"
                  @input="
                    firstName = $event.val;
                    firstNameValid = $event.valid;
                  "
                />
              </div>
              <div class="input_wrap">
                <inputLabel
                  label="Your last Name:"
                  type="text"
                  placeholder="Last Name:"
                  :required="true"
                  @input="
                    lastName = $event.val;
                    lastNameValid = $event.valid;
                  "
                />
              </div>
            </div>
            <div class="input_wrap">
              <inputLabel
                label="Email"
                type="email"
                placeholder="Your email"
                :required="true"
                @input="
                  email = $event.val;
                  emailValid = $event.valid;
                "
              />
            </div>
            <div class="group_input">
              <div class="input_wrap">
                <inputLabel
                  label="Address"
                  type="text"
                  placeholder="Your address:"
                  :required="true"
                  @input="
                    address = $event.val;
                    addressValid = $event.valid;
                  "
                />
              </div>
              <div class="input_wrap">
                <inputLabel
                  label="Apartment Info"
                  type="text"
                  placeholder="Apartment, suite, etc. (optional)"
                  @input="
                    apartment = $event.val;
                    apartmentValid = $event.valid;
                  "
                />
              </div>
            </div>

            <div class="group_input">
              <div class="input_wrap">
                <label class="input_title">Country <span>*</span></label>
                <country-select
                  className="country_region"
                  v-model="country"
                  :country="country"
                  topCountry="US"
                  placeholder="Choose:"
                >
                </country-select>
              </div>
              <div class="input_wrap">
                <label class="input_title">State <span>*</span></label>
                <region-select
                  className="country_region"
                  v-model="region"
                  :country="country"
                  :region="region"
                  placeholder="Choose:"
                />
              </div>
            </div>
            <div class="group_input">
              <div class="input_wrap">
                <inputLabel
                  label="City:"
                  type="text"
                  placeholder="City:"
                  :required="true"
                  @input="
                    city = $event.val;
                    cityValid = $event.valid;
                  "
                />
              </div>
              <div class="input_wrap">
                <inputLabel
                  class="zipcode_input"
                  label="Zipcode"
                  type="text"
                  placeholder="Zip/Postal Code"
                  :required="true"
                  mask="#####"
                  @input="
                    zipCode = $event.val;
                    zipCodeValid = $event.valid;
                  "
                />
              </div>
            </div>
            <div class="button_block">
              <LoaderButton
                class="btn-yellow button"
                text="SUBMIT ENTRY"
                :disabled="!validField"
                @emitClick="sendData"
                :loading="loaded"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import inputLabel from "@/components/inputs/inputLabel";
import vSelect from "vue-select";
import LoaderButton from "@/components/buttons/loaderButton.vue";
import { scroller } from "vue-scrollto/src/scrollTo";
export default {
  components: {
    inputLabel,
    vSelect,
    LoaderButton,
  },
  data() {
    return {
      prize: +this.$route.query.prize || 0,
      slug: this.$route.params.sweepstakeId || "",
      headerImg: "",
      headerDescription: "",
      organizationsOptions: [],
      city: "",
      cityValid: false,
      country: "",
      region: "",
      firstName: "",
      firstNameValid: false,
      lastName: "",
      lastNameValid: false,
      email: "",
      emailValid: false,
      address: "",
      addressValid: false,
      apartment: "",
      zipCode: "",
      zipCodeValid: false,
    };
  },
  async created() {
    this.$store.dispatch("setLoader", false);

    if (this.details.image === "" || this.details.headline === "") {
      this.$store.dispatch("setLoader", true);
      await this.apiGetSweepstakData(this.slug);
      this.$store.dispatch("setLoader", false);
    }

    this.headerImg = this.details.image;
    this.headerDescription = this.details.headline;

    this.organizationsOptions = this.organizations.map((o) => ({
      name: o.name,
      id: +o.id,
    }));
  },
  computed: {
    ...mapGetters({ loader: "getWebsiteLoader" }),
    ...mapGetters("publicweb/sweepstake", {
      details: "getDetails",
      organizations: "getOrganizations",
      message: "getMessage",
      loaded: "getLoaded",
    }),

    validField() {
      return (
        !!this.country &&
        !!this.region &&
        !!this.cityValid &&
        this.firstNameValid &&
        this.lastNameValid &&
        this.apartment &&
        this.emailValid &&
        this.addressValid &&
        this.zipCodeValid
      );
    },
  },
  watch: {
    loader(newVal) {
      if (!newVal) {
        const firstScrollTo = scroller();
        firstScrollTo("#donation");
      }
    },
  },
  methods: {
    ...mapActions("publicweb/sweepstake", [
      "apiGetSweepstakData",
      "apiSendFreeDonate",
    ]),
    async sendData() {
      const data = {
        first_name: this.firstName,
        last_name: this.lastName,
        email: this.email,
        address: this.address,
        apartment: this.apartment,
        city: this.city,
        country: this.country,
        state: this.region,
        zip: this.zipCode,
      };
      const result = await this.apiSendFreeDonate(data);
      if (result.success) {
        this.$swal({
          title: this.message,
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.value) {
            this.$router.push(`/sweepstakes/${this.slug}`);
          }
        });
      } else {
        this.$swal({
          title: result.message,
          confirmButtonText: "OK",
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
header {
  min-height: 550px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  padding-top: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin-bottom: 3.2rem;
  .header_footer {
    max-width: 65%;
    background-color: rgba(99, 81, 122, 0.8);
    border-radius: 20px 20px 0px 0px;
    padding: 2.3rem 2.3rem 4.3rem 3rem;
    @media only screen and (max-width: 768px) {
      max-width: 100%;
      padding: 25px 15px;
    }
    p {
      color: $white;
      @include type(inherit, 56px, 900, none, 1.2);
      @media only screen and (max-width: 1299px) {
        @include type(inherit, 45px, 900, none, 1.2);
      }
      @media only screen and (max-width: 998px) {
        @include type(inherit, 40px, 900, none, 1.2);
      }
      @media only screen and (max-width: 768px) {
        @include type(inherit, 30px, 900, none, 1.2);
      }
    }
  }
}
section {
  margin-bottom: 6.5rem;
}
.section_top {
  a {
    color: $textLightBlue;
    font-family: Inter;
    font-style: normal;
    font-weight: normal;
    font-size: 1.8rem;
    text-decoration-line: underline;
  }
}
.section_body {
  max-width: 890px;
  width: 100%;
  padding-top: 65px;
  margin: 0 auto 10rem;
}
.body_top {
  margin-bottom: 2.7rem;
  width: 100%;
  margin-bottom: 5rem;
  h3 {
    color: $violet;
    font-family: Inter;
    font-style: normal;
    font-weight: 800;
    font-size: 3rem;
    line-height: 3.6rem;
    margin-bottom: 2.9rem;
  }
  p {
    font-family: Inter;
    font-style: normal;
    font-weight: normal;
    font-size: 1.8rem;
    text-align: center;
    margin-bottom: 1.6rem;
  }
  button {
    margin: auto;
  }
}
.body_main {
  background: $white;
  border: 1px solid #4b3d5b;
  box-shadow: 0px 24px 20px rgba(154, 131, 183, 0.05),
    0px 3px 2px rgba(154, 131, 183, 0.02),
    0px 8px 100px rgba(154, 131, 183, 0.1);
  border-radius: 20px;
  min-height: 50rem;
  padding: 3.4rem 1.5rem;
}

.country_region {
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 1.4rem;
  line-height: 2.8rem;
  color: $disabledColor;
  @media (max-width: 768px) {
    max-width: none;
  }
}
.section_bootom {
  h4 {
    font-family: Inter;
    font-style: normal;
    font-weight: 900;
    font-size: 2.4rem;
    color: $violet;
    margin-bottom: 2rem;
  }
  p {
    color: $violet;
    font-size: 2rem;
    font-size: 1.4rem;
  }
}
.group_input {
  display: flex;
  @media (max-width: 768px) {
    flex-direction: column;
  }
}
.input_wrap {
  margin-bottom: 2.4rem;
  flex: 1;
  padding: 0 1.5rem;
  label {
    font-family: Inter;
    font-style: normal;
    font-weight: normal;
    font-size: 1.2rem;
    color: $violet;
    margin-bottom: 0.8rem;
    &.input_title {
      margin-bottom: 0.3rem;
      span {
        color: $red;
        margin-left: 5px;
      }
    }
  }
  .required {
    margin-left: 5px;
    color: $red;
  }
}

.right_bottom {
  margin-top: 2.7rem;
  button {
    width: 100%;
  }
}

.button_block {
  display: flex;
  justify-content: center;
  .button {
    max-width: 47rem;
    width: 100%;
  }
}
.zipcode_input {
  max-width: 47rem;
  width: 100%;
  @media (max-width: 768px) {
    max-width: none;
  }
}
</style>
