<template>
    <div class="email_index" :class="!!isDelete ? 'padding_btm' : ''">
        <!-- 头部开始 -->
        <van-nav-bar fixed @click-right="showSearch">
            <template #left>
                <van-icon name="arrow-left" @click="onleft" />
                <span class="header_title" v-if="!isInbox">
                    <van-dropdown-menu>
                        <van-dropdown-item
                            v-model="intType"
                            :options="option"
                            @change="changeTit"
                        />
                    </van-dropdown-menu>
                </span>
                <span class="header_title" v-if="isInbox">收件箱</span>
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

        <!-- 全选 -->
        <van-nav-bar v-if="isDelete" style="z-index:101">
            <template #left>
                <div @click="cancel">取消</div>
            </template>
            <template #right>
                <div @click="checkAll">全选</div>
            </template>
        </van-nav-bar>

        <!-- 搜索头部 start-->
        <div class="search_box" v-if="isSearch">
            <div class="search_box_con clearfix">
                <div class="search_box_choose float_l">
                    <van-dropdown-menu v-if="intType == 0">
                        <van-dropdown-item
                            v-model="strKeywords"
                            :options="typeList"
                            @change="changeType"
                        />
                    </van-dropdown-menu>
                    <van-dropdown-menu v-if="intType !== 0">
                        <van-dropdown-item
                            v-model="strKeywords"
                            :options="typeList2"
                            @change="changeType"
                        />
                    </van-dropdown-menu>
                </div>
                <div class="search_box_main float_l">
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

        <!-- 头部结束 -->

        <!-- 列表 -->
        <div class="item_list" v-if="!isnone">
            <van-list
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="emailList"
            >
                <van-pull-refresh
                    v-model="isLoading"
                    success-text="刷新成功"
                    @refresh="onRefresh"
                >
                    <van-checkbox-group
                        v-model="result"
                        ref="checkboxGroup"
                        @change="changeBox"
                    >
                        <van-cell-group>
                            <div
                                class="item_main_qy"
                                v-for="(item, index) in list"
                                :key="index"
                            >
                                <!-- 收件箱/草稿箱 -->
                                <div
                                    class="item_top"
                                    :class="
                                        item.strReadState == 0
                                            ? 'font_weight'
                                            : ''
                                    "
                                    @click="toggle(index, item.strReadState)"
                                    v-if="intType == 0 || intType == 2"
                                >
                                    <div
                                        class="item_round"
                                        v-if="item.strReadState == 0"
                                    ></div>
                                    {{ item.strSendUserName }}
                                    <div class="float_r">
                                        <van-checkbox
                                            :name="item"
                                            ref="checkboxes"
                                            class="check_icon"
                                            :icon-size="
                                                isCheckbox ? '18px' : '12px'
                                            "
                                        />
                                    </div>
                                </div>
                                <!--  发件箱-->
                                <div
                                    class="item_send"
                                    v-if="intType == 1"
                                    @click="toggle(index, item.strReadState)"
                                >
                                    <span class="txt_one">{{
                                        item.strRecUsers
                                    }}</span>
                                    <van-checkbox
                                        :name="item"
                                        ref="checkboxes"
                                        class="check_icon"
                                        :icon-size="
                                            isCheckbox ? '18px' : '12px'
                                        "
                                    />
                                </div>

                                <div @click="linkdetail(item.strId)">
                                    <div
                                        class="item_con txt_two"
                                        :class="
                                            item.strReadState == 1
                                                ? 'color_777'
                                                : ''
                                        "
                                    >
                                        {{ item.strTitle }}
                                    </div>
                                    <div class="item_btm">
                                        <!-- 定时 -->
                                        <span>
                                            <van-icon
                                                :class="
                                                    item.strIsDelay == 1
                                                        ? 'color_time'
                                                        : ''
                                                "
                                                class="iconfont"
                                                class-prefix="icon"
                                                name="tixing1"
                                                v-if="item.strIsDelay == 1"
                                            />

                                            <span
                                                v-if="item.strTime.length !== 0"
                                            >
                                                {{ item.strTime }}
                                            </span>
                                        </span>
                                        <!-- <span>
                    </span>-->
                                        <!-- 附件 -->
                                        <span v-if="item.strHasAffix == 1">
                                            <van-icon
                                                class="iconfont"
                                                class-prefix="icon"
                                                name="webfujian"
                                            />
                                        </span>
                                        <!-- 回复 -->
                                        <span v-if="item.strRelayState == 1">
                                            <van-icon
                                                class="iconfont"
                                                class-prefix="icon"
                                                name="huifu"
                                            />
                                        </span>
                                        <!-- 紧急 -->
                                        <span
                                            style="margin:0  0  0 5px "
                                            class="float_r"
                                            v-if="item.strUrgency == 1"
                                        >
                                            <van-icon
                                                class="iconfont jinji"
                                                class-prefix="icon"
                                                name="111"
                                            />
                                        </span>
                                        <span
                                            style="margin-right:0"
                                            class="float_r"
                                            v-if="item.strIsDelay == 1"
                                        >
                                            待发送
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </van-cell-group>
                    </van-checkbox-group>
                </van-pull-refresh>
            </van-list>
        </div>
        <div class="nodata" v-if="isnone">
            <img src="~assets/images/none.png" alt class="nodataimg" />
        </div>
        <!-- 结束 -->

        <!-- -------------------------------------收件箱 -->
        <ul class="tabbar_ul" v-if="!!isDelete && intType == 0">
            <li @click="emailhandle(1)">
                <van-icon name="setting-o" class="tabbar_icon" />
                <div>标已读</div>
            </li>
            <li @click="emailhandle(2)">
                <van-icon name="envelop-o" class="tabbar_icon" />
                <div>标未读</div>
            </li>
            <li @click="deleteData()">
                <van-icon name="delete" class="tabbar_icon" />
                <div>删除</div>
            </li>
        </ul>
        <!-- -------------------------------发件箱/草稿箱 -->
        <div
            class="btn_box"
            v-if="!!isDelete && intType !== 0"
            @click="deleteData()"
        >
            <div class="btn">删除</div>
        </div>

        <div
            class="wirte_btn"
            @click="linkAdd"
            v-if="intType !== 0 && !isDelete"
        >
            <van-icon class="iconfont" class-prefix="icon" name="bianji11" />
        </div>
    </div>
