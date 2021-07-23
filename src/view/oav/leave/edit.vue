<template>
  <div class="leave_index">
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
    <van-form @submit="onSubmit">
      <main>
        <div class="edit_main_item" v-for="(item, index) in list" :key="index">
          <!-- 请假事由以及备注的特殊样式 -->
          <div v-if="item.strKey=='strVacateSeed'||item.strKey=='strRemark'">
            <!-- <p>{{item.strName}}</p> -->
            <van-field
              class="flex_column"
              :label="item.strName"
              v-model="item.strValue"
              rows="2"
              autosize
              type="textarea"
              placeholder="请输入"
              :readonly="item.intType==0? true:false"
              :required="item.intRequired == 1"
              :rules="[{ required: item.intRequired == 1, message: '请输入' }]"
            />
          </div>
          <!-- 当为0或1仅展示 -->
          <van-field
            v-if="item.intType==0&&item.strKey!='strVacateSeed'&&item.strKey!='strRemark' "
            v-model="item.strValue"
            :label="item.strName"
            readonly
            input-align="right"
          />

          <van-field
            v-if="item.intType==1&&item.strKey!='strVacateSeed'&&item.strKey!='strRemark' "
            v-model="item.strValue"
            :label="item.strName"
            readonly
            :required="item.intRequired == 1"
            :rules="[{ required: item.intRequired == 1, message: '请输入' }]"
            input-align="right"
          />

          <!-- 当为2时文本输入 -->
          <van-field
            v-if="item.intType==2&&item.strKey!='strVacateSeed'&&item.strKey!='strRemark'"
            v-model="item.strValue"
            :label="item.strName"
            input-align="right"
            :placeholder="item.strName"
            :required="item.intRequired == 1"
            :rules="[{ required: item.intRequired == 1, message: '请输入' }]"
          />

          <!-- 当为4时picker选择器选择 -->
          <van-field
            @click="onChoose(item)"
            v-if="item.intType==4"
            v-model="item.text"
            :label="item.strName"
            input-align="right"
            :placeholder="item.strName"
            right-icon="arrow"
            readonly
            :required="item.intRequired == 1"
            :rules="[{ required: item.intRequired == 1, message: '请输入' }]"
          />

          <!-- 当为9时时间选择器 -->
          <van-field
            @click="onChoose(item)"
            v-if="item.intType==9"
            v-model="item.strValue"
            :label="item.strName"
            input-align="right"
            placeholder="请选择"
            right-icon="arrow"
            readonly
            :required="item.intRequired == 1"
            :rules="[{ required: item.intRequired == 1, message: '请输入' }]"
          />
        </div>
      </main>
      <!-- 底部 -->
      <div class="post_edit_foot">
        <div class="post_submit">
          <van-button class="btn_btm" block type="info" native-type="submit">提交</van-button>
          <!-- <button @click="submitpostCheck(0)">提交</button> -->
        </div>
        <div class="post_foot_tools" v-if="blShowDelete||blShowAssist ">
          <div class="post_foot_item" v-if="blShowAssist" @click="submitpostCheck(1)">
            <van-icon class="iconfont" class-prefix="icon" name="xieban-copy" />
            <p>协办</p>
          </div>
          <div class="post_foot_item" v-if="blShowDelete" @click="showDelDialog()">
            <van-icon class="iconfont" class-prefix="icon" name="lajitong" />
            <p>删除</p>
          </div>
        </div>
      </div>
    </van-form>
    <!-- picker选择器选择 -->
    <van-popup v-model="isPicker" round position="bottom">
      <van-picker
        show-toolbar
        :columns="pickerList"
        @cancel="isPicker = false"
        @confirm="onConfirm"
      />
    </van-popup>
    <!-- 时间选择器选择 -->
    <van-popup v-model="isTimePicker" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="datetime"
        title="选择时间"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="isTimePicker = false"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>
