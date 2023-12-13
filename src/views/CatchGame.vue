<template>
  <div class="flex justify-center items-center w-full">
    <h2 class="text-xl font-bold">Score: {{ score }}</h2>
    <p v-if="score >= 5" class="ml-4 text-xl font-bold">You win!</p>
  </div>

  <!-- Legenda -->
  <div class="flex justify-center items-center w-full mt-4">
    <div class="flex justify-center items-center mr-4">
      <div class="w-4 h-4 bg-blue-700 rounded-full"></div>
      <p class="ml-2">You</p>
    </div>
    <div class="flex justify-center items-center">
      💣
      <p class="ml-2">Dangerous</p>
    </div>
    <div class="flex justify-center items-center ml-4">
      🐦
      <p class="ml-2">Food</p>
    </div>
  </div>

  <div class="flex flex-col justify-center items-center mt-4">
    <div v-for="(row, rowIndex) in grid" :key="rowIndex" class="flex">
      <div
        v-for="(_cell, colIndex) in row"
        :key="colIndex"
        class="w-20 h-20 border border-gray-300 flex justify-center items-center relative"
      >
        <div class="w-14 h-14" v-if="isBallPosition(rowIndex, colIndex)">
          <img class="object-cover" src="/photo.png" alt="one piece" />
        </div>
        <div class="text-5xl" v-if="isRedBallPosition(rowIndex, colIndex)">
          💣
        </div>
        <div class="text-5xl" v-if="isGreenBallPosition(rowIndex, colIndex)">
          🐦
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useBle } from '../composables/useBle'
import { useRouter } from 'vue-router'
import useFirebase from '../composables/useFirebase'
import useLocalStorage from '../composables/useLocalstorage'
const { acc, pressure } = useBle()
const { push } = useRouter()
const { updateUser } = useFirebase()
const { user } = useLocalStorage()

const score = ref(0)
const startTimer = ref(new Date().getTime())

const gridSize = 8
const grid = ref(
  Array.from({ length: gridSize }, () => Array(gridSize).fill(0)),
)
const ballPosition = ref({ row: 4, col: 4 })

const generateRandomPosition = () => {
  const row = Math.floor(Math.random() * gridSize)
  const col = Math.floor(Math.random() * gridSize)

  return { row, col }
}

const greenBallPosition = ref(generateRandomPosition())
const redBallPosition = ref(generateRandomPosition())

const data = ref({
  acc: computed(() => {
    const roundValue = (value: number) => Math.round(value * 100)
    return {
      x: roundValue(acc.value.x),
      y: roundValue(acc.value.y),
      z: roundValue(acc.value.z),
    }
  }),
  pressure: computed(() => pressure.value || 0),
})

const moveBall = (direction: any) => {
  const canMove = (row: any, col: any) =>
    row >= 0 && row < gridSize && col >= 0 && col < gridSize

  switch (direction) {
    case 'up':
      if (canMove(ballPosition.value.row - 1, ballPosition.value.col)) {
        ballPosition.value.row--
      }
      break
    case 'down':
      if (canMove(ballPosition.value.row + 1, ballPosition.value.col)) {
        ballPosition.value.row++
      }
      break
    case 'left':
      if (canMove(ballPosition.value.row, ballPosition.value.col - 1)) {
        ballPosition.value.col--
      }
      break
    case 'right':
      if (canMove(ballPosition.value.row, ballPosition.value.col + 1)) {
        ballPosition.value.col++
      }
      break
  }
}

const isBallPosition = (row: any, col: any) =>
  row === ballPosition.value.row && col === ballPosition.value.col

const isGreenBallPosition = (row: any, col: any) =>
  row === greenBallPosition.value.row && col === greenBallPosition.value.col

const isRedBallPosition = (row: any, col: any) =>
  row === redBallPosition.value.row && col === redBallPosition.value.col

watch(
  data,
  () => {
    const { x, y } = data.value.acc

    if (score.value < 5) {
      if (y > 100) {
        moveBall('left')
        data.value.acc.y = y
      } else if (y < -100) {
        moveBall('right')
        data.value.acc.y = y
      } else if (x > 75) {
        moveBall('up')
        data.value.acc.x = x
      } else if (x < -75) {
        moveBall('down')
        data.value.acc.x = x
      }

      if (
        isBallPosition(greenBallPosition.value.row, greenBallPosition.value.col)
      ) {
        greenBallPosition.value = generateRandomPosition()
        score.value += 1 // Add 1 point for catching a green ball
      }

      if (
        isBallPosition(redBallPosition.value.row, redBallPosition.value.col)
      ) {
        redBallPosition.value = generateRandomPosition()
        if (score.value > 0) {
          score.value -= 2 // Remove 1 point for catching a red ball
        }
        if (score.value < 0) {
          score.value = 0
        }
      }
    } else {
      console.log('You win!')

      const endTimer = new Date().getTime()

      // total time in seconds
      const time = (endTimer - startTimer.value) / 1000

      // update user score
      updateUser({
        name: user.value,
        catchScore: 5,
        catchTime: time,
        mazeTime: -1,
      })

      push('/')
    }
  },
  { deep: true },
)
</script>
