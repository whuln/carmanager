<template>
  <mu-flex ref="fcarapply1" class="main" fill direction="column">
    <mu-flex class="main" ref="formcontainer" fill direction="column">
      <mu-form ref="fcarapply" :model="carapply" label-position="left" label-width="100">
        <mu-form-item prop="name" label="用车人" :rules="NotNullRules">
          <mu-text-field v-model="carapply.name" disabled></mu-text-field>
        </mu-form-item>
        <mu-form-item prop="department" label="部门" :rules="NotNullRules">
          <mu-text-field v-model="carapply.department" disabled></mu-text-field>
        </mu-form-item>
        <mu-form-item prop="project" label="项目" :rules="NotNullRules">
          <mu-text-field v-model="carapply.project"></mu-text-field>
        </mu-form-item>
        <mu-form-item prop="purpose" label="用途" :rules="NotNullRules">
          <mu-text-field v-model="carapply.purpose"></mu-text-field>
        </mu-form-item>
        <mu-form-item prop="places" label="地点" :rules="NotNullRules">
          <mu-text-field v-model="carapply.places"></mu-text-field>
        </mu-form-item>
        <mu-form-item prop="plantime1" label="计划出发时间" :rules="NotNullRules">
          <mu-date-input v-model="carapply.plantime1" label-float full-width></mu-date-input>
        </mu-form-item>
        <mu-form-item prop="plantime2" label="计划回程时间" :rules="NotNullRules">
          <mu-date-input v-model="carapply.plantime2" label-float full-width></mu-date-input>
        </mu-form-item>
        <mu-form-item prop="isshengwai" label="是否省外">
          <mu-checkbox v-model="carapply.isshengwai"></mu-checkbox>
        </mu-form-item>
      </mu-form>
    </mu-flex>
    <mu-flex justify-content="center">
      <mu-button :disabled="locked.submit" @click="doSubmit" small color="success">提交</mu-button>
      <mu-button @click="clear" small>重置</mu-button>
    </mu-flex>

    <!-- dialogs -->
    <mu-dialog width="360" transition="slide-bottom" fullscreen :open.sync="openPushFullscreen">
      <mu-appbar color="primary" title="确认提交信息...">
        <mu-button slot="right" flat @click="openPushFullscreen = false">关闭</mu-button>
      </mu-appbar>
      <div style="padding: 24px;">
        <mu-form ref="fcarapply" :model="carapply" label-position="left" label-width="100">
        <mu-form-item prop="name" label="用车人" :rules="NotNullRules">
          <mu-text-field v-model="carapply.name" disabled></mu-text-field>
        </mu-form-item>
        <mu-form-item prop="department" label="部门" :rules="NotNullRules">
          <mu-text-field v-model="carapply.department" disabled></mu-text-field>
        </mu-form-item>
        <mu-form-item prop="project" label="项目" :rules="NotNullRules">
          <mu-text-field v-model="carapply.project"></mu-text-field>
        </mu-form-item>
        <mu-form-item prop="purpose" label="用途" :rules="NotNullRules">
          <mu-text-field v-model="carapply.purpose"></mu-text-field>
        </mu-form-item>
        <mu-form-item prop="places" label="地点" :rules="NotNullRules">
          <mu-text-field v-model="carapply.places"></mu-text-field>
        </mu-form-item>
        <mu-form-item prop="plantime1" label="计划出发时间" :rules="NotNullRules">
          <mu-date-input v-model="carapply.plantime1" label-float full-width></mu-date-input>
        </mu-form-item>
        <mu-form-item prop="plantime2" label="计划回程时间" :rules="NotNullRules">
          <mu-date-input v-model="carapply.plantime2" label-float full-width></mu-date-input>
        </mu-form-item>
        <mu-form-item prop="isshengwai" label="是否省外">
          <mu-checkbox v-model="carapply.isshengwai"></mu-checkbox>
        </mu-form-item>
      </mu-form>
        <mu-button :disabled="locked.checked" @click="doPush" color="success" small >确认</mu-button>
      </div>
    </mu-dialog>
  </mu-flex>
</template>

<script>
import { mapState } from "vuex";
import request from "@/lib/api.request.js";
import qs from "qs";

export default {
  name: "carreq",
  data() {
    return {
      carapply: {
        name: "",
        useraccount: "",
        department: "",
        project: "",
        purpose: "",
        places: "",
        plantime1: "",
        plantime2: "",
        isshengwai: false
      },
      locked: {
        submit: false,
        checked: false
      },
      checkAccount: "",
      openPushFullscreen: false,
      NotNullRules: [{ validate: val => !!val, message: "不能为空" }]
    };
  },
  computed: {
    ...mapState({
      name: state => state.me.name,
      account: state => state.me.account,
      role: state => state.me.rolename,
      department: state => state.me.department
    })
  },
  created() {
    this.carapply.name = this.name;
    this.carapply.useraccount = this.account;
    this.carapply.department = this.department;   
  },
  mounted() {
    // this.$alert("mmmmmm");
    // this.$alert(this.$refs.fcarapply1.clientHeight);
  },
  methods: {
    clear() {
      this.carapply.project= "";
      this.carapply.purpose="";
      this.carapply.places="";
      this.carapply.plantime1="";
      this.carapply.plantime2="";
      this.carapply.isshengwai=false;
    },    
    addCarApply() {},
    doSubmit(){
      this.openPushFullscreen = true;
      // console.log(this.carapply); 
    },
    async doPush() {
     
      const self = this;
       this.openPushFullscreen = true;
       if(this.role == "部门主任"){
         this.carapply.isdmagree = 1;
       }
       if(this.role == "院领导"){
         this.carapply.isdmagree = 1;
         this.carapply.yldagree = 1;
       }
      let resp = await request.post("adducfs_user", qs.stringify(self.carapply));
      let data = resp.data;
      // console.log(data)
      if(data.code == 0 ){
        this.$alert(data.msg);
      }

      if(data.code != 0 ){
        this.$alert(data.msg+", 请重新填写。");
      }
      this.openPushFullscreen = false;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.main {
  width: 100%;
}
</style>
