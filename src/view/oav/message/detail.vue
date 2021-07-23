<template>
    <div class="message_detail" :class="isReply ? 'pd75' : ''">
        <van-nav-bar @click-left="onleft">
            <template #left>
                <div class="color_000">
                    <van-icon name="arrow-left" class="arrow-left" />
                    <span class="header_title">公告详情</span>
                </div>
            </template>
        </van-nav-bar>

        <div class="message_main">
            <div class="message_title">
                <div class="message_top">
                    <p class="title">{{ strTitle }}</p>
                    <div class="tips">
                        <span>
                            <van-icon
                                class="iconfont"
                                class-prefix="icon"
                                name="bumenziliao"
                            />
                            {{ strUnit }}
                        </span>
                        <span class="time">
                            <van-icon
                                class="iconfont"
                                class-prefix="icon"
                                name="shijian1"
                            />
                            {{ strSendTime }}
                        </span>
                    </div>
                </div>
                <div class="message_text">
                    <div class="richText" v-html="strContent"></div>
                </div>
            </div>

            <div class="message_con">
                <div class="message_annex" v-if="annexList.length > 0">
                    <div class="message_con_title">
                        <p>
                            <span>附件</span>
                            <i></i>
                        </p>
                    </div>
                    <div class="message_annex_list">
                        <div
                            class="annex_item"
                            v-for="(item, index) in annexList"
                            :key="index"
                        >
                            <img
                                class="annex_item_img"
                                :src="annexImg(item.strFileUrl)"
                                alt
                            />
                            <p>{{ item.strFileName }}</p>
                        </div>
                    </div>
                </div>

                <div class="message_reply" id="replyList">
                    <div class="message_con_title">
                        <p>
                            <span>全部评论</span>
                            <i></i>
                        </p>
                    </div>
                    <div class="message_reply_list">
                        <van-list
                            v-model="loading"
                            :finished="finished"
                            finished-text="没有更多了"
                            :immediate-check="false"
                            @load="getMessageDetail"
                            v-if="replyList.length > 0"
                        >
                            <div
                                class="reply_item"
                                v-for="(item, index) in replyList"
                                :key="index"
                            >
                                <img
                                    class="tx"
                                    v-lazy="baseUrl + item.strPhotoUrl"
                                    alt
                                />
                                <van-icon
                                    class="iconfont delete"
                                    class-prefix="icon"
                                    name="lajitong"
                                    @click="deleteC(item.strReplyId, index)"
                                />
                                <div class="reply_item_con">
                                    <h1>{{ item.strUser }}</h1>
                                    <p>
                                        <span>{{ item.strDepartment }}</span>
                                        <span class="time">{{
                                            item.strTime
                                        }}</span>
                                    </p>
                                    <div class="reply_content">
                                        {{ item.showContent }}
                                        <span
                                            style="color:#198eff"
                                            v-if="
                                                item.showContent.length <= 40 &&
                                                    item.strContent.length > 40
                                            "
                                            @click="showtext(index)"
                                        >
                                            展开
                                            <van-icon name="arrow-down" />
                                        </span>
                                        <span
                                            style="color: #198eff"
                                            v-if="item.showContent.length > 40"
                                            @click="hidetext(index)"
                                        >
                                            收起
                                            <van-icon name="arrow-up" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </van-list>
                        <div
                            v-if="replyList.length == 0"
                            class="nodata"
                            style="padding:10px 0;margin-top:0"
                        >
                            <img
                                src="~assets/images/none.png"
                                alt
                                class="nodataimg"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 初始评论 -->
        <div class="commentBox" v-if="isReply">
            <img class="tx" v-lazy="baseUrl + userInfo.strPhotoUrl" alt />
            <div class="commentBox_con" @click="showReplyInput">
                <span>说说你的想法...</span>
                <span class="float_r">0/200</span>
            </div>
        </div>

        <div class="commentBoxInput" v-if="isReplyInput">
            <div class="comment_field">
                <van-field
                    v-model="commentVal"
                    rows="3"
                    autosize
                    type="textarea"
                    placeholder="说说你的想法..."
                    @input="changeReplyInput"
                    ref="replyInput"
                />
            </div>
            <div class="comment_btn">
                <span class="num">{{ sizeNum }}/200</span>
                <van-button type="info" size="small" @click="submitComment"
                    >发表</van-button
                >
            </div>
        </div>
        <van-overlay
            z-index="100"
            :show="isReplyInput"
            @click="isReplyInput = false"
        />
    </div>
