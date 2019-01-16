import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const myinfo = {
  state: {
    account: undefined,
    name: undefined,
    token: undefined,
    access: undefined,
    rolename: undefined,
    department: undefined,
    phone: undefined,
    checkers: undefined
  },
  mutations: {
    setUserinfo(state, info) {
      // console.log(info);
      state.account = info.account;
      state.name = info.name;
      state.token = info.token;
      state.access = info.role.accesses;
      state.rolename = info.rolename;
      state.department = info.department;
      state.phone = info.phone;
      console.log("setuserinfo done");
    },
    setCheckers(state, checkers) {
      state.checkers = checkers;
      // console.log("checksstore - " + typeof checkers + checkers.length);
    }
  }
};
export default new Vuex.Store({
  state: {
    states: ["在郑", "出差"],
    rolenames: ["管理员", "院领导", "主管领导", "部门主任", "职工", "司机"],
    departments: [
      "院领导",
      "办公室",
      "生产技术部",
      "财务部",
      "市场部",
      "研发部",
      "测绘工程1部",
      "测绘工程2部",
      "测绘工程3部",
      "测绘工程4部",
      "地理信息中心",
      "航测遥感中心",
      "航测摄影中心"
    ]
  },
  mutations: {},
  actions: {},
  modules: {
    me: myinfo
  }
});
