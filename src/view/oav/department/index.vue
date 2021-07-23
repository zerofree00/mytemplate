<template>
    <div class="getInfomation_index">
        <!-- 接口 完成 -->
        <van-nav-bar @click-left="onleft" @click-right="showSearch">
            <template #left>
                <div class="color_000">
                    <van-icon name="arrow-left" class="arrow-left" />
                    <span class="header_title">部门办文</span>
                </div>
            </template>
            <template #right>
                <van-icon
                    class="iconfont"
                    class-prefix="icon"
                    name="sousuo1"
                    size="18"
                />
            </template>
        </van-nav-bar>

        <!-- 搜索头部 start-->
        <div class="search_box" v-if="isSearch">
            <div class="search_box_con clearfix">
                <div class="search_box_choose float_l">
                    <van-dropdown-menu>
                        <van-dropdown-item
                            v-model="type"
                            :options="typeList"
                            @change="changeType"
                        />
                    </van-dropdown-menu>
                </div>
                <div class="search_box_main float_l">
                    <form action="/">
                        <van-search
                            v-model="keyValue"
                            placeholder="请输入搜索关键词"
                            @input="onSearch"
                        />
                    </form>
                </div>
            </div>
            <span class="cancel" @click="hideSearch">取消</span>
        </div>
        <!-- 搜索头部 end -->

        <!-- 标签页 -->
        <van-tabs v-model="active" animated swipeable @change="changeTab">
            <van-tab
                v-for="(item, index) in tablist"
                :key="index"
                :name="item.strModeCode"
            >
                <template #title>{{ item.strName }}</template>
                <van-list
                    v-model="loading"
                    :finished="finished"
                    finished-text="没有更多了"
                    @load="dataLoad"
                    :immediate-check="false"
                    v-if="!isnone"
                >
                    <van-pull-refresh
                        v-model="isLoading"
                        success-text="刷新成功"
                        @refresh="onRefresh"
                    >
                        <div
                            class="item_main_qy"
                            v-for="(item1, index) in list"
                            :key="index"
                            @click="
                                linkDetails(
                                    item1.strModeCode,
                                    item1.strWorkId,
                                    item1.intStateCode,
                                    item1.blShowDelete,
                                    item1.strChgDocWorkId
                                )
                            "
                        >
                            <div class="tit_item">{{ item1.strTitle }}</div>
                            <div class="time_item">
                                <van-icon
                                    class="iconfont"
                                    class-prefix="icon"
                                    name="shijian1"
                                />
                                <span>{{ item1.strComeTime }}</span>
                            </div>
                            <span
                                class="right_span blue_c"
                                v-if="item1.intStateCode == '0'"
                                >未办结</span
                            >
                            <span
                                class="right_span cyan_c"
                                v-if="item1.intStateCode == '1'"
                                >已办结</span
                            >
                            <span
                                class="right_span lightblue_c"
                                v-if="item1.intStateCode == '2'"
                                >未签收</span
                            >
                            <span
                                class="right_span purple_c"
                                v-if="item1.intStateCode == '3'"
                                >已签收</span
                            >
                            <span
                                class="right_span orange_c"
                                v-if="item1.intStateCode == '4'"
                                >已拒收</span
                            >
                        </div>
                    </van-pull-refresh>
                </van-list>

                <div v-if="isnone" class="nodata">
                    <img src="~assets/images/none.png" alt class="nodataimg" />
                </div>
            </van-tab>
        </van-tabs>
    </div>
