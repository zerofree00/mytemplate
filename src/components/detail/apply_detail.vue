<template>
  <div class="common_detail">
    <van-nav-bar @click-left="onleft">
      <template #left>
        <div class="color_000">
          <van-icon name="arrow-left" class="arrow-left" />
          <span class="header_title">申请详情</span>
        </div>
      </template>
      <template #right>
        <div class="color_000">
          <van-icon class="iconfont like-o" class-prefix="icon" name="banliliucheng" @click="linkprocess" />
          <van-icon name="like-o" class="like-o" @click="collectcommon(1)" v-if="!isCollect" />
          <van-icon name="like" class="like-o color_index" @click="collectcommon(2)" v-if="!!isCollect" />
        </div>
      </template>
    </van-nav-bar>
    <main class="common_detail_main">
      <div class="common_top" v-if="!!strAppReasons.strValue">
        <span></span>
        {{strAppReasons.strValue}}
      </div>

      <div class="common_detail clearfix">
        <div class="item_box" v-for="(item, index) in list" :key="index">
          <p class="title">{{item.strName}}</p>
          <div class="text">{{item.strValue}}</div>
        </div>
      </div>

      <div class="common_list">
        <div class="common_title">领用物品</div>

        <div class="common_list_con">
          <div class="common_list_item clearfix" v-for="(item, index) in goodsList" :key="index">
            <div class="common_item_img">
              <img v-lazy="baseUrl+item.strPhotoUrl" class="photo_per" />
            </div>
            <div class="common_item_text">
              <p class="title">{{item.strName}}</p>
              <p class="type">固定资产/型号：{{item.strType}}</p>
              <p class="count clearfix">库存{{item.intSurplusCount}}台 <span class="intCount">领用{{item.intCount}}台</span> </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
<script>
import { collectcommon, goodsGetDetail } from "@/api/common";
import { getRequest, baseUrl } from "@/assets/js/util";
import { communication } from "@/assets/js/mixin";
export default {

  mixins: [communication],
  data() {
    return {
      list: [],
      goodsList: [],
      isCollect: "",
      blShowDelete: "",
      strAppReasons: {},
      baseUrl: baseUrl,
    };
  },
  created() {
    localStorage.setItem('strSid', getRequest().strSid)
    this.goodsGetDetail();
  },

  methods: {
    goodsGetDetail() {
      var param = {
        strSid: localStorage.getItem("strSid"),
        strWorkId: getRequest().strWorkId,
        strModeCode: getRequest().strModeCode,
      };
      goodsGetDetail(param)
        .then((res) => {
          if (res.data.intCode == 200) {
            this.list = res.data.objData.objFormList;
            this.list.forEach((item, index) => {
              if (item.strKey == "strAppReasons") {
                this.strAppReasons = item;
                this.list.splice(index, 1);
              }
            });
            this.goodsList = res.data.objData.objGoodsList;
            this.blShowDelete = res.data.objData.blShowDelete;
            this.isCollect = res.data.objData.blCollected;
          } else {
            this.$toast(res.data.strMsg)
          }
        })
        .catch((err) => {
          this.$toast(err);
        });
    },
    onleft() {
      this.appRequest({}, 0);
    },

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
          } else {
            this.$toast(res.data.strMsg)
          }
        })
        .catch((err) => {
          this.$toast(err);
        });
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
            this.$toast(res.data.strMsg)
          }
        })
        .catch((err) => {
          this.$toast(err);
        });
    },
  },
};
</script>
<style lang='stylus'>
@import '~assets/stylus/mixin.styl'
.common_detail
  padding-top 46px
  padding-bottom 80px
  background-color #f6f6f6
  min-height 100%
  .van-icon
    display inline-block
    vertical-align middle
    margin-right 3px
  .van-nav-bar__right
    i
      font-size 22px
      margin-left 15px
      display inline-block
      vertical-align middle
  .color_888
    color #666
    font-size 16px
    line-height 30px
  .van-icon
    display inline-block
    vertical-align middle
    margin-right 3px
  main
    padding 10px
    .common_top
      padding 15px 10px
      background #ffffff
      border-radius 5px
      font-size 16px
      line-height 24px
      position relative
      span
        width 5px
        height 16px
        background #4688f5
        display inline-block
        vertical-align middle
        margin-top -3px
        position absolute
        left 0
        top 22px
    .common_detail
      padding 15px 10px
      background #ffffff
      border-radius 5px
      font-size 16px
      margin-top 10px
      .item_box
        margin-bottom 5px
        float left
        width 50%
        p
          font-size 16px
          font-weight bold
          line-height 25px
        .text
          font-size 16px
          line-height 25px
    .common_list
      margin-top 10px
      .common_title
        font(16px, 40px)
        font-weight bold
        color #4688f5
        text-align center
        background-image url('../../assets/images/title.png')
        background-size 100%
        background-position center center
        background-repeat no-repeat
      .common_list_con
        background #ffffff
        border-radius 5px
        padding 10px
        margin-top 10px
        .common_list_item
          margin 10px 0
          .common_item_img
            width 90px
            height 90px
            border 1px solid #f4f4f4
            border-radius 4px
            float left
            img
              width 90px
              height 90px
          .common_item_text
            width 'calc(100% - %s)' % 100px
            float right
            .title
              font(16px, 20px)
              font-weight bold
              height 40px
            .type, .count
              font(14px, 25px)
              color #666
              .intCount
                float right
.post_edit_foot
  background #ffffff
  width 100%
  padding 10px 15px
  border-top 1px solid #eee
  pos(none, 0, 0, 0, 0, 100)
  .btn_btm
    width 100%
    height 100%
    background #137cfc
    color #ffffff
    border-radius 5px
    text-align center
    line-height 40px
    font-size 16px
</style>