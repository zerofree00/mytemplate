<template>
    <!-- <div class="postDetail_body" :class="blShowDelete?'paddbtm_65':''"> -->
    <div class="postDetail_body">
        <!-- 头部 start -->
        <van-nav-bar @click-left="onleft">
            <template #left>
                <div class="color_000">
                    <van-icon name="arrow-left" class="arrow-left" />
                    <span class="header_title">议题详情</span>
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
                        <p>{{strName.strValue}}</p>
                        <span class="line"></span>
                    </div>
                    <div class="detail_tt_item">{{strReoprter.strName}}：{{strReoprter.strValue}}</div>
                    <div class="detail_tt_item">{{strReoprtUnit.strName}}：{{strReoprtUnit.strValue}}</div>
                </div>
                <div class="detail_text_bottom">
                    <span class="fujian fuAffix" @click="linkAttachment('text')">
                        <van-icon class="iconfont" class-prefix="icon" name="webfujian" />附件
                        <van-tag round color="#e8f2ff" text-color="#137cfc">{{this.intFileCount.strValue}}</van-tag>
                    </span>
                    <span class="text float_r" @click="readContent">
                        <van-icon class="iconfont" class-prefix="icon" name="chakan" />查看正文
                    </span>
                </div>
            </div>
            <!-- ---------------------------------标题  --------------end--------------------------------------------------------------- -->

            <!-- -------------------------------------------------正文 end -->
            <div class="detail_list clearfix">
                <div class="detail_list_item" v-for="(item,index) in list" :key="index">
                    <h1>{{item.strName}}</h1>
                    <p v-if="!!item.strValue && item.strValue!='null'">{{item.strValue}}</p>
                    <p v-if="!item.strValue || item.strValue=='null'">—</p>
                </div>
            </div>
        </div>
        <!-- 主体 end -->
        <!-- 删除 -->
        <!-- <div class="btn_box" v-if="blShowDelete">
      <div class="btn" @click="showDelDialog()">删除</div>
    </div> -->

        <!-- 组件 ---附件页面-->
        <affix v-if="isShowAffix" @getfileData="getfileData" :affixshow="affixshow" :types="this.attachmentTypes"></affix>
    </div>
</template>
<script>
// import { postDetail, senddelete } from "@/api/post";
import { getRequest } from "@/assets/js/util";
import { meetAppEntry, openWps } from "@/api/common";
import { communication } from "@/assets/js/mixin";
import affix from "@/components/attachment/affix.vue";
export default {
    components: {
        affix,
    },
    name: "meetEntry_detail",
    mixins: [communication],
    data() {
        return {
            list: [],
            intFileCount: {}, //附件数量
            strName: {}, // 标题
            strReoprter: {}, // 发文单位
            strReoprtUnit: {}, // 发文时间
            blShowHandList: "",
            isCollect: "", //是否被收藏
            // blShowDelete: JSON.parse(getRequest().blShowDelete),
            strContent: {},
            isShowAffix: false,
            affixshow: false,
            attachmentTypes: "",//附件类型
        };
    },
    created() {
        // if (getRequest().backDetail == "true") {
        localStorage.setItem("strSid", getRequest().strSid);
        // }
        this.meetAppEntry();
    },
    methods: {
        // 附件
        getfileData(strFileId, strDeleteFileId, intSelectNum, type) {
            this.intFileCount = intSelectNum;
            this.isShowAffix = type;
        },

        // 获取发文详情
        meetAppEntry() {
            var param = {
                strSid: getRequest().strSid,
                strThemeId: getRequest().strThemeId,
            };
            meetAppEntry(param)
                .then((res) => {
                    if (res.data.intCode === 200) {
                        this.isCollect = res.data.objData.isCollected;
                        this.blShowHandList = res.data.objData.blShowHandList;
                        this.list = res.data.objData.objFormList;
                        for (var i = 0; i < this.list.length; i++) {
                            if (this.list[i].strKey == "strName") {
                                this.strName = this.list[i];
                                this.list.splice(i, 1);
                            }
                            if (this.list[i].strKey == "strReoprter") {
                                this.strReoprter = this.list[i];
                                this.list.splice(i, 1);
                            }
                            if (this.list[i].strKey == "strReoprtUnit") {
                                this.strReoprtUnit = this.list[i];
                                this.list.splice(i, 1);
                            }
                            if (this.list[i].strKey == "strContent") {
                                this.strContent = this.list[i];
                                this.list.splice(i, 1);
                            }
                            if (this.list[i].strKey == "intFileCount") {
                                this.intFileCount = this.list[i];
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

        linkAttachment(types) {
            this.attachmentTypes = types;
            this.isShowAffix = true;
        },

        onleft() {
            this.appRequest({}, 0);

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
                    font(16px, 30px);
                    color: #000;
                    font-weight: bold;
                p
                    font(14px, 25px);
                    color: #999999;
                    // height 25px
            .item_inline
                display: inline-block;
                width: 50%;
                float: left;
</style>