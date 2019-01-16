<template>
  <mu-flex class="home" direction="column">
    <mu-flex class="flex_item">
      <mu-tabs :value.sync="activetab" full-width>
        <mu-tab v-if="access.includes(1)">用车信息</mu-tab>
        <mu-tab v-if="access.includes(2)">申请用车</mu-tab>
        <mu-tab v-if="access.includes(3)">用车审批</mu-tab>
        <mu-tab v-if="access.includes(4)">车辆派收</mu-tab>
        <mu-tab v-if="access.includes(5)">司机接单</mu-tab>       
        <mu-tab v-if="access.includes(6)">车辆管理</mu-tab>
        <mu-tab v-if="access.includes(7)">用户管理</mu-tab>
        <mu-tab v-if="access.includes(8)">用车统计</mu-tab>
      </mu-tabs>
      <div flat @click="logout">注销</div>
    </mu-flex>

    <mu-flex class="flex_item" fill justify-content="start" direction="column">
      <keep-alive :include="aliveIncludes">
        <router-view></router-view>
      </keep-alive>
      <!-- <mu-flex fill style="background:red;width:100%;">1</mu-flex> -->
    </mu-flex>
  </mu-flex>
</template>

<script>
import { getToken, setToken } from "@/lib/util";
import { mapState, mapMutations } from "vuex";
import request from "@/lib/api.request.js";
import qs from "qs";
import Vue from "vue";

export default {
  name: "Home",
  data() {
    return {
      activetab: 0,
      base: "/home",
      docked: false,
      open: false,
      position: "left",
      testarr: [1, 2, 3]
    };
  },
  computed: {
    ...mapState({
      account: state => state.me.account,
      access: state => state.me.access,
      name: state => state.me.name,
      role: state => state.me.rolename,
      department: state => state.me.department
    }),
    accessArr() {
      return this.access.split(",");
    },
    aliveIncludes(){
      let includes = ["index","carreq","carexam","carallot","driver","carmanage","usermanage"];
      return includes.join();
    }
  },
  created() {
    // this.$alert(this.role);
    const self = this;
    if (!this.account) {
      console.log("token: " + getToken());
      //获取登录信息
      request
        .post("login", qs.stringify({ token: getToken() }))
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

            if (data.msg.rolename == "司机") {
              //司机
              self.$router.push(self.topath("driver"));
            } else if (data.msg.rolename  == "管理员") {
              //管理员
              self.$router.push(self.topath("carallot"));
            } else {
              self.$router.push(self.topath("index")); //职工,院领导，部门主任
            }
          }
        })
        .catch(function(error) {
          self.$alert("登录出现错误！"+error);
        });
    }else{
       if (this.role == "司机") {
              //司机
              this.$router.push(this.topath("driver"));
            } else if (this.role == "管理员") {
              //管理员
              this.$router.push(this.topath("carallot"));
            } else {
              this.$router.push(this.topath("index")); //职工,院领导，部门主任
            }
    }
 
  },
  methods: {
    ...mapMutations(["setUserinfo"]),
    logout() {
      setToken("");
      this.$router.push("/");
    },
    topath(path) {
      return this.base + "/" + path;
    },
    doClose() {
      this.$emit("close");
    }
   
  },
  watch: {   
    activetab(val, oldVal) {
      //  this.$alert( this.accessArr[val]  + typeof this.accessArr[val]  )
      switch (this.accessArr[val]) {
        case "1":
          this.$router.push(this.topath("index"));
          break;
        case "2":
          this.$router.push(this.topath("carreq"));
          break;
        case "3":
          this.$router.push(this.topath("carexam"));
          break;
        case "4":
          this.$router.push(this.topath("carallot"));
          break;
        case "5":
          this.$router.push(this.topath("driver"));
          break;
        case "6":
          this.$router.push(this.topath("carmanage"));
          break;
        case "7":
          this.$router.push(this.topath("usermanage"));
          break;
        case "8":
          this.$router.push(this.topath("carusesummary"));
          break;
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
@import '../assets/main';

.home {
  background-color: $main_bk_color;
  height: $full_height;
}

.toolimg {
  width: 2rem;
  height: 2rem;
}

.drawer {
  background-color: $main_bk_color;
  border-top: $main_head_color 1rem solid;
}

img {
  width: 1.2rem;
  height: 1.2rem;
}

.flex_item {
  border-bottom: 1px $main_head_color solid;
  border-radius: 4px;
  width: 100%;
}

.mu-button {
  margin-right: 2px;
  vertical-align: top;
}
</style>
