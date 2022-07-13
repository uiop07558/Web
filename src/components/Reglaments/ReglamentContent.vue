<script>
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

export default {
  components: {
    QuillEditor
  },
  setup () {
  }
}
</script>
<template>
  <QuillEditor
    theme="snow"
    placeholder="Текст регламента..."
  />
</template>

<style scoped>

</style>
