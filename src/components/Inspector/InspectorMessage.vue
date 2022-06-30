<script setup>
import { computed, inject } from 'vue'
import { useStore } from 'vuex'
import Icon from '@/components/Icon.vue'
import projectIcon from '@/icons/project.js'
import tagIcon from '@/icons/tag.js'
import colorIcon from '@/icons/color.js'

const store = useStore()
const employees = computed(() => store.state.employees.employees)
const currentUserUid = computed(() => store.state.user.user?.current_user_uid)
const projects = computed(() => store.state.projects.projects)
const tags = computed(() => store.state.tasks.tags)
const colors = computed(() => store.state.colors.colors)
const inputMessage = inject('inputMessage')
const currentState = inject('currentState')
const props = defineProps({
  message: {
    type: String,
    default: ''
  },
  date: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: ''
  },
  selectEmployee: {
    type: Function,
    default: () => {}
  },
  selectProject: {
    type: Function,
    default: () => {}
  },
  selectTag: {
    type: Function,
    default: () => {}
  },
  selectColor: {
    type: Function,
    default: () => {}
  },
  selectAccess: {
    type: Function,
    default: () => {}
  },
  selectTime: {
    type: Function,
    default: () => {}
  },
  actionConfirmNewParams: {
    type: Function,
    default: () => {}
  },
  actionConfirmDelegate: {
    type: Function,
    default: () => {}
  },
  lastSelected: {
    type: Function,
    default: () => {}
  }
})

const getMessageTimeString = (dateCreate) => {
  const date = new Date(dateCreate)
  return date.toLocaleString('default', {
    hour: 'numeric',
    minute: 'numeric'
  })
}

const noSetObj = {
  uid: 'no_set',
  name: 'Не устанавливать',
  comment: 'Нет'
}

const computedColors = computed(() => {
  if (currentState.value !== 'colorSelection') return {}
  const inputLowerCase = inputMessage.value.toLowerCase()
  const newColors = {}
  if (
    noSetObj.name.toLowerCase().includes(inputLowerCase) ||
    noSetObj.comment.toLowerCase().includes(inputLowerCase)
  ) {
    newColors[noSetObj.uid] = noSetObj
  }
  for (const colorUid in colors.value) {
    if (
      colors.value[colorUid].parentID &&
      colors.value[colorUid].name.toLowerCase().includes(inputLowerCase)
    ) {
      newColors[colorUid] = colors.value[colorUid]
    }
  }
  //
  const selectArr = Object.values(newColors)
  props.lastSelected(selectArr.length === 1 ? selectArr[0] : null)
  //
  return newColors
})
const computedTags = computed(() => {
  if (currentState.value !== 'tagSelection') return {}
  const inputLowerCase = inputMessage.value.toLowerCase()
  const newTags = {}
  if (
    noSetObj.name.toLowerCase().includes(inputLowerCase) ||
    noSetObj.comment.toLowerCase().includes(inputLowerCase)
  ) {
    newTags[noSetObj.uid] = noSetObj
  }
  for (const key in tags.value) {
    if (tags.value[key].name.toLowerCase().includes(inputLowerCase)) {
      newTags[key] = tags.value[key]
    }
  }
  //
  const selectArr = Object.values(newTags)
  props.lastSelected(selectArr.length === 1 ? selectArr[0] : null)
  //
  return newTags
})

function includesWord (src, value) {
  // транслитирируем русские буквы и пытаемся найти английский
  let valueTranslit = ''
  const converter = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'g',
    д: 'd',
    е: 'e',
    ё: 'e',
    ж: 'zh',
    з: 'z',
    и: 'i',
    й: 'y',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'h',
    ц: 'c',
    ч: 'ch',
    ш: 'sh',
    щ: 'sch',
    ь: '',
    ы: 'y',
    ъ: '',
    э: 'e',
    ю: 'yu',
    я: 'ya'
  }
  for (let i = 0; i < value.length; ++i) {
    const convertedChar = converter[value[i]]
    if (convertedChar === undefined) {
      valueTranslit += value[i]
    } else {
      valueTranslit += convertedChar
    }
  }
  const searchSrc = src.toLowerCase()
  return searchSrc.includes(value) || searchSrc.includes(valueTranslit)
}

