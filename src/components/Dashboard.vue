<script setup>
import Icon from '@/components/Icon.vue'
// import focus from '@/icons/focus.js'
import * as TASK from '@/store/actions/tasks.js'
import * as USER from '@/store/actions/user.js'
import unread from '@/icons/dashboardicons/unread.js'
import project from '@/icons/projectDesktop.js'
// import gear from '@/icons/dashboardicons/gear.js'
import today from '@/icons/calendar.js'
import open from '@/icons/clock.js'
import focus from '@/icons/dashboardicons/focus.js'
import inwork from '@/icons/dashboardicons/inwork.js'
import overdue from '@/icons/dashboardicons/overdue.js'
import unsorted from '@/icons/dashboardicons/unsorted.js'
import ready from '@/icons/dashboardicons/ready.js'
import Taskhead from '@/components/DashboardComponents/Taskhead.vue'
import TaskStatus from '@/components/TasksList/TaskStatus'
import performerRead from '@/icons/performer-read.js'
import performerNotRead from '@/icons/performer-not-read.js'
import { computed, reactive, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { UID_TO_ACTION } from '@/store/helpers/functions'

const store = useStore()

const testObj = reactive({
  today: '',
  unread: '',
  inWork: '',
  inFocus: '',
  overdue: '',
  unsorted: '',
  ready: '',
  open: ''
})

const user = {
  userData: ''
}

onBeforeMount(() => {
  store.dispatch(TASK.TASKS_REQUEST, new Date()).then(() => {
    testObj.today = reactive(store.state.tasks.today.tasks)
  })
  store.dispatch(TASK.UNREAD_TASKS_REQUEST).then(() => {
    testObj.unread = reactive(store.state.tasks.unread.tasks)
  })
  store.dispatch(TASK.IN_WORK_TASKS_REQUEST).then(() => {
    testObj.inWork = reactive(store.state.tasks.inWork.tasks)
  })
  store.dispatch(TASK.IN_FOCUS_TASKS_REQUEST).then(() => {
    testObj.inFocus = reactive(store.state.tasks.inFocus.tasks)
  })
  store.dispatch(TASK.OVERDUE_TASKS_REQUEST).then(() => {
    testObj.overdue = reactive(store.state.tasks.overdue.tasks)
  })
  store.dispatch(TASK.UNSORTED_TASKS_REQUEST).then(() => {
    testObj.unsorted = reactive(store.state.tasks.unsorted.tasks)
  })
  store.dispatch(TASK.READY_FOR_COMPLITION_TASKS_REQUEST).then(() => {
    testObj.ready = reactive(store.state.tasks.ready.tasks)
  })
  store.dispatch(TASK.OPENED_TASKS_REQUEST).then(() => {
    testObj.open = reactive(store.state.tasks.open.tasks)
  })
  store.dispatch(USER.USER_REQUEST).then(() => {
    user.userData = reactive(store.state.user.user)
  })
})

const tags = reactive(computed(() => {
  return store.state.tasks.tags
}))

const employees = reactive(computed(() => {
  return store.state.employees.employees
}))

const projects = reactive(computed(() => {
  return store.state.projects.projects
}))

const colors = reactive(computed(() => {
  return store.state.colors.colors
}))

const icons = {
  today,
  unread,
  inwork,
  unsorted,
  overdue,
  focus,
  ready,
  open
}

const iconsKeys = Object.keys(icons)

function visualTaskStatus (task) {
  store.state.tasks.newtasks[task.uid] = task
  store.state.tasks.newtasks[task.uid].info = task
  store.state.tasks.newtasks[task.uid].status = task.status
}

function redirect (title, uid) {
  const action = UID_TO_ACTION[uid]
  if (!action) {
    console.error('UID_TO_ACTION in undefined', uid)
    return
  }
  store.commit(TASK.CLEAN_UP_LOADED_TASKS)
  store.dispatch(action)
  const navElem = {
    name: title,
    key: 'taskListSource',
    value: { uid: uid, param: null }
  }
  store.commit('updateStackWithInitValue', navElem)
  store.commit('basic', { key: 'taskListSource', value: { uid: uid, param: null } })
  store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
}
</script>
<template>
  <div class="md:grid md:grid-rows-2 md:grid-flow-col md:max-h-[85vh] sm:flex sm:max-w-screen-sm sm:flex-wrap">
    <div
      v-for="(elem, key, idx) in testObj"
      :id="key"
      :key="elem"
      class="flex flex-col bg-white dark:bg-slate-900 rounded-xl cursor-default min-h-[400px] max-h-[400px] min-w-[380px] mb-4 max-w-screen-sm scroll-style mr-3 px-2 pt-2 shadow-sm font-SfProTextNormal"
    >
      <taskhead>
        <template #block-name>
          <span
            class="hover:cursor-pointer"
            @click="redirect(store.state.tasks[key].title, store.state.tasks[key].link)"
          >
            {{ store.state.tasks[key].title }}
            {{ '(' + testObj[key].length + ')' }}
          </span>
        </template>
        <template #icon>
          <icon
            :path="icons[iconsKeys[idx]].path"
            :height="icons[iconsKeys[idx]].height"
            :width="icons[iconsKeys[idx]].width"
            :viewBox="icons[iconsKeys[idx]].viewBox"
            class="text-gray-500"
          />
        </template>
      </taskhead>
      <div class="scroll-style">
        <div
          v-for="(task, taskIdx) in testObj[key]"
          :key="task.uid"
          class="p-2 rounded-xl"
          :style="task.uid_marker !== '00000000-0000-0000-0000-000000000000' ? {backgroundColor: colors[task.uid_marker].back_color, color: colors[task.uid_marker].fore_color ? colors[task.uid_marker].fore_color : '#000000' } : ''"
        >
          <div class="flex">
            <div class="flex order-first">
              <TaskStatus
                :task="task"
                @click="visualTaskStatus(task)"
              />
            </div>
            <div class="font-normal">
              <span
                class="max-w-full break-words text-sm"
              >
                {{ !task ? '' : task.name }}
              </span>
            </div>
          </div>
          <div class="flex flex-wrap items-center text-xs text-white">
            <!-- customer -->
            <div>
              <img
                class="w-[22px] h-[22px] border-solid border-2 rounded-md"
                :class="task.uid_performer === user.userData.current_user_uid ? 'border-red-500' : 'border-gray-400' "
                :src="employees[task.uid_customer] === undefined ? '' : employees[task.uid_customer].fotolink"
              >
            </div>
            <div
              class="tag-label cursor-default p-1 text-xs flex items-center rounded-lg ml-[4px]"
              :class="task.uid_performer === user.userData.current_user_uid ? 'bg-red-500' : 'bg-gray-400'"
            >
              {{ task.customer_name }}
            </div>
            <div
              v-if="(employees[task.uid_customer] !== undefined) && employees[task.uid_customer] !== employees[task.uid_performer]"
              class="tag-label cursor-default p-1 text-xs flex items-center rounded-lg ml-[4px]"
              :class="task.uid_customer === user.userData.current_user_uid ? 'bg-lime-500' : 'bg-gray-400'"
            >
              <icon
                :path="task.performerreaded ? performerRead.path : performerNotRead.path"
                :width="task.performerreaded ? performerRead.width : performerNotRead.width"
                :height="task.performerreaded ? performerRead.height : performerNotRead.height"
                :viewbox="task.performerreaded ? performerRead.height : performerNotRead.height"
                class="mr-[4px]"
              />
              {{ !employees[task.uid_performer] ? '' : employees[task.uid_performer].name }}
            </div>
            <!-- tags -->
            <div
              v-for="j in testObj[key][taskIdx].tags.length"
              :key="j"
              class="tag-label cursor-default p-1 px-2 text-xs rounded-lg mr-1 flex items-center text-white bg-gray-400 order-first"
              :style="{ backgroundColor: tags[testObj[key][taskIdx].tags[j - 1]].back_color }"
            >
              {{ !tags[testObj[key][taskIdx].tags[j - 1]] ? '' : tags[testObj[key][taskIdx].tags[j - 1]].name }}
            </div>
            <div
              v-if="task.uid_project !== '00000000-0000-0000-0000-000000000000'"
              class="p-1 order-last flex align-items justify-around"
            >
              <icon
                :path="project.path"
                :height="project.height"
                :width="project.width"
                :viewBox="project.viewBox"
              />
              <span class="ml-1">{{ !projects[task.uid_project] ? '' : projects[task.uid_project].name }}</span>
            </div>
          </div>
        </div>
        <div
          v-if="!testObj[key].length"
          class="m-2 p-2"
        >
          <div class="font-normal">
            У вас пока нет задач этой категории!
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
