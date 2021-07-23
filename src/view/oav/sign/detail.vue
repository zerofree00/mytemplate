<template>
    <div class="postDetail_body" :class="blShowDelete?'paddbtm_65':''">
        <!-- 头部 start -->
        <van-nav-bar @click-left="onleft">
            <template #left>
                <div class="color_000">
                    <van-icon name="arrow-left" class="arrow-left" />
                    <span class="header_title">签报详情</span>
                </div>
            </template>
            <template #right>
                <div class="color_000">
                    <van-icon class="iconfont" class-prefix="icon" name="banliliucheng" @click="linkProcess" />
                    <van-icon class="iconfont" class-prefix="icon" name="guanzhu" @click="collectcommon(1)" v-if="!isCollect" />
                    <van-icon class="iconfont color_index" class-prefix="icon" name="aixin" @click="collectcommon(2)" v-if="!!isCollect" />
                </div>
            </template>
        </van-nav-bar>
        <!-- 头部 end -->

        <!-- 主体 start -->
        <div class="postDetail_content">
            <!-- 标题部分 -->
            <div class="detail_text">
                <div class="detail_text_top">
                    <div class="detail_title">
                        <p>{{objTitle.strValue}}</p>
                        <span class="line"></span>
                    </div>
                    <div class="detail_tt_item">{{strDraftUnitName.strName}}：{{strDraftUnitName.strValue}}</div>
                    <div class="detail_tt_item">{{dtDraftDate.strName}}：{{dtDraftDate.strValue}}</div>
                </div>
                <div class="detail_text_bottom">
                    <span class="fujian fuAffix" @click="linkAttachment(intFileCount)">
                        <van-icon class="iconfont" class-prefix="icon" name="webfujian" />附件
                        <van-tag round color="#e8f2ff" text-color="#137cfc">{{this.intFileCount}}</van-tag>
                    </span>
                </div>
            </div>
            <!-- 标题部分 end-->
            <!-- 正文 -->
            <div class="detail_list" v-if="!!strContent.strValue">
                <div class="detail_list_item">
                    <h1>{{strContent.strName}}</h1>
                    <div class="textContent" @click="readContent(strContent.strValue)">
                        <img class="annex_item_img" :src="annexImg(strContent.strFileName)" alt /> {{strContent.strFileName}}
                    </div>
                </div>
            </div>
            <!-- 正文 end -->

            <div class="detail_list clearfix">
                <div class="detail_list_item" v-for="(item,index) in list" :key="index" :class="item.inline == 1?'item_inline':''">
                    <h1>{{item.strName}}</h1>
                    <p v-if="!!item.strValue && item.strValue!='null'">{{item.strValue}}</p>
                    <p v-if="!item.strValue || item.strValue=='null'">—</p>
                </div>
            </div>
        </div>
        <!-- 主体 end -->
        <!-- 删除 -->
        <div class="btn_box" v-if="blShowDelete">
            <div class="btn" @click="showDelDialog()">删除</div>
        </div>

        <!-- 组件 ---附件页面-->
        <affix v-if="isShowAffix" @getfileData="getfileData" :affixshow="affixshow" types="attachment"></affix>
    </div>
