<template>
  <div
    :style="{ backgroundColor: bgColor, borderColor: borderColor, color: textColor }"
    class="p-4 max-w-sm rounded-xl shadow-lg flex items-center space-x-4 mx-3.5 my-5 cursor-pointer"
    @click="redirect"
  >
    <Icon
      :path="userIcon.path"
      class="flex-none h-7 w-7"
      :style="{ color: textColor }"
      :box="userIcon.viewBox"
      :width="userIcon.width"
      :height="userIcon.height"
    />
    <p
      class="w-full mx-3.5 font-semibold"
      :style="{ color: textColor }"
    >
      {{ messageText }}
    </p>
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
    },
    userIcon: {
      type: Object,
      default: DefaultIcon
    }
  },
  data () {
    return {
      DefaultIcon,
      CloseIcon
    }
  },
  methods: {
    redirect () {
      if (this.link.length) {
        window.open(this.link)
      }
    }
  }
}
</script>
