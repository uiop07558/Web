import * as REGLAMENTS from '../actions/reglaments'
import axios from 'axios'

const state = {
  reglaments: {}
}

const actions = {
  [REGLAMENTS.REGLAMENTS_REQUEST]: ({ commit, dispatch }, organization) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_INSPECTOR_API + 'reglaments?organization=' + organization
      axios({ url: url, method: 'GET' })
        .then(resp => {
          resolve(resp)
        }).catch(err => {
          reject(err)
        })
    })
  },
  [REGLAMENTS.CREATE_REGLAMENT_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_INSPECTOR_API + 'reglaments'
      axios({ url: url, method: 'POST', data: data })
        .then(resp => {
          resolve(resp)
        }).catch(err => {
          reject(err)
        })
    })
  },
  [REGLAMENTS.UPDATE_REGLAMENT_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_INSPECTOR_API + 'reglaments'
      axios({ url: url, method: 'PATCH', data: data })
        .then(resp => {
          resolve(resp)
        }).catch(err => {
          reject(err)
        })
    })
  },
  [REGLAMENTS.DELETE_REGLAMENT_REQUEST]: ({ commit, dispatch }, uid) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_INSPECTOR_API + 'reglaments?uid=' + uid
      axios({ url: url, method: 'DELETE' })
        .then(resp => {
          resolve(resp)
        }).catch(err => {
          reject(err)
        })
    })
  }
}

const mutations = {}

export default {
  state,
  actions,
  mutations
}
