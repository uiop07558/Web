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
    reglament: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      text: ''
    }
  }
}
</script>
<template>
  <QuillEditor
    v-model:content="text"
    content-type="html"
    theme="snow"
    placeholder="Текст регламента..."
    @click="show"
  />
  <ListBlocAdd
    @click.stop="clickAddProject"
  />
</template>

<style scoped>

</style>
