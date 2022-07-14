<script>
import ReglamentAnswerPopMenu from './ReglamentAnswerPopMenu.vue'
import BoardModalBoxDelete from '@/components/Board/BoardModalBoxDelete.vue'
export default {
  components: {
    ReglamentAnswerPopMenu,
    BoardModalBoxDelete
  },
  props: {
    answer: Object
  },
  emits: ['deleteAnswer'],
  setup () {

  },
  data () {
    return {
      showDeleteAnswer: false
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
  <div class="border-b-[1px] border-[#eaeaea] p-1 px-1 flex justify-between items-start group">
    <div
      data-placeholder="Question name"
      class="font-[300] text-[14px]"
      :contenteditable="true"
      @blur="false"
      @keyup="false"
      v-html="answer.text"
    />
    <ReglamentAnswerPopMenu
      @deleteAnswer="showDeleteAnswer = true"
    />
  </div>
</template>

<style scoped>

</style>
