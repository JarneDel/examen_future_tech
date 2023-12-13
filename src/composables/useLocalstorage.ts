import { useLocalStorage } from '@vueuse/core'

const user = useLocalStorage('user', '')

export default () => {
  return {
    user,
  }

}