const computedEmployees = computed(() => {
  if (currentState.value !== 'employeeSelection') return {}
  const inputLowerCase = inputMessage.value.toLowerCase()
  const newEmployees = {}
  for (const empUid in employees.value) {
    if (
      empUid !== currentUserUid.value &&
      includesWord(employees.value[empUid].name, inputLowerCase)
    ) {
      newEmployees[empUid] = employees.value[empUid]
    }
  }
  //
  const selectArr = Object.values(newEmployees)
  props.lastSelected(selectArr.length === 1 ? selectArr[0] : null)
  //
  return newEmployees
})

const computedAccessEmployees = computed(() => {
  if (currentState.value !== 'accessSelection') return {}
  const inputLowerCase = inputMessage.value.toLowerCase()
  const newEmployees = {}
  if (
    noSetObj.name.toLowerCase().includes(inputLowerCase) ||
    noSetObj.comment.toLowerCase().includes(inputLowerCase)
  ) {
    newEmployees[noSetObj.uid] = noSetObj
  }
  for (const empUid in employees.value) {
    if (
      empUid !== currentUserUid.value &&
      includesWord(employees.value[empUid].name, inputLowerCase)
    ) {
      newEmployees[empUid] = employees.value[empUid]
    }
  }
  //
  const selectArr = Object.values(newEmployees)
  props.lastSelected(selectArr.length === 1 ? selectArr[0] : null)
  //
  return newEmployees
})

const computedProjects = computed(() => {
  if (currentState.value !== 'projectSelection') return {}
  const inputLowerCase = inputMessage.value.toLowerCase()
  const newProjects = {}
  if (
    noSetObj.name.toLowerCase().includes(inputLowerCase) ||
    noSetObj.comment.toLowerCase().includes(inputLowerCase)
  ) {
    newProjects[noSetObj.uid] = noSetObj
  }
  for (const key in projects.value) {
    if (projects.value[key].name.toLowerCase().includes(inputLowerCase)) {
      newProjects[key] = projects.value[key]
    }
  }
  //
  const selectArr = Object.values(newProjects)
  props.lastSelected(selectArr.length === 1 ? selectArr[0] : null)
  //
  return newProjects
})

const computedСonfirmParams = computed(() => {
  if (currentState.value !== 'confirmParams') return {}
  const inputLowerCase = inputMessage.value.toLowerCase()
  const newСonfirmParams = {}
  const сonfirmParams = {
    true: { uid: 'true', name: 'Да', value: true },
    false: { uid: 'false', name: 'Нет', value: false }
  }
  for (const key in сonfirmParams) {
    if (сonfirmParams[key].name.toLowerCase().includes(inputLowerCase)) {
      newСonfirmParams[key] = сonfirmParams[key]
    }
  }
  //
  const selectArr = Object.values(newСonfirmParams)
  props.lastSelected(selectArr.length === 1 ? selectArr[0] : null)
  //
  return newСonfirmParams
})

const computedСonfirmDelegate = computed(() => {
  if (currentState.value !== 'confirmDelegate') return {}
  const inputLowerCase = inputMessage.value.toLowerCase()
  const newСonfirmParams = {}
  const сonfirmParams = {
    true: { uid: 'true', name: 'Да', value: true },
    false: { uid: 'false', name: 'Нет', value: false }
  }
  for (const key in сonfirmParams) {
    if (сonfirmParams[key].name.toLowerCase().includes(inputLowerCase)) {
      newСonfirmParams[key] = сonfirmParams[key]
    }
  }
  //
  const selectArr = Object.values(newСonfirmParams)
  props.lastSelected(selectArr.length === 1 ? selectArr[0] : null)
  //
  return newСonfirmParams
})

const getNearestDay = (d, weekDay) => { // weekDay is an int 1 - Monday, 2 - Tuesday etc
  return new Date(d.setDate(d.getDate() + (((weekDay + 7 - d.getDay()) % 7) || 7)))
}

