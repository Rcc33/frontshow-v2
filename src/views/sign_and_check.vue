<template>
  <div class="state-container">
    <el-col class="rol_left">
      <checkInEvent class="check_in_panel" />
      <!-- <canvas ref="canvas" class="canvas"></canvas> -->
    </el-col>
  </div>
</template>

<script>
import checkInEvent from './check_in_event'
export default {
  name: 'signAndCheck',
  components: {
    checkInEvent
  },
  data () {
    return {
    }
  },
  methods: {
  },
  destroyed () {
  },
  mounted () {
  },
  async created () {
  }
}
</script>

<style>
.state-container {
  display: flex;
  flex-direction: row;
  height: 99.5%;
  width: 99.5%;
  overflow: hidden;
  background-color: transparent;
  border-radius: 10px;
  border: 2px #2d8cf7 solid;
  padding: 1px;
  box-sizing: border-box;
  background-color: transparent;
}

.rol_left {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: transparent;
  border-radius: 10px;
  border: 1px #81b3ec solid;
  box-sizing: border-box;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1px;
}
</style>
