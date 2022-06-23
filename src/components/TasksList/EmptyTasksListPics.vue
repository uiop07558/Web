<script setup>
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import Icon from '@/components/Icon.vue'
import ready from '@/icons/ready.js'
import * as TASK from '@/store/actions/tasks.js'

const store = useStore()
const navStack = computed(() => store.state.navbar.navStack)
const shouldShowEmptyPics = computed(() => {
  const lastNavStackElement = navStack.value[navStack.value.length - 1]
  if (lastNavStackElement.value.uid === DATE_UID && new Date(lastNavStackElement.value.param).toDateString() === new Date().toDateString()) {
    return true
  } else { return false }
})
const DATE_UID = '901841d9-0016-491d-ad66-8ee42d2b496b'
// const TAG_UID = '00a5b3de-9474-404d-b3ba-83f488ac6d30'
const COLOR_UID = 'ed8039ae-f3de-4369-8f32-829d401056e9'
// const PRIVATE_PROJECT_UID = '7af232ff-0e29-4c27-a33b-866b5fd6eade'
const currentImageIndex = ref(Math.floor(Math.random() * 3))
const dateToLabelFormat = function (calendarDate) {
  const day = calendarDate.getDate()
  const month = calendarDate.toLocaleString('default', { month: 'short' })
  const weekday = calendarDate.toLocaleString('default', {
    weekday: 'short'
  })
  return day + ' ' + month + ', ' + weekday
}
const goToNextDay = function () {
  const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1))

  store.dispatch('asidePropertiesToggle', false)
  store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
  store.dispatch(TASK.TASKS_REQUEST, tomorrow)
  // hardcoded and messy
  const navElem = {
    name: dateToLabelFormat(tomorrow),
    key: 'taskListSource',
    value: { uid: '901841d9-0016-491d-ad66-8ee42d2b496b', param: tomorrow },
    typeVal: tomorrow,
    type: 'date'
  }
  store.commit('updateStackWithInitValue', navElem)
  store.commit('basic', {
    key: 'taskListSource',
    value: { uid: '901841d9-0016-491d-ad66-8ee42d2b496b', param: tomorrow }
  })
  store.commit(TASK.CLEAN_UP_LOADED_TASKS)
}
</script>

