<script setup>
import ImagePreloader from '@/components/CardProperties/ImagePreloader.vue'
import AudioPreloader from '@/components/CardProperties/AudioPreloader.vue'
import DocPreloader from '@/components/CardProperties/DocPreloader.vue'
import MoviePreloader from '@/components/CardProperties/MoviePreloader.vue'
import FilePreloader from '@/components/CardProperties/FilePreloader.vue'
import CardChatDeletedMessageContent from '@/components/CardProperties/CardChatDeletedMessageContent.vue'
import { computed } from 'vue'

const emit = defineEmits(['onQuoteMessage', 'onDeleteFile'])
const props = defineProps({
  message: Object
})

const setCurrentQuote = () => {
  emit('onQuoteMessage', props.message)
}

const deleteFile = () => {
  emit('onDeleteFile', props.message.uid)
}

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

const getMessageTimeString = (dateCreate) => {
  if (!dateCreate) return ''
  // добавляем Z в конец, чтобы он посчитал что это UTC время
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
const FileIsMovie = computed(() => ['mov', 'mp4', 'wmv', 'avi', 'avchd', 'mkv', 'webm', 'mpeg-2'].includes(fileExtension.value))
const FileIsDoc = computed(() => ['doc', 'docx', 'xls', 'xlsx', 'txt', 'pdf'].includes(fileExtension.value))
const FileIsAudio = computed(() => ['mp3', 'wav', 'm4a'].includes(fileExtension.value))
</script>
<template>
  <div
    class="bg-[#F4F5F7] py-[10px] px-[12px] rounded-t-[12px] rounded-bl-[12px] mb-[5px] float-right relative max-w-[300px] group"
  >
    <card-chat-deleted-message-content v-if="props.message.deleted" />
    <image-preloader
      v-else-if="FileIsImage"
      :file-uid="props.message.uid"
      :file-extension="fileExtension"
      :file-name="props.message.file_name"
      :file-date-create="getMessageTimeString(props.message.date_create)"
      preloader-color="#F4F5F7"
      @onQuoteMessage="setCurrentQuote"
      @onDeleteMessage="deleteFile"
    />
    <audio-preloader
      v-else-if="FileIsAudio"
      :file-uid="props.message.uid"
      :file-extension="fileExtension"
      :file-name="props.message.file_name"
      :file-date-create="getMessageTimeString(props.message.date_create)"
      @onQuoteMessage="setCurrentQuote"
      @onDeleteMessage="deleteFile"
    />
    <doc-preloader
      v-else-if="FileIsDoc"
      :file-uid="props.message.uid"
      :file-name="props.message.file_name"
      :file-extension="fileExtension"
      :file-size="formatBytes(props.message.file_size)"
      :file-date-create="getMessageTimeString(props.message.date_create)"
      @onQuoteMessage="setCurrentQuote"
      @onDeleteMessage="deleteFile"
    />
    <movie-preloader
      v-else-if="FileIsMovie"
      :file-uid="props.message.uid"
      :file-extension="fileExtension"
      :file-name="props.message.file_name"
      :file-size="formatBytes(props.message.file_size)"
      :file-date-create="getMessageTimeString(props.message.date_create)"
      @onQuoteMessage="setCurrentQuote"
      @onDeleteMessage="deleteFile"
    />
    <file-preloader
      v-else
      :file-uid="props.message.uid"
      :file-extension="fileExtension"
      :file-name="props.message.file_name"
      :file-size="formatBytes(props.message.file_size)"
      :file-date-create="getMessageTimeString(props.message.date_create)"
      @onQuoteMessage="setCurrentQuote"
      @onDeleteMessage="deleteFile"
    />
  </div>
</template>
