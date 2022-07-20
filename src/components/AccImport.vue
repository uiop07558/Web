<script>
export default {
  data () {
    return {
      a: ''
    }
  }
}
</script>
<template>
  <form class="px-5">
    <div class="my-2" />
  </form>
</template>
<style scoped>
/* для элемента input c type="checkbox" */
.custom-checkbox-orange {
  position: absolute;
  z-index: -1;
  opacity: 0;
}

/* для элемента label, связанного с .custom-checkbox */
.custom-checkbox-orange + label {
  display: inline-flex;
  align-items: center;
  user-select: none;
}

/* создание в label псевдоэлемента before со следующими стилями */
.custom-checkbox-orange + label::before {
  content: '';
  display: inline-block;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  flex-grow: 0;
  border: 1.63582px solid rgba(0, 0, 0, 0.15);
  border-radius: 0.25em;
  margin-right: 0.5em;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 55% 100%;
}

/* стили при наведении курсора на checkbox */
.custom-checkbox-orange:not(:disabled):not(:checked) + label:hover::before {
  border-color: gray;
}

/* стили для активного чекбокса (при нажатии на него) */
.custom-checkbox-orange:not(:disabled):active + label::before {
  border-color: gray;
}

/* стили для чекбокса, находящегося в фокусе */
.custom-checkbox-orange:focus + label::before {
}

/* стили для чекбокса, находящегося в фокусе и не находящегося в состоянии checked */
.custom-checkbox-orange:focus:not(:checked) + label::before {
  border-color: gray;
}

/* стили для чекбокса, находящегося в состоянии checked */
.custom-checkbox-orange:checked + label::before {
  background-color: rgb(251 146 60);
  background-image: url("data:image/svg+xml,%3csvg width='10' height='10' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 26 20'%3e%3cpath fill='%23fff' d='M24.4107 1.30299C25.2766 2.02718 25.3681 3.2892 24.6148 4.1218L11.8142 18.2718C10.8103 19.3815 9.06094 19.4991 7.9062 18.5344L0.902667 12.6839C0.0362917 11.9601 -0.0558157 10.6982 0.69694 9.86518C1.44969 9.0322 2.76226 8.94364 3.62864 9.66738L9.58691 14.6447L21.4789 1.49931C22.2321 0.666707 23.5447 0.578813 24.4107 1.30299z'/%3e%3c/svg%3e");
  border: 1px solid #ff9123;
}

/* стили для чекбокса, находящегося в состоянии disabled */
.custom-checkbox-orange:disabled + label::before {
  background-color: #e9ecef;
}
.custom-select {
}
/* remove the original arrow */
.custom-select {
  font-size: 14px;
  border: 1px solid #ccc;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  height: 40px;
  color:#606061;
  background: transparent
    url('http://cdn1.iconfinder.com/data/icons/cc_mono_icon_set/blacks/16x16/br_down.png')
    no-repeat 130px center;
  background-size: 8%;
}
/* CAUTION: IE hackery ahead */
.custom-select::-ms-expand {
  display: none; /* remove default arrow on ie10 and ie11 */
}

/* target Internet Explorer 9 to undo the custom arrow */
@media screen and (min-width: 0\0) {
  .custom-select {
    background: none\9;
    padding: 5px\9;
  }
}
</style>
