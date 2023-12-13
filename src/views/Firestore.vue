<!-- FireStore.vue -->
<template>
  <div class="container mx-auto p-4">
    <button
      @click="addGameData"
      class="bg-blue-500 text-white py-2 px-4 mb-4 rounded"
    >
      Add Game Data
    </button>

    <div v-if="games.length > 0">
      <h2 class="text-2xl font-bold mb-2">All Games:</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="game in games"
          :key="game.id"
          class="bg-white p-4 rounded-md shadow-md"
        >
          <h3 class="text-xl font-bold mb-2">{{ game.name }}</h3>
          <p class="text-gray-600">{{ game.description }}</p>
          <p class="mt-2">Duration: {{ game.duration }} minutes</p>
          <p>Score: {{ game.score }}</p>
        </div>
      </div>
    </div>

    <div v-else>
      <h2 class="text-2xl font-bold mb-2">No Games Found</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import useFirebase from '../composables/useFirebase'
import { Game } from '../interfaces/game.interface'

const { addGame, allGames } = useFirebase()
const games = ref<Game[]>([])

const addGameData = async () => {
  const newGame: Game = {
    id: 1,
    name: 'New Game',
    description: 'This is a new game.',
    duration: 60,
    namePatience: 'Peter',
    score: 30,
  }

  try {
    await addGame(newGame)
    fetchAllGames()
    console.log('Game data added successfully.')
  } catch (error) {
    console.error('Error adding game data:', error)
  }
}

const fetchAllGames = async () => {
  try {
    const fetchedGames = await allGames()
    games.value = fetchedGames
    console.log('All games fetched:', fetchedGames)
  } catch (error) {
    console.error('Error fetching games:', error)
  }
}

watchEffect(() => {
  fetchAllGames()
})
</script>
