<script>
import Popper from 'vue3-popper'
import close from '@/icons/close.js'
import { CREATE_MESSAGE_REQUEST, DELETE_MESSAGE_REQUEST } from '@/store/actions/taskmessages'
import { CREATE_FILES_REQUEST, DELETE_FILE_REQUEST } from '@/store/actions/taskfiles'
import * as TASK from '@/store/actions/tasks'
import * as INSPECTOR from '@/store/actions/inspector'
import { copyText } from 'vue3-clipboard'

import linkify from 'vue-linkify'
import { maska } from 'maska'

import { shouldAddTaskIntoList } from '@/websync/utils'
import ModalBoxDelete from '@/components/Common/ModalBoxDelete.vue'
import TaskPropsButtonDots from '@/components/TaskProperties/TaskPropsButtonDots.vue'
import TaskPropsButtonFocus from '@/components/TaskProperties/TaskPropsButtonFocus.vue'
import TaskPropsChatMessages from '@/components/TaskProperties/TaskPropsChatMessages.vue'
import TaskPropsCommentEditor from '@/components/TaskProperties/TaskPropsCommentEditor.vue'
import TaskPropsButtonAccess from '@/components/TaskProperties/TaskPropsButtonAccess.vue'
import TaskPropsButtonSetDate from '@/components/TaskProperties/TaskPropsButtonSetDate.vue'
import TaskPropsButtonTags from '@/components/TaskProperties/TaskPropsButtonTags.vue'
import TaskPropsButtonPerform from '@/components/TaskProperties/TaskPropsButtonPerform.vue'
import TaskPropsButtonProject from '@/components/TaskProperties/TaskPropsButtonProject.vue'
import TaskPropsButtonColor from '@/components/TaskProperties/TaskPropsButtonColor.vue'
import TaskPropsChecklist from '@/components/TaskProperties/TaskPropsChecklist.vue'

import RepeatLimit from '@/components/properties/RepeatLimit'
import ChecklistLimit from '@/components/properties/ChecklistLimit'
import ChatLimit from '@/components/properties/ChatLimit'
import PerformerLimit from '@/components/TaskProperties/PerformerLimit'

