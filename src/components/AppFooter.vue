<script setup lang="ts">
import { useBle } from '../composables/useBle.ts'
import { Bluetooth, BluetoothOff, BluetoothConnected } from 'lucide-vue-next'
const { enableNotifications, listen, device, state, disconnect: disable, reconnect } = useBle()
const activate = async () => {
  enableNotifications().then(() => {
    listen()
  })
}
</script>

<template>
  <footer
    class="footer flex justify-between items-center bg-blue-400 text-white px-4"
  >
    <button
      @click="activate"
      v-if="state == 'disconnected'"
      class="flex flex-row text-white gap-4"
    >
      <BluetoothOff></BluetoothOff>
      Connect Squeezie
    </button>
    <button
      @click="disable"
      v-else-if="state == 'connected'"
      class="flex flex-row text-white gap-4"
    >
      <BluetoothConnected></BluetoothConnected>
      Disconnect Squeezie
    </button>
    <button v-if="device && state == 'disconnected'" @click="reconnect">
      reconnect
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
