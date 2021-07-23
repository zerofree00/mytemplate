<template>
    <div class="post_edit_body_box">
        <div class="post_edit_body" v-if="!isShowAffix">
            <!-- 头部 start -->
            <van-nav-bar @click-left="onleft">
                <template #left>
                    <div class="color_000">
                        <van-icon name="arrow-left" class="arrow-left" />
                        <span class="header_title">签报办理</span>
                    </div>
                </template>
                <template #right>
                    <div class="color_000">
                        <van-icon class="iconfont like-o" class-prefix="icon" name="banliliucheng" @click="linkprocess" />
                    </div>
                </template>
            </van-nav-bar>
            <!-- 头部 end -->

            <!-- 主体 start-->
            <div class="post_edit_main">
                <div class="post_edit_main_title">
                    <p>
                        {{objTitle.strName}}
                        <i>*</i>
                    </p>
                    <van-field v-model="objTitle.strValue" rows="1" autosize :readonly="objTitle.intType==0? true:false" type="textarea" placeholder="请输入" />
                </div>

                <div class="post_edit_main_title mt10" v-if="!!strContent.strValue">
                    <p>{{strContent.strName}}</p>
                    <div class="textContent" @click="readContent(strContent.strValue)">
                        <img class="annex_item_img" :src="annexImg(strContent.strFileName)" alt /> {{strContent.strFileName}}
                    </div>
                </div>

                <div class="mt10">
                    <div class="edit_main_item" v-for="(item, index) in list" :key="index">
                        <van-field v-if="item.intType==0" v-model="item.strValue" :label="item.strName" readonly />
                        <van-field v-if="item.intType == 1 || item.intType == 2 " v-model="item.strValue" :label="item.strName" :input-align="item.intType == 1?'':'right'" :placeholder="item.strName" :readonly="item.intType == 1" />
                    </div>
                </div>
                <!-- -----------------------附件----------------------------------------------------------------start -->

                <div class="post_edit_main_title post_edit_line_bot" @click="isShowAffix = true">
                    <p>
                        <span class="label">附件</span>
                        <span class="float_r fujian">
                            <van-tag round type="primary">{{intFileCount}}</van-tag>
                            <van-icon name="arrow" />
                        </span>
                    </p>
                </div>
            </div>
            <!-- 主体 end-->
            <!-- 底部 -->
            <div class="post_edit_foot">
                <div class="post_submit">
                    <button @click="submitpostCheck(0)">提交</button>
                </div>
                <div class="post_foot_tools" v-if="blShowAssist || blShowDelete">
                    <div class="post_foot_item" @click="submitpostCheck(1)" v-if="blShowAssist">
                        <van-icon class="iconfont" class-prefix="icon" name="xieban-copy" />
                        <p>协办</p>
                    </div>
                    <div class="post_foot_item" v-if="blShowDelete" @click="showDelDialog()">
                        <van-icon class="iconfont" class-prefix="icon" name="lajitong" />
                        <p>删除</p>
                    </div>
                </div>
            </div>

            <van-popup v-model="isPicker" round position="bottom">
                <van-picker show-toolbar :columns="pickerList" @cancel="isPicker = false" @confirm="onConfirm" />
            </van-popup>

            <van-popup v-model="isTimePicker" position="bottom">
                <van-datetime-picker v-model="currentDate" type="date" title="选择年月日" :min-date="minDate" :max-date="maxDate" @confirm="onConfirm" />
            </van-popup>
        </div>
        <van-popup v-model="isTimePicker" position="bottom">
            <van-datetime-picker v-model="currentDate" :type="timetype==8?'date':'datetime'" title="选择时间" :min-date="minDate" :max-date="maxDate" @confirm="onConfirm" />
        </van-popup>
        <!-- 组件 ---附件页面-->
        <affix v-if="isShowAffix" @getfileData="getfileData" :affixshow="affixshow"></affix>
    </div>
