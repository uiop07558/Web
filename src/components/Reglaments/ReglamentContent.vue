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
      text: this.reglament?.content,
      isEditing: false,
      questions: [
        { text: 'hello world 1', uid: 'fake_uid', answers: [{ text: 'answer 1', uid: 'fake_uid' }, { text: 'answer 2', uid: 'fake_uid' }] },
        { text: 'hello world 2', uid: 'fake_uid' }
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
    onDeleteQuestion () {
      this.showDeleteQuestion = false
      for (let i = 0; i < this.questions.length; i++) {
        if (this.questions[i].uid === 'fake_uid') {
          this.questions.splice(i, 1)
        }
      }
    },
    isEdit () {
      this.currentReglament.content = this.text
      this.$store.dispatch('UPDATE_REGLAMENT_REQUEST', this.currentReglament)
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
      :is-editing="isEditing"
      :question="question"
      @deleteQuestion="onDeleteQuestion"
    />
  </template>
  <div class="flex w-full pb-5">
    <ListBlocAdd
      v-if="canEdit && isEditing"
      class="mt-5 w-full"
      @click.stop="onAddQuestion"
    />
  </div>
</template>

<style scoped>

</style>
