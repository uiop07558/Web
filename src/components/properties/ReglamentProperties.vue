<template>
  <div>
    <TaskPropsAccessLimitModalBox
      v-if="showAccessLimit"
      @cancel="showAccessLimit = false"
      @ok="showAccessLimit = false"
    />
    <ModalBoxDelete
      v-if="showConfirm"
      title="Удалить регламент"
      :text="`Вы действительно хотите удалить регламент ${selectedReglamentName}?`"
      @cancel="showConfirm = false"
      @yes="removeProject"
    />
    <ModalBoxDelete
      v-if="showConfirmQuit"
      title="Покинуть регламент"
      :text="`Вы действительно хотите покинуть регламент ${selectedReglamentName}? Обратно можно попасть, только если владелец регламента опять вас добавит.`"
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
      @blur="changeReglamentName"
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
          @select="changeReglamentColor"
        />
      </div>
    </div>
    <div
      class="mt-[30px] mb-[8px] font-roboto text-[16px] leading-[19px] font-medium text-[#4c4c4d]"
    >
      Доступ
    </div>
    <div
      v-for="contributor in contributors"
      :key="contributor"
      class="group w-full h-[34px] flex items-center"
    >
      <img
        :src="employeesByEmail[contributor.email]?.fotolink"
        class="flex-none border border-[#7e7e80] rounded-[4px] w-[20px] h-[20px] mr-[7px]"
      >
      <span class="grow font-roboto text-[13px] leading-[20px] font-medium text-[#4c4c4d] mr-[7px]">{{ employeesByEmail[contributor.email].name }}</span>
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
import { NAVIGATOR_REMOVE_PROJECT, NAVIGATOR_REMOVE_REGLAMENT } from '@/store/actions/navigator'
import { DELETE_REGLAMENT_REQUEST, UPDATE_REGLAMENT_REQUEST } from '@/store/actions/reglaments'
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
      currName: '',
      contributors: [
        {
          email: 'buharin.m@leadertask.com',
          question1: '142',
          question2: '456'
        },
        {
          email: 'gashilov.d@leadertask.ru',
          question1: '444',
          question2: '666'
        }
      ]
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
      const usedColor = this.selectedReglamentColor.toLowerCase()
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
    selectedReglament () {
      return this.$store.state.greedSource
    },
    selectedReglamentUid () {
      return this.selectedReglament?.uid || ''
    },
    selectedReglamentName () {
      return this.selectedReglament?.name || ''
    },
    selectedProjectCreatorEmail () {
      return this.selectedProject?.email_creator || ''
    },
    selectedReglamentColor () {
      const backColor = this.selectedReglament?.color
      if (backColor && backColor !== '#A998B6') return backColor
      return ''
    },
    isCanDelete () {
      const user = this.$store.state.user.user
      return this.selectedReglament?.email_creator === user.current_user_email
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
    selectedReglamentName: {
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

      this.$store.dispatch(DELETE_REGLAMENT_REQUEST, this.selectedReglament.uid).then(() => {
        this.$store.dispatch('asidePropertiesToggle', false)
        this.$store.commit(NAVIGATOR_REMOVE_REGLAMENT, this.selectedReglament)
        // выходим выше на один уровень навигации (надеемся что этот проект последний в стеке)
        this.$store.dispatch('popNavStack')
      })
    },
    quitProject () {
      this.showConfirmQuit = false

      console.log(this.selectedProject)
      this.$store.dispatch('asidePropertiesToggle', false)
      this.$store.commit(NAVIGATOR_REMOVE_PROJECT, this.selectedProject)
      // выходим выше на один уровень навигации (надеемся что этот проект последний в стеке)
      this.$store.dispatch('popNavStack')
    },
    closeProperties () {
      this.$store.dispatch('asidePropertiesToggle', false)
    },
    changeReglamentName () {
      const title = this.currName.trim()
      if (this.isCanEdit && title && this.selectedReglamentName !== title) {
        this.selectedReglament.name = title
        this.$store.dispatch(UPDATE_REGLAMENT_REQUEST, this.selectedReglament).then(() => {
          this.$store.state.greedSource.name = this.selectedReglament.name
        })
      }
    },
    changeReglamentColor (color) {
      if (this.isCanEdit && this.selectedReglamentColor.toLowerCase() !== color) {
        this.selectedReglament.color = color ?? '#A998B6'
        this.$store.dispatch(UPDATE_REGLAMENT_REQUEST, this.selectedReglament).then(() => {
          this.$store.state.greedSource.color = color ?? '#A998B6'
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
          projectUid: this.selectedReglamentUid,
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
          projectUid: this.selectedReglamentUid,
          newProjectMembers: users
        }
        this.$store.dispatch(PROJECT.CHANGE_PROJECT_MEMBERS, data).then((resp) => {
          console.log('changeProjectMembers', resp, users)
        })
      }
    },
    copyLinkToProject () {
      copyText(
        `${window.location.origin}/project/${this.selectedReglamentUid}`,
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
