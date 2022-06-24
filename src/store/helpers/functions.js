import * as CARD from '@/store/actions/cards'
import * as TASK from '@/store/actions/tasks'
import * as TYPES from '@/websync/types.js'
import { notify } from 'notiwind'

export function visitChildren (arr, callback) {
  for (const value of arr) {
    callback(value)
    if (value.children) {
      visitChildren(value.children, callback)
    }
  }
}

export function showNotify (notification, notificationSound = true) {
  if (['denied', 'default'].includes(Notification.permission)) {
    notify(notification, 30000)
    if (notificationSound) {
      const nt = new Audio(require('@/assets/sounds/notification.mp3'))
      nt.volume = 0.5
      nt.play()
    }
  } else {
    // creating system notification
    const websyncNotification = new Notification(notification.title, {
      body: notification.text,
      tag: notification?.uid ?? ''
    })

    // set up click event for just created notification
    console.log('Creating system notification: ', notification)
    if (notification?.obj?.type === TYPES.TYPE_OBJECT_TASK) {
      websyncNotification.onclick = () => {
        const link = `${window.location.origin}/task/${notification.obj.obj.uid}`
        window.location = link
      }
    } else if (notification?.obj?.type === TYPES.TYPE_OBJECT_PROJECT) {
      websyncNotification.onclick = () => {
        const link = `${window.location.origin}/project/${notification.obj.obj.uid}`
        window.location = link
      }
    } else if (notification?.task?.uid) {
      websyncNotification.onclick = () => {
        const link = `${window.location.origin}/task/${notification.task.uid}`
        window.location = link
      }
    }
  }
}

function wipeCachedFilesFromLocalStorage () {
  const regexExp =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi
  for (const key in localStorage) {
    if (regexExp.test(key)) {
      localStorage.removeItem(key)
    }
  }
}

export function setLocalStorageItem (key, value) {
  try {
    localStorage.setItem(key, value)
  } catch (e) {
    wipeCachedFilesFromLocalStorage()
    localStorage.setItem(key, value)
  }
}

export function writeCache (key, blob) {
  if (blob.size > 2_000_000) return // Don't cache if blob size is over 2M
  const reader = new FileReader()
  reader.readAsDataURL(blob)
  reader.onloadend = function () {
    const base64data = reader.result
    setLocalStorageItem(key, base64data)
  }
}

export function recursiveRemove (arr, uid) {
  return arr.filter((item) => {
    if ('children' in item) {
      item.children = recursiveRemove(item.children, uid)
    }
    return item.uid !== uid
  })
}

export const UID_TO_ACTION = {
  '2e8dddd0-125a-49ef-a87c-0ea17b1b7f56': CARD.BOARD_CARDS_REQUEST, // private
  '1b30b42c-b77e-40a4-9b43-a19991809add': CARD.BOARD_CARDS_REQUEST, // shared
  '2bad1413-a373-4926-8a3c-58677a680714': [
    TASK.TASKS_REQUEST,
    TASK.OVERDUE_TASKS_REQUEST,
    TASK.UNSORTED_TASKS_REQUEST
  ],
  '901841d9-0016-491d-ad66-8ee42d2b496b': TASK.TASKS_REQUEST, // get today's day
  '46418722-a720-4c9e-b255-16db4e590c34': TASK.OVERDUE_TASKS_REQUEST,
  '017a3e8c-79ac-452c-abb7-6652deecbd1c': TASK.OPENED_TASKS_REQUEST,
  '5183b619-3968-4c3a-8d87-3190cfaab014': TASK.UNSORTED_TASKS_REQUEST,
  'fa042915-a3d2-469c-bd5a-708cf0339b89': TASK.UNREAD_TASKS_REQUEST,
  '2a5cae4b-e877-4339-8ca1-bd61426864ec': TASK.IN_WORK_TASKS_REQUEST,
  '6fc44cc6-9d45-4052-917e-25b1189ab141': TASK.IN_FOCUS_TASKS_REQUEST,
  '7af232ff-0e29-4c27-a33b-866b5fd6eade': TASK.PROJECT_TASKS_REQUEST, // private
  '431a3531-a77a-45c1-8035-f0bf75c32641': TASK.PROJECT_TASKS_REQUEST, // shared
  '00a5b3de-9474-404d-b3ba-83f488ac6d30': TASK.TAG_TASKS_REQUEST,
  'ed8039ae-f3de-4369-8f32-829d401056e9': TASK.COLOR_TASKS_REQUEST,
  'd28e3872-9a23-4158-aea0-246e2874da73': TASK.EMPLOYEE_TASKS_REQUEST,
  '169d728b-b88b-462d-bd8e-3ac76806605b': TASK.DELEGATED_TASKS_REQUEST,
  '511d871c-c5e9-43f0-8b4c-e8c447e1a823': TASK.DELEGATED_TO_USER_TASKS_REQUEST,
  'd35fe0bc-1747-4eb1-a1b2-3411e07a92a0':
    TASK.READY_FOR_COMPLITION_TASKS_REQUEST,
  '11212e94-cedf-11ec-9d64-0242ac120002': TASK.SEARCH_TASK,
  '47a38aa5-19c4-40d0-b8c0-56c3a420935d': TASK.ONE_TASK_REQUEST
}
