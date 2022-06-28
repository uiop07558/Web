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
    class="text-[18px] font-[700] my-[25px] text-[#424242]"
    :contenteditable="props.canEdit"
    @blur="$emit('changeName', $event)"
    v-html="props.cardName?.replaceAll('\n','<br/>')"
  />
</template>
