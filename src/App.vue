<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppFooter from './components/AppFooter.vue'
import AppHeader from './components/AppHeader.vue'


</script>

<template>
  <AppHeader/>
  <div class="mt-[74px]">
  <RouterView />

  </div>
  <AppFooter/>
</template>