<template>
  <!-- DATE -->
  <div v-if="shouldShowEmptyPics">
    <div
      class="max-w-xl mx-auto"
    >
      <img
        v-show="currentImageIndex === 0"
        class="mx-auto mt-10"
        width="300"
        height="300"
        src="@/assets/images/emptytask.png"
        alt="Empty task image"
      >
      <img
        v-show="currentImageIndex === 1"
        class="mx-auto mt-10"
        width="300"
        height="300"
        src="@/assets/images/emptytask1.png"
        alt="Empty task image"
      >
      <img
        v-show="currentImageIndex === 2"
        class="mx-auto mt-10"
        width="300"
        height="300"
        src="@/assets/images/emptytask2.png"
        alt="Empty task image"
      >
      <p class="text-xl text-center font-bold mt-10">
        Отличная работа! Все задачи выполнены.<br> Запланируем дела на завтра?
      </p>
      <div class="grid grid-cols-1">
        <button
          class="bg-[#FF912380] px-2 rounded-[8px] text-black text-sm mr-1 hover:bg-[#F5DEB3] w-[156px] h-[51px] mr-auto ml-auto mt-[35px]"
          @click="goToNextDay"
        >
          Запланировать
        </button>
      </div>
    </div>
  </div>

  <!-- PROJECT -->
  <div v-if="navStack[navStack.length - 1].greedPath == 'projects_children'">
    <div
      class="pointer-events-none max-w-xl mx-auto"
    >
      <img
        class="mx-auto mt-10"
        width="300"
        height="300"
        src="@/assets/images/emptyproject.png"
        alt="Empty task image"
      >
      <p class="text-xl text-center font-bold">
        Для чего нужны проекты?
      </p>
      <div class="flex items-center mt-10">
        <icon
          :path="ready.path"
          :width="ready.width"
          :height="ready.height"
          :box="ready.viewBox"
          class="cursor-pointer hover:text-gray-800 mr-2 text-green-500"
        />
        <p class="text-lg text-left text-gray-600">
          Ставьте цели и планы на будущее
        </p>
      </div>
      <div class="flex items-center mt-3">
        <icon
          :path="ready.path"
          :width="ready.width"
          :height="ready.height"
          :box="ready.viewBox"
          class="cursor-pointer hover:text-gray-800 mr-2 text-green-500"
        />
        <p class="text-lg text-left text-gray-600">
          Работайте над задачами в команде
        </p>
      </div>
      <div class="flex items-center mt-3">
        <icon
          :path="ready.path"
          :width="ready.width"
          :height="ready.height"
          :box="ready.viewBox"
          class="cursor-pointer hover:text-gray-800 mr-2 text-green-500"
        />
        <p class="text-lg text-left text-gray-600">
          Сохраняйте личные файлы, встречи, поездки и т.д.
        </p>
      </div>
      <div class="flex items-center mt-3">
        <icon
          :path="ready.path"
          :width="ready.width"
          :height="ready.height"
          :box="ready.viewBox"
          class="cursor-pointer hover:text-gray-800 mr-2 text-green-500"
        />
        <p class="text-lg text-left text-gray-600">
          Собирайте списки ваших любимых книг, фильмов и т.д.
        </p>
      </div>
      <div class="flex items-center mt-3">
        <icon
          :path="ready.path"
          :width="ready.width"
          :height="ready.height"
          :box="ready.viewBox"
          class="cursor-pointer hover:text-gray-800 mr-2 text-green-500"
        />
        <p class="text-lg text-left text-gray-600">
          Начните работу с проектом, создав задачу
        </p>
      </div>
    </div>
  </div>

  <!-- TAG -->
  <div v-if="navStack[navStack.length - 1].greedPath == 'tags_children'">
    <div
      class="pointer-events-none max-w-xl mx-auto"
    >
      <img
        class="mx-auto mt-10"
        width="300"
        height="300"
        src="@/assets/images/emptytag.png"
        alt="Empty task image"
      >
      <p class="text-xl text-center font-bold">
        Для чего нужны метки?
      </p>
      <div class="flex items-center mt-10">
        <icon
          :path="ready.path"
          :width="ready.width"
          :height="ready.height"
          :box="ready.viewBox"
          class="cursor-pointer hover:text-gray-800 mr-2 text-green-500"
        />
        <p class="text-lg text-left text-gray-600">
          Группируйте похожие задачи в списки дел
        </p>
      </div>
      <div class="flex items-center mt-3">
        <icon
          :path="ready.path"
          :width="ready.width"
          :height="ready.height"
          :box="ready.viewBox"
          class="cursor-pointer hover:text-gray-800 mr-2 text-green-500"
        />
        <p class="text-lg text-left text-gray-600">
          Сосредоточьте работу вашей команды на главном
        </p>
      </div>
      <div class="flex items-center mt-3">
        <icon
          :path="ready.path"
          :width="ready.width"
          :height="ready.height"
          :box="ready.viewBox"
          class="cursor-pointer hover:text-gray-800 mr-2 text-green-500"
        />
        <p class="text-lg text-left text-gray-600">
          Визуализируйте порядок выполнения задач
        </p>
      </div>
      <div class="flex items-center mt-3">
        <icon
          :path="ready.path"
          :width="ready.width"
          :height="ready.height"
          :box="ready.viewBox"
          class="cursor-pointer hover:text-gray-800 mr-2 text-green-500"
        />
        <p class="text-lg text-left text-gray-600">
          Начните работу с меткой, создав задачу
        </p>
      </div>
    </div>
  </div>

  <!-- COLOR  -->
  <div v-if="navStack[navStack.length - 1].value?.uid == COLOR_UID">
    <div
      class="pointer-events-none max-w-xl mx-auto"
    >
      <img
        class="mx-auto mt-10"
        width="300"
        height="300"
        src="@/assets/images/emptycolor.png"
        alt="Empty task image"
      >
      <p class="text-xl text-center font-bold mt-5">
        Для чего нужны цвета?
      </p>
      <div class="flex items-center mt-10">
        <icon
          :path="ready.path"
          :width="ready.width"
          :height="ready.height"
          :box="ready.viewBox"
          class="cursor-pointer hover:text-gray-800 mr-2 text-green-500"
        />
        <p class="text-lg text-left text-gray-600">
          Выделяйте основные задачи в большом списке дел
        </p>
      </div>
      <div class="flex items-center mt-3">
        <icon
          :path="ready.path"
          :width="ready.width"
          :height="ready.height"
          :box="ready.viewBox"
          class="cursor-pointer hover:text-gray-800 mr-2 text-green-500"
        />
        <p class="text-lg text-left text-gray-600">
          Сосредоточьте внимание команды на том, что важно
        </p>
      </div>
      <div class="flex items-center mt-3">
        <icon
          :path="ready.path"
          :width="ready.width"
          :height="ready.height"
          :box="ready.viewBox"
          class="cursor-pointer hover:text-gray-800 mr-2 text-green-500"
        />
        <p class="text-lg text-left text-gray-600">
          Оживите скучные списки дел
        </p>
      </div>
      <div class="flex items-center mt-3">
        <icon
          :path="ready.path"
          :width="ready.width"
          :height="ready.height"
          :box="ready.viewBox"
          class="cursor-pointer hover:text-gray-800 mr-2 text-green-500"
        />
        <p class="text-lg text-left text-gray-600">
          Начните работу с цветом, создав задачу
        </p>
      </div>
    </div>
  </div>
</template>
