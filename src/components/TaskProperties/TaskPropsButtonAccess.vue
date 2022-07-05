<template>
  <AccessLimit
    v-if="showFreeModal"
    @cancel="showFreeModal = false"
  />
  <Popper
    class="popper-access light"
    arrow
    trigger="hover"
    placement="bottom"
    :disabled="!canEdit"
  >
    <template
      #content="{ close }"
      class="bottom"
    >
      <div class="popper">
        <div
          class="opacity-75 font-semibold title-popover-main btn-access-popover"
          @click="close"
        >
          <button
            class="btn-clear-popover"
            @click="onCancel"
          >
            Отменить
          </button>
          <button
            class="btn-save-popover"
            @click="onSave"
          >
            <span class="title-z-popover">Сохранить</span>
          </button>
        </div>
        <div>
          <div class="container-employee-popover">
            <div
              v-for="emp in employees"
              :key="emp.uid"
            >
              <div
                v-if="emp.uid !== currentUserUid"
                class="list-employee-access"
                @click="showSaveButtons = true"
              >
                <img
                  :src="emp.fotolink"
                  class="mr-1 border-fotolink border-solid border-2 border-sky-500"
                  width="30"
                  height="30"
                >
                <input
                  :id="emp.uid"
                  type="checkbox"
                  name="check_access_employee"
                  class="custom-checkbox"
                  :checked="isCheckedEmail(emp.email)"
                  @click="onCheckEmail(emp.email)"
                >
                <label
                  class="employee-name-custom"
                  :for="emp.uid"
                >
                  <div class="popover-employee-email">
                    <div style="color: black">{{ emp.name }}</div>
                    {{ emp.email }}
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <div
      v-if="accessEmails.length > 0"
      style="position: relative"
    >
      <div v-if="accessEmails.length > 1">
        <div
          v-for="(userEmail, index) in accessEmails"
          :key="index"
          class="mt-3 tags-custom-access dark:bg-gray-800 dark:text-gray-100 project-hover-close"
          :class="{ 'cursor-pointer': canEdit, 'cursor-default': !canEdit }"
        >
          <svg
            width="15"
            height="18"
            viewBox="0 0 15 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M14.1331 13.4091C14.4963 13.4091 14.7935 13.1115 14.7935 12.7478V8.8604C14.7935 7.4024 13.6081 6.21551 12.1518 6.21551H11.3593V3.88469C11.3593 1.74233 9.57946 0 7.39676 0C5.21405 0 3.43421 1.74233 3.43421 3.88469V6.21551H2.6417C1.18546 6.21551 0 7.4024 0 8.8604V14.757C0 16.215 1.18546 17.4019 2.6417 17.4019H10.2097C10.5749 17.4019 10.8709 17.1059 10.8709 16.7407C10.8709 16.3755 10.5749 16.0795 10.2097 16.0795H2.6417C1.91193 16.0795 1.32085 15.4877 1.32085 14.757V8.8604C1.32085 8.12975 1.91193 7.53796 2.6417 7.53796H12.1518C12.8816 7.53796 13.4727 8.12975 13.4727 8.8604V12.7478C13.4727 13.1115 13.7699 13.4091 14.1331 13.4091ZM4.75506 6.21551H10.0385V3.88469C10.0385 2.47298 8.853 1.32245 7.39676 1.32245C5.94052 1.32245 4.75506 2.47298 4.75506 3.88469V6.21551Z"
              fill="black"
              fill-opacity="0.5"
            />
          </svg>
          <span class="rounded">{{ getEmpNameByEmail(userEmail) }}</span>
          <button
            v-if="userEmail === currentUserEmail || isCustomer"
            class="btn-close-popover"
            @click.stop="removeAccess(userEmail)"
          >
            <svg
              width="11"
              height="11"
              viewBox="0 0 11 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.17983 5.00341L9.76317 1.42841C9.92009 1.27149 10.0082 1.05866 10.0082 0.836743C10.0082 0.614825 9.92009 0.401996 9.76317 0.245076C9.60625 0.0881567 9.39342 0 9.1715 0C8.94958 0 8.73675 0.0881567 8.57983 0.245076L5.00483 3.82841L1.42983 0.245076C1.27291 0.0881567 1.06008 -1.65342e-09 0.838165 0C0.616247 1.65342e-09 0.403418 0.0881567 0.246499 0.245076C0.0895788 0.401996 0.00142217 0.614825 0.00142217 0.836743C0.00142217 1.05866 0.0895788 1.27149 0.246499 1.42841L3.82983 5.00341L0.246499 8.57841C0.168392 8.65588 0.106397 8.74805 0.0640893 8.8496C0.0217821 8.95115 0 9.06007 0 9.17008C0 9.28009 0.0217821 9.38901 0.0640893 9.49056C0.106397 9.59211 0.168392 9.68427 0.246499 9.76174C0.323968 9.83985 0.416135 9.90185 0.517685 9.94415C0.619234 9.98646 0.728156 10.0082 0.838165 10.0082C0.948175 10.0082 1.0571 9.98646 1.15865 9.94415C1.2602 9.90185 1.35236 9.83985 1.42983 9.76174L5.00483 6.17841L8.57983 9.76174C8.6573 9.83985 8.74947 9.90185 8.85102 9.94415C8.95257 9.98646 9.06149 10.0082 9.1715 10.0082C9.28151 10.0082 9.39043 9.98646 9.49198 9.94415C9.59353 9.90185 9.6857 9.83985 9.76317 9.76174C9.84127 9.68427 9.90327 9.59211 9.94558 9.49056C9.98788 9.38901 10.0097 9.28009 10.0097 9.17008C10.0097 9.06007 9.98788 8.95115 9.94558 8.8496C9.90327 8.74805 9.84127 8.65588 9.76317 8.57841L6.17983 5.00341Z"
                fill="#7E7E80"
              />
            </svg>
          </button>
        </div>
      </div>
      <div v-else>
        <div
          class="mt-3 tags-custom-access dark:bg-gray-800 dark:text-gray-100 project-hover-close"
          :class="{ 'cursor-pointer': canEdit, 'cursor-default': !canEdit }"
        >
          <svg
            width="15"
            height="18"
            viewBox="0 0 15 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M14.1331 13.4091C14.4963 13.4091 14.7935 13.1115 14.7935 12.7478V8.8604C14.7935 7.4024 13.6081 6.21551 12.1518 6.21551H11.3593V3.88469C11.3593 1.74233 9.57946 0 7.39676 0C5.21405 0 3.43421 1.74233 3.43421 3.88469V6.21551H2.6417C1.18546 6.21551 0 7.4024 0 8.8604V14.757C0 16.215 1.18546 17.4019 2.6417 17.4019H10.2097C10.5749 17.4019 10.8709 17.1059 10.8709 16.7407C10.8709 16.3755 10.5749 16.0795 10.2097 16.0795H2.6417C1.91193 16.0795 1.32085 15.4877 1.32085 14.757V8.8604C1.32085 8.12975 1.91193 7.53796 2.6417 7.53796H12.1518C12.8816 7.53796 13.4727 8.12975 13.4727 8.8604V12.7478C13.4727 13.1115 13.7699 13.4091 14.1331 13.4091ZM4.75506 6.21551H10.0385V3.88469C10.0385 2.47298 8.853 1.32245 7.39676 1.32245C5.94052 1.32245 4.75506 2.47298 4.75506 3.88469V6.21551Z"
              fill="black"
              fill-opacity="0.5"
            />
          </svg>
          <span class="rounded">{{ getEmpNameByEmail(accessEmails[0]) }}</span>
          <button
            v-if="accessEmails[0] === currentUserEmail || isCustomer"
            class="btn-close-popover"
            @click.stop="removeAccess(accessEmails[0])"
          >
            <svg
              width="11"
              height="11"
              viewBox="0 0 11 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.17983 5.00341L9.76317 1.42841C9.92009 1.27149 10.0082 1.05866 10.0082 0.836743C10.0082 0.614825 9.92009 0.401996 9.76317 0.245076C9.60625 0.0881567 9.39342 0 9.1715 0C8.94958 0 8.73675 0.0881567 8.57983 0.245076L5.00483 3.82841L1.42983 0.245076C1.27291 0.0881567 1.06008 -1.65342e-09 0.838165 0C0.616247 1.65342e-09 0.403418 0.0881567 0.246499 0.245076C0.0895788 0.401996 0.00142217 0.614825 0.00142217 0.836743C0.00142217 1.05866 0.0895788 1.27149 0.246499 1.42841L3.82983 5.00341L0.246499 8.57841C0.168392 8.65588 0.106397 8.74805 0.0640893 8.8496C0.0217821 8.95115 0 9.06007 0 9.17008C0 9.28009 0.0217821 9.38901 0.0640893 9.49056C0.106397 9.59211 0.168392 9.68427 0.246499 9.76174C0.323968 9.83985 0.416135 9.90185 0.517685 9.94415C0.619234 9.98646 0.728156 10.0082 0.838165 10.0082C0.948175 10.0082 1.0571 9.98646 1.15865 9.94415C1.2602 9.90185 1.35236 9.83985 1.42983 9.76174L5.00483 6.17841L8.57983 9.76174C8.6573 9.83985 8.74947 9.90185 8.85102 9.94415C8.95257 9.98646 9.06149 10.0082 9.1715 10.0082C9.28151 10.0082 9.39043 9.98646 9.49198 9.94415C9.59353 9.90185 9.6857 9.83985 9.76317 9.76174C9.84127 9.68427 9.90327 9.59211 9.94558 9.49056C9.98788 9.38901 10.0097 9.28009 10.0097 9.17008C10.0097 9.06007 9.98788 8.95115 9.94558 8.8496C9.90327 8.74805 9.84127 8.65588 9.76317 8.57841L6.17983 5.00341Z"
                fill="#7E7E80"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div
      v-else
      ref="btnRef"
      class="mt-3 tags-custom-access dark:bg-gray-800 dark:text-gray-100"
      :class="{ 'cursor-pointer': canEdit, 'cursor-default': !canEdit }"
    >
      <svg
        width="15"
        height="18"
        viewBox="0 0 15 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M14.1331 13.4091C14.4963 13.4091 14.7935 13.1115 14.7935 12.7478V8.8604C14.7935 7.4024 13.6081 6.21551 12.1518 6.21551H11.3593V3.88469C11.3593 1.74233 9.57946 0 7.39676 0C5.21405 0 3.43421 1.74233 3.43421 3.88469V6.21551H2.6417C1.18546 6.21551 0 7.4024 0 8.8604V14.757C0 16.215 1.18546 17.4019 2.6417 17.4019H10.2097C10.5749 17.4019 10.8709 17.1059 10.8709 16.7407C10.8709 16.3755 10.5749 16.0795 10.2097 16.0795H2.6417C1.91193 16.0795 1.32085 15.4877 1.32085 14.757V8.8604C1.32085 8.12975 1.91193 7.53796 2.6417 7.53796H12.1518C12.8816 7.53796 13.4727 8.12975 13.4727 8.8604V12.7478C13.4727 13.1115 13.7699 13.4091 14.1331 13.4091ZM4.75506 6.21551H10.0385V3.88469C10.0385 2.47298 8.853 1.32245 7.39676 1.32245C5.94052 1.32245 4.75506 2.47298 4.75506 3.88469V6.21551Z"
          fill="black"
          fill-opacity="0.5"
        />
      </svg>

      <span class="rounded">Доступ</span>
    </div>
  </Popper>
