import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

// App bootstrapping with router-enabled navigation.
createApp(App).use(router).mount('#app')
