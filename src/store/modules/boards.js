import { visitChildren } from '@/store/helpers/functions'
import axios from 'axios'
import * as BOARD from '../actions/boards'

function uuidv4 () {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  )
}

const state = {
  boards: {},
  selectedBoard: undefined,
  showArchive: false,
  showOnlyCardsWhereIAmResponsible: false,
  showOnlyCardsWithNoResponsible: false,
  showOnlyMyCreatedCards: false,
  showOnlySearchText: undefined
}

const getters = {}

const actions = {
  [BOARD.CREATE_BOARD_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_LEADERTASK_API + '/api/v1/board'
      axios({ url: url, method: 'POST', data: data })
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [BOARD.UPDATE_BOARD_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_LEADERTASK_API + '/api/v1/board'
      axios({ url: url, method: 'PATCH', data: data })
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [BOARD.REMOVE_BOARD_REQUEST]: ({ commit, dispatch }, uid) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_LEADERTASK_API + '/api/v1/board?uid=' + uid
      axios({ url: url, method: 'DELETE' })
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [BOARD.QUIT_BOARD_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_LEADERTASK_API +
        '/api/v1/board/exit?uid=' +
        data.uid +
        '&uid_user=' +
        data.uid_user
      axios({ url: url, method: 'POST' })
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [BOARD.CHANGE_BOARD_NAME]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const board = state.boards[data.boardUid]
      if (!board) return reject(new Error(`not find board ${data.boardUid}`))
      board.name = data.newBoardTitle
      dispatch(BOARD.UPDATE_BOARD_REQUEST, board)
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [BOARD.CHANGE_BOARD_COLOR]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const board = state.boards[data.boardUid]
      if (!board) return reject(new Error(`not find board ${data.boardUid}`))
      board.color = data.newBoardColor
      dispatch(BOARD.UPDATE_BOARD_REQUEST, board)
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [BOARD.CHANGE_BOARD_MEMBERS]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const board = state.boards[data.boardUid]
      if (!board) return reject(new Error(`not find board ${data.boardUid}`))
      board.members = data.newBoardMembers
      dispatch(BOARD.UPDATE_BOARD_REQUEST, board)
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [BOARD.ADD_STAGE_BOARD_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const board = state.boards[data.boardUid]
      commit(BOARD.ADD_STAGE_BOARD, { ...data, stageUid: uuidv4() })
      dispatch(BOARD.UPDATE_BOARD_REQUEST, board)
        .then((resp) => {
          resolve(board.stages[board.stages.length - 1])
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [BOARD.RENAME_STAGE_BOARD_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      commit(BOARD.RENAME_STAGE_BOARD, data)
      const board = state.boards[data.boardUid]
      const index = board.stages.findIndex(
        (stage) => stage.UID === data.stageUid
      )
      const newStage = board.stages[index]
      // отправляем на сервер изменения
      dispatch(BOARD.UPDATE_BOARD_REQUEST, board)
        .then((resp) => {
          resolve(newStage)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [BOARD.DELETE_STAGE_BOARD_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const board = state.boards[data.boardUid]
      commit(BOARD.DELETE_STAGE_BOARD, data)
      const url =
        process.env.VUE_APP_LEADERTASK_API +
        '/api/v1/boardsstages?uid=' +
        data.stageUid
      axios({ url: url, method: 'DELETE' })
        .then((resp) => {
          // пересчитываем порядок
          board.stages.forEach((stage, index) => {
            stage.Order = index
          })
          //
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [BOARD.CHANGE_COLOR_STAGE_BOARD_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const board = state.boards[data.boardUid]
      if (!board) return reject(new Error(`not find board ${data.boardUid}`))
      const index = board.stages.findIndex(
        (stage) => stage.UID === data.stageUid
      )
      if (index === -1) {
        return reject(
          new Error(`not find stage ${data.stageUid} at board ${data.boardUid}`)
        )
      }
      const stage = board.stages[index]
      const newStage = { ...stage }
      newStage.Color = data.newColor
      // заменяем
      board.stages.splice(index, 1, newStage)
      // отправляем на сервер изменения
      dispatch(BOARD.UPDATE_BOARD_REQUEST, board)
        .then((resp) => {
          resolve(newStage)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [BOARD.CHANGE_ORDER_STAGE_BOARD_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const board = state.boards[data.boardUid]
      commit(BOARD.CHANGE_ORDER_STAGE_BOARD, data)
      // отправляем на сервер изменения
      dispatch(BOARD.UPDATE_BOARD_REQUEST, board)
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [BOARD.ADD_BOARD_TO_FAVORITE]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      dispatch(BOARD.UPDATE_BOARD_REQUEST, { ...data, favorite: 1 })
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [BOARD.REMOVE_BOARD_FROM_FAVORITE]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      dispatch(BOARD.UPDATE_BOARD_REQUEST, { ...data, favorite: 0 })
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}

const mutations = {
  [BOARD.REMOVE_BOARD_REQUEST]: (state, uid) => {
    visitChildren(
      [state.boards[uid]],
      (value) => delete state.boards[value.uid]
    )
    delete state.boards[uid]
  },
  [BOARD.PUSH_BOARD]: (state, boards) => {
    for (const board of boards) {
      state.boards[board.uid] = board
    }
  },
  [BOARD.SELECT_BOARD]: (state, board) => {
    state.selectedBoard = board
  },
  [BOARD.SHOW_BOARD_ARCHIVE]: (state, showArchive) => {
    state.showArchive = showArchive
  },
  [BOARD.SHOW_BOARD_MY_CARDS_WHERE_IAM_RESPONSIBLE]: (state, show) => {
    state.showOnlyCardsWhereIAmResponsible = show
  },
  [BOARD.SHOW_BOARD_CARDS_WITH_NO_RESPONSIBLE]: (state, show) => {
    state.showOnlyCardsWithNoResponsible = show
  },
  [BOARD.SHOW_BOARD_MY_CREATED_CARDS]: (state, showMyCreatedCards) => {
    state.showOnlyMyCreatedCards = showMyCreatedCards
  },
  [BOARD.SHOW_SEARCH_CARDS]: (state, searchText) => {
    state.showOnlySearchText = searchText
  },
  [BOARD.BOARD_CLEAR_FILTER]: (state) => {
    state.showArchive = false
    state.showOnlyCardsWhereIAmResponsible = false
    state.showOnlyCardsWithNoResponsible = false
    state.showOnlyMyCreatedCards = false
  },
  [BOARD.ADD_STAGE_BOARD]: (state, data) => {
    const board = state.boards[data.boardUid]
    if (!board) console.error(`not find board ${data.boardUid}`)
    const newStage = {
      Color: '',
      Name: data.newStageTitle,
      Order: board.stages.length,
      UID: data.stageUid
    }
    board.stages.push(newStage)
  },
  [BOARD.DELETE_STAGE_BOARD]: (state, data) => {
    const board = state.boards[data.boardUid]
    if (!board) console.error(`not find board ${data.boardUid}`)
    const index = board.stages.findIndex(
      (stage) => stage.UID === data.stageUid
    )
    if (index === -1) {
      console.error(`not find stage ${data.stageUid} at board ${data.boardUid}`)
    }
    board.stages.splice(index, 1)
  },
  [BOARD.RENAME_STAGE_BOARD]: (state, data) => {
    const board = state.boards[data.boardUid]
    if (!board) console.error(`not find board ${data.boardUid}`)
    const index = board.stages.findIndex(
      (stage) => stage.UID === data.stageUid
    )

    const stage = board.stages[index]
    const newStage = { ...stage }
    newStage.Name = data.newStageTitle
    board.stages.splice(index, 1, newStage)
  },
  [BOARD.CHANGE_ORDER_STAGE_BOARD]: (state, data) => {
    const board = state.boards[data.boardUid]
    if (!board) console.error(`not find board ${data.boardUid}`)
    const index = board.stages.findIndex(
      (stage) => stage.UID === data.stageUid
    )
    if (index === -1) {
      console.error(`not find stage ${data.stageUid} at board ${data.boardUid}`)
    }
    // вырезаем и вставляем на новое место
    const stages = board.stages.splice(index, 1)
    board.stages.splice(data.newOrder, 0, ...stages)
    // пересчитываем порядок
    board.stages.forEach((stage, index) => {
      stage.Order = index
    })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
