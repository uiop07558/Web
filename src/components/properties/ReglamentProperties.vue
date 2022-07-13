<template>
  <div>
    <TaskPropsAccessLimitModalBox
      v-if="showAccessLimit"
      @cancel="showAccessLimit = false"
      @ok="showAccessLimit = false"
    />
    <ModalBoxDelete
      v-if="showConfirm"
      title="Удалить проект"
      :text="`Вы действительно хотите удалить проект ${selectedProjectName}?`"
      @cancel="showConfirm = false"
      @yes="removeProject"
    />
    <ModalBoxDelete
      v-if="showConfirmQuit"
      title="Покинуть проект"
      :text="`Вы действительно хотите покинуть проект ${selectedProjectName}? Обратно можно попасть, только если владелец проекта опять вас добавит.`"
      @cancel="showConfirmQuit = false"
      @yes="quitProject"
    />
    <div class="flex justify-between items-center">
      <PopMenu>
        <PropsButtonMenu />
        <template #menu>
          <PopMenuItem @click="copyLinkToProject">
            Копировать ссылку на регламент
          </PopMenuItem>
          <PopMenuItem
            v-if="isCanDelete"
            icon="delete"
            @click="showConfirm = true"
          >
            Удалить
          </PopMenuItem>
          <PopMenuItem
            v-else
            icon="delete"
            @click="showConfirmQuit = true"
          >
            Покинуть регламент
          </PopMenuItem>
        </template>
      </PopMenu>
      <PropsButtonClose @click="closeProperties" />
    </div>
    <input
      v-if="isCanEdit"
      v-model="currName"
      type="text"
      placeholder="Наименование"
      class="mt-[25px] p-0 font-roboto font-bold font-[18px] leading-[21px] text-[#424242] w-full border-none focus:ring-0 focus:outline-none"
      @blur="changeProjectName"
    >
    <div
      v-else
      class="mt-[25px] w-full font-roboto font-bold font-[18px] leading-[21px] text-[#424242] overflow-hidden text-ellipsis whitespace-nowrap"
    >
      {{ currName }}
    </div>
    <div
      class="mt-[30px] font-roboto text-[16px] leading-[19px] font-medium text-[#4c4c4d]"
    >
      Цвет
    </div>
    <div class="w-full mt-[15px] gap-[4px] flex flex-col">
      <div
        v-for="(clrs, index) in defaultColors"
        :key="index"
        class="flex gap-[4px]"
      >
        <PropsColorBoxItem
          v-for="clr in clrs"
          :key="clr.color"
          :class="{ 'cursor-pointer': isCanEdit }"
          :color="clr.color"
          :selected="clr.selected"
          @select="changeProjectColor"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ModalBoxDelete from '@/components/Common/ModalBoxDelete.vue'
import PropsColorBoxItem from '@/components/Common/PropsColorBoxItem.vue'
import PopMenu from '@/components/modals/PopMenu.vue'
import PopMenuItem from '@/components/modals/PopMenuItem.vue'
import PropsButtonClose from '@/components/Common/PropsButtonClose.vue'
import PropsButtonMenu from '@/components/Common/PropsButtonMenu.vue'
import TaskPropsAccessLimitModalBox from '@/components/properties/TaskPropsAccessLimitModalBox.vue'

import * as PROJECT from '@/store/actions/projects'
import { NAVIGATOR_REMOVE_PROJECT } from '@/store/actions/navigator'
import { copyText } from 'vue3-clipboard'

