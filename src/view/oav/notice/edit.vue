<template>
    <div>
        <div class="leave_index" v-if="!isShowAffix">
            <van-nav-bar @click-left="onleft">
                <template #left>
                    <div class="color_000">
                        <van-icon name="arrow-left" class="arrow-left" />
                        <span class="header_title">通知通告</span>
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
                <div class="edit_main_item" v-for="(item, index) in list" :key="index">
                    <!-- 标题的特殊样式 -->
                    <div class="item_con" v-if="item.strKey=='strTitle'">
                        <p>{{item.strName}}</p>
                        <van-field v-model="item.strValue" rows="2" autosize type="textarea" placeholder="请输入" :readonly="item.intType==0? true:false" />
                    </div>

                    <!-- 正文内容的富文本编辑器 -->
                    <div class="item_con" v-if="item.strKey=='strContent'">
                        <p>{{item.strName}}</p>
                        <div class="richText" v-if="item.intType==0">
                            <div v-html="item.strValue"></div>
                        </div>
                        <div class="richText" v-if="item.intType==2">
                            <div class="quillEditor" v-if="isloading">
                                <quillEditor :strContent="item" @hasdata="hasdata"></quillEditor>
                            </div>
                        </div>
                    </div>

                    <!-- 当为0或1仅展示 -->
                    <van-field v-if="item.intType==0&&item.strKey!='strTitle'&&item.strKey!='strContent'&&item.strKey!=='strPubRange' " v-model="item.strValue" :label="item.strName" readonly />
                    <van-field v-if="item.intType==1&&item.strKey!='strTitle'&&item.strKey!='strContent' &&item.strKey!=='strPubRange'" v-model="item.strValue" :label="item.strName" readonly />

                    <!-- 当为2时文本输入 -->
                    <van-field v-if="item.intType==2&&item.strKey!='strTitle'&&item.strKey!='strContent' " v-model="item.strValue" :label="item.strName" input-align="right" :placeholder="item.strName" />

                    <!-- 当为3时选择操作 -->
                    <div class="item_con" v-if="item.strKey=='strPubRange'">
                        <p>
                            {{item.strName}}
                            <van-icon name="edit" class="choose" v-if="item.intType !== 0" @click="chooseUnit(item)" />
                        </p>
                        <van-field v-model="strPubRange.text" rows="1" autosize type="textarea" placeholder="请输入" :readonly="item.intType == 0" />
                    </div>

                    <!-- 当为9时时间选择器 -->
                    <van-field @click="onChoose(item)" v-if="item.intType==9" v-model="item.strValue" :label="item.strName" input-align="right" placeholder="请选择" right-icon="arrow" readonly />
                </div>

                <!-- 短信提醒 -->
                <div class="edit_main_item">
                    <van-field v-if="intSms.intType==0" v-model="intSms.strValue==0?'否':'是'" :label="intSms.strName" readonly />
                    <van-cell :title="intSms.strName" v-if="intSms.intType==7">
                        <template #right-icon>
                            <van-switch v-model="intSmsFlag" size="20" />
                        </template>
                    </van-cell>
                </div>

                <!-- 是否回复 -->
                <div class="edit_main_item">
                    <van-field v-if="intReply.intType==0" v-model="intReply.strValue==0?'否':'是'" :label="intReply.strName" readonly />
                    <van-cell :title="intReply.strName" v-if="intReply.intType==7">
                        <template #right-icon>
                            <van-switch v-model="intReplyFlag" size="20" />
                        </template>
                    </van-cell>
                </div>

                <!-- 附件 -->
                <div class="edit_main_item" @click="linkAttachment">
                    <p class="fJ">
                        <span class="label">附件</span>
                        <span class="float_r fujian">
                            <van-tag round type="primary">{{intFileCount}}</van-tag>
                            <van-icon name="arrow" />
                        </span>
                    </p>
                </div>
            </main>
            <!-- 底部 -->
            <div class="post_edit_foot">
                <div class="post_submit">
                    <button @click="submitpostCheck(0)">提交</button>
                </div>
                <div class="post_foot_tools" v-if="blShowDelete||blShowAssist ">
                    <div class="post_foot_item" v-if="blShowAssist" @click="submitpostCheck(1)">
                        <van-icon class="iconfont" class-prefix="icon" name="xieban-copy" />
                        <p>协办</p>
                    </div>
                    <div class="post_foot_item" v-if="blShowDelete" @click="showDelDialog()">
                        <van-icon class="iconfont" class-prefix="icon" name="lajitong" />
                        <p>删除</p>
                    </div>
                </div>
            </div>

            <!-- picker选择器选择 -->
            <van-popup v-model="isPicker" round position="bottom">
                <van-picker show-toolbar :columns="pickerList" @cancel="isPicker = false" @confirm="onConfirm" />
            </van-popup>
            <!-- 时间选择器选择 -->
            <van-popup v-model="isTimePicker" position="bottom">
                <van-datetime-picker v-model="currentDate" type="datetime" title="选择时间" :min-date="minDate" :max-date="maxDate" @cancel="isTimePicker = false" @confirm="onConfirm" />
            </van-popup>
        </div>
        <!-- 组件 ---附件页面-->
        <affix v-if="isShowAffix" @getfileData="getfileData" :affixshow="true" types="attachment"></affix>
    </div>
