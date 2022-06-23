import { notify } from 'notiwind'
import * as TYPES from '@/websync/types.js'

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
    const websyncNotification = new Notification(notification.title, { body: notification.text, tag: notification?.uid ?? '' })

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
