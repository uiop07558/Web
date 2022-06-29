<template>
  <div
    :class="boxColor"
    class="p-4 max-w-sm mx-auto rounded-xl shadow-lg flex items-start space-x-4 mx-3.5 my-5"
  >
    <Icon
      :path="DefaultIcon.path"
      class="flex-none h-7 w-7"
      :box="DefaultIcon.viewBox"
      :width="DefaultIcon.width"
      :height="DefaultIcon.height"
    />
    <p class="w-full mx-3.5">
      {{ messageText }}
    </p>
    <Icon
      :path="CloseIcon.path"
      class="flex-none h-7 w-7"
      :box="CloseIcon.viewBox"
      :width="CloseIcon.width"
      :height="CloseIcon.height"
      @click="$emit('close')"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Icon from '@/components/Icon.vue'
import DefaultIcon from '@/icons/msgs.js'
import CloseIcon from '@/icons/close.js'
import { colorsBg } from '@/colors'

const props = defineProps({
  bgColor: {
    type: String,
    default: 'white'
  },
  messageText: {
    type: String,
    default: ''
  }
})
defineEmits(['close'])

const boxColor = computed(() => colorsBg[props.bgColor])
</script>
