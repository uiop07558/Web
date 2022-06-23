<template>
  <div class="flex gap-[10px] items-center px-3">
    <div
      v-if="!showSearchBar"
      class="flex-none flex gap-[5px] p-[8px] cursor-pointer text-[#7e7e80] hover:text-[#7e7e80]/75"
      @click="onShowSearchBar"
    >
      <svg
        class="flex-none"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M11.2578 4.73848C9.52876 4.73848 7.87055 5.42533 6.64794 6.64794C5.42533 7.87055 4.73848 9.52876 4.73848 11.2578C4.73848 12.9868 5.42533 14.645 6.64794 15.8676C7.87055 17.0902 9.52876 17.7771 11.2578 17.7771C12.9868 17.7771 14.645 17.0902 15.8676 15.8676C17.0902 14.645 17.7771 12.9868 17.7771 11.2578C17.7771 9.52876 17.0902 7.87055 15.8676 6.64794C14.645 5.42533 12.9868 4.73848 11.2578 4.73848ZM5.41865 5.41865C6.96728 3.87001 9.06768 3 11.2578 3C13.4479 3 15.5483 3.87001 17.0969 5.41865C18.6456 6.96728 19.5156 9.06768 19.5156 11.2578C19.5156 13.1548 18.8628 14.9845 17.6818 16.4466L21 19.7707L19.7696 20.9989L16.4531 17.6765C14.9899 18.8609 13.1576 19.5156 11.2578 19.5156C9.06768 19.5156 6.96728 18.6456 5.41865 17.0969C3.87001 15.5483 3 13.4479 3 11.2578C3 9.06768 3.87001 6.96728 5.41865 5.41865Z"
          fill="currentColor"
        />
      </svg>
      <p class="font-roboto text-[14px]">
        Поиск
      </p>
    </div>
    <div
      v-if="showSearchBar"
      class="flex-none flex gap-[5px] items-center h-[40px] w-[160px] overflow-hidden px-[8px] text-[#7e7e80] bg-white rounded-[10px]"
    >
      <svg
        class="flex-none"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M11.2578 4.73848C9.52876 4.73848 7.87055 5.42533 6.64794 6.64794C5.42533 7.87055 4.73848 9.52876 4.73848 11.2578C4.73848 12.9868 5.42533 14.645 6.64794 15.8676C7.87055 17.0902 9.52876 17.7771 11.2578 17.7771C12.9868 17.7771 14.645 17.0902 15.8676 15.8676C17.0902 14.645 17.7771 12.9868 17.7771 11.2578C17.7771 9.52876 17.0902 7.87055 15.8676 6.64794C14.645 5.42533 12.9868 4.73848 11.2578 4.73848ZM5.41865 5.41865C6.96728 3.87001 9.06768 3 11.2578 3C13.4479 3 15.5483 3.87001 17.0969 5.41865C18.6456 6.96728 19.5156 9.06768 19.5156 11.2578C19.5156 13.1548 18.8628 14.9845 17.6818 16.4466L21 19.7707L19.7696 20.9989L16.4531 17.6765C14.9899 18.8609 13.1576 19.5156 11.2578 19.5156C9.06768 19.5156 6.96728 18.6456 5.41865 17.0969C3.87001 15.5483 3 13.4479 3 11.2578C3 9.06768 3.87001 6.96728 5.41865 5.41865Z"
          fill="currentColor"
        />
      </svg>
      <input
        ref="searchInput"
        v-model="searchText"
        maxlength="100"
        type="text"
        class="w-full font-roboto text-[14px] leading-[16px] border-0 focus:ring-0 p-0"
        @keyup.enter="sendSearchRequest"
        @blur="onBlurSearchInput"
      >
    </div>
    <NavBarButtonsBoard
      v-if="lastGreedPath === 'boards_children'"
      :board-uid="lastNavStackUid"
      @popNavBar="popNavBar"
    />
    <NavBarButtonsProject
      v-if="lastGreedPath === 'projects_children'"
      :project-uid="lastNavStackUid"
      :show-completed-tasks="showCompletedTasks"
      @popNavBar="popNavBar"
      @toggleCompletedTasks="onChangeCompletedTasks"
    />
    <NavBarButtonsColor
      v-if="isColorTaskList"
      :color-uid="lastNavStackTypeVal"
      :show-completed-tasks="showCompletedTasks"
      @popNavBar="popNavBar"
      @toggleCompletedTasks="onChangeCompletedTasks"
    />
    <NavBarButtonsTag
      v-if="isTagTaskList"
      :tag-uid="lastTag"
      :show-completed-tasks="showCompletedTasks"
      @popNavBar="popNavBar"
      @toggleCompletedTasks="onChangeCompletedTasks"
    />
    <NavBarButtonsTasks
      v-if="isTaskList"
      :show-completed-tasks="showCompletedTasks"
      @toggleCompletedTasks="onChangeCompletedTasks"
    />
  </div>
