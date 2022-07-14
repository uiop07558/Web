<script>
import ListBlocAdd from '@/components/Common/ListBlocAdd.vue'
import ReglamentAnswer from './ReglamentAnswer.vue'
import ReglamentQuestionPopMenuVue from './ReglamentQuestionPopMenu.vue'
export default {
  components: {
    ReglamentAnswer,
    ListBlocAdd,
    ReglamentQuestionPopMenuVue
  },
  props: {
    question: Object
  },
  data () {
    return {
      answers: this?.question?.answers ?? []
    }
  },
  methods: {
    onAddAnswer () {
      this.answers.push({ text: 'new answer' })
    }
  }
}
</script>

<template>
  <div
    class="bg-white p-3 rounded-[10px]"
  >
    <div class="px-1 flex justify-between items-start">
      <div
        data-placeholder="Question name"
        class="font-[500] text-[18px] my-3"
        :contenteditable="true"
        @blur="false"
        @keyup="false"
        v-html="question.text"
      />
      <ReglamentQuestionPopMenuVue />
    </div>
    <template
      v-for="(answer, index) in answers"
      :key="index"
    >
      <ReglamentAnswer
        class="mb-1"
        :answer="answer"
      />
    </template>
    <ListBlocAdd
      class="mt-5"
      @click.stop="onAddAnswer"
    />
  </div>
</template>

<style scoped>

</style>
