import { getInspectorMessage } from '@/inspector/message.js'
import { showNotify } from '@/store/helpers/functions'
import store from '@/store/index.js'
import { createTaskMessage } from '@/websync/task_message.js'
import { computed } from 'vue'

const user = computed(() => store.state.user.user)
const isNotificationSoundOn = computed(
  () => store.state.inspector.is_notification_sound_on
)
const employees = computed(() => store.state.employees.employees)

export default function initInspectorSocket () {
  const socket = new WebSocket(process.env.VUE_APP_INSPECTOR_WS)
  socket.onopen = function (event) {
    const auth = {
      type: 'auth',
      message: user.value.current_user_uid,
      data: user.value.current_user_email,
      organization: user.value.owner_email,
      employee: JSON.stringify(employees.value[user.value.current_user_uid])
    }
    socket.send(JSON.stringify(auth))
  }
  socket.onmessage = function (event) {
    parseMessage(event.data)
  }
  socket.onclose = function (event) {
    setTimeout(function () {
      initInspectorSocket()
    }, 2500)
  }
  socket.onerror = function () {
    socket.close()
  }
}

function parseMessage (data) {
  try {
    const parsedData = JSON.parse(data)
    showNotify(
      {
        uid: parsedData?.uid_json,
        group: 'inspector',
        title: 'Инспектор',
        text: getInspectorMessage(parsedData.message, parsedData.task.taskJson),
        task: parsedData.task.taskJson
      },
      isNotificationSoundOn.value
    )

    // Creating inspector message from notification
    parsedData.message_obj.uid_creator = 'inspector' // Let chat know it is message from inspector
    parsedData.message_obj.date_create = parsedData.message_obj.creation_date
    const message = {
      uid_task: parsedData.task.taskJson.uid,
      obj: parsedData.message_obj
    }
    createTaskMessage(message)
  } catch (e) {
    console.log('parseMessage inspector error', e)
  }
}
