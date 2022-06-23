<template>
  <div>
    <div class="max-w-xl mx-auto">
      <img
        class="mx-auto mt-10"
        width="320"
        height="314"
        src="@/assets/images/emptydoitnow.png"
        alt="Empty task image"
      >
      <p class="text-xl text-center font-bold mt-[17px]">
        Отличная работа! В Очереди пусто.<br>
        Запланируем еще дела?
      </p>
      <div class="grid grid-cols-1">
        <button
          class="bg-[#FF912380] px-2 rounded-[8px] text-black text-sm mr-1 hover:bg-[#F5DEB3] w-[156px] h-[51px] mr-auto ml-auto mt-[35px]"
          @click="goToday"
        >
          Запланировать
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import * as TASK from '@/store/actions/tasks'
export default {
  emits: ['clickPlanning'],
  methods: {
    goToday: function () {
      this.$store.dispatch(TASK.TASKS_REQUEST)
      const navElem = {
        name: 'Сегодня',
        key: 'taskListSource',
        value: { uid: '901841d9-0016-491d-ad66-8ee42d2b496b', param: new Date() },
        typeVal: new Date(),
        type: 'date'
      }
      this.$store.commit('updateStackWithInitValue', navElem)
      this.$store.commit('basic', { key: 'taskListSource', value: { uid: '901841d9-0016-491d-ad66-8ee42d2b496b', param: null } })
      this.$store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
    }
  }
}
</script>

<style scoped></style>
