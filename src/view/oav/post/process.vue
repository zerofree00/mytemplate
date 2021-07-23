<template>
  <div class="process_body">
    <!-- 头部 start -->
    <van-nav-bar @click-left="onleft">
      <template #left>
        <div class="color_000">
          <van-icon name="arrow-left" class="arrow-left" />
          <span class="header_title">办理流程</span>
        </div>
      </template>
    </van-nav-bar>
    <!-- 头部 end -->
    <!-- 部门列表开始 -->
    <ul class="bmlist_ul">
      <li v-for="(item,index) in bmlist" :key="index" :class="item.showItem?'color_blue':''">
        <div class="tit_list_li" @click="closechildren(index)">
          {{item.strNodeName}}
          <van-icon name="checked" class="vanicon" v-if="!item.showItem" />
          <van-icon class="iconfont shijian" class-prefix="icon" name="shijian21" v-if="item.showItem"
          />
        </div>
        <!-- 主体 start -->
        <div class="process_content" v-if="item.check==true">
          <div class="process_step" v-for="(item2,index2) in item.detailList" :key="index2">
            <div class="img_box">
              <img v-lazy="baseUrl+item2.strPhotoUrl" class="photo_per" />
              <van-icon name="checked" class="icon_img" v-if="!!item2.strHandlerDate&&item2.strHandlerDate.length>0" />
              <!-- ------------------------------在办 -->
              <van-icon
                class="iconfont icon_img shijian"
                class-prefix="icon"
                name="shijian21"
                v-if="!item2.strHandlerDate||item2.strHandlerDate.length==0"
              />
            </div>
            <div class="step_line"></div>

            <div class="process_step_con">
              <div class="process_step_title">
                <span class="nickname">{{item2.strUser}}</span>
                <span>{{item2.strHandlerDate}}</span>
              </div>
              <div class="process_step_main" v-if="!item2.isWrite">{{item2.strIdea}}</div>
              <div class="process_step_main" v-if="item2.isWrite">
                <img :src="baseUrl+item2.strIdea" alt />
              </div>
            </div>
          </div>
        </div>
        <!-- 主体 end -->
      </li>
    </ul>
    <!-- 部门列表结束-->
  </div>
