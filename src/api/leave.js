
import axios from "@/api/index"

export const leaveList = data => axios.post('/api/application/list', data)  //请假管理列表

export const leavedetail = data => axios.post('/api/application/detail', data)  //请假申请详情

export const leavedelete = data => axios.post('/api/application/delete', data)  //删除请假申请

export const leaveCheckHandler = data => axios.post('/api/application/doCheckHandler', data)  //请假申请详情提交(审核)

export const leaveAddHandler = data => axios.post('/api/application/doAddHandler', data)  //请假申请详情提交(新增)
