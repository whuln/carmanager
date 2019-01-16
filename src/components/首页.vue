<template>
  <mu-flex class="main" fill direction="column">
    <mu-flex class="tablecon" fill direction="column" v-if="!caruse">您当前没有在用车辆</mu-flex>
    <mu-flex class="tablecon" fill direction="column" v-else>您当前用车信息如下：
      <mu-list dense>
        <mu-sub-header>基本信息</mu-sub-header>
        <mu-list-item>用车人：{{name}}</mu-list-item>
        <mu-list-item>项目 ：{{caruse.project}}</mu-list-item>
        <mu-list-item>用途：{{caruse.purpose}}</mu-list-item>
        <mu-list-item>地点：{{caruse.places}}</mu-list-item>
        <mu-list-item>计划出发日期：{{caruse.plantime1}}</mu-list-item>
        <mu-list-item>计划回程日期：{{caruse.plantime2}}</mu-list-item>
        <mu-sub-header>审核信息</mu-sub-header>
        <mu-list-item>部门主任：{{caruse.isdmagree ? "已批准":"未批准"}}</mu-list-item>
        <mu-list-item v-if="caruse.isshengwai">主管领导：{{caruse.yldagree ? "已批准":"未批准"}}（省外）</mu-list-item>
        <mu-sub-header>分配车辆、司机</mu-sub-header>
        <mu-list-item>车辆：{{caruse.carnumber}}</mu-list-item>
        <mu-list-item>司机：{{caruse.driver?caruse.driver.name:""}}(电话：{{caruse.driver?caruse.driver.phone:""}})</mu-list-item>
        <mu-sub-header>填写里程</mu-sub-header>
        <mu-list-item>起始读数：
          <mu-text-field v-model="caruse.kilometres1">公里</mu-text-field>
          <mu-button flat small color="primary" @click="submitStart">提交</mu-button>
        </mu-list-item>
        <mu-list-item>终止读数：
          <mu-text-field v-model="caruse.kilometres2">公里</mu-text-field>
          <mu-button flat small color="primary" @click="submitOver">提交</mu-button>
        </mu-list-item>
      </mu-list>
    </mu-flex>
  </mu-flex>
</template>

<script>
import { mapState } from "vuex";
import request from "@/lib/api.request.js";
import qs from "qs";
export default {
  name: "HomeIndex",
  data() {
    return {
      caruse: null
    };
  },
  computed: {
    ...mapState({
      name: state => state.me.name,
      account: state => state.me.account
    })
  },
  methods: {
    async submitStart() {
      if (!this.caruse.kilometres1) {
        this.$alert("请填写里程");
        return;
      }
      //先确认是否联系到司机，并出发？
      let sure = await this.$confirm("确定出发？", "提示");

      if (sure.result) {
        try {
          var resp = await request.post(
            "upsert_ucf",
            qs.stringify({
              id: this.caruse.id,
              kilometres1: this.caruse.kilometres1
            })
          );

          if (resp.data.code == 0) {
            this.$alert("里程添加成功");
          } else {
            this.$alert("里程添加失败");
          }
        } catch (error) {
          this.$alert("里程添加失败");
        }
      } else {
        this.$alert("点击了取消");
      }
    },
    async submitOver() {
      if (!this.caruse.kilometres2) {
        this.$alert("请填写里程");
        return;
      }

      //先确认已经返回？
      let sure = await this.$confirm("确定已返回？", "提示");

      if (sure.result) {
        try {
          var resp = await request.post(
            "upsert_ucf",
            qs.stringify({
              id: this.caruse.id,
              kilometres2: this.caruse.kilometres2
            })
          );

          if (resp.data.code == 0) {
            this.$alert("里程添加成功");
          } else {
            this.$alert("里程添加失败");
          }
        } catch (error) {
          this.$alert("里程添加失败");
        }
      } else {
        this.$alert("点击了取消");
      }
    }
  },
  mounted() {
    // console.log("activated")
    const self = this;
    request
      .post("getucfs_user", qs.stringify({ useraccount: this.account }))
      .then(resp => {
        let data = resp.data;
        // console.log(data);
        if (data.code == 0) {
          self.caruse = data.msg;
        }
        if (data.code == 1) {
          self.$alert(data.msg);
        }
      })
      .catch(err => {
        self.$alert("您没有未出行车辆申请");
      });
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
  padding-top: 10px;
}
</style>
