<script>
import { QuillEditor } from '@vueup/vue-quill'
import ListBlocAdd from '@/components/Common/ListBlocAdd.vue'
import ReglamentQuestion from './ReglamentQuestion.vue'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

export default {
  components: {
    QuillEditor,
    ListBlocAdd,
    ReglamentQuestion
  },
  props: {
    reglament: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      text: '',
      questions: [
        { text: 'hello world 1', uid: 'fake_uid', answers: [{ text: 'answer 1', uid: 'fake_uid' }, { text: 'answer 2' }] },
        { text: 'hello world 2' }
      ]
    }
  },
  methods: {
    onAddQuestion () {
      this.questions.push({ text: 'new question' })
    },
    onDeleteQuestion () {
      this.showDeleteQuestion = false
      for (let i = 0; i < this.questions.length; i++) {
        if (this.questions[i].uid === 'fake_uid') {
          this.questions.splice(i, 1)
        }
      }
    }
  }
}
</script>
<template>
  <QuillEditor
    v-model:content="text"
    content-type="html"
    theme="snow"
    placeholder="Текст регламента..."
    class="max-h-72 mb-5"
  />
  <template
    v-for="(question , index) in questions"
    :key="index"
  >
    <ReglamentQuestion
      class="mb-2"
      :question="question"
      @deleteQuestion="onDeleteQuestion"
    />
  </template>
  <ListBlocAdd
    class="mt-5"
    @click.stop="onAddQuestion"
  />
</template>

<style scoped>

</style>
