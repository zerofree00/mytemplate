<template>
    <div class="leave_index" :class="blShowDelete?'paddbtm_65':''">
        <van-nav-bar @click-left="onleft">
            <template #left>
                <div class="color_000">
                    <van-icon name="arrow-left" class="arrow-left" />
                    <span class="header_title">通知详情</span>
                </div>
            </template>

            <template #right>
                <div class="color_000">
                    <van-icon class="iconfont like-o" class-prefix="icon" name="banliliucheng" @click="linkprocess" />
                    <van-icon class="iconfont" class-prefix="icon" name="guanzhu" @click="collectcommon(1)" v-if="!isCollect" />
                    <van-icon class="iconfont color_index" class-prefix="icon" name="aixin" @click="collectcommon(2)" v-if="!!isCollect" />
                </div>
            </template>
        </van-nav-bar>
        <main>
            <div class="item_box" style="padding:15px 15px 5px 15px">
                <div class="title_top">
                    {{strTitle.strValue}}
                    <span></span>
                </div>
                <div class="color_888">{{strPubUnit.strName}}：{{strPubUnit.strValue}}</div>
                <div class="color_888">{{dtPubDate.strName}}：{{dtPubDate.strValue}}</div>
                <div class="detail_text_bottom">
                    <span class="fujian fuAffix" @click="linkAttachment(intFileCount)">
                        <van-icon class="iconfont" class-prefix="icon" name="webfujian" />附件
                        <van-tag round color="#e8f2ff" text-color="#137cfc">{{this.intFileCount}}</van-tag>
                    </span>
                </div>
            </div>
            <div class="item_box">
                <div class="inner_box">
                    <div class="title">{{strContent.strName}}</div>
                    <div class="color_888 richText">
                        <div v-html="strContent.strValue"></div>
                    </div>
                </div>
                <div class="inner_box">
                    <div class="title">{{strPubRange.strName}}</div>
                    <div class="color_888">{{strPubRange.strValue}}</div>
                </div>
                <div class="inner_box">
                    <div class="title">{{dtPastDate.strName}}</div>
                    <div class="color_888">{{dtPastDate.strValue}}</div>
                </div>
                <div class="inner_box">
                    <div class="title">{{intSms.strName}}</div>
                    <div class="color_888">{{intSms.strValue ==0 ? '否':'是'}}</div>
                </div>
                <div class="inner_box">
                    <div class="title">{{intReply.strName}}</div>
                    <div class="color_888">{{intReply.strValue ==0 ? '否':'是'}}</div>
                </div>
            </div>
        </main>
        <!-- 删除 -->
        <div class="btn_box" v-if="blShowDelete">
            <div class="btn" @click="showDelDialog()">删除</div>
        </div>

        <!-- 组件 ---附件页面-->
        <affix v-if="isShowAffix" @getfileData="getfileData" :affixshow="affixshow" types="attachment"></affix>
    </div>
