<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { visitChildren, setLocalStorageItem } from '@/store/helpers/functions'
import AsideMenu from '@/components/AsideMenu.vue'
import NavBar from '@/components/NavBar.vue'
import PropertiesRight from '@/components/PropertiesRight.vue'
import ErrorNotification from '@/components/Notifications/ErrorNotification.vue'
import Notification from '@/components/Notifications/Notification.vue'
import InspectorNotification from '@/components/Notifications/InspectorNotification.vue'

import TasksListNew from '@/components/TasksListNew.vue'
import MainSection from '@/components/MainSection.vue'
import Projects from '@/components/Projects.vue'
import Boards from '@/components/Boards.vue'
import BoardWithChildren from '@/components/Board/BoardWithChildren.vue'
import ProjectWithChildren from '@/components/Projects/ProjectWithChildren.vue'
import Employees from '@/components/Employees.vue'
import Tags from '@/components/Tags/Tags.vue'
import Colors from '@/components/Colors.vue'
import Assignments from '@/components/Assignments.vue'
import ModalBoxNotificationInstruction from '@/components/modals/ModalBoxNotificationInstruction.vue'
import Dashboard from '@/components/Dashboard.vue'
import Other from '@/components/Other.vue'
import Doitnow from '@/components/Doitnow.vue'
import TagWithChildren from '@/components/Tags/TagWithChildren.vue'

import { NAVIGATOR_REQUEST } from '@/store/actions/navigator'
import { USER_REQUEST } from '@/store/actions/user'
import * as TASK from '@/store/actions/tasks'
import * as CARD from '@/store/actions/cards'
import initWebSync from '@/websync/index.js'
import initInspectorSocket from '@/inspector/index.js'

const store = useStore()
const router = useRouter()
const mainSectionState = computed(() => store.state.mainSectionState)
const greedPath = computed(() => store.state.greedPath)
const greedSource = computed(() => store.state.greedSource)

const isFileRedirect = computed(() => (router.currentRoute.value.name === 'taskfile' || router.currentRoute.value.name === 'cardfile') && router.currentRoute.value.params.id)
const menu = computed(() => store.state.navigator.menu)
const storeTasks = computed(() => store.state.tasks.newtasks)
const newConfig = computed(() => store.state.tasks.newConfig)
const navStack = computed(() => store.state.navbar.navStack)
const storeNavigator = computed(() => store.state.navigator.navigator)
const isPropertiesMobileExpanded = computed(() => store.state.isPropertiesMobileExpanded)
const shouldShowModalBox = ref(false)

const UID_TO_ACTION = {
  '901841d9-0016-491d-ad66-8ee42d2b496b': TASK.TASKS_REQUEST, // get today's day
  '46418722-a720-4c9e-b255-16db4e590c34': TASK.OVERDUE_TASKS_REQUEST,
  '017a3e8c-79ac-452c-abb7-6652deecbd1c': TASK.OPENED_TASKS_REQUEST,
  '5183b619-3968-4c3a-8d87-3190cfaab014': TASK.UNSORTED_TASKS_REQUEST,
  'fa042915-a3d2-469c-bd5a-708cf0339b89': TASK.UNREAD_TASKS_REQUEST,
  '2a5cae4b-e877-4339-8ca1-bd61426864ec': TASK.IN_WORK_TASKS_REQUEST,
  '6fc44cc6-9d45-4052-917e-25b1189ab141': TASK.IN_FOCUS_TASKS_REQUEST,
  '7af232ff-0e29-4c27-a33b-866b5fd6eade': TASK.PROJECT_TASKS_REQUEST, // private
  '431a3531-a77a-45c1-8035-f0bf75c32641': TASK.PROJECT_TASKS_REQUEST, // shared
  '00a5b3de-9474-404d-b3ba-83f488ac6d30': TASK.TAG_TASKS_REQUEST,
  'ed8039ae-f3de-4369-8f32-829d401056e9': TASK.COLOR_TASKS_REQUEST,
  'd28e3872-9a23-4158-aea0-246e2874da73': TASK.EMPLOYEE_TASKS_REQUEST,
  '169d728b-b88b-462d-bd8e-3ac76806605b': TASK.DELEGATED_TASKS_REQUEST,
  '511d871c-c5e9-43f0-8b4c-e8c447e1a823': TASK.DELEGATED_TO_USER_TASKS_REQUEST,
  'd35fe0bc-1747-4eb1-a1b2-3411e07a92a0': TASK.READY_FOR_COMPLITION_TASKS_REQUEST,
  '11212e94-cedf-11ec-9d64-0242ac120002': TASK.SEARCH_TASK,
  '47a38aa5-19c4-40d0-b8c0-56c3a420935d': TASK.ONE_TASK_REQUEST,
  '2e8dddd0-125a-49ef-a87c-0ea17b1b7f56': CARD.BOARD_CARDS_REQUEST, // private
  '1b30b42c-b77e-40a4-9b43-a19991809add': CARD.BOARD_CARDS_REQUEST // shared
}

