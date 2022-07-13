<script>
import { QuillEditor } from '@vueup/vue-quill'
import ListBlocAdd from '@/components/Common/ListBlocAdd.vue'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

export default {
  components: {
    QuillEditor,
    ListBlocAdd
  },
  props: {
    reglament: Object
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
  <ListBlocAdd
    @click.stop="clickAddProject"
  />
</template>

<style scoped>

</style>
