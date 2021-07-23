import axios from "@/api/index"

export const emailList = data => axios.post('/api/email/list', data)  //邮件列表

export const emailview = data => axios.post('/api/email/view', data)  //邮件列表

export const emailhandle = data => axios.post('/api/email/handle', data)  //删除/已读/未读文件

export const emailadd = data => axios.post('/api/email/add', data)  //获取原邮件数据/新增传空

export const emailaddAct = data => axios.post('/api/email/addAct', data)  //写邮件/回复/转发 提交数据

export const emailmailAffix = data => axios.post('/api/email/mailAffix', data)  //附件列表

export const emailupload = data => axios.post('/api/email/upload', data,{ "headers": { 'Content-Type': 'multipart/form-data' } })  //上传附件

export const emaildel = data => axios.post('/api/email/del', data)  //删除附件














