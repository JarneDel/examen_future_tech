<script setup lang="ts">
  import { useBle } from '../composables/useBle.ts'

  const { enableNotifications, listen } = useBle()
  const activate = async () => {
    enableNotifications().then(() => {
      listen((gyro, acc, mag) => {
        console.log(gyro, acc, mag)
      })
    })
    // const service = await getPrimaryService()
    // console.log(service)
    // if (service){
    //   setInterval(async () => {
    //     const characteristic = await readCharacteristic()
    //     characteristic.startNotifications().then(value => {
    //       value.readValue().then(value => {
    //         console.log(value)
    //       })
    //     })
    //   }, 1000)
    // }

  }
</script>

<template>
<button @click="activate">
  Init ble

</button>
</template>

<style scoped>

</style>