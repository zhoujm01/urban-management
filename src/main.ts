import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index'
import Antd from 'ant-design-vue';
import "@/font/font.css";
import "mars3d/dist/mars3d.css";
import "mars3d-cesium/Build/Cesium/Widgets/widgets.css";
createApp(App).use(router).use(Antd).mount('#app')
