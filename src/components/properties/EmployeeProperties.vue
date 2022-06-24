<template>
  <div>
    <ModalBoxDelete
      v-if="showConfirm"
      title="Удалить сотрудника"
      :text="`Вы действительно хотите удалить сотрудника ${selectedEmployeeName}?`"
      @cancel="showConfirm = false"
      @yes="removeEmployee"
    />
    <div class="flex justify-between items-center">
      <PopMenu v-if="isCanDeleteEmp">
        <PropsButtonMenu />
        <template #menu>
          <PopMenuItem
            icon="delete"
            @click="showConfirm = true"
          >
            Удалить
          </PopMenuItem>
        </template>
      </PopMenu>
      <div v-else />
      <PropsButtonClose
        @click="closeProperties"
      />
    </div>
    <div
      v-if="empFoto"
      class="flex-none mt-[20px] w-[82px] h-[82px] bg-cover bg-center bg-origin-content bg-clip-content rounded-[14px]"
      :style="{
        'background-image': `url(${empFoto})`
      }"
    />
    <input
      v-model="currEmpName"
      type="text"
      placeholder="Имя сотрудника"
      class="mt-[25px] p-0 font-roboto font-bold text-[18px] leading-[21px] text-[#424242] w-full border-none focus:ring-0 focus:outline-none"
      @blur="changeEmpName"
    >
    <div
      class="mt-[30px] font-roboto text-[16px] leading-[19px] font-medium text-[#4c4c4d]"
    >
      Email
    </div>
    <div
      class="mt-[15px] w-full font-roboto text-[15px] leading-[18px] text-[#606061] overflow-hidden text-ellipsis whitespace-nowrap"
    >
      {{ selectedEmployee.email }}
    </div>
    <div
      v-if="selectedEmployeePhone"
      class="mt-[30px] font-roboto text-[16px] leading-[19px] font-medium text-[#4c4c4d]"
    >
      Телефон
    </div>
    <div
      v-if="selectedEmployeePhone"
      class="mt-[15px] w-full font-roboto text-[15px] leading-[18px] text-[#606061] overflow-hidden text-ellipsis whitespace-nowrap"
    >
      {{ selectedEmployeePhone }}
    </div>
    <div
      class="mt-[30px] font-roboto text-[16px] leading-[19px] font-medium text-[#4c4c4d]"
    >
      Отдел
    </div>
    <div
      v-if="isCanChangeDepartments"
      class="mt-[15px] w-full"
    >
      <PopMenu
        class="grow w-full"
      >
        <div
          class="group w-full flex items-center gap-[12px] px-[12px] h-[42px] border border-black/12 rounded-[6px] cursor-pointer"
        >
          <div class="grow w-full font-roboto text-[#606061] text-[15px]">
            {{ selectedEmployeeDep || 'Вне отдела' }}
          </div>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M10.7603 3.56099C11.0027 3.80668 11.0001 4.2024 10.7544 4.44486L6.7011 8.44486C6.47139 8.67154 6.10687 8.68606 5.85986 8.47836L1.46875 4.78606C1.20456 4.56391 1.17047 4.16965 1.39262 3.90546C1.61477 3.64126 2.00903 3.60718 2.27322 3.82933L6.22845 7.15512L9.87642 3.55514C10.1221 3.31269 10.5178 3.31531 10.7603 3.56099Z"
              fill="#7E7E80"
            />
          </svg>
        </div>
        <template #menu>
          <PopMenuItem
            v-for="(dep, index) in allDepartments"
            :key="index"
            @click="setDepartment(index)"
          >
            {{ dep.name }}
          </PopMenuItem>
        </template>
      </PopMenu>
    </div>
    <div
      v-else
      class="mt-[15px] w-full font-roboto text-[15px] leading-[18px] text-[#606061] overflow-hidden text-ellipsis whitespace-nowrap"
    >
      {{ selectedEmployeeDep || 'Вне отдела' }}
    </div>
  </div>
</template>

<script>
import * as EMPLOYEE from '@/store/actions/employees'
import { NAVIGATOR_REMOVE_EMPLOYEE } from '@/store/actions/navigator'
import ModalBoxDelete from '@/components/Common/ModalBoxDelete.vue'
import PopMenu from '@/components/modals/PopMenu.vue'
import PopMenuItem from '@/components/modals/PopMenuItem.vue'
import PropsButtonClose from '@/components/Common/PropsButtonClose.vue'
import PropsButtonMenu from '@/components/Common/PropsButtonMenu.vue'

