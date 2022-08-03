<template>
  <div class="bg-white p-3 rounded mb-3">
    <div
      class="mt-[10px] w-full font-roboto font-bold font-[18px] leading-[21px] text-[#424242] overflow-hidden text-ellipsis whitespace-nowrap"
    >
      {{ title }}
    </div>
    <div class="flex font-['Roboto'] text-[#7E7E80] dark:bg-gray-700 dark:text-gray-100 rounded-lg text-[13px] font-medium">
      Отдел:
      <div class="flex items-center">
        <div class="h-[20px] w-0 ml-2" />
        <span class="text-[12px]">
          {{ departmentTitle }}
        </span>
      </div>
    </div>
    <div class="flex font-['Roboto'] text-[#7E7E80] dark:bg-gray-700 dark:text-gray-100 rounded-lg text-[13px] font-medium">
      Автор:
      <div class="flex items-center">
        <img
          v-if="creatorFoto"
          :src="creatorFoto"
          class="h-[20px] w-[20px] rounded mx-2"
        >
        <span class="text-[12px]">
          {{ creatorName }}
        </span>
      </div>
    </div>
    <div
      v-if="editors.length"
      class="flex font-['Roboto'] text-[#7E7E80] dark:bg-gray-700 dark:text-gray-100 rounded-lg text-[13px] font-medium"
    >
      Редакторы:
      <div
        v-for="editor in editors"
        :key="editor"
        class="flex items-center"
      >
        <img
          v-if="editorFoto(editor)"
          :src="editorFoto(editor)"
          class="h-[20px] w-[20px] rounded mx-2"
        >
        <span class="text-[12px]">
          {{ editorName(editor) }}
        </span>
      </div>
    </div>
    <button
      v-if="contributors.length && !showEmployees"
      class="flex font-['Roboto'] text-[#6a6a6b] mt-1 mb-1 dark:bg-gray-700 dark:text-gray-100 rounded-lg text-[13px] font-medium hover:text-black transition"
      @click="showEmployees = true"
    >
      Показать сотрудников, прошедших регламент
    </button>
    <div v-if="showEmployees">
      <button
        class="flex font-['Roboto'] text-[#6a6a6b] mt-1 mb-1 dark:bg-gray-700 dark:text-gray-100 rounded-lg text-[13px] font-medium hover:text-black transition"
        @click="showEmployees = false"
      >
        Cкрыть сотрудников, прошедших регламент
      </button>
      <ReglamentPropsUser
        v-for="contributor in contributors"
        :key="contributor.uid_user"
        :user-uid="contributor.uid_user"
      />
    </div>
  </div>
</template>

<script>
import ReglamentPropsUser from '@/components/Reglaments/ReglamentPropsUser'

export default {
  components: {
    ReglamentPropsUser
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    creator: {
      type: String,
      default: ''
    },
    editors: {
      type: Array,
      default: () => ([])
    },
    contributors: {
      type: Array,
      default: () => ([])
    },
    department: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      showEmployees: false
    }
  },
  computed: {
    creatorName () {
      return this.$store.state.employees.employeesByEmail[this.creator]?.name || this.creator
    },
    creatorFoto () {
      return this.$store.state.employees.employeesByEmail[this.creator]?.fotolink
    },
    departmentTitle () {
      const dep = this.$store.state.departments.deps[this.department]
      return dep?.name || 'Общий для всех отделов'
    }
  },
  methods: {
    editorName (email) {
      return this.$store.state.employees.employeesByEmail[email]?.name
    },
    editorFoto (email) {
      return this.$store.state.employees.employeesByEmail[email]?.fotolink
    }
  }
}
</script>

<style scoped>
</style>
