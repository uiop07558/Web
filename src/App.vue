<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Overlay from '@/components/modals/Overlay.vue'

import { LOCALIZATION_REQUEST } from '@/store/actions/localization'

const store = useStore()
const router = useRouter()
const isFileRedirect = computed(() => (router.currentRoute.value.name === 'taskfile' || router.currentRoute.value.name === 'cardfile') && router.currentRoute.value.params.id)

store.dispatch(LOCALIZATION_REQUEST)

const isAsideLgActive = computed(() => store.state.isAsideLgActive)

const fm = document.createElement('script')
const websync = document.createElement('script')
fm.setAttribute('src', process.env.VUE_APP_LEADERTASK_API + 'scripts/websync/fm.min.js')
websync.setAttribute('src', process.env.VUE_APP_LEADERTASK_API + 'scripts/websync/fm.websync.min.js')
document.head.appendChild(fm)
// загружаем через setTimeout чтобы скрипты подключались в правильном порядке
// сначала fm.min потом fm.websync.min
setTimeout(() => document.head.appendChild(websync), 0)

const overlayClick = () => {
  store.dispatch('asideLgToggle', false)
}

</script>

<template>
  <router-view />
  <overlay
    v-if="!isFileRedirect"
    v-show="isAsideLgActive"
    z-index="30"
    @overlay-click="overlayClick"
  />
</template>
