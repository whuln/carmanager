<template>
  <mu-flex class="main" fill direction="column">
    <span style="font-size:1rem;">待分配车辆申请列表</span>
    <mu-flex class="tablecon" fill direction="column">
      <mu-list @change="listChange">
        <mu-list-item v-for="item, key in carApplyinfos" button :ripple="false" :value="key">
          <mu-list-item-title>{{item.user.name}}</mu-list-item-title>

          <mu-list-item-action>
            <mu-chip class="demo-chip">{{item.project}}</mu-chip>
            <mu-chip class="demo-chip">{{item.carnumber?"已派车":"待派车"}}</mu-chip>
            <mu-chip class="demo-chip">{{item.isback?"待收车":"未返回"}}</mu-chip>
          </mu-list-item-action>
        </mu-list-item>
      </mu-list>
      <mu-dialog
        title="分配司机、车辆"
        scrollable
        width="600"
        transition="slide-bottom"
        :open.sync="openAllotFullscreen"
      >
        <mu-paper :z-depth="1" class="demo-list-wrap">
          <mu-list>
            <mu-list-item>用车人：{{caSelected.user?caSelected.user.name:""}}</mu-list-item>
            <mu-list-item>部门 ：{{caSelected.department}}</mu-list-item>
            <mu-list-item>项目 ：{{caSelected.project}}</mu-list-item>
            <mu-list-item>用途：{{caSelected.purpose}}</mu-list-item>
            <mu-list-item>地点 ：{{caSelected.places}}</mu-list-item>
            <mu-list-item>计划出发时间：{{caSelected.plantime1}}</mu-list-item>
            <mu-list-item>计划回程时间：{{caSelected.plantime2}}</mu-list-item>
            <mu-list-item>是否省外：{{caSelected.isshengwai?"省外":"省内"}}</mu-list-item>
            <mu-list-item v-if="caSelected.carnumber">车辆：{{caSelected.carnumber}}</mu-list-item>
            <mu-list-item v-if="caSelected.carnumber">司机：{{caSelected.driver.name}}</mu-list-item>
          </mu-list>
          
          分配司机：
          <mu-select v-model="selectDriverIndex" :disabled="caSelected.carnumber" full-width>
            <mu-option
              v-for="driver,index in useableDrivers"
              :key="index"
              :label="driver.name"
              :value="index"
            ></mu-option>
          </mu-select>
          
          分配车辆：
          <mu-select v-model="selectCarIndex" :disabled="caSelected.carnumber"  full-width>
            <mu-option
              v-for="car,index in useableCars"
              :key="index"
              :label="car.number+','+ car.brand+','+car.sites +'座'"
              :value="index"
            ></mu-option>
          </mu-select>
          <mu-button slot="actions" @click="doSend" :disabled="caSelected.carnumber"  color="success">确认派车</mu-button>
           <mu-button slot="actions" @click="doReceive" color="success">确认收车</mu-button>
        </mu-paper>
      </mu-dialog>
    </mu-flex>
  </mu-flex>
</template>

<script>
import { mapState } from "vuex";
import request from "@/lib/api.request.js";
import qs from "qs";

export default {
  name: "carallot",
  data() {
    return {
      openAllotFullscreen: false,
      carApplyinfos: [], //[{"id":1,"cuaccount":"gaoqf","reason":"北京GIS遥感大会","nofp":2,"departure":"郑州","destination":"北京","date1":"2018-10-22T03:19:00.000Z","date2":"2018-10-24T03:19:00.000Z","u1name":"高庆方","u2name":"","u3name":"高庆方"}]
      useableDrivers: [],
      useableCars: [],
      selectedCaIndex: "",
      selectDriverIndex: "",
      selectCarIndex: "",
      caSelected: {}
    };
  },
  computed: {
    ...mapState({
      account: state => state.me.account,
      departs: state => state.departs
    })
  },
  methods: {
    async doReceive(){
       const self = this;
      try {
        var resp = await request.post(
          "upsert_ucf",
          qs.stringify({
            id: this.caSelected.id,
            receiveraccount:this.account,
            isreceived:1
          })
        );
         let data = resp.data;
        if (data.code == 0) {
          this.carApplyinfos.splice(this.selectedCaIndex,1);
          this.selectedCaIndex = "";      
          this.caSelected = {};
          this.$alert("收车成功");  

          this.getUnallotedCarApplyinfos();
          this.getUseableCars();
          this.getUseableDrivers();                 
        }

        if (data.code != 0) {
          this.$alert("收车失败");
        }
      }catch(error){
          this.$alert("收车失败");
      }
      this.openAllotFullscreen = false;
    },
    async doSend() {
      const self = this;
      try {
        var resp = await request.post(
        "upsert_ucf",
        qs.stringify({
          id: this.caSelected.id,
          senderaccount:this.account,
          driveraccount: this.useableDrivers[this.selectDriverIndex].account,
          carnumber: this.useableCars[this.selectCarIndex].number
        })
      );
      // console.log(resp.data);
      let data = resp.data;
      if (data.code == 0) {
        this.getUnallotedCarApplyinfos();
        this.getUseableCars();
        this.getUseableDrivers();

        this.selectedCaIndex = "";
        this.selectDriverIndex = "";
        this.selectCarIndex = "";
        this.caSelected = {};
         this.$alert("车辆、司机分配成功");
      }

      if (data.code != 0) {
        this.$alert(data.msg);
      }
      } catch (error) {
        this.$alert("车辆、司机分配失败");
      }
      this.openAllotFullscreen = false;
    },
    listChange(value) {
      this.selectedCaIndex = value;
      this.caSelected = this.carApplyinfos[this.selectedCaIndex];
      this.openAllotFullscreen = true;
    },
    getUseableDrivers() {
      const self = this;
      request
        .post("getusers", qs.stringify({ rolename: "司机", state: 0 }))
        .then(function(resp) {
          let data = resp.data;
          if (data.code == 0) {
            self.useableDrivers = JSON.parse(data.msg);
            //  this.$alert(data.msg);
          }

          if (data.code == 1) {
            self.$alert(data.msg);
          }
        })
        .catch(function(err) {
          self.$alert(err);
        });
    },
    getUseableCars() {
      const self = this;
      request
        .post("getcars", qs.stringify({ state: 0 }))
        .then(function(resp) {
          let data = resp.data;
          if (data.code == 0) {
            self.useableCars = JSON.parse(data.msg);
            //  this.$alert(data.msg);
          }

          if (data.code == 1) {
            self.$alert(data.msg);
          }
        })
        .catch(function(err) {
          self.$alert(err);
        });
    },
    getUnallotedCarApplyinfos() {
      const self = this;
      request
        .post("getucfs_admin")
        .then(function(resp) {
          let data = resp.data;
          if (data.code == 0) {
            self.carApplyinfos = data.msg;
            // this.$alert(data.msg);
          }

          if (data.code == 1) {
            self.$alert(data.msg);
          }
        })
        .catch(function(err) {
          self.$alert(err);
        });
    }
  },
  activated() {
    this.getUnallotedCarApplyinfos();
    this.getUseableCars();
    this.getUseableDrivers();
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
}

.mu-dialog-body {
  height: 100%;
  max-height: 100%;
}
</style>
