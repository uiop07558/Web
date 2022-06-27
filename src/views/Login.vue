<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import store from '@/store'
import { mdiEmailOutline, mdiEyeOffOutline, mdiAccountOutline, mdiArrowRight, mdiCheckBold, mdiChevronLeft } from '@mdi/js'
import FullScreenSection from '@/components/FullScreenSection.vue'
import CardComponent from '@/components/CardComponent.vue'
import Field from '@/components/Field.vue'
import Icon from '@/components/Icon.vue'
import Control from '@/components/Control.vue'
import JbButton from '@/components/JbButton.vue'
// import JbButtons from '@/components/JbButtons.vue'

import { AUTH_REQUEST, AUTH_REGISTER } from '@/store/actions/auth'

const form = reactive({
  email: '',
  password: '',
  username: '',
  showError: false,
  errorMessage: '',
  isEmailValid: false,
  emailMdi: mdiEmailOutline,
  emailIconClass: '',
  emailControlDisabled: false,
  startScreenText: 'ЛидерТаск',
  showCheckButton: true,
  showBackButton: false
})

const showValues = reactive({
  showRegisterInputsValue: false,
  showLoginInputsValue: false
})

const router = useRouter()

const submit = () => {
  if (showValues.showLoginInputsValue) {
    login()
  } else if (showValues.showRegisterInputsValue && form.password.length > 7 && form.email.length > 2) {
    register()
  }
}

const getOSName = () => {
  let detectOS = 'web'

  if (navigator.appVersion.indexOf('Mac') !== -1) {
    detectOS = 'mac'
  } else if (navigator.appVersion.indexOf('Win') !== -1) {
    detectOS = 'windows'
  } else if (navigator.appVersion.indexOf('Android') !== -1) {
    detectOS = 'android'
  } else if (navigator.appVersion.indexOf('iPhone') !== -1) {
    detectOS = 'ios'
  }

  return detectOS
}

const isMobile = () => {
  return navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)
}

const getSysType = () => {
  return isMobile() ? 'mobile' : 'desktop'
}

const login = () => {
  const uri = process.env.VUE_APP_LEADERTASK_API + 'api/v1/users/auth?login=' + form.email + '&password=' + encodeURIComponent(form.password) + '&system=' + getOSName() + '&type_device=' + getSysType()
  store.dispatch(AUTH_REQUEST, uri)
    .then(() => {
      router.push('/')
    })
    .catch(() => {
      form.showError = true
      form.errorMessage = 'Неверный email пользователя или пароль'
    })
}

const register = () => {
  if (!form.password || !form.username) { return }
  const data = {
    email: form.email,
    password: form.password,
    name: form.username,
    system: 'web',
    language: 'russian',
    type_device: 'mobile'
  }
  store.dispatch(AUTH_REGISTER, data)
    .then(() => {
      router.push('/')
    })
    .catch(() => {
      form.showError = true
      form.errorMessage = 'Unknown error'
    })
}

const getBack = () => {
  hideLoginInputs()
  hideRegisterInputs()
  form.emailControlDisabled = false
  form.email = ''
  form.password = ''
  form.username = ''
  form.startScreenText = 'ЛидерТаск'
  form.emailMdi = mdiEmailOutline
  form.emailIconClass = ''
  form.showCheckButton = true
  form.showBackButton = false
  form.showError = false
  form.errorMessage = ''
}

const hideLoginInputs = () => {
  showValues.showLoginInputsValue = false
}

const showLoginInputs = () => {
  showValues.showLoginInputsValue = true
  hideRegisterInputs()
}

const hideRegisterInputs = () => {
  showValues.showRegisterInputsValue = false
}

const showRegisterInputs = () => {
  showValues.showRegisterInputsValue = true
  hideLoginInputs()
}

const validateEmail = () => {
  if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(form.email)) {
    return true
  }
  return false
}