</template>
<script>
import { workflowCommon, dephandlerIdeaList } from "@/api/common";
import { baseUrl, getRequest } from "@/assets/js/util";
import { communication } from "@/assets/js/mixin";
export default {
  mixins: [communication],
  data() {
    return {
      bmlist: [],
      baseUrl: baseUrl,
    };
  },
  created() {
    if (getRequest().backDetail == "true") {
      localStorage.setItem("strSid", getRequest().strSid);
    }
    if (getRequest().strId) {
      this.dephandlerIdeaList();
    } else {
      this.workflowCommon();
    }
  },
  methods: {
    onleft() {
      if (getRequest().backDetail == "true") {
        this.appRequest({}, 0);
      } else {
        this.$router.back();
      }
    },
    closechildren(index) {
      this.bmlist[index].check = !this.bmlist[index].check;
    },
    dephandlerIdeaList() {
      var param = {
        strSid: localStorage.getItem("strSid"),
        websvrpwd: localStorage.getItem("websvrpwd"),
        strId: getRequest().strId,
      };
      dephandlerIdeaList(param)
        .then((res) => {
          if (res.data.intCode == 200) {
            for (var s = 0; s < res.data.objData.objList.length; s++) {
              for (
                var ss = 0;
                ss < res.data.objData.objList[s].detailList.length;
                ss++
              ) {
                if (
                  res.data.objData.objList[s].detailList[ss].strIdea.substring(
                    0,
                    7
                  ) == "/upload"
                ) {
                  res.data.objData.objList[s].detailList[ss].isWrite = true;
                } else {
                  res.data.objData.objList[s].detailList[ss].isWrite = false;
                }
                if (
                  res.data.objData.objList[s].detailList[ss].strState == "在办"||res.data.objData.objList[s].detailList[ss].strState == "待办"
                ) {
                  res.data.objData.objList[s].check = true;
                  res.data.objData.objList[s].showItem = true;
                } else {
                  res.data.objData.objList[s].check = false;
                  res.data.objData.objList[s].showItem = false;
                }
              }
            }
            this.bmlist = res.data.objData.objList;
          } else {
            this.$toast(res.data.strMsg);
          }
        })
        .catch((err) => {
          this.$toast(err);
        });
    },
    workflowCommon() {
      var param = {
        strSid: localStorage.getItem("strSid"),
        websvrpwd: localStorage.getItem("websvrpwd"),
        strWorkId: getRequest().strWorkId,
      };
      workflowCommon(param)
        .then((res) => {
          if (res.data.intCode == 200) {
            for (var s = 0; s < res.data.objData.objList.length; s++) {
              for (
                var ss = 0;
                ss < res.data.objData.objList[s].detailList.length;
                ss++
              ) {
                if (
                  res.data.objData.objList[s].detailList[ss].strIdea.substring(
                    0,
                    7
                  ) == "/upload"
                ) {
                  res.data.objData.objList[s].detailList[ss].isWrite = true;
                } else {
                  res.data.objData.objList[s].detailList[ss].isWrite = false;
                }
                if (
                  res.data.objData.objList[s].detailList[ss].strState == "在办"||res.data.objData.objList[s].detailList[ss].strState == "待办"
                ) {
                  res.data.objData.objList[s].check = true;
                  res.data.objData.objList[s].showItem = true;
                } else {
                  res.data.objData.objList[s].check = false;
                  res.data.objData.objList[s].showItem = false;
                }
              }
            }
            console.log(res.data.objData.objList);

            this.bmlist = res.data.objData.objList;
          } else {
            this.$toast(res.data.strMsg);
          }
        })
        .catch((err) => {
          this.$toast(err);
        });
    },
  },
};
</script>
<style lang='stylus' scoped>
@import '~assets/stylus/mixin.styl'
.process_body
  background #f7f7f7
  padding-top 46px
  min-height 100%
  .shijian
    float right
    color orange !important
    font-size 16px !important
  .color_blue
    color #197ffc
  .display_none
    display none !important
  .display_block
    display block !important
  .vanicon
    color #52c10c !important
    float right !important
  .arrow-left
    font-size 16px
    vertical-align middle
    margin-top -3px
  .bmlist_ul
    padding 0 15px
    background-color #fff
  li
    border-bottom 1px solid #eee
    .tit_list_li
      font-size 16px
      font-weight 700
      padding 20px 0px
      .border_box
        padding-right 15px
        position relative
        // border-bottom 5px solid #000
        // span
        // display inline-block
        // width 100%
        // pos(none,none,none,none,1,10)
  .process_content
    padding 0 10px 10px 10px
    .process_step
      padding-left 30px
      margin-top 10px
      position relative
      .img_box
        pos(-3px, none, none, 5px, 1, 10)
        .photo_per
          width 30px
          height 30px
          border-radius 50%
        .icon_img
          font-size 16px!important
          color #52c10c
          pos(none, 0px, 0px, none, 1, 99)
          background #fff
          border-radius 50%
      &:last-child
        .step_line
          border none
      .step_icon
        pos(10px, none, none, 5px, 1, 10)
        color #137cfc
        font-size 20px
      .step_line
        pos(45px, none, none, 25px, 1, 10)
        height calc(100% - 40px)
        border-left 2px solid #dddddd
      .process_step_con
        width 100%
        background #ffffff
        border-radius 10px
        .process_step_title
          // height 40px
          // border-bottom 1px solid #f6f6f6
          padding 0 10px 0 15px
          font-weight 400
          font(14px, 30px)
          color #999
          .nickname
            margin-right 15px
        .process_step_main
          padding 5px 15px
          font(14px, 25px)
          color #555
          img
            // width 50%
            // height auto
            // .con_step_item
            // padding-left 25px
            // .step_item_title
            // font(14px, 22px)
            // color #999999
            // .nickname
            // margin-right 15px
            // .step_item_text
            // font(14px, 25px)
            // color #222222
</style>