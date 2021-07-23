import axios from "@/api/index"

export const doLogin = data => axios.post('/api/login', data)  //用户登陆接口

export const postList = data => axios.post('/api/sendDoc/list', data)  //发文列表接口

export const postDetail = data => axios.post('/api/sendDoc/detail', data)  //发文列表详情

export const postDocheck = data => axios.post('/api/sendDoc/doCheckHandler', data)  //发文审核

export const pubHandoutList = data => axios.post('/api/sendDoc/pubHandoutList', data)  //分发记录

export const senddelete = data => axios.post('/api/sendDoc/delete', data)  //删除发文

