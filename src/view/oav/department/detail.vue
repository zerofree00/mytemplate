<template>
    <div class="receivedDetail_body">
        <!-- 完成 -->
        <!-- 头部 start -->
        <van-nav-bar @click-left="onleft">
            <template #left>
                <div class="color_000">
                    <van-icon name="arrow-left" class="arrow-left" />
                    <span class="header_title">公文详情</span>
                </div>
            </template>
            <template #right>
                <div class="color_000">
                    <!-- <van-icon name="add-o" class="add-o" /> -->
                    <!-- <van-icon name="like-o" class="like-o" /> -->
                </div>
            </template>
        </van-nav-bar>
        <!-- 头部 end -->

        <!-- 主体 start -->
        <div class="receivedDetail_content">
            <!-- 标题 start-->
            <div class="receivedDetail_text">
                <div class="receivedDetail_text_top">
                    <div class="detail_title">
                        <p>{{strDocTitle.strValue}}</p>
                        <span class="line"></span>
                    </div>
                    <div class="detail_tt_item">{{strSendUnitName.strName}}：{{strSendUnitName.strValue}}</div>
                    <div class="detail_tt_item" v-if="!!strSendDocDate.strValue">{{strSendDocDate.strName}}：{{strSendDocDate.strValue}}</div>
                </div>
                <div class="detail_text_bottom">
                    <span class="fujian fuAffix" @click="linkAttachment(intFileCount)">
                        <van-icon class="iconfont" class-prefix="icon" name="webfujian" />附件
                        <van-tag round color="#e8f2ff" text-color="#137cfc">{{this.intFileCount}}</van-tag>
                    </span>
                </div>
            </div>
            <!-- 标题 end-->

            <!-- 正文内容 start -->
            <div class="receivedDetail_version" v-if="!!strContent.strValue">
                <h1 class="label">{{strContent.strName}}</h1>
                <div class="content" @click="readContent(strContent.strValue)">
                    <img class="annex_item_img" :src="annexImg(strContent.strFileName)" alt /> {{strContent.strFileName}}
                </div>
            </div>
            <!-- 正文内容 end -->

            <!-- 文件信息 start -->
            <div class="receivedDetail_msg clearfix">
                <div class="receivedDetail_item item_inline">
                    <h1 class="label">{{strDocKindId.strName}}</h1>
                    <p class="value">{{strDocKindId.strValue}}</p>
                </div>
                <div class="receivedDetail_item item_inline">
                    <h1 class="label">{{strUrgency.strName}}</h1>
                    <p class="value">{{strUrgency.strValue}}</p>
                </div>
                <div class="receivedDetail_item">
                    <h1 class="label">{{strDocNoName.strName}}</h1>
                    <p class="value">{{strDocNoName.strValue}}</p>
                </div>
            </div>
            <!-- 文件信息 end -->

            <!-- 文件信息 start -->
            <div class="receivedDetail_msg clearfix">
                <div class="receivedDetail_state">
                    <div class="state_item cyan_c" v-if="this.intStateCode =='3'">已签收</div>
                    <div class="state_item orange_c" v-if="this.intStateCode =='4'">已拒收</div>
                </div>
                <div class="receivedDetail_item">
                    <h1 class="label">{{strSignIdea.strName}}</h1>
                    <p class="value">{{strSignIdea.strValue}}</p>
                </div>
                <div class="receivedDetail_item item_inline">
                    <h1 class="label">{{strRecUserName.strName}}</h1>
                    <p class="value">{{strRecUserName.strValue}}</p>
                </div>
                <div class="receivedDetail_item item_inline">
                    <h1 class="label">{{strRecDate.strName}}</h1>
                    <p class="value">{{strRecDate.strValue}}</p>
                </div>
                <div class="receivedDetail_item">
                    <h1 class="label">{{strRecUnitName.strName}}</h1>
                    <p class="value">{{strRecUnitName.strValue}}</p>
                </div>
            </div>
            <!-- 文件信息 end -->
        </div>
        <!-- 主体 end -->

        <!-- 组件 ---附件页面-->
        <affix v-if="isShowAffix" @getfileData="getfileData" :affixshow="affixshow" :strChgDocWorkId="strChgDocWorkId" :types="this.attachmentTypes"></affix>
    </div>
