<template>
    <div class="record_body">
        <!-- 头部 start -->
        <van-nav-bar @click-left="onleft">
            <template #left>
                <div class="color_000">
                    <van-icon name="arrow-left" class="arrow-left" />
                    <span class="header_title">交办记录</span>
                </div>
            </template>
            <template #right>
                <div class="color_000">
                    <!-- <van-icon name="apps-o" class="apps-o" /> -->
                </div>
            </template>
        </van-nav-bar>
        <!-- 头部 end -->

        <!-- 主体 start -->
        <div class="record_content">
            <van-tabs v-model="active" animated @change="changeTab">
                <van-tab v-for="(item, index) in tablist" :key="index">
                    <template #title>
                        <div class="record_tab">
                            <b>{{ item.num }}</b>
                            {{ item.name }}
                        </div>
                    </template>
                    <div class="record_list" v-if="!isnone">
                        <div
                            class="record_list_item"
                            v-for="(item, index) in list"
                            :key="index"
                        >
                            <div class="record_list_top">
                                <h1>{{ item.strName }}</h1>
                                <p>{{ item.strUnit }}</p>
                                <!-- 拒收icon -->
                                <div
                                    class="posicon"
                                    v-if="
                                        !!item.strSignInReason &&
                                            item.strSignInReason.length > 0 &&
                                            item.strState == '已拒收'
                                    "
                                >
                                    <van-icon
                                        class="iconfont"
                                        class-prefix="icon"
                                        name="faq"
                                        @click="showReason(index)"
                                    />
                                    <!-- 拒收框 -->
                                    <div
                                        class="popup_box"
                                        v-if="item.isReason == true"
                                    >
                                        <div>{{ item.strSignInReason }}</div>
                                        <span class="triangle"></span>
                                        <div>
                                            <span
                                                class="close_res"
                                                @click="closeReason(index)"
                                                >关闭</span
                                            >
                                        </div>
                                    </div>
                                </div>
                                <!-- 签收icon -->
                                <div
                                    class="posicon"
                                    v-if="item.strState == '已签收'"
                                    @click="linkProcess(item1.strId)"
                                >
                                    <van-icon
                                        class="iconfont"
                                        class-prefix="icon"
                                        name="fenfajilu"
                                    />
                                </div>

                                <div
                                    class="right_span orange_c"
                                    v-if="item.strState == '已拒收'"
                                >
                                    已拒收
                                </div>
                                <div
                                    class="right_span cyan_c"
                                    v-if="item.strState == '已签收'"
                                >
                                    已签收
                                </div>
                                <div
                                    class="right_span blue_c"
                                    v-if="item.strState == '待签收'"
                                >
                                    未签收
                                </div>
                            </div>
                            <div class="record_list_bottom">
                                <van-icon name="underway-o" />
                                <span>{{ item.strSendTime }}</span>
                                <span
                                    class="float_r"
                                    v-if="item.strState == '已签收'"
                                    >签收时间：{{ item.strSendTime }}</span
                                >
                                <span
                                    class="float_r"
                                    v-if="item.strState == '已拒收'"
                                    >拒收时间：{{ item.strSendTime }}</span
                                >
                            </div>
                        </div>
                    </div>
                    <div class="nodata" v-if="isnone">
                        <img
                            src="~assets/images/none.png"
                            alt
                            class="nodataimg"
                        />
                    </div>
                </van-tab>
            </van-tabs>
        </div>
        <!-- 主体 end -->
    </div>
