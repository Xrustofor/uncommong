<template>
  <ValidationObserver v-slot="{ passes, invalid }" tag="div">
    <form @submit.prevent="passes(setAnswer)" class="form">
      <div class="instruction__text">
        <h5 class="instruction__text_title">Choose your security questions</h5>
        <p class="instruction__text_subtitle">
          So nobody could get access to your profile except you.
        </p>
      </div>
      <div class="form__row">
        <ValidationProvider
          tag="div"
          class="form__field"
          :rules="{ required: true }"
          v-slot="{ errors }"
        >
          <Select2
            :value="null"
            v-model="question_one.question"
            :options="myFirstOptions"
            :settings="{ minimumResultsForSearch: Infinity }"
            @select="myFisrtSelectEvent($event)"
            placeholder="1. Security Question"
            :class="errors.length != 0 ? 'in-valid' : ''"
          />
        </ValidationProvider>
      </div>
      <div class="form__row">
        <ValidationProvider
          tag="div"
          class="form__field"
          :rules="{ required: true, min: 3, max: 200 }"
          v-slot="{ errors }"
        >
          <input
            v-model="answers_for_questions[0].answer"
            placeholder="Your answer"
            :class="errors.length != 0 ? 'in-valid' : ''"
          />
          <span class="error">{{ errors[0] }}</span>
        </ValidationProvider>
      </div>
      <div class="form__row">
        <ValidationProvider
          tag="div"
          class="form__field"
          :rules="{ required: true }"
          v-slot="{ errors }"
        >
          <Select2
            v-model="question_two.question"
            :options="mySecondOptions"
            :settings="{ minimumResultsForSearch: Infinity }"
            @select="mySecondSelectEvent($event)"
            placeholder="1. Security Question"
            :class="errors.length != 0 ? 'in-valid' : ''"
          />
        </ValidationProvider>
      </div>
      <div class="form__row">
        <ValidationProvider
          tag="div"
          class="form__field"
          :rules="{ required: true, min: 3, max: 200 }"
          v-slot="{ errors }"
        >
          <input
            v-model="answers_for_questions[1].answer"
            placeholder="Your answer"
            :class="errors.length != 0 ? 'in-valid' : ''"
          />
          <span class="error">{{ errors[0] }}</span>
        </ValidationProvider>
      </div>
      <button
        class="btn btn-yellow"
        :disabled="invalid"
        :class="invalid ? 'disable' : ''"
      >
        Continue
      </button>
    </form>
  </ValidationObserver>
</template>
<script>
import { ValidationObserver, ValidationProvider } from "vee-validate";
import Select2 from "v-select2-component";

import { mapActions } from "vuex";
export default {
  name: "security-questions",
  components: {
    ValidationObserver,
    ValidationProvider,
    Select2,
  },
  data() {
    return {
      myOptions: null,
      myFirstOptions: null,
      mySecondOptions: null,
      answers_for_questions: [
        {
          security_question_id: null,
          answer: "",
        },
        {
          security_question_id: null,
          answer: "",
        },
      ],
      question_one: {
        question: "",
        security_question_id: null,
        answer: "",
      },
      question_two: {
        question: "",
        security_question_id: null,
        answer: "",
      },
    };
  },
  mounted() {
    this.getQuestions();
  },
  methods: {
    ...mapActions("securityQuestions", ["securityQuestions"]),
    getQuestions() {
      this.axios
        .get("/security-questions")
        .then((res) => {
          const payload = res.data;
          this.securityQuestions(payload);
          this.getOptions();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getOptions() {
      var security_questions = this.$store.getters[
          "securityQuestions/securityQuestions"
        ],
      options = [];
      security_questions.forEach((el) => {
        options.push(el.question);
      });
      this.myOptions = options;
      this.myFirstOptions = options;
      this.mySecondOptions = options;
    },
    myFisrtSelectEvent({ id, text }) {
      var security_questions = this.$store.getters[
        "securityQuestions/securityQuestions"
      ];
      security_questions.forEach((el) => {
        if (el.question == text) {
          this.answers_for_questions[0].security_question_id = el.id;
        }
      });
      const options = this.myOptions.filter(function (e) {
        return e != text;
      });
      this.mySecondOptions = options;
      return options;
    },
    mySecondSelectEvent({ id, text }) {
      var security_questions = this.$store.getters[
        "securityQuestions/securityQuestions"
      ];
      security_questions.forEach((el) => {
        if (el.question == text) {
          this.answers_for_questions[1].security_question_id = el.id;
        }
      });
      const options = this.myOptions.filter(function (e) {
        return e != text;
      });
      this.myFirstOptions = options;
      return options;
    },

    setAnswer() {
      this.$emit("setAnswer", {
        answers_for_questions: [
          {
            security_question_id: this.answers_for_questions[0]
              .security_question_id,
            answer: this.answers_for_questions[0].answer,
          },
          {
            security_question_id: this.answers_for_questions[1]
              .security_question_id,
            answer: this.answers_for_questions[1].answer,
          },
        ],
      });
    },
  },
};
</script>