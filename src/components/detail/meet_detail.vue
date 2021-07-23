<template>
  <div class="common_detail">
    <van-nav-bar @click-left="onleft">
      <template #left>
        <div class="color_000">
          <van-icon name="arrow-left" class="arrow-left" />
          <span class="header_title">会议详情</span>
        </div>
      </template>

      <template #right>
        <div class="color_000">
          <van-icon
            class="iconfont like-o"
            class-prefix="icon"
            name="banliliucheng"
            @click="linkprocess"
          />
          <van-icon name="like-o" class="like-o" @click="collectcommon(1)" v-if="!isCollect" />
          <van-icon
            name="like"
            class="like-o color_index"
            @click="collectcommon(2)"
            v-if="!!isCollect"
          />
        </div>
      </template>
    </van-nav-bar>
    <main class="common_detail_main">
      <div class="common_top">
        <p>
          <span></span>
          {{strTitle.strValue}}
        </p>
        <p>
          <van-icon class="iconfont" class-prefix="icon" name="didian" />
          {{strPlace.strValue}}
        </p>
        <p class="time">
          <i class="point"></i>
          开始时间 {{strMeetDate.strValue}}
        </p>
        <p class="time">
          <i class="point ov"></i>
          结束时间 {{strMeetOvDate.strValue}}
        </p>
      </div>

      <div class="common_detail clearfix">
        <div class="item_box" v-for="(item, index) in list" :key="index" :class="item.inline =='1'?'item_inline':''">
          <p class="title">{{item.strName}}</p>
          <div class="text">{{item.strValue}}</div>
        </div>
      </div>

      <div class="common_list">
        <div class="common_title">上会议题</div>

        <div class="common_list_con">
          <div class="common_list_item clearfix" v-for="(item, index) in topicList" :key="index" @click="linkMeetEntry(item.strAppThemeId)">
            <p class="title">{{item.strName}}</p>
            <p class="name">汇报人：{{item.strReoprter}}</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
<script>
import { collectcommon, meetDetail } from "@/api/common";
import { getRequest } from "@/assets/js/util";
import { communication } from "@/assets/js/mixin";
export default {
   mixins: [communication],
  data() {
    return {
      list: [],
      goodsList: [],
      topicList: [],
      isCollect: "",
      blShowDelete: "",
      strTitle: {}, //标题
      strMeetDate: {}, //申请时间
      strMeetOvDate: {}, //结束时间
      strPlace: {}, // 会议地点
    };
  },
  created() {
     localStorage.setItem('strSid',getRequest().strSid)
    this.meetDetail();
  },
  methods: {
    linkMeetEntry(strAppThemeId){
      this.$router.push({path:'/common/meetEntry_detail',query:{strSid:localStorage.getItem('strSid'),strThemeId:strAppThemeId}})
        // strSid:getRequest().strSid,
        // strThemeId: getRequest().strThemeId,
    },
    meetDetail() {
      var param = {
        strSid: localStorage.getItem("strSid"),
        strWorkId: getRequest().strWorkId,
        strModeCode: getRequest().type,
      };
      meetDetail(param)
        .then((res) => {
          if (res.data.intCode == 200) {
            this.list = res.data.objData.objFormList;
            for (var i = 0; i < this.list.length; i++) {
              if (this.list[i].strKey == "strPlace") {
                this.strPlace = this.list[i];
                this.list.splice(i, 1);
              }
              if (this.list[i].strKey == "strTitle") {
                this.strTitle = this.list[i];
                this.list.splice(i, 1);
              }
              if (this.list[i].strKey == "strMeetDate") {
                this.strMeetDate = this.list[i];
                this.list.splice(i, 1);
              }
              if (this.list[i].strKey == "strMeetOvDate") {
                this.strMeetOvDate = this.list[i];
                this.list.splice(i, 1);
              }
              if (
                this.list[i].strKey == "strHost" ||
                this.list[i].strKey == "strNoteTaker"
              ) {
                // console.log(this.list[i].strValue)
                this.list[i].inline = "1";
                // this.list[i].strValue = this.list[i].strValue.split("/")[2];
              }
              // if (
              //   this.list[i].strKey == "strSeats" ||
              //   this.list[i].strKey == "strAttender"
              // ) {
              //   // this.list[i].strValue = this.list[i].strValue.split("/")[2];
              // }
              if(this.list[i].strValue == undefined){
                  this.list[i].strValue = '—'
              }
            }
            this.topicList = res.data.objData.objTopicList;
            this.blShowDelete = res.data.objData.blShowDelete;
            this.isCollect = res.data.objData.blCollected;
          }else{
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
          }else{
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
      line-height 30px
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
        top 25px
      .time
        font(14px, 30px)
        color #666666
        i.point
          width 8px
          height 8px
          display inline-block
          background #4ab66b
          border-radius 50%
          margin-right 5px
          &.ov
            background #fcaa3f
    .common_detail
      padding 15px 10px
      background #ffffff
      border-radius 5px
      font-size 16px
      margin-top 10px
      .item_box
        margin-bottom 10px
        p
          font-size 16px
          font-weight bold
          line-height 25p
        .text
          font-size 16px
          line-height 25px
      .item_inline
          width 50%
          float left
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
        .common_list_item
          margin 10px 0
          background #ffffff
          border-radius 5px
          padding 10px
          .title
            font(16px, 25px)
            color #333333
          .name
            font(14px, 25px)
            color #666666
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