</template>
<script>
import {
    signedReportDetail,
    signedDoCheckHandler,
    signdelete,
} from "@/api/sign";
import { communication } from "@/assets/js/mixin";
import { collectcommon, openWps } from "@/api/common";
import { keepList } from "@/assets/js/util";
import affix from "@/components/attachment/affix.vue";
import {
    concatStr,
    setImgPath,
    timeFormat,
    getRequest,
} from "@/assets/js/util";
export default {
    components: {
        affix,
    },
    name: "sign_handle",
    mixins: [communication],
    data() {
        return {
            isurge: "",
            pickerType: "",
            minDate: new Date(2020, 0, 1),
            maxDate: new Date(2025, 10, 1),
            currentDate: new Date(), //时间
            isTimePicker: false, //时间选择状态
            reason: "",
            isPicker: false, //公文分类选择状态
            pickerList: [],
            checkboxGroup: [],
            list: [],
            intFileCount: "", //附件数量
            objTitle: {}, // 标题
            strContent: {}, //正文内容
            strFileName: {}, //正文文件名称
            strFilePath: {}, //正文文件路径
            strNewFileName: {}, //正文文件新名称
            isCollect: "",
            isShowAffix: false,
            affixshow: true,
            strFileId: "",
            strDeleteFileId: "",
            blShowAssist: "",
            timetype: 8,
            blShowDelete: JSON.parse(getRequest().blShowDelete),
        };
    },
    created() {
        this.$store.commit("SET_KEEPALIVE", keepList);
        if (getRequest().backDetail == "true") {
            localStorage.setItem("strSid", getRequest().strSid);
        }
        this.getpostDetail();
    },
    methods: {
        // 办理流程
        linkprocess() {
            this.$router.push({
                path: "/post/process",
                query: { strWorkId: getRequest().strWorkId },
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

        hasAppData(e) {

            if (JSON.parse(e).data.submitType == 1) {
                // this.$router.go(-1);
                localStorage.setItem("signDel", 'true');
                this.onleft()
            }
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
                    // console.log(err);
                });
        },
        getfileData(strFileId, strDeleteFileId, intSelectNum, type) {
            this.strFileId = strFileId;
            this.strDeleteFileId = strDeleteFileId;
            this.intFileCount = intSelectNum;
            this.isShowAffix = type;
        },
        // 公文分类选择框
        onChoose(that) {
            this.pickerType = that.strKey;
            this.thatNew = that;
            if (that.intType == 4) {
                this.isPicker = true;
                that.objCheckedList.forEach((item) => {
                    item.text = item.strChecked_name;
                });
                this.pickerList = that.objCheckedList;
            }
            if (that.intType == 8 || that.intType == 9) {
                this.isTimePicker = true;
                this.timetype = that.intType;
            }
        },
        // picker确认
        onConfirm(val) {
            console.log(val);
            if (this.thatNew.intType == 4) {
                this.thatNew.text = val.text;
                this.thatNew.strValue = val.strChecked_id; //重新赋值strValue
                this.isPicker = false;
            }
            if (this.thatNew.intType == 8 || this.thatNew.intType == 9) {
                this.thatNew.strValue = timeFormat(
                    this.currentDate,
                    this.thatNew.intType
                );
                this.isTimePicker = false;
            }
        },
        // 获取列表详情
        getpostDetail() {
            var param = {
                strSid: localStorage.getItem("strSid"),
                websvrpwd: localStorage.getItem("websvrpwd"),
                strWorkId: getRequest().strWorkId,
                strModeCode: getRequest().type,
                intPageSize: "10",
            };
            signedReportDetail(param)
                .then((res) => {
                    if (res.data.intCode === 200) {
                        this.intFileCount = res.data.objData.intFileCount;
                        this.isCollect = res.data.objData.blCollected;
                        this.blShowAssist = res.data.objData.blShowAssist;
                        // this.blShowAssist=true/
                        res.data.objData.objFormList.forEach((item) => {
                            if (item.strValue == undefined) {
                                item.strValue = "";
                            } else {
                                item.strValue = item.strValue;
                            }
                        });
                        this.list = res.data.objData.objFormList;
                        for (var i = 0; i < this.list.length; i++) {
                            if (this.list[i].strKey == "strDocTitle") {
                                this.objTitle = this.list[i];
                                this.list.splice(i, 1);
                            }
                            if (this.list[i].strKey == "strContent") {
                                this.strContent = this.list[i];
                                this.list.splice(i, 1);
                                let arr = this.strContent.strValue.split("/");
                                this.strContent.strFileName = arr[arr.length - 1];
                            }
                            // 正文文件名称
                            if (this.list[i].strKey == "strFileName") {
                                this.strFileName = this.list[i];
                                localStorage.setItem(
                                    "strFileNameValue",
                                    this.strFileName.strValue
                                );
                                this.list.splice(i, 1);
                            }

                            // 正文文件新名称
                            if (this.list[i].strKey == "strNewFileName") {
                                this.strNewFileName = this.list[i];
                                this.list.splice(i, 1);
                            }

                            // 正文文件路径
                            if (this.list[i].strKey == "strFilePath") {
                                this.strFilePath = this.list[i];
                                this.list.splice(i, 1);
                            }

                            // 正文文件路径
                            if (this.list[i].intType == "-1") {
                                this.list.splice(i, 1);
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

        // 签报管理
        submitpostCheck(intType) {
            var param = {
                strSid: localStorage.getItem("strSid"),
                websvrpwd: localStorage.getItem("websvrpwd"),
                strWorkId: getRequest().strWorkId,
                intType: intType,
                strFileId: this.strFileId,
                strDeleteFileId: this.strDeleteFileId,
            };

            let arr = [];
            arr.push(this.objTitle);
            this.list.forEach((item) => {
                arr.push(item);
            });
            arr.forEach((item) => {
                if (item.intType != 0) {
                    param[item.strKey] = item.strValue;
                }
            });
            signedDoCheckHandler(param)
                .then((res) => {
                    if (res.data.intCode === 200) {
                        // 传下一节点
                        res.data.objData.intType = param.intType;
                        res.data.objData.strModeCode = 320;
                        let data = { objData: res.data.objData };
                        this.appRequest(data, 3);
                    } else {
                        this.$toast(res.data.strMsg);
                    }
                })
                .catch((err) => {
                    // console.log(err);

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
        readContent(val) {
            localStorage.setItem("strFileNameValue", this.strNewFileName.strValue);
            var param = {
                strSid: localStorage.getItem("strSid"),
                strContent: val,
                strNewFileName: this.strNewFileName.strValue,
                strFilePath: this.strFilePath.strValue,
                permission: "write",
            };
            //   console.log(param);
            openWps(param)
                .then((res) => {
                    if (res.data.intCode == 200) {
                        // this.$router.push({
                        //     path: "/common/iframe",
                        //     query: { url: res.data.objData.objList[0].wpsUrl },
                        // }); 

                        this.$router.push({
                            path: "/common/iframe",
                            query: { url: res.data.objData.wpsUrl },
                        });
                        localStorage.setItem("wpsUrl", res.data.objData.wpsUrl)
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

        onleft() {
            if (getRequest().backDetail == "true") {
                this.appRequest({}, 0);
            } else {
                this.$router.back();
            }
        },
    },
    beforeRouteLeave(to, from, next) {
        if (to.name != "url_iframe") {
            var newList = [];
            for (let i = 0; i < keepList.length; i++) {
                if (keepList[i] != "sign_handle") {
                    newList.push(keepList[i]);
                }
            }
            console.log(newList);
            this.$store.commit("SET_KEEPALIVE", newList);
        }
        next();
    },
};
</script>
<style lang='stylus' scoped>
@import '~assets/stylus/mixin.styl'
.post_edit_body_box
    background #f7f7f7
    height 100%
.post_edit_body
    padding-top 55px
    padding-bottom 80px
    .color_000
        color #000 !important
        font-weight 700
    .arrow-left
        font-size 16px
        vertical-align middle
        margin-top -3px
    .van-nav-bar__right
        i
            font-size 22px
            margin-left 15px
            display inline-block
            vertical-align middle
    .like-o
        font-size 22px
        margin 0 10px
    .post_edit_main
        .post_edit_main_title
            padding 12px 0
            background #fff
            .textContent
                position relative
                padding 10px 10px 0 40px
                font(16px, 25px)
                word-break break-all
                .annex_item_img
                    pos(10px, none, none, 10px)
                    width 25px
                    height 25px
            p
                font(16px, 26px)
                color #000
                padding 0 16px
                i
                    color red
                    &.edit
                        float right
                        color #137cfc
                        font-size 18px
                span
                    margin-left 15px
                    color #666666
                    &.label
                        margin-left 0
                        display inline-block
                        width 70px
                    &.fujian
                        display flex
                        align-items center
                        .van-tag
                            color #ffffff
                        i
                            color #aaaaaa
                            margin-left 5px
        .post_edit_main_list
            margin-top 10px
            .textConEdit
                color #137cfc
                i
                    vertical-align middle
                        margin-top -3px
                        margin-right 4px
                        font(16px, 20px)
.edit_main_item
    border-top 1px solid #f6f6f6
.post_edit_line_bot
    border-bottom 1px solid #f6f6f6
.post_edit_main_type
    font(16px, 30px)
    color #999
    padding 0 15px
// 底部提交
.post_edit_foot
    background #ffffff
    width 100%
    padding 10px 15px
    border-top 1px solid #eee
    pos(none, 0, 0, 0, 0, 100)
    display flex
    justify-content space-between
    .post_submit
        width 100%
        button
            width 100%
            height 40px
            font-size 16px
            border none
            background #137cfc
            color #ffffff
            border-radius 5px
    .post_foot_tools
        width 35%
        display flex
        justify-content center
        .post_foot_item
            width 50%
            text-align center
            margin-top -3px
            i
                font-size 20px
            p
                font-size 14px
</style>

