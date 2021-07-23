import axios from "@/api/index"


export const departlist = data => axios.post('/api/deptRecDoc/list', data)//部门办文

export const deptdetail = data => axios.post('/api/deptRecDoc/detail', data) //详情

export const deptsign=data=>axios.post('/api/deptRecDoc/sign',data)//签收 拒收

export const deptAddHandler=data=>axios.post('/api/deptRecDoc/doAddHandler',data)//办文登记提交

export const deptCheckHandler=data=>axios.post('/api/deptRecDoc/doCheckHandler',data)//办文审核提交

export const deptpubHandoutList=data=>axios.post('/api/deptRecDoc/pubHandoutList',data)//交办记录

export const deptdelete=data=>axios.post('/api/deptRecDoc/delete',data)//删除部门办文







 