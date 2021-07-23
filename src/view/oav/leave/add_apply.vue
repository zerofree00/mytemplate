<template>
  <div>
    <div class="leave_index">
      <van-nav-bar @click-left="onleft">
        <template #left>
          <div class="color_000">
            <van-icon name="arrow-left" class="arrow-left" />
            <span class="header_title">请假申请</span>
          </div>
        </template>
      </van-nav-bar>
      <van-form @submit="onSubmit">
        <main>
          <div class="edit_main_item" v-for="(item, index) in list" :key="index">
            <!-- 当为0或1仅展示 -->
            <van-field
              v-if="item.intType==0||item.intType==1"
              v-model="item.strValue"
              :label="item.strName"
              :required="item.intRequired == 1"
              input-align="right"
              readonly
            />

            <!-- 当为2时文本输入 -->
            <van-field
              v-if="item.intType==2&&item.strKey!='strVacateSeed'&&item.strKey!='strRemark'"
              v-model="item.strValue"
              :label="item.strName"
              input-align="right"
              :placeholder="item.strName"
              :rules="[{ required: item.intRequired == 1, message: '请输入' }]"
              :required="item.intRequired == 1"
            ></van-field>

            <!-- 请假事由以及备注的特殊样式 -->
            <div class="item_con" v-if="item.strKey=='strVacateSeed'||item.strKey=='strRemark'">
              <!-- <p>{{item.strName}}</p> -->
              <van-field
                class="flex_column"
                :label="item.strName"
                v-model="item.strValue"
                rows="2"
                autosize
                type="textarea"
                placeholder="请输入"
                :required="item.intRequired == 1"
                :rules="[{ required: item.intRequired == 1, message: '请输入' }]"
              />
            </div>

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

            <!-- 当为9时文本输入 -->
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
        <div class="post_edit_foot">
          <van-button class="btn_btm" block type="info" native-type="submit">提交</van-button>
          <!-- <div class="btn_btm" @click="submitpostCheck()">提交</div> -->
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
      <van-popup v-model="isTimePicker" position="bottom">
        <van-datetime-picker
          v-model="currentDate"
          type="datetime"
          title="选择时间"
          :min-date="minDate"
          :max-date="maxDate"
          @confirm="onConfirm"
        />
      </van-popup>
    </div>
  </div>
</template>
<script>
import { leavedetail, leaveAddHandler } from "@/api/leave";
import { getRequest, timeFormat } from "@/assets/js/util";
import { communication } from "@/assets/js/mixin";
import Vue from "vue";
export default {
  mixins: [communication],
  data() {
    return {
      isPicker: false, //公文分类选择状态
      list: [],
      pickerList: [],
      thatNew: "",
      isTimePicker: false, //时间选择状态
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date(), //时间
      strWorkFlowId: "",
      strWorkId: "",
      intFileCount: "",
      strTime: "",
      endTime: "",
      strDayNum: {},
    };
  },
  created() {
    if (getRequest().backDetail == "true") {
      localStorage.setItem("strSid", getRequest().strSid);
    }
    this.leavedetail();
  },

  methods: {
    hasAppData(e) {
      if (JSON.parse(e).data.submitType == 1) {
        this.$router.back();
        localStorage.setItem("leaveDel", true);
      }
    },
    onSubmit(values) {
      this.submitpostCheck();
    },
    // 获取详情数据
    leavedetail() {
      var param = {
        strSid: localStorage.getItem("strSid"),
        strWorkId: getRequest().strWorkId,
        strWorkFlowId: getRequest().strWorkFlowId,
        strModeCode: 370,
      };
      leavedetail(param)
        .then((res) => {
          if (res.data.intCode == 200) {
            this.strWorkFlowId = res.data.objData.strWorkFlowId;
            this.strWorkId = res.data.objData.strWorkId;
            this.list = res.data.objData.objFormList;

            this.list.forEach((item, index) => {
              if (item.strKey == "strDayNum") {
                console.log(item);
                this.strDayNum = item;
              }
            });

            // console.log(this.list)
          } else {
            this.$toast(res.data.strMsg);
          }
        })
        .catch((err) => {
          this.$toast(err);
        });
    },

    // 提交
    submitpostCheck() {
      var param = {
        strSid: localStorage.getItem("strSid"),
        websvrpwd: localStorage.getItem("websvrpwd"),
        strWorkId: this.strWorkId,
        strWorkFlowId: this.strWorkFlowId,
      };
      this.list.forEach((item) => {
        if (item.intType != 0) {
          param[item.strKey] = item.strValue;
        }
      });

      leaveAddHandler(param)
        .then((res) => {
          if (res.data.intCode === 200) {
            // 传下一节点
            res.data.objData.intType = 0;
            res.data.objData.strModeCode = 370;
            let data = { objData: res.data.objData };
            // alert(JSON.stringify(data));
            this.appRequest(data, 3);
            localStorage.setItem("leaveAdd", "true");
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

    // 公文分类选择框
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
        //  自动计算请假时长
        if (this.thatNew.strKey == "strBeginTime") {
          this.strTime = this.thatNew.strValue;
        }
        if (this.thatNew.strKey == "strFinishTime") {
          this.endTime = this.thatNew.strValue;
        }
        if (this.strTime.length > 0 && this.endTime.length > 0) {
          // 处理ios时间显示问题
          this.strTime = this.strTime.replace(/-/g, "/");
          this.endTime = this.endTime.replace(/-/g, "/");
          var timeNember = Date.parse(new Date(this.endTime)) - Date.parse(new Date(this.strTime));
          var hr = timeNember / 1000 / 3600;
          if (hr.toFixed(1).split(".")[1] == 0) {
            this.strDayNum.strValue = hr.toFixed(1).substring(0, hr.toFixed(1).length - 2) ;
          } else {
            this.strDayNum.strValue = hr.toFixed(1);
          }
        }
        this.isTimePicker = false;
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
  background-color #f6f6f6
  min-height 100%
  padding-bottom 80px
  .color_888
    color #666
    font-size 16px
    line-height 30px
  .van-icon
    display inline-block
    vertical-align middle
    margin-right 3px
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
  .flex_column
    flex-direction column
// 底部提交
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

