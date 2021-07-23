<template>
  <div id="viewFile"></div>
</template>
<script>
import { getRequest } from "@/assets/js/util";
export default {
  props: ["wpsUrl"],
  data() {
    return {
      url: "",
      // 是否开启简易模式
      simpleMode: false,
      isCooperUsersAvatarVisible: false, //是否显示协作用户头像
      cooperUsersColor: [
        {
          userId: "xxxxxx", // 用户id
          color: "#F65B90", // 用户光标颜色
        },
      ],
    };
  },
  created() {
    //页面初步渲染
    // this.login()
    // this.url = getRequest().url;
    console.log(this.wpsUrl)
    this.openWps(this.wpsUrl);
  },
  mounted() {
    //页面加载完成
  },
  destroyed() {
    //页面销毁
  },
  methods: {
    openWps(url) {
      let _this = this;
      _this.wps.config({
        mode: _this.simpleMode ? "simple" : "normal",
        mount: document.querySelector("#wpsMain"),
        wpsUrl: url,
        commandBars: [
          // 可以配置多个组件
          {
            cmbId: "HistoryVersion",
            attributes: {
              visible: false, // 隐藏组件
            },
          },
          {
            cmbId: "HistoryVersionDivider",
            attributes: {
              visible: false, // 隐藏组件
            },
          },
          {
            cmbId: "HistoryRecord",
            attributes: {
              visible: false, // 隐藏组件
            },
          },
          {
            cmbId: "CooperHistoryMenuItem",
            attributes: {
              visible: false, // 隐藏组件
            },
          },
        ],
      });
    },
  },
  comments: {},
  watch: {},
  computed: {},
};
</script>
<style  lang='stylus' scoped>
@import '~assets/stylus/mixin.styl'
</style>
