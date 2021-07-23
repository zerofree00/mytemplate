<template>
    <div>
        <div class="post_edit_body" v-if="!isShowAffix">
            <!-- 完成 -->
            <!-- 头部 start -->
            <van-nav-bar @click-left="onleft">
                <template #left>
                    <div class="color_000">
                        <van-icon name="arrow-left" class="arrow-left" />
                        <span class="header_title">办文登记</span>
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
                                <van-icon class="iconfont" class-prefix="icon" name="xuanze" @click="chooseUnit(item,index)" />
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
                    <button @click="deptAddHandler">提交</button>
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
        <affix v-if="isShowAffix" @getfileData="getfileData" :affixshow="affixshow" :strChgDocWorkId="strChgDocWorkId" :types="attachmentTypes"></affix>
    </div>
</template>
<script>
import { deptdetail, deptAddHandler } from "@/api/department";
import { communication } from "@/assets/js/mixin";
import { openWps } from "@/api/common";
import affix from "@/components/attachment/affix.vue";
import {
    concatStr,
    timeFormat,
    setImgPath,
    getRequest,
} from "@/assets/js/util";
export default {
    components: {
        affix,
    },
    mixins: [communication],
    data() {
        return {
            attachmentTypes: 'attachment',
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
            strCurNodeId: "",
            strHandoutMainId: "",
            strWorkFlowId: "",
            strWorkId: "",
            isShowAffix: false,
            timetype: 8,
            thatNew: "",
            affixshow: false,
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
        getfileData(strFileId, strDeleteFileId, intSelectNum, type) {
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
                strModeCode: getRequest().strModeCode,
                strHandoutMainId: getRequest().strHandoutMainId,
                strWorkFlowId: getRequest().strWorkFlowId,
            };
            deptdetail(param)
                .then((res) => {
                    if (res.data.intCode === 200) {
                        this.strCurNodeId = res.data.objData.strCurNodeId;
                        this.intFileCount = res.data.objData.intFileCount;
                        this.strHandoutMainId = res.data.objData.strHandoutMainId;
                        this.strWorkFlowId = res.data.objData.strWorkFlowId;
                        this.strWorkId = res.data.objData.strWorkId;
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
                    this.$toast(err);
                });
        },
        // 去原生拿数据
        // chooseUnit() {
        //   let data = { singleType: 1, userList: [], unitList: [] };
        //   this.appRequest(data, 2);
        // },
        hasAppData(e) {
            if (JSON.parse(e).data.submitType == 1) {
                this.$router.push("/department/index");
                localStorage.setItem("departDel", true);
            }
        },

        // 登记提交
        deptAddHandler() {
            var param = {
                strSid: localStorage.getItem("strSid"),
                websvrpwd: localStorage.getItem("websvrpwd"),
                strCurNodeId: this.strCurNodeId,
                strHandoutMainId: this.strHandoutMainId,
                strWorkFlowId: this.strWorkFlowId,
                strWorkId: this.strWorkId,
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

            // 提交时候的验证
            for (var s = 0; s < arr.length; s++) {
                if (arr[s].intType > 0) {
                    if (arr[s].intRequired == 1) {
                        if (arr[s].strValue.length == 0) {
                            this.$toast("请完善" + arr[s].strName);
                            return false;
                        } else {
                            param[arr[s].strKey] = arr[s].strValue;
                        }
                    } else {
                        param[arr[s].strKey] = arr[s].strValue;
                    }
                }
            }
            deptAddHandler(param)
                .then((res) => {
                    if (res.data.intCode === 200) {
                        // 传下一节点
                        res.data.objData.intType = 0;
                        res.data.objData.strModeCode = 220;
                        let data = { objData: res.data.objData };
                        this.appRequest(data, 3);
                    } else {
                        this.$toast(res.data.strMsg);
                    }
                })
                .catch((err) => {
                    this.$toast(err);
                });
        },

        linkAttachment() {
            this.isShowAffix = true;
        },

        // 附件图片转换
        annexImg(type) {
            var img = setImgPath(type);
            return img;
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
        font-size: 22px;
        margin: 0 10px;
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
                    &.icon-xuanze
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