</template>
<script>
import { noticedetail, noticedelete } from "@/api/notice";
import { collectcommon } from "@/api/common";
import { getRequest } from "@/assets/js/util";
import { communication } from "@/assets/js/mixin";
import affix from "@/components/attachment/affix.vue";
export default {
    mixins: [communication],
    components: {
        affix,
    },
    data() {
        return {
            list: [],
            strTitle: "", //标题
            strPubUnit: "", //发布单位
            dtPubDate: "", //发布时间
            strContent: "", //正文内容
            strPubRange: "", //发布范围
            dtPastDate: "", //过期时间
            intSms: "", //短信提醒
            intReply: "", //是否回复
            isCollect: "",
            blShowDelete: "",
            intFileCount: "",
            isShowAffix: false,
            affixshow: false,
        };
    },
    created() {
        if (getRequest().backDetail == "true") {
            localStorage.setItem("strSid", getRequest().strSid);
        }
        this.noticedetail();
    },

    methods: {
        noticedetail() {
            var param = {
                strSid: localStorage.getItem("strSid"),
                strWorkId: getRequest().strWorkId,
                strModeCode: getRequest().type,
            };
            noticedetail(param)
                .then((res) => {
                    if (res.data.intCode == 200) {
                        this.list = res.data.objData.objFormList;
                        this.blShowDelete = res.data.objData.blShowDelete;
                        this.isCollect = res.data.objData.blCollected;
                        this.intFileCount = res.data.objData.intFileCount;
                        this.list.forEach((item) => {
                            if (item.strKey == "strTitle") {
                                this.strTitle = item;
                            }
                            if (item.strKey == "strPubUnit") {
                                this.strPubUnit = item;
                            }
                            if (item.strKey == "dtPubDate") {
                                this.dtPubDate = item;
                            }
                            if (item.strKey == "strContent") {
                                this.strContent = item;
                            }
                            if (item.strKey == "strPubRange") {
                                this.strPubRange = item;
                            }
                            if (item.strKey == "dtPastDate") {
                                this.dtPastDate = item;
                                if (this.dtPastDate.strValue == undefined) {
                                    this.dtPastDate.strValue = "—";
                                }
                            }
                            if (item.strKey == "intSms") {
                                this.intSms = item;
                            }
                            if (item.strKey == "intReply") {
                                this.intReply = item;
                            }
                        });
                    } else {
                        this.$toast(res.data.strMsg);
                    }
                })
                .catch((err) => {
                    this.$toast(err);
                });
        },
        onleft() {
            if (getRequest().backDetail == "true") {
                this.appRequest({}, 0);
            } else {
                this.$router.back();
            }
        },

        // 删除弹出框
        showDelDialog() {
            this.$dialog
                .confirm({
                    title: "提示",
                    message: "删除后将无法恢复，确定删除？",
                })
                .then(() => {
                    this.deleteNotice();
                })
                .catch(() => {
                    // this.$toast("取消删除");
                });
        },

        deleteNotice() {
            var param = {
                strSid: localStorage.getItem("strSid"),
                strObjMainId: getRequest().strObjMainId,
            };
            noticedelete(param)
                .then((res) => {
                    if (res.data.intCode == 200) {
                        this.$toast("删除成功");
                        this.$router.back();
                        localStorage.setItem("noticeDel", "true");
                    } else {
                        this.$toast(res.data.strMsg);
                    }
                })
                .catch((err) => {
                    this.$toast(err);
                });
        },

        // 跳转流程
        linkprocess() {
            this.$router.push({
                path: "/post/process",
                query: { strWorkId: getRequest().strWorkId },
            });
        },

        //收藏
        collectcommon(type) {
            var param = {
                strSid: localStorage.getItem("strSid"),
                strWorkId: getRequest().strWorkId,
                intType: type,
            };
            collectcommon(param)
                .then((res) => {
                    if (res.data.intCode == 200) {
                        if (this.isCollect) {
                            this.$toast("已取消收藏");
                            this.isCollect = false;
                        } else {
                            this.$toast("收藏成功");
                            this.isCollect = true;
                        }
                    } else {
                        this.$toast(res.data.strMsg);
                    }
                })
                .catch((err) => {
                    this.$toast(err);
                });
        },

        // 打开附件组件
        linkAttachment(num) {
            if (num > 0) {
                this.isShowAffix = true;
            } else {
                return false;
            }
        },

        // 附件传值
        getfileData(strFileId, strDeleteFileId, intSelectNum, type) {
            this.intFileCount = intSelectNum;
            this.isShowAffix = type;
        },
    },
};
</script>
<style lang='stylus'>
@import '~assets/stylus/mixin.styl';
.richText
    p
        width: 100% !important;
        span
            font-size: 16px !important;
.leave_index
    padding-top: 46px;
    // padding-bottom 60px
    background-color: #f6f6f6;
    min-height: 100%;
    .van-icon
        display: inline-block;
        vertical-align: middle;
        margin-right: 3px;
    .van-nav-bar__right
        i
            font-size: 22px;
            margin-left: 15px;
            display: inline-block;
            vertical-align: middle;
    .color_888
        color: #666;
        font-size: 16px;
        line-height: 30px;
    .van-icon
        display: inline-block;
        vertical-align: middle;
        margin-right: 3px;
    main
        padding: 10px;
        .item_box
            background-color: #fff;
            border-radius: 5px;
            padding: 15px;
            margin-bottom: 10px;
            .inner_box
                margin-bottom: 10px;
            .title_top, .title
                font-size: 16px;
                line-height: 28px;
                font-weight: 700;
                position: relative;
                margin-bottom: 10px;
                span
                    display: block;
                    position: absolute;
                    background-color: #137cfc;
                    width: 5px;
                    height: 15px;
                    top: 5px;
                    left: -15px;
            .title
                margin-bottom: 0;
.detail_text_bottom
    height: 40px;
    .fujian
        font(14px, 40px);
        color: #999999;
        i
            vertical-align: middle;
            margin-right: 4px;
    .van-tag
        margin-left: 10px;
</style>