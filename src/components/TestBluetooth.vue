<script setup lang="ts">
import { useBle } from '../composables/useBle.ts'

const { enableNotifications, listen } = useBle()
const activate = async () => {
  enableNotifications().then(() => {
    listen((gyro, acc, mag) => {
      console.log(gyro, acc, mag)
    }, (pressure) => {
      console.log(pressure)
    })
  })
}
</script>

<template>
  <button @click="activate">
    Init ble

  </button>
</template>

<style scoped>

</style>