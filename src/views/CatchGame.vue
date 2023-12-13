<template>
  <div>dsqfdsfd</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBle } from '../composables/useBle'

const { enableNotifications, listen } = useBle()

const activate = async () => {
  enableNotifications().then(() => {
    listen((gyro, acc, mag) => {
      console.log(gyro, acc, mag)
    })
  })
}

activate()
</script>
