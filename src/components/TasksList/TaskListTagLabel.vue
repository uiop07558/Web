<template>
  <div
    class="tag-label cursor-default p-1 px-2 text-xs whitespace-nowrap rounded-[4px] flex items-center"
    :class="[colorTextClass, colorBgClass]"
    :style="colorBgStyle"
  >
    <Icon
      v-if="iconPath && !image"
      :path="iconPath"
      class="mr-1"
      :class="[colorTextClass]"
      :box="iconBox"
      :width="iconWidth"
      :height="iconHeight"
    />
    <img
      v-if="image"
      :src="image"
      class="rounded-[3px] text-base cursor-pointer w-[16px] h-[16px] mr-1"
    >
    {{ text }}
  </div>
</template>

<script>
import Icon from '@/components/Icon.vue'

export default {
  components: {
    Icon
  },
  props: {
    colorTextClass: {
      type: String,
      default: 'text-white'
    },
    colorBgClass: {
      type: String,
      default: ''
    },
    colorBgStyle: {
      type: Object,
      default: () => ({})
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
    },
    image: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped></style>
