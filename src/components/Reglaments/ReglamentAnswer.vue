<script>
import ReglamentAnswerPopMenu from './ReglamentAnswerPopMenu.vue'
import BoardModalBoxDelete from '@/components/Board/BoardModalBoxDelete.vue'
export default {
  components: {
    ReglamentAnswerPopMenu,
    BoardModalBoxDelete
  },
  props: {
    answer: {
      type: Object,
      default: () => ({})
    },
    isEditing: {
      type: Boolean,
      default: false
    }
  },
  emits: ['deleteAnswer', 'setRightAnswer', 'onSelectAnswer', 'resetRightAnswer', 'updateAnswerName'],
  expose: ['onFocus'],
  data () {
    return {
      name: '',
      showDeleteAnswer: false,
      rightAnswer: false
    }
  },
  computed: {
    selected () {
      return this.answer.selected
    }
  },
  methods: {
    deleteAnswer () {
      this.showDeleteAnswer = false
      this.$emit('deleteAnswer', this.answer.uid)
    },
    onSelectAnswer () {
      if (this.isEditing) return
      this.$emit('onSelectAnswer', this.answer.uid)
    },
    setRightAnswer (val) {
      this.rightAnswer = true
      this.$emit('setRightAnswer', [this.answer, val])
    },
    resetRightAnswer () {
      this.rightAnswer = false
    },
    updateAnswerName (event) {
      this.$emit('updateAnswerName', [event.target.innerText, this.answer])
    },
    onFocus () {
      this.$refs[this.answer.uid + 'input'].focus()
      const range = document.createRange()
      const sel = document.getSelection()
      range.setStart(this.$refs[this.answer.uid + 'input'], 1)
      range.collapse(true)
      sel.removeAllRanges()
      sel.addRange(range)
    }
  }
}
</script>

<template>
  <BoardModalBoxDelete
    v-if="showDeleteAnswer"
    title="Удалить ответ"
    text="Вы действительно хотите удалить ответ?"
    @cancel="showDeleteAnswer = false"
    @yes="deleteAnswer"
  />
  <div
    class="border-[1px] hover:cursor-pointer border-[#eaeaea] p-2 px-2 flex justify-between items-start group rounded-[8px] mb-[5px]"
    :class="{ 'border-[#d7f7e2] bg-[#e8faee]': (rightAnswer && isEditing), 'bg-slate-200': selected }"
    @click="onSelectAnswer"
  >
    <div
      :ref="answer.uid + 'input'"
      data-placeholder="Question name"
      class="font-[300] text-[14px]"
      :contenteditable="isEditing"
      @blur="false"
      @keyup="false"
      @focusout="updateAnswerName"
      v-text="answer.name"
    />
    <ReglamentAnswerPopMenu
      v-if="isEditing"
      :is-editing="isEditing"
      @deleteAnswer="deleteAnswer"
      @setRightAnswer="setRightAnswer(true)"
      @resetRightAnswer="setRightAnswer(false)"
    />
  </div>
</template>

<style scoped>

</style>
