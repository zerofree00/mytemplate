<template>
    <div class="email_detail">
        <van-nav-bar fixed>
            <template #left>
                <van-icon name="arrow-left" @click="onleft" />
                <span class="header_title">邮件详情</span>
            </template>
            <template #right>
                <van-icon name="arrow-up" size="18" @click="clickPrev()" :class="!!strPrexMailId.strValue&&strPrexMailId.strValue.length>0?'':'color_999'" />
                <van-icon name="arrow-down" size="18" style="margin-left:20px" @click="clickNext()" :class="!!strNextMailId.strValue&&strNextMailId.strValue.length>0?'':'color_999'" />
            </template>
        </van-nav-bar>
        <!-- 主体 ------------start-------->
        <main>
            <div class="content_top">
                <div class="h3">
                    {{strTitle.strValue}}
                    <span v-if="strUrgency.strValue==1">紧急</span>
                </div>
                <div class="name_box">
                    <span class="name">{{strSendUserName.strValue}}</span>
                    <span class="time float_r">{{strTime.strValue}}</span>
                </div>
                <div class="sendPerson">
                    发送至：
                    <!-- ----------------------------------------收起 -->
                    <span v-if="!isellipsis">{{strRecUserName.strValue}}</span>
                    <span v-if="!isellipsis&&showhide" @click="showAllPer" style="color:#1989fa">
                        收起
                        <van-icon name="arrow-up" size="18" class="btm_arrow" />
                    </span>
                    <!-- ----------------------------------展开 -->
                    <span v-if="isellipsis">{{strRecUserName.str}}</span>
                    <span v-if="isellipsis" @click="showAllPer" style="color:#1989fa">
                        ...
                        <van-icon name="arrow-down" size="18" class="btm_arrow" />
                    </span>
                </div>
            </div>
            <div class="content" v-html="strContent.strValue"></div>

            <div class="affix_main">
                <div class="affix_item" v-for="(item,index) in objFileList" :key="index" @click="openPreview(item.strFileUrl)">
                    <div class="left_img">
                        <img :src="showImgType(item.strFileName)" alt />
                    </div>
                    <div class="right_con">
                        <div class="title">{{item.strFileName}}</div>
                        <div class="size_span">
                            <span class="size">{{item.intFileSize}}MB</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <!-- 主体 -----------end--------->

        <!-- foot开始 -->
        <!-- 收件箱 -->
        <ul class="tabbar_ul" v-if="intType==0">
            <li @click="linkedit('转发')">
                <!-- <van-icon name="setting-o" class="tabbar_icon" /> -->
                <van-icon class="iconfont tabbar_icon" class-prefix="icon" name="zhuanfa2" />

                <div>转发</div>
            </li>
            <li @click="linkedit('回复')">
                <van-icon class="iconfont tabbar_icon" class-prefix="icon" name="huifu" />
                <div>回复</div>
            </li>
            <li @click="isdelete()">
                <van-icon name="delete" class="tabbar_icon" />
                <div>删除</div>
            </li>
        </ul>

        <!-- 发件箱 -->
        <ul class="tabbar_ul2" v-if="intType==1">
            <li @click="linkedit('转发')">
                <van-icon class="iconfont tabbar_icon" class-prefix="icon" name="zhuanfa2" />
                <div>转发</div>
            </li>

            <li @click="isdelete()">
                <van-icon name="delete" class="tabbar_icon" />
                <div>删除</div>
            </li>
        </ul>
        <!-- foot结束 -->
        <van-image-preview v-model="showPreview" :images="previewList" :closeable="true" @close="previewList = []" :show-index="false"></van-image-preview>
    </div>
