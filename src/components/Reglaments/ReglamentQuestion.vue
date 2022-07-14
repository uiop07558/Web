<script>
import ListBlocAdd from '@/components/Common/ListBlocAdd.vue'
import ReglamentAnswer from './ReglamentAnswer.vue'
import ReglamentQuestionPopMenu from './ReglamentQuestionPopMenu.vue'
import BoardModalBoxDelete from '@/components/Board/BoardModalBoxDelete.vue'
export default {
  components: {
    ReglamentAnswer,
    ListBlocAdd,
    ReglamentQuestionPopMenu,
    BoardModalBoxDelete
  },
  props: {
    question: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['deleteQuestion', 'deleteAnswer'],
  data () {
    return {
      answers: this?.question?.answers ?? [],
      showDeleteQuestion: false,
      showDeleteAnswer: false
    }
  },
  computed: {
    canEdit () {
      return this.$store.state.greedSource.email_creator === this.$store.state.user.user.current_user_email
    }
  },
  methods: {
    onAddAnswer () {
      console.log(this.question)
      this.answers.push({ text: 'new answer', uid: 'fake_uid' })
    },
    onDeleteAnswer () {
      this.showDeleteAnswer = false
      for (let i = 0; i < this.answers.length; i++) {
        if (this.answers[i].uid === 'fake_uid') {
          this.answers.splice(i, 1)
        }
      }
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
        :contenteditable="true"
        @blur="false"
        @keyup="false"
        v-html="question.text"
      />
      <ReglamentQuestionPopMenu
        :question="question"
        @deleteQuestion="showDeleteQuestion = true"
      />
    </div>
    <template
      v-for="(answer, index) in answers"
      :key="index"
    >
      <ReglamentAnswer
        class="mb-1"
        :answer="answer"
        @deleteAnswer="onDeleteAnswer"
      />
    </template>
    <ListBlocAdd
      v-if="canEdit"
      class="mt-5"
      @click.stop="onAddAnswer"
    />
  </div>
</template>

<style scoped>

</style>