</template>

<script>
import Popper from 'vue3-popper'
import AccessLimit from '@/components/TaskProperties/AccessLimit'

export default {
  components: {
    Popper,
    AccessLimit
  },
  props: {
    currentUserUid: {
      type: String,
      default: ''
    },
    isCustomer: {
      type: Boolean,
      default: false
    },
    accessEmails: {
      type: Array,
      default: () => []
    },
    canEdit: Boolean
  },
  emits: ['changeAccess'],
  data: () => ({
    showSaveButtons: false,
    showFreeModal: false,
    checkEmails: []
  }),
  computed: {
    employees () {
      return this.$store.state.employees.employees
    },
    employeesByEmail () {
      return this.$store.state.employees.employeesByEmail
    },
    user () {
      return this.$store.state.user.user
    },
    currentUserEmail () {
      return this.employees[this.currentUserUid]?.email
    }
  },
  watch: {
    accessEmails: {
      immediate: true,
      handler: function (val) {
        this.checkEmails = [...val]
      }
    }
  },
  methods: {
    print (val) {
      console.log(val)
    },
    onCancel () {
      this.checkEmails = [...this.accessEmails]
    },
    onSave () {
      this.$emit('changeAccess', this.checkEmails)
    },
    getEmpNameByEmail (userEmail) {
      return this.employeesByEmail[userEmail.toLowerCase()]?.name ?? userEmail
    },
    removeAccess (userEmail) {
      this.onCheckEmail(userEmail)
      this.onSave()
    },
    isCheckedEmail (userEmail) {
      const index = this.checkEmails.findIndex(
        (email) => email.toLowerCase() === userEmail.toLowerCase()
      )
      return index !== -1
    },
    onCheckEmail (userEmail) {
      const index = this.checkEmails.findIndex(
        (email) => email.toLowerCase() === userEmail.toLowerCase()
      )
      if (index === -1) {
        if (this.user.tarif === 'free') {
          this.showFreeModal = true
          return
        }
        this.checkEmails.push(userEmail)
      } else {
        this.checkEmails.splice(index, 1)
      }
    }
  }
}
</script>

