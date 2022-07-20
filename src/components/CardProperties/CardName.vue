<script setup>
defineEmits(['changeName'])
const props = defineProps({
  cardName: String,
  canEdit: Boolean
})
</script>
<template>
  <div
    v-linkified:options="{ className: 'text-blue-600', tagName: 'a' }"
    class="form-control my-[25px] mx-[-15px]"
    style="font-weight: bold; font-size: 18px"
    :contenteditable="props.canEdit"
    @blur="$emit('changeName', $event)"
    v-html="props.cardName?.replaceAll('\n','<br/>')"
  />
</template>
