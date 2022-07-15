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
        { name: 'hello world 1', uid: this.uuidv4(), answers: [{ text: 'answer 1', uid: this.uuidv4(), selected: false }, { text: 'answer 2', uid: this.uuidv4() }] },
        { name: 'hello world 2', uid: this.uuidv4() }
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
      return this.currentReglament?.email_creator === this.user.current_user_email
    },
    user () {
      return this.$store.state.user.user
    }
  },
  watch: {
    isEditing (newval, oldval) {
      if (!newval) {
        setTimeout(() => {
          try {
            document.querySelector('div.ql-toolbar').remove()
          } catch (e) {}
        }, 50)
      }
    }
  },
  mounted () {
    try {
      document.querySelector('div.ql-toolbar').remove()
    } catch (e) {}
  },
  methods: {
    uuidv4 () {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
          c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
      )
    },
    onAddQuestion () {
      const question = { uid: this.uuidv4(), name: 'new question', uid_reglament: this.reglament.uid }
      this.$store.dispatch('CREATE_REGLAMENT_QUESTION_REQUEST', question).then(() => {
        this.questions.push(question)
      })
    },
    onDeleteQuestion (uid) {
      alert(uid)
      this.showDeleteQuestion = false
      for (let i = 0; i < this.questions.length; i++) {
        if (this.questions[i].uid === uid) {
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
    v-if="!isEditing && text?.length"
    v-model:content="text"
    content-type="html"
    :read-only="true"
    :toolbar="['']"
    class="h-auto mb-5 bg-white"
  />
  <QuillEditor
    v-if="isEditing"
    v-model:content="text"
    content-type="html"
    :toolbar="'full'"
    class="h-auto mb-5 bg-white"
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