</template>
<script>
import { noticedetail, noticeCheckHandler, noticedelete } from "@/api/notice";
import quillEditor from "@/components/quillEditor/index.vue";
import affix from "@/components/attachment/affix.vue";
import { getRequest, concatStr, timeFormat } from "@/assets/js/util";
import { communication, backForAndroid } from "@/assets/js/mixin";
import { collectcommon } from "@/api/common";
import Vue from "vue";
export default {
    mixins: [communication, backForAndroid],
    components: {
        quillEditor: quillEditor,
        affix,
    },
    data() {
        return {
            list: [],
            intSms: {}, //短信提醒
            intSmsFlag: false, // 短信提醒状态
            intReply: {}, //是否回复
            intReplyFlag: false, // 是否回复状态
            isPicker: false, //公文分类选择状态
            pickerList: [],
            intFileCount: "", //附件个数
            pickerType: "",
            minDate: new Date(2020, 0, 1),
            maxDate: new Date(2025, 10, 1),
            currentDate: new Date(), //时间
            isTimePicker: false, //时间选择状态
            isCollect: "",
            blShowHandList: "",
            blShowDelete: "",
            blShowAssist: false, //是否可协办
            isloading: false, //后台数据是否加载完成
            isShowAffix: false,
            objNew: {},
            strFileId: "",
            strDeleteFileId: "",
            strPubRange: {}, //发布范围
        };
    },
    created() {
        if (getRequest().backDetail == "true") {
            localStorage.setItem("strSid", getRequest().strSid);
        }
        this.leavedetail();
        window.appResponse = this.appResponse;
        window.backAndroid = this.backAndroid;
    },

    methods: {
        // 获取详情
        leavedetail() {
            var param = {
                strSid: localStorage.getItem("strSid"),
                strWorkId: getRequest().strWorkId,
                strModeCode: getRequest().type,
            };
            noticedetail(param)
                .then((res) => {
                    if (res.data.intCode == 200) {
                        this.isloading = true;
                        this.list = res.data.objData.objFormList;
                        this.isCollect = res.data.objData.blCollected;
                        this.intFileCount = res.data.objData.intFileCount;
                        this.blShowAssist = res.data.objData.blShowAssist;
                        this.blShowDelete = res.data.objData.blShowDelete;
                        for (var i = 0; i < this.list.length; i++) {
                            if (this.list[i].strKey == "strPubRange") {
                                // 全部成员
                                // this.list[i].intType=3
                                this.strPubRange = this.list[i];
                                if (this.list[i].strValue == "全部成员") {
                                    this.strPubRange.text = this.list[i].strValue;
                                } else {
                                    var str = "";
                                    this.list[i].strValue.split(",").forEach((item) => {
                                        str = str + item.split("/")[2] + ",";
                                    });
                                    this.strPubRange.text = str.substring(0, str.length - 1);
                                }
                            }

                            // 短信提醒
                            if (this.list[i].strKey == "intSms") {
                                this.intSms = this.list[i];
                                // this.list[i].intType = 7;
                                if (this.intSms.strValue == "0") {
                                    this.intSmsFlag = false;
                                } else {
                                    this.intSmsFlag = true;
                                }
                                this.list.splice(i, 1);
                            }

                            // 是否回复
                            if (this.list[i].strKey == "intReply") {
                                this.intReply = this.list[i];
                                if (this.intReply.strValue == "0") {
                                    this.intReplyFlag = false;
                                } else {
                                    this.intReplyFlag = true;
                                }
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
        // 去原生拿数据
        // chooseUnit(item) {
        //   let data = { strPubRange: this.strPubRange.strValue, singleType: 2 };
        //   this.appRequest(data, 6);
        // },

        hasAppData(e) {
            // alert(e)
            if (JSON.parse(e).data.submitType == 1) {
                this.$router.back();
                localStorage.setItem("noticeDel", true);
            }
            this.strPubRange.strValue = JSON.parse(e).data.strPubRange;
            var arr = [];
            var str = "";
            arr = JSON.parse(e).data.strPubRange.split(",");
            arr.forEach((item) => {
                str = str + item.split("/")[2] + ",";
            });
            Vue.delete(this.strPubRange, "text");
            Vue.set(this.strPubRange, "text", str.substring(0, str.length - 1));
        },

        // 提交审核的接口
        submitpostCheck(intType) {
            var param = {
                strSid: localStorage.getItem("strSid"),
                websvrpwd: localStorage.getItem("websvrpwd"),
                strWorkId: getRequest().strWorkId,
                strFileId: this.strFileId,
                strDeleteFileId: this.strDeleteFileId,
                intType: intType,
            };
            if (this.intSmsFlag == false) {
                this.intSms.strValue = "0";
            } else {
                this.intSms.strValue = "1";
            }
            if (this.intReplyFlag == false) {
                this.intReply.strValue = "0";
            } else {
                this.intReply.strValue = "1";
            }
            var postArr = [];
            postArr = this.list;
            postArr.push(this.intSms);
            postArr.push(this.intReply);
            postArr.push(this.strPubRange);
            postArr.forEach((item) => {
                if (item.intType != 0) {
                    param[item.strKey] = item.strValue;
                }
            });
            noticeCheckHandler(param)
                .then((res) => {
                    if (res.data.intCode === 200) {
                        // 传下一节点
                        res.data.objData.intType = param.intType;
                        res.data.objData.strModeCode = 310;
                        let data = { objData: res.data.objData };
                        // alert(JSON.stringify(data))
                        this.appRequest(data, 3);
                        // this.$toast("提交成功");
                    }
                })
                .catch((err) => {
                    this.$toast(err);
                });
        },

        // picker选择器选择
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
            if (this.thatNew.intType == 9 || this.thatNew.intType == 8) {
                this.thatNew.strValue = timeFormat(
                    this.currentDate,
                    this.thatNew.intType
                );
                this.isTimePicker = false;
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

        // 删除通知
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

        //获取正文内容
        hasdata(str) {
            this.list.forEach((item) => {
                if (item.strKey == "strContent") {
                    item.strValue = str;
                }
            });
        },

        // 去附件
        linkAttachment() {
            this.isShowAffix = true;
        },
        getfileData(strFileId, strDeleteFileId, intSelectNum, type) {
            this.strFileId = strFileId;
            this.strDeleteFileId = strDeleteFileId;
            this.intFileCount = intSelectNum;
            this.isShowAffix = type;
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

        // 返回
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
.leave_index
    padding-top: 46px;
    padding-bottom: 80px;
    background-color: #f6f6f6;
    min-height: 100%;
    .color_888
        color: #666;
        font-size: 16px;
        line-height: 30px;
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
    .edit_main_item
        border-bottom: 1px solid #f6f6f6;
        .van-cell
            font-size: 16px;
        .item_con
            background: #fff;
            font-size: 16px;
            padding: 13px 0;
            p
                padding: 0 16px;
            .choose
                font-size: 20px;
                color: #137cfc;
                float: right;
        .fJ
            padding: 13px 16px;
            font(16px, 24px);
            background: #ffffff;
            vertical-align: middle;
            .fujian
                display: flex;
                align-items: center;
.richText
    padding: 13px 16px;
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