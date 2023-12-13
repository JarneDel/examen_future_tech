<template>
  <div
    class="m-auto w-1/2 mt-60 flex flex-col items-center justify-center gap-6"
  >
    <h1 class="text-3xl font-bold underline">Doolhof</h1>
    <p>
      Beweeg je hand naar boven ⬆️, beneden ⬇️, links ⬅️ en rechts ➡️ om het
      spel te besturen
    </p>
    <p>Test de bewegingen hier</p>
    <div ref="gyroContainer" class="w-48 h-48 relative">
      <div
        ref="gyro"
        class="w-full h-full bg-blue-50 rounded-md transition-transform"
      ></div>
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full"
      ></div>
      <p>{{ positionX }}</p>
      <p>{{ positionY }}</p>
      <button @click="">Calibrate</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useBle } from '../composables/useBle'

const { gyro } = useBle()

const positionX = ref(0)
const positionY = ref(0)

const gyroXZero = ref(0)
const gyroYZero = ref(0)

// run function to calculate position from acc data (reset position with space)
// use setInterval to run function every 100ms
// use onMounted and onUnmounted to start and stop the interval

const calculatePosition = () => {
  // position is calculated from the acc data, when holding the device still, the position should stay the same and should not go to 0
  // when the device is moved, the position should change accordingly
  // when the device is moved back to the original position, the position should go back to the original position
  // consider gyroXZero and gyroYZero as the original position

  positionX.value = gyro.value.x - gyroXZero.value
  positionY.value = gyro.value.y - gyroYZero.value
}

// function to calibrate the position
// use the current position as the new zero position
// use a button to call the function

const calibrate = () => {
  gyroXZero.value = gyro.value.x
  gyroYZero.value = gyro.value.y
}

// listen to space bar to calibrate the position
// use onMounted and onUnmounted to start and stop the event listener

onMounted(() => {
  setInterval(calculatePosition, 100)

  window.addEventListener('keydown', e => {
    if (e.code === 'Space') {
      calibrate()
    }
  })
})
</script>
