<template>
  <div class="post_edit_body">
    <!-- 头部 start -->
    <van-nav-bar @click-left="onleft">
      <template #left>
        <div class="color_000">
          <van-icon name="arrow-left" class="arrow-left" />
          <span class="header_title">公文详情</span>
        </div>
      </template>
    </van-nav-bar>
    <!-- 头部 end -->

    <!-- 主体 start-->
    <div class="post_edit_main">
      <div class="post_edit_main_title">
        <p>
          {{strDocTitle.strName}}
          <i>*</i>
        </p>
        <van-field v-model="title" rows="1" autosize readonly type="textarea" placeholder="请输入" />
      </div>

      <div class="list_item mt10" v-if="!!strContent.strValue">
        <div class="content_box">
          <p>正文内容</p>
          <div class="textContent"  @click="readContent(strContent.strValue)">
            <img class="annex_item_img" :src="annexImg(strContent.strFileName)" alt/>
            {{strContent.strFileName}}
          </div>
        </div>
      </div>

      <div class="mt10">
        <div class="list_item" v-for="(item, index) in list" :key="index">
          <div class="inter_box">
            <div class="left_box">{{item.strName}}</div>
            <div class="right_box">{{item.strValue}}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 主体 end-->

    <!-- 底部 --> 
    <div class="post_edit_foot">
      <div class="post_submit">
        <button @click="goSign(1)">签收</button>
      </div>
      <div class="post_foot_tools">
        <button @click="goSign(2)">拒收</button>
      </div>
    </div>
    <!-- 底部 end -->
    
  </div>
</template>
<script>
import { receivedDetail } from "@/api/getInfo";
import { setImgPath, getRequest } from "@/assets/js/util";
import { openWps } from "@/api/common";
import { communication } from "@/assets/js/mixin";
export default {
   mixins: [communication],
  data() {
    return {
      title: "",
      list: [],
      strDocTitle: {}, // 标题
      strContent: {}, // 正文内容
    };
  },
  created() {
    if (getRequest().backDetail == "true") {
      localStorage.setItem("strSid", getRequest().strSid);
    }
    this.getreceivedDetail();
  },
  methods: {
    getreceivedDetail() {
      var param = {
        strSid: localStorage.getItem("strSid"),
        websvrpwd: localStorage.getItem("websvrpwd"),
        strWorkId: getRequest().strWorkId,
        strModeCode: getRequest().type,
        intPageSize: "10",
      };
      receivedDetail(param)
        .then((res) => {
          console.log(res);
          if (res.data.intCode === 200) {
            this.intFileCount = res.data.objData.intFileCount;
            this.list = res.data.objData.objFormList;
            for (var i = 0; i < this.list.length; i++) {
              if (this.list[i].strKey == "strDocTitle") {
                this.strDocTitle = this.list[i];
                this.title = this.strDocTitle.strValue;
                this.list.splice(i, 1); // 去除数组里面的标题
              }

              // 正文内容
              if (this.list[i].strKey == "strContent") {
                this.strContent = this.list[i];
                this.list.splice(i, 1);
                let arr = this.strContent.strValue.split("/");
                this.strContent.strFileName = arr[arr.length - 1];
              }
            }
          }else{
            this.$toast(res.data.strMsg)
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
          }else{
            this.$toast(res.data.strMsg)
          }
        })
        .catch((err) => {
          this.$toast(err);
        });
    },


    goSign(signType) {
      this.$router.push({
        path: "/getinfo/signing",
        query: {
          signType: signType,
          strWorkId: getRequest().strWorkId,
          strModeCode: getRequest().type,
        },
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
@import '~assets/stylus/mixin.styl'
.post_edit_body
  background #f7f7f7
  min-height 100%
  padding-top 55px
  padding-bottom 65px
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
    .list_item
      padding 0 16px
      background-color #fff
      .inter_box
        padding 16px 0
        font-size 16px
        display flex
        width 100%
        color #323233
        border-bottom 1px solid #ebedf0
        .left_box
          width 24%
          margin-right 15px
        .right_box
          width 76%
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
            .van-tag
              color #ffffff
            i
              color #aaaaaa
              vertical-align middle
              margin-top -3px
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
// 底部提交
.post_edit_foot
  background #ffffff
  width 100%
  padding 10px 15px
  border-top 1px solid #eee
  pos(none, 0, 0, 0, 0, 100)
  display flex
  .post_submit
    width 65%
    margin-right 20px
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
    button
      width 100%
      height 40px
      font-size 16px
      border none
      background #137cfc
      color #ffffff
      border-radius 5px
.content_box
  padding 10px 0
  p
    font(16px, 25px)
    color #333
  .textContent
    position relative
    padding 10px 10px 0 30px
    font(16px, 25px)
    word-break break-all
    .annex_item_img
      pos(10px, none, none, 0px)
      width 25px
      height 25px
</style>

