import { createStore } from '@/store';
import { Button } from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);
createStore();

app.use(Button);

app.mount('#app');
