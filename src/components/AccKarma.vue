<script setup>
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'

import * as chartConfig from '@/components/Charts/chart.config.js'
import AccKarmaLimit from '@/components/AccKarmaLimit.vue'
import LineChart from '@/components/Charts/LineChart.vue'

const store = useStore()
const user = computed(() => store.state.user.user)
const employees = computed(() => store.state.employees.employees)
const karmaList = computed(() => store.state.inspector.karma)
const showFreeModal = ref(false)

const currentLocation = window.location.href
const successChartData = ref(null)
const overdueChartData = ref(null)

const karmaQuantity = computed(() => {
  let quantity = 0
  for (const karma of karmaList.value) quantity += karma.points
  return quantity
})

function dateToLabelFormat (calendarDate) {
  const day = calendarDate.getDate()
  const month = calendarDate.toLocaleString('default', { month: 'short' })
  const weekday = calendarDate.toLocaleString('default', { weekday: 'short' })
  return day + ' ' + month + ', ' + weekday
}

const successQuantity = computed(() => {
  let quantity = 0
  for (const karma of karmaList.value) {
    if (karma.points > 0) {
      quantity += 1
    }
  }
  return quantity
})

const overdueQuantity = computed(() => {
  let quantity = 0
  for (const karma of karmaList.value) {
    if (karma.points < 0) {
      quantity += 1
    }
  }
  return quantity
})

const sortedKarmaListByDate = computed(() => [...karmaList.value].sort((a, b) => new Date(b.creation_date) - new Date(a.creation_date)))

onMounted(() => {
  if (user.value.tarif === 'free') {
    showFreeModal.value = true
  }
  store.dispatch('KARMA_REQUEST', user.value.current_user_uid).then((resp) => {
    const success = []
    const overdue = []
    for (const karma of resp.data) {
      if (karma.points > 0) success.push(karma)
      else if (karma.points < 0) overdue.push(karma)
    }
    successChartData.value = chartConfig.karmaChartData(success, 'success')
    overdueChartData.value = chartConfig.karmaChartData(overdue, 'danger')
  })
})
</script>

<template>
  <AccKarmaLimit
    v-if="showFreeModal"
    @cancel="showFreeModal = false"
  />
  <div class="px-5">
    <p class="text-center">
      <span
        class="text-6xl tracking-tighter"
        :class="{'text-green-500': karmaQuantity, 'text-red-500': !karmaQuantity, 'text-gray-600': karmaQuantity === 0 }"
      >
        <span v-if="karmaQuantity > 0">+</span>
        {{ karmaQuantity }}
      </span>
    </p>
    <p class="text-center mt-2">
      <span class="text-sm text-gray-600">В срок:</span> <span class="text-xl mr-6 text-green-500"> {{ successQuantity }}</span>
      <span class="text-sm text-gray-600">Просроченныx:</span> <span class="text-xl text-red-500">{{ overdueQuantity }}</span>
    </p>
    <!-- <pre>{{ karmaList }}</pre> -->
    <br>
    <div class="grid grid-cols-1 gap-4">
      <div class="grid grid-cols-1 ">
        <p class="text-center text-2xl font-bold">
          Графики
        </p>
        <p class="text-left text-sm font-semibold">
          В срок
        </p>
        <line-chart
          :data="successChartData"
          class="max-h-[120px]"
        />
        <p class="text-left text-sm font-semibold mt-4">
          Просрочено
        </p>
        <line-chart
          :data="overdueChartData"
          class="max-h-[120px]"
        />
      </div>
      <div>
        <p class="text-center text-2xl mt-2 font-bold">
          История кармы
        </p>
        <div v-if="!sortedKarmaListByDate.length">
          <p class="text-center text-md text-gray-400 mt-10">
            У Вас еще нет истории :( <br> Завершите инспектируемые задачи
          </p>
        </div>
        <div class="flex flex-col mt-3">
          <div
            v-for="karma in sortedKarmaListByDate"
            :key="karma"
            class="mb-3"
          >
            <p class="text-xl text-gray-500 font-bold">
              {{ dateToLabelFormat(new Date(karma.creation_date)) }}
            </p>
            <div class="flex justify-between">
              <div class="flex items-center">
                <div class="flex items-center">
                  <img
                    v-if="employees[karma.taskJson.uid_customer]"
                    :src="employees[karma.taskJson.uid_customer].fotolink"
                    width="40"
                    height="40"
                    class="mr-2 rounded-full"
                  >
                  <p
                    v-if="employees[karma.taskJson.uid_customer]"
                    class="mr-3 text-sm text-gray-600"
                  >
                    {{ employees[karma.taskJson.uid_customer].name }}
                  </p>
                  <a
                    class="text"
                    :href="currentLocation + 'task/' + karma.taskJson.uid"
                  >
                    {{ karma.taskJson.name }}
                  </a>
                </div>
              </div>
              <p
                class="text-md"
                :class="{'text-green-500': karma.points > 0, 'text-red-500': karma.points < 0 }"
              >
                <span v-if="karma.points > 0">+</span>
                {{ karma.points }} очков
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
