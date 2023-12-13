<template>
  <div class="bg-red-500">
    <h1 class="text-3xl font-bold underline">Welcome to our App!</h1>
    <p>Start by calibrating your gyroscope:</p>
    <div ref="gyroContainer" class="gyro-container">
      <div ref="gyro" class="gyro"></div>
      <div class="gyro-indicator"></div>
      <button @click="">Calibrate</button>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped>
.gyro-container {
  width: 200px;
  height: 200px;
  position: relative;
}

.gyro {
  width: 100%;
  height: 100%;
  background-color: #000;
  border-radius: 50%;
  transition: transform 0.1s ease;
}

.gyro-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  background-color: #f00;
  border-radius: 50%;
}
</style>
