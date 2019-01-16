<template>
  <mu-flex class="main" fill direction="column">
    <mu-flex class="tablecon" fill direction="column" v-if="carapply.carnumber == null">您当前没有出车安排</mu-flex>
    <mu-flex class="tablecon" fill direction="column" v-else>您即将出行的用车安排信息如下：
      <mu-list>
        <mu-sub-header>基本信息</mu-sub-header>
        <mu-list-item>用车人：{{carapply.user.name}}(电话：{{carapply.user.phone}})</mu-list-item>
        <mu-list-item>项目 ：{{carapply.project}}</mu-list-item>
        <mu-list-item>用途：{{carapply.purpose}}</mu-list-item>
        <mu-list-item>地点：{{carapply.places}}</mu-list-item>
        <mu-list-item>计划出发日期：{{carapply.plantime1}}</mu-list-item>
        <mu-list-item>计划回程日期：{{carapply.plantime2}}</mu-list-item>
        <mu-sub-header>填写信息</mu-sub-header>
        <mu-list-item>实际出发日期：
          <mu-date-input v-model="carapply.actualtime1" label-float></mu-date-input>
          <mu-button small color="primary" :disabled="carapply.isgo" @click="onGo">确认出发</mu-button>
        </mu-list-item>
        <mu-list-item>实际返回日期：
          <mu-date-input v-model="carapply.actualtime2" label-float></mu-date-input>
          <mu-button small color="primary" :disabled="carapply.isback" @click="onBack">确认交车</mu-button>
        </mu-list-item>
      </mu-list>
    </mu-flex>
  </mu-flex>
</template>

<script>
import { mapState } from "vuex";
import request from "@/lib/api.request.js";
import qs from "qs";
import { setTimeout } from 'timers';
export default {
  name: "driver",
  data() {
    return {
      carapply: {}
    };
  },
  computed: {
    ...mapState({
      account: state => state.me.account
    })
  },
  methods: {
    nullOrempty(val) {
      return val == null || val == "";
    },   
    async onGo() {
      if (this.nullOrempty(this.carapply.actualtime1)) {
        this.$alert("请选择出发日期！");
        return;
      }

      try {
        var resp = await request.post(
          "upsert_ucf",
          qs.stringify({
            id: this.carapply.id,
            isgo: 1,
            actualtime1: this.carapply.actualtime1
          })
        );

        if (resp.data.code == 0) {
          this.carapply.isgo = 1;
          this.$alert("提交成功");        
        } else {
          this.$alert("提交失败");
        }
      } catch (error) {
        this.$alert("提交失败");
      }
    },
    async onBack() {
      if (this.nullOrempty(this.carapply.actualtime2)) {
        this.$alert("请选择返回日期！");
        return;
      }

      try {
        var resp = await request.post(
          "upsert_ucf",
          qs.stringify({
            id: this.carapply.id,
            isback: 1,
            actualtime2: this.carapply.actualtime2,
            driveraccount: this.carapply.driveraccount,
            carnumber: this.carapply.carnumber
          })
        );
        if (resp.data.code == 0) {
          this.carapply.isback = 1;
          // this.carapply = {};
          this.$alert("提交成功 "); 
          setTimeout(()=>{
            this.getCaruse();
          },1000);         
        } else {
          this.$alert("提交失败");
        }
      } catch (error) {
        this.$alert("提交失败");
      }      
    },
    async getCaruse() {      
      const self = this;
      try {
         let resp = await request
        .post("getucfs_driver", qs.stringify({ driveraccount: this.account }));
        let data = resp.data; 
          if (data.code == 0) {
            self.carapply = data.msg;
            // console.log(self.carapply);
          }
          if (data.code == 1) {
            this.carapply = {};
            self.$alert("您当前没有出车安排");
          }
        
      } catch (error) {
          self.$alert("您当前没有出车安排");
      }
            
    }
  },
  activated() {
    this.getCaruse();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.main {
  width: 100%;
}

.tablecon {
  width: 100%;
  padding-top: 5px;
}
</style>
