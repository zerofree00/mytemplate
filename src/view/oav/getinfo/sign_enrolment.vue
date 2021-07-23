<template>
    <div>
        <div class="post_edit_body" v-if="!isShowAffix">
            <!-- 头部 start -->
            <van-nav-bar @click-right="collect" @click-left="onleft">
                <template #left>
                    <div class="color_000">
                        <van-icon name="arrow-left" class="arrow-left" />
                        <span class="header_title">收文登记</span>
                    </div>
                </template>
            </van-nav-bar>
            <!-- 头部 end -->

            <!-- 主体 start-->
            <div class="post_edit_main">
                <div class="post_edit_main_title" :id="strDocTitle.strKey">
                    <p>
                        文件标题
                        <i v-if="strDocTitle.intRequired == 1">*</i>
                    </p>
                    <van-field v-model="strDocTitle.strValue" rows="1" autosize :readonly="strDocTitle.intType==0? true:false" type="textarea" placeholder="请输入" />
                </div>

                <!-- -----------------------正文内容----------------------------------------------------------------start -->
                <!-- <div class="post_edit_main_title mt10" v-if="!!strContent.strValue">
          <p>正文内容</p>
          <div class="textContent">
            <img class="annex_item_img" :src="annexImg(strContent.strFileName)" alt />
            {{strContent.strFileName}}
          </div>
        </div>-->

                <!-- 正文内容start -->
                <van-cell title="正文内容" style="margin-top:10px" is-link v-if="!this.strContent.strValue||this.strContent.strValue.length==0" @click="linkAttachment('text')" />

                <div class="post_edit_main_title" style="margin-top:10px" v-if="!!this.strContent.strValue&&this.strContent.strValue.length>0">
                    <p>正文内容</p>
                    <div class="textContent" @click="openPreview(strContent.strValue)">
                        <img class="annex_item_img" :src="annexImg(strContent.strFileName)" alt />
                        {{strContent.strFileName}}
                    </div>
                </div>

                <div class="post_edit_main_list">
                    <!-- -----------------------收文编号----------------------------------------------------------------start -->
                    <div class="post_edit_main_title">
                        <p>{{strSerialNo.strName}}</p>
                        <div class="post_edit_main_type clearfix">
                            <div class="edit_item2">
                                <van-field v-if="strSignYear.intType!=0" v-model="strSignYear.strValue" input-align placeholder="请输入" />
                                <span v-if="strSignYear.intType ==0">{{strSignYear.strValue}}</span>
                            </div>
                            <div class="edit_item1">
                                <van-field @click="onChoose(strDocTypeId)" v-if="strDocTypeId.intType!=0" v-model="strDocTypeId.text" input-align readonly placeholder="请选择" />
                                <span v-if="strDocTypeId.intType ==0">{{strDocTypeId.text}}</span>
                            </div>
                            <div class="edit_item3 ml10">
                                <van-field v-if="strSerialNo.intType!=0" v-model="strSerialNo.strValue" type="number" input-align placeholder="请输入" />
                                <span v-if="strSerialNo.intType ==0">{{strSerialNo.strValue}}</span>
                            </div>
                        </div>
                    </div>

                    <!-- -----------------------------------------------------------------来文字号 ----------------------- -->
                    <div class="post_edit_main_title">
                        <p>{{strDocNoId.strName}}</p>
                        <div class="post_edit_main_type clearfix">
                            <div class="edit_item1">
                                <van-field v-if="strDocNoId.intType!=0" v-model="strDocNoId.strValue" type="number" input-align placeholder="请输入" />
                                <span v-if="strDocNoId.intType ==0">{{strDocNoId.strValue}}</span>
                            </div>
                            <span style="float:left">〔</span>
                            <div class="edit_item2">
                                <van-field v-if="strYear.intType!=0" type="number" v-model="strYear.strValue" input-align placeholder="请输入" />
                                <span v-if="strYear.intType ==0">{{strYear.strValue}}</span>
                            </div>
                            <span style="float:left">〕</span>
                            <div class="edit_item3">
                                <van-field v-if="intNo.intType!=0" v-model="intNo.strValue" type="number" input-align placeholder="请输入" />
                                <span v-if="intNo.intType ==0">{{intNo.strValue}}</span>
                            </div>
                        </div>
                    </div>

                    <div class="edit_main_item" v-for="(item, index) in list" :key="index">
                        <!-- 当为0或1仅展示 -->
                        <van-field v-if="((item.intType==0||item.intType==1)&&item.strKey!=='strHandlerMainUnit')&&item.strKey!=='strHandlerAssistUnit'" v-model="item.strValue" :label="item.strName" readonly />

                        <!-- 当为2时文本输入 -->
                        <van-field v-if="item.intType==2 " v-model="item.strValue" :label="item.strName" input-align="right" :placeholder="item.strName" />

                        <!-- 当为3时选择操作 -->
                        <div class="post_edit_main_title" v-if="item.strKey=='strHandlerMainUnit'">
                            <p>
                                {{strHandlerMainUnit.strName}}
                                <van-icon class="iconfont" class-prefix="icon" name="xuanze" @click="chooseUnit(item,index)" v-if="strHandlerMainUnit.intType!==0" />
                            </p>
                            <van-field v-model="strHandlerMainUnit.text" rows="2" autosize type="textarea" placeholder="—" readonly />
                        </div>

                        <div class="post_edit_main_title" v-if="item.strKey=='strHandlerAssistUnit'">
                            <p>
                                {{strHandlerAssistUnit.strName}}
                                <van-icon class="iconfont" class-prefix="icon" name="xuanze" @click="chooseUnit(item,index)" v-if="strHandlerAssistUnit.intType!==0" />
                            </p>
                            <van-field v-model="strHandlerAssistUnit.text" rows="1" autosize type="textarea" placeholder="—" readonly />
                        </div>

                        <!-- 当为4时picker选择器选择 -->
                        <van-field @click="onChoose(item)" v-if="item.intType==4" v-model="item.text" :label="item.strName" input-align="right" :placeholder="item.strName" right-icon="arrow" readonly />

                        <!-- 当为5时单选按钮组 -->
                        <div class="post_edit_main_title" v-if="item.intType == 5">
                            <p>{{item.strName}}</p>
                            <div class="post_edit_radio">
                                <van-field name="radio" @click="changeRadio(item)">
                                    <template #input>
                                        <van-radio-group v-model="item.strValue" direction="horizontal">
                                            <van-radio v-for="(item1,index) in item.objCheckedList" :key="index" :name="item1.strChecked_name">{{item1.strChecked_name}}</van-radio>
                                        </van-radio-group>
                                    </template>
                                </van-field>
                            </div>
                        </div>

                        <!-- 当为8或9时时间选择器 -->
                        <van-field @click="onChoose(item)" v-if="item.intType==9||item.intType==8 && item.strKey != 'strHandlerLimitDate'" v-model="item.strValue" :label="item.strName" input-align="right" placeholder="请选择" right-icon="arrow" readonly />

                        <van-field @click="onChoose(item)" v-if="showHandlerLimitDate && item.strKey == 'strHandlerLimitDate'" v-model="item.strValue" :label="item.strName" input-align="right" placeholder="请选择" right-icon="arrow" readonly />
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
            </div>
            <!-- 主体 end-->

            <!-- 底部 -->
            <div class="post_edit_foot">
                <div class="post_submit">
                    <button @click="submitpostCheck()">提交</button>
                </div>
            </div>
            <!-- 底部 end -->

            <van-popup v-model="isPicker" round position="bottom">
                <van-picker show-toolbar :columns="pickerList" @cancel="isPicker = false" @confirm="onConfirm" />
            </van-popup>

            <van-popup v-model="isTimePicker" position="bottom">
                <van-datetime-picker v-model="currentDate" :type="timetype==8?'date':'datetime'" title="选择年月日" :min-date="minDate" :max-date="maxDate" @confirm="onConfirm" />
            </van-popup>
        </div>
        <!-- 组件附件页面-->
        <affix v-if="isShowAffix" @getfileData="getfileData" :affixshow="affixshow" @hasDocData="hasDocData" :types="attachmentTypes"></affix>
        <van-image-preview v-model="showPreview" :images="previewList" :closeable="true" @close="previewList = []" :show-index="false"></van-image-preview>
    </div>
