<template>
  <div class="leave_index" :class="blShowDelete?'paddbtm_65':''">
    <van-nav-bar @click-left="onleft">
      <template #left>
        <div class="color_000">
          <van-icon name="arrow-left" class="arrow-left" />
          <span class="header_title">申请详情</span>
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
          <van-icon
            class="iconfont"
            class-prefix="icon"
            name="guanzhu"
            @click="collectcommon(1)"
            v-if="!isCollect"
          />
          <van-icon
            class="iconfont color_index"
            class-prefix="icon"
            name="aixin"
            @click="collectcommon(2)"
            v-if="!!isCollect"
          />
        </div>
      </template>
    </van-nav-bar>
    <main>
      <div class="item_box">
        <div class="title_top">
          {{strVacateSeed.strValue}}
          <span></span>
        </div>
        <div class="color_888">
          <van-icon name="contact" />
          {{strUserName.strValue}}
          <span v-if="!!strLinkPhone.strValue">({{strLinkPhone.strValue}})</span>
        </div>
        <div class="color_888">
          <van-icon class="iconfont" class-prefix="icon" name="shijian1" style="margin-right:5px" />
          {{strApplicationDate.strValue}}
          <span class="float_r color_index">
            <van-icon class="iconfont" class-prefix="icon" name="biaoqian" />
            {{strVacateType.strValue}}
          </span>
        </div>
      </div>
      <div class="item_box">
        <div class="inner_box">
          <div class="title">请假时长</div>
          <div class="color_888">{{strDayNum.strValue}}天</div>
        </div>
        <div class="inner_box">
          <div class="title">请假时间</div>
          <div class="color_888">{{strBeginTime.strValue}} ~ {{strFinishTime.strValue}}</div>
        </div>
        <div class="inner_box">
          <div class="title">备注</div>
          <div class="color_888">{{strRemark.strValue}}</div>
        </div>
      </div>
      <!-- 删除 -->
      <div class="btn_box" v-if="blShowDelete">
        <div class="btn" @click="showDelDialog()">删除</div>
      </div>
    </main>
  </div>
</template>
<script>
import { leavedetail, leavedelete } from "@/api/leave";
import { getRequest } from "@/assets/js/util";
import { collectcommon } from "@/api/common";
import { communication } from "@/assets/js/mixin";
export default {
  mixins: [communication],

  data() {
    return {
      list: [],
      strVacateSeed: "", //请假理由
      strUserName: "", //请假申请人
      strLinkPhone: "", //联系电话
      strApplicationDate: "", //申请时间
      strVacateType: "", //请假类型
      strDayNum: "", //请假时长
      strBeginTime: "", //开始时间
      strFinishTime: "", //结束时间
      strRemark: "", //备注
      isCollect: "",
      blShowDelete: "",
    };
  },
  created() {
    if (getRequest().backDetail == "true") {
      localStorage.setItem("strSid", getRequest().strSid);
    }
    this.leavedetail();
  },
  activated() {},
  methods: {
    leavedetail() {
      var param = {
        strSid: localStorage.getItem("strSid"),
        strWorkId: getRequest().strWorkId,
        strModeCode: 370,
      };
      leavedetail(param)
        .then((res) => {
          if (res.data.intCode == 200) {
            this.list = res.data.objData.objFormList;
            this.isCollect = res.data.objData.blCollected;
            this.blShowDelete = res.data.objData.blShowDelete;
            this.list.forEach((item) => {
              if (item.strKey == "strVacateSeed") {
                this.strVacateSeed = item;
              }
              if (item.strKey == "strUserName") {
                this.strUserName = item;
              }
              if (item.strKey == "strLinkPhone") {
                this.strLinkPhone = item;
              }
              if (item.strKey == "strApplicationDate") {
                this.strApplicationDate = item;
              }
              if (item.strKey == "strVacateType") {
                this.strVacateType = item;
              }
              if (item.strKey == "strDayNum") {
                this.strDayNum = item;
              }
              if (item.strKey == "strBeginTime") {
                this.strBeginTime = item;
              }
              if (item.strKey == "strFinishTime") {
                this.strFinishTime = item;
              }
              if (item.strKey == "strRemark") {
                this.strRemark = item;
              }
            });
          } else {
            this.$toast(res.data.strMsg);
          }
        })
        .catch((err) => {
          console.log(err);
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
          this.leavedelete();
        })
        .catch(() => {
          // this.$toast("取消删除");
        });
    },
    // 删除请假管理
    leavedelete() {
      var param = {
        strSid: localStorage.getItem("strSid"),
        strObjMainId: getRequest().strObjMainId,
      };
      leavedelete(param)
        .then((res) => {
          if (res.data.intCode == 200) {
            this.$toast("删除成功");
            if (getRequest().backDetail == "true") {
                var data={submitType:1}
              this.appRequest(data, 0);
            } else {
              this.$router.back();
            }
            localStorage.setItem("leaveDel", "true");
          } else {
            this.$toast(res.data.strMsg);
          }
        })
        .catch((err) => {
          this.$toast(err);
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
    linkprocess() {
      this.$router.push({
        path: "/post/process",
        query: { strWorkId: getRequest().strWorkId },
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
.leave_index
  padding-top 46px
  background-color #f6f6f6
  min-height 100%
  .color_888
    color #666
    font-size 16px
    line-height 30px
  .van-nav-bar__right
    i
      font-size 22px
      margin-left 15px
      display inline-block
      vertical-align middle
  main
    padding 10px
    .item_box
      background-color #fff
      border-radius 5px
      padding 15px
      margin-bottom 10px
      .inner_box
        margin-bottom 10px
      .title_top, .title
        font-size 16px
        line-height 28px
        font-weight 700
        position relative
        margin-bottom 10px
        span
          display block
          position absolute
          background-color #137cfc
          width 5px
          height 15px
          top 5px
          left -15px
      .title
        margin-bottom 0
</style>