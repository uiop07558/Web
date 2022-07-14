<script>
import ReglamentAnswerPopMenu from './ReglamentAnswerPopMenu.vue'
export default {
  components: {
    ReglamentAnswerPopMenu
  },
  props: {
    answer: Object
  },
  setup () {

  },
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<template>
  <div class="border-b-[1px] border-[#eaeaea] p-1 px-1 flex justify-between items-start">
    <div
      data-placeholder="Question name"
      class="font-[300] text-[14px]"
      :contenteditable="true"
      @blur="false"
      @keyup="false"
      v-html="answer.text"
    />
    <ReglamentAnswerPopMenu />
  </div>
</template>

<style scoped>

</style>
