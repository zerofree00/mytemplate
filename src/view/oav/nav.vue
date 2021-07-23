
<template>
    <div class="nav_page">
        <van-cell v-for="(item,index) in navList" :key="index" :title="item.name" :to="{path:item.url+'?strSid=e1ebe63b1a424d27ad50f62a70c0b57f' }" is-link />
    </div>
</template>

<script>
export default {
    name: "App",
    computed: {

    },
    data () {
        return {
            navList: [
                {
                    name: '发文管理',
                    url: '/post/index',
                },
                {
                    name: '收文管理',
                    url: '/getinfo/index',
                },
                {
                    name: '部门办文',
                    url: '/department/index',
                },
                {
                    name: '签报管理',
                    url: '/sign/index',
                },
                {
                    name: '请假管理',
                    url: '/leave/index',
                },
                {
                    name: '通知公告',
                    url: '/notice/index',
                },
                {
                    name: '邮件管理',
                    url: '/email/index',
                },
                {
                    name: '消息中心',
                    url: '/message/index',
                },
                {
                    name: '关于我们',
                    url: '/personal/about',
                },
            ],
        };
    },
};
</script>

<style lang="stylus" scoped>
#app
    height: 100%;
    width: 100%;
</style>
