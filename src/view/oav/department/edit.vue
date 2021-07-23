<template>
    <div>
        <div class="post_edit_body" v-if="!isShowAffix">
            <!-- 完成 -->
            <!-- 头部 start -->
            <van-nav-bar @click-left="onleft">
                <template #left>
                    <div class="color_000">
                        <van-icon name="arrow-left" class="arrow-left" />
                        <span class="header_title">收文办理</span>
                    </div>
                </template>
                <template #right>
                    <div class="color_000">
                        <van-icon class="iconfont like-o" class-prefix="icon" name="banliliucheng" @click="linkprocess" />
                        <van-icon class="iconfont like-o" class-prefix="icon" name="fenfajilu" @click="linkrecord" v-if="blShowHandList" />
                        <van-icon class="iconfont" class-prefix="icon" name="guanzhu" @click="collectcommon(1)" v-if="!isCollect" />
                        <van-icon class="iconfont color_index" class-prefix="icon" name="aixin" @click="collectcommon(2)" v-if="!!isCollect" />
                    </div>
                </template>
            </van-nav-bar>
            <!-- 头部 end -->

            <!-- 主体 start-->
            <div class="post_edit_main">
                <div class="post_edit_main_title">
                    <p>
                        文件标题
                        <i>*</i>
                    </p>
                    <van-field v-model="strDocTitle.strValue" rows="1" autosize readonly type="textarea" placeholder="请输入" />
                </div>

                <!-- -----------------------正文内容----------------------------------------------------------------start -->
                <div class="post_edit_main_title mt10" v-if="!!this.strContent.strValue">
                    <p>正文内容</p>
                    <div class="textContent" @click="readContent(strContent.strValue)">
                        <img class="annex_item_img" :src="annexImg(strContent.strFileName)" alt /> {{strContent.strFileName}}
                    </div>
                </div>

                <div class="post_edit_main_list">
                    <div class="edit_main_item" v-for="(item, index) in list" :key="index">
                        <!-- 当为0或1仅展示 -->
                        <van-field v-if="item.intType==0 || item.intType==1 " v-model="item.strValue" :label="item.strName" readonly />

                        <!-- 当为2时文本输入 -->
                        <van-field v-if="item.intType==2" v-model="item.strValue" :label="item.strName" input-align="right" :placeholder="item.strName" />

                        <!-- 当为3时选择操作 -->
                        <div class="chooseItem post_edit_main_title" v-if="item.intType==3">
                            <p>
                                {{item.strName}}
                                <van-icon name="edit" class="edit" @click="chooseUnit(item)" />
                            </p>
                            <van-field v-model="item.strValue" rows="2" autosize type="textarea" placeholder="请输入" />
                        </div>

                        <!-- 当为4时picker选择器选择 -->
                        <van-field @click="onChoose(item)" v-if="item.intType==4" v-model="item.text" :label="item.strName" input-align="right" :placeholder="item.strName" right-icon="arrow" readonly />

                        <!-- 当为5时单选按钮组 -->
                        <div class="post_edit_main_title" v-if="item.intType == 5">
                            <p>{{item.strName}}</p>
                            <div class="post_edit_radio">
                                <van-field name="radio">
                                    <template #input>
                                        <van-radio-group v-model="item.strValue" direction="horizontal">
                                            <van-radio v-for="(item1,index) in item.objCheckedList" :key="index" :name="item1.strChecked_name">{{item1.strChecked_name}}</van-radio>
                                        </van-radio-group>
                                    </template>
                                </van-field>
                            </div>
                        </div>

                        <!-- 当为8或9时时间选择器 -->
                        <van-field @click="onChoose(item)" v-if="item.intType==9||item.intType==8" v-model="item.strValue" :label="item.strName" input-align="right" placeholder="请选择" right-icon="arrow" readonly />
                    </div>
                    <div class="post_edit_main_title" @click="linkAttachment">
                        <p>
                            <span class="label">附件</span>
                            <span class="fujian" style="float:right;">
                                <van-tag round type="primary">{{intFileCount}}</van-tag>
                                <van-icon name="arrow" />
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            <!-- 主体 end-->

            <!-- 底部 -->
            <div class="post_edit_foot">
                <div class="post_submit">
                    <button @click="deptCheckHandler(0)">提交</button>
                </div>
                <div class="post_foot_tools" v-if="blShowAssist||blShowDelete">
                    <div class="post_foot_item" v-if="blShowAssist" @click="deptCheckHandler(1)">
                        <van-icon class="iconfont" class-prefix="icon" name="xieban-copy" />
                        <p>协办</p>
                    </div>
                    <div class="post_foot_item" v-if="blShowDelete" @click="showDelDialog">
                        <van-icon class="iconfont" class-prefix="icon" name="lajitong" />
                        <p>删除</p>
                    </div>
                </div>
            </div>

            <!-- 底部 end -->

            <!-- --------------------------------------------------------------------公文分类弹出框 ---------------------->
            <van-popup v-model="isPicker" round position="bottom">
                <van-picker show-toolbar :columns="pickerList" @cancel="isPicker = false" @confirm="onConfirm" />
            </van-popup>

            <!-- ----------------------------------------------------------------------时间选择器 ------------->
            <van-popup v-model="isTimePicker" position="bottom">
                <van-datetime-picker v-model="currentDate" :type="timetype==8?'date':'datetime'" title="选择年月日" :min-date="minDate" :max-date="maxDate" @confirm="onConfirm" />
            </van-popup>
        </div>

        <!-- 组件 ---附件页面-->
        <affix v-if="isShowAffix" @getfileData="getfileData" :affixshow="affixshow" :strChgDocWorkId="strChgDocWorkId" :types="this.attachmentTypes"></affix>
    </div>
