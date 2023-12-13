<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'

const user = useLocalStorage('user', '')


</script>

<template>
  <header>
      <h1>Game</h1>
      <div>
        <p>Hi {{ user }}</p>
        <RouterLink to="'/select-user">
          Select user
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

header div{
  @apply flex justify-between items-center flex-row w-max;

}

a{
  color: #fff;
  text-decoration: none;
  padding: 0.5rem 0 0.5rem 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid #ccc;
  width: 100%;
  display: block;
}

p {
  margin-right: 1rem;
  width: 100%;
  display: block;
}


</style>