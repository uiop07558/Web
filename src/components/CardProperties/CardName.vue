<script>
export default {
  props: {
    cardName: String,
    canEdit: Boolean
  },
  emits: ['changeName']
}
</script>
<template>
  <div
    v-linkified:options="{ className: 'text-blue-600', tagName: 'a' }"
    class="form-control my-[25px] mx-[-15px]"
    style="font-weight: bold; font-size: 18px"
    :contenteditable="canEdit"
    @blur="$emit('changeName', $event)"
    v-html="cardName?.replaceAll('\n','<br/>')"
  />
</template>
