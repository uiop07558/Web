<template>
  <div class="bg-white p-3 rounded mb-3">
    <input
      v-if="isCanEdit && isEditing"
      v-model="currName"
      type="text"
      placeholder="Наименование"
      class="mt-[10px] p-0 font-roboto font-bold font-[18px] leading-[21px] text-[#424242] w-full border-none focus:ring-0 focus:outline-none"
      @blur="changeReglamentName"
    >
    <div
      v-else
      class="mt-[10px] w-full font-roboto font-bold font-[18px] leading-[21px] text-[#424242] overflow-hidden text-ellipsis whitespace-nowrap"
    >
      {{ currName }}
    </div>
    <div class="flex font-['Roboto'] text-[#7E7E80] dark:bg-gray-700 dark:text-gray-100 rounded-lg text-[13px] font-medium">
      Автор:
      <div class="flex items-center">
        <img
          :src="employeesByEmail[selectedReglament.email_creator]?.fotolink"
          class="h-[20px] w-[20px] rounded mx-2"
        >
        <span class="text-[12px]">{{ employeesByEmail[selectedReglament.email_creator]?.name }}</span>
      </div>
    </div>
    <div
      v-if="contributors.length"
      class="mt-[30px] mb-[8px] font-roboto text-[16px] leading-[19px] font-medium text-[#4c4c4d]"
    >
      Сотрудники, прошедшие регламент:
    </div>
    <ReglamentPropsUser
      v-for="contributor in contributors"
      :key="contributor.uid_user"
      :user-uid="contributor.uid_user"
    />
  </div>
</template>

<script>
import ReglamentPropsUser from '@/components/Reglaments/ReglamentPropsUser'

import { UPDATE_REGLAMENT_REQUEST } from '@/store/actions/reglaments'

export default {
  components: {
    ReglamentPropsUser
  },
  props: {
    isEditing: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      currName: '',
      contributors: []
    }
  },
  computed: {
    employeesByEmail () {
      return this.$store.state.employees.employeesByEmail
    },
    user () {
      return this.$store.state.user.user
    },
    reglaments () {
      return this.$store.state.navigator.navigator.reglaments
    },
    selectedReglament () {
      for (let i = 0; i < this.reglaments.items.length; i++) {
        if (this.reglaments.items[i].uid === this.$store.state.navbar.navStack[this.$store.state.navbar.navStack.length - 1].uid) {
          return this.reglaments.items[i]
        }
      }
      return ''
    },
    selectedReglamentUid () {
      return this.selectedReglament?.uid || ''
    },
    selectedReglamentName () {
      return this.selectedReglament?.name || ''
    },
    selectedReglamentColor () {
      const backColor = this.selectedReglament?.color
      if (backColor && backColor !== '#A998B6') return backColor
      return ''
    },
    isCanDelete () {
      return this.selectedReglament?.email_creator === this.user.current_user_email
    },
    isCanEdit () {
      return this.isCanDelete
    }
  },
  watch: {
    selectedReglamentName: {
      immediate: true,
      handler: function (val) {
        this.$store.dispatch('GET_USERS_REGLAMENT_ANSWERS', this.selectedReglament.uid).then(resp => {
          this.contributors = resp.data
          const seen = []
          const cleared = []
          for (let i = 0; i < this.contributors.length; i++) {
            if (!(seen.includes(this.contributors[i].uid_user))) {
              seen.push(this.contributors[i].uid_user)
              cleared.push(this.contributors[i])
            }
          }
          this.contributors = cleared
        })
        this.currName = val
      }
    }
  },
  methods: {
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
    }
  }
}
</script>

<style scoped>
</style>
