<template>
  <div class="group w-full h-[34px] flex items-center">
    <img
      :src="employeesByEmail[contributor.email]?.fotolink"
      class="flex-none border border-[#7e7e80] rounded-[4px] w-[20px] h-[20px] mr-[7px]"
    >
    <span class="grow font-roboto text-[13px] leading-[20px] font-medium text-[#4c4c4d] mr-[7px]">{{ employeesByEmail[contributor.email]?.name ?? '???' }}</span>
  </div>
</template>
<script>
export default {
  props: {
    contributor: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    employeesByEmail () {
      return this.$store.state.employees.employeesByEmail
    }
  }
}
</script>
