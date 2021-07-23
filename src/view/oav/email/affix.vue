<template>
    <div class="getInfomation_atch" :class="!!isDelete ? 'padding_btm' : ''">
        <van-nav-bar v-if="!isDelete">
            <template #left>
                <div class="color_000" @click="onleft()">
                    <van-icon name="cross" class="cross" />附件
                </div>
            </template>
            <template #right>
                <div class="color_000">
                    <van-uploader
                        :after-read="afterRead"
                        accept="*"
                        v-if="!isupload"
                    >
                        <van-icon name="add-o" class="add-o" />
                    </van-uploader>
                    <van-icon
                        name="add-o"
                        class="add-o color_999"
                        v-if="isupload"
                    />
                    <van-icon
                        name="delete"
                        @click="isDelete = true"
                        class="add-o"
                    />
                </div>
            </template>
        </van-nav-bar>
        <!-- -------------------------全选 --------------------->
        <van-nav-bar v-if="!!isDelete">
            <template #left>
                <div @click="cancel">取消</div>
            </template>
            <template #right>
                <div @click="checkAll">全选</div>
            </template>
        </van-nav-bar>

        <!-- 列表  开始 -->
        <div class="atch_main_qy" v-if="!isnone">
            <van-checkbox-group v-model="result" ref="checkboxGroup">
                <van-cell-group>
                    <div
                        class="atch_item_main"
                        v-for="(item, index) in list"
                        :key="index"
                        @click="toggle(index)"
                    >
                        <img :src="showImgType(item.strFileName)" alt />
                        <div class="item_box">
                            <div
                                style="width:90%"
                                @click="showfile(item.strFileUrl)"
                            >
                                <div class="tit_item txt_one">
                                    {{ item.strFileName }}
                                </div>
                                <div class="filesize">
                                    <span v-if="!!item.loaded"
                                        >{{ item.loaded }}MB/</span
                                    >
                                    {{ item.intFileSize }}MB
                                </div>
                                <van-progress
                                    :percentage="item.percentage"
                                    stroke-width="3"
                                    :show-pivot="false"
                                    v-if="item.isprogress"
                                />
                            </div>

                            <van-checkbox
                                :name="item"
                                ref="checkboxes"
                                class="stasus_icon"
                                v-if="!!isDelete"
                            />
                        </div>
                    </div>
                </van-cell-group>
            </van-checkbox-group>
        </div>
        <div class="nodata" v-if="isnone">
            <img src="~assets/images/none.png" alt class="nodataimg" />
        </div>

        <!-- 列表   结束 -->
        <div class="delete_btn" v-if="!!isDelete">
            <van-button type="info" @click="showdialog">删除</van-button>
        </div>
        <van-image-preview
            v-model="showPreview"
            :images="previewList"
            @change="onChange"
            :closeable="true"
            @close="previewList = []"
            :show-index="false"
        ></van-image-preview>
    </div>
