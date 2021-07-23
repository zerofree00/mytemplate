import axios from "@/api/index"

export const noticeList = data => axios.post('/api/notice/list', data)  //通知通告列表

export const noticedetail = data => axios.post('/api/notice/detail', data)  //通知通告详情

export const noticedelete = data => axios.post('/api/notice/delete', data)  //删除通知通告

export const noticeCheckHandler = data => axios.post('/api/notice/doCheckHandler', data)  //通知通告详情提交(审核)

//消息中心
export const messageList = data => axios.post('/api/notice/noticeList', data)  //消息中心的列表

export const messageDetail = data => axios.post('/api/notice/noticeView', data)  //消息中心的详情

export const messageAddComment = data => axios.post('/api/notice/addComment', data)  //消息中心详情评论的新增

export const messageDeleteComment = data => axios.post('/api/notice/deleteComment', data)  //消息中心详情评论的删除
