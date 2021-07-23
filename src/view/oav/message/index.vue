<template>
    <div class="getInfomation_index">
        <van-nav-bar @click-left="onleft" @click-right="showSearch">
            <template #left>
                <div class="color_000">
                    <van-icon name="arrow-left" class="arrow-left" />
                    <span class="header_title">通知通告</span>
                </div>
            </template>
            <template #right>
                <van-icon
                    class="iconfont"
                    class-prefix="icon"
                    name="sousuo1"
                    size="18"
                />
            </template>
        </van-nav-bar>

        <!-- 搜索头部 start-->
        <div class="search_box" v-if="isSearch">
            <div class="search_box_con clearfix">
                <div class="search_box_main">
                    <form action="/">
                        <van-search
                            v-model="keyValue"
                            placeholder="请输入搜索关键词"
                            @input="onSearch"
                        />
                    </form>
                </div>
            </div>
            <span class="cancel" @click="hideSearch">取消</span>
            <div class="search_line"></div>
        </div>
        <!-- 搜索头部 end -->

        <!-- 标签页 -->
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            :immediate-check="false"
            @load="getmessageList"
            v-if="!isnone"
        >
            <van-pull-refresh
                v-model="isLoading"
                success-text="刷新成功"
                @refresh="onRefresh"
            >
                <div
                    class="item_main_qy"
                    v-for="(item, index) in list"
                    :key="index"
                    @click="linkDetails(item.strId)"
                >
                    <div class="tit_item">
                        <div class="item_round" v-if="item.blReadState"></div>
                        {{ item.strTitle }}
                    </div>
                    <div class="time_item">
                        <span class="user">{{ item.strPubUnit }}</span>
                        <span>{{ item.strSendTime }}</span>
                    </div>
                </div>
            </van-pull-refresh>
        </van-list>
        <div v-if="isnone" class="nodata">
            <img src="~assets/images/none.png" alt class="nodataimg" />
        </div>
        <!-- 标签页 end-->
    </div>
</template>
<script>
import { messageList } from '@/api/notice'
import { getRequest } from '@/assets/js/util'
import { communication } from '@/assets/js/mixin'
export default {
    name: 'notice_index',
    mixins: [communication],
    data() {
        return {
            type: '',
            keyValue: '',
            isSearch: false,
            active: '31001',
            loading: false,
            finished: false,
            intCurPage: 1,
            list: [],
            isnone: false,
            isLoading: false,
        }
    },
    created() {
        // localStorage.setItem("strSid", getRequest().strSid);
        this.getmessageList()
    },
    methods: {
        //获取列表数据
        getmessageList() {
            var param = {
                strSid: localStorage.getItem('strSid'),
                websvrpwd: localStorage.getItem('websvrpwd'),
                intCurPage: this.intCurPage,
                strKeyValue: this.keyValue,
                intPageSize: '10',
            }
            messageList(param)
                .then((res) => {
                    if (res.data.intCode === 200) {
                        if (res.data.objData.intAllCount == '0') {
                            this.isnone = true
                        } else {
                            this.isnone = false
                        }
                        this.list = this.list.concat(res.data.objData.objList)
                        this.intCurPage++
                        this.finished = false
                        if (this.list.length >= res.data.objData.intAllCount) {
                            this.finished = true
                        }
                        this.loading = false
                    } else {
                        this.$toast(res.data.strMsg)
                    }
                })
                .catch((err) => {
                    this.$toast(err)
                })
        },
        // 刷新
        onRefresh() {
            this.intCurPage = 1
            this.list = []
            this.finished = false
            this.getmessageList()
            this.isLoading = false
        },

        //搜索列表数据
        onSearch(val) {
            this.intCurPage = 1
            this.keyValue = val
            this.list = []
            this.getmessageList()
            this.finished = true
        },

        //去详情
        linkDetails(strId) {
            this.$router.push({
                path: '/message/detail',
                query: {
                    strId: strId,
                },
            })
        },

        onleft() {
            this.appRequest({}, 0)
        },

        //展示搜索
        showSearch() {
            this.isSearch = true
        },

        //关闭搜索
        hideSearch() {
            this.keyValue = ''
            this.isSearch = false
            this.intCurPage = 1
            this.list = []
            this.getmessageList()
            this.finished = true
        },
    },
    beforeRouteLeave(to, form, next) {
        // if (to.name == "post_detail") {
        //   var newList = [];
        //   for (let i = 0; i < keepList.length; i++) {
        //     if (keepList[i] != "proSearch") {
        //       newList.push(keepList[i]);
        //     }
        //   }
        //   this.$store.commit("SET_KEEPALIVE", newList);
        // }
        next()
    },
}
</script>
<style lang="stylus" scoped>
@import '~assets/stylus/mixin.styl'
.getInfomation_index
  background-color #f6f6f6
  min-height 100%
  padding-top 45px
  .search_box
    pos(0, 0, 0, 0, 0, 100)
    width 100%
    height 46px
    background #ffffff
    padding 8px 60px 8px 15px
    .search_box_con
      background #f0f0f0
      width 100%
      height 30px
      border-radius 30px
      position relative
      .search_box_choose
        width 80px
      .search_box_main
        width 100%
        height 30px
      .search_line
        pos()
  .cancel
    display block
    font(16px, 46px)
    width 60px
    text-align center
    color #0876fc
    pos(0, 0, 0, none, 1, 20)
.item_main_qy
  background-color #fff
  margin 10px
  padding 15px
  border-radius 5px
  position relative
.tit_item
  font(16px, 28px)
  overflow hidden
  text-overflow ellipsis
  display -webkit-box
  -webkit-line-clamp 2
  -webkit-box-orient vertical
  display -moz-box
  -moz-line-clamp 2
  -moz-box-orient vertical
  word-wrap break-word
  word-break break-all
  white-space normal
  .item_round
    width 8px
    height 8px
    background-color #1989fa
    border-radius 50%
    display inline-block
    margin-right 5px
.time_item
  margin 10px 0 5px
  font(14px)
  color #999999
  span.user
    margin-right 20px
  i.iconfont
    margin-right 5px
.right_span
  font-size 14px
  padding 6px 10px
  border-radius 8px 0 0 0
  position absolute
  bottom 10px
  right -3px
.add_apply
  width 50px
  height 50px
  line-height 50px
  text-align center
  background #108efe
  border-radius 50%
  box-shadow 0 0 10px #108efe
  pos(none, 20px, 20px, none, 0, 1)
  i
    display inline-block
    font(22px, 50px)
    color #ffffff
    vertical-align middle
    margin-top -5px
</style>
