import store from '@/store/index.js'
import * as REGLAMENTS from '@/store/actions/reglaments.js'

export function createReglament (obj) {
  store.commit(REGLAMENTS.REGLAMENT_CHANGE_REGLAMENTS, [obj.obj])
}
