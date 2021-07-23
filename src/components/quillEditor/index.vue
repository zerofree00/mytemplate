<template>
  <div class="edit_container">
    <quill-editor
      v-model="content"
      ref="myQuillEditor"
      :options="editorOption"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @change="onEditorChange($event)"
    ></quill-editor>
  </div>
</template>

<script>
// @ is an alias to /src
import { Quill, quillEditor } from "vue-quill-editor"; //调用编辑器
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
var fonts = ["Microsoft-YaHei", "SimSun", "SimHei", "KaiTi", "Arial"];
var Font = Quill.import("formats/font");
Font.whitelist = fonts;
export default {
  components: {
    quillEditor,
    // Quills
  },
  props: {
    strContent: {
      type: Object,
    },
  },
  data() {
    return {
      content: "",
      editorOption: {
        placeholder: "请在这里输入",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"], //加粗，斜体，下划线，删除线
            [
              {
                size: [
                  "12px",
                  false,
                  "16px",
                  "18px",
                  "20px",
                  "22px",
                  "24px",
                  "26px",
                  "28px",
                  "30px",
                ],
              },
            ], // 字体大小
            [{ list: "ordered" }], //列表
            ["clean"], //清除字体样式
            [{ align: [] }], //对齐方式
            [{ indent: "-1" }, { indent: "+1" }], // 缩进
            [{ header: [1, 2, 3, 4, 5, 6, false] }], //几级标题
            [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
            // [{ font: fonts }], //字体
            // ["image"], //上传图片、上传视频
          ],
        },
      },
    };
  },
  created() {
    var str = this.strContent.strValue;
    this.content = str;
  },
  methods: {
    onEditorReady(editor) {},
    // 失焦
    onEditorBlur() {
      this.$emit("hasdata", this.content);
    },
    // 失去焦点事件
    onEditorFocus() {}, // 获得焦点事件
    onEditorChange() {},
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    },
  },

  mounted() {},
};
</script>
<style lang="stylus" scoped></style>
