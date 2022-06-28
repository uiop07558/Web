<script setup>
import { useStore } from 'vuex'

import { LOCALIZATION_REQUEST } from '@/store/actions/localization'

const store = useStore()

store.dispatch(LOCALIZATION_REQUEST)

const fm = document.createElement('script')
const websync = document.createElement('script')
fm.setAttribute('src', process.env.VUE_APP_LEADERTASK_API + 'scripts/websync/fm.min.js')
websync.setAttribute('src', process.env.VUE_APP_LEADERTASK_API + 'scripts/websync/fm.websync.min.js')
document.head.appendChild(fm)
// загружаем через setTimeout чтобы скрипты подключались в правильном порядке
// сначала fm.min потом fm.websync.min
setTimeout(() => document.head.appendChild(websync), 0)

</script>

<template>
  <router-view />
</template>
