<script>
import { GETFILES } from '@/store/actions/taskfiles'
export default {
  data () {
    return {
      intervalId: 0,
      text: ('Идет загрузка файла. Пожалуйста, подождите'),
      dots: ('.')
    }
  },
  mounted () {
  // Start dots blinking
    this.intervalId = setInterval(() => {
      this.dots.value.length < 3 ? this.dots.value += '.' : this.dots.value = '.'
    }, 500)

    const type = this.$router.currentRoute.value.query.type
    const format = this.$router.currentRoute.value.query.format

    this.$store.dispatch(GETFILES, this.$router.currentRoute.value.params.id).then((resp) => {
      const fileBlob = new Blob([resp.data], { type: type + '/' + format })
      const urlCreator = window.URL || window.webkitURL
      const fileURL = urlCreator.createObjectURL(fileBlob)
      this.dots.value = '.'
      window.location.href = fileURL
      clearInterval(this.intervalId)
    }).catch((err) => {
      this.text.value = err
      this.dots.value = '.'
      clearInterval(this.intervalId)
    })
  }
}

</script>
<template>
  {{ fileHasBeenLoaded }}
  <p class="text-[40px] font-[700]">
    {{ text }} {{ dots }}
  </p>
</template>
