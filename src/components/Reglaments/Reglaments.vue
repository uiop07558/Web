<template>
  <div class="w-full">
    <BoardModalBoxRename
      v-if="showAddReglament"
      :show="showAddReglament"
      title="Создать регламент"
      @cancel="showAddReglament = false"
      @save="onAddNewReglament"
    />
    <ProjectModalBoxProjectsLimit
      v-if="showProjectsLimit"
      @cancel="showProjectsLimit = false"
      @ok="showProjectsLimit = false"
    />
    <div>
      <div class="flex justify-between w-full">
        <p class="font-['Roboto'] text-[#424242] text-[19px] leading-[22px] font-bold">
          Регламенты
        </p>
        <div class="flex">
          <icon
            :path="listView.path"
            :width="listView.width"
            :height="listView.height"
            :box="listView.viewBox"
            class="cursor-pointer hover:text-gray-800 mr-2"
            :class="{
              'text-gray-800': !isGridView,
              'text-gray-400': isGridView
            }"
            @click="updateGridView(false)"
          />
          <icon
            :path="gridView.path"
            :width="gridView.width"
            :height="gridView.height"
            :box="gridView.viewBox"
            class="cursor-pointer hover:text-gray-800 mr-2"
            :class="{
              'text-gray-800': isGridView,
              'text-gray-400': !isGridView
            }"
            @click="updateGridView(true)"
          />
        </div>
      </div>
      <div
        class="grid gap-2 mt-3"
        :class="{
          'md:grid-cols-2 lg:grid-cols-4': isGridView,
          'grid-cols-1': !isGridView,
          'grid-cols-1': isPropertiesMobileExpanded && !isGridView,
          'lg:grid-cols-2': isPropertiesMobileExpanded && isGridView
        }"
      >
        <template
          v-for="project in items"
          :key="project.uid"
        >
          <ReglamentBlocItem
            :project="project"
            @click.stop="gotoReglamentContent(project)"
          />
        </template>
        <ListBlocAdd
          @click.stop="clickAddProject"
        />
      </div>
    </div>
  </div>
  <EmptyTasksListPics v-if="isEmpty" />
</template>

<script>
import Icon from '@/components/Icon.vue'
import BoardModalBoxRename from '@/components/Board/BoardModalBoxRename.vue'
import ProjectModalBoxProjectsLimit from '@/components/ProjectModalBoxProjectsLimit.vue'
import { setLocalStorageItem } from '@/store/helpers/functions'
import ReglamentBlocItem from '@/components/Projects/ProjectBlocItem.vue'
import ListBlocAdd from '@/components/Common/ListBlocAdd.vue'
import EmptyTasksListPics from '@/components/TasksList/EmptyTasksListPics'

import * as TASK from '@/store/actions/tasks'
import * as PROJECT from '@/store/actions/projects'
import * as NAVIGATOR from '@/store/actions/navigator'

import gridView from '@/icons/grid-view.js'
import listView from '@/icons/list-view.js'
export default {
  components: {
    Icon,
    BoardModalBoxRename,
    ReglamentBlocItem,
    ListBlocAdd,
    ProjectModalBoxProjectsLimit,
    EmptyTasksListPics
  },
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      showProjectsLimit: false,
      showAddReglament: false,
      gridView,
      listView
    }
  },
  computed: {
    isGridView () {
      setLocalStorageItem('isGridView', true)
      return this.$store.state.isGridView
    },
    isPropertiesMobileExpanded () {
      return this.$store.state.isPropertiesMobileExpanded
    },
    isEmpty () {
      return !this.items.length
    }
  },
  created () {
    setLocalStorageItem('isGridView', true)
  },
  methods: {
    updateGridView (value) {
      this.$store.commit('basic', { key: 'isGridView', value: value })
      setLocalStorageItem('isGridView', value)
    },
    gotoReglamentContent (project) {
      // this.$store.dispatch(TASK.PROJECT_TASKS_REQUEST, project.uid)
      this.$store.commit('basic', {
        key: 'reglamentSource',
        value: { uid: '92413f6c-2ef3-476e-9429-e76d7818685d', param: project.uid }
      })

      this.$store.commit(TASK.CLEAN_UP_LOADED_TASKS)

      const navElem = {
        name: project.name,
        key: 'greedSource',
        uid: project.uid,
        global_property_uid: '92413f6c-2ef3-476e-9429-e76d7818685d',
        greedPath: 'reglament_content',
        value: []
      }

      this.$store.commit('pushIntoNavStack', navElem)
      this.$store.commit('basic', { key: 'greedSource', value: project })
      this.$store.commit('basic', { key: 'greedPath', value: 'reglament_content' })
    },
    uuidv4 () {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
          c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
      )
    },
    clickAddProject () {
      const user = this.$store.state.user.user
      // если лицензия истекла
      if (Object.keys(this.$store.state.projects.projects).length >= 10 && user.days_left <= 0) {
        this.showProjectsLimit = true
        return
      }
      this.showAddReglament = true
    },
    onAddNewReglament (name) {
      this.showAddReglament = false
      const title = name.trim()
      if (title) {
        // добавляем новый проект и переходим в него
        const maxOrder =
          this.items[0]?.items?.reduce(
            (maxOrder, child) =>
              child.order > maxOrder ? child.order : maxOrder,
            0
          ) || 0
        const user = this.$store.state.user.user
        const project = {
          uid: this.uuidv4(),
          name: title,
          uid_parent: '00000000-0000-0000-0000-000000000000',
          email_creator: user.current_user_email,
          order: maxOrder + 1,
          comment: '',
          plugin: '',
          collapsed: 0,
          isclosed: 0,
          group: 0,
          show: 1,
          favorite: 0,
          quiet: 0,
          members: [user.current_user_email],
          children: [],
          bold: 0
        }
        this.$store.dispatch(PROJECT.CREATE_PROJECT_REQUEST, project).then((res) => {
          // заполняем недостающие параметры
          project.global_property_uid = '431a3531-a77a-45c1-8035-f0bf75c32641'
          project.order = res.data.order
          project.color = '#A998B6'

          this.$store.commit(PROJECT.PUSH_PROJECT, [project])
          this.$store.commit(NAVIGATOR.NAVIGATOR_PUSH_PROJECT, [project])
          // hardcode push in navigator
          this.$store.state.greedSource.push(project)
          this.gotoReglamentContent(project)
        })
      }
    }
  }
}
</script>

<style scoped></style>
