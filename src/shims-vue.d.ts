/*
 * @Author: your name
 * @Date: 2021-03-16 10:49:24
 * @LastEditTime: 2021-03-24 10:06:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \project\VUE3\temp\h5-ts\src\shims-vue.d.ts
 */
/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
} 