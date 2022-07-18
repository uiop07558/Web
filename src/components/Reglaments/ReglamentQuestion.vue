<script>
import ReglamentAnswer from './ReglamentAnswer.vue'
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
      console.log(this.question)
      this.answers.push({ text: 'new answer', uid: this.uuidv4() })
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
      this.showDeleteAnswer = false
      for (let i = 0; i < this.answers.length; i++) {
        if (this.answers[i].uid === uid) {
          this.answers.splice(i, 1)
        }
      }
    },
    deleteQuestion () {
      this.showDeleteQuestion = false
      this.$emit('deleteQuestion', this.question.uid)
    },
    changeQuestionName (event) {
      const data = {
        uid: this.question.uid,
        name: event.target.innerText
      }
      this.$store.dispatch('UPDATE_REGLAMENT_QUESTION_REQUEST', data)
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
        @blur="changeQuestionName($event)"
        @keyup="changeQuestionName($event)"
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
