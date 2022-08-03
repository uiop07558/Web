<template>
  <ModalBox
    :title="title"
    ok="Да"
    cancel="Нет"
    @ok="onSave"
    @cancel="onCancel"
  >
    <div class="text-[#7e7e80] text-[13px] leading-[18px] font-roboto whitespace-pre-line">
      {{ text }}
    </div>
  </ModalBox>
</template>

<script>
import ModalBox from '@/components/modals/ModalBox.vue'

export default {
  components: {
    ModalBox
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    }
  },
  emits: ['yes', 'cancel'],
  methods: {
    onCancel () {
      this.$emit('cancel')
    },
    onSave () {
      this.$emit('yes')
    }
  }
}
</script>

<style scoped>

</style>
