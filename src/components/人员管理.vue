<template>
 <mu-flex class="main" fill direction="column">
    <mu-flex class="tablecon" ref="tablecontainer" fill direction="column" >      
       <mu-data-table style="width:100%;" selectable :selects.sync="selects" :height="tableHeight" :columns="columns" :sort.sync="sort" @sort-change="handleSortChange" :data="showlist">
          <template slot-scope="scope">          
            <td class="is-right">{{scope.row.account}}</td>
            <td class="is-right">{{scope.row.name}}</td>        
            <td class="is-right">{{scope.row.rolename}}</td> 
            <td class="is-right">{{scope.row.department}}</td>
            <td class="is-right">{{scope.row.state?"出差":"在郑"}}</td>
         
          </template>
        </mu-data-table>       
      </mu-flex>
      <mu-flex justify-content="start" direction="column">
        <mu-text-field v-model="s_name" type="string" placeholder="请输入用户账号..." action-icon="搜索" :action-click="doSearch"></mu-text-field>
         <mu-flex justify-content="start">
           <mu-button small @click="openAdduserFullscreenDialog">添加用户</mu-button>
           <mu-button small @click="openUpdateuserFullscreenDialog">修改用户</mu-button>
           <mu-button :disabled="locked.delete" small @click="deleteUser">删除用户</mu-button>
        </mu-flex>
      </mu-flex>

      <!-- dialogs -->
      <mu-dialog width="360" transition="slide-bottom" fullscreen :open.sync="openAdduserFullscreen">
        <mu-appbar color="primary" title="添加用户">
          <mu-button slot="right" flat  @click="closeAdduserFullscreenDialog">
            关闭
          </mu-button>
        </mu-appbar>
        <div style="padding: 24px;">          
           <mu-form ref="adduser" :model="useradd" class="mu-demo-form" :label-position="labelPosition" label-width="100">
              <mu-form-item prop="account" label="账号" :rules="accountRules">
                <mu-text-field v-model="useradd.account"></mu-text-field>
              </mu-form-item>
              <mu-form-item prop="name" label="姓名" :rules="usernameRules">
                <mu-text-field v-model="useradd.name"></mu-text-field>
              </mu-form-item>
              <mu-form-item prop="password" label="密码" :rules="passwordRules">
                <mu-text-field v-model="useradd.password"></mu-text-field>
              </mu-form-item>
              <mu-form-item prop="rolename" label="角色">
                <mu-select v-model="useradd.rolename">
                  <mu-option v-for="value,key in rolenames" :key="key" :label="value" :value="value"></mu-option>
                </mu-select>
              </mu-form-item>
              <mu-form-item prop="department" label="部门">
                 <mu-select v-model="useradd.department">
                  <mu-option v-for="value,key in departs" :key="key" :label="value" :value="value"></mu-option>
                </mu-select>
              </mu-form-item>
               <mu-form-item prop="phone" label="电话">
                <mu-text-field v-model="useradd.phone"></mu-text-field>
              </mu-form-item>          
            </mu-form>
           <mu-button :disabled="locked.add" @click="addUser" color="success">添加</mu-button>
            <mu-button @click="clearAddUser">重置</mu-button>
        </div>
      </mu-dialog>

       <mu-dialog width="360" transition="slide-bottom" fullscreen :open.sync="openUpdateuserFullscreen">
        <mu-appbar color="primary" title="修改用户">
          <mu-button slot="right" flat  @click="closeUpdateuserFullscreenDialog">
            关闭
          </mu-button>
        </mu-appbar>
        <div style="padding: 24px;">
         <mu-form ref="updateuser" :model="userupdate" class="mu-demo-form" :label-position="labelPosition" label-width="100">
              <mu-form-item prop="account" label="账号"  :rules="accountRules">
                <mu-text-field v-model="userupdate.account" disabled></mu-text-field>
              </mu-form-item>
              <mu-form-item prop="name" label="姓名" :rules="usernameRules">
                <mu-text-field v-model="userupdate.name"></mu-text-field>
              </mu-form-item>
              <mu-form-item prop="password" label="密码" >
                <mu-text-field v-model="userupdate.password"></mu-text-field>
              </mu-form-item>
              <mu-form-item prop="rolename" label="角色">
                  <mu-select v-model="userupdate.rolename">
                  <mu-option v-for="value,key in rolenames" :key="key" :label="value" :value="value"></mu-option>
                </mu-select>
              </mu-form-item>
              <mu-form-item prop="department" label="部门">
                 <mu-select v-model="userupdate.department">
                  <mu-option v-for="value,key in departs" :key="key" :label="value" :value="value"></mu-option>
                </mu-select>
              </mu-form-item>
              <mu-form-item prop="state" label="状态">               
                 <mu-select v-model="userupdate.state">
                  <mu-option v-for="value,key in states" :key="key" :label="value" :value="key"></mu-option>
                </mu-select>
              </mu-form-item>
            </mu-form>           
           <mu-button :disabled="locked.update" @click="updateUser" color="success">修改</mu-button>
        </div>
      </mu-dialog>   
 </mu-flex>
</template>

