<template>
    <div class="sign_body">
        <!-- 完成 -->
        <!-- 头部开始 -->
        <van-nav-bar @click-left="onleft">
            <template #left>
                <div class="color_000">
                    <van-icon name="arrow-left" class="arrow-left" />
                    <span class="header_title">{{signType==1?'公文签收':'公文拒收'}}</span>
                </div>
            </template>
        </van-nav-bar>
        <!-- 头部结束 -->

        <!-- 签收操作 start-->
        <div class="sign_main" v-if="signType==1">
            <div class="list_item">
                <div class="inter_box clearfix">
                    <div class="left_box">收文流程</div>
                    <div class="right_box" @click="chooseProcess">
                        <van-notice-bar :text="obj.strWorkFlowName" />
                        <van-icon name="arrow" />
                    </div>
                </div>
                <div class="inter_box">
                    <div class="left_box">签收意见</div>
                    <div>
                        <van-field v-model="opinion" rows="1" autosize type="textarea" placeholder="请输入" />
                    </div>
                </div>
                <div class="inter_box clearfix">
                    <div class="left_box">签收时间</div>
                    <div class="right_box">{{strRecDate.strValue}}</div>
                </div>
                <div class="inter_box clearfix">
                    <div class="left_box">签收人</div>
                    <div class="right_box">{{strRecUserName.strValue}}</div>
                </div>
                <div class="inter_box clearfix">
                    <div class="left_box">签收部门</div>
                    <div class="right_box">{{strRecUnitName.strValue}}</div>
                </div>
            </div>
        </div>
        <!-- 签收操作 end-->

        <!-- 拒收操作 -->
        <div class="sign_main" v-if="signType==2">
            <div class="list_item">
                <div class="inter_box">
                    <div class="left_box">拒收原因</div>
                    <div>
                        <van-field v-model="opinion" rows="1" autosize type="textarea" placeholder="请输入" />
                    </div>
                </div>
                <div class="inter_box clearfix">
                    <div class="left_box">拒收时间</div>
                    <div class="right_box">{{strRecDate.strValue}}</div>
                </div>
                <div class="inter_box clearfix">
                    <div class="left_box">拒收人</div>
                    <div class="right_box">{{strRecUserName.strValue}}</div>
                </div>
                <div class="inter_box clearfix">
                    <div class="left_box">拒收部门</div>
                    <div class="right_box">{{strRecUnitName.strValue}}</div>
                </div>
            </div>
        </div>
        <!-- 拒收操作 end -->

        <div class="post_edit_foot">
            <div class="post_submit">
                <button @click="deptsign">确定</button>
            </div>
        </div>
    </div>
</template>
<script>
import { deptsign } from "@/api/department";
import { getRequest } from "@/assets/js/util";
import { communication } from "@/assets/js/mixin";
import Vue from "vue";
export default {
    mixins: [communication],
    data() {
        return {
            signType: getRequest().signType, //获取签收类型
            opinion: "",
            strFlowId: "", //流转节点id
            strRecDate: {},
            strRecUserName: {},
            strRecUnitName: {},
            obj: {},
        };
    },
    created() {
        if (getRequest().backDetail == "true") {
            localStorage.setItem("strSid", getRequest().strSid);
        }
        window.appResponse = this.appResponse;
        if (this.signType == "1") {
            this.strFlowId = "8e4f7126a0ac4aff87d104191f9e5122";
        }

        JSON.parse(localStorage.getItem("departDetailList")).forEach((item) => {
            if (item.strKey == "strRecDate") {
                this.strRecDate = item;
            }
            if (item.strKey == "strRecUserName") {
                this.strRecUserName = item;
            }
            if (item.strKey == "strRecUnitName") {
                this.strRecUnitName = item;
            }
            if (item.strKey == "strSignIdea") {
                this.opinion = item.strValue;
            }
        });
    },
    methods: {
        chooseProcess() {
            var data = { strModeCode: 220 };
            this.appRequest(data, 7);
        },
        hasAppData(e) {
            if (e) {
                Vue.set(
                    this.obj,
                    "strWorkFlowName",
                    JSON.parse(e).data.strWorkFlowName
                );
                this.obj.strWorkFlowId = JSON.parse(e).data.strWorkFlowId;
                this.obj.strWorkId = JSON.parse(e).data.strWorkId;
            }
        },
        // 签收，拒收
        deptsign() {
            // if (!this.obj.strWorkFlowName && this.signType == "1") {
            //   this.$toast("请选择流程~");
            //   return;
            // }
            var param = {
                strSid: localStorage.getItem("strSid"),
                websvrpwd: localStorage.getItem("websvrpwd"),
                strWorkId: getRequest().strWorkId,
                intType: this.signType,
                strModeCode: "220",
                strIdea: this.opinion,
            };
            deptsign(param)
                .then((res) => {
                    console.log(res);
                    if (res.data.intCode === 200) {

                        if (this.signType == "1") {
                            this.$toast.clear()
                            this.$router.push({
                                path: "/department/sign_enrolment",
                                query: {
                                    strWorkId: this.obj.strWorkId,
                                    strModeCode: getRequest().strModeCode,
                                    strHandoutMainId: res.data.objData.strHandoutMainId,
                                    // strWorkFlowId: this.obj.strWorkFlowId,
                                    strWorkFlowId: 'a5e9655693454c04b65388151380bc5d',
                                    strType: 0,
                                    strSignIdea: this.opinion,
                                },
                            });
                        } else {
                            this.$toast('操作成功');
                            localStorage.setItem("departDel", "true");
                            this.$router.go(-2)
                        }
                    } else {
                        this.$toast(res.data.strMsg);
                    }
                })
                .catch((err) => {
                    console.log(err);
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
.sign_body
    padding-top: 46px;
    min-height: 100%;
    padding-bottom: 80px;
    .sign_main
        height: 100%;
        .list_item
            padding: 0 16px;
            background-color: #fff;
            .inter_box
                padding: 16px 0;
                font-size: 16px;
                // display flex
                position: relative;
                width: 100%;
                color: #323233;
                border-bottom: 1px solid #ebedf0;
                .left_box
                    width: 24%;
                    float: left;
                .right_box
                    width: 76%;
                    float: left;
                    text-align: right;
                .van-cell
                    padding: 10px 0;
    .post_edit_foot
        background: #ffffff;
        width: 100%;
        padding: 10px 15px;
        border-top: 1px solid #eee;
        pos(none, 0, 0, 0, 0, 100);
        .post_submit
            width: 100%;
            margin-right: 20px;
            button
                width: 100%;
                height: 40px;
                font-size: 16px;
                border: none;
                background: #137cfc;
                color: #ffffff;
                border-radius: 5px;
</style>