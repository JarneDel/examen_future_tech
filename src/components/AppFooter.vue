<script setup lang="ts">
import { useBle } from '../composables/useBle.ts'
import {Bluetooth, BluetoothOff} from 'lucide-vue-next'
const { enableNotifications, listen, state, disconnect: disable } = useBle()
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
  <footer class="footer flex justify-between items-center  bg-blue-400 text-white px-4">
    <button @click="activate" v-if="state == 'disconnected'" class="flex flex-row text-white gap-4">
      <BluetoothOff></BluetoothOff>
      Connect Squeezie
    </button>
    <button @click="disable" v-else-if="state == 'connected'" class="flex flex-row text-white gap-4">
      <Bluetooth></Bluetooth>
      Disconnect Squeezie
    </button>
    <span v-if="state === 'connected'">🟢 Connected</span>
    <span v-else-if="state === 'connecting'">🟠 Connecting</span>
    <span v-else-if="state === 'disconnected'">🔴 Disconnected</span>
  </footer>

</template>

<style scoped>
.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 2rem;
}

</style>