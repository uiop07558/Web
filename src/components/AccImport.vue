<script>
import { CREATE_TASK } from '@/store/actions/tasks'
import { CREATE_PROJECT_REQUEST } from '@/store/actions/projects'

export default {
  data () {
    return {
      fileString: '',
      projects: {}
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
    parseFile () {
      const rows = this.fileString.split('\n')
      for (let i = 1; i < (rows.length - 1); i++) {
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

        if (modifiedRow[15] !== '') {
          if (!this.projects[modifiedRow[15]]) {
            this.addProject(modifiedRow[15])
          }
          task.uid_project = this.projects[modifiedRow[15]]
          console.log(this.projects)
        }

        console.log(task)
        this.$store.dispatch(CREATE_TASK, task)
      }
    },
    addProject (name) {
      const project = {
        uid_parent: '00000000-0000-0000-0000-000000000000',
        color: '#A998B6',
        comment: '',
        plugin: '',
        collapsed: 0,
        isclosed: 0,
        order: 0,
        group: 0,
        show: 1,
        favorite: 0,
        quiet: 0,
        email_creator: this.user.current_user_email,
        members: [
          ''
        ],
        uid: this.uuidv4(),
        name: name,
        bold: 0
      }
      this.$store.dispatch(CREATE_PROJECT_REQUEST, project)
      this.projects[name] = project.uid
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
