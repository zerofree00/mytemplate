// 公共接口
import axios from "@/api/index"


export const affixcommon = data => axios.post('/api/affix/list', data)//附件列表

export const affixUpload = data => axios.post('/api/affix/upload', data, )//附件上传

export const collectcommon = data => axios.post('/api/myWork/collect', data)//收藏

export const affixdel = data => axios.post('/api/affix/del', data)//附件删除

export const workflowCommon = data => axios.post('/api/workflowCommon/handlerIdeaList', data)  //正常办理流程

export const dephandlerIdeaList = data => axios.post('/api/deptRecDoc/handlerIdeaList', data)  //收发文分发里面的办理流程

export const workflowCommonAdd = data => axios.post('/api/workflowCommon/add', data)  //收发文分发里面的办理流程

export const goodsGetDetail = data => axios.post('/api/goodsGet/detail', data)  //领用详情/领用申请

export const meetAppDetail = data => axios.post('/api/meetApp/detail', data)  //议题详情

export const meetDetail = data => axios.post('/api/meet/detail', data)  //会议详情

export const openWps = data => axios.post('/api/webOffice/openFile', data)  //查看正文

export const meetAppEntry= data => axios.post('/api/meetApp/themeView', data)  //查看正文




