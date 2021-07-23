<template>
    <div class="about">
        <!-- 关于我们入口 -->
        <div class="about_con" v-if="!showAbout">
            <van-nav-bar @click-left="onleft">
                <template #left>
                    <div class="color_000">
                        <van-icon name="arrow-left" class="arrow-left" />
                        <span class="header_title">关于我们</span>
                    </div>
                </template>
            </van-nav-bar>

            <!-- 主体 -->
            <div class="about_main">
                <div class="about_top">
                    <img src="~assets/images/logo.png" alt class="logo" />
                    <p class="version">V6.0.1</p>
                </div>

                <div class="about_list">
                    <div class="about_list_item" @click="showAboutUs">
                        <img src="~assets/images/about.png" />
                        <p>关于我们</p>
                    </div>
                    <div class="about_list_item" @click="myFeedback">
                        <img src="~assets/images/feedback.png" />
                        <p>我要反馈</p>
                    </div>
                </div>
            </div>
            <!-- 主体 end -->
        </div>

        <!-- 关于我们详情 -->
        <div class="about_us" v-if="showAbout">
            <van-nav-bar @click-left="closeAbout">
                <template #left>
                    <div class="color_000">
                        <van-icon name="arrow-left" class="arrow-left" />
                        <span class="header_title">关于我们</span>
                    </div>
                </template>
            </van-nav-bar>

            <div class="about_us_con">
                <img
                    src="~assets/images/about_banner.png"
                    class="about_banner"
                />
                <div class="about_us_text">
                    <p>
                        安徽商信政通信息技术股份有限公司（原名：安徽商信信息技术有限公司）创立于2000年7月,是双软认证和高新技术企业，公司位于合肥市国家级高新技术开发区。主要提供信息化规划方案、数据库与信息系统开发、软件定制开发、网络安全解决方案等。
                    </p>
                    <p>
                        公司致力成为“电子政务和企业信息化的管家”，主要提供信息化规划方案、数据库与信息系统开发、网络安全等解决方案。
                    </p>
                    <p>
                        公司经过十多年的发展和积累，力足安徽，面向全国，凭借先进的技术研究能力和项目管理能力，秉承“以客户为中心,以人为本”的管理思想，赢得广大客户的支持和信赖、在项目实施上形成了自已的风格和经验的积淀。
                    </p>
                    <p>
                        公司现有政协直通车、智慧人大、安全电子党务、重点工作任务管理、TeamWork企业级应用、IHOLD移动应用等产品。具备多操作系统平台的构造能力，以及SOA的全面的解决方案与基于组件、EJB的开发技术，具备基于数据中心的云计算解决案。
                    </p>
                </div>

                <div class="about_us_bot">
                    <img src="~assets/images/ewm.png" />
                    <p>400-805-2158</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { communication } from '@/assets/js/mixin'
export default {
    mixins: [communication],
    name: 'notice_index',
    data() {
        return {
            showAbout: false,
        }
    },
    created() {
        // localStorage.setItem("strSid", getRequest().strSid);
    },
    methods: {
        myFeedback() {
            this.appRequest({}, 8)
        },
        // 返回
        onleft() {
            this.appRequest({}, 0)
        },

        showAboutUs() {
            this.showAbout = true
        },

        closeAbout() {
            this.showAbout = false
        },
    },
    beforeRouteLeave(to, form, next) {
        next()
    },
}
</script>
<style lang="stylus" scoped>
@import '~assets/stylus/mixin.styl'
.about
  min-height 100%
  padding-top 45px
  .about_top
    padding 50px 0
    height 250px
    text-align center
    background-image url('~assets/images/bgimg.png')
    background-size 100%
    background-position center bottom
    background-repeat no-repeat
    img.logo
      width 45%
      margin-top 10px
    .version
      font(16px, 40px)
      color #666666
      margin-top 30px
  .about_list
    margin-top 50px
    display flex
    justify-content space-around
    .about_list_item
      width 135px
      height 135px
      background #f3f8fe
      text-align center
      padding 20px 0
      border-radius 10px
      img
        width 60px
      p
        font(16px, 40px)
.about_us_con
  padding 15px
  .about_banner
    width 100%
  .about_us_text
    margin-top 10px
    p
      font(16px, 25px)
      color #333333
      margin-top 5px
      text-indent 32px
  .about_us_bot
    text-align center
    margin-top 15px
    img
      width 120px
    p
      font(16px, 25px)
      color #999999
      margin-top 5px
</style>
