<template>
    <div>
        <div
            class="email_edit"
            :class="intType == 2 || intType == 3 ? 'paddbtm_65' : ''"
            v-if="!isShowAffix"
        >
            <!-- 头部 start -->
            <van-nav-bar @click-left="onleft">
                <template #left>
                    <div class="color_000">
                        <van-icon name="arrow-left" class="arrow-left" />
                        <span class="header_title">{{ title }}邮件</span>
                    </div>
                </template>
                <template #right v-if="intType == 0 || intType == 1">
                    <div class="color_000" @click="emailaddAct(0)">
                        <van-button type="info" class="submin_btn"
                            >发送</van-button
                        >
                    </div>
                </template>
            </van-nav-bar>
            <!-- 头部 end -->

            <!-- 主体 start-->
            <div class="post_edit_main">
                <div class="post_edit_main_title">
                    <p>
                        主题
                        <i>*</i>
                    </p>
                    <van-field
                        rows="1"
                        autosize
                        type="textarea"
                        placeholder="请输入"
                        v-model="strTitle.strValue"
                    />
                </div>

                <div class="post_edit_main_list">
                    <van-cell-group>
                        <!-- -----------------------------------------------------------------公文分类 ------------------------->
                        <van-cell is-link @click="chooseUnit()">
                            <template #title>
                                <div class="title">
                                    收件人
                                    <i class="color_i">*</i>
                                </div>
                            </template>
                            <span>请选择</span>
                            <van-notice-bar
                                v-if="
                                    !!strRecUsers.strValue &&
                                        strRecUsers.strValue.length > 0
                                "
                                :text="strRecUsers.text"
                            />
                        </van-cell>

                        <!-- -----------------------正文内容----------------------------------------------------------------start -->

                        <div class="post_edit_main_title post_edit_line">
                            <p>
                                正文
                                <!-- <i class="color_i">*</i> -->
                            </p>
                            <div class="quillEditor" v-if="isloading">
                                <quillEditor
                                    :strContent="strContent"
                                    @hasdata="hasdata"
                                ></quillEditor>
                            </div>
                        </div>

                        <van-cell title="是否紧急">
                            <template #right-icon>
                                <van-switch size="20" v-model="isurge" />
                            </template>
                        </van-cell>
                        <!-- -----------------------提醒方式----------------------------------------------------------------start -->

                        <div class="post_edit_main_title">
                            <p>提醒方式</p>
                            <div class="post_edit_checkbox">
                                <van-field name="checkboxGroup">
                                    <template #input>
                                        <van-checkbox v-model="checked1"
                                            >系统消息</van-checkbox
                                        >
                                        <van-checkbox v-model="checked2"
                                            >手机短信</van-checkbox
                                        >
                                        <!-- <van-checkbox-group direction="horizontal" v-model="result">
                    <van-checkbox name="strMsgNotice">系统消息</van-checkbox>
                    <van-checkbox name="strMobileNotice">手机短信</van-checkbox>
                    </van-checkbox-group>-->
                                    </template>
                                </van-field>
                            </div>
                        </div>
                    </van-cell-group>
                </div>
                <!-- -----------------------发送方式----------------------------------------------------------------start -->

                <div class="post_edit_main_title">
                    <p>发送方式</p>
                    <div class="post_edit_radio">
                        <van-field name="radio">
                            <template #input>
                                <van-radio-group
                                    direction="horizontal"
                                    v-model="radio"
                                >
                                    <van-radio name="0">立即发送</van-radio>
                                    <van-radio name="1">定时发送</van-radio>
                                </van-radio-group>
                            </template>
                        </van-field>
                    </div>
                </div>

                <!-- -----------------------发送时间----------------------------------------------------------------start -->

                <van-cell-group>
                    <van-field
                        v-if="radio == '1'"
                        @click="onChoose"
                        label="发送时间"
                        input-align="right"
                        placeholder="请选择"
                        right-icon="arrow"
                        v-model="strDelayDate"
                        readonly
                    />
                    <div
                        class="post_edit_main_title post_edit_line_bot"
                        @click="linkAttachment()"
                    >
                        <p>
                            <span class="label">附件</span>
                            <span class="float_r fujian">
                                <van-tag round type="primary">{{
                                    intFileCount
                                }}</van-tag>
                                <van-icon name="arrow" />
                            </span>
                        </p>
                    </div>
                </van-cell-group>
            </div>
            <!-- 主体 end-->

            <!-- foot开始 -->
            <!-- 草稿箱 -->
            <div class="post_edit_foot" v-if="intType == 2">
                <div class="post_submit">
                    <button @click="showdialog()">发送</button>
                </div>
                <div class="post_foot_tools">
                    <div class="post_foot_item" @click="emailaddAct(1)">
                        <van-icon
                            class="iconfont"
                            class-prefix="icon"
                            name="caogao"
                        />
                        <p>存草稿</p>
                    </div>
                    <div class="post_foot_item" @click="isdelete()">
                        <van-icon
                            class="iconfont"
                            class-prefix="icon"
                            name="lajitong"
                        />
                        <p>删除</p>
                    </div>
                </div>
            </div>

            <!-- 写邮件 -->
            <div class="post_edit_foot" v-if="intType == 3">
                <div class="post_submit">
                    <button @click="emailaddAct(0)">发送</button>
                </div>
                <div class="post_foot_tools">
                    <div class="post_foot_item" @click="emailaddAct(1)">
                        <van-icon
                            class="iconfont"
                            class-prefix="icon"
                            name="caogao"
                        />
                        <p>存草稿</p>
                    </div>
                </div>
            </div>
            <!-- foot结束 -->

            <!-- 时间选择器 -->
            <van-popup v-model="isTimePicker" position="bottom">
                <van-datetime-picker
                    v-model="currentDate"
                    type="datetime"
                    title="选择年月日"
                    :min-date="minDate"
                    :max-date="maxDate"
                    @confirm="onConfirm"
                    @cancel="cancelPicker"
                />
            </van-popup>
        </div>
        <!-- 组件 ---附件页面-->
        <affix v-if="isShowAffix" @getfileData="getfileData"></affix>
    </div>
