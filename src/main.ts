import './style.css'
import './router-scroll.css'
import 'ant-design-vue/dist/reset.css'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router' 
import { createApp } from 'vue'
import { Button, message } from 'ant-design-vue'
import { createPinia } from 'pinia'

createApp(App)
.use(router)
.use(Button,message)
.use(createPinia().use(piniaPluginPersistedstate))
.mount('#app')