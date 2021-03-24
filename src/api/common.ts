/*
 * @Author: your name
 * @Date: 2021-03-24 09:42:06
 * @LastEditTime: 2021-03-24 09:42:29
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \project\VUE3\temp\h5-ts\src\api\common.ts
 */
import axios from '@/utils/axios';
export const noticeList = (data: Object) =>
  axios.post('/api/notice/list', data);
