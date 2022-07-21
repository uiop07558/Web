<template>
  <div :class="container">
    <div class="flex flex-row w-full text-dark px-[16px] mt-[22px] h-[32px] items-center">
      <hr class="block h-[32px] bg-neutral-300  mt-1 mb-1 rounded-[10px] w-[32px] mr-2">
      <hr class="block h-[15px] bg-neutral-200  mt-1 mb-1 rounded-[10px] w-[50%]">
    </div>

    <div class="flex flex-row w-full text-dark px-[16px] mt-[15px] items-center justify-center">
      <hr class="block h-[16px] bg-neutral-300  mt-1 mb-1 rounded-[5px] w-[15px] mr-[45px]">
      <hr class="block h-[16px] bg-neutral-400  mt-1 mb-1 rounded-[10px] w-[40%]">
      <hr class="block h-[16px] bg-neutral-300  mt-1 mb-1 rounded-[5px] w-[15px] ml-[45px]">
    </div>

    <div class="flex flex-row w-full text-dark px-[16px] mt-[12px] items-center justify-center">
      <hr class="block h-[195px] bg-[#E3E3E3]  mt-1 mb-1.5 rounded-[10px] w-[95%]">
    </div>

    <div class="flex flex-row w-full text-dark px-[16px] mt-[5px] items-center justify-start">
      <hr class="block h-[32px] bg-[#EAEAEA] ml-1 mt-1 rounded-[10px] w-[32px] mr-[10px]">
      <hr class="block h-[16px] bg-[#EAEAEA] mt-1 rounded-[10px] w-[40%]">
    </div>
    <div class="flex w-full text-dark px-[16px] items-center mt-[5px]">
      <div class="flex h-[40px] bg-white  mt-1 items-center rounded-[10px] w-[100%]">
        <hr class="block h-[32px] bg-[#EAEAEA] ml-1 mt-1 rounded-[10px] w-[32px] mr-[10px]">
        <hr class="block h-[16px] bg-[#EAEAEA] mt-1 rounded-[10px] w-[43%]">
      </div>
    </div>
    <div class="flex flex-row w-full text-dark px-[16px] mt-[5px] items-center justify-start">
      <hr class="block h-[32px] bg-[#EAEAEA] ml-1 mt-1 rounded-[10px] w-[32px] mr-[10px]">
      <hr class="block h-[16px] bg-[#EAEAEA] mt-1 rounded-[10px] w-[50%]">
    </div>
    <div class="flex flex-row w-full text-dark px-[16px] mt-[5px] items-center justify-start">
      <hr class="block h-[32px] bg-[#EAEAEA] ml-1 mt-1 rounded-[10px] w-[32px] mr-[10px]">
      <hr class="block h-[16px] bg-[#EAEAEA] mt-1 rounded-[10px] w-[35%]">
    </div>
    <div class="flex flex-row w-full text-dark px-[16px] mt-[5px] items-center justify-start">
      <hr class="block h-[32px] bg-[#EAEAEA] ml-1 mt-1 rounded-[10px] w-[32px] mr-[10px]">
      <hr class="block h-[16px] bg-[#EAEAEA] mt-1 rounded-[10px] w-[25%]">
    </div>
    <div class="flex flex-row w-full text-dark px-[16px] mt-[5px] items-center justify-start">
      <hr class="block h-[32px] bg-[#EAEAEA] ml-1 mt-1 rounded-[10px] w-[32px] mr-[10px]">
      <hr class="block h-[16px] bg-[#EAEAEA] mt-1 rounded-[10px] w-[60%]">
    </div>
    <div class="flex flex-row w-full text-dark px-[16px] mt-[5px] items-center justify-start">
      <hr class="block h-[32px] bg-[#EAEAEA] ml-1 mt-1 rounded-[10px] w-[32px] mr-[10px]">
      <hr class="block h-[16px] bg-[#EAEAEA] mt-1 rounded-[10px] w-[50%]">
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    text: 'block h-[10px] bg-neutral-300  mt-1 mb-1.5 rounded-[10px]',
    nick: 'block h-[10px] bg-neutral-300  mt-4  rounded-[10px]',
    tags: 'mt-2 rounded-[4px] mr-1 h-[30px] bg-gray-100',
    container: 'animate-pulse grid',
    messageOut: 'min-w-[70%] max-w-[70%] mt-2 flex flex-col bg-[#F4F5F7] rounded-tl-[12px] rounded-tr-[12px] rounded-bl-[12px] rounded-br-[0px] float-right',
    messageIn: 'min-w-[70%] max-w-[70%] mt-2 flex flex-col bg-[#FCEBEB] rounded-tl-[12px] rounded-tr-[12px] rounded-br-[12px] rounded-bl-[0px] float-left'
  })
}
</script>
