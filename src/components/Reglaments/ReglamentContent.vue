<script>
import { QuillEditor } from '@vueup/vue-quill'
import ListBlocAdd from '@/components/Common/ListBlocAdd.vue'
import ReglamentQuestion from './ReglamentQuestion.vue'
import PopMenuItem from '@/components/modals/PopMenuItem.vue'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

export default {
  components: {
    QuillEditor,
    ListBlocAdd,
    ReglamentQuestion,
    PopMenuItem
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
      isEditing: false,
      questions: [
        { text: 'hello world 1', answers: [{ text: 'answer 1' }, { text: 'answer 2' }] },
        { text: 'hello world 2' }
      ]
    }
  },
  computed: {
    navStack () {
      return this.$store.state.navbar.navStack
    },
    currentReglament () {
      return this.$store.state.greedSource
    },
    canEdit () {
      return this.currentReglament.email_creator === this.user.current_user_email
    },
    user () {
      return this.$store.state.user.user
    }
  },
  methods: {
    onAddQuestion () {
      this.questions.push({ text: 'new question', answers: [{ text: 'test answer' }] })
    },
    isEdit () {
      this.isEditing = !this.isEditing
    }
  }
}
</script>
<template>
  <div
    v-if="canEdit"
    class="flex justify-end mb-2"
  >
    <PopMenuItem
      class="bg-white"
      icon="edit"
      @click="isEdit"
    >
      {{ isEditing ? 'Завершить редактирование' : 'Редактировать' }}
    </PopMenuItem>
  </div>
  <QuillEditor
    v-if="!isEditing"
    v-model:content="text"
    content-type="html"
    theme="snow"
    :read-only="true"
    :toolbar="['']"
    class="max-h-72 mb-5 bg-white"
  />
  <QuillEditor
    v-if="isEditing"
    v-model:content="text"
    content-type="html"
    theme="snow"
    :toolbar="'full'"
    placeholder="Текст регламента..."
    class="max-h-72 mb-5 bg-white"
  />
  <template
    v-for="(question , index) in questions"
    :key="index"
  >
    <ReglamentQuestion
      class="mb-2"
      :question="question"
    />
  </template>
  <ListBlocAdd
    class="mt-5"
    @click.stop="onAddQuestion"
  />
</template>

<style scoped>

</style>
