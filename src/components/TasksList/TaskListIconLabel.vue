<template>
  <div
    class="bg-gray-100 rounded-[4px] px-2 whitespace-nowrap flex items-center"
  >
    <Icon
      v-if="iconPath"
      :path="iconPath"
      class="py-1.5"
      :class="[iconClass]"
      :box="iconBox"
      :width="iconWidth"
      :height="iconHeight"
    />
    <span
      v-if="text"
      class="cursor-default pl-1 text-xs text-black-600"
    >
      {{ text }}
    </span>
  </div>
</template>

<script>
import Icon from '@/components/Icon.vue'

export default {
  components: {
    Icon
  },
  props: {
    iconClass: {
      type: String,
      default: 'text-gray-600'
    },
    iconPath: {
      type: [String, Array],
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    iconBox: {
      type: String,
      default: '0 0 13 12'
    },
    iconWidth: {
      type: String,
      default: '13'
    },
    iconHeight: {
      type: String,
      default: '12'
    }
  }
}
</script>

<style scoped></style>
