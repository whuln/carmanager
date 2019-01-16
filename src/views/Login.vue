<template>
  <mu-container class="login">
    <p class="title">黄河测绘车辆管理系统</p>
    <br>
    <div class="login_input">     
        <mu-form ref="form" :model="validateForm" class="mu-demo-form">        
          <mu-form-item label="用户名" prop="account" :rules="usernameRules">
          <mu-text-field v-model="validateForm.account" prop="account"></mu-text-field>
        </mu-form-item>
        <mu-form-item label="密码" prop="password" :rules="passwordRules">
            <mu-text-field type="password" v-model="validateForm.password" prop="password"></mu-text-field>
        </mu-form-item>
        <!-- <mu-form-item prop="isAgree">
          <mu-checkbox label="记住我" v-model="validateForm.isAgree"></mu-checkbox>
        </mu-form-item> -->
        <mu-form-item>
          <mu-button color="primary" @click="submit">登录</mu-button>
          <mu-button @click="clear">重置</mu-button>
        </mu-form-item>
      </mu-form>
    </div>  
    
  </mu-container>
</template>
<script>
import request from "@/lib/api.request.js";
import { setToken} from "@/lib/util";
import qs from "qs";

import { mapMutations } from "vuex";

export default {
  data() {
    return {
      usernameRules: [
        { validate: val => !!val, message: "必须填写用户名" },
        { validate: val => val.length >= 3, message: "用户名长度大于3" }
      ],
      passwordRules: [
        { validate: val => !!val, message: "必须填写密码" },
        {
          validate: val => val.length >= 3 && val.length <= 10,
          message: "密码长度大于3小于10"
        }
      ],
      argeeRules: [{ validate: val => !!val, message: "必须同意用户协议" }],
      validateForm: {
        account: "",
        password: ""
      }
    };
  }, 
  methods: {
    ...mapMutations(["setUserinfo"]),
    submit() {
      const self = this;
      this.$refs.form.validate().then(result => {       
        //获取登录信息
        request
          .post("login", qs.stringify(this.validateForm))
          .then(function(response) {
            //  console.log(response.data);           
            let data = response.data;            
            if (0 != data.code) {             
              self.$alert(data.msg);
            }
            if (0 == data.code) {
              //设置cookies
              //  console.log(data.msg)
              self.setUserinfo(data.msg);
              setToken(data.msg.token);
              self.$router.push("home");
            }
          })
          .catch(function(error) {
            self.$alert("登录出现错误！");
          });
      });
    },
    clear() {
      this.$refs.form.clear();
      this.validateForm = {
        account: "",
        password: ""
      };
    }
  }
};
</script>
<style lang="stylus" scoped>

.login {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: Center;
  background: url('../assets/login-bg0.jpg');
}

.login_input {
  color:white;
  padding-bottom: 0.5rem;
  padding: 0.2rem;
  text-align: left;
}

.title {
  font: bold 2rem arial, sans-serif;
  color: white;
}

</style>
