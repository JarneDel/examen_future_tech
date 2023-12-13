<script setup lang="ts">
import { onMounted, ref } from 'vue'
import useFirebase from '../composables/useFirebase.ts'
import { Game } from '../interfaces/game.interface.ts'

const games = ref([
  {
    url: '/maze',
    name: 'Maze',
    description: 'A simple maze game.',
    id: 1,
    duration: 0,
    score: 0,
  },


])


const { allGames, addGame } = useFirebase()
const isFetching = ref(false)

const getAllGames = async () => {
  isFetching.value = true
  allGames().then((data) => {
    isFetching.value = false
    const gameDataMap = new Map()
    data.forEach((gameData) => {
      gameDataMap.set(gameData.name, gameData)
    })

    games.value.forEach((game) => {
      const gameData = gameDataMap.get(game.name)
      if (!gameData) return
      game.duration = gameData.duration > game.duration ? gameData.duration : game.duration
      game.score = gameData.score > game.score ? gameData.score : game.score
    })
  })
}


onMounted(() => {
  getAllGames()
})

const addMazeGame = () => {
  const newGame: Game = {
    id: 1,
    name: 'Maze',
    description: 'A simple maze game.',
    duration: 20,
    score: 90,
    namePatience: 'Peter',
  }
  addGame(newGame).then(() => {
    getAllGames()

  })
}


</script>


<template>
  <h1>Dashboard</h1>

  <button @click="addMazeGame">Add game</button>
  <div class="container mx-auto p-4">
    <div>
      <h2 class="text-2xl font-bold mb-2">All Games:</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <RouterLink
          v-if="!isFetching && games.length > 0"
          v-for="game in games"
          :key="game.id"
          class="bg-white p-4 rounded-md shadow-md"
          :to="game.url"
        >
          <h3 class="text-xl font-bold mb-2">{{ game.name }}</h3>
          <p class="text-gray-600">{{ game.description }}</p>
          <p class="mt-2">Duration: {{ game.duration }} seconds</p>
          <p>Score: {{ game.score }}</p>
        </RouterLink>
        <div v-else-if="isFetching">
          <h2 class="text-2xl font-bold mb-2">Loading...</h2>

        </div>
        <div v-else>
          <h2 class="text-2xl font-bold mb-2">No Games Found</h2>
        </div>
      </div>
    </div>

    <!--    <div v-else>-->
    <!--      <h2 class="text-2xl font-bold mb-2">No Games Found</h2>-->
    <!--    </div>-->
  </div>
</template>
