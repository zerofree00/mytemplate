/*
 * @Author: your name
 * @Date: 2021-03-16 10:49:24
 * @LastEditTime: 2021-03-24 10:48:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \project\VUE3\temp\h5-ts\src\router\index.ts
 */
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from) => {
  // canUserAccess() returns `true` or `false`
  // return await canUserAccess(to);
  return true;
});
export default router;
