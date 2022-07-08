<template>
  <div class="max-h-full h-full flex items-start overflow-y-hidden overflow-x-auto scroll-style animate-pulse flex pr-4 mt-0.5">
    <div :class="classesOuter">
      <div :class="[classes, 'h-[150px]','mt-[15%]']" />
      <div :class="[classes, 'h-[120px]']" />
      <div :class="[classes, 'h-[240px]']" />
      <div :class="[classes, 'h-[200px]']" />
    </div>
    <div :class="classesOuter">
      <div :class="[classes, 'h-[240px]','mt-[15%]']" />
      <div :class="[classes, 'h-[150px]']" />
      <div :class="[classes, 'h-[120px]']" />
      <div :class="[classes, 'h-[200px]']" />
    </div>
    <div :class="classesOuter">
      <div :class="[classes, 'h-[200px]','mt-[15%]']" />
      <div :class="[classes, 'h-[140px]']" />
      <div :class="[classes, 'h-[220px]']" />
      <div :class="[classes, 'h-[150px]']"/>
    </div>
    <div :class="classesOuter">
      <br>
      <div :class="[classes, 'h-[100px]','mt-[15%]']"/>
      <div :class="[classes, 'h-[240px]']"/>
      <div :class="[classes, 'h-[120px]']" />
      <div :class="[classes, 'h-[250px]']" />
    </div>
    <div :class="classesOuter">
      <div  :class="[classes, 'h-[240px]','mt-[15%]']" />
      <div  :class="[classes, 'h-[140px]']" />
      <div  :class="[classes, 'h-[130px]']" />
      <div :class="[classes, 'h-[200px]']" />
    </div>
    <div :class="classesOuter">
      <div :class="[classes, 'h-[170px]','mt-[15%]']" />
      <div :class="[classes, 'h-[200px]']" />
      <div :class="[classes, 'h-[220px]']" />
      <div :class="[classes, 'h-[120px]']" />
    </div>
    <div :class="classesOuter">
      <div :class="[classes, 'h-[100px]','mt-[15%]']" />
      <div :class="[classes, 'h-[170px]']"/>
      <div :class="[classes, 'h-[200px]']" />
      <div :class="[classes, 'h-[160px]']" />
    </div>
    <div :class="classesOuter">
      <div :class="[classes, 'h-[200px]','mt-[15%]']" />
      <div :class="[classes, 'h-[180px]']" />
      <div :class="[classes, 'h-[190px]']" />
      <div :class="[classes, 'h-[140px]']" />
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    classes: 'animate-pulse bg-white rounded-[10px] border px-[18px] py-[20px] border-gray-300 mt-2',
    classesOuter: 'max-h-full flex flex-col flex-none bg-white rounded-xl px-3 py-4 w-[280px] mr-[10px] stage-column'
  })
}
</script>
