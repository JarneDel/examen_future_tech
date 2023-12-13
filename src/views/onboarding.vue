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
      <button @click="">Calibrate</button>
    </div>
  </div>
</template>

<script lang="ts" setup></script>
