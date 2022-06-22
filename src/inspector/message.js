import store from '@/store/index.js'

// const NULL_MESSAGE_TYPE = 0
const ORIGIN_MESSAGE_TYPE = 1
const IGNORE_MESSAGE_TYPE = 2
const OVERDUE_MESSAGE_TYPE = 3
const BETWEEN_MESSAGE_TYPE = 4
const CALL_MESSAGE_TYPE = 5
const PERFOMER_DOESNT_HAVE_PHONE_NUMBER_MESSAGE_TYPE = 511
const SMS_MESSAGE_TYPE = 6
const BEFORE_DEADLINE_MESSAGE_TYPE = 7
const AFTER_DEADLINE_MESSAGE_TYPE = 8
const INFO_MESSAGE_TYPE = 9

function dateToLabelFormat (calendarDate) {
  const day = calendarDate.getDate()
  const month = calendarDate.toLocaleString('default', { month: 'short' })
  return day + ' ' + month
}

function pad2 (n) {
  return (n < 10 ? '0' : '') + n
}

function dateToTimeFormat (date) {
  const hours = pad2(date.getHours())
  const seconds = pad2(date.getSeconds())
  return hours + ':' + seconds
}

export function getInspectorMessage (type, task) {
  if (!task) {
    return 'Я не могу понять, что это за задача, такого не должно быть'
  }
  switch (type) {
    case INFO_MESSAGE_TYPE: return 'Задача поручена: ' + store?.state?.employees?.employees[task.uid_performer]?.name + ' ' + new Date(task.date_create).toLocaleString()
    case ORIGIN_MESSAGE_TYPE: return store?.state?.employees?.employees[task.uid_performer]?.name + ', вы согласны со сроком? Все будет готово до ' + dateToLabelFormat(new Date(task.customer_date_end)) + '? И до ' + dateToTimeFormat(new Date(task.customer_date_end)) + ' завершите задачу?'
    case IGNORE_MESSAGE_TYPE: return store?.state?.employees?.employees[task.uid_performer]?.name + ', вы не ответили после того как получили задачу от ' + store?.state?.employees?.employees[task.uid_customer]?.name + '. Пожалуйста напишите вопросы если есть, или нажмите:'
    case OVERDUE_MESSAGE_TYPE: return store?.state?.employees?.employees[task.uid_performer]?.name + ', вы просрочили задачу - напишите причину почему задача еще не выполнена и когда ожидать выполнения? А лучше свяжитесь с заказачиком и обсудите эту ситуацию'
    case BETWEEN_MESSAGE_TYPE: return store?.state?.employees?.employees[task.uid_performer]?.name + ', как идут дела? Пожалуйста, приложите промежуточные результаты.'
    case CALL_MESSAGE_TYPE: return 'Я позвонил исполнителю на номер ' + store?.state?.employees?.employees[task.uid_performer]?.phone.split(' ')[0] + '.'
    case PERFOMER_DOESNT_HAVE_PHONE_NUMBER_MESSAGE_TYPE: return 'Я уже хотел связаться с ' + store?.state?.employees?.employees[task.uid_performer]?.name + ', но в базе нет номера телефона исполнителя или что-то не так с данными timezone. Пожалуйста, добавьте номер телефона исполнителя.'
    case SMS_MESSAGE_TYPE: return 'Я отправил смс исполнителю на номер ' + store?.state?.employees?.employees[task.uid_performer]?.phone.split(' ')[0] + '.'
    case BEFORE_DEADLINE_MESSAGE_TYPE: return store?.state?.employees?.employees[task.uid_performer]?.name + ', вы завершили задачу в срок и получаете +15 баллов к вашей карме.'
    case AFTER_DEADLINE_MESSAGE_TYPE: return store?.state?.employees?.employees[task.uid_performer]?.name + ', вы просрочили задачу и ничего не написали даже после дедлайна, пожалуйста позвоните руководителю и обьясните причину. С вас снимается 15 баллов за такое грубое нарушение.'
  }
}
