import { createApp } from 'vue';

import App from './App.vue';
import env from './plugins/env';
import router from './router';
import axios from 'axios';
import VueAxios from 'vue-axios';

import '@/assets/css/main.css';

const app = createApp(App);
app.use(env);
app.use(router);
app.use(VueAxios, axios);

app.mount('#app');
