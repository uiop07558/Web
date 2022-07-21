<script>
import { CREATE_TASK } from '@/store/actions/tasks'

export default {
  data () {
    return {
      fileString: ''
    }
  },
  computed: {
    user () {
      return this.$store.state.user.user
    }
  },
  methods: {
    readFile (e) {
      const files = e.target.files
      if (!files.length) {
        return
      }
      const file = files[0]
      const fileReader = new FileReader()
      fileReader.readAsText(file)

      fileReader.onload = () => {
        this.fileString = fileReader.result
        this.parseFile()
      }
    },
    async parseFile () {
      const rows = this.fileString.split('\n')
      for (let i = 1; i++; i < (rows.length - 1)) {
        let modifiedRow = []
        modifiedRow = rows[i].split(';')

        const task = {
          name: modifiedRow[0],
          uid: this.uuidv4(),
          uid_customer: this.user.current_user_uid,
          uid_project: '00000000-0000-0000-0000-000000000000',
          uid_parent: '00000000-0000-0000-0000-000000000000',
          status: 0,
          email_performer: '',
          type: 1,
          comment: '',
          _addToList: true
        }
        this.$store.dispatch(CREATE_TASK, task)
      }
    },
    uuidv4 () {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
          c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
      )
    }
  }
}
</script>
<template>
  <form class="px-5">
    <div class="my-2">
      <input
        class="file:mt-2 file:border-0 file:border-orange-400 file:text-white file:bg-orange-400 file:rounded-md file:px-6 file:p-2 file:text-base"
        type="file"
        accept=".csv"
        @change="readFile"
      >
    </div>
  </form>
</template>

<style scoped>
</style>