export default {
  components: {
    ModalBoxDelete,
    PopMenu,
    PopMenuItem,
    PropsButtonMenu,
    PropsButtonClose
  },
  data () {
    return {
      showConfirm: false,
      currEmpName: ''
    }
  },
  computed: {
    selectedEmployee () {
      return this.$store.state.employees.selectedEmployee
    },
    selectedEmployeeName () {
      return this.selectedEmployee?.name || ''
    },
    selectedEmployeePhone () {
      const phone = this.selectedEmployee?.phone || ''
      const index = phone.lastIndexOf(' ("')
      if (index !== -1) {
        return phone.slice(0, index)
      }
      return phone
    },
    selectedEmployeeDep () {
      const dep = this.$store.state.departments.deps[this.selectedEmployee?.uid_dep]
      return dep?.name || ''
    },
    empFoto () {
      const fotolink = this.selectedEmployee?.fotolink
      if (!fotolink) return undefined
      if (fotolink.endsWith('&size=b')) {
        const foto = fotolink.slice(0, -('&size=b'.length))
        return foto + '&size=l'
      }
      return fotolink
    },
    isSelectedEmployeeCurrentUser () {
      const user = this.$store.state.user.user
      return user.current_user_uid === this.selectedEmployee.uid
    },
    isCanChangeDepartments () {
      const employees = this.$store.state.employees.employees
      const user = this.$store.state.user.user
      const userType = employees[user.current_user_uid].type
      return userType === 1
    },
    isCanDeleteEmp () {
      const employees = this.$store.state.employees.employees
      const user = this.$store.state.user.user
      const userType = employees[user.current_user_uid].type
      const userAdmin = userType === 1 || userType === 2
      // текущий пользователь админ
      // тот которого удаляем не суперадмин
      // тот которого удаляем не текущий пользователь
      return userAdmin && this.selectedEmployee.type !== 1 && !this.isSelectedEmployeeCurrentUser
    },
    allDepartments () {
      const deps = Object.values(this.$store.state.departments.deps)
      deps.sort((item1, item2) => {
        // сначала по порядку
        if (item1.order > item2.order) return 1
        if (item1.order < item2.order) return -1
        // если одинаковый, то по имени
        if (item1.name > item2.name) return 1
        if (item1.name < item2.name) return -1
        return 0
      })
      deps.unshift({
        uid: '00000000-0000-0000-0000-000000000000',
        name: 'Вне отдела'
      })
      return deps
    }
  },
  watch: {
    selectedEmployeeName: {
      immediate: true,
      handler: function (val) {
        this.currEmpName = val
      }
    }
  },
  methods: {
    print (msg, param) {
      console.log(msg, param)
    },
    removeEmployee () {
      this.showConfirm = false
      this.$store.dispatch(EMPLOYEE.REMOVE_EMPLOYEE_REQUEST, this.selectedEmployee)
        .then(() => {
          this.$store.dispatch('asidePropertiesToggle', false)
          this.$store.commit(NAVIGATOR_REMOVE_EMPLOYEE, this.selectedEmployee)
        })
    },
    closeProperties () {
      this.$store.dispatch('asidePropertiesToggle', false)
    },
    changeEmpName () {
      const title = this.currEmpName.trim()
      if (title && this.selectedEmployee.name !== title) {
        this.$store.dispatch(EMPLOYEE.CHANGE_EMPLOYEE_NAME, {
          email: this.selectedEmployee.email,
          name: title
        })
          .then((resp) => {
            console.log('changeEmpName', resp)
          })
      }
    },
    setDepartment (index) {
      const dep = this.allDepartments[index]
      if (this.selectedEmployee?.uid_dep !== dep.uid) {
        const data = {
          uidDepartmentOld: this.selectedEmployee.uid_dep,
          uidDepartmentNew: dep.uid,
          uidEmp: this.selectedEmployee.uid,
          emailEmp: this.selectedEmployee.email,
          depOld: this.$store.state.departments.deps[this.selectedEmployee.uid_dep],
          depNew: this.$store.state.departments.deps[dep.uid]
        }
        this.$store.dispatch(EMPLOYEE.CHANGE_EMPLOYEE_DEP, data)
          .then((resp) => {
            console.log('setDepartment', resp, data)
          })
      }
    }
  }
}
</script>

<style scoped>
</style>
