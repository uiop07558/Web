<script>
export default {
  props: {
    answer: Object
  },
  setup () {

  }
}
</script>

<template>
  <div class="border-b-[1px] border-[#eaeaea] p-1">
    <div
      data-placeholder="Question name"
      class="font-[300] text-[14px]"
      :contenteditable="true"
      @blur="false"
      @keyup="false"
      v-html="answer.text"
    />
  </div>
</template>

<style scoped>

</style>
