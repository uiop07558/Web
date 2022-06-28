<script setup>
import { computed } from 'vue'

import ImagePreloader from '@/components/CardProperties/ImagePreloader.vue'
import AudioPreloader from '@/components/CardProperties/AudioPreloader.vue'
import DocPreloader from '@/components/CardProperties/DocPreloader.vue'
import MoviePreloader from '@/components/CardProperties/MoviePreloader.vue'
import FilePreloader from '@/components/CardProperties/FilePreloader.vue'
import CardChatDeletedMessageContent from '@/components/CardProperties/CardChatDeletedMessageContent.vue'

const emit = defineEmits(['onQuoteMessage'])
const props = defineProps({
  message: Object
})

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

const setCurrentQuote = () => {
  emit('onQuoteMessage', props.message)
}

const getMessageTimeString = (dateCreate) => {
  if (!dateCreate) return ''
  const date = new Date(dateCreate)
  return date.toLocaleString('default', {
    hour: 'numeric',
    minute: 'numeric'
  })
}

const fileExtension = computed(() => {
  const splittedValue = props.message.file_name.split('.')
  return splittedValue[splittedValue.length - 1].toLowerCase()
})
const FileIsImage = computed(() => ['jpg', 'png', 'jpeg', 'git', 'bmp', 'gif'].includes(fileExtension.value))
const FileIsMovie = computed(() => ['mov', 'mp4'].includes(fileExtension.value))
const FileIsDoc = computed(() => ['doc', 'docx', 'xls', 'xlsx', 'txt', 'pdf'].includes(fileExtension.value))
const FileIsAudio = computed(() => ['mp3', 'wav', 'm4a'].includes(fileExtension.value))
</script>

<template>
  <div
    class="bg-[#FCEBEB] py-[12px] px-[12px] rounded-t-[12px] rounded-br-[12px] mb-[5px] float-left max-w-[300px] group"
  >
    <card-chat-deleted-message-content v-if="props.message.deleted" />
    <image-preloader
      v-else-if="FileIsImage"
      :file-uid="props.message.uid"
      :file-extension="fileExtension"
      :file-name="props.message.file_name"
      :file-date-create="getMessageTimeString(props.message.date_create)"
      :can-delete="false"
      preloader-color="#FCEBEB"
      @onQuoteMessage="setCurrentQuote"
    />
    <audio-preloader
      v-else-if="FileIsAudio"
      :file-uid="props.message.uid"
      :file-extension="fileExtension"
      :file-name="props.message.file_name"
      :file-date-create="getMessageTimeString(props.message.date_create)"
      :can-delete="false"
      @onQuoteMessage="setCurrentQuote"
    />
    <doc-preloader
      v-else-if="FileIsDoc"
      :file-uid="props.message.uid"
      :file-name="props.message.file_name"
      :file-extension="fileExtension"
      :file-size="formatBytes(props.message.file_size)"
      :file-date-create="getMessageTimeString(props.message.date_create)"
      :can-delete="false"
      @onQuoteMessage="setCurrentQuote"
    />
    <movie-preloader
      v-else-if="FileIsMovie"
      :file-uid="props.message.uid"
      :file-name="props.message.file_name"
      :file-extension="fileExtension"
      :file-size="formatBytes(props.message.file_size)"
      :file-date-create="getMessageTimeString(props.message.date_create)"
      :can-delete="false"
      @onQuoteMessage="setCurrentQuote"
    />
    <file-preloader
      v-else
      :file-uid="props.message.uid"
      :file-name="props.message.file_name"
      :file-extension="fileExtension"
      :file-size="formatBytes(props.message.file_size)"
      :file-date-create="getMessageTimeString(props.message.date_create)"
      :can-delete="false"
      @onQuoteMessage="setCurrentQuote"
    />
  </div>
</template>
