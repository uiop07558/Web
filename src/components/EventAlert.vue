<template>
  <div
    :style="{ backgroundColor: bgColor, borderColor: borderColor }"
    class="p-4 max-w-sm rounded-xl shadow-lg flex items-start space-x-4 mx-3.5 my-5"
  >
    <Icon
      :path="DefaultIcon.path"
      class="flex-none h-7 w-7"
      :style="{ color: textColor }"
      :box="DefaultIcon.viewBox"
      :width="DefaultIcon.width"
      :height="DefaultIcon.height"
    />
    <p
      v-if="!link.length"
      class="w-full mx-3.5"
      :style="{ color: textColor }"
    >
      {{ messageText }}
    </p>
    <a
      v-if="link.length"
      class="w-full mx-3.5"
      :href="link"
      :style="{ color: textColor }"
      target="_blank"
    >
      {{ messageText }}
    </a>
  </div>
</template>

<script>
import Icon from '@/components/Icon.vue'
import DefaultIcon from '@/icons/msgs.js'
import CloseIcon from '@/icons/close.js'

export default {
  components: {
    Icon
  },
  props: {
    bgColor: {
      type: String,
      default: 'white'
    },
    textColor: {
      type: String,
      default: 'black'
    },
    borderColor: {
      type: String,
      default: 'white'
    },
    messageText: {
      type: String,
      default: ''
    },
    link: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      DefaultIcon,
      CloseIcon
    }
  }
}
</script>
