<template>
  <div class="animate-pulse flex  mt-0.5">
    <div class="flex-col w-full">
      <div :class="['h-22', classes, classesDark]" >
        <div class="flex items-center">
            <div :class=checkbox />
          <div class="w-full">
            <hr :class=text />
            <hr :class="[text,'w-[60%]']" />
          </div>
        </div>
        <div class="flex">
        <hr :class="[tags,'bg-gray-100']"/>
        <hr :class="[tags,'bg-gray-100']"/>
        </div>
      </div>
      <div :class="['h-15', classes, classesDark]" >
        <div class="flex items-center">
          <div :class=checkbox />
          <div class="w-full">
            <hr :class="[text,'w-[70%]']" />
          </div>
        </div>
        <div class="flex">
          <hr :class="[tags,'bg-gray-100']"/>
          <hr :class="[tags,'bg-red-300']"/>
        </div>
      </div>
      <div :class="['h-15', classes, classesDark]" >
        <div class="flex items-center">
          <div :class=checkbox />
          <div class="w-full">
            <hr :class="[text,'w-[45%]']" />
          </div>
        </div>
        <div class="flex">
          <hr :class="[tags,'bg-gray-100']"/>
        </div>
      </div>
      <div :class="['h-32', classes, classesDark]" >
        <div class="flex items-center">
          <div :class=checkbox />
          <div class="w-full">
            <hr :class="[text,'w-full']" />
            <hr :class="[text,'w-full']" />
            <hr :class="[text,'w-full']" />
            <hr :class="[text,'w-[60%]']" />
          </div>
        </div>
        <div class="flex">
          <hr :class="[tags,'bg-gray-100']"/>
          <hr :class="[tags,'bg-gray-100']"/>
          <hr :class="[tags,'bg-red-300']"/>
        </div>
      </div>
      <div :class="['h-22', classes, classesDark]" >
        <div class="flex items-center">
          <div :class=checkbox />
          <div class="w-full">
            <hr :class=text />
            <hr :class="[text,'w-[90%]']" />
          </div>
        </div>
        <div class="flex">
          <hr :class="[tags,'bg-gray-100']"/>
          <hr :class="[tags,'bg-red-300']"/>
        </div>
      </div>
      <div :class="['h-15', classes, classesDark]" >
      <div class="flex items-center">
        <div :class=checkbox />
        <div class="w-full">
          <hr :class="[text,'w-[50%]']" />
        </div>
      </div>
      <div class="flex">
        <hr :class="[tags,'bg-gray-100']"/>
        <hr :class="[tags,'bg-gray-100']"/>
        <hr :class="[tags,'bg-red-300']"/>
      </div>
      </div>
      <div :class="['h-28', classes, classesDark]" >
        <div class="flex items-center">
          <div :class=checkbox />
          <div class="w-full">
            <hr :class="[text,'w-full']" />
            <hr :class="[text,'w-full']" />
            <hr :class="[text,'w-[50%]']" />
          </div>
        </div>
        <div class="flex">
          <hr :class="[tags,'bg-gray-100']"/>
        </div>
      </div>
      <div :class="['h-22', classes, classesDark]" >
        <div class="flex items-center">
          <div :class=checkbox />
          <div class="w-full">
            <hr :class=text />
            <hr :class="[text,'w-[20%]']" />
          </div>
        </div>
        <div class="flex">
          <hr :class="[tags,'bg-gray-100']"/>
          <hr :class="[tags,'bg-red-300']"/>
        </div>
      </div>
      <div :class="['h-15', classes, classesDark]" >
        <div class="flex items-center">
          <div :class=checkbox />
          <div class="w-full">
            <hr :class="[text,'w-[60%]']" />
          </div>
        </div>
        <div class="flex">
          <hr :class="[tags,'bg-gray-100']"/>
          <hr :class="[tags,'bg-gray-100']"/>
          <hr :class="[tags,'bg-red-300']"/>
        </div>
      </div>
      <div :class="['h-22', classes, classesDark]" >
      <div class="flex items-center">
        <div :class=checkbox />
        <div class="w-full">
          <hr :class=text />
          <hr :class="[text,'w-[10%]']" />
        </div>
      </div>
      <div class="flex">
        <hr :class="[tags,'bg-gray-100']"/>
        <hr :class="[tags,'bg-red-300']"/>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    classes: 'animate-pulse bg-white my-1 border border-gray-300 rounded-lg pl-[31px] pr-[6px] py-[11px] mb-[4px]',
    classesDark: 'dark:bg-slate-900 dark:border-gray-700',
    text: 'block h-[10px] bg-neutral-300  mt-1 mb-1.5 rounded-[10px]',
    checkbox: 'block mr-[10px] flex-none border-2 border-gray-300 rounded-md bg-white h-[20px] w-[20px] leading-[20px]',
    tags: 'mt-2 w-[100px] rounded-[4px] mr-1  h-[22px]'
  })
}
</script>
