<script setup lang="ts">
import { onMounted, ref } from 'vue'
import useFirebase from '../composables/useFirebase.ts'
import { Game } from '../interfaces/game.interface.ts'
import { Apple, Egg } from 'lucide-vue-next'

const games = ref([
  {
    url: '/maze',
    name: 'Maze',
    description: 'A simple maze game.',
    id: 1,
    duration: 0,
    recordDuration: 0,
    icon: Apple,
  },
  {
    url: '/catch-game',
    name: 'Catch Game',
    description: 'A simple catch game.',
    id: 2,
    duration: 0,
    recordDuration: 0,
    icon: Egg,
  },


])

const parseDuration = (durationSec: number) => {
  const minutes = Math.floor(durationSec / 60)
  const seconds = durationSec % 60
  if (minutes == 0) return `${seconds}s`

  return `${minutes}m ${seconds}s`
}


const { allGames, addGame } = useFirebase()
const isFetching = ref(false)

// const getAllGames = async () => {
//   isFetching.value = true
//   allGames().then(data => {
//     isFetching.value = false
//     const gameDataMap = new Map()
//     data.forEach(gameData => {
//       gameDataMap.set(gameData.name, gameData)
//     })
//
//     games.value.forEach(game => {
//       const gameData = gameDataMap.get(game.name)
//       if (!gameData) return
//       game.duration =
//         gameData.duration > game.duration ? gameData.duration : game.duration
//       game.score = gameData.score > game.score ? gameData.score : game.score
//     })
//   })
// }

// onMounted(() => {
//   getAllGames()
// })

</script>

<template>
  <div class="container mx-auto p-4">
    <div>
      <h2 class="text-2xl font-bold mb-2">All Games:</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <RouterLink
          v-if="!isFetching && games.length > 0"
          v-for="game in games"
          :key="game.id"
          class="bg-white p-4 rounded-md shadow-md"
          :to="`onboarding?game=${game.url}`"
        >
          <h3 class="text-xl font-bold mb-2 flex flex-row justify-start gap-3 items-center">
            <component :is="game.icon" />
            <span>
            {{ game.name }}

            </span></h3>
          <p class="text-gray-600">{{ game.description }}</p>
          <p class="mt-2">Duration: {{ parseDuration(game.duration) }} </p>
          <p>Highscore: {{ game.recordDuration }}</p>
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
