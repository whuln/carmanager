import Vue from "vue";
import Router from "vue-router";
import Login from "./views/Login.vue";

import { getToken, getUserinfo } from "@/lib/util";

Vue.use(Router);

let router = new Router({
  mode: "history",
  // mode: "hash",
  // base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "login",
      component: Login
    },
    {
      path: "/home",
      name: "home",
      children: [
        {
          path: "index",
          name: "index",
          component: () => import("./components/首页.vue")
        },
        {
          path: "carreq",
          name: "carreq",
          component: () => import("./components/车辆申请.vue")
        },
        {
          path: "carexam",
          name: "carexam",
          component: () => import("./components/车辆审批.vue")
        },
        {
          path: "carallot",
          name: "carallot",
          component: () => import("./components/车辆分配.vue")
        },
        {
          path: "driver",
          name: "driver",
          component: () => import("./components/司机接单.vue")
        },
        // {
        //   path: "allcaruse",
        //   name: "allcaruse",
        //   component: () => import("./components/所有用车.vue")
        // },
        {
          path: "usermanage",
          name: "usermanage",
          component: () => import("./components/人员管理.vue")
        },
        {
          path: "carmanage",
          name: "carmanage",
          component: () => import("./components/车辆管理.vue")
        },
        {
          path: "carusesummary",
          name: "carusesummary",
          component: () => import("./components/用车统计.vue")
        }
      ],
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/Home.vue")
    },
    {
      path: "/*",
      name: "error",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/errors/404.vue")
    }
  ]
});

const LOGIN_PAGE_NAME = "login";
router.beforeEach((to, from, next) => {
  // next();
  const token = getToken();

  if (!token && to.name !== LOGIN_PAGE_NAME) {
    // 未登录且要跳转的页面不是登录页
    next({
      name: LOGIN_PAGE_NAME // 跳转到登录页
    });
  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页
    next(); // 跳转
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    // 已登录且要跳转的页面是登录页
    next({
      name: "home" // 跳转到home页
    });
  } else if (token && to.name !== LOGIN_PAGE_NAME) {
    next();
  }
});

export default router;
