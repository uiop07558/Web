<script>
import ReglamentAnswer from './ReglamentAnswer.vue'
import * as ANSWER from '@/store/actions/reglament_answers.js'
import ReglamentQuestionPopMenu from './ReglamentQuestionPopMenu.vue'
import BoardModalBoxDelete from '@/components/Board/BoardModalBoxDelete.vue'
export default {
  components: {
    ReglamentAnswer,
    ReglamentQuestionPopMenu,
    BoardModalBoxDelete
  },
  props: {
    question: {
      type: Object,
      default: () => ({})
    },
    isEditing: {
      type: Boolean,
      default: false
    }
  },
  emits: ['deleteQuestion', 'deleteAnswer', 'setRightAnswer'],
  data () {
    return {
      answers: this?.question?.answers ?? [],
      showDeleteQuestion: false,
      showDeleteAnswer: false,
      rightAnswer: false
    }
  },
  computed: {
    canEdit () {
      return this.$store.state.greedSource?.email_creator === this.$store.state.user.user.current_user_email
    }
  },
  methods: {
    onAddAnswer () {
      const data = {
        name: 'new answer',
        uid: this.uuidv4(),
        uid_question: this.question.uid,
        is_right: false
      }
      this.$store.dispatch(ANSWER.CREATE_REGLAMENT_ANSWER_REQUEST, data)
      this.answers.push(data)
    },
    setRightAnswer (answer) {
      const data = {
        uid: answer.uid,
        uid_question: this.question.uid,
        name: answer.name,
        is_right: answer.is_right
      }
      this.$store.dispatch(ANSWER.UPDATE_REGLAMENT_ANSWER_REQUEST, data)
      console.log(data)
    },
    onSelectAnswer (uid) {
      for (let i = 0; i < this.answers.length; i++) {
        if (this.answers[i].uid === uid) {
          if (this.answers[i].selected) {
            this.answers[i].selected = false
            return
          }
          this.answers[i].selected = true
        }
      }
    },
    uuidv4 () {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
          c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
      )
    },
    onDeleteAnswer (uid) {
      console.log(uid)
      this.showDeleteAnswer = false
      for (let i = 0; i < this.answers.length; i++) {
        if (this.answers[i].uid === uid) {
          this.answers.splice(i, 1)
        }
      }
      this.$store.dispatch(ANSWER.DELETE_REGLAMENT_ANSWER_REQUEST, uid)
    },
    deleteQuestion () {
      this.showDeleteQuestion = false
      this.$emit('deleteQuestion', this.question.uid)
    }
  }
}
</script>

<template>
  <BoardModalBoxDelete
    v-if="showDeleteQuestion"
    title="Удалить вопрос"
    text="Вы действительно хотите удалить вопрос?"
    @cancel="showDeleteQuestion = false"
    @yes="deleteQuestion"
  />
  <div
    class="bg-white p-3 rounded-[10px] mb-2"
  >
    <div class="px-1 flex justify-between items-start group">
      <div
        data-placeholder="Question name"
        class="font-[500] text-[18px] my-3"
        :contenteditable="isEditing && canEdit"
        @blur="false"
        @keyup="false"
        v-html="question.name"
      />
      <ReglamentQuestionPopMenu
        v-if="isEditing && canEdit"
        :question="question"
        @deleteQuestion="showDeleteQuestion = true"
      />
    </div>
    <template
      v-for="(answer) in answers"
      :key="answer.uid"
    >
      <ReglamentAnswer
        class="mb-1"
        :is-editing="isEditing"
        :answer="answer"
        @set-right-answer="setRightAnswer"
        @onSelectAnswer="onSelectAnswer"
        @deleteAnswer="onDeleteAnswer"
      />
    </template>
    <button
      v-if="canEdit && isEditing"
      class="ml-[5px] mt-2 font-[300] text-[14px] bg-[#F4F5F7] p-1 px-3 rounded-[5px] hover:cursor-pointer transition hover:opacity-[0.6]"
      @click.stop="onAddAnswer"
    >
      Добавить ответ
    </button>
  </div>
</template>

<style scoped>

</style>