const setShouldShowModalValue = (value) => {
  setLocalStorageItem('shouldShowModal', value)
  Notification.requestPermission().then(function (permission) {
    if (permission === 'granted') {
      setLocalStorageItem('shouldShowModal', '0')
    } else if (permission === 'denied') {
      setLocalStorageItem('shouldShowModal', '0')
    }
  })
}

const requestNotificationPermissionOrShowModalBox = () => {
  if (parseInt(localStorage.getItem('shouldShowModal')) === 0) {
    return
  }

  if (!('Notification' in window)) {
    alert('This browser does not support desktop notification')
    setLocalStorageItem('shouldShowModal', '0')
  } else if (Notification.permission === 'granted') {
    setLocalStorageItem('shouldShowModal', '0')
  } else if (Notification.permission === 'default') {
    setLocalStorageItem('shouldShowModal', '1')
  } else if (Notification.permission === 'denied') { // handle denied case
    setLocalStorageItem('shouldShowModal', '1')
  }

  if (parseInt(localStorage.getItem('shouldShowModal')) === 1) {
    shouldShowModalBox.value = true
  }
}

const getTask = (uid) => {
  if (store.state.auth.token) {
    store.dispatch(TASK.ONE_TASK_REQUEST, uid).then((resp) => {
      const navElem = {
        name: 'Поиск',
        key: 'taskListSource',
        value: { uid: '47a38aa5-19c4-40d0-b8c0-56c3a420935d', param: uid }
      }
      store.commit('updateStackWithInitValue', navElem)
      store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
      store.commit('basic', { key: 'taskListSource', value: navElem.value })

      store.commit('basic', { key: 'propertiesState', value: 'task' })

      if (resp.data.tasks.length > 0) {
        store.dispatch(TASK.SELECT_TASK, resp.data.tasks[0])
        if (!isPropertiesMobileExpanded.value) {
          store.dispatch('asidePropertiesToggle', true)
        }
      }
      window.history.replaceState(null, null, '/')
    })
  }
}

const getTasks = () => {
  if (store.state.auth.token) {
    // Process saved last visited nav
    if (navStack.value.length && navStack.value.length > 0) {
      if (navStack.value[navStack.value.length - 1].key === 'taskListSource') {
        store.dispatch(UID_TO_ACTION[navStack.value[navStack.value.length - 1].value.uid], navStack.value[navStack.value.length - 1].value.param)
        store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
        store.commit('basic', { key: navStack.value[navStack.value.length - 1].key, value: navStack.value[navStack.value.length - 1].value })
      }
    } else {
      store.commit('basic', { key: 'taskListSource', value: { uid: '901841d9-0016-491d-ad66-8ee42d2b496b', param: null } })
      store.commit(
        'updateStackWithInitValue',
        { name: 'Сегодня', key: 'taskListSource', value: { uid: '901841d9-0016-491d-ad66-8ee42d2b496b', param: null } }
      )

      store.dispatch(TASK.TASKS_REQUEST, new Date())
        .then(() => {
          store.commit(TASK.CLEAN_UP_LOADED_TASKS)
        })
        .catch((err) => console.log(err))
    }
  }
}