export default {
  components: {
    ModalBoxDelete,
    TaskPropsAccessLimitModalBox,
    PropsColorBoxItem,
    PopMenu,
    PopMenuItem,
    PropsButtonClose,
    PropsButtonMenu
  },
  data () {
    return {
      showConfirm: false,
      showAccessLimit: false,
      showConfirmQuit: false,
      currName: ''
    }
  },
  computed: {
    defaultColors () {
      const allColors = [
        '',
        '#7fc870',
        '#69c494',
        '#dff2e1',
        '#ffaf40',
        '#ffd7a0',
        '#5ba4cf',
        '#9eedff',
        '#b381b3',
        '#e5e5e5',
        '#ddd1c2',
        '#ef7665',
        '#ffc6b5',
        '#ff8ed4',
        '#f5dbf5',
        '#6a7077',
        '#f6dd29',
        '#f5f547'
      ]
      // добавляем в конец выбранный цвет если его тут нет
      const usedColor = this.selectedProjectColor.toLowerCase()
      if (!allColors.includes(usedColor)) {
        allColors.splice(allColors.length - 1, 1, usedColor)
      }
      const colors = allColors.map((color) => ({
        color: color,
        selected: color === usedColor
      }))
      // разбираем на ряды по 9
      const rowLength = 9
      const arrColors = []
      while (colors.length) arrColors.push(colors.splice(0, rowLength))
      return arrColors
    },
    employeesByEmail () {
      return this.$store.state.employees.employeesByEmail
    },
    selectedProject () {
      return this.$store.state.projects.selectedProject
    },
    selectedProjectUid () {
      return this.selectedProject?.uid || ''
    },
    selectedProjectName () {
      return this.selectedProject?.name || ''
    },
    selectedProjectCreatorEmail () {
      return this.selectedProject?.email_creator || ''
    },
    selectedProjectColor () {
      const backColor = this.selectedProject?.color
      if (backColor && backColor !== '#A998B6') return backColor
      return ''
    },
    isCanDelete () {
      const user = this.$store.state.user.user
      return this.selectedProjectCreatorEmail === user.current_user_email
    },
    isCanEdit () {
      return this.isCanDelete
    },
    usersBoard () {
      const users = []
      const members = this.selectedProject?.members || []
      for (const userEmail of members) {
        const emp = this.employeesByEmail[userEmail.toLowerCase()]
        if (emp && emp?.email !== this.selectedProjectCreatorEmail) {
          users.push({
            uid: emp?.uid,
            email: emp?.email
          })
        }
      }
      return users
    },
    selectedProjectMembers () {
      return this.selectedProject?.members.reduce((acc, userEmail) => {
        acc[userEmail.toLowerCase()] = userEmail
        return acc
      }, {}) || {}
    },
    usersCanAddToAccess () {
      const users = []
      const employees = Object.values(this.$store.state.employees.employees)
      for (const emp of employees) {
        if (this.selectedProjectMembers[emp.email.toLowerCase()] === undefined) {
          users.push({
            uid: emp.uid,
            email: emp.email
          })
        }
      }
      return users
    }
  },
  watch: {
    selectedProjectName: {
      immediate: true,
      handler: function (val) {
        this.currName = val
      }
    }
  },
  methods: {
    print (msg, param) {
      console.log(msg, param)
    },
    removeProject () {
      this.showConfirm = false

      this.$store
        .dispatch(PROJECT.REMOVE_PROJECT_REQUEST, this.selectedProjectUid)
        .then((resp) => {
          console.log('removeProject', resp)
          this.$store.dispatch('asidePropertiesToggle', false)
          this.$store.commit(NAVIGATOR_REMOVE_PROJECT, this.selectedProject)
          // выходим выше на один уровень навигации (надеемся что этот проект последний в стеке)
          this.$store.dispatch('popNavStack')
        })
    },
    quitProject () {
      this.showConfirmQuit = false

      this.$store.dispatch(PROJECT.QUIT_PROJECT_REQUEST, {
        uid: this.selectedProjectUid,
        value: this.$store.state.user.user.current_user_email
      })
        .then((resp) => {
          console.log('quitProject', resp)
          this.$store.dispatch('asidePropertiesToggle', false)
          this.$store.commit(NAVIGATOR_REMOVE_PROJECT, this.selectedProject)
          // выходим выше на один уровень навигации (надеемся что этот проект последний в стеке)
          this.$store.dispatch('popNavStack')
        })
    },
    closeProperties () {
      this.$store.dispatch('asidePropertiesToggle', false)
    },
    changeProjectName () {
      const title = this.currName.trim()
      if (this.isCanEdit && title && this.selectedProjectName !== title) {
        this.selectedProject.name = title
        this.$store
          .dispatch(PROJECT.CHANGE_PROJECT_NAME, {
            projectUid: this.selectedProjectUid,
            newProjectTitle: title
          })
          .then((resp) => {
            console.log('changeProjectName', resp, title)
          })
      }
    },
    changeProjectColor (color) {
      if (this.isCanEdit && this.selectedProjectColor.toLowerCase() !== color) {
        this.selectedProject.color = color || '#A998B6'
        const data = {
          projectUid: this.selectedProjectUid,
          newProjectColor: color || '#A998B6'
        }
        this.$store.dispatch(PROJECT.CHANGE_PROJECT_COLOR, data).then((resp) => {
          console.log('changeProjectColor', resp, color)
        })
      }
    },
    addProjectMember (userEmail) {
      const user = this.$store.state.user.user
      // если лицензия истекла
      if (user.days_left <= 0) {
        this.showAccessLimit = true
        return
      }
      if (
        this.isCanEdit &&
        this.selectedProjectMembers[userEmail.toLowerCase()] === undefined
      ) {
        const users = [...this.selectedProject.members]
        users.push(userEmail)
        this.selectedProject.members = users
        const data = {
          projectUid: this.selectedProjectUid,
          newProjectMembers: users
        }
        this.$store.dispatch(PROJECT.CHANGE_PROJECT_MEMBERS, data).then((resp) => {
          console.log('changeProjectMembers', resp, users)
        })
      }
    },
    deleteMember (userEmail) {
      if (
        this.isCanEdit &&
        this.selectedProjectMembers[userEmail.toLowerCase()] !== undefined
      ) {
        const users = this.selectedProject.members.filter((email) => email.toLowerCase() !== userEmail.toLowerCase())
        this.selectedProject.members = users
        const data = {
          projectUid: this.selectedProjectUid,
          newProjectMembers: users
        }
        this.$store.dispatch(PROJECT.CHANGE_PROJECT_MEMBERS, data).then((resp) => {
          console.log('changeProjectMembers', resp, users)
        })
      }
    },
    copyLinkToProject () {
      copyText(
        `${window.location.origin}/project/${this.selectedProjectUid}`,
        undefined,
        (error, event) => {
          if (error) {
            console.log('copyLinkToProject error', error)
          } else {
            console.log('copyLinkToProject', event)
          }
        }
      )
    }
  }
}
</script>

<style scoped>
</style>
