import axios from "@/api/index"


export const receivedList = data => axios.post('/api/recDoc/list', data)  //收文列表接口

export const receivedDetail = data => axios.post('/api/recDoc/detail', data)  //公文详情接口

export const receiveSign = data => axios.post('/api/recDoc/sign', data)  //签收，拒收操作

export const doAddHandler = data => axios.post('/api/recDoc/doAddHandler', data)  //收文登记提交

export const collect = data => axios.post('/api/workCenter/collect', data)  //收藏任务

export const infoPubHandoutList = data => axios.post('/api/recDoc/pubHandoutList', data)  //交办记录

export const infodoCheckHandler = data => axios.post('/api/recDoc/doCheckHandler', data)  //收文审核提交

export const recdelete = data => axios.post('/api/recDoc/delete', data)  //删除收文