const russianMonths = {
  Января: 0,
  Февраля: 1,
  Марта: 2,
  Апреля: 3,
  Мая: 4,
  Июня: 5,
  Июля: 6,
  Августа: 7,
  Сентября: 8,
  Октября: 9,
  Ноября: 10,
  Декабря: 11
}

const computedTimes = computed(() => {
  if (currentState.value !== 'timeSelection') return {}
  const inputLowerCase = inputMessage.value.toLowerCase()
  const re = /([0-9]){1,2} +/g
  const newTimes = {}
  const times = {
    today: { uid: 'today', name: 'Сегодня', value: new Date() },
    tomorrow: { uid: 'tomorrow', name: 'Завтра', value: new Date(new Date().setDate(new Date().getDate() + 1)) },
    monday: { uid: 'monday', name: 'Понедельник', value: getNearestDay(new Date(), 1) },
    tuesday: { uid: 'tuesday', name: 'Вторник', value: getNearestDay(new Date(), 2) },
    wednesday: { uid: 'wednesday', name: 'Среда', value: getNearestDay(new Date(), 3) },
    thursday: { uid: 'thursday', name: 'Четверг', value: getNearestDay(new Date(), 4) },
    friday: { uid: 'friday', name: 'Пятница', value: getNearestDay(new Date(), 5) },
    saturday: { uid: 'saturday', name: 'Суббота', value: getNearestDay(new Date(), 6) },
    sunday: { uid: 'sunday', name: 'Воскресенье', value: getNearestDay(new Date(), 7) }
  }

  if (re.test(inputLowerCase) && parseInt(inputMessage.value.split(' ')[0]) <= 31) {
    for (const key in russianMonths) {
      const dayNumber = inputMessage.value.split(' ')[0]
      times[key + dayNumber] = { uid: key + dayNumber, name: dayNumber + ' ' + key, value: new Date(2022, russianMonths[key], parseInt(dayNumber)) }
    }
  }
  let foundExact = false
  for (const key in times) {
    if (times[key].name.toLowerCase() === inputLowerCase) {
      newTimes[key] = times[key]
      foundExact = true
    }
    if (times[key].name.toLowerCase().includes(inputLowerCase) && !foundExact) {
      newTimes[key] = times[key]
    }
  }
  //
  const selectArr = Object.values(newTimes)
  props.lastSelected(selectArr.length === 1 ? selectArr[0] : null)
  //
  return newTimes
})
const getContrastYIQ = function (hexcolor) {
  if (!hexcolor) return null
  hexcolor = hexcolor.replace('#', '')
  const r = parseInt(hexcolor.substr(0, 2), 16)
  const g = parseInt(hexcolor.substr(2, 2), 16)
  const b = parseInt(hexcolor.substr(4, 2), 16)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000
  return yiq >= 128 ? '#4C4C4D' : 'white'
}

const getValidForeColor = function (foreColor) {
  if (foreColor && foreColor !== '#A998B6') return foreColor
  return '#4c4c4d'
}

const getValidBackColor = function (backColor) {
  if (backColor && backColor !== '#A998B6') return backColor
  return '#f4f5f7'
}
</script>

