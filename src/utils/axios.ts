/*
 * @Author: your name
 * @Date: 2021-03-24 09:41:28
 * @LastEditTime: 2021-03-24 10:38:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \project\VUE3\temp\h5-ts\src\utils\axios.ts
 */
'use strict';
import axios, { AxiosRequestConfig, AxiosResponse, Canceler } from 'axios';
import router from '@/router';
import { apiBaseUrl } from '@/config';
const validateStatus = (status: any) => {
  return status >= 200 && status < 300;
};

// 创建时自定义默认配置，超时设置为全局默认值0秒
let axiosNew: any = axios.create({
  baseURL: apiBaseUrl,
  timeout: 600000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'x-requested-with': 'XMLHttpRequest',
  },
  validateStatus: validateStatus,
});

let sourceAjaxList: Canceler[] = [];

axiosNew.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 设置 cancel token  用于取消请求 (当一个接口出现401后，取消后续多有发起的请求，避免出现好几个错误提示)
    config.cancelToken = new axios.CancelToken(function executor(
      cancel: Canceler
    ): void {
      sourceAjaxList.push(cancel);
    });

    // 存在 sessionId 为所有请求加上 sessionId
    if (
      localStorage.getItem(`h5_sessionId`) &&
      config.url!.indexOf('/user/login') < 0
    )
      config.url += 'sessionId=' + localStorage.getItem(`h5_sessionId`);
    if (!config.data) config.data = {};

    return config;
  },
  function(error: any) {
    // 抛出错误
    return Promise.reject(error);
  }
);

axiosNew.interceptors.response.use(
  (response: AxiosResponse) => {
    const { status, data } = response;
    if (status === 200) {
      // 如果不出现错误，直接向回调函数内输出 data
      if (data.code === 0) {
        return data;
      } else if (data.code === 401) {
        // 出现未登录或登录失效取消后面的请求
        sourceAjaxList.length &&
          sourceAjaxList.length > 0 &&
          sourceAjaxList.forEach((ajaxCancel, index) => {
            ajaxCancel(); // 取消请求
            delete sourceAjaxList[index];
          });

        return router.push('/login');
      } else {
        return data;
      }
    } else {
      return data;
    }
  },
  (error: any) => {
    const { response } = error;
    // 这里处理错误的 http code or 服务器或后台报错
    if (!response || response.status === 404 || response.status === 500) {
      if (!response) {
        console.error(`404 error %o ${error}`);
      } else {
        if (response.data && response.data.message) {
          //   Toast.fail({
          //     message: '请求异常，请稍后再试!',
          //     duration: 2000,
          //   });
        }
      }
    }
    return Promise.reject(error.message);
  }
);

export default axiosNew;
