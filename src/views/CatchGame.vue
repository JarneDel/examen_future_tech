<!-- CatchGame.vue -->
<template>
  <button
    @click="activate"
    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
  >
    Connect to the ball
  </button>

  <div class="grid grid-cols-3 gap-4 mt-4">
    <div v-for="(value, key) in data.acc" :key="key">
      <p>acc</p>
      <h2 class="text-xl font-bold">{{ key }}</h2>
      <p>{{ Math.round(value * 100) / 100 }}</p>
    </div>
    <div v-for="(value, key) in data.gyro" :key="key">
      <p>gyro</p>
      <h2 class="text-xl font-bold">{{ key }}</h2>
      <p>{{ Math.round(value * 100) / 100 }}</p>
    </div>
  </div>

  <div class="mt-4">
    <h2 class="text-xl font-bold">Pressure:</h2>
    <p>{{ Math.round(data.pressure * 100) / 100 }}</p>
  </div>

  <!-- Make a grid sysytem for a game -->
  <div class="">
    <div v-for="(row, rowIndex) in grid" :key="rowIndex" class="flex">
      <div
        v-for="(cell, colIndex) in row"
        :key="colIndex"
        class="w-10 h-10 bg-gray-300 border border-gray-400 flex justify-center items-center"
      >
        <div
          v-if="ballPosition.row === rowIndex && ballPosition.col === colIndex"
          class="w-4 h-4 bg-red-500 rounded-full"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useBle } from '../composables/useBle'

const { enableNotifications, listen } = useBle()

const grid = ref([
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
])

const ballPosition = ref({ row: 2, col: 2 })

const data = ref({
  gyro: {
    x: 0,
    y: 0,
    z: 0,
  },
  acc: {
    x: 0,
    y: 0,
    z: 0,
  },
  mag: {
    x: 0,
    y: 0,
    z: 0,
  },
  pressure: 0,
})

const activate = async () => {
  enableNotifications().then(() => {
    listen(
      (gyro, acc, mag) => {
        data.value = {
          ...data.value,
          gyro,
          acc,
          mag,
        }
      },
      pressure => {
        data.value = {
          ...data.value,
          pressure,
        }
      },
    )
  })
}

const moveBall = (direction: string) => {
  switch (direction) {
    case 'up':
      if (ballPosition.value.row > 0) {
        ballPosition.value.row--
      }
      break
    case 'down':
      if (ballPosition.value.row < grid.value.length - 1) {
        ballPosition.value.row++
      }
      break
    case 'left':
      if (ballPosition.value.col > 0) {
        ballPosition.value.col--
      }
      break
    case 'right':
      if (ballPosition.value.col < grid.value[0].length - 1) {
        ballPosition.value.col++
      }
      break
  }
}

watch(data, () => {
  //   console.log(data.value)
  const { x, y } = data.value.acc

  // add a threshold
  

  if (y > 0.5) moveBall('left')
  else if (y < -0.5) moveBall('right')
  else if (x > 0.5) moveBall('down')
  else if (x < -0.5) moveBall('up')
})
</script>