</template>
<script>
import { infoPubHandoutList } from '@/api/getInfo'
import { getRequest } from '@/assets/js/util'
import { communication } from '@/assets/js/mixin'
export default {
    mixins: [communication],
    data() {
        return {
            isnone: false,
            active: 0,
            tablist: [
                { num: '', strId: '0', name: '接收人员' },
                { num: '', strId: '1', name: '接收部门' },
                { num: '', strId: '2', name: '接收单位' },
            ],
            list: [],
        }
    },
    created() {
        if (getRequest().backDetail == 'true') {
            localStorage.setItem('strSid', getRequest().strSid)
        }
        this.pubHandoutList()
    },
    methods: {
        onleft() {
            if (getRequest().backDetail == 'true') {
                this.appRequest({}, 0)
            } else {
                this.$router.back()
            }
        },
        // 关闭拒收框
        closeReason(index) {
            this.list[index].isReason = false
        },
        // 打开拒收框
        showReason(index) {
            this.list[index].isReason = true
            console.log(this.list)
        },
        changeTab() {
            this.list = []
            this.pubHandoutList()
        },
        // 列表
        pubHandoutList() {
            var param = {
                strSid: localStorage.getItem('strSid'),
                websvrpwd: localStorage.getItem('websvrpwd'),
                strWorkId: getRequest().strWorkId,
            }
            infoPubHandoutList(param)
                .then((res) => {
                    if (res.data.intCode == 200) {
                        this.tablist[0].num =
                            res.data.objData.objPersonList.length
                        this.tablist[1].num =
                            res.data.objData.objDepartmentList.length
                        this.tablist[2].num =
                            res.data.objData.objUnitList.length

                        if (this.active == 0) {
                            res.data.objData.objPersonList.forEach((item) => {
                                item.isReason = false
                            })
                            this.list = res.data.objData.objPersonList
                        } else if (this.active == 1) {
                            res.data.objData.objDepartmentList.forEach(
                                (item) => {
                                    item.isReason = false
                                }
                            )
                            this.list = res.data.objData.objDepartmentList
                        } else {
                            res.data.objData.objUnitList.forEach((item) => {
                                item.isReason = false
                            })
                            this.list = res.data.objData.objUnitList
                        }
                        if (this.list.length == 0) {
                            this.isnone = true
                        } else {
                            this.isnone = false
                        }
                    } else {
                        this.$toast(res.data.strMsg)
                    }
                })
                .catch((err) => {
                    this.$toast(err)
                })
        },
    },
}
</script>
<style lang="stylus" scoped>
@import '~assets/stylus/mixin.styl'
.record_body
  background #f7f7f7
  // padding-top 46px
  padding-bottom 30px
  min-height 100%
  width 100%
  overflow hidden
  .color_000
    color #000 !important
    font-weight 700
  .arrow-left
    font-size 16px
    vertical-align middle
    margin-top -3px
  .apps-o
    font-size 22px
  .record_content
    .record_tab
      padding 0 10px
      width 100%
      height 40px
      font(14px, 40px)
      color #666666
      background #ffffff
      border-radius 5px
      b
        font-size 20px
    .van-tab--active
      .record_tab
        background-image url('~assets/images/tab.png')
        background-size 100% 100%
        color #ffffff
    .record_list
      padding 0 10px
      .record_list_item
        width 100%
        background #ffffff
        border-radius 5px
        margin-top 10px
        .record_list_top
          padding 10px
          padding-right 100px
          border-bottom 1px solid #f6f6f6
          position relative
          .posicon
            pos(50%, 65px, none, none, 1, 1)
            transform translateY(-50%)
            width 22px
            height 22px
            .icon
              font-size 22px
              display block
              &.icon-faq
                color #ff810c
              &.icon-fenfajilu
                color #fff
                font-size 14px
                height 20px
                width 20px
                background #3b93ff
                text-align center
                line-height 20px
                border-radius 50%
            .popup_box
              background-color #198bff
              line-height 20px
              font-size 14px
              color #ffffff
              width 150px
              padding 10px
              border-radius 8px
              position absolute
              top 35px
              // transform translateY(28%)
              right -12px
              z-index 999
              .triangle
                width 0px
                height 0px
                display inline
                border-bottom 12px solid #198bff
                border-left 10px solid transparent
                border-top 15px solid transparent
                border-right 10px solid transparent
                position absolute
                top -24px
                right 15px
              .close_res
                border 1px solid #ffffff
                padding 3px 8px
                border-radius 15px
                float right
          h1
            font(16px, 30px)
            color #000000
          p
            font(14px, 25px)
            color #555555
          .right_span
            pos(50%, -4px, none, none, 1, 1)
            height 22px
            font(12px, 22px)
            padding 0 10px
            border-top-left-radius 5px
            margin-top -11px
        .record_list_bottom
          padding 0 10px
          height 40px
          font(14px, 40px)
          color #999999
          .van-icon
            vertical-align middle
            margin-top -3px
            margin-right 4px
</style>
