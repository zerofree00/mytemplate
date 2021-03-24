/*
 * @Author: your name
 * @Date: 2021-03-16 10:49:24
 * @LastEditTime: 2021-03-24 10:14:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \project\VUE3\temp\h5-ts\src\main.ts
 */
import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import 'amfe-flexible';

createApp(App)
  .use(store)
  .use(router)
  .mount('#app');