const initNavStackWithFoundProjects = (projectUid) => {
  let project
  visitChildren(storeNavigator.value.new_private_projects[0].items, value => {
    if (value.uid === projectUid) {
      project = value
    }
  })
  visitChildren(storeNavigator.value.new_private_projects[1].items, value => {
    if (value.uid === projectUid) {
      project = value
    }
  })

  const navElem = {
    name: project.name,
    key: 'greedSource',
    uid: project.uid,
    global_property_uid: project.global_property_uid,
    greedPath: 'projects_children',
    value: project.children
  }
  store.commit('pushIntoNavStack', navElem)
}

const initNavStackWithFoundBoards = (boardUid) => {
  let board
  visitChildren(storeNavigator.value.new_private_boards[0].items, value => {
    if (value.uid === boardUid) {
      board = value
    }
  })
  visitChildren(storeNavigator.value.new_private_boards[1].items, value => {
    if (value.uid === boardUid) {
      board = value
    }
  })

  const navElem = {
    name: board.name,
    key: 'greedSource',
    uid: board.uid,
    global_property_uid: board.global_property_uid,
    greedPath: 'boards_children',
    value: board.children
  }
  store.commit('pushIntoNavStack', navElem)
}

const getProject = (uid) => {
  const navElem = {
    name: 'Проекты',
    key: 'greedSource',
    greedPath: 'new_private_projects',
    value: storeNavigator.value.new_private_projects
  }
  store.commit('updateStackWithInitValue', navElem)
  initNavStackWithFoundProjects(uid)
  window.history.replaceState(null, null, '/')
}

const getBoard = (uid) => {
  const navElem = {
    name: 'Доски',
    key: 'greedSource',
    greedPath: 'new_private_boards',
    value: storeNavigator.value.new_private_boards
  }
  store.commit('updateStackWithInitValue', navElem)
  initNavStackWithFoundBoards(uid)
  window.history.replaceState(null, null, '/')
}

