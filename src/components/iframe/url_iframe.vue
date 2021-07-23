<template>
    <div class="childContant" id="wpsMain">
        <van-nav-bar title="详情" left-arrow @click-left="onClickLeft" fixed></van-nav-bar>
        <div v-if="isview &&wpsUrl">
            <viewFile v-if="isview" :wpsUrl="wpsUrl" />
        </div>
    </div>
</template>
<script>
import viewFile from "../iframe/wpsItem";
import { getRequest } from "@/assets/js/util";
export default {
    name: 'url_iframe',
    data() {
        return {
            wpsUrl: "",
            isview: true,
        };
    },
    created() {
        //页面初步渲染
    },
    mounted() {
        this.wpsUrl = localStorage.getItem("wpsUrl");
        // console.log(this.wpsUrl)
    },
    components: {
        viewFile,
    },
    destroyed() {
        //页面销毁
    },
    methods: {
        onClickLeft() {
            this.isview = false;
            this.$router.back();
        },
    },
    comments: {},
    watch: {},
    computed: {},
};
</script>
<style  lang='stylus' scoped>
@import '~assets/stylus/mixin.styl';
.childContant
    height: 100%;
    width: 100%;
    padding-top: 46px;
    .van-nav-bar
        height: 46px;
</style>