</template>
<script>
import { communication } from '@/assets/js/mixin'
import quillEditor from '@/components/quillEditor/index.vue'
import { emailadd, emailaddAct, emailhandle } from '@/api/email'
import affix from './affix.vue'
import { getRequest } from '@/assets/js/util'
import Vue from 'vue'
export default {
    components: {
        quillEditor,
        affix,
    },
    mixins: [communication],
    data() {
        return {
            attachmentTypes: '',
            minDate: new Date(2020, 0, 1),
            maxDate: new Date(2025, 10, 1),
            currentDate: new Date(), //时间
            isTimePicker: false, //时间选择状态
            intFileCount: '', //附件数量
            intType: getRequest().intType,
            strId: {}, //id
            strRecId: {}, //回复的那条邮件的id
            strTitle: {}, //标题
            strRecUsers: {}, //收件人id
            strContent: {}, //内容
            strUrgency: {}, //是否紧急
            strOldAffixId: {}, //附件原id
            strFromDraftId: {}, //草稿箱id
            isloading: false, //后台数据是否加载完成
            isurge: '', //紧急
            result: [],
            radio: '0',
            objFileList: [],
            strDelayDate: '',
            strMsgNotice: 0, //系统消息
            strMobileNotice: 0, //手机短信
            checked1: false,
            checked2: false,
            title: getRequest().title,
            isShowAffix: false,
        }
    },
    created() {
        if (getRequest().backDetail == 'true') {
            localStorage.setItem('strSid', getRequest().strSid)
        }
        window.appResponse = this.appResponse
        if (this.intType == 1) {
            //发文的转发
            this.emailadd(getRequest().strId)
        } else if (this.intType == 0) {
            if (getRequest().title == '转发') {
                //收文的转发
                this.emailadd('', getRequest().strId)
            } else {
                this.emailadd('', '', getRequest().strId)
            }
        } else if (this.intType == 2) {
            this.emailadd('', '', '', getRequest().strId)
        } else {
            this.emailadd()
        }
    },
    methods: {
        isdelete() {
            this.$dialog
                .confirm({
                    title: '提示',
                    message: '邮件删除后将无法恢复，确定删除？',
                })
                .then(() => {
                    this.emailhandle()
                })
                .catch(() => {
                    // this.$toast("取消删除");
                })
        },

        // 删除
        emailhandle() {
            var param = {
                strSid: localStorage.getItem('strSid'),
                intType: this.intType,
                intActType: 0,
                strIds: this.strId.strValue,
            }
            emailhandle(param)
                .then((res) => {
                    if (res.data.intCode == 200) {
                        this.$toast('删除成功')
                        this.$router.back()
                        localStorage.setItem('draft', 'true')
                    } else {
                        this.$toast(res.data.strMsg)
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        // 草稿箱发送
        showdialog() {
            if (Number(new Date()) > Number(new Date(this.strDelayDate))) {
                this.$dialog
                    .confirm({
                        title: '提示',
                        message: '已过发送时间，是否直接发送？',
                    })
                    .then(() => {
                        this.radio = '0'
                        this.strDelayDate = ''
                        this.emailaddAct(0)
                    })
                    .catch(() => {})
            } else {
                this.emailaddAct(0)
            }
        },
        // 去原生拿数据
        chooseUnit() {
            // if (this.strRecUsers.strKey == "strRecUsers") {
            let data = { singleType: 2, userId: this.strRecUsers.strValue }
            this.appRequest(data, 1)
            // }
        },
        hasAppData(e) {
            // alert(e);
            if (!!e) {
                let namestr = '' // 拼接名字
                var arr = JSON.parse(e).data.userId.split(',')
                arr.forEach((item) => {
                    namestr = namestr + item.split('/')[2] + ','
                })
                this.strRecUsers.strValue = JSON.parse(e).data.userId
                Vue.set(
                    this.strRecUsers,
                    'text',
                    namestr.substring(0, namestr.length - 1)
                )
            }
        },
        // 提交str
        emailaddAct(intType) {
            if (!!this.strTitle && this.strTitle.strValue.length == 0) {
                this.$toast('请输入主题')
                return
            }
            if (!!this.strRecUsers && this.strRecUsers.strValue.length == 0) {
                this.$toast('请选择收件人')
                return
            }
            if (this.radio == '1' && this.strDelayDate.length == 0) {
                this.$toast('请输入发送时间')
                return
            }
            if (this.checked1 == true) {
                this.strMsgNotice = 1
            } else {
                this.strMsgNotice = 0
            }
            if (this.checked2 == true) {
                this.strMobileNotice = 1
            } else {
                this.strMobileNotice = 0
            }
            if (this.isurge == true) {
                this.strUrgency.strValue = '1'
            } else {
                this.strUrgency.strValue = '0'
            }
            var fileid = ''
            this.objFileList.forEach((item) => {
                fileid = fileid + item.strFileId + ','
            })

            var param = {
                strSid: localStorage.getItem('strSid'),
                strId: this.strId.strValue,
                strRecId: this.strRecId.strValue, //回复的邮件id
                intType: intType,
                strTitle: this.strTitle.strValue,
                strRecUsers: this.strRecUsers.strValue, //收件人
                strContent: this.strContent.strValue,
                strUrgency: this.strUrgency.strValue,
                strMsgNotice: this.strMsgNotice,
                strMobileNotice: this.strMobileNotice,
                strIsDelay: this.radio,
                strDelayDate: this.strDelayDate,
                strFileId: fileid.substring(0, fileid.length - 1),
            }
            if (this.intType == 2) {
                param.strFromDraftId = getRequest().strId
            }
            // alert(JSON.stringify(param))
            emailaddAct(param)
                .then((res) => {
                    if (res.data.intCode == 200) {
                        if (param.intType == 0) {
                            this.$toast('发送成功')
                            // if (this.intType == 0) {
                            //收件箱
                            // localStorage.setItem("inbox", "true");
                            // } else {
                            // 发件箱
                            localStorage.setItem('outbox', 'true')
                            // }
                        } else {
                            this.$toast('存草稿成功')
                            localStorage.setItem('draft', 'true')
                        }
                        this.$router.back()
                        // this.$router.push({path:'/email/index',strSid:localStorage.getItem('strSid')});
                    } else {
                        this.$toast(res.data.strMsg)
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        },

        //获取正文内容
        hasdata(str) {
            this.strContent.strValue = str
        },

        // 获取原邮件数据
        emailadd(
            strFromEmailId = '',
            strFromEmailRecId = '',
            strFromEmailRecReplyId = '',
            strFromDraftId = ''
        ) {
            var param = {
                strSid: localStorage.getItem('strSid'),
                strFromEmailId: strFromEmailId,
                strFromEmailRecId: strFromEmailRecId,
                strFromEmailRecReplyId: strFromEmailRecReplyId,
                strFromDraftId: strFromDraftId,
            }
            emailadd(param)
                .then((res) => {
                    if (res.data.intCode == 200) {
                        this.intFileCount = res.data.objData.objFileList.length
                        this.objFileList = res.data.objData.objFileList
                        this.isloading = true
                        res.data.objData.objFormList.forEach((item) => {
                            if (item.strKey == 'strId') {
                                this.strId = item
                            }
                            if (item.strKey == 'strRecId') {
                                this.strRecId = item
                            }
                            if (item.strKey == 'strTitle') {
                                this.strTitle = item
                            }
                            if (item.strKey == 'strRecUsers') {
                                this.strRecUsers = item
                                var arr = item.strValue.split(',')
                                var namestr = ''
                                arr.forEach((item) => {
                                    namestr = item.split('/')[2]
                                })
                                this.strRecUsers.text = namestr
                            }
                            if (item.strKey == 'strContent') {
                                this.strContent = item
                            }
                            if (item.strKey == 'strUrgency') {
                                this.strUrgency = item
                                if (this.strUrgency.strValue == 1) {
                                    this.isurge = true
                                } else {
                                    this.isurge = false
                                }
                            }
                            if (item.strKey == 'strOldAffixId') {
                                this.strOldAffixId = item
                            }
                            if (item.strKey == 'strFromDraftId') {
                                this.strFromDraftId = item
                            }
                            if (item.strKey == 'strIsDelay') {
                                this.radio = item.strValue
                            }
                            if (item.strKey == 'strDelayDate') {
                                this.strDelayDate = item.strValue
                            }
                            if (item.strKey == 'strMsgNotice') {
                                if (item.strValue == '1') {
                                    this.checked1 = true
                                }
                            }
                            if (item.strKey == 'strMobileNotice') {
                                if (item.strValue == '1') {
                                    this.checked2 = true
                                }
                            }
                        })
                    } else {
                        this.$toast(res.data.strMsg)
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        // 时间选择框
        onChoose() {
            this.isTimePicker = true
        },
        // picker确认
        onConfirm(val) {
            console.log(this.timeFormat(val))
            this.strDelayDate = this.timeFormat(val)
            this.isTimePicker = false
        },

        linkAttachment() {
            //   this.attachmentTypes = types;
            this.isShowAffix = true
        },
        getfileData(data, type) {
            this.objFileList = data
            this.intFileCount = data.length
            console.log(data)
            this.isShowAffix = type
        },
        cancelPicker() {
            this.isTimePicker = false
        },

        onleft() {
            if (this.title == '回复') {
                this.$dialog
                    .confirm({
                        title: '提示',
                        message: '是否存入草稿箱？',
                    })
                    .then(() => {
                        this.emailaddAct(1)
                    })
                    .catch(() => {
                        this.$router.back()
                    })
            } else {
                if (getRequest().backDetail == 'true') {
                    this.appRequest({}, 0)
                } else {
                    this.$router.back()
                }
            }
        },
        timeFormat(time) {
            let year = time.getFullYear()
            let month = time.getMonth() + 1
            let day = time.getDate()
            let hour = time.getHours()
            let minutes = time.getMinutes()
            if (month >= 1 && month <= 9) {
                month = '0' + month
            }
            if (day >= 0 && day <= 9) {
                day = '0' + day
            }
            if (hour >= 0 && hour <= 9) {
                hour = '0' + hour
            }
            if (minutes >= 0 && minutes <= 9) {
                minutes = '0' + minutes
            }
            return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes
        },
    },
    beforeRouteLeave(to, form, next) {
        localStorage.removeItem('emailAffixList')
        next()
    },
}
</script>
<style lang="stylus" scoped>
@import '~assets/stylus/mixin.styl'
.email_edit
    background #f7f7f7
    padding-top 55px
    // padding-bottom 80px
    .submin_btn
        height 100%
        padding 0 3px
        padding 6px 10px
        border-radius 5px
    .quill_content
        font-size 14px
        padding 10px
    .quillEditor
        width 100%
        padding 15px 10px
    .color_000
        color #000 !important
        font-weight 700
    .arrow-left
        font-size 16px
        vertical-align middle
        margin-top -3px
    .like-o
        display inline-block
        vertical-align middle
    .van-nav-bar__right
        i
            font-size 22px
            margin-left 15px
            display inline-block
            vertical-align middle
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
.post_edit_line
    border-top 1px solid #f6f6f6
.post_edit_line_bot
    border-bottom 1px solid #f6f6f6
.post_edit_main_type
    font(16px, 30px)
    color #999
    padding 0 15px
.post_edit_radio
    .van-radio
        margin-bottom 10px
// 底部提交
.post_edit_foot
    background #ffffff
    width 100%
    padding 10px 15px
    border-top 1px solid #eee
    pos(none, 0, 0, 0, 0, 100)
    display flex
    .btn_btm
        width 100%
        height 100%
        background #137cfc
        color #ffffff
        border-radius 5px
        text-align center
        line-height 40px
        font-size 16px
    .post_submit
        width 65%
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
