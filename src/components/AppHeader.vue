<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'

const user = useLocalStorage('user', '')


</script>

<template>
  <header>
    <RouterLink to="/">
      <h1>Game</h1>
    </RouterLink>
    <div class="flex flex-row gap-4 items-center">
      <p>Hi {{ user }}</p>
      <RouterLink to="/select-user" class="user-select">
        Switch user
      </RouterLink>
    </div>
  </header>
</template>

<style scoped>
header {
  background-color: #000;
  color: #fff;
  padding: 1rem;
  position: fixed;

  @apply flex justify-between items-center flex-row left-0 right-0;
}

.user-select {
  color: #fff;
  padding: .5rem 1rem;
  text-decoration: none;
  border-radius: 0.5rem;
  border: 1px solid #ccc;
}

</style>