</template>
<script>
import { signedReportDetail, signdelete } from "@/api/sign";
import { getRequest } from "@/assets/js/util";
import { collectcommon, openWps } from "@/api/common";
import { setImgPath } from "@/assets/js/util";
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
            intFileCount: "", //附件数量
            objTitle: {}, // 标题
            strDraftUnitName: {}, // 来文单位
            dtDraftDate: {}, // 来文日期
            strContent: {}, //正文内容
            isCollect: "",
            blShowDelete: JSON.parse(getRequest().blShowDelete),
            isShowAffix: false,
            affixshow: false,
        };
    },
    created() {
        if (getRequest().backDetail == "true") {
            localStorage.setItem("strSid", getRequest().strSid);
        }
        this.getreceivedDetail();
    },
    methods: {
        // 附件
        getfileData(strFileId, strDeleteFileId, intSelectNum, type) {
            this.intFileCount = intSelectNum;
            this.isShowAffix = type;
        },

        getreceivedDetail() {
            var param = {
                strSid: localStorage.getItem("strSid"),
                websvrpwd: localStorage.getItem("websvrpwd"),
                strWorkId: getRequest().strWorkId,
                strModeCode: getRequest().type,
                intPageSize: "10",
            };
            signedReportDetail(param)
                .then((res) => {
                    console.log(res);
                    if (res.data.intCode === 200) {
                        this.isCollect = res.data.objData.blCollected;
                        this.intFileCount = res.data.objData.intFileCount;
                        this.list = res.data.objData.objFormList;
                        for (var i = 0; i < this.list.length - 1; i++) {
                            if (this.list[i].strKey == "strDocTitle") {
                                this.objTitle = this.list[i];
                                this.list.splice(i, 1);
                            }
                            if (this.list[i].strKey == "strDraftUnitName") {
                                this.strDraftUnitName = this.list[i];
                                this.list.splice(i, 1);
                            }
                            if (this.list[i].strKey == "dtDraftDate") {
                                this.dtDraftDate = this.list[i];
                                this.list.splice(i, 1);
                            }
                            if (this.list[i].strKey == "strContent") {
                                this.strContent = this.list[i];
                                this.list.splice(i, 1);
                                let arr = this.strContent.strValue.split("/");
                                this.strContent.strFileName = arr[arr.length - 1];
                            }

                            if (
                                this.list[i].strKey == "strYear" ||
                                this.list[i].strKey == "intNo"
                            ) {
                                this.list[i].inline = 1;
                            }
                        }
                    } else {
                        this.$toast(res.data.strMsg);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },

        // 删除弹出框
        showDelDialog() {
            this.$dialog
                .confirm({
                    title: "提示",
                    message: "删除后将无法恢复，确定删除？",
                })
                .then(() => {
                    this.signdelete();
                })
                .catch(() => {
                    // this.$toast("取消删除");
                });
        },

        signdelete() {
            var param = {
                strSid: localStorage.getItem("strSid"),
                strWorkId: getRequest().strWorkId,
            };
            signdelete(param)
                .then((res) => {
                    if (res.data.intCode == 200) {
                        this.$toast("删除成功");
                        this.$router.back();
                        localStorage.setItem("signDel", "true");
                    } else {
                        this.$toast(res.data.strMsg);
                    }
                })
                .catch((err) => {
                    console.log(err);
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

        linkProcess() {
            this.$router.push({
                path: "/post/process",
                query: { strWorkId: getRequest().strWorkId },
            });
        },

        // 查看正文
        readContent(strFileUrl) {
            var param = {
                strSid: localStorage.getItem("strSid"),
                strContent: strFileUrl,
                permission: "read",
            };
            openWps(param)
                .then((res) => {
                    if (res.data.intCode == 200) {
                        this.$router.push({
                            path: "/common/iframe",
                            query: { url: res.data.objData.objList[0].wpsUrl },
                        });
                    } else {
                        this.$toast(res.data.strMsg);
                    }
                })
                .catch((err) => {
                    this.$toast(err);
                });
        },

        // 附件图片转换
        annexImg(type) {
            var img = setImgPath(type);
            return img;
        },

        // 打开附件组件
        linkAttachment(num) {
            if (num > 0) {
                this.isShowAffix = true;
            } else {
                return false;
            }
        },
        onleft() {
            if (getRequest().backDetail == "true") {
                this.appRequest({}, 0);
            } else {
                this.$router.back();
            }
        },
    },
};
</script>
<style lang='stylus' scoped>
@import '~assets/stylus/mixin.styl';
.postDetail_body
    background: #f7f7f7;
    min-height: 100%;
    padding: 56px 10px 10px 10px;
    .color_000
        color: #000 !important;
        font-weight: 700;
    .arrow-left
        font-size: 16px;
        vertical-align: middle;
        margin-top: -3px;
    .van-nav-bar__right
        i
            font-size: 22px;
            margin-left: 15px;
            display: inline-block;
            vertical-align: middle;
    .postDetail_content
        .detail_text
            background: #ffffff;
            width: 100%;
            border-radius: 5px;
            padding: 15px 10px 0 10px;
            .detail_text_top
                padding: 0 5px 10px 5px;
                border-bottom: 1px solid #eee;
                .detail_title
                    position: relative;
                    p
                        font(16px, 30px);
                        font-weight: bold;
                    .line
                        width: 5px;
                        height: 15px;
                        background: #4688f5;
                        display: inline-block;
                        pos(7px, none, none, -15px, 1.1);
                .detail_tt_item
                    font(14px, 30px);
                    color: #666666;
            .detail_text_bottom
                height: 40px;
                .fujian
                    font(14px, 40px);
                    color: #999999;
                .van-tag
                    margin-left: 10px;
                .text
                    font(14px, 40px);
                    color: #137cfc;
                    i
                        vertical-align: middle;
                        margin-top: -3px;
                        margin-right: 5px;
        .detail_list
            padding: 10px;
            border-radius: 5px;
            background: #ffffff;
            margin-top: 10px;
            .detail_list_item
                margin-top: 10px;
                h1
                    font(16px, 30px);
                    color: #000;
                    font-weight: bold;
                p
                    font(14px, 25px);
                    color: #999999;
                .textContent
                    position: relative;
                    padding: 10px 10px 0 30px;
                    font(16px, 25px);
                    word-break: break-all;
                    .annex_item_img
                        pos(10px, none, none, 0px);
                        width: 25px;
                        height: 25px;
            .item_inline
                display: inline-block;
                width: 50%;
                float: left;
</style>