</template>
<script>
import { receivedDetail, doAddHandler, collect } from "@/api/getInfo";
import { communication } from "@/assets/js/mixin";
import { openWps } from "@/api/common";
import affix from "@/components/attachment/affix.vue";
import {
    concatStr,
    setImgPath,
    timeFormat,
    getRequest,
    baseUrl
} from "@/assets/js/util";
import Vue from "vue";
export default {
    components: {
        affix,
    },
    mixins: [communication],
    data() {
        return {
            showPreview: false,
            previewList: [],
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
            strDocTypeId: {}, // 公文分类
            strDocNoId: {}, // 来文字号
            strSignYear: {}, // 收文年份
            strSerialNo: {}, // 收文编号
            strContent: {}, // 正文内容
            intNo: {}, // 号
            strYear: {}, // 年号
            strHandoutMainId: "",
            strWorkFlowId: "",
            strWorkId: "",
            isShowAffix: false,
            affixshow: true,
            timetype: 8,
            keyNew: "",
            strHandlerMainUnit: {},
            strHandlerAssistUnit: {},
            strFileId: "",
            strDeleteFileId: "",
            showHandlerLimitDate: false, //是否显示办理期限
        };
    },
    created() {
        if (getRequest().backDetail == "true") {
            localStorage.setItem("strSid", getRequest().strSid);
        }
        this.getpostDetail();
        window.appResponse = this.appResponse;
    },
    mounted() { },
    destroyed() { },
    activated() { },
    methods: {
        getfileData(strFileId, strDeleteFileId, intSelectNum, type) {
            this.strFileId = strFileId;
            this.strDeleteFileId = strDeleteFileId;
            this.intFileCount = intSelectNum;
            this.isShowAffix = type;
        },
        //正文
        hasDocData(list, type) {
            this.isShowAffix = type;
            this.strContent.strFileName = list[0].strFileName;
            this.strContent.strValue = list[0].strFileUrl;
            this.strContent.strFileId = list[0].strFileId;
        },
        // 处理提交数据
        submitData() { },
        // 公文分类选择框
        onChoose(that) {
            this.pickerType = that.strKey;
            this.thatNew = that;
            if (that.intType == 4) {
                this.isPicker = true;
                if (!!that.objCheckedList) {
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
        getpostDetail() {
            var param = {
                strSid: localStorage.getItem("strSid"),
                websvrpwd: localStorage.getItem("websvrpwd"),
                strWorkId: getRequest().strWorkId,
                strModeCode: getRequest().strModeCode,
                strHandoutMainId: getRequest().strHandoutMainId,
                strWorkFlowId: getRequest().strWorkFlowId,
                intPageSize: "10",
            };
            receivedDetail(param)
                .then((res) => {
                    if (res.data.intCode === 200) {
                        this.strHandoutMainId = res.data.objData.strHandoutMainId;
                        this.strWorkFlowId = res.data.objData.strWorkFlowId;
                        this.strWorkId = res.data.objData.strWorkId;
                        localStorage.setItem('enrolmentStrWorkId', res.data.objData.strWorkId)
                        this.intFileCount = res.data.objData.intFileCount;
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

                        // for (var i = 0; i < this.list.length; i++) {
                        //   // 号
                        //   if (this.list[i].strKey == "intNo") {
                        //     this.intNo = this.list[i];
                        //     this.list.splice(i, 1);
                        //   }
                        // }

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

                            // 收文年份
                            if (this.list[i].strKey == "strSignYear") {
                                this.strSignYear = this.list[i];
                                this.list.splice(i, 1);
                            }

                            // 公文分类
                            if (this.list[i].strKey == "strDocTypeId") {
                                this.strDocTypeId = this.list[i];

                                if (
                                    this.strDocTypeId.objCheckedList != undefined &&
                                    this.strDocTypeId.objCheckedList.length > 0
                                ) {
                                    this.strDocTypeId.objCheckedList.forEach((item) => {
                                        item.text = item.strChecked_name;

                                        if (item.strChecked_id == this.strDocTypeId.strValue) {
                                            this.strDocTypeId.text = item.strChecked_name;
                                        }
                                    });
                                }
                                this.list.splice(i, 1);
                            }

                            // 收文编号
                            if (this.list[i].strKey == "strSerialNo") {
                                this.strSerialNo = this.list[i];
                                this.list.splice(i, 1);
                            }

                            // 来文字号
                            if (this.list[i].strKey == "strDocNoId") {
                                this.strDocNoId = this.list[i];
                                if (
                                    this.strDocNoId.objCheckedList != undefined &&
                                    this.strDocNoId.objCheckedList.length > 0
                                ) {
                                    this.strDocNoId.objCheckedList.forEach((item) => {
                                        // 处理picker的显示内容
                                        item.text = item.strChecked_name;
                                        if (item.strDocNoId == this.strDocNoId.strValue) {
                                            // 处理页面的显示值
                                            this.strDocNoId.text = item.strChecked_name;
                                        }
                                    });
                                }
                                this.list.splice(i, 1);
                            }

                            // 号
                            if (this.list[i].strKey == "intNo") {
                                this.intNo = this.list[i];
                                this.list.splice(i, 1);
                            }

                            // 年份
                            if (this.list[i].strKey == "strYear") {
                                this.strYear = this.list[i];
                                this.list.splice(i, 1);
                            }
                        }

                        for (var i = 0; i < this.list.length; i++) {
                            // ----------------------------------------------------
                            // 主办部门
                            // if (this.list[i].strKey == "strHandlerMainUnit") {
                            //   this.strHandlerMainUnit = this.list[i];
                            //   if(this.list[i].strValue.length==0&&this.list[i].intType!==3){
                            //     this.strHandlerMainUnit.text='—'
                            //     return
                            //   }
                            //   this.strHandlerMainUnit.text = this.list[i].strValue.split(
                            //     "/"
                            //   )[2];
                            // }
                            if (this.list[i].strKey == "strHandlerMainUnit") {
                                this.strHandlerMainUnit = this.list[i];
                                if (
                                    (this.list[i].strValue == "—" ||
                                        this.list[i].strValue.length == 0) &&
                                    this.list[i].intType !== 3
                                ) {
                                    this.strHandlerMainUnit.text = "—";
                                } else {
                                    this.strHandlerMainUnit.text = this.list[i].strValue.split(
                                        "/"
                                    )[2];
                                }
                            }

                            // 协办部门
                            if (this.list[i].strKey == "strHandlerAssistUnit") {
                                this.strHandlerAssistUnit = this.list[i];

                                if (
                                    (this.list[i].strValue == "—" ||
                                        this.list[i].strValue.length == 0) &&
                                    this.list[i].intType !== 3
                                ) {
                                    this.strHandlerAssistUnit.text = "—";
                                } else {
                                    if (
                                        this.list[i].strValue == "—" ||
                                        this.list[i].strValue.length == 0
                                    ) {
                                        this.strHandlerAssistUnit.text = "";
                                    } else {
                                        var str = "";
                                        this.list[i].strValue.split(",").forEach((item) => {
                                            str = str + item.split("/")[2] + ",";
                                        });
                                        this.strHandlerAssistUnit.text = str.substring(
                                            0,
                                            str.length - 1
                                        );
                                    }
                                }
                            }

                            // ----------------------------------------------
                            if (this.list[i].intType == "4") {
                                if (!!this.list[i].objCheckedList) {
                                    this.list[i].objCheckedList.forEach((item) => {
                                        item.text = item.strChecked_name;
                                        if (item.strChecked_id == this.list[i].strValue) {
                                            this.list[i].text = item.strChecked_name;
                                        }
                                    });
                                } else {
                                    this.list[i].text = this.list[i].strValue;
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
                    this.$toast(err);
                });
        },
        // 去原生拿数据
        chooseUnit(item) {
            this.keyNew = item.strKey;
            if (item.strKey == "strHandlerMainUnit") {
                let data = { singleType: 1, unitId: item.strValue };
                this.appRequest(data, 2);
            }
            if (item.strKey == "strHandlerAssistUnit") {
                let data = { singleType: 2, unitId: item.strValue };
                this.appRequest(data, 2);
            }
        },
        hasAppData(e) {
            if (!!e) {
                if (JSON.parse(e).data.submitType == 1) {
                    this.$router.push("/getinfo/index");
                    localStorage.setItem("recDel", true);
                }
                let namestr = ""; // 拼接名字
                var arr = JSON.parse(e).data.unitId.split(",");
                arr.forEach((item) => {
                    namestr = namestr + item.split("/")[2] + ",";
                });
                if (this.keyNew == "strHandlerMainUnit") {
                    this.strHandlerMainUnit.strValue = JSON.parse(e).data.unitId;
                    Vue.delete(this.strHandlerMainUnit, "text");
                    Vue.set(
                        this.strHandlerMainUnit,
                        "text",
                        namestr.substring(0, namestr.length - 1)
                    );
                }
                if (this.keyNew == "strHandlerAssistUnit") {
                    this.strHandlerAssistUnit.strValue = JSON.parse(e).data.unitId;
                    Vue.delete(this.strHandlerAssistUnit, "text");
                    Vue.set(
                        this.strHandlerAssistUnit,
                        "text",
                        namestr.substring(0, namestr.length - 1)
                    );
                }
            }
        },

        // 发文审核提交
        submitpostCheck() {
            var param = {
                strSid: localStorage.getItem("strSid"),
                websvrpwd: localStorage.getItem("websvrpwd"),
                strHandoutMainId: this.strHandoutMainId,
                strWorkFlowId: this.strWorkFlowId,
                strWorkId: this.strWorkId,
                strFileId: this.strFileId,
                strDeleteFileId: this.strDeleteFileId,
            };
            if (!!this.strContent.strFileId && this.strContent.strFileId.length > 0) {
                param.strFileId = param.strFileId + "," + this.strContent.strFileId;
            }
            let arr = [];
            arr.push(this.strDocTitle);
            arr.push(this.strDocTypeId);
            arr.push(this.strDocNoId);
            arr.push(this.strSignYear);
            arr.push(this.strSerialNo);
            arr.push(this.strContent);
            arr.push(this.intNo);
            arr.push(this.strYear);
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
                if (arr[s].intType != 0) {
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
            doAddHandler(param)
                .then((res) => {
                    if (res.data.intCode === 200) {
                        // 传下一节点
                        res.data.objData.intType = 0;
                        res.data.objData.strModeCode = 210;
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
        },

        linkAttachment(types) {
            // localStorage.removeItem("list")
            // localStorage.setItem("affixType", type);
            this.attachmentTypes = types;
            this.isShowAffix = true;
        },
        collect() {
            var param = {
                strSid: localStorage.getItem("strSid"),
                websvrpwd: localStorage.getItem("websvrpwd"),
                strWorkId: getRequest().strWorkId,
                intType: this.collectType,
            };
            collect(param)
                .then((res) => {
                    console.log(res);
                    if (res.data.intCode === 200) {
                        if (this.collectType == 1) {
                            this.$toast("收藏成功");
                            this.collectType = 2;
                        } else {
                            this.$toast("已取消收藏");
                            this.collectType = 1;
                        }
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

        // 附件图片转换
        annexImg(type) {
            var img = setImgPath(type);
            return img;
        },

        //改变单选框值
        changeRadio(item) {
            if (item.strKey == "strHandlerType") {
                if (item.strValue == "办件") {
                    for (var i = 0; i < this.list.length; i++) {
                        if (this.list[i].strKey == "strHandlerLimitDate") {
                            this.showHandlerLimitDate = true;
                        }
                    }
                } else {
                    this.showHandlerLimitDate = false;
                }
            }
        },
    },
};
</script>
<style lang='stylus' scoped>
@import '~assets/stylus/mixin.styl'
.post_edit_body
    background #f7f7f7
    padding-top 55px
    padding-bottom 80px
    .color_000
        color #000 !important
        font-weight 700
    .arrow-left
        font-size 16px
        vertical-align middle
        margin-top -3px
    .like-o
        font-size 22px
        margin 0 10px
    .post_edit_main
        .post_edit_main_title
            padding 12px 0
            background #fff
            p
                font(16px, 26px)
                color #000
                padding 0 16px
                i
                    color red
                    &.icon-xuanze
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
        border-bottom 1px solid #eee
.post_edit_main_type
    font(16px, 30px)
    color #999
    padding 0 15px
    margin-top 10px
    .edit_item1
        width 50%
        float left
        .van-cell
            padding 0 5px
            height 30px
            background #f5f5f5
            line-height 30px
            border-radius 5px
    .edit_item2
        width 20%
        float left
        text-align center
        .van-cell
            padding 0 5px
            height 30px
            background #f5f5f5
            line-height 30px
            border-radius 5px
    .edit_item3
        width 20%
        float left
        text-align center
        .van-cell
            padding 0 5px
            height 30px
            background #f5f5f5
            line-height 30px
            border-radius 5px
.textContent
    position relative
    padding 10px 10px 0 40px
    font(16px, 25px)
    word-break break-all
    .annex_item_img
        pos(10px, none, none, 12px)
        width 25px
        height 25px
// 底部提交
.post_edit_foot
    background #ffffff
    width 100%
    padding 10px 15px
    border-top 1px solid #eee
    pos(none, 0, 0, 0, 0, 100)
    display flex
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
</style>