</template>
<script>
import { deptdetail } from "@/api/department";
import { openWps } from "@/api/common";
import { setImgPath, getRequest } from "@/assets/js/util";
import { communication } from "@/assets/js/mixin";
import affix from "@/components/attachment/affix.vue";
export default {
    mixins: [communication],
    components: {
        affix,
    },
    data() {
        return {
            attachmentTypes: "",//附件类型
            list: [],
            intStateCode: getRequest().code, //状态
            intFileCount: "", //附件数量
            strDocTitle: {}, // 标题
            strSendUnitName: {}, //来文单位
            strSendDocDate: {}, //来文时间
            strContent: {}, //正文内容
            strDocKindId: {}, //来文种类
            strUrgency: {}, //紧急程度
            strDocNoName: {}, //来文字号
            strRecUserName: {}, //签收人
            strSignIdea: {}, //签收意见
            strRecDate: {}, // 签收时间
            strRecUnitName: {}, //签收单位
            isShowAffix: false,
            affixshow: false,
            strChgDocWorkId: this.$route.query.strChgDocWorkId,
        };
    },
    created() {
        if (getRequest().backDetail == "true") {
            localStorage.setItem("strSid", getRequest().strSid);
        }
        this.deptdetail();
    },
    methods: {
        // 附件
        getfileData(strFileId, strDeleteFileId, intSelectNum, type) {
            this.intFileCount = intSelectNum;
            this.isShowAffix = type;
        },

        // 返回
        onleft() {
            if (getRequest().backDetail == "true") {
                this.appRequest({}, 0);
            } else {
                this.$router.back();
            }
        },

        // 获取收文列表详情数据
        deptdetail() {
            var param = {
                strSid: localStorage.getItem("strSid"),
                websvrpwd: localStorage.getItem("websvrpwd"),
                strWorkId: getRequest().strWorkId,
                strModeCode: getRequest().type,
            };
            deptdetail(param)
                .then((res) => {
                    console.log(res);
                    if (res.data.intCode === 200) {
                        this.intFileCount = res.data.objData.intFileCount;
                        this.list = res.data.objData.objFormList;
                        for (var i = 0; i < this.list.length; i++) {
                            if (this.list[i].strKey == "strDocTitle") {
                                this.strDocTitle = this.list[i];
                            }
                            if (this.list[i].strKey == "strSendUnitName") {
                                this.strSendUnitName = this.list[i];
                            }
                            if (this.list[i].strKey == "strSendDocDate") {
                                this.strSendDocDate = this.list[i];
                            }
                            if (this.list[i].strKey == "strContent") {
                                this.strContent = this.list[i];
                                let arr = this.strContent.strValue.split("/");
                                this.strContent.strFileName = arr[arr.length - 1];
                            }
                            if (this.list[i].strKey == "strDocKindId") {
                                this.strDocKindId = this.list[i];
                                if (!this.list[i].strValue || this.list[i].strValue == "null") {
                                    this.strDocKindId.strValue = "—";
                                }
                            }
                            if (this.list[i].strKey == "strUrgency") {
                                this.strUrgency = this.list[i];
                            }
                            if (this.list[i].strKey == "strDocNoName") {
                                this.strDocNoName = this.list[i];
                            }
                            if (this.list[i].strKey == "strRecUserName") {
                                this.strRecUserName = this.list[i];
                            }
                            if (this.list[i].strKey == "strSignIdea") {
                                this.strSignIdea = this.list[i];
                                if (!this.list[i].strValue) {
                                    this.strSignIdea.strValue = "—";
                                }
                            }
                            if (this.list[i].strKey == "strRecDate") {
                                this.strRecDate = this.list[i];
                                if (!this.list[i].strValue || this.list[i].strValue == "null") {
                                    this.strRecDate.strValue = "—";
                                }
                            }
                            if (this.list[i].strKey == "strRecUnitName") {
                                this.strRecUnitName = this.list[i];
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

        // 点击调用附件
        linkAttachment(num) {
            if (num > 0) {
                this.attachmentTypes = 'attachment';
                this.isShowAffix = true;
            } else {
                return false;
            }
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

        // 附件图片转换
        annexImg(type) {
            var img = setImgPath(type);
            return img;
        },
    },
};
</script>
<style lang='stylus' scoped>
@import '~assets/stylus/mixin.styl';
.receivedDetail_body
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
        font-size: 22px;
        margin-left: 10px;
// 主体
.receivedDetail_content
    .receivedDetail_text
        background: #ffffff;
        width: 100%;
        border-radius: 5px;
        padding: 15px 10px 0 10px;
        .receivedDetail_text_top
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
    .receivedDetail_version
        background: #ffffff;
        width: 100%;
        border-radius: 5px;
        padding: 15px 10px;
        margin-top: 10px;
        .content
            position: relative;
            padding: 10px 10px 0 30px;
            font(16px, 25px);
            word-break: break-all;
            .annex_item_img
                pos(10px, none, none, 0px);
                width: 25px;
                height: 25px;
    .receivedDetail_msg
        background: #ffffff;
        width: 100%;
        border-radius: 5px;
        padding: 15px 10px;
        margin-top: 10px;
.label
    font(16px, 30px);
    color: #000;
.value
    font(14px, 30px);
    color: #888;
.item_inline
    width: 50%;
    display: inline-block;
    float: left;
.receivedDetail_state
    position: relative;
    height: 30px;
    .state_item
        height: 25px;
        font(14px, 25px);
        padding: 0 15px;
        pos(0, none, none, -14px, 1, 10);
        border-top-right-radius: 5px;
</style>