const getNavigator = () => {
  if (store.state.auth.token) {
    store.dispatch(NAVIGATOR_REQUEST)
      .then(() => {
        initWebSync()
        initInspectorSocket()
        if (router.currentRoute.value.name === 'project' && router.currentRoute.value.params.id) {
          getProject(router.currentRoute.value.params.id)
        }
        if (router.currentRoute.value.name === 'board' && router.currentRoute.value.params.id) {
          getBoard(router.currentRoute.value.params.id)
        }
        // After navigator is loaded we are trying to set up last visited navElement
        // Checking if last navElement is a gridSource
        if (navStack.value.length && navStack.value.length > 0) {
          if (navStack.value[navStack.value.length - 1].key === 'greedSource') {
            const navStackUid = navStack.value[navStack.value.length - 1]?.value?.uid
            if (navStackUid === '2bad1413-a373-4926-8a3c-58677a680714') {
              store.commit('basic', { key: 'mainSectionState', value: 'greed' })
              store.commit('basic', { key: 'greedPath', value: 'dashboard' })
            } else if (navStackUid === '2cf6b167-6506-4b05-bc34-70a8d88e3b25') {
              store.commit('basic', { key: 'mainSectionState', value: 'greed' })
              store.commit('basic', { key: 'greedPath', value: 'doitnow' })
            } else if (navStackUid === 'ed8039ae-f3de-4369-8f32-829d401056e9') {
              store.commit('basic', { key: 'mainSectionState', value: 'greed' })
              store.commit('basic', { key: 'greedPath', value: 'colors' })
            } else if (navStackUid === '00a5b3de-9474-404d-b3ba-83f488ac6d30') {
              store.commit('basic', { key: 'mainSectionState', value: 'greed' })
              store.commit('basic', { key: 'greedPath', value: 'tags' })
            } else if (navStackUid === '757be87d-c269-40e0-b224-6b2bb0e4f97d') {
              store.commit('basic', { key: 'mainSectionState', value: 'greed' })
              store.commit('basic', { key: 'greedPath', value: 'other' })
            } else {
              store.commit('basic', { key: 'greedPath', value: navStack.value[navStack.value.length - 1].greedPath })
              store.commit('basic', { key: 'mainSectionState', value: 'greed' })
            }
            // If last navElement is related to processed navigator instance with 'new_' prefix
            // then we pass entire object from storeNavigator
            if (['new_private_projects', 'new_emps', 'new_delegate', 'new_private_boards'].includes(navStack.value[navStack.value.length - 1].greedPath)) {
              store.commit('basic', { key: navStack.value[navStack.value.length - 1].key, value: storeNavigator.value[navStack.value[navStack.value.length - 1].greedPath] })

            // if last visited navElemen is in nested in children, then we trying to find these children with visitChildren fucntion
            // from storeNavigator
            } else if (['tags_children', 'projects_children', 'boards_children'].includes(navStack.value[navStack.value.length - 1].greedPath)) {
              if (navStack.value[navStack.value.length - 1].greedPath === 'tags_children') {
                // nested lookup for tags
                store.dispatch(UID_TO_ACTION[navStack.value[navStack.value.length - 1].global_property_uid], navStack.value[navStack.value.length - 1].uid)
                  .then(() => {
                    store.commit('basic', {
                      key: 'taskListSource',
                      value: { uid: navStack.value[navStack.value.length - 1].global_property_uid, param: navStack.value[navStack.value.length - 1].uid }
                    })
                  })
                visitChildren(storeNavigator.value.tags.items, value => {
                  if (value.uid === navStack.value[navStack.value.length - 1].uid) {
                    store.commit('basic', { key: navStack.value[navStack.value.length - 1].key, value: value.children })
                  }
                })
              }

              // nested lookup for shared and private projects
              if (navStack.value[navStack.value.length - 1].greedPath === 'projects_children') {
                // Requests project's tasks
                store.dispatch(UID_TO_ACTION[navStack.value[navStack.value.length - 1].global_property_uid], navStack.value[navStack.value.length - 1].uid)
                store.commit('basic', { key: 'taskListSource', value: { uid: navStack.value[navStack.value.length - 1].global_property_uid, param: navStack.value[navStack.value.length - 1].uid } })

                visitChildren(storeNavigator.value.new_private_projects[0].items, value => {
                  if (value.uid === navStack.value[navStack.value.length - 1].uid) {
                    store.commit('basic', { key: navStack.value[navStack.value.length - 1].key, value: value.children })
                  }
                })
                visitChildren(storeNavigator.value.new_private_projects[1].items, value => {
                  if (value.uid === navStack.value[navStack.value.length - 1].uid) {
                    store.commit('basic', { key: navStack.value[navStack.value.length - 1].key, value: value.children })
                  }
                })
              }

              if (navStack.value[navStack.value.length - 1].greedPath === 'boards_children') {
                // Requests boards's cards
                store.dispatch(UID_TO_ACTION[navStack.value[navStack.value.length - 1].global_property_uid], navStack.value[navStack.value.length - 1].uid)
                store.commit('basic', { key: 'taskListSource', value: { uid: navStack.value[navStack.value.length - 1].global_property_uid, param: navStack.value[navStack.value.length - 1].uid } })

                visitChildren(storeNavigator.value.new_private_boards[0].items, value => {
                  if (value.uid === navStack.value[navStack.value.length - 1].uid) {
                    store.commit('basic', { key: navStack.value[navStack.value.length - 1].key, value: value.children })
                  }
                })
                visitChildren(storeNavigator.value.new_private_boards[1].items, value => {
                  if (value.uid === navStack.value[navStack.value.length - 1].uid) {
                    store.commit('basic', { key: navStack.value[navStack.value.length - 1].key, value: value.children })
                  }
                })
              }
            // colors
            } else {
              store.commit('basic', { key: navStack.value[navStack.value.length - 1].key, value: storeNavigator.value[navStack.value[navStack.value.length - 1].greedPath].items })
            }
          }
        }
      })
  }
}