export default {
  components: {
    TaskPropsButtonDots,
    TaskPropsButtonFocus,
    TaskPropsChatMessages,
    PerformerLimit,
    TaskPropsButtonAccess,
    ChecklistLimit,
    RepeatLimit,
    ChatLimit,
    TaskPropsButtonSetDate,
    TaskPropsButtonTags,
    TaskPropsButtonPerform,
    TaskPropsButtonProject,
    TaskPropsButtonColor,
    Popper,
    ModalBoxDelete,
    TaskPropsCommentEditor,
    TaskPropsChecklist
  },
  directives: {
    linkify,
    maska
  },
  data() {
    return {
      showAllMessages: false,
      showFreeModalCheck: false,
      showFreeModalRepeat: false,
      showFreeModalChat: false,
      showFreeModalPerform: false,
      taskMsg: '',
      lastSelectedTaskUid: '',
    }
  },
  computed: {
    taskMessages () {
      return this.$store.state.taskfilesandmessages.messages
    },
    uploadStarted () {
      return this.$store.state.taskfilesandmessages.uploadStarted
    },
    taskFiles () {
      return this.$store.state.taskfilesandmessages.files
    },
    myFiles () {
      return this.$store.state.taskfilesandmessages.files.myFiles
    },
    selectedTask () {
      return this.$store.state.tasks.selectedTask
    },
    isPropertiesMobileExpanded () {
      return this.$store.state.isPropertiesMobileExpanded
    },
    user () {
      return this.$store.state.user.user
    },
    navigator () {
      return this.$store.state.navigator.navigator
    },
    tasks () {
      return this.$store.state.tasks.newtasks
    },
    employeesByEmail () {
      return this.$store.state.employees.employeesByEmail
    },
    isDark () {
      return this.$store.state.darkMode
    },
    getfiles () {
      return this.$store.state.taskfilesandmessages.file
    },
    cusers () {
      return this.$store.state.user.user
    }
  },
  methods: {
    closeProperties () {
      this.$store.dispatch('asidePropertiesToggle', false)
    },
    pad2 (n) {
      return (n < 10 ? '0' : '') + n
    },
    uuidv4 () {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      )
    },
    changeEmployee = (email) => {
      if (email !== '') {
        const data = {
          uid: this.selectedTask.uid,
          value: email.toLowerCase()
        }
        this.$store.dispatch(TASK.CHANGE_TASK_PERFORMER, data).then(
          resp => {
            this.selectedTask.email_performer = resp.data.email_performer
            this.selectedTask.type = 2
          }
        )
      }
    },
    ispolnit () {
      const data = {
        uid: this.selectedTask.uid,
        value: this.cusers.current_user_email.toLowerCase()
      }
      this.$store.dispatch(TASK.CHANGE_TASK_PERFORMER, data).then(
        resp => {
          this.selectedTask.email_performer = resp.data.email_performer
          this.selectedTask.type = 3
        }
      )
    },
    resetEmployes () {
      this.$store.dispatch(TASK.CHANGE_TASK_PERFORMER, { uid: this.selectedTask.uid, value: '' }).then(
        resp => {
          this.selectedTask.email_performer = ''
          this.selectedTask.type = 1
        }
      )
    },
    ClickAccessEmail = () => {
      this.datas.push(this.checkEmail)
      if (this.checkEmail !== '') {
        const emails = this.checkEmail.join('..')
        this.$store.dispatch(TASK.CHANGE_TASK_ACCESS, { uid: this.selectedTask.uid, value: emails }).then(
          resp => {
            this.selectedTask.emails = emails
          }
        )
      }
    },
    resetAccess = () => {
      this.$store.dispatch(TASK.CHANGE_TASK_ACCESS, { uid: this.selectedTask.uid, value: '' }).then(
        resp => {
          this.selectedTask.emails = resp.data
          this.checkEmail = []
        }
      )
    },
    changeColors (uid, marker) {
      this.$store.dispatch(TASK.CHANGE_TASK_COLOR, { uid: uid, value: marker }).then(
        resp => {
          this.selectedTask.uid_marker = marker
        }
      )
    },
    changeFocus (uid, value) {
      this.$store.dispatch(TASK.CHANGE_TASK_FOCUS, { uid: uid, value: value }).then(
        resp => {
          this.selectedTask.focus = value
        })
    },
    ClickTagsChange () {
      const data = {
        uid: this.selectedTask.uid,
        tags: this.selectedTask.tags
      }
      this.$store.dispatch(TASK.CHANGE_TASK_TAGS, data)

      setTimeout(() => {
        this.$store.dispatch(TASK.CHANGE_TASK_TAGS, data)
      }, 100)
    },
    resetTags (key) {
      this.selectedTask.tags.splice(this.selectedTask.tags.indexOf(key), 1)
      const data = {
        uid: this.selectedTask.uid,
        tags: this.selectedTask.tags
      }
      this.$store.dispatch(TASK.CHANGE_TASK_TAGS, data)
    },
    createTaskFile (event) {
      this.files = event.target.files
      const formData = new FormData()
      for (let i = 0; i < this.files.length; i++) {
        const file = this.files[i]
        formData.append('files[' + i + ']', file)
      }
      const data = {
        uid_task: this.selectedTask.uid,
        name: formData
      }

      for (const formItem of formData) {
        store.commit(
          'createLoadingFile',
          {
            msg: formItem[1].name,
            uid_creator: this.user.current_user_uid,
            date_create: new Date().toISOString(),
            file_size: formItem[1].size
          }
        )
      }

      this.$store.dispatch(CREATE_FILES_REQUEST, data).then(
        resp => {
          if (this.selectedTask.type === 2 || this.selectedTask.type === 3) {
            if ([1, 5, 7, 8].includes(this.selectedTask.status)) {
              this.selectedTask.status = 9
            }
          }
          this.selectedTask.has_files = true
          if (this.selectedTask.uid_customer === this.user.current_user_uid && (this.selectedTask.status === 5 || this.selectedTask.status === 7)) {
            // to refine
            this.selectedTask.status = 9
          }
        })
      this.infoComplete = true
      setTimeout(() => {
        const element = document.getElementById('content').lastElementChild
        element.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    },
    delTask () {
      this.showConfirm = false
      if (this.isPropertiesMobileExpanded) {
        this.$store.dispatch('asidePropertiesToggle', false)
      }
      const data = {
        uid: this.selectedTask.uid
      }
      this.$store.dispatch(TASK.REMOVE_TASK, data.uid)
        .then(() => {
          this.$store.dispatch(TASK.DAYS_WITH_TASKS)
            .then(() => {
              // TODO: need to be refactored
              const calendarDates = computed(() => store.state.calendar[1].dates)
              const daysWithTasks = computed(() => store.state.tasks.daysWithTasks)
              for (let i = 0; i < calendarDates.value.length; i++) {
                const date = calendarDates.value[i].getDate() + '-' + (calendarDates.value[i].getMonth() + 1) + '-' + calendarDates.value[i].getFullYear()
                if (!daysWithTasks.value.includes(date)) {
                  store.state.calendar[1].dates.splice(store.state.calendar[1].dates.indexOf(calendarDates.value[i]), 1)
                }
              }
            })
        })
    },
    createTaskMsg () {
      const date = new Date()
      const month = pad2(date.getUTCMonth() + 1)
      const day = pad2(date.getUTCDate())
      const year = pad2(date.getUTCFullYear())
      const hours = pad2(date.getUTCHours())
      const minutes = pad2(date.getUTCMinutes())
      const seconds = pad2(date.getUTCSeconds())
      const dateCreate = year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds
      const data = {
        uid_task: this.selectedTask.uid,
        uid_creator: this.user.current_user_uid,
        uid_msg: this.uuidv4(),
        date_create: dateCreate,
        text: this.taskMsg.value,
        msg: this.taskMsg.value
      }
      this.$store.dispatch(CREATE_MESSAGE_REQUEST, data).then(
        resp => {
          this.selectedTask.has_msgs = true
          if (this.selectedTask.type === 2 || this.selectedTask.type === 3) {
            if ([1, 5, 7, 8].includes(this.selectedTask.status)) {
              this.selectedTask.status = 9
            }
          }
          this.selectedTask.msg = decodeURIComponent(this.taskMsg.value)
          this.infoComplete = true
          const wrapperElement = document.getElementById('content').lastElementChild
          wrapperElement.scrollIntoView({ behavior: 'smooth' })
        })
      this.taskMsg.value = ''
    },
    cursorPosition () {
      this.taskMsg += '\n'
      const textarea = document.querySelector('textarea')
      textarea.addEventListener('keyup', function () {
        if (this.scrollTop > 0) {
          //  this.style.height = this.scrollHeight + 'px'
        }
        if (this.value.length === 0) {
          this.style.height = '40px'
        }
      })
    },
    moveCursorToEnd (obj) {
      if (!(obj.updating)) {
        obj.updating = true
        const oldValue = obj.value
        obj.value = ''
        setTimeout(function () { obj.value = oldValue; obj.updating = false }, 100)
      }
      const textarea = document.querySelector('textarea')
      textarea.addEventListener('keyup', function () {
        if (this.scrollTop > 0) {
          this.style.height = this.scrollHeight + 'px'
        }
      })
    },
    deleteTaskMsg (uid) {
      this.$store.dispatch(DELETE_MESSAGE_REQUEST, { uid: uid }).then(
        resp => {
          this.selectedTask.has_msgs = true
          this.taskMessages.find(message => message.uid_msg) ? this.taskMessages.find(message => message.uid_msg === uid).deleted = 1 : this.taskMessages.find(message => message.uid === uid).deleted = 1
        })
    },
    deleteFiles (uid) {
      this.$store.dispatch(DELETE_FILE_REQUEST, { uid: uid })
    },
    changeName (event) {
      const data = {
        uid: this.selectedTask.uid,
        value: event.target.innerText
      }
      this.$store.dispatch(TASK.CHANGE_TASK_NAME, data)
    },
    resetProject () {
      this.$store.dispatch(TASK.CHANGE_TASK_PROJECT, { uid: this.selectedTask.uid, value: '00000000-0000-0000-0000-000000000000' }).then(
        resp => {
          this.selectedTask.uid_project = '00000000-0000-0000-0000-000000000000'
        }
      )
    },
    resetColor () {
      this.$store.dispatch(TASK.CHANGE_TASK_COLOR, { uid: this.selectedTask.uid, value: '00000000-0000-0000-0000-000000000000' }).then(
        resp => {
          this.selectedTask.uid_marker = '00000000-0000-0000-0000-000000000000'
        }
      )
    },
    resetCalendar () {
      const data = {
        uid_task: this.selectedTask.uid,
        str_date_begin: '0001-01-01T00:00:00',
        str_date_end: '0001-01-01T23:59:59',
        reset: 1
      }
      this.$store.dispatch(TASK.CHANGE_TASK_DATE, data).then(
        resp => {
          this.selectedTask.term_customer = resp.data.term
          this.selectedTask.is_overdue = resp.data.is_overdue
          this.range.start = new Date().getFullYear() + '-' + (pad2(new Date().getMonth() + 1)) + '-' + new Date().getDate() + 'T00:00:00'
          this.range.end = new Date().getFullYear() + '-' + (pad2(new Date().getMonth() + 1)) + '-' + new Date().getDate() + 'T00:00:00'
          this.timeEnd = ''
          this.timeStart = ''
          this.timeStartActive = false
        })
    },
    handleInput () {
      const timestart = this.timeStart === '' ? 'T00:00:00' : 'T' + this.timeStart
      const timeend = this.timeEnd === '' ? '' : 'T' + this.timeEnd + ':00'
      const starttime = new Date(this.range.start).getFullYear() + '-' + (pad2(new Date(this.range.start).getMonth() + 1)) + '-' + pad2(new Date(this.range.start).getDate()) + timestart
      const startend = new Date(this.range.end).getFullYear() + '-' + (pad2(new Date(this.range.start).getMonth() + 1)) + '-' + pad2(new Date(this.range.end).getDate()) + timeend
      const data = {
        uid_task: this.selectedTask.uid,
        str_date_begin: starttime,
        str_date_end: startend,
        reset: 0
      }
      this.$store.dispatch(TASK.CHANGE_TASK_DATE, data).then(
        resp => {
          this.selectedTask.term_customer = resp.data.term
          this.selectedTask.is_overdue = resp.data.is_overdue
          this.timeStart = timestart !== '' ? '' : timestart
          this.timeEnd = timeend !== '' ? '' : timeend
          this.timeStartActive = true
        })
    },
    TimeSelectStart () {
      this.timeEditStart = !this.timeEditStart
    },
    TimeSelectEnd () {
      this.timeEditEnd = !this.timeEditEnd
    },
    TimeActiveStart (event) {
      if (event.target.value.length > 1) {
        this.timeEndRange = true
      } else {
        this.timeEndRange = false
      }
    },
    calendarTimeStartChange (event) {
      const timeStartValue = event.target.value
      this.$refs.inputTimeStart.value = timeStartValue
    },
    calendarTimeEndChange = (event) => {
      const timeEndValue = event.target.value
      this.$refs.inputTimeEnd.value = timeEndValue
    },
    onDayClick () {
      this.timeStartActive = true
    },
    resetRepeat () {
      const data = {
        uid: this.selectedTask.uid
      }
      this.$store.dispatch(TASK.RESET_REPEAT_CHANGE, data).then(
        resp => {
          this.selectedTask.SeriesType = 0
          this.selectedTask.SeriesAfterType = 0
          this.selectedTask.SeriesAfterCount = 0
          this.selectedTask.SeriesWeekCount = 0
          this.selectedTask.SeriesWeekMon = 0
          this.selectedTask.SeriesWeekTue = 0
          this.selectedTask.SeriesWeekWed = 0
          this.selectedTask.SeriesWeekThu = 0
          this.selectedTask.SeriesWeekFri = 0
          this.selectedTask.SeriesWeekSat = 0
          this.selectedTask.SeriesWeekSun = 0
          this.selectedTask.SeriesMonthType = 0
          this.selectedTask.SeriesMonthCount = 0
          this.selectedTask.SeriesMonthDay = 0
          this.selectedTask.SeriesMonthWeekType = 0
          this.selectedTask.SeriesMonthDayOfWeek = 0
          this.selectedTask.SeriesYearType = 0
          this.selectedTask.SeriesYearMonth = 0
          this.selectedTask.SeriesYearMonthDay = 0
          this.selectedTask.SeriesYearWeekType = 0
          this.selectedTask.SeriesYearDayOfWeek = 0
          this.noRepeat = true
          this.everyDayRepeat = false
          this.everyWeekRepeat = false
          this.everyMonthRepeat = false
          this.everyYearRepeat = false
        })
    },
    copyurl (e) {
      copyText(`${window.location.origin}/task/${this.selectedTask.uid}`, undefined, (error, event) => {
        console.log(error, event)
      })
    },
    changeEveryMonthType (value) {
      this.ActiveSelect = value
      this.SeriesMonthDay = 0
    },
    changeEveryYearType (value) {
      this.ActiveYartype = value
      this.SeriesYearMonth = 0
      this.SeriesYearMonthDay = 0
    },
    addsubmit = () => {
      this.applybutton = true
    },
    setCursorPosition (oInput, oStart, oEnd) {
      if (oInput.setSelectionRange) {
        oInput.setSelectionRange(oStart, oEnd)
      } else if (oInput.createTextRange) {
        const range = oInput.createTextRange()
        range.collapse(true)
        range.moveEnd('character', oEnd)
        range.moveStart('character', oStart)
        range.select()
      }
    },
    editcomment () {
      if (!this.canEditComment) return
      this.isEditable = true
    },
    editcomment () {
      if (!this.canEditComment) return
      this.isEditable = true
    },
    removeeditcomment (event) {
      if (!this.canEditComment) return
      this.isEditable = false
      // чтобы у нас в интерфейсе поменялось
      // потому что на changeComment он только
      // на сервер отправляет и всё
      const message = event.target.innerText.trim()
      this.selectedTask.comment = message
    },
    changeComment (event) {
      if (!this.canEditComment) return
      const message = event.target.innerText.trim()
      setCursorPosition(event.target.id, 0, 100)
      const data = {
        uid: this.selectedTask.uid,
        value: message
      }
      this.$store.dispatch(TASK.CHANGE_TASK_COMMENT, data)
    },
    editTaskName () {
      this.isEditableTaskName = true
    },
    removeEditTaskName (event) {
      this.isEditableTaskName = false
      const taskName = event.target.innerText
      this.selectedTask.name = taskName
    },
    resetFocusCalendar () {
      this.range = {
        start: '',
        end: ''
      }
    },
    scrollDown () {
      this.showAllMessages = true
      this.infoComplete = true
      setTimeout(() => {
        const elmnt = document.getElementById('content').lastElementChild
        elmnt.scrollIntoView()
      }, 200)
    },
    createChecklist () {
      if (this.user.tarif === 'free') {
        this.showFreeModalCheck = true
        return
      }
      this.checklistshow = true
    },
    resetFocusChecklist () {
      this.checklistshow = false
    },
    SaveRepeat () {
      if (this.$refs.SeriesType.value === '0') {
        const data = {
          uid: this.selectedTask.uid
        }
        this.$store.dispatch(TASK.RESET_REPEAT_CHANGE, data).then(
          resp => {
            this.selectedTask.SeriesType = 0
            this.selectedTask.SeriesType = 0
            this.selectedTask.SeriesAfterType = 0
            this.selectedTask.SeriesAfterCount = 0
            this.selectedTask.SeriesWeekCount = 0
            this.selectedTask.SeriesWeekMon = 0
            this.selectedTask.SeriesWeekTue = 0
            this.selectedTask.SeriesWeekWed = 0
            this.selectedTask.SeriesWeekThu = 0
            this.selectedTask.SeriesWeekFri = 0
            this.selectedTask.SeriesWeekSat = 0
            this.selectedTask.SeriesWeekSun = 0
            this.selectedTask.SeriesMonthType = 0
            this.selectedTask.SeriesMonthCount = 0
            this.selectedTask.SeriesMonthDay = 0
            this.selectedTask.SeriesMonthWeekType = 0
            this.selectedTask.SeriesMonthDayOfWeek = 0
            this.selectedTask.SeriesYearType = 0
            this.selectedTask.SeriesYearMonth = 0
            this.selectedTask.SeriesYearMonthDay = 0
            this.selectedTask.SeriesYearWeekType = 0
            this.selectedTask.SeriesYearDayOfWeek = 0
          })
      }
      if (this.$refs.SeriesType.value === '1') {
        const data = {
          uid: this.selectedTask.uid,
          type: this.$refs.SeriesAfterType.value,
          every_value: this.$refs.SeriesAfterCount.value
        }
        this.$store.dispatch(TASK.EVERY_DAY_CHANGE, data).then(
          resp => {
            this.selectedTask.SeriesType = 1
            this.selectedTask.SeriesAfterType = resp.data.SeriesAfterType
            this.selectedTask.SeriesAfterCount = resp.data.SeriesAfterCount
          })
      }
      if (this.$refs.SeriesType.value === '2') {
        const data = {
          uid: this.selectedTask.uid,
          days: this.SeriesWeek,
          every_value: this.$refs.SeriesWeekCount.value
        }
        this.$store.dispatch(TASK.EVERY_WEEK_CHANGE, data).then(
          resp => {
            this.selectedTask.SeriesType = 2
            this.selectedTask.SeriesWeekFri = resp.data.SeriesWeekFri
            this.selectedTask.SeriesWeekMon = resp.data.SeriesWeekMon
            this.selectedTask.SeriesWeekSat = resp.data.SeriesWeekSat
            this.selectedTask.SeriesWeekSun = resp.data.SeriesWeekSun
            this.selectedTask.SeriesWeekThu = resp.data.SeriesWeekThu
            this.selectedTask.SeriesWeekTue = resp.data.SeriesWeekTue
            this.selectedTask.SeriesWeekWed = resp.data.SeriesWeekWed
            this.selectedTask.SeriesWeekCount = resp.data.SeriesWeekCount
          })
      }
      if (this.$refs.SeriesType.value === '3') {
        if (this.SeriesMonthDay > 0) {
          const data = {
            uid: this.selectedTask.uid,
            num_day: this.SeriesMonthDay,
            every_value: this.SeriesMonthCount
          }

          this.$store.dispatch(TASK.EVERY_MONTH_CHANGE, data).then(
            resp => {
              this.selectedTask.SeriesType = 3
              this.selectedTask.SeriesMonthCount = resp.data.SeriesMonthCount
              this.selectedTask.SeriesMonthDay = resp.data.SeriesMonthDay
              this.selectedTask.SeriesMonthDayOfWeek = resp.data.SeriesMonthDayOfWeek
              this.selectedTask.SeriesMonthType = resp.data.SeriesMonthType
              this.selectedTask.SeriesMonthDay = resp.data.SeriesMonthDay
              this.selectedTask.SeriesMonthWeekType = resp.data.SeriesMonthWeekType
            })
        }
        if (this.SeriesMonthDay === 0) {
          const data = {
            uid: this.selectedTask.uid,
            every_value: this.SeriesMonthCount,
            num_day: this.SeriesMonthDay,
            mwt: this.SeriesMonthType - 1,
            mdw: this.SeriesMonthDayOfWeek
          }
          this.$store.dispatch(TASK.EVERY_MONTH_CHANGE, data).then(
            resp => {
              this.selectedTask.SeriesType = 3
              this.selectedTask.SeriesMonthCount = resp.data.SeriesMonthCount
              this.selectedTask.SeriesMonthDay = resp.data.SeriesMonthDay
              this.selectedTask.SeriesMonthDayOfWeek = resp.data.SeriesMonthDayOfWeek
              this.selectedTask.SeriesMonthType = resp.data.SeriesMonthType
              this.selectedTask.SeriesMonthDay = resp.data.SeriesMonthDay
              this.selectedTask.SeriesMonthWeekType = resp.data.SeriesMonthWeekType
            })
        }
      }
      if (this.$refs.SeriesType.value === '4') {
        if (this.SeriesYearMonthDay > 0) {
          const data = {
            uid: this.selectedTask.uid,
            num_day: this.SeriesYearMonthDay,
            every_value: this.SeriesYearMonth
          }
          this.$store.dispatch(TASK.EVERY_YEAR_CHANGE, data).then(
            resp => {
              this.selectedTask.SeriesType = 4
              this.selectedTask.SeriesYearDayOfWeek = resp.data.SeriesYearDayOfWeek
              this.selectedTask.SeriesYearMonth = resp.data.SeriesYearMonth
              this.selectedTask.SeriesYearType = resp.data.SeriesYearType
              this.selectedTask.SeriesYearMonthDay = resp.data.SeriesYearMonthDay
              this.selectedTask.SeriesMonthWeekType = resp.data.SeriesYearWeekType
              this.selectedTask.SeriesMonthDayOfWeek = resp.data.SeriesYearDayOfWeek
            })
        }
        if (this.SeriesYearMonthDay === 0) {
          const data = {
            uid: this.selectedTask.uid,
            every_value: this.SeriesYearMonth,
            num_day: this.SeriesYearMonthDay,
            mwt: this.SeriesYearType - 1,
            mdw: this.SeriesYearDayOfWeek
          }
          thirs.$store.dispatch(TASK.EVERY_YEAR_CHANGE, data).then(
            resp => {
              this.selectedTask.SeriesType = 4
              this.selectedTask.SeriesYearDayOfWeek = resp.data.SeriesYearDayOfWeek
              this.selectedTask.SeriesYearMonth = resp.data.SeriesYearMonth
              this.selectedTask.SeriesYearMonthDay = resp.data.SeriesYearMonthDay
              this.selectedTask.SeriesYearWeekType = resp.data.SeriesYearWeekType
              this.selectedTask.SeriesMonthDayOfWeek = resp.data.SeriesYearDayOfWeek
            })
        }
      }
    }
}
</scritp>
