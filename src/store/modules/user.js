import axios from 'axios'
import { notify } from 'notiwind'
import { USER_ERROR, USER_REQUEST, USER_SUCCESS, USER_CHANGE_PHOTO, USER_CHANGE_PHONE } from '../actions/user'

const state = {
  user: false,
  status: '',
  hasLoadedOnce: false
}

const getters = {}

const actions = {
  [USER_REQUEST]: ({ commit }) => {
    return new Promise((resolve, reject) => {
      commit(USER_REQUEST)
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/account/info'
      axios({ url: url, method: 'GET' })
        .then((resp) => {
          commit(USER_SUCCESS, resp)
          resolve(resp)
        })
        .catch((err) => {
          notify(
            {
              group: 'api',
              title: 'REST API Error, please make screenshot',
              action: USER_REQUEST,
              text: err.response.data
            },
            15000
          )
          commit(USER_ERROR, err)
          reject(err)
        })
    })
  },
  [USER_CHANGE_PHOTO]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/account/foto'
      axios({
        data: data.file,
        url: url,
        method: 'PATCH'
      })
        .then((resp) => {
          console.log(resp)
          dispatch(USER_REQUEST).then((resp) => {
            commit(USER_CHANGE_PHOTO)
            resolve(resp)
          })
        })
        .catch((err) => {
          notify(
            {
              group: 'api',
              title: 'REST API Error, please make screenshot',
              action: USER_CHANGE_PHOTO,
              text: '123'
            },
            15000
          )
          reject(err)
        })
    })
  },
  [USER_CHANGE_PHONE]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/account/phone'
      axios({
        data: data,
        url: url,
        method: 'PATCH'
      })
        .then((resp) => {
          commit(USER_SUCCESS, resp)
          resolve(resp)
        })
        .catch((err) => {
          notify(
            {
              group: 'api',
              title: 'REST API Error, please make screenshot',
              action: USER_CHANGE_PHONE,
              text: '123'
            },
            15000
          )
          reject(err)
        })
    })
  }
}

const mutations = {
  [USER_CHANGE_PHOTO]: (state, data) => {
    console.log(state.user)
    state.user.foto_link = state.user.foto_link + '&Z=' + Date.now()
    console.log(state.user.foto_link)
  },
  [USER_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [USER_SUCCESS]: (state, resp) => {
    state.status = 'success'
    state.user = resp.data
    console.log('current user', state.user)
    state.hasLoadedOnce = true
  },
  [USER_ERROR]: (state) => {
    state.status = 'error'
    state.hasLoadedOnce = true
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
