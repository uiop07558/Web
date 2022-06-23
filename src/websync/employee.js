import store from '@/store/index.js'
import { NAVIGATOR_PUSH_EMPLOYEE, NAVIGATOR_REMOVE_EMPLOYEE, NAVIGATOR_UPDATE_EMPLOYEE } from '@/store/actions/navigator'

export function createEmployee (obj) {
  store.commit(NAVIGATOR_PUSH_EMPLOYEE, [obj.obj])
}

export function removeEmployee (uid) {
  store.commit(NAVIGATOR_REMOVE_EMPLOYEE, { uid: uid })
}

export function updateEmployee (obj) {
  store.dispatch(NAVIGATOR_UPDATE_EMPLOYEE, obj.obj)
}