</template>

<script>
import { PATCH_SETTINGS } from '@/store/actions/navigator'
import { visitChildren } from '@/store/helpers/functions'
import * as TASK from '@/store/actions/tasks'
import { notify } from 'notiwind'
import * as CARD from '@/store/actions/cards'

import NavBarButtonsBoard from '@/components/Navbar/NavBarButtonsBoard.vue'
import NavBarButtonsProject from '@/components/Navbar/NavBarButtonsProject.vue'
import NavBarButtonsColor from '@/components/Navbar/NavBarButtonsColor.vue'
import NavBarButtonsTag from '@/components/Navbar/NavBarButtonsTag.vue'
import NavBarButtonsTasks from '@/components/Navbar/NavBarButtonsTasks.vue'

export default {
  components: {
    NavBarButtonsBoard,
    NavBarButtonsProject,
    NavBarButtonsColor,
    NavBarButtonsTag,
    NavBarButtonsTasks
  },
  emits: ['popNavBar'],
  data: () => ({
    showSearchBar: false,
    searchText: ''
  }),
  computed: {
    settings () {
      return this.$store.state.navigator.navigator.settings
    },
    navStack () {
      return this.$store.state.navbar.navStack
    },
    lastGreedPath () {
      return this.navStack[this.navStack.length - 1]?.greedPath ?? ''
    },
    lastNavStackUid () {
      return this.navStack[this.navStack.length - 1]?.uid ?? ''
    },
    lastNavStackKey () {
      return this.navStack[this.navStack.length - 1]?.key ?? ''
    },
    lastNavStackType () {
      return this.navStack[this.navStack.length - 1]?.type ?? ''
    },
    lastNavStackTypeVal () {
      return this.navStack[this.navStack.length - 1]?.typeVal ?? ''
    },
    lastTag () {
      return this.navStack[this.navStack.length - 1]?.uid
    },
    showCompletedTasks () {
      return this.settings?.show_completed_tasks ?? false
    },
    isTaskList () {
      if (this.isColorTaskList) return false
      if (this.isTagTaskList) return false
      return this.lastNavStackKey === 'taskListSource'
    },
    isColorTaskList () {
      return this.lastNavStackType === 'color'
    },
    isTagTaskList () {
      return this.navStack[this.navStack.length - 1].greedPath === 'tags_children'
    }
  },
  watch: {
    navStack: {
      immediate: true,
      handler: function (val) {
        this.searchText = ''
        this.showSearchBar = false
      }
    }
  },
  methods: {
    updateSettings () {
      this.$store.dispatch(
        PATCH_SETTINGS,
        {
          show_completed_tasks: this.settings.show_completed_tasks ? 1 : 0,
          add_task_to_begin: this.settings.add_task_to_begin ? 1 : 0,
          cal_number_of_first_week: this.settings.cal_number_of_first_week ? 1 : 0,
          cal_show_week_number: this.settings.cal_show_week_number ? 1 : 0,
          nav_show_tags: this.settings.nav_show_tags ? 1 : 0,
          nav_show_overdue: this.settings.nav_show_overdue ? 1 : 0,
          nav_show_summary: this.settings.nav_show_summary ? 1 : 0,
          nav_show_emps: this.settings.nav_show_emps ? 1 : 0,
          nav_show_markers: this.settings.nav_show_markers ? 1 : 0,
          language: this.settings.language,
          stopwatch: this.settings.stopwatch ? 1 : 0,
          cal_work_time: this.settings.cal_work_time,
          reminders_in_n_minutes: this.settings.reminders_in_n_minutes,
          cal_work_week: this.settings.cal_work_week,
          compact_mode: this.settings.compact_mode ? 1 : 0
        }
      ).then(() => {
        this.requestLastVisitedNav()
      })
    },
    requestLastVisitedNav () {
      const UID_TO_ACTION = {
        '2bad1413-a373-4926-8a3c-58677a680714': [
          TASK.TASKS_REQUEST,
          TASK.OVERDUE_TASKS_REQUEST,
          TASK.UNSORTED_TASKS_REQUEST
        ],
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
        '2e8dddd0-125a-49ef-a87c-0ea17b1b7f56': CARD.BOARD_CARDS_REQUEST, // private
        '1b30b42c-b77e-40a4-9b43-a19991809add': CARD.BOARD_CARDS_REQUEST // shared
      }

      if (this.$store.state.auth.token) {
        // Process saved last visited nav
        if (this.navStack.length && this.navStack.length > 0) {
          if (this.navStack[this.navStack.length - 1].key === 'taskListSource') {
            this.$store.dispatch(UID_TO_ACTION[this.navStack[this.navStack.length - 1].value.uid], this.navStack[this.navStack.length - 1].value.param)
            this.$store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
            this.$store.commit('basic', { key: this.navStack[this.navStack.length - 1].key, value: this.navStack[this.navStack.length - 1].value })
          }
        } else {
          this.$store.commit('basic', { key: 'taskListSource', value: { uid: '901841d9-0016-491d-ad66-8ee42d2b496b', param: null } })
          this.$store.commit(
            'updateStackWithInitValue',
            { name: 'Today', key: 'taskListSource', value: { uid: '901841d9-0016-491d-ad66-8ee42d2b496b', param: null } }
          )

          this.$store.dispatch(TASK.TASKS_REQUEST, new Date())
            .then(() => {
              this.$store.commit(TASK.CLEAN_UP_LOADED_TASKS)
            })
            .catch((err) => console.log(err))
        }
      }
      // After navigator is loaded we are trying to set up last visited navElement
      // Checking if last navElement is a gridSource
      if (this.navStack.length && this.navStack.length > 0) {
        if (this.navStack[this.navStack.length - 1].key === 'greedSource') {
          this.$store.commit('basic', { key: 'greedPath', value: this.navStack[this.navStack.length - 1].greedPath })
          this.$store.commit('basic', { key: 'mainSectionState', value: 'greed' })

          // If last navElement is related to processed navigator instance with 'new_' prefix
          // then we pass entire object from storeNavigator
          if (['new_private_projects', 'new_emps', 'new_delegate', 'new_private_boards'].includes(this.navStack[this.navStack.length - 1].greedPath)) {
            this.$store.commit('basic', { key: this.navStack[this.navStack.length - 1].key, value: this.$store.state.navigator.navigator[this.navStack[this.navStack.length - 1].greedPath] })

            // if last visited navElem is in nested in children, then we trying to find these children with visitChildren function
            // from storeNavigator
          } else if (['tags_children', 'projects_children', 'boards_children'].includes(this.navStack[this.navStack.length - 1].greedPath)) {
            if (this.navStack[this.navStack.length - 1].greedPath === 'tags_children') {
              // nested lookup for tags
              visitChildren(this.$store.state.navigator.navigator.tags.items, value => {
                if (value.uid === this.navStack[this.navStack.length - 1].uid) {
                  this.$store.commit('basic', { key: this.navStack[this.navStack.length - 1].key, value: value.children })
                }
              })
            }

            // nested lookup for shared and private projects
            if (this.navStack[this.navStack.length - 1].greedPath === 'projects_children') {
              // Requests project's tasks
              this.$store.dispatch(UID_TO_ACTION[this.navStack[this.navStack.length - 1].global_property_uid], this.navStack[this.navStack.length - 1].uid)
              this.$store.commit('basic', { key: 'taskListSource', value: { uid: this.navStack[this.navStack.length - 1].global_property_uid, param: this.navStack[this.navStack.length - 1].uid } })

              visitChildren(this.$store.state.navigator.navigator.new_private_projects[0].items, value => {
                if (value.uid === this.navStack[this.navStack.length - 1].uid) {
                  this.$store.commit('basic', { key: this.navStack[this.navStack.length - 1].key, value: value.children })
                }
              })
              visitChildren(this.$store.state.navigator.navigator.new_private_projects[1].items, value => {
                if (value.uid === this.navStack[this.navStack.length - 1].uid) {
                  this.$store.commit('basic', { key: this.navStack[this.navStack.length - 1].key, value: value.children })
                }
              })
            }

            // nested lookup for shared and private boards
            if (this.navStack[this.navStack.length - 1].greedPath === 'boards_children') {
              // Requests project's tasks
              this.$store.dispatch(UID_TO_ACTION[this.navStack[this.navStack.length - 1].global_property_uid], this.navStack[this.navStack.length - 1].uid)
              this.$store.commit('basic', { key: 'cardSource', value: { uid: this.navStack[this.navStack.length - 1].global_property_uid, param: this.navStack[this.navStack.length - 1].uid } })

              visitChildren(this.$store.state.navigator.navigator.new_private_boards[0].items, value => {
                if (value.uid === this.navStack[this.navStack.length - 1].uid) {
                  this.$store.commit('basic', { key: this.navStack[this.navStack.length - 1].key, value: value.children })
                }
              })
              visitChildren(this.$store.state.navigator.navigator.new_private_boards[1].items, value => {
                if (value.uid === this.navStack[this.navStack.length - 1].uid) {
                  this.$store.commit('basic', { key: this.navStack[this.navStack.length - 1].key, value: value.children })
                }
              })
            }
            // colors
          } else {
            this.$store.commit('basic', { key: this.navStack[this.navStack.length - 1].key, value: this.$store.state.navigator.navigator[this.navStack[this.navStack.length - 1].greedPath].items })
          }
        }
      }
    },
    popNavBar () {
      this.$emit('popNavBar')
    },
    sendSearchRequest () {
      if (this.searchText.length > 3) {
        const navElem = {
          name: 'Поиск: ' + this.searchText,
          key: 'taskListSource',
          value: { uid: '11212e94-cedf-11ec-9d64-0242ac120002', param: this.searchText }
        }
        this.$store.commit('updateStackWithInitValue', navElem)
        this.$store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
        this.$store.commit('basic', { key: 'taskListSource', value: navElem.value })
        this.$store.dispatch(TASK.SEARCH_TASK, this.searchText).then((resp) => {
          console.log('Search Taks', resp)
        })
      } else {
        notify(
          {
            group: 'api',
            title: 'Длина запроса должна быть более 3 символов',
            action: '',
            text: ''
          },
          15000
        )
      }
    },
    onBlurSearchInput () {
      if (this.searchText.length === 0) {
        this.showSearchBar = false
      }
    },
    onShowSearchBar () {
      this.showSearchBar = true
      this.$nextTick(function () {
        this.$refs.searchInput.focus({ preventScroll: false })
      })
    },
    onChangeCompletedTasks () {
      this.settings.show_completed_tasks = !this.showCompletedTasks
      this.updateSettings()
    }
  }
}
</script>

<style scoped>
</style>
