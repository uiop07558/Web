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
  emits: ['deleteAnswer', 'setRightAnswer'],
  setup () {

  },
  data () {
    return {
      showDeleteAnswer: false,
      rightAnswer: false
    }
  },
  methods: {
    deleteAnswer () {
      this.showDeleteAnswer = false
      this.$emit('deleteAnswer', this.answer.uid)
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
    class="border-[1px] border-[#eaeaea] p-2 px-2 flex justify-between items-start group rounded-[8px] mb-[5px]"
    :class="{'border-[#d7f7e2] bg-[#e8faee]': rightAnswer}"
  >
    <div
      data-placeholder="Question name"
      class="font-[300] text-[14px]"
      :contenteditable="isEditing"
      @blur="false"
      @keyup="false"
      v-html="answer.text"
    />
    <ReglamentAnswerPopMenu
      v-if="isEditing"
      :is-editing="isEditing"
      @deleteAnswer="showDeleteAnswer = true"
      @setRightAnswer="rightAnswer = true"
      @resetRightAnswer="rightAnswer = false"
    />
  </div>
</template>

<style scoped>

</style>
