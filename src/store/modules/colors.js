import axios from 'axios'
import { notify } from 'notiwind'
import {
  CREATE_COLOR_REQUEST,
  PUSH_COLOR,
  PUSH_MYCOLOR,
  REMOVE_COLOR_REQUEST,
  SELECT_COLOR,
  UPDATE_COLOR_REQUEST
} from '../actions/colors'

const state = {
  colors: {},
  mycolors: {},
  selectedColor: null
}

const getters = {}

const actions = {
  [CREATE_COLOR_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/marker'
      axios({ url: url, method: 'POST', data: data })
        .then((resp) => {
          commit(PUSH_MYCOLOR, [resp.data])
          resolve(resp)
        })
        .catch((err) => {
          notify(
            {
              group: 'api',
              title: 'REST API Error, please make screenshot',
              action: CREATE_COLOR_REQUEST,
              text: err.response.data
            },
            30000
          )
          reject(err)
        })
    })
  },
  [UPDATE_COLOR_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/marker'
      axios({ url: url, method: 'PATCH', data: data })
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          notify(
            {
              group: 'api',
              title: 'REST API Error, please make screenshot',
              action: UPDATE_COLOR_REQUEST,
              text: err.response?.data ?? err
            },
            30000
          )
          reject(err)
        })
    })
  },
  [REMOVE_COLOR_REQUEST]: ({ commit, dispatch }, uid) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_LEADERTASK_API + 'api/v1/marker?uid=' + uid
      axios({ url: url, method: 'DELETE' })
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          notify(
            {
              group: 'api',
              title: 'REST API Error, please make screenshot',
              action: REMOVE_COLOR_REQUEST,
              text: err.response?.data ?? err
            },
            10000
          )
          reject(err)
        })
    })
  }
}

const mutations = {
  [REMOVE_COLOR_REQUEST]: (state, uid) => {
    delete state.mycolors[uid]
  },
  [PUSH_COLOR]: (state, colors) => {
    for (const color of colors) {
      state.colors[color.uid] = color
    }
  },
  [PUSH_MYCOLOR]: (state, mycolors) => {
    for (const color of mycolors) {
      state.mycolors[color.uid] = color
    }
  },
  [SELECT_COLOR]: (state, color) => {
    state.selectedColor = color
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