</template>
<script>
import { emailview, emailhandle, } from "@/api/email";
import { openWps } from "@/api/common";
import { setImgPath, getRequest, baseUrl } from "@/assets/js/util";
import { communication } from "@/assets/js/mixin";
export default {
    mixins: [communication],
    name: "email_detail",
    data() {
        return {
            strId: {},
            strTitle: {}, //标题
            strTime: {}, //时间
            strSendUserName: {}, //发件人
            strRecUserName: {}, //收件人
            strContent: {}, //内容
            strUrgency: {}, //是否紧急
            strPrexMailId: {}, //上一封
            strNextMailId: {}, //下一封
            objFileList: [], //附件
            isellipsis: false,
            showhide: false,
            intType: getRequest().intType,
            showPreview: false,
            previewList: []
        };
    },
    created() {
        if (getRequest().backDetail == "true") {
            localStorage.setItem("strSid", getRequest().strSid);
        }
        this.emailview(getRequest().strId);
    },
    methods: {

        openPreview(strFileUrl) {
            if (
                strFileUrl.split(".")[1] == "jpg" ||
                strFileUrl.split(".")[1] == "jpeg" ||
                strFileUrl.split(".")[1] == "png" ||
                strFileUrl.split(".")[1] == "gif" ||
                strFileUrl.split(".")[1] == "svg"
            ) {
                this.previewList.push(baseUrl + strFileUrl);
                this.showPreview = true;
            } else {
                this.readContent(strFileUrl);
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
            // }
        },
        // 转换图片类型
        showImgType(strFileName) {
            return setImgPath(strFileName);
        },
        // 已读接口
        detailRead(strId) {
            var param = {
                strSid: localStorage.getItem("strSid"),
                intType: 0,
                intActType: 1,
                strIds: strId,
            };
            emailhandle(param)
                .then((res) => {
                    if (res.data.intCode == 200) {
                        // this.linkedit(strId);
                        // localStorage.setItem("isRead", "true");
                    } else {
                        this.$toast(res.data.strMsg);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        isdelete() {
            this.$dialog
                .confirm({
                    title: "提示",
                    message: "邮件删除后将无法恢复，确定删除？",
                })
                .then(() => {
                    this.emailhandle();
                    // localStorage.setItem('isDelete','true')
                })
                .catch(() => {
                    // this.$toast("取消删除");
                });
        },
        // 删除
        emailhandle() {
            var param = {
                strSid: localStorage.getItem("strSid"),
                intType: this.intType,
                intActType: 0,
                strIds: this.strId.strValue,
            };
            emailhandle(param)
                .then((res) => {
                    if (res.data.intCode == 200) {
                        this.$toast("删除成功");
                        this.$router.back();
                        if (this.intType == 1) {
                            localStorage.setItem("outbox", "true");
                        }
                    } else {
                        this.$toast(res.data.strMsg)
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        // 详情
        emailview(strId = getRequest().strId) {
            var param = {
                strSid: localStorage.getItem("strSid"),
                strId: strId,
                intType: getRequest().intType,
                strKeywords: getRequest().strKeywords,
            };
            emailview(param)
                .then((res) => {
                    if (res.data.intCode == 200) {
                        res.data.objData.objFileList.forEach(item => {
                            item.intFileSize = ((item.intFileSize / 1024) / 1024).toFixed(2)
                        })
                        this.objFileList = res.data.objData.objFileList;
                        res.data.objData.objFormList.forEach((item) => {
                            if (item.strKey == "strId") {
                                this.strId = item;
                            }
                            if (item.strKey == "strTitle") {
                                this.strTitle = item;
                            }
                            if (item.strKey == "strTime") {
                                this.strTime = item;
                            }
                            if (item.strKey == "strSendUserName") {
                                this.strSendUserName = item;
                            }
                            if (item.strKey == "strRecUserName") {
                                this.strRecUserName = item;
                                if (this.strRecUserName.strValue.length > 20) {
                                    var str = this.strRecUserName.strValue;
                                    this.strRecUserName.str = str.slice(0, 20);
                                    this.isellipsis = true;
                                    this.showhide = true;
                                } else {
                                    this.strRecUserName.strValue = this.strRecUserName.strValue;
                                    this.isellipsis = false;
                                    this.showhide = false;
                                }
                            }
                            if (item.strKey == "strUrgency") {
                                this.strUrgency = item;
                            }
                            if (item.strKey == "strContent") {
                                this.strContent = item;
                            }
                            if (item.strKey == "strPrexMailId") {
                                this.strPrexMailId = item;
                            }
                            if (item.strKey == "strNextMailId") {
                                this.strNextMailId = item;
                            }

                        });
                        if (this.intType == 0) {
                            this.detailRead(this.strId.strValue)

                        }
                    } else {
                        this.$toast(res.data.strMsg)
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        clickPrev() {
            if (this.strPrexMailId.strValue.length > 0) {
                this.emailview(this.strPrexMailId.strValue);
                return;
            }
        },
        clickNext() {
            if (this.strNextMailId.strValue.length > 0) {
                this.emailview(this.strNextMailId.strValue);
                return;
            }
        },
        showAllPer() {
            this.isellipsis = !this.isellipsis;
        },
        linkedit(title) {
            this.$router.push({
                path: "/email/edit",
                query: {
                    title: title,
                    strId: this.strId.strValue,
                    intType: this.intType,
                },
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
.email_detail
    padding 60px 0 50px
    main
        .content_top
            padding 0 15px 15px
            border-bottom 1px solid #eee
            .h3
                font-size 16px
                color #000
                line-height 26px
                span
                    font-size 12px
                    border 1px solid red
                    color red
                    border-radius 5px
                    padding 0px 5px
            .name_box
                font-size 12px
                margin-top 20px
                .time
                    color #999
            .sendPerson
                width 100%
                font-size 12px
                color #888
                line-height 20px
                margin-top 5px
                .btm_arrow
                    display inline-block
                    vertical-align middle
        .content
            font-size 14px
            line-height 28px
            padding 25px 15px
        .affix_main
            padding 0 15px
            background-color #f8f8f8
            .affix_item
                display flex
                .left_img
                    width 10%
                    height 50px
                    padding-top 20px
                    img
                        width 100%
                        height 100%
                .right_con
                    width 90%
                    border-bottom 1px solid #eee
                    padding 15px 0 15px 15px
                    .title
                        font-size 14px
                        line-height 22px
                        margin-bottom 5px
                    .size_span
                        font-size 12px
                        color #999
    .tabbar_ul, .tabbar_ul2
        height 50px
        width 100%
        background-color #fff
        position fixed
        bottom 0px
        left 0
        display flex
        border-top 1px solid #f6f6f6
        // justify-content space-between
        li
            width 33%
            padding-top 8px
            text-align center
            font-size 14px
            color #666
            .tabbar_icon
                color #666
                font-size 16px
                display inline-block
                margin-bottom 6px !important
    .tabbar_ul2
        li
            width 50%
</style>