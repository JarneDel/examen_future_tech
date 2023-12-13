<template>
  <div
    v-if="state == 'connected'"
    class="m-auto w-1/2 right-height flex flex-col items-center justify-start pt-24 gap-6"
  >
    <RouterLink to="/" class="w-full">
      <button
        class="w-fit px-4 py-2 bg-black rounded-md flex items-center text-white"
      >
        <ArrowLeft />
        Back
      </button>
    </RouterLink>
    <h1 class="text-3xl font-bold underline">Besturing</h1>
    <div class="flex flex-col items-center" v-if="calibrationStep == 0">
      <h2>Draai je hand zo ver mogelijk naar links ⬅️</h2>
      <div class="mt-6 relative w-48">
        <div class="w-full h-2 bg-blue-100 rounded-full"></div>
        <div
          class="w-4 h-4 bg-green-500 absolute -top-1 rounded-full"
          :style="`left: ${biggestLeft}px;`"
        ></div>
        <div
          class="w-4 h-4 bg-blue-500 absolute -top-1 rounded-full"
          :style="`left: ${translateX}px;`"
        ></div>
      </div>
      <button
        class="w-full bg-blue-500 rounded-md py-2 text-white mt-12"
        @click="calibrationStep++"
      >
        Volgende
      </button>
    </div>
    <div class="flex flex-col items-center" v-if="calibrationStep == 1">
      <h2>Draai je hand zo ver mogelijk naar rechts ➡️</h2>
      <div class="mt-6 relative w-48">
        <div class="w-full h-2 bg-blue-100 rounded-full"></div>
        <div
          class="w-4 h-4 bg-green-500 absolute -top-1 rounded-full"
          :style="`left: ${biggestRight}px;`"
        ></div>
        <div
          class="w-4 h-4 bg-blue-500 absolute -top-1 rounded-full"
          :style="`left: ${translateX}px;`"
        ></div>
      </div>
      <button
        class="w-full bg-blue-500 rounded-md py-2 text-white mt-12"
        @click="calibrationStep++"
      >
        Volgende
      </button>
    </div>
    <div class="flex flex-col items-center" v-if="calibrationStep == 2">
      <h2>Draai je hand zo ver mogelijk naar boven ⬆️</h2>
      <div class="mt-6 relative h-48">
        <div class="h-full w-2 bg-blue-100 rounded-full"></div>
        <div
          class="w-4 h-4 bg-green-500 absolute -left-1 rounded-full"
          :style="`top: ${biggestUp}px;`"
        ></div>
        <div
          class="w-4 h-4 bg-blue-500 absolute -left-1 rounded-full"
          :style="`top: ${translateY}px;`"
        ></div>
      </div>
      <button
        class="w-full bg-blue-500 rounded-md py-2 text-white mt-12"
        @click="calibrationStep++"
      >
        Volgende
      </button>
    </div>
    <div class="flex flex-col items-center" v-if="calibrationStep == 3">
      <h2>Draai je hand zo ver mogelijk naar beneden ⬇️</h2>
      <div class="mt-6 relative h-48">
        <div class="h-full w-2 bg-blue-100 rounded-full"></div>
        <div
          class="w-4 h-4 bg-green-500 absolute -left-1 rounded-full"
          :style="`top: ${biggestDown}px;`"
        ></div>
        <div
          class="w-4 h-4 bg-blue-500 absolute -left-1 rounded-full"
          :style="`top: ${translateY}px;`"
        ></div>
      </div>
      <button
        class="w-full bg-blue-500 rounded-md py-2 text-white mt-12"
        @click="calibrationStep++"
      >
        Volgende
      </button>
    </div>
    <div class="flex flex-col items-center gap-6" v-if="calibrationStep == 4">
      <p class="w-2/3">
        Draai je hand naar voor ⬆️, achter ⬇️, links ⬅️ en rechts ➡️ om het spel
        te besturen
      </p>
      <p>Test de bewegingen hier</p>
      <div ref="gyroContainer" class="w-48 h-48 relative">
        <div
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
  </div>
  <div
    v-else
    class="right-height flex items-center justify-center flex-col gap-4"
  >
    <p class="error">Please connect to the squeezie first</p>
    <button @click="turnOn" class="connectbutton">connect</button>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useBle } from '../composables/useBle'
import { ArrowLeft } from 'lucide-vue-next'

const { gyro, state, enableNotifications, listen } = useBle()

const turnOn = async () => {
  enableNotifications().then(() => {
    listen()
  })
}

const positionX = ref(0)
const positionZ = ref(0)

const gyroXZero = ref(0)
const gyroZZero = ref(0)

const translateX = ref('0')
const translateY = ref('0')

const gameUrl = ref('')

const calibrationStep = ref(0)

const biggestLeft = ref('96')
const biggestRight = ref('96')
const biggestUp = ref('96')
const biggestDown = ref('96')

const calculatePosition = () => {
  if (gyro.value) {
    positionX.value = gyro.value.x - gyroXZero.value
    positionZ.value = gyro.value.y - gyroZZero.value
  }

  // map value from -1 to 1 to 0 to 192
  translateX.value = ((positionX.value + 1) * 96).toFixed(0).toString()
  translateY.value = ((positionZ.value + 1) * 96).toFixed(0).toString()

  if (parseInt(translateX.value) < parseInt(biggestLeft.value)) {
    biggestLeft.value = translateX.value
    console.log('left', biggestLeft.value)
  }

  if (parseInt(translateX.value) > parseInt(biggestRight.value)) {
    biggestRight.value = translateX.value
    console.log('right', biggestRight.value)
  }

  if (parseInt(translateY.value) < parseInt(biggestUp.value)) {
    biggestUp.value = translateY.value
    console.log('up', biggestUp.value)
  }

  if (parseInt(translateY.value) > parseInt(biggestDown.value)) {
    biggestDown.value = translateY.value
    console.log('down', biggestDown.value)
  }
}

// function to calibrate the position
// use the current position as the new zero position
const calibrate = () => {
  gyroXZero.value = gyro.value.x
  gyroZZero.value = gyro.value.y
}

onMounted(() => {
  setInterval(calculatePosition, 100)

  // listen to space bar to calibrate the position
  window.addEventListener('keydown', e => {
    if (e.code === 'Space') {
      calibrate()
    }
  })

  // get url value from the url params
  const url = window.location.href
  const urlParams = new URL(url)
  gameUrl.value = urlParams.searchParams.get('game')!
  console.log(gameUrl.value)
})
</script>

<style scoped>
.right-height {
  height: calc(100vh - 106px);
}
.error {
  color: red;
  font-size: 1.5rem;
}

.connectbutton {
  padding: 0.5rem;
  border-radius: 0.5rem;
  padding-inline: 2rem;
  border: 1px solid #ccc;
  cursor: pointer;
}
</style>