</template>
<script>
import { deptdetail, deptCheckHandler, deptdelete } from "@/api/department";
import { collectcommon, openWps } from "@/api/common";
import { communication } from "@/assets/js/mixin";
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
    mixins: [communication],
    data() {
        return {
            attachmentTypes: "",//附件类型
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
            strDocTitle: {}, // 标题
            strContent: {}, // 正文内容
            isCollect: "",
            blShowHandList: "", //是否显示交办
            blShowDelete: JSON.parse(getRequest().blShowDelete), //是否删除
            blShowAssist: "", //是否可协办
            isShowAffix: false,
            timetype: 8,
            thatNew: "",
            affixshow: false,
            // strFileId:'',
            // strDeleteFileId:''
        };
    },
    created() {
        if (getRequest().backDetail == "true") {
            localStorage.setItem("strSid", getRequest().strSid);
        }
        this.deptdetail();
        window.appResponse = this.appResponse;
    },
    mounted() { },
    destroyed() { },
    activated() { },
    methods: {
        hasAppData(e) {
            if (JSON.parse(e).data.submitType == 1) {
                this.$router.back();
                localStorage.setItem("departDel", true);
            }
        },
        getfileData(strFileId, strDeleteFileId, intSelectNum, type) {
            // this.strFileId=strFileId
            // this.strDeleteFileId=strDeleteFileId
            this.intFileCount = intSelectNum;
            this.isShowAffix = type;
        },
        // 公文分类选择框
        onChoose(that) {
            this.pickerType = that.strKey;
            this.thatNew = that;
            if (that.intType == 4) {
                this.isPicker = true;
                if (that.objCheckedList) {
                    that.objCheckedList.forEach((item) => {
                        item.text = item.strChecked_name;
                    });
                    this.pickerList = that.objCheckedList;
                }
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
        deptdetail() {
            var param = {
                strSid: localStorage.getItem("strSid"),
                websvrpwd: localStorage.getItem("websvrpwd"),
                strWorkId: getRequest().strWorkId,
                strModeCode: getRequest().intType,
                intPageSize: "10",
            };
            deptdetail(param)
                .then((res) => {
                    if (res.data.intCode === 200) {
                        this.intFileCount = res.data.objData.intFileCount;
                        this.isCollect = res.data.objData.blCollected;
                        this.blShowHandList = res.data.objData.blShowHandList;
                        this.blShowAssist = res.data.objData.blShowAssist;
                        this.strChgDocWorkId = res.data.objData.strChgDocWorkId;
                        res.data.objData.objFormList.forEach((item) => {
                            if (item.intType == 0) {
                                if (item.strValue == undefined || item.strValue.length == 0) {
                                    item.strValue = "—";
                                }
                            } else {
                                if (item.strValue == undefined) {
                                    item.strValue = "";
                                }
                            }
                        });
                        this.list = res.data.objData.objFormList;

                        for (var i = 0; i < this.list.length; i++) {
                            // 标题
                            if (this.list[i].strKey == "strDocTitle") {
                                this.strDocTitle = this.list[i];
                                this.list.splice(i, 1);
                            }
                            // 正文内容
                            if (this.list[i].strKey == "strContent") {
                                this.strContent = this.list[i];
                                this.list.splice(i, 1);
                                let arr = this.strContent.strValue.split("/");
                                this.strContent.strFileName = arr[arr.length - 1];
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
        // 去原生拿数据
        chooseUnit() {
            let data = { singleType: 1, userList: [], unitList: [] };
            this.appRequest(data, 2);
        },

        // 删除弹出框
        showDelDialog() {
            this.$dialog
                .confirm({
                    title: "提示",
                    message: "删除后将无法恢复，确定删除？",
                })
                .then(() => {
                    this.deptdelete();
                })
                .catch(() => {
                    // this.$toast("取消删除");
                });
        },

        // 删除发文
        deptdelete() {
            var param = {
                strSid: localStorage.getItem("strSid"),
                strWorkId: getRequest().strWorkId,
            };
            deptdelete(param)
                .then((res) => {
                    if (res.data.intCode == 200) {
                        this.$toast("删除成功");
                        this.$router.back();
                        localStorage.setItem("departDel", "true");
                    } else {
                        this.$toast(res.data.strMsg);
                    }
                })
                .catch((err) => {
                    this.$toast(err);
                });
        },
        // 发文审核提交
        deptCheckHandler() {
            var param = {
                strSid: localStorage.getItem("strSid"),
                websvrpwd: localStorage.getItem("websvrpwd"),
                strWorkId: getRequest().strWorkId,
                intType: 0,
                // strFileId:this.strFileId,
                // strDeleteFileId:this.strDeleteFileId,
            };
            let arr = [];
            arr.push(this.strDocTitle);
            arr.push(this.strContent);
            this.list.forEach((item) => {
                if (item.intType == "7") {
                    if (this.isurge == false) {
                        item.strValue = "否";
                    } else {
                        item.strValue = "是";
                    }
                }
                arr.push(item);
            });
            arr.forEach((item) => {
                if (item.intType != 0) {
                    param[item.strKey] = item.strValue;
                }
            });
            deptCheckHandler(param)
                .then((res) => {
                    if (res.data.intCode === 200) {
                        // 传下一节点
                        res.data.objData.intType = param.intType;
                        res.data.objData.strModeCode = 220;
                        let data = { objData: res.data.objData };
                        this.appRequest(data, 3);
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
        linkrecord() {
            this.$router.push({
                path: "/department/record",
                query: { strWorkId: getRequest().strWorkId },
            });
        },
        linkAttachment() {
            this.attachmentTypes = 'attachment';
            this.isShowAffix = true;
        },
        linkprocess() {
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
.post_edit_body
    background: #f7f7f7;
    padding-top: 55px;
    padding-bottom: 80px;
    .color_000
        color: #000 !important;
        font-weight: 700;
    .arrow-left
        font-size: 16px;
        vertical-align: middle;
        margin-top: -3px;
    .like-o
        display: inline-block;
        vertical-align: middle;
    .van-nav-bar__right
        i
            font-size: 22px;
            margin-left: 15px;
    .post_edit_main
        .post_edit_main_title
            padding: 12px 0;
            background: #fff;
            p
                font(16px, 26px);
                color: #000;
                padding: 0 16px;
                i
                    color: red;
                    &.edit
                        float: right;
                        color: #137cfc;
                        font-size: 18px;
                span
                    margin-left: 15px;
                    color: #666666;
                    &.label
                        margin-left: 0;
                        display: inline-block;
                        width: 70px;
                    &.fujian
                        display: flex;
                        align-items: center;
                        .van-tag
                            color: #ffffff;
                        i
                            color: #aaaaaa;
                            vertical-align: middle;
                            margin-top: -3px;
                            margin-left: 5px;
        .post_edit_main_list
            margin-top: 10px;
            .textConEdit
                color: #137cfc;
                i
                    vertical-align: middle;
                    margin-top: -3px;
                    margin-right: 4px;
                    font(16px, 20px);
.post_edit_line
    border-top: 1px solid #f6f6f6;
.post_edit_line_bot
    border-bottom: 1px solid #f6f6f6;
.post_edit_main_type
    font(16px, 30px);
    color: #999;
    padding: 0 15px;
    margin-top: 10px;
    .edit_item1
        width: 50%;
        float: left;
        .van-cell
            padding: 0 5px;
            height: 30px;
            background: #f5f5f5;
            line-height: 30px;
            border-radius: 5px;
    .edit_item2
        width: 20%;
        float: left;
        .van-cell
            padding: 0 5px;
            height: 30px;
            background: #f5f5f5;
            line-height: 30px;
            border-radius: 5px;
    .edit_item3
        width: 20%;
        float: left;
        .van-cell
            padding: 0 5px;
            height: 30px;
            background: #f5f5f5;
            line-height: 30px;
            border-radius: 5px;
.edit_main_item
    border-bottom: 1px solid #eee;
.textContent
    position: relative;
    padding: 10px 10px 0 40px;
    font(16px, 25px);
    word-break: break-all;
    .annex_item_img
        pos(10px, none, none, 12px);
        width: 25px;
        height: 25px;
.post_edit_radio
    .van-radio
        margin-bottom: 10px;
// 底部提交
.post_edit_foot
    background: #ffffff;
    width: 100%;
    padding: 10px 15px;
    border-top: 1px solid #eee;
    pos(none, 0, 0, 0, 0, 100);
    display: flex;
    justify-content: space-between;
    .post_submit
        width: 100%;
        button
            width: 100%;
            height: 40px;
            font-size: 16px;
            border: none;
            background: #137cfc;
            color: #ffffff;
            border-radius: 5px;
    .post_foot_tools
        width: 35%;
        display: flex;
        justify-content: center;
        .post_foot_item
            width: 50%;
            text-align: center;
            margin-top: -3px;
            i
                font-size: 20px;
            p
                font-size: 14px;
</style>

