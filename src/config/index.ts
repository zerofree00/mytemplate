/*
 * @Author: your name
 * @Date: 2021-03-24 10:22:51
 * @LastEditTime: 2021-03-24 10:24:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \project\VUE3\temp\h5-ts\config\index.ts
 */
let apiUrl = '/apis';

if (process.env.NODE_ENV == 'production') {
  apiUrl = '/apis';
}

export const apiBaseUrl = apiUrl;
