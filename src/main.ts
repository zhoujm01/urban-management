import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index'
import Antd from 'ant-design-vue';
import "@/font/font.css";
import "mars3d/dist/mars3d.css";
import "mars3d-cesium/Build/Cesium/Widgets/widgets.css";

import appSettings from "./app-settings"
// createApp(App).use(router).use(Antd).mount('#app')

const app = createApp(App);

app.use(router);
app.use(Antd);
app.config.globalProperties.$appSettings = appSettings;
app.mount('#app');

export { app };
