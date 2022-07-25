<template>
  <div
    v-if="showQuestion"
    class="bg-white p-3 rounded-[10px] mb-2"
  >
    <div class="px-1 flex justify-between items-center group">
      <div class="font-[400] text-[18px] my-3 min-w-[10px] min-h-[10px]">
        {{ question.name }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    question: {
      type: String,
      default: ''
    }
  },
  computed: {
    showQuestion () {
      let shouldShow = 0
      for (let i = 0; i < this.question.answers.length; i++) {
        if (this.question.answers[i].is_right && this.question.answers[i].selected) {
          shouldShow = -1
        } else if (!this.question.answers[i].is_right && this.question.answers[i].selected) {
          shouldShow = 1
          return shouldShow
        } else {
          shouldShow = 1
          return shouldShow
        }
      }
      return shouldShow
    }
  }
}
</script>
<style scoped>
</style>