</template>
<script>
import { emailList, emailhandle } from '@/api/email'
import { keepList, getRequest } from '@/assets/js/util'
import { communication } from '@/assets/js/mixin'
export default {
    name: 'email_index',
    mixins: [communication],
    data() {
        return {
            isnone: false,
            isDelete: false,
            isSearch: false,
            intType: 0,
            option: [
                { text: '发件箱', value: 1 },
                { text: '收件箱', value: 0 },
                { text: '草稿箱', value: 2 },
            ],
            strKeywords: '',
            typeList: [
                { text: '全部', value: '' },
                { text: '主题', value: 'strTiltle' },
                { text: '发件人', value: 'strSendUserName' },
            ],
            typeList2: [
                { text: '全部', value: '' },
                { text: '主题', value: 'strTiltle' },
                { text: '收件人', value: 'strRecUsers' },
            ],
            list: [],
            keyValue: '',
            result: [],
            loading: false,
            finished: true,
            intCurPage: 1,
            intAllCount: '',
            isLoading: false,
            isCheckbox: false,
            isInbox: false,
        }
    },
    created() {
        localStorage.setItem('strSid', getRequest().strSid)
        this.$store.commit('SET_KEEPALIVE', keepList)
        if (!!getRequest().isInbox && !!JSON.parse(getRequest().isInbox)) {
            this.isInbox = true
            this.intType = 0
        }

        if (localStorage.getItem('isRead') == 'true') {
            this.intType = 0
            this.emailList()
            localStorage.setItem('isRead', 'false')
        } else {
            this.emailList()
        }
    },
    activated() {
        if (localStorage.getItem('outbox') == 'true') {
            //发件箱
            this.intType = 1
            this.intCurPage = 1
            this.list = []
            this.finished = true
            this.emailList()
            localStorage.setItem('outbox', 'false')
        }
        if (localStorage.getItem('inbox') == 'true') {
            //发件箱
            this.intType = 0
            this.intCurPage = 1
            this.list = []
            this.finished = true
            this.emailList()
            localStorage.setItem('inbox', 'false')
        }
        if (localStorage.getItem('draft') == 'true') {
            this.intType = 2
            this.intCurPage = 1
            this.list = []
            this.finished = true
            this.emailList()
            localStorage.setItem('draft', 'false')
        }
    },
    methods: {
        showSearch() {
            this.isSearch = true
        },
        // 列表
        emailList() {
            var param = {
                strSid: localStorage.getItem('strSid'),
                intType: this.intType,
                intCurPage: this.intCurPage,
                intPageSize: 10,
                strKeywords: this.keyValue,
                strSearchType: this.strKeywords,
            }
            emailList(param)
                .then((res) => {
                    if (res.data.intCode == 200) {
                        if (this.intType == 0) {
                            this.option[1].text =
                                '收件箱' +
                                '(' +
                                res.data.objData.intWaitReadCount +
                                ')'
                        }
                        if (res.data.objData.intAllCount == '0') {
                            this.isnone = true
                        } else {
                            this.isnone = false
                        }

                        this.list = this.list.concat(res.data.objData.objList)
                        this.finished = false
                        this.intCurPage++
                        if (this.list.length >= res.data.objData.intAllCount) {
                            this.finished = true
                        }
                        this.loading = false
                    } else {
                        this.$toast(res.data.strMsg)
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        // 刷新
        onRefresh() {
            this.intCurPage = 1
            this.list = []
            this.finished = true
            this.emailList()
            this.isLoading = false
        },
        // 删除/已读/未读邮件
        emailhandle(intActType) {
            var ids = ''
            this.result.forEach((item) => {
                ids = ids + item.strId + ','
            })
            console.log(ids.substring(0, ids.length - 1))
            var param = {
                strSid: localStorage.getItem('strSid'),
                intType: this.intType,
                intActType: intActType,
                strIds: ids.substring(0, ids.length - 1),
            }
            emailhandle(param)
                .then((res) => {
                    if (res.data.intCode == 200) {
                        if (param.intActType == 0) {
                            this.$toast('删除成功')
                        }
                        if (param.intActType == 1) {
                            this.$toast('标已读成功')
                        }
                        if (param.intActType == 2) {
                            this.$toast('标未读成功')
                        }
                        // 重新加载
                        this.result = []
                        this.finished = true
                        this.intCurPage = 1
                        this.list = []
                        this.keyValue = ''
                        this.emailList()
                    } else {
                        this.$toast(res.data.strMsg)
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        deleteData() {
            this.$dialog
                .confirm({
                    title: '提示',
                    message: '邮件删除后将无法恢复，确定删除？',
                })
                .then(() => {
                    this.emailhandle(0)
                })
                .catch(() => {
                    // this.$toast("取消删除");
                })
        },
        // 搜索
        onSearch(val) {
            this.finished = true
            this.intCurPage = 1
            this.list = []
            this.keyValue = val
            this.emailList()
        },
        onleft() {
            this.appRequest({}, 0)
        },
        //关闭搜索
        hideSearch() {
            this.finished = true
            this.intCurPage = 1
            this.list = []
            this.keyValue = ''
            this.emailList()
            this.isSearch = false
        },
        cancel() {
            this.isCheckbox = false
            this.result = []
            this.isDelete = false
        },
        // 切换标题
        changeTit(val) {
            this.intType = val
            this.intCurPage = 1
            this.finished = true
            this.list = []
            this.emailList()
        },
        // 搜索条件切换
        changeType(val) {
            this.intCurPage = 1
            this.list = []
            this.strKeywords = val
            this.emailList()
            this.finished = true
        },
        linkdetail(strId) {
            if (this.intType == 2) {
                this.$router.push({
                    path: '/email/edit',
                    query: {
                        strId: strId,
                        intType: this.intType,
                        strKeywords: this.keyValue,
                        title: '写',
                    },
                })
            } else if (this.intType == 1) {
                this.linkedit(strId)
            } else {
                this.detailRead(strId)
            }
        },
        // 已读接口
        detailRead(strId) {
            var param = {
                strSid: localStorage.getItem('strSid'),
                intType: 0,
                intActType: 1,
                strIds: strId,
            }
            emailhandle(param)
                .then((res) => {
                    if (res.data.intCode == 200) {
                        this.linkedit(strId)
                        localStorage.setItem('isRead', 'true')
                    } else {
                        this.$toast(res.data.strMsg)
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        // 跳转编辑页
        linkedit(strId) {
            this.$router.push({
                path: '/email/detail',
                query: {
                    strId: strId,
                    intType: this.intType,
                    strKeywords: this.keyValue,
                },
            })
        },
        //跳转新增页面
        linkAdd() {
            this.$router.push({
                path: '/email/edit',
                query: { title: '写', intType: 3 },
            })
        },

        toggle(index, strReadState) {
            // this.list.forEach((item,index)=>{
            //   if(item.strReadState=='0'){
            //     console.log(item)
            //       this.$refs.checkboxes[index].toggle(true);
            //   }
            // })
            this.isCheckbox = true
            this.isDelete = true
            this.$refs.checkboxes[index].toggle()
        },
        changeBox() {
            if (this.result.length == 0) {
                this.isCheckbox = false
                this.isDelete = false
            }
        },
        checkAll() {
            this.$refs.checkboxGroup.toggleAll(true)
            console.log(this.$refs.checkboxGroup)
        },
    },
    beforeRouteLeave(to, from, next) {
        if (this.intType == 0) {
            if (to.name == 'email_detail') {
                var newList = []
                for (let i = 0; i < keepList.length; i++) {
                    if (keepList[i] != 'email_index') {
                        newList.push(keepList[i])
                    }
                }
                console.log(newList)
                this.$store.commit('SET_KEEPALIVE', newList)
            }
        }
        next()
    },
}
</script>
<style lang="stylus" scoped>
@import '~assets/stylus/mixin.styl';
.padding_btm
  padding-bottom: 55px;
.email_index
  // position relative
  background-color: #f6f6f6;
  width: 100%;
  min-height: 100%;
  padding-top: 46px;
  .font_weight
    font-weight: 700 !important;
  .color_777
    color: #777 !important;
  .color_time
    color: #fa5237;
  .van-cell-group
    background-color: #f6f6f6;
  .header_title
    margin-left: 10px;
    color: #000;
  .search_box
    pos(0, 0, 0, 0, 0, 100);
    width: 100%;
    height: 46px;
    background: #ffffff;
    padding: 8px 60px 8px 15px;
    .search_box_con
      background: #f0f0f0;
      width: 100%;
      height: 30px;
      border-radius: 30px;
      position: relative;
      .search_box_choose
        width: 80px;
      .search_box_main
        width: calc(100% - 80px);
        height: 30px;
      .search_line
        pos();
    .cancel
      display: block;
      font(16px, 46px);
      width: 60px;
      text-align: center;
      color: #0876fc;
      pos(0, 0, 0, none, 1, 20);
  .item_list
    padding: 10px;
    .item_main_qy
      background-color: #fff;
      padding: 10px;
      border-radius: 5px;
      margin-bottom: 10px;
      .item_send
        font-size: 14px;
        line-height: 26px;
        width: 100%;
        color: #777;
        span
          line-height: 26px;
          width: 90%;
          display: inline-block;
        .van-checkbox
          display: inline-block;
      .item_top
        font-size: 14px;
        line-height: 34px;
        .item_round
          width: 8px;
          height: 8px;
          background-color: #1989fa;
          border-radius: 50%;
          display: inline-block;
          margin-right: 5px;
      .item_con
        font-size: 16px;
        line-height: 28px;
        color: #555;
      .item_btm
        font-size: 14px;
        color: #999;
        line-height: 30px;
        span
          margin-right: 15px;
  .wirte_btn
    width: 50px;
    height: 50px;
    background-color: #1989fa;
    border-radius: 50%;
    position: fixed;
    bottom: 15%;
    right: 10%;
    color: #ffffff;
    text-align: center;
    line-height: 50px;
    box-shadow: 0 0 3px #1989fa;
    .icon
      font-size: 28px;
      line-height: 50px;
  .tabbar_ul
    height: 50px;
    width: 100%;
    background-color: #fff;
    position: fixed;
    bottom: 0px;
    left: 0;
    display: flex;
    li
      width: 33%;
      padding-top: 8px;
      text-align: center;
      font-size: 14px;
      .tabbar_icon
        color: #666;
        font-size: 16px;
        margin-bottom: 6px;
.jinji
  color: #f45037;
</style>
