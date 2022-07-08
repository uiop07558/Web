<template>
  <ModalBox
    title="Невозможно создать сотрудника"
    @cancel="onCancel"
  >
    <div class="flex flex-col">
      <div class="text-[#7e7e80] text-[13px] leading-[18px] font-roboto whitespace-pre-line">
        Сотрудник уже добавлен
      </div>
    </div>
  </ModalBox>
</template>
<script>
import ModalBox from '@/components/modals/ModalBox.vue'

export default {
  components: {
    ModalBox
  },
  emits: ['cancel'],
  methods: {
    onCancel () {
      this.$emit('cancel')
    }
  }
}
</script>

<style scoped>

</style>
