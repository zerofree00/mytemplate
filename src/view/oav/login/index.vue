<template >
  <div class="loginbody">
    <!-- 这个文件里面只能放一个根元素 -->
    <van-cell-group v-show="isShow==false">
      <van-field
        v-model="username"
        required
        clearable
        label="用户名"
        :error-message="Message"
        @input="isUser"
        placeholder="请输入用户名"
      />
      <van-field
        v-model="password"
        type="password"
        clearable
        label="密码"
        placeholder="请输入密码"
        required
      />
      <van-button type="info" size="small" @click="doLogin">登录</van-button>
      <van-button type="default" size="small">重置</van-button>
    </van-cell-group>
    <!-- <userRole v-show="isShow==true" @isOnly="isOnly"></userRole> -->
  </div>
</template>
<script >
// 这个文件里面只需要放 js/html/css路径
import { doLogin } from "@/api/post";
// import userRole from './userRole'
// es6语法导出
export default {
  // 存数据的地方
  data() {
    return {
      username: "chenl",
      password: "abcd@12345",
      websvrpwd:'suncnihold654321',
      Message: "",
      isShow: false
    };
  },
  components: {
    // userRole
  },
  // 一进页面就加载的函数，一些进页面就需要加载的函数可以放这
  created() {},
  // 写方法/函数的地方
  methods: {
    isOnly(status) {
      this.isShow = status;
    },
    isUser(value) {
      let reg = /^[a-zA-Z][a-zA-Z0-9]{3,15}$/;
      if (!reg.test(value)) {
        this.Message = "请输入正确的用户名";
      } else {
        this.Message = "";
      }
    },
    doLogin() {
      var param = {
        strUsername: this.username,
        strPassword: this.password,
        websvrpwd:this.websvrpwd
      };
      doLogin(param)
        .then(res => {
          console.log(res);
          if (res.data.intCode === 200) {
            localStorage.setItem("strSid", res.data.strSid);
            localStorage.setItem("userInfo", JSON.stringify(res.data.objData));
            localStorage.setItem("websvrpwd", "suncnihold654321");
            this.$toast("登录成功");
            this.$router.push("/post/index");
          } else {
            this.$toast("登录失败");
          }
        })
        .catch(err => {
          this.$toast(err);
        });
    }
  }
};
</script>

<style scoped lang="stylus" >
.loginbody
  width 100%
  height 100%
  position relative
  background-color #eee
.van-cell-group
  width 70%
  top 50%
  left 50%
  transform translate(-50%, -50%)
  position absolute
.van-button
  float right
  margin 10px 0 0 5px
</style>