requestNotificationPermissionOrShowModalBox()

const fm = document.createElement('script')
const websync = document.createElement('script')
fm.setAttribute('src', process.env.VUE_APP_LEADERTASK_API + 'scripts/websync/fm.min.js')
websync.setAttribute('src', process.env.VUE_APP_LEADERTASK_API + 'scripts/websync/fm.websync.min.js')
document.head.appendChild(fm)
document.head.appendChild(websync)

store.dispatch(USER_REQUEST).then(resp => {
  store.dispatch('GET_SOUND_SETTING', resp.data.current_user_uid)
})

getNavigator()

if (router.currentRoute.value.name === 'task' && router.currentRoute.value.params.id) {
  getTask(router.currentRoute.value.params.id)
} else {
  getTasks()
}
</script>

<template>
  <modal-box-notification-instruction
    v-model="shouldShowModalBox"
    button="warning"
    has-button
    has-cancel
    button-label="Хорошо, я понял"
    @confirm="setShouldShowModalValue('0')"
  >
    <p>
      Мы используем системные уведомления для отображения важных событий в приложении, которые нельзя увидеть при свернутом браузере или в другой вкладке.
    </p>
    <p>
      Чтобы всегда быть в курсе актуального положения дел, пожалуйста, разрешите отображение уведомлений в настройках браузера.
    </p>
    <p>
      Инстрyкции как включить уведомления для разных браузеров:
    </p>
    <a
      href="https://support.google.com/chrome/answer/3220216?hl=ru&co=GENIE.Platform%3DAndroid"
      target="_blank"
      class="text-blue-400"
    >Google Chrome</a>
    <br>
    <a
      href="https://support.apple.com/ru-ru/guide/safari/sfri40734/mac"
      target="_blank"
      class="text-blue-400"
    >Safari</a>
    <br>
    <a
      href="https://sendpulse.com/ru/knowledge-base/push-notifications/enable-disable-push-notifications-mozilla-firefox"
      target="_blank"
      class="text-blue-400"
    >Firefox</a>
  </modal-box-notification-instruction>
  <main-section>
    <aside-menu
      v-if="!isFileRedirect"
      :menu="menu"
    />
    <nav-bar v-if="!isFileRedirect" />
    <properties-right v-if="!isFileRedirect" />
    <ErrorNotification v-if="!isFileRedirect" />
    <Notification v-if="!isFileRedirect" />
    <InspectorNotification v-if="!isFileRedirect" />
    <TasksListNew
      v-if="mainSectionState === 'tasks'"
      :store-tasks="storeTasks"
      :new-config="newConfig"
    />
    <!-- Greed section -->
    <div v-if="mainSectionState === 'greed'">
      <projects
        v-if="greedPath === 'new_private_projects'"
        :items="greedSource"
      />
      <boards
        v-if="greedPath === 'new_private_boards'"
        :boards="greedSource"
      />
      <doitnow
        v-if="greedPath === 'doitnow'"
      />
      <dashboard
        v-if="greedPath === 'dashboard'"
      />
      <other
        v-if="greedPath === 'other'"
      />
      <tags
        v-if="greedPath === 'tags'"
        :tags="greedSource"
      />
      <TagWithChildren
        v-if="greedPath === 'tags_children'"
        :tags="greedSource"
      />
      <ProjectWithChildren
        v-if="greedPath === 'projects_children'"
        :projects="greedSource"
      />
      <BoardWithChildren
        v-if="greedPath === 'boards_children'"
        :boards="greedSource"
      />
      <employees
        v-if="greedPath === 'new_emps'"
        :employees="greedSource"
      />
      <colors
        v-if="greedPath === 'colors'"
        :colors="greedSource"
      />
      <assignments
        v-if="greedPath === 'new_delegate'"
        :assignments="greedSource"
      />
    </div>
  </main-section>
</template>
