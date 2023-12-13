import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
import useLocalstorage from './composables/useLocalstorage.ts'
const { } = useLocalstorage()



const app = createApp(App)

app.use(router)
app.mount('#app')
