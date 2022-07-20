import * as REGLAMENTS from '../actions/reglaments'
import axios from 'axios'

const state = {
  reglaments: {}
}

const actions = {
  [REGLAMENTS.REGLAMENT_REQUEST]: ({ commit, dispatch }, uidReglament) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_INSPECTOR_API + 'reglament?uid_reglament=' + uidReglament
      axios({ url: url, method: 'GET' })
        .then(resp => {
          resolve(resp)
        }).catch(err => {
          reject(err)
        })
    })
  },
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
  [REGLAMENTS.CRATE_USER_REGLAMENT_ANSWER]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_INSPECTOR_API + 'userReglamentAnswer'
      axios({ url: url, method: 'POST', data: data })
        .then(resp => {
          resolve(resp)
        }).catch(err => {
          reject(err)
        })
    })
  },
  [REGLAMENTS.GET_USERS_REGLAMENT_ANSWERS]: ({ commit, dispatch }, uidReglament) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_INSPECTOR_API + 'userReglamentAnswers?uid_reglament=' + uidReglament
      axios({ url: url, method: 'GET' })
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
