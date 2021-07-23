<template>
    <div>
        <div class="post_edit_body" v-show="!isShowAffix">
            <!-- 头部 start -->
            <van-nav-bar @click-left="onleft">
                <template #left>
                    <div class="color_000">
                        <van-icon name="arrow-left" class="arrow-left" />
                        <span class="header_title">发文办理</span>
                    </div>
                </template>
                <template #right>
                    <div class="color_000">
                        <van-icon class="iconfont like-o" class-prefix="icon" name="banliliucheng" @click="linkprocess" />
                        <van-icon class="iconfont" class-prefix="icon" name="fenfajilu" @click="linkrecord" v-if="blShowHandList" />
                        <van-icon class="iconfont" class-prefix="icon" name="guanzhu" @click="collectcommon(1)" v-if="!isCollect" />
                        <van-icon class="iconfont color_index" class-prefix="icon" name="aixin" @click="collectcommon(2)" v-if="!!isCollect" />
                    </div>
                </template>
            </van-nav-bar>
            <!-- 头部 end -->

            <!-- 主体 start-->
            <div class="post_edit_main">
                <!-- 标题 -->
                <div class="post_edit_main_title">
                    <p>
                        {{objTitle.strName}}
                        <i class="tips">*</i>
                    </p>
                    <van-field v-model="objTitle.strValue" rows="1" autosize :readonly="objTitle.intType==0? true:false" type="textarea" placeholder="请输入" />
                </div>

                <!-- 公文分类  -->
                <div class="post_edit_main_title edit_main_item mt10">
                    <p>{{strDocTypeId.strName}}</p>
                    <div class="post_edit_main_type clearfix">
                        <div class="edit_item1">
                            <van-field @click="onChoose(strDocTypeId)" v-if="strDocTypeId.intType!=0" v-model="strDocTypeId.text" input-align placeholder="请选择" readonly />
                            <span v-if="strDocTypeId.intType ==0">{{strDocTypeId.strValue}}</span>
                        </div>
                        <span style="float:left">〔</span>
                        <div class="edit_item2">
                            <van-field v-if="strYear.intType!=0" v-model="strYear.strValue" input-align placeholder="请输入" />
                            <span v-if="strYear.intType ==0">{{strYear.strValue}}</span>
                        </div>
                        <span style="float:left">〕</span>
                        <div class="edit_item3">
                            <van-field v-if="intNo.intType!=0" v-model="intNo.strValue" input-align placeholder="请输入" />
                            <span v-if="intNo.intType ==0">{{intNo.strValue}}</span>
                        </div>
                    </div>
                </div>

                <div class="edit_main_item" v-for="(item, index) in list" :key="index">
                    <!-- 当为0或1仅展示 -->
                    <template v-if="item.intType==0||item.intType==1">

                        <template v-if="item.strKey == 'strNoPublicReason'">
                            <van-field v-if="showReason" v-model="item.strValue" :label="item.strName" :placeholder="item.strName" type="textarea" readonly />
                        </template>

                        <van-field v-else v-model="item.strValue" :label="item.strName" readonly />

                    </template>

                    <!-- 当为2时文本输入 -->
                    <van-field v-if="item.intType==2 && item.strKey !='strNoPublicReason'" v-model="item.strValue" :label="item.strName" input-align="right" :placeholder="item.strName" />

                    <!-- <van-field v-if="item.showNoPublicReason && item.strKey =='strNoPublicReason'" v-model="item.showNoPublicReason" :label="item.strName" input-align="right" :placeholder="item.strName" /> -->

                    <!-- 当为----主送单位-------时选择操作 -->
                    <div class="chooseItem post_edit_main_title" v-if="item.strKey=='strMainSendUnit'&&item.intType!==0">
                        <p>
                            {{item.strName}}
                            <van-icon class="iconfont" class-prefix="icon" name="xuanze" @click="chooseUnit(item,index)" />
                        </p>
                        <van-field v-model="item.strValue" rows="1" autosize type="textarea" placeholder="请输入" :readonly="item.intType==0" />
                    </div>

                    <!--  抄送单位-->
                    <div class="chooseItem post_edit_main_title" v-if="item.strKey=='strCopySendUnit'&&item.intType!==0">
                        <p>
                            {{item.strName}}
                            <van-icon class="iconfont" class-prefix="icon" name="xuanze" @click="chooseUnit(item,index)" />
                        </p>
                        <van-field v-model="item.strValue" rows="1" autosize type="textarea" placeholder="请输入" :readonly="item.intType==0" />
                    </div>

                    <!-- 当为4时picker选择器选择 -->
                    <van-field @click="onChoose(item)" v-if="item.intType==4" v-model="item.text" :label="item.strName" input-align="right" :placeholder="item.strName" right-icon="arrow" readonly />

                    <!-- 当为-3时正文内容 -->
                    <van-cell :title="item.strName" is-link v-if="item.intType== -3">
                        <template #right-icon>
                            <span class="textConEdit" @click="readContent(item.strValue)">
                                <van-icon class="iconfont" class-prefix="icon" name="bianji" />编辑
                            </span>
                        </template>
                    </van-cell>

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

                    <!-- 当为7时切换按钮 -->
                    <van-cell :title="item.strName" v-if="item.intType == 7">
                        <template #right-icon>
                            <van-switch v-model="isurge" size="20" />
                        </template>
                    </van-cell>

                    <!-- 当为8或9时日期选择器 -->
                    <van-field @click="onChoose(item)" v-if="item.intType==9||item.intType==8" v-model="item.strValue" :label="item.strName" input-align="right" placeholder="请选择" right-icon="arrow" readonly />
                </div>

                <div class="post_edit_main_title" @click="linkAttachment('attachment')">
                    <p>
                        <span class="label">附件</span>
                        <span class="fujian" style="float:right;">
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
                <div class="post_foot_tools" v-if="blShowAssist || blShowDelete ">
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

            <van-popup v-model="isPicker" round position="bottom">
                <van-picker show-toolbar :columns="pickerList" @cancel="isPicker = false" @confirm="onConfirm" />
            </van-popup>

            <van-popup v-model="isTimePicker" position="bottom">
                <van-datetime-picker v-model="currentDate" :type="timetype==8?'date':'datetime'" title="选择时间" :min-date="minDate" :max-date="maxDate" @confirm="onConfirm" />
            </van-popup>
        </div>
        <!-- 组件 ---附件页面-->
        <affix ref="affix" v-if="isShowAffix" @getfileData="getfileData" :affixshow="affixshow" :types="this.attachmentTypes"></affix>
    </div>