</template>
<script>
import Vue from 'vue'
import {
    messageDetail,
    messageAddComment,
    messageDeleteComment,
} from '@/api/notice'
import { getRequest, setImgPath, baseUrl } from '@/assets/js/util'
import { communication } from '@/assets/js/mixin'
import { Dialog } from 'vant'
export default {
    mixins: [communication],
    data() {
        return {
            strTitle: {}, // 标题
            strUnit: {}, // 单位
            strSendTime: {}, // 时间
            strContent: {}, //正文内容
            annexList: [], //附件列表
            replyList: [], // 评论列表
            img: '',
            baseUrl: baseUrl,
            loading: false,
            finished: false,
            intCurPage: 1,
            sizeNum: '0', //输入框字数
            isReply: false, // 是否可回复
            isReplyInput: false, // 是否展示评论输入框
            commentVal: '', //评论列表内容
            userInfo: JSON.parse(localStorage.getItem('userInfo')), //获取登录时候的信息
        }
    },
    created() {
        if (getRequest().backDetail == 'true') {
            localStorage.setItem('strSid', getRequest().strSid)
        }
        this.getMessageDetail()
    },

    methods: {
        //获取详情数据
        getMessageDetail() {
            this.$toast.loading({
                message: '加载中...',
                forbidClick: true,
                loadingType: 'spinner',
                duration: 500,
            })
            var param = {
                strSid: localStorage.getItem('strSid'),
                strId: getRequest().strId,
                websvrpwd: localStorage.getItem('websvrpwd'),
                intCurPage: this.intCurPage,
                intPageSize: '10',
            }
            messageDetail(param)
                .then((res) => {
                    if (res.data.intCode == 200) {
                        this.strTitle = res.data.objData.strTitle
                        this.strUnit = res.data.objData.strUnit
                        this.strSendTime = res.data.objData.strSendTime
                        this.strContent = res.data.objData.strContent
                        this.annexList = res.data.objData.objFileList

                        if (res.data.objData.isCanReply == '1') {
                            //是否可回复
                            this.isReply = true
                        } else {
                            this.isReply = false
                        }
                        this.replyList = this.replyList.concat(
                            res.data.objData.objReplyList
                        )
                        this.intCurPage++
                        this.finished = false
                        if (
                            this.replyList.length >=
                            res.data.objData.intAllCount
                        ) {
                            this.finished = true
                        }
                        this.loading = false

                        for (var i = 0; i < this.replyList.length; i++) {
                            if (this.replyList[i].strContent.length > 40) {
                                this.replyList[i].showContent = this.replyList[
                                    i
                                ].strContent.slice(0, 40)
                            } else {
                                this.replyList[i].showContent = this.replyList[
                                    i
                                ].strContent
                            }
                        }
                    } else {
                        this.$toast(res.data.strMsg)
                    }
                })
                .catch((err) => {
                    this.$toast(err)
                })
        },

        //发表评论
        submitComment() {
            var param = {
                strSid: localStorage.getItem('strSid'),
                strId: getRequest().strId,
                websvrpwd: localStorage.getItem('websvrpwd'),
                strReplyContent: this.commentVal,
            }
            messageAddComment(param)
                .then((res) => {
                    if (res.data.intCode == 200) {
                        this.$toast('评论成功~')
                        var obj = {
                            strUser: this.userInfo.strUserName,
                            strTime: '刚刚',
                            strDepartment: this.userInfo.objAllUnit_list[0]
                                .strUnit_name,
                            strContent: this.commentVal,
                            showContent: this.commentVal.slice(0, 40),
                            strReplyId: res.data.objData.strReplyId,
                            strPhotoUrl: this.userInfo.strPhotoUrl,
                        }
                        this.replyList.unshift(obj)
                        this.isReplyInput = false

                        this.$el.querySelector('#replyList').scrollIntoView({
                            behavior: 'smooth', // 平滑过渡
                            block: 'start', // 上边框与视窗顶部平齐。默认值
                        })
                    } else {
                        this.$toast(res.data.strMsg)
                    }
                })
                .catch((err) => {
                    this.$toast(err)
                })
        },

        // 删除确认操作
        deleteC(strReplyId, index) {
            Dialog.confirm({
                title: '提示',
                message: '您确定删除该评论么?',
            })
                .then(() => {
                    this.deleteComment(strReplyId, index)
                })
                .catch(() => {})
        },

        // 删除评论
        deleteComment(strReplyId, index) {
            var param = {
                strSid: localStorage.getItem('strSid'),
                strId: getRequest().strId,
                websvrpwd: localStorage.getItem('websvrpwd'),
                strReplyId: strReplyId,
            }
            messageDeleteComment(param)
                .then((res) => {
                    if (res.data.intCode == 200) {
                        this.$toast('删除成功~')
                        this.replyList.splice(index, 1)
                    } else {
                        this.$toast(res.data.strMsg)
                    }
                })
                .catch((err) => {
                    this.$toast(err)
                })
        },

        // 展示评论输入框
        showReplyInput() {
            this.isReplyInput = true
            this.commentVal = ''
            setTimeout(() => {
                this.$refs.replyInput.focus() //自动获取焦点
            }, 200)
        },

        // 监听文本框字段变化
        changeReplyInput(val) {
            this.sizeNum = val.length
        },

        // 附件图片转换
        annexImg(type) {
            var img = setImgPath(type)
            return img
        },

        // 展开评论
        showtext(index) {
            var obj = this.replyList[index]
            obj.showContent = obj.strContent
            Vue.set(this.replyList, index, obj)
        },

        // 收起评论
        hidetext(index) {
            var obj = this.replyList[index]
            obj.showContent = obj.strContent.slice(0, 40)
            Vue.set(this.replyList, index, obj)
        },

        // 返回
        onleft() {
            if (getRequest().backDetail == 'true') {
                this.appRequest({}, 0)
            } else {
                this.$router.back()
            }
        },
    },
}
</script>
<style lang="stylus">
@import '~assets/stylus/mixin.styl'
.richText
  word-break break-all
  font(16px,25px)
  img
    width 100%
    display block

