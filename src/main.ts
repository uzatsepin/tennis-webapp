import './assets/main.css'
import { VueTelegramPlugin } from 'vue-tg'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
//@ts-ignore
import App from './App.vue'
import router from './router'

import { disableZoom } from './utils/disableZoom'

import Chart from 'chart.js/auto'
import { CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js'

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, PointElement, LineElement)

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueTelegramPlugin)

// Disable zooming on mobile devices
if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    disableZoom()
}

app.mount('#app')
