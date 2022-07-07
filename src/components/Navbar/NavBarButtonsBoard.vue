<template>
  <div class="flex items-center gap-[10px]">
    <BoardModalBoxDelete
      v-if="showDeleteBoard"
      title="Удалить доску"
      text="Вы действительно хотите удалить доску?"
      @cancel="showDeleteBoard = false"
      @yes="onDeleteBoard"
    />
    <PopMenu>
      <NavBarButtonIcon
        icon="filter"
        :colored="showOnlyMyCardsCreated || showOnlyMyCards || showArchive"
      />
      <template #menu>
        <PopMenuItem
          :icon="showOnlyMyCards ? 'check' : 'uncheck'"
          @click="clickBoardMyCards"
        >
          Ответственный я
        </PopMenuItem>
        <PopMenuItem
          :icon="showOnlyMyCardsCreated ? 'check' : 'uncheck'"
          @click="clickBoardMyCardsCreated"
        >
          Создатель я
        </PopMenuItem>
        <PopMenuItem
          :icon="showArchive ? 'check' : 'uncheck'"
          @click="clickBoardArchive"
        >
          Архив
        </PopMenuItem>
        <PopMenuDivider
          v-if="showOnlyMyCardsCreated || showOnlyMyCards || showArchive"
        />
        <PopMenuItem
          v-if="showOnlyMyCardsCreated || showOnlyMyCards || showArchive"
          icon="uncheck"
          @click="clickBoardFilterClear"
        >
          Сбросить
        </PopMenuItem>
      </template>
    </PopMenu>
    <PopMenu>
      <NavBarButtonIcon icon="menu" />
      <template #menu>
        <PopMenuItem
          icon="edit"
          @click="clickEditBoard"
        >
          Свойства доски
        </PopMenuItem>
        <PopMenuItem
          v-if="canDelete"
          icon="delete"
          @click="clickDeleteBoard"
        >
          Удалить доску
        </PopMenuItem>
      </template>
    </PopMenu>
  </div>
</template>

<script>
import NavBarButtonIcon from '@/components/Navbar/NavBarButtonIcon.vue'
import PopMenu from '@/components/modals/PopMenu.vue'
import PopMenuItem from '@/components/modals/PopMenuItem.vue'
import PopMenuDivider from '@/components/modals/PopMenuDivider.vue'
import BoardModalBoxDelete from '@/components/Board/BoardModalBoxDelete.vue'

import * as BOARD from '@/store/actions/boards'
import { NAVIGATOR_REMOVE_BOARD } from '@/store/actions/navigator'

export default {
  components: {
    NavBarButtonIcon,
    PopMenu,
    PopMenuItem,
    PopMenuDivider,
    BoardModalBoxDelete
  },
  props: {
    boardUid: {
      type: String,
      default: ''
    }
  },
  emits: ['popNavBar'],
  data () {
    return {
      showDeleteBoard: false
    }
  },
  computed: {
    board () {
      return this.$store.state.boards.boards[this.boardUid]
    },
    canDelete () {
      return this.board?.email_creator === this.$store.state.user.user?.current_user_email
    },
    showArchive () {
      return this.$store.state.boards.showArchive
    },
    showOnlyMyCards () {
      return this.$store.state.boards.showOnlyMyCards
    },
    showOnlyMyCardsCreated () {
      return this.$store.state.boards.showOnlyMyCardsCreated
    }
  },
  methods: {
    clickEditBoard () {
      if (!this.$store.state.isPropertiesMobileExpanded) {
        this.$store.dispatch('asidePropertiesToggle', true)
      }
      this.$store.commit('basic', { key: 'propertiesState', value: 'board' })
      this.$store.commit(BOARD.SELECT_BOARD, this.board)
    },
    clickDeleteBoard () {
      this.showDeleteBoard = true
    },
    onDeleteBoard () {
      this.showDeleteBoard = false
      //
      this.$store.dispatch(BOARD.REMOVE_BOARD_REQUEST, this.boardUid)
        .then(() => {
          this.$store.dispatch('asidePropertiesToggle', false)
          this.$store.commit(BOARD.SELECT_BOARD, undefined)
          //
          this.$store.commit(NAVIGATOR_REMOVE_BOARD, this.board)
          // для актуального значения количества досок
          this.$store.commit(BOARD.REMOVE_BOARD_REQUEST, this.boardUid)
          //
          this.$emit('popNavBar')
        })
    },
    clickBoardMyCards () {
      this.$store.commit(BOARD.SHOW_BOARD_MY_CARDS, !this.showOnlyMyCards)
    },
    clickBoardMyCardsCreated () {
      this.$store.commit(BOARD.SHOW_BOARD_MY_CARDS_CREATED, !this.showOnlyMyCardsCreated)
    },
    clickBoardArchive () {
      this.$store.commit(BOARD.SHOW_BOARD_ARCHIVE, !this.showArchive)
    },
    clickBoardFilterClear () {
      this.$store.commit(BOARD.BOARD_CLEAR_FILTER)
    }
  }
}
</script>

<style scoped>

</style>