.message_detail
  background-color #f6f6f6
  min-height 100%
  padding-top 45px
  .message_title
    padding 10px
    background #ffffff
    .message_top
      padding 10px 0
      border-bottom 1px solid #eeeeee
      .title
        font(18px, 30px)
        font-weight bold
      .tips
        font(14px, 30px)
        color #666
        .time
          margin-left 20px
    .message_text
      padding 10px 0
  .message_con
    margin-top 10px
    padding 15px 0
    background #ffffff
    .message_con_title
      margin-bottom 15px
      p
        height 30px
        line-height 30px
        position relative
        display inline-block
        span
          position relative
          z-index 2
          font(18px, 30px)
          font-weight bold
        i
          width 120%
          display inline-block
          height 10px
          background #e9f2ff
          pos(none, none, 0, 0, 1, 0)
    .message_annex
      padding 0 10px
      .annex_item
        margin-bottom 10px
        position relative
        padding-left 35px
        height 30px
        .annex_item_img
          width 30px
          pos(0, none, none, 0, 1, 1)
        p
          font(16px, 30px)
          color #333
    .message_reply
      padding 0 10px
      margin-top 20px
      .message_reply_list
        .reply_item
          padding-left 50px
          position relative
          .tx
            pos(20px, none, none, 0, 1, 1)
            width 40px
            height 40px
            border-radius 50%
          .delete
            pos(25px, 10px, none, none, 1, 1)
            font(18px, 24px)
            color #666
          .reply_item_con
            width 100%
            border-bottom 1px solid #eee
            padding 15px 0 15px 0
            h1
              font(16px, 25px)
              color #333
              font-weight bold
            p
              font(14px, 22px)
              color #666
              .time
                margin-left 20px
            .reply_content
              font(16px, 25px)
              color #333
              position relative
              span
                font-size 14px
                i
                  vertical-align middle
  .commentBox
    width 100%
    height 70px
    background #ffffff
    padding 15px 10px 15px 60px
    border-top 1px solid #eeeeee
    pos(none, none, 0, 0, 0, 10)
    .tx
      width 40px
      height 40px
      border-radius 50%
      pos(15px, none, none, 10px, 1, 10)
    .commentBox_con
      width 100%
      height 40px
      background #f2f2f2
      border-radius 5px
      padding 0 10px
      font(16px, 40px)
      color #999
  .commentBoxInput
    width 100%
    background #ffffff
    padding 15px 10px 5px 10px
    border-top 1px solid #eeeeee
    pos(none, none, 0, 0, 0, 101)
    .van-cell
      padding 0
      background #f2f2f2
      border-radius 5px
      textarea
        padding 10px
        height 80px
        font-size 16px
    .comment_btn
      text-align right
      font(16px, 50px)
      .num
        color #999
        margin-right 30px
      button
        font-size 16px
.pd75
  padding-bottom 75px
</style>