<style scoped>
.popper-access .popper {
  top: 5% !important;
}
.bottom {
  position: absolute;
  top: 40%;
  left: 45%;
}
.title-popover-main {
  background-color: white;
  display: table;
  /* width: 100%; */
  opacity: 1;
  line-height: 14px;
  position: relative;
  height: 34px;
  margin: 0 auto;
}
.btn-access-popover {
  display: table;
}
.btn-clear-popover {
  width: 90px;
  height: 25px;
  font-size: 11px;
  color: gray;
  float: left;
  margin-right: 5px;
  border-radius: 7px;
  border: 1px solid gray;
}
.btn-save-popover {
  width: 90px;
  height: 25px;
  color: gray;
  border-radius: 7px;
  margin: 0 auto;
  display: table;
  font-size: 11px;
  border: 1px solid gray;
}
.title-z-popover {
  margin-top: 7px;
  cursor: pointer;
}
.container-employee-popover {
  height: 220px;
  overflow-y: auto;
  /* margin-top: 10px; */
  min-width: 220px;
}
.container-employee-popover::-webkit-scrollbar {
  width: 0px;
}
.container-employee-popover::-webkit-scrollbar-track {
  background-color: #e4e4e4;
  border-radius: 100px;
}
.container-employee-popover::-webkit-scrollbar-thumb {
  background-color: #d4aa70;
  border-radius: 100px;
}
.list-employee-access {
  display: flex;
  margin-bottom: 2px;
  margin-right: 5px;
  font-size: 12px;
}
.list-employee-access:hover {
  cursor: pointer;
}
.list-employee-access input[type='checkbox'],
.list-employee-access input[type='radio'] {
  margin-right: 10px;
  margin-top: 13px;
}
.list-employee-access img {
  height: 30px;
  border-radius: 5px;
  margin-right: 10px;
  margin-top: 5px;
}
.border-fotolink {
  border-radius: 25%;
  border: none;
}
.custom-checkbox {
  position: absolute;
  z-index: -1;
  opacity: 0;
}
.custom-checkbox + label {
  display: inline-flex;
  align-items: center;
  position: relative;
  user-select: none;
}
.custom-checkbox + label::after {
  content: '';
  display: inline-block;
  width: 1.5em;
  height: 1.5em;
  flex-shrink: 0;
  flex-grow: 0;
  position: absolute;
  right: 0;
  border-radius: 0.25em;
  margin-right: 0.5em;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 55% 100%;
}
/* стили при наведении курсора на checkbox */
.custom-checkbox:not(:disabled):not(:checked) + label:hover::after {
  border-color: #b3d7ff;
}
/* стили для активного состояния чекбокса (при нажатии на него) */
.custom-checkbox:not(:disabled):active + label::after {
  border-color: #b3d7ff;
}
/* стили для чекбокса, находящегося в фокусе */
.custom-checkbox:focus + label::after {
}
/* стили для чекбокса, находящегося в фокусе и не находящегося в состоянии checked */
.custom-checkbox:focus:not(:checked) + label::after {
}
.custom-checkbox:checked + label::after {
  background-image: url("data:image/svg+xml,%3csvg width='10' height='10' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 26 20'%3e%3cpath fill='%23000' d='M24.4107 1.30299C25.2766 2.02718 25.3681 3.2892 24.6148 4.1218L11.8142 18.2718C10.8103 19.3815 9.06094 19.4991 7.9062 18.5344L0.902667 12.6839C0.0362917 11.9601 -0.0558157 10.6982 0.69694 9.86518C1.44969 9.0322 2.76226 8.94364 3.62864 9.66738L9.58691 14.6447L21.4789 1.49931C22.2321 0.666707 23.5447 0.578813 24.4107 1.30299z'/%3e%3c/svg%3e");
}
/* стили для чекбокса, находящегося в состоянии disabled */
.custom-checkbox:disabled + label::after {
  background-color: #e9ecef;
}
.employee-name-custom {
  cursor: pointer;
  width: 100%;
}
.popover-employee-email {
  position: relative;
  top: -2px;
  color: #7d7d91;
  width: 100%;
  font-size: 12px;
  line-height: 18px;
  margin-bottom: 0px;
}
.tags-custom-access {
  padding: 4px 6px 4px 4px;
  border-radius: 5px;
  margin: 2px 2px 2px 2px;
  font-size: 12px;
  float: left;
  position: relative;
  display: flex;
  background: #f4f5f7;
}
.tags-custom-access svg {
  position: relative;
  top: 3px;
  float: left;
  display: flex;
  font-size: 18px;
  width: 17px;
  height: 17px;
  margin-right: 5px;
  color: #9e9e9e;
}
.btn-close-popover
{
  margin-right: 5px;
  margin-left: 5px;
  font-size: 11px;
  display: none;
  position: absolute;
  left: -2px;
  width: 16px;
  height: 20px;
  top: 5px;
  color: #3F3F4O;
  -webkit-transition: all 0.2s ease-in;
  -moz-transition: all 0.2s ease-in;
  -o-transition: all 0.2s ease-in;
  transition: all 0.2s ease-in;
  background: #F4F5F7;
  animation-delay: -2s;
  opacity: 0;
  z-index: 9999;
  animation: ani 2.5s forwards;
}
.btn-close-popover svg
{
  width: 15px;
  height: 15px;
  left: 0;
  top: 0;
  padding: 2px;
}
</style>