<script>
import { leavedetail, leaveCheckHandler, leavedelete } from "@/api/leave";
import { getRequest, timeFormat } from "@/assets/js/util";
import { collectcommon } from "@/api/common";
import { communication } from "@/assets/js/mixin";
export default {
  mixins: [communication],
  data() {
    return {
      list: [],
      isPicker: false, //公文分类选择状态
      pickerList: [],
      pickerType: "",
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date(), //时间
      isTimePicker: false, //时间选择状态
      isCollect: "",
      blShowHandList: "",
      blShowDelete: true,
      blShowAssist: true, //是否可协办
    };
  },
  created() {
    if (getRequest().backDetail == "true") {
      localStorage.setItem("strSid", getRequest().strSid);
    }
    this.leavedetail();
  },

  methods: {
    onSubmit(values) {
      this.submitpostCheck(0);
    },
    hasAppData(e) {
      if (JSON.parse(e).data.submitType == 1) {
        this.$router.back();
        localStorage.setItem("leaveDel", true);
      }
    },
    // 获取详情
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
            this.blShowAssist = res.data.objData.blShowAssist;
            this.blShowDelete = res.data.objData.blShowDelete;
            this.list.forEach((item) => {
              if (item.intType == "4") {
                item.text = item.strValue;
              }
            });
          } else {
            this.$toast(res.data.strMsg);
          }
        })
        .catch((err) => {
          this.$toast(err);
        });
    },

    // 提交审核的接口
    submitpostCheck(intType) {
      var param = {
        strSid: localStorage.getItem("strSid"),
        websvrpwd: localStorage.getItem("websvrpwd"),
        strWorkId: getRequest().strWorkId,
        intType: intType,
      };
      this.list.forEach((item) => {
        if (item.intType != 0) {
          param[item.strKey] = item.strValue;
        }
      });
      leaveCheckHandler(param)
        .then((res) => {
          if (res.data.intCode === 200) {
            // 传下一节点
            res.data.objData.intType = param.intType;
            res.data.objData.strModeCode = 370;
            let data = { objData: res.data.objData };
            // alert(JSON.stringify(data))
            this.appRequest(data, 3);
          } else {
            this.$toast(res.data.strMsg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // picker选择器选择
    onChoose(that) {
      this.pickerType = that.strKey;
      this.thatNew = that;
      if (that.intType == 4) {
        this.isPicker = true;
        that.objCheckedList.forEach((item) => {
          item.text = item.strChecked_name;
        });
        this.pickerList = that.objCheckedList;
      }
      if (that.intType == 8 || that.intType == 9) {
        this.isTimePicker = true;
        this.timetype = that.intType;
      }
    },
    // picker确认
    onConfirm(val) {
      // console.log(val);
      if (this.thatNew.intType == 4) {
        this.thatNew.text = val.text;
        this.thatNew.strValue = val.strChecked_id; //重新赋值strValue
        this.isPicker = false;
      }
      if (this.thatNew.intType == 9 || this.thatNew.intType == 8) {
        this.thatNew.strValue = timeFormat(
          this.currentDate,
          this.thatNew.intType
        );
        this.isTimePicker = false;
      }
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
              var data = { submitType: 1 };
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
            this.$toast(res.data.strMsg);
          }
        })
        .catch((err) => {
          this.$toast(err);
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

<style>
.leave_index .van-field__error-message {
  display: none;
}
</style>
<style lang='stylus' scoped>
@import '~assets/stylus/mixin.styl'
.leave_index
  padding-top 46px
  padding-bottom 80px
  background-color #f6f6f6
  min-height 100%
  .flex_column
    flex-direction column
  .color_888
    color #666
    font-size 16px
    line-height 30px
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
  main
    .edit_main_item
      border-bottom 1px solid #f6f6f6
      .van-cell
        font-size 16px
      .item_con
        background #fff
        font-size 16px
        padding 13px 0
        p
          padding 0 16px
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