const checkEmailExistense = () => {
  if (form.email) {
    if (validateEmail()) {
      const uri = process.env.VUE_APP_LEADERTASK_API + 'api/v1/users/exists?email=' + form.email
      axios.get(uri)
        .then(() => {
          showLoginInputs()
          form.emailMdi = mdiCheckBold
          form.startScreenText = 'Войти в ЛидерТаск'
          form.emailIconClass = 'text-lime-500'
          form.emailControlDisabled = true
          form.showCheckButton = false
          form.showBackButton = true
        })
        .catch(() => {
          showRegisterInputs()
          form.emailMdi = mdiCheckBold
          form.startScreenText = 'Создать аккаунт'
          form.emailIconClass = 'text-lime-500'
          form.emailControlDisabled = true
          form.showCheckButton = false
          form.showBackButton = true
        })
    }
  }
}
</script>

<template>
  <full-screen-section
    v-slot="{ cardClass, cardRounded }"
    bg="leadertask"
  >
    <img
      src="https://www.leadertask.ru/templates/default/img/logo.svg"
      class="mb-10"
    >
    <card-component
      :class="cardClass"
      :rounded="cardRounded"
      form
      @submit.prevent="submit"
    >
      <icon
        v-if="form.showBackButton"
        :path="mdiChevronLeft"
        class="cursor-pointer"
        size="24"
        @click="getBack"
      />
      <p class="pb-4 pt-5 text-center text-2xl font-bold dark:text-white">
        {{ form.startScreenText }}
      </p>
      <field>
        <control
          v-model="form.email"
          :icon="form.emailMdi"
          name="email"
          :icon-class="form.emailIconClass"
          placeholder="Email"
          autocomplete="email"
          type="email"
          required
          :disabled="form.emailControlDisabled"
          @blur="checkEmailExistense"
          @keyup.enter="checkEmailExistense"
        />
      </field>
      <jb-button
        v-if="form.showCheckButton"
        class="w-full rounded-lg text-sm"
        color="login"
        :icon="mdiArrowRight"
        label="Продолжить с Email"
        @click="checkEmailExistense"
      />

      <transition-group name="slide-fade">
        <div v-if="showValues.showLoginInputsValue">
          <field>
            <control
              v-model="form.password"
              :icon="mdiEyeOffOutline"
              type="password"
              name="password"
              autocomplete="current-password"
              placeholder="Пароль"
              :valid="form.password.length > 7"
            />
          </field>
          <p
            v-if="form.showError"
            class="text-red-500 text-xs pb-3"
          >
            {{ form.errorMessage }}
          </p>
          <jb-button
            type="submit"
            class="w-full rounded-lg text-sm"
            color="login"
            :icon="mdiArrowRight"
            label="Войти"
          />
          <a
            href="https://www.leadertask.ru/user?t=passrecovery"
            class="text-xs mt-5 text-blue-500 underline decoration-1"
            target="_blank"
          >
            Забыли пароль?
          </a>
        </div>
      </transition-group>

      <transition-group name="slide-fade">
        <div v-if="showValues.showRegisterInputsValue">
          <field
            help="Пароль (не менее 8 символов)"
            :max-count="8"
            :actual-count="form.password.length"
          >
            <control
              v-model="form.password"
              :icon="mdiEyeOffOutline"
              type="password"
              name="password"
              placeholder="Пароль"
              autocomplete="current-password"
              :valid="form.password.length > 7"
            />
          </field>

          <field
            help="Введите ваше имя"
            :max-count="3"
            :actual-count="form.username.length"
          >
            <control
              v-model="form.username"
              type="text"
              :icon="mdiAccountOutline"
              name="username"
              autocomplete="username"
              placeholder="Имя пользователя"
              :valid="form.username.length > 2"
            />
          </field>

          <jb-button
            type="submit"
            color="login"
            class="w-full rounded-lg text-sm"
            :icon="mdiArrowRight"
            label="Создать аккаунт"
          />
        </div>
      </transition-group>
    </card-component>
  </full-screen-section>
</template>

<style>
.error-message {
  color: #8D021F;
  font-size: 14px;
}

.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(45px);
  opacity: 0;
}
</style>
