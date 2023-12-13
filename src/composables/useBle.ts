import { ref } from 'vue'


const NAME_PREFIX = 'Squ'
// const CHARACTERISTIC_UUID = '19b10000-1001-537e-4f6c-d104768a1214' // test characteristic
const CHARACTERISTIC_UUID = '19b10000-5001-537e-4f6c-d104768a1214'
// const SERVICE_UUID = '19b10000-5001-537e-4f6c-d104768a1214'
const SERVICE_UUID = '19b10000-0000-537e-4f6c-d104768a1214'
const device = ref<BluetoothDevice>()
const server = ref<BluetoothRemoteGATTServer>()
const primaryService = ref<BluetoothRemoteGATTService>()
const characteristic = ref<BluetoothRemoteGATTCharacteristic>()

export interface vec3 {
  x: number
  y: number
  z: number
}

const acc = ref<vec3>({ x: 0, y: 0, z: 0 })
const gyro = ref<vec3>({ x: 0, y: 0, z: 0 })
const mag = ref<vec3  >({ x: 0, y: 0, z: 0 })


const getDevice = async (): Promise<BluetoothDevice> => {
  device.value = await navigator.bluetooth.requestDevice({
    filters: [{
      namePrefix: NAME_PREFIX,
    }],
    // optionalServices: [SERVICE_UUID]
    // acceptAllDevices: true,
    optionalServices: [SERVICE_UUID],
  })
  return device.value
}

const getBluetoothServer = async (): Promise<BluetoothRemoteGATTServer> => {
  if (!device.value) {
    await getDevice()
  }
  if (!device.value) {
    throw new Error('No device found')
  }
  if (device.value.gatt?.connected) {
    return device.value.gatt
  }
  const s = await device.value.gatt?.connect()
  if (!s) {
    throw new Error('No service found')
  }
  server.value = s
  return s
}

const getPrimaryService = async (): Promise<BluetoothRemoteGATTService> => {
  if (!server.value) {
    await getBluetoothServer()
  }
  if (!server.value) {
    throw new Error('No server found')
  }
  const service = await server.value.getPrimaryService(SERVICE_UUID)
  primaryService.value = service
  return service
}

const readCharacteristic = async (): Promise<BluetoothRemoteGATTCharacteristic> => {
  if (!primaryService.value) {
    await getPrimaryService()
  }
  if (!primaryService.value) {
    throw new Error('No service found')
  }
  characteristic.value = await primaryService.value.getCharacteristic(CHARACTERISTIC_UUID)
  return characteristic.value
}

const enableNotifications = async () => {
  const c = await readCharacteristic()
  await c.startNotifications()
}

const listen = async (cb: (gyro: vec3 , acc: vec3, mag: vec3) => void) => {
  if (!characteristic.value) {
    await readCharacteristic()
  }
  if (!characteristic.value) {
    throw new Error('No characteristic found')
  }
  characteristic.value.addEventListener('characteristicvaluechanged', (event) => {
    const dataView = (event.target as BluetoothRemoteGATTCharacteristic).value
    if (!dataView) {
      return
    }
    // gyro
    gyro.value.x = dataView.getFloat32(0, true)
    gyro.value.y = dataView.getFloat32(4, true)
    gyro.value.z = dataView.getFloat32(8, true)
    // acc
    acc.value.x = dataView.getFloat32(12, true)
    acc.value.y = dataView.getFloat32(16, true)
    acc.value.z = dataView.getFloat32(20, true)
    // mag
    mag.value.x = dataView.getFloat32(24, true)
    mag.value.y = dataView.getFloat32(28, true)
    mag.value.z = dataView.getFloat32(32, true)
    cb(gyro.value, acc.value, mag.value)
  })
}


export const useBle = () => {
  return {
    getDevice,
    getBluetoothServer,
    getPrimaryService,
    readCharacteristic,
    enableNotifications,
    device,
    server,
    primaryService,
    listen,
    gyro,
    acc,
    mag,
  }
}