</template>
<script>
import { emailmailAffix, emailupload, emaildel } from '@/api/email'
import { openWps } from '@/api/common'
// import { communication } from "@/assets/js/mixin";
import { objLength, setImgPath, getRequest, baseUrl } from '@/assets/js/util'
import axios from '@/api/index'
export default {
    // mixins: [communication],
    data() {
        return {
            baseUrl: baseUrl,
            isDelete: false,
            list: [],
            result: [],
            file: {},
            fileList: [],
            strChgDocWorkId: getRequest().strChgDocWorkId,
            isupload: false,
            isnone: false,
            showPreview: false,
            previewList: [],
        }
    },
    created() {
        if (localStorage.getItem('emailAffixList')) {
            //附件
            this.list = JSON.parse(localStorage.getItem('emailAffixList'))
        } else {
            this.emailmailAffix()
        }
    },
    destroyed() {
        localStorage.setItem('emailAffixList', JSON.stringify(this.list))
    },
    methods: {
        onChange(index) {
            this.index = index
        },
        afterRead(e) {
            this.emailupload(e)
        },
        // 转换图片类型
        showImgType(strFileName) {
            return setImgPath(strFileName)
        },
        showdialog() {
            this.$dialog
                .confirm({
                    title: '提示',
                    message: '删除后将无法恢复，确定删除？',
                })
                .then(() => {
                    this.emaildel()
                })
                .catch(() => {})
        },

        // 删除附件
        emaildel() {
            var ids = ''
            this.result.forEach((item) => {
                ids = ids + item.strFileId + ','
            })
            var param = {
                strSid: localStorage.getItem('strSid'),
                strId: getRequest().strId,
                strFileId: ids.substring(0, ids.length - 1),
                intType: getRequest().intType,
            }
            emaildel(param)
                .then((res) => {
                    if (res.data.intCode == 200) {
                        this.list = [...new Set(this.list)].filter(
                            (item) => !new Set(this.result).has(item)
                        )
                        this.isupload = false
                        if (this.list.length == 0) {
                            this.isnone = true
                        } else {
                            this.isnone = false
                        }
                        this.isDelete = false
                        this.result = []
                    } else {
                        this.$toast(res.data.strMsg)
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        //上传附件
        emailupload(values) {
            let formdata = new FormData()
            formdata.append('strSid', localStorage.getItem('strSid'))
            formdata.append('objFile', values.file)
            formdata.append('strId', getRequest().strId)
            formdata.append('strType', 0)

            // 未调接口时展示假数据
            var obj1 = {}
            obj1.strFileName = values.file.name
            // obj1.intFileSize = values.file.size;
            obj1.intFileSize = (values.file.size / 1024 / 1024).toFixed(2)
            obj1.isprogress = ''
            obj1.percentage = 0
            this.isupload = true
            this.isnone = false
            this.list.push(obj1)
            var that = this
            axios
                .post('/api/email/upload', formdata, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    onUploadProgress: function(progressEvent) {
                        that.$nextTick(() => {
                            obj1.isprogress = true //展示进度
                            obj1.loaded = (
                                progressEvent.loaded /
                                1024 /
                                1024
                            ).toFixed(2) //附件大小
                            obj1.percentage = Math.round(
                                (progressEvent.loaded / progressEvent.total) *
                                    100
                            )
                        })
                    },
                })
                .then((res) => {
                    if (res.data.intCode == 200) {
                        // 请求成功删除假数据，添加真数据
                        this.list.pop(obj1)
                        var obj = {}
                        obj.strFileId = res.data.objData.strFileId
                        obj.strFileName = values.file.name
                        obj.intFileSize = (
                            values.file.size /
                            1024 /
                            1024
                        ).toFixed(2)
                        obj.strFileUrl = res.data.objData.strFileUrl
                        obj.isprogress = false
                        this.list.push(obj)
                        this.isupload = false
                        this.$toast('上传成功')
                    } else {
                        this.isupload = false
                        this.$toast(res.data.strMsg)
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        // 附件列表
        emailmailAffix() {
            var param = {
                strSid: localStorage.getItem('strSid'),
                strId: getRequest().strId,
                intType: getRequest().intType,
            }
            emailmailAffix(param)
                .then((res) => {
                    if (res.data.intCode == 200) {
                        if (res.data.objData.objFileList.length > 0) {
                            this.isnone = false
                        } else {
                            this.isnone = true
                        }
                        res.data.objData.objFileList.forEach((item) => {
                            item.intFileSize = (
                                item.intFileSize /
                                1024 /
                                1024
                            ).toFixed(2)
                        })
                        this.list = res.data.objData.objFileList
                    } else {
                        this.$toast(res.data.strMsg)
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        showfile(strFileUrl) {
            if (
                strFileUrl.split('.')[1] == 'jpg' ||
                strFileUrl.split('.')[1] == 'jpeg' ||
                strFileUrl.split('.')[1] == 'png' ||
                strFileUrl.split('.')[1] == 'gif' ||
                strFileUrl.split('.')[1] == 'svg'
            ) {
                this.previewList.push(baseUrl + strFileUrl)
                this.showPreview = true
            } else {
                this.readContent(strFileUrl)
            }
        },
        // 查看正文
        readContent(strFileUrl) {
            var param = {
                strSid: localStorage.getItem('strSid'),
                strContent: strFileUrl,
                permission: 'read',
            }
            openWps(param)
                .then((res) => {
                    if (res.data.intCode == 200) {
                        localStorage.setItem('wpsUrl', res.data.objData.wpsUrl)
                        this.$router.push({
                            path: '/common/iframe',
                        })
                    } else {
                        this.$toast(res.data.strMsg)
                    }
                })
                .catch((err) => {
                    this.$toast(err)
                })
            // }
        },
        onleft() {
            this.$emit('getfileData', this.list, false)
        },
        cancel() {
            this.result = []
            this.isDelete = false
        },
        toggle(index) {
            if (!!this.isDelete) {
                this.$refs.checkboxes[index].toggle()
            } else {
                return
            }
        },
        checkAll() {
            this.$refs.checkboxGroup.toggleAll(true)
            console.log(this.result)
        },
    },
}
</script>
<style lang="stylus" scoped>
.padding_btm
    padding-bottom 64px
.getInfomation_atch
    min-height 100%
    .color_000
        color #000 !important
        font-weight 700
    .subBtn
        padding 10px
    .cross
        font-size 16px
        vertical-align middle
        margin-right 15px
    .add-o
        font-size 22px
        margin 0 10px
.atch_main_qy
    padding-top 46px
    .atch_item_main
        img
            width 10%
            height 40px
            margin 0 15px
        .item_box
            position relative
            display inline-block
            width 78%
            border-bottom 1px solid #f2f2f2
            padding 15px 0
        .stasus_icon
            position absolute
            top 50%
            transform translateY(-50%)
            right 5px
        .tit_item
            font-size 16px
            width 87%
            line-height 24px
        .filesize
            font-size 12px
            color #999999
            margin-top 10px
            padding-right 30px
.delete_btn
    width 100%
    padding 10px
    background-color #fff
    position fixed
    bottom 0
    left 0
.van-button
    width 100%
    border-radius 6px
</style>
