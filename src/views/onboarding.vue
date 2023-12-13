<template>
  <div
    class="m-auto w-1/2 h-screen flex flex-col items-center justify-center gap-6"
  >
    <RouterLink to="/" class="w-full">
      <button
        class="w-fit px-4 py-2 bg-black rounded-md flex items-center text-white"
      >
        <ArrowLeft /> Back
      </button>
    </RouterLink>
    <h1 class="text-3xl font-bold underline">Besturing</h1>
    <p class="w-2/3">
      Draai je hand naar voor ⬆️, achter ⬇️, links ⬅️ en rechts ➡️ om het spel
      te besturen
    </p>
    <p>Test de bewegingen hier</p>
    <div ref="gyroContainer" class="w-48 h-48 relative">
      <div
        ref="gyro"
        class="w-full h-full bg-blue-50 rounded-md transition-transform"
      ></div>
      <div
        ref="gyroBall"
        class="absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full"
        :style="`left: ${translateX}px; top: ${translateY}px`"
      ></div>
      <!-- <button @click="">Calibrate</button> -->
      <RouterLink :to="gameUrl" class="w-full">
        <button class="w-full bg-blue-500 rounded-md py-2 text-white mt-12">
          Speel
        </button>
      </RouterLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useBle } from '../composables/useBle'
import { ArrowLeft } from 'lucide-vue-next'

const { gyro } = useBle()

const positionX = ref(0)
const positionZ = ref(0)

const gyroXZero = ref(0)
const gyroZZero = ref(0)

const translateX = ref('left-1/2')
const translateY = ref('top-1/2')

const gameUrl = ref('')

// run function to calculate position from acc data (reset position with space)
// use setInterval to run function every 100ms
// use onMounted and onUnmounted to start and stop the interval

const calculatePosition = () => {
  // position is calculated from the acc data, when holding the device still, the position should stay the same and should not go to 0
  // when the device is moved, the position should change accordingly
  // when the device is moved back to the original position, the position should go back to the original position
  // consider gyroXZero and gyroYZero as the original position
  // 2 decimals

  if (gyro.value) {
    positionX.value = gyro.value.x - gyroXZero.value
    positionZ.value = gyro.value.y - gyroZZero.value
  }

  // move ref gyroBall to the calculated position
  // use transform: translate(x, y) to move the ball

  // map value from -1 to 1 to 0 to 192

  translateX.value = ((positionX.value + 1) * 96).toFixed(0).toString()
  translateY.value = ((positionZ.value + 1) * 96).toFixed(0).toString()
  translateY
}

// function to calibrate the position
// use the current position as the new zero position

const calibrate = () => {
  gyroXZero.value = gyro.value.x
  gyroZZero.value = gyro.value.y
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

  // get url value from the url
  // use onMounted and onUnmounted to start and stop the event listener
  const url = window.location.href
  const urlParams = new URL(url)
  gameUrl.value = urlParams.searchParams.get('game')!
  console.log(gameUrl.value)
})
</script>
