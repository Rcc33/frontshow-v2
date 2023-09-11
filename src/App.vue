<template>
  <div id="app" class="container">
    <router-view />
  </div>
</template>

<script>
document.documentElement.style.fontFamily = 'Helvetica, Tahoma, Arial, "Microsoft YaHei", "Hiragino Sans GB","WenQuanYi Micro Hei", sans-serif'
document.documentElement.style.fontSize = window.innerHeight / 60 + 'px'
function placeholderPic () {
  document.documentElement.style.fontSize = window.innerHeight / 60 + 'px' // 同上
}
placeholderPic()
window.onresize = function () {
  placeholderPic()
}
export default {
  name: 'App',
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style lang="scss">
body {
  margin: 0;
}
.container {
  width: 100%;
  height: 100%;
}
</style>