</template>
<script>
import { departlist } from '@/api/department'
import { getRequest } from '@/assets/js/util'
import { communication } from '@/assets/js/mixin'
export default {
    mixins: [communication],
    name: 'department_index',
    data() {
        return {
            tablist: [
                { strName: '待签收文', strModeCode: '22001' },
                { strName: '我的收文', strModeCode: '22002' },
                { strName: '全部收文', strModeCode: '22003' },
            ],
            typeList: [
                { text: '全部', value: '' },
                { text: '标题', value: 'strDocTitle' },
                { text: '状态', value: 'strState' },
                { text: '来文单位', value: 'strSendUnitName' },
            ],
            type: '',
            keyValue: '',
            isSearch: false,
            active: '22001',
            loading: false,
            finished: false,
            intCurPage: 1,
            list: [],
            isnone: false,
            isLoading: false,
        }
    },
    created() {
        localStorage.setItem('strSid', getRequest().strSid)
        this.departlist()
    },
    activated() {
        if (localStorage.getItem('departDel') == 'true') {
            this.intCurPage = 1
            this.list = []
            this.finished = true
            this.departlist()
            this.isLoading = false
            localStorage.setItem('departDel', 'false')
        }
    },
    methods: {
        hasAppData(e) {
            this.tablist = JSON.parse(e)
        },
        dataLoad() {
            if (this.intCurPage == 1) return
            this.departlist()
        },
        //获取收文列表数据
        departlist(strModeCode = this.active) {
            var param = {
                strSid: localStorage.getItem('strSid'),
                strModeCode: strModeCode,
                websvrpwd: localStorage.getItem('websvrpwd'),
                intCurPage: this.intCurPage,
                strSearchType: this.type,
                strKeyValue: this.keyValue,
                intPageSize: '10',
            }
            departlist(param)
                .then((res) => {
                    if (res.data.intCode === 200) {
                        if (res.data.objData.intAllCount == '0') {
                            this.isnone = true
                        } else {
                            this.isnone = false
                        }
                        if (this.intCurPage == 1) {
                            this.list = res.data.objData.objList
                        } else {
                            this.list = this.list.concat(
                                res.data.objData.objList
                            )
                        }

                        this.intCurPage++
                        this.finished = false
                        if (this.list.length >= res.data.objData.intAllCount) {
                            this.finished = true
                        }
                        this.loading = false
                    } else {
                        this.$toast(res.data.strMsg)
                    }
                })
                .catch((err) => {
                    this.$toast(err)
                })
        },
        // 刷新
        onRefresh() {
            this.intCurPage = 1
            this.list = []
            this.finished = false
            this.isLoading = false
            this.loading = false
            this.departlist()
        },
        onleft() {
            this.appRequest({}, 0)
        },

        //去详情
        linkDetails(type, strWorkId, code, blShowDelete, strChgDocWorkId) {
            if (type == '22001' || type == '22002') {
                if (code == '2') {
                    this.$router.push({
                        path: '/department/unsign', //未签收
                        query: {
                            type: type,
                            strWorkId: strWorkId,
                            code: code,
                        },
                    })
                } else {
                    this.$router.push({
                        path: '/department/detail', //已签收详情 /  已拒收  详情
                        query: {
                            type: type,
                            strWorkId: strWorkId,
                            code: code,
                            strChgDocWorkId: strChgDocWorkId,
                        },
                    })
                }
            } else {
                if (strWorkId.split('_')[1] === 'mainView') {
                    this.$router.push({
                        path: '/department/depart_detail', //未办结
                        query: {
                            type: type,
                            strWorkId: strWorkId,
                            code: code,
                            blShowDelete: blShowDelete,
                        },
                    })
                } else {
                    this.$router.push({
                        path: '/department/edit',
                        query: {
                            type: type,
                            strWorkId: strWorkId,
                            code: code,
                            blShowDelete: blShowDelete,
                            strType: 0,
                            strChgDocWorkId: strChgDocWorkId,
                        },
                    })
                }
            }
        },

        //搜索列表数据
        onSearch(val) {
            this.intCurPage = 1
            this.keyValue = val
            this.list = []
            this.departlist()
            this.finished = true
        },

        // tab切换
        changeTab(name) {
            this.active = name
            this.intCurPage = 1
            this.list = []
            this.finished = true
            this.departlist()
        },

        // 搜索条件切换
        changeType(val) {
            this.type = val
            this.intCurPage = 1
            this.list = []
            this.departlist()
            this.finished = true
        },

        //展示搜索
        showSearch() {
            this.isSearch = true
        },
        //关闭搜索
        hideSearch() {
            this.keyValue = ''
            this.type = ''
            this.isSearch = false
            this.intCurPage = 1
            this.list = []
            this.departlist()
            this.finished = true
        },
    },
}
</script>
<style lang="stylus" scoped>
@import '~assets/stylus/mixin.styl';
.getInfomation_index
    background-color: #f6f6f6;
    min-height: 100%;
    .search_box
        pos(0, 0, 0, 0, 0, 100);
        width: 100%;
        height: 46px;
        background: #ffffff;
        padding: 8px 60px 8px 15px;
        .search_box_con
            background: #f0f0f0;
            width: 100%;
            height: 30px;
            border-radius: 30px;
            .search_box_choose
                width: 80px;
            .search_box_main
                width: calc(100% - 80px);
                height: 30px;
    .cancel
        display: block;
        font(16px, 46px);
        width: 60px;
        text-align: center;
        color: #0876fc;
        pos(0, 0, 0, none, 1, 20);
.item_main_qy
    background-color: #fff;
    margin: 10px;
    padding: 15px;
    border-radius: 5px;
    position: relative;
.tit_item
    font(16px, 28px);
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    display: -moz-box;
    -moz-line-clamp: 2;
    -moz-box-orient: vertical;
    word-wrap: break-word;
    word-break: break-all;
    white-space: normal;
.time_item
    margin: 10px 0 5px;
    font(14px);
    color: #999999;
    i
        margin-right: 5px;
.right_span
    font-size: 14px;
    padding: 6px 10px;
    border-radius: 8px 0 0 0;
    position: absolute;
    bottom: 10px;
    right: -3px;
</style>
