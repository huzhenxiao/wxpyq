import Vue from "vue";
import Router from "vue-router";
import Index from "./views/index.vue";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "index",
      component: Index,
      children: [
        {
          path: "",
          redirect: "/chats"
        },
        {
          path: "/chats",
          name: "chats",
          component: () => import("./views/Chats.vue")
        },
        {
          path: "/contacts",
          name: "contacts",
          component: () => import("./views/Contacts.vue")
        },
        {
          path: "/discover",
          name: "discover",
          component: () => import("./views/Discover.vue")
        },
        {
          path: "/me",
          name: "me",
          component: () => import("./views/Me.vue")
        }
      ]
    },
    {
      path: "/login",
      name: "login",
      component: () => import("./views/Login.vue")
    },
    {
      path: "/register",
      name: "register",
      component: () => import("./views/Register.vue")
    },
    {
      path: "/moments",
      name: "moments",
      component: () => import("./views/Moments.vue")
    },
    {
      path: "/publish",
      name: "publish",
      component: () => import("./views/Publish.vue")
    }
  ]
});

router.beforeEach((to, from, next) => {
  const isLogin = localStorage.wxpyqToken ? true : false;
  if (to.path == "/login" || to.path == "/register") {
    next();
  } else {
    isLogin ? next() : next("/login");
  }
});

export default router;