</template>
<script>
import { postDetail, postDocheck, senddelete } from "@/api/post";
import { communication, backForAndroid } from "@/assets/js/mixin";
import { concatStr, timeFormat, getRequest, keepList } from "@/assets/js/util";
import { collectcommon, openWps } from "@/api/common";
import affix from "@/components/attachment/affix.vue";
import Vue from "vue";
export default {
    mixins: [communication, backForAndroid],
    components: {
        affix,
    },
    name: "post_edit",
    data() {
        return {
            post: 'dsfdsfsd',
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
            thatNew: "",
            intFileCount: "", //附件数量
            objTitle: {}, // 标题
            strDocTypeId: {}, // 公文分类
            intNo: {}, // 号
            strYear: {}, // 年号
            strFileName: {}, //正文文件名称
            strFilePath: {}, //正文文件路径
            strNewFileName: {}, //正文文件新名称
            timetype: 8,
            isShowAffix: false,
            affixshow: true,
            isCollect: "",
            blShowHandList: "",
            blShowDelete: JSON.parse(getRequest().blShowDelete),
            blShowAssist: false, //是否可协办
            keyNew: "",
            objNew: {},
            strFileId: "",
            strDeleteFileId: "",
            showReason: true,
            attachmentTypes: "",//附件类型
        };
    },
    created() {
        this.$store.commit("SET_KEEPALIVE", keepList);
        if (getRequest().backDetail == "true") {
            localStorage.setItem("strSid", getRequest().strSid);
        }
        this.getpostDetail();
        window.appResponse = this.appResponse;
        window.backAndroid = this.backAndroid;

    },
    mounted() { },
    destroyed() { },
    activated() { },
    methods: {
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
            };
            postDetail(param)
                .then((res) => {
                    if (res.data.intCode === 200) {
                        this.intFileCount = res.data.objData.intFileCount;
                        this.blShowHandList = res.data.objData.blShowHandList;
                        this.blShowAssist = res.data.objData.blShowAssist;
                        this.isCollect = res.data.objData.blCollected;
                        res.data.objData.objFormList.forEach((item) => {
                            if (item.intType == 0) {
                                if (item.strValue == undefined || item.strValue == "") {
                                    item.strValue = "—";
                                }
                            } else {
                                if (item.strValue == undefined) {
                                    item.strValue = "";
                                }
                            }
                        });
                        this.list = res.data.objData.objFormList;
                        // UI定制化的单独提取出来
                        for (var i = 0; i < this.list.length; i++) {
                            //公文分类
                            if (this.list[i].strKey == "strDocTypeId") {
                                this.strDocTypeId = this.list[i];
                                // 处理公文分类
                                if (!!this.strDocTypeId.objCheckedList) {
                                    this.strDocTypeId.objCheckedList.forEach((item) => {
                                        item.text = item.strChecked_name;

                                        if (item.strChecked_id == this.strDocTypeId.strValue) {
                                            this.strDocTypeId.text = item.strChecked_name;
                                        }
                                    });
                                }

                                this.list.splice(i, 1);
                            }
                            // 年号
                            if (this.list[i].strKey == "strYear") {
                                this.strYear = this.list[i];
                                this.list.splice(i, 1);
                            }
                            // 号
                            if (this.list[i].strKey == "intNo") {
                                this.intNo = this.list[i];
                                this.list.splice(i, 1);
                            }
                            // 标题
                            if (this.list[i].strKey == "strTitle") {
                                this.objTitle = this.list[i];
                                this.list.splice(i, 1);
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

                            if (
                                this.list[i].strKey == "strPublicType"
                            ) {
                                if (this.list[i].intType == "0" &&
                                    this.list[i].strValue == "不公开") {

                                    this.showReason = true;
                                } else {
                                    this.showReason = false;
                                }
                            }

                            // if (this.list[i].strKey == "strNoPublicReason") {
                            //     if (this.showReason) {
                            //         this.list[i].showNoPublicReason = true
                            //     } else {
                            //         this.list[i].showNoPublicReason = false
                            //     }
                            // }
                        }

                        for (var i = 0; i < this.list.length; i++) {
                            if (this.list[i].intType == "4") {
                                if (!!this.list[i].objCheckedList) {
                                    this.list[i].objCheckedList.forEach((item) => {
                                        item.text = item.strChecked_name;
                                        if (item.strChecked_id == this.list[i].strValue) {
                                            this.list[i].text = item.strChecked_name;
                                        }
                                    });
                                }
                            }
                            // 切换按钮
                            if (this.list[i].intType == "7") {
                                if (this.list[i].strValue == "是") {
                                    this.isurge = true;
                                } else {
                                    this.isurge = false;
                                }
                            }
                            if (this.list[i].intType == "0") {
                                // 判断不能编辑状态下的返回value值对应的文字
                                if (!!this.list[i].objCheckedList) {
                                    this.list[i].objCheckedList.forEach((item) => {
                                        if (item.strChecked_id == this.list[i].strValue) {
                                            this.list[i].strValue = item.strChecked_name;
                                        }
                                    });
                                }
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
        linkrecord() {
            this.$router.push({
                path: "/post/record",
                query: { strWorkId: getRequest().strWorkId },
            });
        },
        // 去原生拿数据
        chooseUnit(item, index) {
            console.log('this.hasAppData=======', this.hasAppData);
            this.keyNew = item.strKey;
            this.objNew = item;
            var str = item.strValue;
            let data = { singleType: 2, unitName: str };
            this.appRequest(data, 5);
        },

        hasAppData(e) {
            if (!!e) {
                if (JSON.parse(e).data.submitType == 1) {
                    this.$router.back();
                    localStorage.setItem("sendDel", true);
                }
                var str = JSON.parse(e).data.unitName;
                if (this.keyNew == "strMainSendUnit") {
                    Vue.set(this.objNew, "strValue", str);
                }
                if (this.keyNew == "strCopySendUnit") {
                    Vue.set(this.objNew, "strValue", str);
                }
            }

        },
        // 发文审核提交
        submitpostCheck(intType) {
            var param = {
                strSid: localStorage.getItem("strSid"),
                websvrpwd: localStorage.getItem("websvrpwd"),
                strFileId: this.strFileId,
                strDeleteFileId: this.strDeleteFileId,
                strWorkId: getRequest().strWorkId,
                intType: intType,
                strFileName: localStorage.getItem("strFileNameValue"),
            };
            let arr = [];
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
            console.log(param);
            postDocheck(param)
                .then((res) => {
                    if (res.data.intCode === 200) {
                        // 传下一节点
                        res.data.objData.intType = param.intType;
                        res.data.objData.strModeCode = 200;
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
                    // this.$toast('取消删除')
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
        linkAttachment(types) {
            // alert(222222)
            this.attachmentTypes = types;
            this.isShowAffix = true;
        },

        getfileData(strFileId, strDeleteFileId, intSelectNum, type) {
            this.strFileId = strFileId;
            this.strDeleteFileId = strDeleteFileId;
            this.intFileCount = intSelectNum;
            this.isShowAffix = type;
        },

        linkprocess() {
            this.$router.push({
                path: "/post/process",
                query: { strWorkId: getRequest().strWorkId },
            });
        },

        cancelPicker() {
            this.currentDate = new Date();
            this.isTimePicker = false;
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
                if (keepList[i] != "post_edit") {
                    newList.push(keepList[i]);
                }
            }
            console.log(newList);
            this.$store.commit("SET_KEEPALIVE", newList);
        }
        next();
    },
    watch: {},
};
</script>
<style>
textarea {
	word-break: break-all;
}
</style>

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
            display: inline-block;
            vertical-align: middle;
    .post_edit_main
        .post_edit_main_title
            padding: 12px 0;
            background: #fff;
            p
                font(16px, 26px);
                color: #000;
                padding: 0 16px;
                i
                    &.tips
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
        .edit_main_item
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
        text-align: center;
        .van-cell
            padding: 0 5px;
            height: 30px;
            background: #f5f5f5;
            line-height: 30px;
            border-radius: 5px;
    .edit_item3
        width: 20%;
        float: left;
        text-align: center;
        .van-cell
            padding: 0 5px;
            height: 30px;
            background: #f5f5f5;
            line-height: 30px;
            border-radius: 5px;
.textConEdit
    color: #137cfc;
    i
        vertical-align: middle;
        margin-top: -3px;
        margin-right: 4px;
        font(16px, 20px);
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

