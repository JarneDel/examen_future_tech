import { ref } from 'vue'

const NAME_PREFIX = 'Squ'
// const CHARACTERISTIC_UUID = '19b10000-1001-537e-4f6c-d104768a1214' // test characteristic
const CHARACTERISTIC_UUID = '19b10000-5001-537e-4f6c-d104768a1214'
const pressureCharacteristicUUID = '19b10000-a001-537e-4f6c-d104768a1214'
// const SERVICE_UUID = '19b10000-5001-537e-4f6c-d104768a1214'
const SERVICE_UUID = '19b10000-0000-537e-4f6c-d104768a1214'
const device = ref<BluetoothDevice>()
const server = ref<BluetoothRemoteGATTServer>()
const primaryService = ref<BluetoothRemoteGATTService>()
const characteristic = ref<BluetoothRemoteGATTCharacteristic>()
const pressureCharacteristic = ref<BluetoothRemoteGATTCharacteristic>()

export interface vec3 {
  x: number
  y: number
  z: number
}

const acc = ref<vec3>({ x: 0, y: 0, z: 0 })
const gyro = ref<vec3>({ x: 0, y: 0, z: 0 })
const mag = ref<vec3>({ x: 0, y: 0, z: 0 })
const pressure = ref<number>(0)
const state = ref<'disconnected' | 'connecting' | 'connected'>('disconnected')

const getDevice = async (): Promise<BluetoothDevice> => {
  try {
    state.value = 'connecting'
    device.value = await navigator.bluetooth.requestDevice({
      filters: [
        {
          namePrefix: NAME_PREFIX,
        },
      ],
      optionalServices: [SERVICE_UUID, pressureCharacteristicUUID],
    })
    device.value?.addEventListener('gattserverdisconnected', () => {
      state.value = 'disconnected'
    })
    device.value?.addEventListener('gattserverconnected', () => {
      state.value = 'connected'
    })
    state.value = 'connected'

    return device.value
  } catch (e) {
    state.value = 'disconnected'
    throw e
  }
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

const readCharacteristic =
  async (): Promise<BluetoothRemoteGATTCharacteristic> => {
    if (!primaryService.value) {
      await getPrimaryService()
    }
    if (!primaryService.value) {
      throw new Error('No service found')
    }
    characteristic.value = await primaryService.value.getCharacteristic(
      CHARACTERISTIC_UUID,
    )
    pressureCharacteristic.value = await primaryService.value.getCharacteristic(
      pressureCharacteristicUUID,
    )
    return characteristic.value
  }

const enableNotifications = async () => {
  const c = await readCharacteristic()
  await c.startNotifications()
  if (!pressureCharacteristic.value) {
    throw new Error('No characteristic found')
  }
  await pressureCharacteristic.value.startNotifications()
}

const listen = async (
  cb?: (gyro: vec3, acc: vec3, mag: vec3) => void,
  cb2?: (pressure: number) => void,
) => {
  if (!characteristic.value) {
    await readCharacteristic()
  }
  if (!characteristic.value) {
    throw new Error('No characteristic found')
  }
  characteristic.value.addEventListener('characteristicvaluechanged', event => {
    const dataView = (event.target as BluetoothRemoteGATTCharacteristic).value
    if (!dataView) {
      return
    }

    console.log(gyro.value)
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
    if (cb) {
      cb(gyro.value, acc.value, mag.value)
    }
  })
  if (!pressureCharacteristic.value) {
    throw new Error('No characteristic found')
  }
  pressureCharacteristic.value.addEventListener(
    'characteristicvaluechanged',
    event => {
      const dataView = (event.target as BluetoothRemoteGATTCharacteristic).value
      if (!dataView) {
        return
      }
      // pressure
      pressure.value = dataView.getFloat32(0, true)
      if (cb2) {
        cb2(pressure.value)
      }

      // gyro
    },
  )
}

const disconnect = async () => {
  if (!device.value) {
    return
  }
  device.value.gatt?.disconnect()
  state.value = 'disconnected'
}

const reconnect = async () => {
  if (!device.value) {
    return
  }
  device.value.gatt?.connect()
  state.value = 'connected'
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
    pressure,
    state,
    disconnect,
    reconnect,
  }
}