<template>
  <Transition name="slide-fade">
    <div
      class="flex items-start mb-4 max-w-md space-x-[8px]"
    >
      <img
        :src="require('@/assets/images/logo.png')"
        width="30"
        height="30"
      >
      <div class="flex flex-col">
        <div
          class="bg-white py-[12px] px-[15px]"
          style="border: 2px solid rgba(0, 0, 0, 0.12); border-radius: 0px 14px 14px 14px;"
        >
          <p
            class="font-[400] text-[14px] leading-[19px] text-[#4C4C4D]"
          >
            {{ props.message }}
          </p>
          <span
            class="font-[700] text-[11px] leading-[13px] float-right"
            style="color: rgba(0, 0, 0, 0.4);"
          >
            {{ getMessageTimeString(props.date) }}
          </span>
        </div>

        <!-- Select employee -->
        <div
          v-if="currentState === 'employeeSelection' && props.type === 'employeeSelection'"
          class="flex flex-wrap gap-[4px] mt-[10px]"
        >
          <div
            v-for="(employee, index, key) in computedEmployees"
            :key="index"
            class="cursor-pointer"
          >
            <div
              v-if="key < 4"
              class="flex items-center bg-[#F4F5F7] rounded-[4px]"
              :class="[`inspector-option-item${key + 1}`]"
              style="padding: 4px 7px 4px 6px;"
              @click="props.selectEmployee(employee)"
            >
              <img
                :src="employee.fotolink"
                width="20"
                height="20"
                class="mr-1 rounded-[8px]"
              >
              <span class="text-[#4C4C4D] font-[400] text-[13px] leading-[15px]">{{ employee.name }}</span>
            </div>
          </div>
          <p
            v-if="Object.keys(computedEmployees).length === 0"
            class="text-[#4C4C4D] font-[400] text-[13px] leading-[15px]"
          >
            Сотрудник {{ inputMessage }} не найден
          </p>
        </div>

        <!-- Select access employee -->
        <div
          v-if="currentState === 'accessSelection' && props.type === 'accessSelection'"
          class="flex flex-wrap gap-[4px] mt-[10px]"
        >
          <div
            v-for="(employee, _, index) in computedAccessEmployees"
            :key="index"
            class="cursor-pointer"
          >
            <div
              v-if="index < 4"
              class="flex items-center bg-[#F4F5F7] rounded-[4px] min-h-[28px]"
              :class="[`inspector-option-item${index + 1}`]"
              style="padding: 4px 7px 4px 6px;"
              @click="props.selectAccess(employee)"
            >
              <img
                v-if="employee.uid !== 'no_set'"
                :src="employee.fotolink"
                width="20"
                height="20"
                class="mr-1 rounded-[8px]"
              >
              <span class="text-[#4C4C4D] font-[400] text-[13px] leading-[15px]">{{ employee.name }}</span>
            </div>
          </div>
          <p
            v-if="Object.keys(computedAccessEmployees).length === 0"
            class="text-[#4C4C4D] font-[400] text-[13px] leading-[15px]"
          >
            Сотрудник {{ inputMessage }} не найден
          </p>
        </div>

        <!-- Select projects -->
        <div
          v-if="currentState === 'projectSelection' && props.type === 'projectSelection'"
          class="flex flex-wrap gap-[4px] mt-[10px]"
        >
          <div
            v-for="(project, index, key) in computedProjects"
            :key="project"
            class="cursor-pointer"
          >
            <div
              v-if="key < 4"
              class="flex items-center bg-[#F4F5F7] rounded-[4px] min-h-[28px]"
              :class="[`inspector-option-item${key + 1}`]"
              style="padding: 4px 7px 4px 6px;"
              @click="props.selectProject(project)"
            >
              <icon
                v-if="project.uid !== 'no_set'"
                :path="projectIcon.path"
                :width="18"
                :height="18"
                :box="projectIcon.viewBox"
                class="text-gray-500 mr-2 mt-0.5"
              />
              <span class="text-[#4C4C4D] font-[400] text-[13px] leading-[15px]">{{
                project.name.length > 16
                  ? project.name.slice(0, 16) + '...'
                  : project.name
              }}</span>
            </div>
          </div>
          <p
            v-if="Object.keys(computedProjects).length === 0"
          >
            <span
              class="text-[#4C4C4D] font-[400] text-[13px] leading-[15px]"
            >
              Я не смог найти проект {{ inputMessage }}
            </span>
          </p>
        </div>

        <!-- Select tags -->
        <div
          v-if="currentState === 'tagSelection' && props.type === 'tagSelection'"
          class="flex flex-wrap gap-[4px] mt-[10px]"
        >
          <div
            v-for="(tag, index, key) in computedTags"
            :key="tag"
            class="cursor-pointer"
          >
            <div
              v-show="key < 4"
              :style="{ 'color': getContrastYIQ(tag.back_color), 'background-color': getValidBackColor(tag.back_color) }"
              class="flex items-center bg-[#F4F5F7] rounded-[4px] min-h-[28px]"
              :class="[`inspector-option-item${key + 1}`]"
              style="padding: 4px 7px 4px 6px;"
              @click="props.selectTag(tag)"
            >
              <icon
                v-if="tag.uid !== 'no_set'"
                :path="tagIcon.path"
                :width="18"
                :height="18"
                :box="tagIcon.viewBox"
                class="text-gray-500 mr-2 mt-0.5"
              />
              <span
                class="font-[400] text-[13px] leading-[15px]"
              >{{
                tag.name.length > 16 ? tag.name.slice(0, 16) + '...' : tag.name
              }}</span>
            </div>
          </div>
          <p
            v-if="Object.keys(computedTags).length === 0"
          >
            <span
              class="text-[#4C4C4D] font-[400] text-[13px] leading-[15px]"
            >
              Я не смог найти метку {{ inputMessage }}
            </span>
          </p>
        </div>

        <!-- Select Colors -->
        <div
          v-if="currentState === 'colorSelection' && props.type === 'colorSelection'"
          class="flex flex-wrap gap-[4px] mt-[10px]"
        >
          <div
            v-for="(color, _, index) in computedColors"
            :key="index"
            class="cursor-pointer"
          >
            <div
              v-show="index < 4"
              class="flex items-center bg-[#F4F5F7] rounded-[4px] min-h-[28px] space-x-[6px]"
              :class="[`inspector-option-item${index + 1}`]"
              style="padding: 4px 7px 4px 6px;"
              :style="{ 'background-color': getValidBackColor(color.back_color) }"
              @click="props.selectColor(color)"
            >
              <icon
                v-if="color.uid !== 'no_set'"
                :style="{ 'color': getValidForeColor(color.fore_color) }"
                :path="colorIcon.path"
                :width="18"
                :height="18"
                :box="colorIcon.viewBox"
                class="text-gray-500 mr-0.3 mt-0.5 mb-0.5 ml-0.5"
              />
              <span
                :style="{ 'color': getValidForeColor(color.fore_color) }"
                class="text-[#4C4C4D] font-[400] text-[13px] leading-[15px]"
              >{{
                color.name.length > 16
                  ? color.name.slice(0, 16) + '...'
                  : color.name
              }}</span>
            </div>
          </div>
          <span
            v-if="Object.keys(computedColors).length === 0"
            class="text-[#4C4C4D] font-[400] text-[13px] leading-[15px]"
          >
            Я не смог найти цвет {{ inputMessage }}
          </span>
        </div>

        <!-- Select time -->
        <div
          v-if="currentState === 'timeSelection' && props.type === 'timeSelection'"
          class="flex flex-wrap gap-[4px] mt-[10px]"
        >
          <div
            v-for="(time, _, index) in computedTimes"
            :key="index"
          >
            <div
              v-if="index < 3"
              class="flex items-center bg-[#F4F5F7] rounded-[4px] space-x-[6px] cursor-pointer"
              :class="[`inspector-option-item${index + 1}`]"
              style="padding: 4px 7px 4px 6px;"
              @click="props.selectTime({ name: time.name, date: time.value.toISOString() })"
            >
              <svg
                width="16"
                height="17"
                viewBox="0 0 16 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M14.2222 2.55556H12.8889H11.3333H4.66667H3.11111H1.77778C1.47095 2.55556 1.22222 2.80429 1.22222 3.11111V14.6667C1.22222 14.9735 1.47095 15.2222 1.77778 15.2222H14.2222C14.529 15.2222 14.7778 14.9735 14.7778 14.6667V3.11111C14.7778 2.80429 14.529 2.55556 14.2222 2.55556ZM1.77778 1.33333C0.795938 1.33333 0 2.12927 0 3.11111V14.6667C0 15.6485 0.795938 16.4444 1.77778 16.4444H14.2222C15.2041 16.4444 16 15.6485 16 14.6667V3.11111C16 2.12927 15.2041 1.33333 14.2222 1.33333H12.8889H11.3333H4.66667H3.11111H1.77778Z"
                  fill="black"
                  fill-opacity="0.5"
                />
                <path
                  d="M9.59596 5.33333C8.98231 5.33333 8.48485 5.83079 8.48485 6.44444C8.48485 7.05809 8.98231 7.55555 9.59596 7.55555C10.2096 7.55555 10.7071 7.05809 10.7071 6.44444C10.7071 5.83079 10.2096 5.33333 9.59596 5.33333Z"
                  fill="black"
                  fill-opacity="0.5"
                />
                <path
                  d="M9.59596 8.44444C8.98231 8.44444 8.48485 8.9419 8.48485 9.55555C8.48485 10.1692 8.98231 10.6667 9.59596 10.6667C10.2096 10.6667 10.7071 10.1692 10.7071 9.55555C10.7071 8.9419 10.2096 8.44444 9.59596 8.44444Z"
                  fill="black"
                  fill-opacity="0.5"
                />
                <path
                  d="M8.48485 12.6667C8.48485 12.053 8.98231 11.5556 9.59596 11.5556C10.2096 11.5556 10.7071 12.053 10.7071 12.6667C10.7071 13.2803 10.2096 13.7778 9.59596 13.7778C8.98231 13.7778 8.48485 13.2803 8.48485 12.6667Z"
                  fill="black"
                  fill-opacity="0.5"
                />
                <path
                  d="M12.7071 5.33333C12.0934 5.33333 11.596 5.83079 11.596 6.44444C11.596 7.05809 12.0934 7.55555 12.7071 7.55555C13.3207 7.55555 13.8182 7.05809 13.8182 6.44444C13.8182 5.83079 13.3207 5.33333 12.7071 5.33333Z"
                  fill="black"
                  fill-opacity="0.5"
                />
                <path
                  d="M11.596 9.55555C11.596 8.9419 12.0934 8.44444 12.7071 8.44444C13.3207 8.44444 13.8182 8.9419 13.8182 9.55555C13.8182 10.1692 13.3207 10.6667 12.7071 10.6667C12.0934 10.6667 11.596 10.1692 11.596 9.55555Z"
                  fill="black"
                  fill-opacity="0.5"
                />
                <path
                  d="M12.7071 11.5556C12.0934 11.5556 11.596 12.053 11.596 12.6667C11.596 13.2803 12.0934 13.7778 12.7071 13.7778C13.3207 13.7778 13.8182 13.2803 13.8182 12.6667C13.8182 12.053 13.3207 11.5556 12.7071 11.5556Z"
                  fill="black"
                  fill-opacity="0.5"
                />
                <path
                  d="M3.41416 5.33333C2.80051 5.33333 2.30305 5.83079 2.30305 6.44444C2.30305 7.05809 2.80051 7.55555 3.41416 7.55555C4.02781 7.55555 4.52527 7.05809 4.52527 6.44444C4.52527 5.83079 4.02781 5.33333 3.41416 5.33333Z"
                  fill="black"
                  fill-opacity="0.5"
                />
                <path
                  d="M3.41416 8.44444C2.80051 8.44444 2.30305 8.9419 2.30305 9.55555C2.30305 10.1692 2.80051 10.6667 3.41416 10.6667C4.02781 10.6667 4.52527 10.1692 4.52527 9.55555C4.52527 8.9419 4.02781 8.44444 3.41416 8.44444Z"
                  fill="black"
                  fill-opacity="0.5"
                />
                <path
                  d="M2.30305 12.6667C2.30305 12.053 2.80051 11.5556 3.41416 11.5556C4.02781 11.5556 4.52527 12.053 4.52527 12.6667C4.52527 13.2803 4.02781 13.7778 3.41416 13.7778C2.80051 13.7778 2.30305 13.2803 2.30305 12.6667Z"
                  fill="black"
                  fill-opacity="0.5"
                />
                <path
                  d="M6.52528 5.33333C5.91163 5.33333 5.41416 5.83079 5.41416 6.44444C5.41416 7.05809 5.91163 7.55555 6.52528 7.55555C7.13893 7.55555 7.63639 7.05809 7.63639 6.44444C7.63639 5.83079 7.13893 5.33333 6.52528 5.33333Z"
                  fill="black"
                  fill-opacity="0.5"
                />
                <path
                  d="M5.41416 9.55555C5.41416 8.9419 5.91163 8.44444 6.52528 8.44444C7.13893 8.44444 7.63639 8.9419 7.63639 9.55555C7.63639 10.1692 7.13893 10.6667 6.52528 10.6667C5.91163 10.6667 5.41416 10.1692 5.41416 9.55555Z"
                  fill="black"
                  fill-opacity="0.5"
                />
                <path
                  d="M6.52528 11.5556C5.91163 11.5556 5.41416 12.053 5.41416 12.6667C5.41416 13.2803 5.91163 13.7778 6.52528 13.7778C7.13893 13.7778 7.63639 13.2803 7.63639 12.6667C7.63639 12.053 7.13893 11.5556 6.52528 11.5556Z"
                  fill="black"
                  fill-opacity="0.5"
                />
                <path
                  d="M4.66667 0.777778C4.66667 0.348223 4.31844 0 3.88889 0C3.45933 0 3.11111 0.348223 3.11111 0.777777V1.33333H4.66667V0.777778Z"
                  fill="black"
                  fill-opacity="0.5"
                />
                <path
                  d="M3.11111 3.44444C3.11111 3.874 3.45933 4.22222 3.88889 4.22222C4.31844 4.22222 4.66667 3.874 4.66667 3.44444V2.55556H3.11111V3.44444Z"
                  fill="black"
                  fill-opacity="0.5"
                />
                <path
                  d="M12.8889 0.777777C12.8889 0.348222 12.5407 0 12.1111 0C11.6816 0 11.3333 0.348222 11.3333 0.777776V1.33333H12.8889V0.777777Z"
                  fill="black"
                  fill-opacity="0.5"
                />
                <path
                  d="M11.3333 3.44444C11.3333 3.874 11.6816 4.22222 12.1111 4.22222C12.5407 4.22222 12.8889 3.874 12.8889 3.44445V2.55556H11.3333V3.44444Z"
                  fill="black"
                  fill-opacity="0.5"
                />
              </svg>

              <span class="text-[#4C4C4D] font-[400] text-[13px] leading-[15px]"> {{ time.name }} </span>
            </div>
          </div>
          <p
            v-if="Object.keys(computedTimes).length === 0"
          >
            <span class="text-[#4C4C4D] font-[400] text-[13px] leading-[15px]">Не могу понять когда это</span>
          </p>
        </div>

        <!-- Confirm adding additional params -->
        <div
          v-if="currentState === 'confirmParams' && props.type === 'confirmParams'"
          class="flex flex-wrap gap-[4px] mt-[10px]"
        >
          <div
            v-for="(confirm, _, index) in computedСonfirmParams"
            :key="index"
            class="flex items-center bg-[#F4F5F7] rounded-[4px] py-[10px] px-[14px] cursor-pointer"
            :class="[`inspector-option-item${index + 1}`]"
            @click="props.actionConfirmNewParams(confirm.value)"
          >
            <span class="text-[#4C4C4D] font-[500] text-[13px] leading-[15px]">{{ confirm.name }}</span>
          </div>
          <p
            v-if="Object.keys(computedСonfirmParams).length === 0"
          >
            <span class="text-[#4C4C4D] font-[400] text-[13px] leading-[15px]">Да или Нет?</span>
          </p>
        </div>

        <!-- Confirm delegate the task -->
        <div
          v-if="currentState === 'confirmDelegate' && props.type === 'confirmDelegate'"
          class="flex flex-wrap gap-[4px] mt-[10px]"
        >
          <div
            v-for="(confirm, _, index) in computedСonfirmDelegate"
            :key="index"
            class="flex items-center bg-[#F4F5F7] rounded-[4px] py-[10px] px-[14px] cursor-pointer"
            :class="[`inspector-option-item${index + 1}`]"
            @click="props.actionConfirmDelegate(confirm.value)"
          >
            <span class="text-[#4C4C4D] font-[500] text-[13px] leading-[15px]"> {{ confirm.name }} </span>
          </div>
          <p
            v-if="Object.keys(computedСonfirmDelegate).length === 0"
          >
            <span class="text-[#4C4C4D] font-[500] text-[13px] leading-[15px]">Да или Нет?</span>
          </p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
