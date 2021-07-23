import VueRouter from 'vue-router'
// 单独页面开始
const NotFound = () => import('components/404/index')
// 复用组件
const login = () => import('viewOav/login/index')
const quillEditor = () => import('components/quillEditor/index')
// const attachment = () => import('components/attachment/index')
const attachment_index = () => import('components/attachment/index') //附件
const url_iframe = () => import('components/iframe/url_iframe') //iframe的链接

// 收文
const getinfo_index = () => import('viewOav/getinfo/index')
const getinfo_detail = () => import('viewOav/getinfo/detail') //公文详情
const getinfo_detail_unsign = () => import('viewOav/getinfo/detail_unsign') //未签收详情
const getinfo_signing = () => import('viewOav/getinfo/signing') //填写签收拒收意见详情
const getinfo_detail_edit = () => import('viewOav/getinfo/detail_edit') //收文提交
const getinfo_sign_enrolment = () => import('viewOav/getinfo/sign_enrolment') //收文提交
const getinfo_redetail = () => import('viewOav/getinfo/info_detail') //收文详情
const info_record = () => import('viewOav/getinfo/info_record') //交办记录

//waw 发文管理
const post_index = () => import('viewOav/post/index')
const post_edit = () => import('viewOav/post/post_edit')
const post_process = () => import('viewOav/post/process')
const post_record = () => import('viewOav/post/record')
const post_detail = () => import('viewOav/post/detail')
// const edit = () => import('viewOav/post/edit')

// 办文
const department_index = () => import('viewOav/department/index')
const department_detail = () => import('viewOav/department/detail') //公文详情
const department_unsign = () => import('viewOav/department/unsign') //未签收详情
const department_signing = () => import('viewOav/department/signing') //填写签收拒收意见详情
const department_edit = () => import('viewOav/department/edit') //收文提交
const department_sign_enrolment = () =>
    import('viewOav/department/sign_enrolment') //收文提交
const department_redetail = () => import('viewOav/department/depart_detail') //收文详情
const department_record = () => import('viewOav/department/record') //交办记录

// 签报
const sign_index = () => import('viewOav/sign/index') //签报列表
const sign_handle = () => import('viewOav/sign/handle') // 签报办理
const sign_detail = () => import('viewOav/sign/detail') //签报详情

// 请假
const leave_index = () => import('viewOav/leave/index')
const leave_detail = () => import('viewOav/leave/detail')
const leave_edit = () => import('viewOav/leave/edit')
const leave_apply = () => import('viewOav/leave/add_apply')

// 通知公告
const notice_index = () => import('viewOav/notice/index')
const notice_detail = () => import('viewOav/notice/detail')
const notice_edit = () => import('viewOav/notice/edit')

//邮件
const email_index = () => import('viewOav/email/index')
const email_detail = () => import('viewOav/email/detail') //详情
const email_edit = () => import('viewOav/email/edit') //转发--回复

/*
 * 消息中心
 */
const message_index = () => import('viewOav/message/index')
const message_detail = () => import('viewOav/message/detail')

/*
 * 个人中心
 */
// 关于我们
const about_us = () => import('viewOav/personal/about')

// 原生的h5写
const components_apply_detail = () => import('components/detail/apply_detail')
const meetApp_detail = () => import('components/detail/meetApp_detail')
const meet_detail = () => import('components/detail/meet_detail')
const meetEntry_detail = () => import('components/detail/meetEntry_detail')

//配置管理结束
const router = new VueRouter({
    mode: 'hash',
    routes: [
        { path: '/', redirect: '/login' },
        {
            path: '/leave/index',
            component: leave_index,
        },
        {
            path: '/common/meetEntry_detail',
            component: meetEntry_detail,
        },
        {
            path: '/common/apply_detail',
            component: components_apply_detail,
        },
        {
            path: '/common/meetApp_detail',
            component: meetApp_detail,
        },
        {
            path: '/common/meet_detail',
            component: meet_detail,
        },
        {
            path: '/leave/detail',
            component: leave_detail,
        },
        // {
        //     path: '/attachment/affix',
        //     component: attachment_index,
        // },

        {
            path: '/leave/edit',
            component: leave_edit,
        },
        {
            path: '/leave/apply',
            component: leave_apply,
        },
        {
            path: '/message/index',
            component: message_index,
        },
        {
            path: '/message/detail',
            component: message_detail,
        },
        {
            path: '/notice/index',
            component: notice_index,
        },
        {
            path: '/notice/detail',
            component: notice_detail,
        },
        {
            path: '/notice/edit',
            component: notice_edit,
        },

        {
            path: '/email/detail',
            component: email_detail,
            name: 'email_detail',
        },
        {
            path: '/email/edit',
            component: email_edit,
        },
        {
            path: '/email/index',
            component: email_index,
        },

        {
            path: '/sign/index',
            component: sign_index,
        },

        {
            path: '/sign/handle',
            component: sign_handle,
        },
        {
            path: '/sign/detail',
            component: sign_detail,
        },
        {
            path: '/department/index',
            component: department_index,
        },
        {
            path: '/department/detail',
            component: department_detail,
        },
        {
            path: '/department/unsign',
            component: department_unsign,
        },
        {
            path: '/department/signing',
            component: department_signing,
        },
        {
            path: '/department/edit',
            component: department_edit,
        },
        {
            path: '/department/sign_enrolment',
            component: department_sign_enrolment,
        },
        {
            path: '/department/depart_detail',
            component: department_redetail,
        },
        {
            path: '/department/record',
            component: department_record,
        },

        {
            path: '/getinfo/detail_edit',
            component: getinfo_detail_edit,
        },
        {
            path: '/getinfo/index',
            component: getinfo_index,
        },
        {
            path: '/getinfo/detail',
            component: getinfo_detail,
        },
        {
            path: '/getinfo/signing',
            component: getinfo_signing,
        },
        {
            path: '/getinfo/detail_unsign',
            component: getinfo_detail_unsign,
        },
        {
            path: '/getinfo/sign_enrolment',
            component: getinfo_sign_enrolment,
        },
        {
            path: '/getinfo/info_detail',
            component: getinfo_redetail,
        },
        {
            path: '/getinfo/info_record',
            component: info_record,
        },
        {
            path: '/post/index',
            component: post_index,
        },
        {
            path: '/post/post_edit',
            component: post_edit,
        },
        {
            path: '/post/process',
            component: post_process,
        },
        {
            path: '/post/record',
            component: post_record,
        },
        {
            path: '/post/detail',
            component: post_detail,
        },
        {
            path: '/quillEditor',
            component: quillEditor,
        },
        {
            path: '/login',
            component: login,
        },
        {
            path: '/personal/about',
            component: about_us,
        },
        {
            path: '/common/iframe',
            component: url_iframe,
            name: 'url_iframe',
        },
        // 页面导航，开发使用
        {
            path: '/nav',
            component: (resolve) => require(['viewOav/nav'], resolve),
        },
        { path: '*', component: NotFound },
    ],
})
router.afterEach((to, from, next) => {
    if (localStorage.getItem('attachmentList')) {
        localStorage.removeItem('attachmentList')
    }
    if (localStorage.getItem('textList')) {
        localStorage.removeItem('textList')
    }
})
export default router
