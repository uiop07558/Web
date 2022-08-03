import store from '@/store/index.js'
import * as CARD from '@/store/actions/cards'
import * as BOARD from '@/store/actions/boards'

export function updateBoard (obj) {
  const currentBoard = store.state.boards.boards[obj.obj.uid]
  if (!currentBoard || JSON.stringify(currentBoard) === JSON.stringify(obj.obj)) {
    return
  }

  // change stage position
  if (
    currentBoard.stages.length === obj.obj.stages.length &&
    JSON.stringify(currentBoard.stages) !== JSON.stringify(obj.obj.stages) &&
    !getChangeNameStage(currentBoard.stages, obj.obj.stages)
  ) {
    currentBoard.stages = obj.obj.stages
    store.commit('ChangeStagesOrder', obj.obj)
  } else if (getChangeNameStage(currentBoard.stages, obj.obj.stages)) { // rename stage
    const {
      UID: stageUid,
      newName: newStageTitle,
      stageIndex
    } = getChangeNameStage(currentBoard.stages, obj.obj.stages)
    const data = {
      boardUid: obj.obj.uid,
      stageUid,
      newStageTitle,
      stageIndex
    }
    store.commit(BOARD.RENAME_STAGE_BOARD, data)
    if (nowInThisBoard(obj.obj)) {
      store.dispatch(CARD.BOARD_CARDS_RENAME_STAGE, {
        UID: stageUid,
        Name: newStageTitle
      })
    }
  }

  // add stage in board
  if (currentBoard.stages.length < obj.obj.stages.length) {
    const lastStage = obj.obj.stages[obj.obj.stages.length - 1]
    const data = {
      boardUid: obj.obj.uid,
      stageUid: lastStage.UID,
      newStageTitle: lastStage.Name
    }
    store.commit(BOARD.ADD_STAGE_BOARD, data)
    if (nowInThisBoard(obj.obj)) {
      store.dispatch(CARD.BOARD_CARDS_ADDSTAGE, lastStage)
    }
  } else if (currentBoard.stages.length > obj.obj.stages.length) { // remove stage from board
    const deletedStageUid = getDeletedStageUid(currentBoard.stages, obj.obj.stages)
    const data = {
      boardUid: obj.obj.uid,
      stageUid: deletedStageUid
    }
    store.commit(BOARD.DELETE_STAGE_BOARD, data)
    if (nowInThisBoard(obj.obj)) {
      store.commit('DeleteStage', deletedStageUid)
    }
  }
}

/* a function that keeps track of whether a person is currently
in this board to know if 'state.cards' needs to be changed */
const nowInThisBoard = (board) => {
  return store.state.navbar.navStack[store.state.navbar.navStack.length - 1].key === 'greedSource' && store.state.navbar.navStack[store.state.navbar.navStack.length - 1].uid === board.uid
}

// a function that gets the uid of the column to be removed
const getDeletedStageUid = (currentStages, fromWsStages) => {
  const curStagesArray = []
  const fromWsStagesArray = []
  for (let i = 0; i < currentStages.length; i++) {
    curStagesArray.push(currentStages[i].UID)
  }
  for (let i = 0; i < fromWsStages.length; i++) {
    fromWsStagesArray.push(fromWsStages[i].UID)
  }
  return curStagesArray.filter(item => !fromWsStagesArray.includes(item))[0]
}

/* a function that gets the uid of the
 column whose name needs to be changed */
const getChangeNameStage = (currentStages, fromWsStages) => {
  const curStagesArray = {}
  const fromWsStagesArray = {}
  for (let i = 0; i < currentStages.length; i++) {
    curStagesArray[currentStages[i].UID] = currentStages[i].Name
  }
  for (let i = 0; i < fromWsStages.length; i++) {
    fromWsStagesArray[fromWsStages[i].UID] = fromWsStages[i].Name
  }
  let renamedStageIndex = -1
  const renamedUid = Object.keys(curStagesArray).filter((key, index) => {
    if (curStagesArray[key] !== fromWsStagesArray[key]) {
      renamedStageIndex = index
      return curStagesArray[key] !== fromWsStagesArray[key]
    }
    return undefined
  })[0]
  if (renamedUid) {
    return {
      UID: renamedUid,
      stageIndex: renamedStageIndex,
      newName: fromWsStagesArray[renamedUid]
    }
  }
  return false
}
