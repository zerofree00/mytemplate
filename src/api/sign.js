import axios from "@/api/index"

export const signedReportList = data => axios.post('/api/signedReport/list', data)  //签报列表接口

export const signedReportDetail = data => axios.post('/api/signedReport/detail', data)  //签报详情接口

export const signedDoCheckHandler = data => axios.post('/api/signedReport/doCheckHandler', data)  //签报审核提交接口

export const signdelete = data => axios.post('/api/signedReport/delete', data)  //删除签报


