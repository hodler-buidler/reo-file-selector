import AntComponents from '@/plugins/AntComponents';
import UiComponents from '@/plugins/UiComponents';
import { createStore } from '@/store';
import 'ant-design-vue/dist/antd.css';
import { createApp } from 'vue';
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css';
import App from './App.vue';
/* Done that way because of issue: https://github.com/mercs600/vue3-perfect-scrollbar/issues/4 */
/* eslint-disable @typescript-eslint/no-var-requires */
const PerfectScrollbar = require('vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.esm').default;

const app = createApp(App);
createStore();

app.use(PerfectScrollbar);
app.use(AntComponents);
app.use(UiComponents);

app.mount('#app');
