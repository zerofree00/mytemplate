<template>
    <div class="postDetail_body" :class="blShowDelete?'paddbtm_65':''">
        <!-- 头部 start -->
        <van-nav-bar @click-left="onleft">
            <template #left>
                <div class="color_000">
                    <van-icon name="arrow-left" class="arrow-left" />
                    <span class="header_title">发文详情</span>
                </div>
            </template>
            <template #right>
                <div class="color_000">
                    <van-icon class="iconfont" class-prefix="icon" name="banliliucheng" @click="linkProcess" />
                    <van-icon class="iconfont" class-prefix="icon" name="fenfajilu" @click="linkrecord" v-if="blShowHandList" />
                    <van-icon class="iconfont" class-prefix="icon" name="guanzhu" @click="collectcommon(1)" v-if="!isCollect" />
                    <van-icon class="iconfont color_index" class-prefix="icon" name="aixin" @click="collectcommon(2)" v-if="!!isCollect" />
                </div>
            </template>
        </van-nav-bar>
        <!-- 头部 end -->

        <!-- 主体 start -->
        <div class="postDetail_content">
            <!---------------------------------------------------标题 ----------------------------------- -->
            <div class="detail_text">
                <div class="detail_text_top">
                    <div class="detail_title">
                        <p>{{objTitle.strValue}}</p>
                        <span class="line"></span>
                    </div>
                    <div class="detail_tt_item">{{strSendUnitName.strName}}：{{strSendUnitName.strValue}}</div>
                    <div class="detail_tt_item">{{strSendDocDate.strName}}：{{strSendDocDate.strValue}}</div>
                </div>
                <div class="detail_text_bottom">
                    <span class="fujian fuAffix" @click="linkAttachment(intFileCount)">
                        <van-icon class="iconfont" class-prefix="icon" name="webfujian" />附件
                        <van-tag round color="#e8f2ff" text-color="#137cfc">{{this.intFileCount}}</van-tag>
                    </span>
                    <span class="text float_r" @click="readContent()" v-if="!!strContent.strValue&&strContent.strValue.length>0">
                        <van-icon class="iconfont" class-prefix="icon" name="chakan" />查看正文
                    </span>
                </div>
            </div>
            <!-- ---------------------------------标题  --------------end--------------------------------------------------------------- -->

            <!--------------------------------- 正文 ---------------->
            <!-- <div class="detail_list" v-if="!!strContent.strValue">
        <div class="detail_list_item">
          <h1>{{strContent.strName}}</h1>
          <div class="content">{{strContent.strValue}}</div>
        </div>
      </div>-->
            <!-- -------------------------------------------------正文 end -->
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
import { postDetail, senddelete } from "@/api/post";
import { getRequest } from "@/assets/js/util";
import { collectcommon, openWps } from "@/api/common";
import { communication } from "@/assets/js/mixin";
import affix from "@/components/attachment/affix.vue";
export default {
    components: {
        affix,
    },
    name: "post_detail",
    mixins: [communication],
    data() {
        return {
            list: [],
            intFileCount: "", //附件数量
            objTitle: {}, // 标题
            strSendUnitName: {}, // 发文单位
            strSendDocDate: {}, // 发文时间
            blShowHandList: "",
            isCollect: "", //是否被收藏
            blShowDelete: JSON.parse(getRequest().blShowDelete),
            strContent: {},
            isShowAffix: false,
            affixshow: false,
        };
    },
    created() {
        if (getRequest().backDetail == "true") {
            localStorage.setItem("strSid", getRequest().strSid);
        }
        this.getpostDetail();
    },
    methods: {
        // 附件
        getfileData(strFileId, strDeleteFileId, intSelectNum, type) {
            this.intFileCount = intSelectNum;
            this.isShowAffix = type;
        },

        // 获取发文详情
        getpostDetail() {
            var param = {
                strSid: localStorage.getItem("strSid"),
                websvrpwd: localStorage.getItem("websvrpwd"),
                strWorkId: getRequest().strWorkId,
                strModeCode: getRequest().type,
                intPageSize: "10",
            };
            postDetail(param)
                .then((res) => {
                    if (res.data.intCode === 200) {
                        this.intFileCount = res.data.objData.intFileCount;
                        this.isCollect = res.data.objData.blCollected;
                        this.blShowHandList = res.data.objData.blShowHandList;
                        this.list = res.data.objData.objFormList;
                        for (var i = 0; i < this.list.length; i++) {
                            if (this.list[i].strKey == "strTitle") {
                                this.objTitle = this.list[i];
                                this.list.splice(i, 1);
                            }
                            if (this.list[i].strKey == "strSendUnitName") {
                                this.strSendUnitName = this.list[i];
                                this.list.splice(i, 1);
                            }
                            if (this.list[i].strKey == "strSendDocDate") {
                                this.strSendDocDate = this.list[i];
                                this.list.splice(i, 1);
                            }
                            if (this.list[i].strKey == "strContent") {
                                this.strContent = this.list[i];
                                this.list.splice(i, 1);
                            }

                            if (
                                this.list[i].strKey == "strDocKindName" ||
                                this.list[i].strKey == "strUrgency" ||
                                this.list[i].strKey == "strDraftUserName" ||
                                this.list[i].strKey == "dtDraftDate" ||
                                this.list[i].strKey == "intPrintNum" ||
                                this.list[i].strKey == "strPrintDate"
                            ) {
                                this.list[i].inline = 1;
                            }
                        }
                    } else {
                        this.$toast(res.data.strMsg);
                    }
                })
                .catch((err) => {
                    this.$toast(err);
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
                    this.senddelete();
                })
                .catch(() => {
                    // this.$toast("取消删除");
                });
        },
        // 删除发文
        senddelete() {
            var param = {
                strSid: localStorage.getItem("strSid"),
                strWorkId: getRequest().strWorkId,
            };
            senddelete(param)
                .then((res) => {
                    if (res.data.intCode == 200) {
                        this.$toast("删除成功");
                        this.$router.back();
                        localStorage.setItem("sendDel", "true");
                    } else {
                        this.$toast(res.data.strMsg);
                    }
                })
                .catch((err) => {
                    this.$toast(err);
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
        // 查看正文
        readContent() {
            var param = {
                strSid: localStorage.getItem("strSid"),
                strContent: this.strContent.strValue,
                permission: "read",
            };
            openWps(param)
                .then((res) => {
                    if (res.data.intCode == 200) {
                        localStorage.setItem("wpsUrl", res.data.objData.wpsUrl);
                        this.$router.push({
                            path: "/common/iframe",
                        });
                    } else {
                        this.$toast(res.data.strMsg);
                    }
                })
                .catch((err) => {
                    this.$toast(err);
                });
        },

        linkAttachment(num) {
            // if (num > 0) {
            this.isShowAffix = true;
            // } else {
            //   return false;
            // }
        },
        linkrecord() {
            this.$router.push({
                path: "/post/record",
                query: { strWorkId: getRequest().strWorkId },
            });
        },
        linkProcess() {
            this.$router.push({
                path: "/post/process",
                query: { strWorkId: getRequest().strWorkId },
            });
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
    width: 100%;
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
    .like-o
        display: inline-block;
        vertical-align: baseline;
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
                        font(15px, 30px);
                        color: #222;
                        font-weight: bold;
                        word-break: break-all;
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
                .content
                    font-size: 14px;
                    line-height: 24px;
                    word-break: break-all;
                h1
                    font(15px, 30px);
                    color: #222;
                    font-weight: bold;
                p
                    font(14px, 25px);
                    color: #999999;
                    // height 25px
            .item_inline
                display: inline-block;
                width: 50%;
</style>