import {
  MESSAGES_REQUEST,
  CREATE_MESSAGE_REQUEST,
  MESSAGES_ERROR,
  MESSAGES_SUCCESS,
  REFRESH_MESSAGES
} from '../actions/taskmessages'
import {
  FILES_REQUEST,
  FILES_ERROR,
  FILES_SUCCESS,
  REFRESH_FILES,
  MYFILES,
  GETFILES,
  FILE_SUCCESS,
  CREATE_FILES_REQUEST,
  MERGE_FILES_WITH_MESSAGES
} from '../actions/taskfiles'
import { AUTH_LOGOUT } from '../actions/auth'
import { notify } from 'notiwind'

import axios from 'axios'

const state = {
  /* messages */
  messages: [],
  status: '',
  hasLoadedOnce: false,
  /* files */
  files: [],
  file: '',
  myfiles: {}
}

const getters = {}

const actions = {
  [FILES_REQUEST]: ({ commit, dispatch }, taskUid) => {
    return new Promise((resolve, reject) => {
      commit(FILES_REQUEST)
      const url = 'https://web.leadertask.com/api/v1/tasksfiles/bytask?uid=' + taskUid
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(FILES_SUCCESS, resp)
          console.log(resp)
          resolve(resp)
        }).catch(err => {
          commit(FILES_ERROR, err)
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: FILES_REQUEST,
            text: err.response.data
          }, 15000)
          // We don't want to logout on this error
          // dispatch(AUTH_LOGOUT)
          reject(err)
        })
    })
  },
  //  GetFiles
  [GETFILES]: ({ commit, dispatch }, uid) => {
    return new Promise((resolve, reject) => {
      const url = 'https://web.leadertask.com/api/v1/tasksfiles/file?uid=' + uid
      axios({ url: url, method: 'GET', responseType: 'blob' })
        .then(resp => {
          commit(FILE_SUCCESS, resp)
          resolve(resp)
        }).catch(err => {
          commit(FILES_ERROR, err)
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: GETFILES,
            text: err.response.data
          }, 15000)
          // Don't log out
          // dispatch(AUTH_LOGOUT)
          reject(err)
        })
    })
  },
  [CREATE_FILES_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData()
      formData.append('files', data.name)
      const url = 'https://web.leadertask.com/api/v1/tasksfiles?uid_task=' + data.uid_task
      axios({
        url: url,
        method: 'POST',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(resp => {
          commit(CREATE_FILES_REQUEST, data)
          resolve(resp)
        }).catch(err => {
          reject(err)
        })
    })
  },
  [MESSAGES_REQUEST]: ({ commit, dispatch }, taskUid) => {
    return new Promise((resolve, reject) => {
      commit(MESSAGES_REQUEST)
      const url = 'https://web.leadertask.com/api/v1/tasksmsgs/bytask?uid=' + taskUid
      axios({ url: url, method: 'GET' })
        .then(resp => {
          commit(MESSAGES_SUCCESS, resp)
          resolve(resp)
        }).catch(err => {
          commit(MESSAGES_ERROR, err)
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: MESSAGES_REQUEST,
            text: err.response.data
          }, 15000)
          dispatch(AUTH_LOGOUT)
          reject(err)
        })
    })
  },
  [CREATE_MESSAGE_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      commit(MESSAGES_REQUEST)
      const url = 'https://web.leadertask.com/api/v1/tasksmsgs'
      axios({ url: url, method: 'POST', data: data })
        .then(resp => {
          resolve(resp)
          commit(CREATE_MESSAGE_REQUEST, data)
        }).catch(err => {
          notify({
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: CREATE_MESSAGE_REQUEST,
            text: err.response.data
          }, 15000)
          reject(err)
        })
    })
  },
  fetchMessagesAndFiles ({ commit, dispatch }, uid) {
    commit(MESSAGES_REQUEST)

    const messages = dispatch(MESSAGES_REQUEST, uid)
    const files = dispatch(FILES_REQUEST, uid)

    return Promise.all([messages, files])
      .then(() => {
        commit(MERGE_FILES_WITH_MESSAGES)
      })
  }
}

const mutations = {
  [MESSAGES_REQUEST]: state => {
    state.status = 'loading'
  },
  [MESSAGES_SUCCESS]: (state, resp) => {
    state.status = 'success'
    state.messages = resp.data.msgs
    state.hasLoadedOnce = true
  },
  [MESSAGES_ERROR]: state => {
    state.status = 'error'
    state.hasLoadedOnce = true
  },
  [REFRESH_MESSAGES]: state => {
    state.messages = []
  },
  [CREATE_MESSAGE_REQUEST]: (state, data) => {
    state.messages.push(data)
  },
  [FILES_REQUEST]: state => {
    state.status = 'loading'
  },
  [FILES_SUCCESS]: (state, resp) => {
    state.status = 'success'
    state.files = resp.data.files
    state.hasLoadedOnce = true
  },
  [FILE_SUCCESS]: (state, resp) => {
    state.status = 'success'
    state.file = resp.data.files
    state.hasLoadedOnce = true
  },
  [CREATE_FILES_REQUEST]: (state, resp) => {
    state.status = 'success'
    state.hasLoadedOnce = true
  },
  [MYFILES]: (state, myfiles) => {
    state.status = 'success'
    for (const taskfile of myfiles) {
      state.myfiles[taskfile.uid_creator] = taskfile
    }
    state.hasLoadedOnce = true
  },
  [FILES_ERROR]: state => {
    state.status = 'error'
    state.hasLoadedOnce = true
  },
  [REFRESH_FILES]: state => {
    state.files = []
  },
  [MERGE_FILES_WITH_MESSAGES]: state => {
    console.log('messages length ', state.messages.length)
    if (!state.messages.length) {
      for (const file in state.files) {
        state.messages.push(file)
      }
    } else {
      for (let i = 0; i < state.messages.length; i++) {
        if (state.messages[i].uid_file) {
          continue
        }
        const messageDate = new Date(state.messages[i].date_create)
        // at the start
        if (i === 0) {
          for (const file of state.files) {
            const fileDate = new Date(file.date_create)
            if ((fileDate < messageDate) && (!file._isAdded)) {
              file.msg = file.file_name
              file._isAdded = true
              state.messages.shift(file)
            }
          }
        // at the end
        } else if (i === state.messages.length - 1) {
          for (const file of state.files) {
            const fileDate = new Date(file.date_create)
            if ((fileDate > messageDate) && (!file._isAdded)) {
              file.msg = file.file_name
              file._isAdded = true
              state.messages.push(file)
            }
          }
        } else {
          const secondMessageDate = new Date(state.messages[i + 1].date_create)
          for (const file of state.files) {
            const fileDate = new Date(file.date_create)
            if ((messageDate < fileDate < secondMessageDate) && (!file._isAdded)) {
              console.log('find place between', messageDate.toString(), secondMessageDate.toString())
              console.log('trying to feet this ', fileDate.toString())
              file.msg = file.file_name
              file._isAdded = true
              state.messages.splice(i + 1, 0, file)
            }
          }
        }
      }
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}