<template>
  <ValidationObserver ref="observer" tag="form" v-slot="{ invalid }">
    <div class="settings_blocks">
      <div class="settings_blocks_header">
        <h4 class="title">Security question</h4>
      </div>
      <div class="form__row center">
        <div class="form__field select_no_overlay">
          <ValidationProvider
            tag="div"
            class="settings_select one"
            :rules="{ required: true }"
            v-slot="{ errors }"
            name="first_question"
          >
            <Select2
              :value="questionOneText"
              v-model="questionOneText"
              :options="oneNames"
              :settings="{ minimumResultsForSearch: Infinity }"
              @select="myFisrtSelectEvent"
              placeholder="Security Question"
              :class="errors.length != 0 ? 'in-valid' : ''"
            />
          </ValidationProvider>

          <ValidationProvider
            tag="div"
            class="form__field"
            :rules="{ required: true, min: 3, max: 200 }"
            v-slot="{ errors }"
            name="first_answer"
          >
            <input
              v-model="answerOne"
              placeholder="Your answer"
              :class="errors.length != 0 ? 'in-valid' : ''"
              @input="changeQuestion"
            />
            <span class="error">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
      </div>
      <div class="form__row center">
        <div class="form__field select_no_overlay">
          <ValidationProvider
            tag="div"
            class="settings_select two"
            :rules="{ required: true }"
            v-slot="{ errors }"
            name="second_question"
          >
            <Select2
              :value="questionTwoText"
              v-model="questionTwoText"
              :options="twoNames"
              :settings="{ minimumResultsForSearch: Infinity }"
              @select="mySecondSelectEvent"
              placeholder="Security Question"
              :class="errors.length != 0 ? 'in-valid' : ''"
            />
          </ValidationProvider>
          <ValidationProvider
            tag="div"
            :rules="{ required: true, min: 3, max: 200 }"
            v-slot="{ errors }"
            class="form__field"
            name="second_answer"
          >
            <input
              v-model="answerTwo"
              placeholder="Your answer"
              :class="errors.length != 0 ? 'in-valid' : ''"
              @input="changeQuestion"
            />
            <span class="error">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
      </div>
      <div class="btn_overlay">
        <LoaderButton
          text="Save"
          :disabled="invalid || !somethingChanged"
          :loading="loading"
          class="btn-yellow"
          @emitClick="save"
        ></LoaderButton>
      </div>
    </div>
  </ValidationObserver>
</template>
<script>
import { ValidationObserver, ValidationProvider } from "vee-validate";
import Select2 from "v-select2-component";
import LoaderButton from "@/components/buttons/loaderButton.vue";

import { mapActions, mapGetters, mapMutations } from "vuex";
export default {
  props: { somethingChanged: { type: Boolean, default: false } },
  data() {
    return {
      loading: false,
      answerOne: "",
      answerTwo: "",
      questionOneId: 0,
      questionOneText: "",
      questionTwoId: 0,
      questionTwoText: "",
    };
  },
  async mounted() {
    await this.getSecurityQuestions();
    this.answerOne = JSON.parse(JSON.stringify(this.securityAnswerOne)).text;
    this.answerTwo = JSON.parse(JSON.stringify(this.securityAnswerTwo)).text;

    await this.getApiAllQuestions();
    this.questionOneText = this.securityQuestionOneText;
    this.questionOneId = this.securityQuestionOneId;

    this.questionTwoText = this.securityQuestionTwoText;
    this.questionTwoId = this.securityQuestionTwoId;
  },
  computed: {
    ...mapGetters("user", {
      securityAnswerOne: "getSecurityAnswerOne",
      securityAnswerTwo: "getSecurityAnswerTwo",

      securityQuestionOneId: "getSecurityQuestionOneId",
      securityQuestionOneText: "getSecurityQuestionOneText",
      securityQuestionTwoId: "getSecurityQuestionTwoId",
      securityQuestionTwoText: "getSecurityQuestionTwoText",

      oneNames: "getOneNames",
      twoNames: "getTwoNames",
    }),
  },
  watch: {
    securityQuestionOneId() {
      this.questionOneId = this.securityQuestionOneId;
      this.questionOneText = this.securityQuestionOneText;
    },
    securityQuestionTwoId() {
      this.questionTwoId = this.securityQuestionTwoId;
      this.questionTwoText = this.securityQuestionTwoText;
    },
    somethingChanged(val) {
      if (!val) {
        this.loading = false;
      }
    },
  },
  methods: {
    ...mapActions("user", ["getSecurityQuestions", "getApiAllQuestions"]),
    ...mapMutations("user", [
      "setSecurityQuestionsOne",
      "setSecurityQuestionsTwo",
    ]),
    ...mapActions("securityQuestions", ["securityQuestions", "userQuestion"]),
    async myFisrtSelectEvent({ text }) {
      this.changeQuestion();
      await this.setSecurityQuestionsOne(this.questionOneText);
    },
    async mySecondSelectEvent({ text }) {
      this.changeQuestion();
      await this.setSecurityQuestionsTwo(this.questionTwoText);
    },
    save() {
      this.loading = true;
      var answersForQuestions = {
        answers_for_questions: [
          {
            id: this.securityAnswerOne.id,
            security_question_id: this.questionOneId,
            answer: this.answerOne,
          },
          {
            id: this.securityAnswerTwo.id,
            security_question_id: this.questionTwoId,
            answer: this.answerTwo,
          },
        ],
      };
      this.$emit("saveSecurityChanges", answersForQuestions);
    },
    changeQuestion() {
      this.$emit("changeQuestion");
    },
  },

  created() {
    this.$eventHub.$on("reload", this.getQuestionsFullList);
  },
  components: { ValidationObserver, ValidationProvider, Select2, LoaderButton },
};
</script>
<style lang="scss" scoped>
.select_no_overlay {
  .settings_select {
    margin-bottom: 15px;
  }
}
</style>