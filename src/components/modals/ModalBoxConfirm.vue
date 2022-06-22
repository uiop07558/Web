<script setup>
import { computed } from 'vue'
import JbButton from '@/components/JbButton.vue'
import CardComponent from '@/components/CardComponent.vue'
import Overlay from '@/components/modals/Overlay.vue'

const props = defineProps({
  title: {
    type: String,
    default: null
  },
  button: {
    type: String,
    default: 'white'
  },
  buttonLabel: {
    type: String,
    default: 'Done'
  },
  hasCancel: Boolean,
  modelValue: {
    type: [String, Number, Boolean],
    default: null
  },
  hasButton: Boolean
})

const emit = defineEmits(['update:modelValue', 'cancel', 'confirm'])

const value = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
})

const confirmCancel = mode => {
  value.value = false
  emit(mode)
}

const confirm = () => confirmCancel('confirm')
const cancel = () => confirmCancel('cancel')

</script>

<template>
  <overlay
    v-show="value"
    @overlay-click="cancel"
  >
    <card-component
      v-show="value"
      has-table
      :title="title"
      class="shadow-xl border border-gray-300 w-50 max-h-modal md:w-4/5 lg:w-1/5 z-50 p-5 rounded-2xl"
      @header-icon-click="cancel"
      @header-icon2-click="logout"
    >
      <div class="flex items-stretch mt-4 text-[#7e7e80] text-[13px] leading-[18px] font-roboto">
        <slot />
      </div>

      <div
        class="flex gap-[4px] justify-end mt-4"
      >
        <jb-button
          v-if="hasButton"
          :label="buttonLabel"
          :color="button"
          class="focus:ring min-w-[90px] focus:outline-none inline-flex cursor-pointer whitespace-nowrap justify-center items-center duration-150 px-[12px] py-[10px] rounded-md bg-[#ff9123] text-white text-[13px] leading-[15px] font-medium font-roboto"
          @click="confirm"
        />
        <jb-button
          v-if="hasCancel"
          class="focus:ring min-w-[90px] focus:outline-none inline-flex cursor-pointer whitespace-nowrap justify-center items-center duration-150 px-[12px] py-[10px] rounded-md border border-[#ff9123] bg-white text-[#ff9123] text-[13px] leading-[15px] font-medium font-roboto"
          label="Нет"
          :color="button"
          outline
          @click="cancel"
        />
      </div>
    </card-component>
  </overlay>
</template>