<script>
import qs from "qs";
import request from "@/lib/api.request.js";
import { mapState } from "vuex";
import { async } from 'q';
export default {
  name: "usermanage",
  props: {},
  data() {
    return {
      locked:{
        add:false,
        update:false,
        delete:false
      },
      tableHeight: 200,
      selects: [],
      s_name: "",
      openAdduserFullscreen: false,
      openUpdateuserFullscreen: false,
      sort: {
        name: "",
        order: "asc"
      },
      columns: [      
        {
          title: "账号",
          name: "ACCOUNT",
          width: 120,
          align: "left",
          sortable: true
        },
        {
          title: "姓名",
          name: "NAME",
          width: 120,
          align: "center",
          sortable: true
        },
      
        {
          title: "角色",
          name: "ROLE",
          width: 120,
          align: "center",
          sortable: true
        },
        {
          title: "部门",
          name: "DEPARTMENT",
          width: 150,
          align: "center",
          sortable: true
        },  {
          title: "状态",
          name: "STATE",
          width: 100,
          align: "center",
          sortable: true
        }
      ],
      showlist: undefined,
      allusers: undefined,
      accountRules: [
        {validate:async val => { 
          let resp = await request.post("getoneuser",qs.stringify({account:val}));
          if (resp.data.code){
            this.locked.add = false;
            return true;
              
          }else{
            this.locked.add = true;
            return false;
          }
         }, message: "该账号已存在！"},
        { validate: val => !!val, message: "必须填写账号" },
        { validate: val => val.length >= 3, message: "用户名长度大于3" }
      ],
      usernameRules: [{ validate: val => !!val, message: "必须填写用户名" }],
      passwordRules: [
        { validate: val => !!val, message: "必须填写密码" },
        {
          validate: val => val.length >= 3 && val.length <= 10,
          message: "密码长度大于3小于10"
        }
      ],      
      labelPosition: "left",
      useradd: {
        account: "",
        name: "",
        password: "",
        rolename: "",
        department: "",
        phone:""
      },
      userupdate: {
        account: "",
        name: "",
        password: "",
        rolename: "",
        department: "",
        phone:""
      }
    };
  },
  computed:{
    ...mapState({
      states: state => state.states,
      rolenames: state => state.rolenames,
      departs: state => state.departments,
    })
  },
  methods: {
    handleSortChange({ name, order }) {
      this.list = this.list.sort(
        (a, b) => (order === "asc" ? a[name] - b[name] : b[name] - a[name])
      );
    },
    openAdduserFullscreenDialog() {
      this.openAdduserFullscreen = true;
    },
    closeAdduserFullscreenDialog() {
      this.openAdduserFullscreen = false;
    },
    openUpdateuserFullscreenDialog() {
      let l = this.selects.length;
      if (0 == l) {
        this.$alert("请选择一个要修改的用户！");
        return;
      } else if (l > 1) {
        this.$alert("一次仅可以修改一个用户！");
        return;
      }
      this.userupdate = this.showlist[this.selects[0]];
      this.userupdate.state = this.userupdate.state?"出差":"在郑";
      // console.log(this.userupdate);
      this.openUpdateuserFullscreen = true;
    },
    closeUpdateuserFullscreenDialog() {
      this.openUpdateuserFullscreen = false;
    },
    doSearch() {
      const self = this;
      if (this.s_name) {
        request
          .post("getusers", qs.stringify({ account: this.s_name }))
          .then(function(resp) {
            let data = resp.data;

            if (0 == data.code) {
              // self.$toast.info(data.msg);
              self.showlist = JSON.parse(data.msg);
            }

            if (1 == data.code) self.$alert(data.msg);
          })
          .catch(function(error) {
            self.$alert(error);
          });
      } else this.showlist = this.allusers;
    },
    clearAddUser() {
      this.$refs.adduser.clear();
      this.useradd = {
        account: "",
        name: "",
        password: "",
        rolename: ""
      };
    },
    addUser() {
      this.locked.add = true;
      const self = this;
      // console.log(this.useradd);
      request
        .post("adduser", qs.stringify(this.useradd))
        .then(function(response) {
          // console.log(response.data);
          let data = response.data;         
          if (0 == data.code) self.$alert(data.msg);
          if (0 != data.code) self.$alert(data.msg);

          self.getAllUser();
          self.locked.add = false;
        })
        .catch(function(error) {
          self.$alert("添加用户失败");
            self.locked.add = false;
        });     
    },
    updateUser() {      
       this.locked.update = true;
      const self = this;
      // console.log(this.useradd);
      request
        .post("updateuser", qs.stringify(this.userupdate))
        .then(function(response) {
          // console.log(response.data);
          let data = response.data;
          if (0 == data.code) self.$alert(data.msg);          
          if (0 != data.code) self.$alert(data.msg);

          self.getAllUser();
          self.locked.update = false;
        })
        .catch(function(error) {
           self.locked.update = false;
          self.$alert("修改用户失败");
        });

       
    },
    deleteUser() {
      let l = this.selects.length;
      if (0 == l) {
        this.$alert("请选择一个要删除的用户！");
        return;
      } else if (l > 1) {
        this.$alert("一次仅可以删除一个用户！");
        return;
      }
      //delete user by id
       this.locked.delete = true;
      const self = this;
      // console.log(this.useradd);
      request
        .post("deleteuser", qs.stringify({account:this.showlist[this.selects[0]].account}))
        .then(function(response) {
          // console.log(response.data);
          let data = response.data;
          if (0 == data.code) self.$alert(data.msg);          
          if (0 != data.code) self.$alert(data.msg);

           self.selects = [];
            self.getAllUser();
            self.locked.delete = false;

        })
        .catch(function(error) {
          self.locked.delete = false;
          self.$alert("删除用户失败");
           
        });
     
    },
    getAllUser() {      
      var self = this;
      request
        .post("getusers")
        .then(function(resp) {
          let data = resp.data;
          // console.log(data)
          if (1 == data.code) this.$alert(data.msg);
          if (0 == data.code) {           
            self.allusers = JSON.parse(data.msg);
            self.showlist = self.allusers;
          }
        })
        .catch(function(error) {
          self.$alert(error);
        });
    }
  },
  activated(){
    this.getAllUser();
  },
  mounted() {    
    this.tableHeight = this.$refs.tablecontainer.clientHeight;
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
</style>
