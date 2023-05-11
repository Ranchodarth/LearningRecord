import { type RouteRecordRaw, createRouter, createWebHashHistory, createWebHistory } from "vue-router"

const Layout = () => import("@/layout/index.vue")

/** 常驻路由 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/redirect",
    component: Layout,
    meta: {
      hidden: true
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index.vue")
      }
    ]
  },
  {
    path: "/403",
    component: () => import("@/views/error-page/403.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404.vue"),
    meta: {
      hidden: true
    },
    alias: "/:pathMatch(.*)*"
  },
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        name: "Dashboard",
        meta: {
          title: "首页",
          svgIcon: "dashboard",
          affix: true
        }
      }
    ]
  },
  {
    path: "/course",
    component: Layout,
    // redirect: "/course/",
    name: "Course",
    meta: {
      title: "内容管理",
      elIcon: "Grid",
      alwaysShow: true // 将始终显示根菜单
    },
    children: [
      {
        path: "courseList",
        component: () => import("@/views/course/courseList/index.vue"),
        name: "CourseList",
        meta: {
          title: "课程管理",
          affix: true,
          keepAlive: true
        }
      },
      {
        path: "courseEdit",
        component: () => import("@/views/course/courseEdit/index.vue"),
        name: "CourseEdit",
        meta: {
          title: "新增课程",
          hidden: true,
          keepAlive: true
        }
      },
      {
        path: "planList",
        component: () => import("@/views/course/planList/index.vue"),
        name: "PlanList",
        meta: {
          title: "计划管理",
          affix: true,
          keepAlive: true
        }
      },
      {
        path: "planEdit",
        component: () => import("@/views/course/planEdit/index.vue"),
        name: "PlanEdit",
        meta: {
          title: "新增计划",
          hidden: true,
          keepAlive: true
        }
      },
      {
        path: "classifyAndLabel",
        component: () => import("@/views/course/classifyAndLabel/index.vue"),
        name: "ClassifyAndLabel",
        meta: {
          title: "分类/标签管理",
          affix: true,
          keepAlive: true
        }
      },
      {
        path: "coach",
        component: () => import("@/views/course/coach/index.vue"),
        name: "Coach",
        meta: {
          title: "教练管理",
          affix: true,
          keepAlive: true
        }
      },
      {
        path: "video",
        component: () => import("@/views/course/video/index.vue"),
        name: "Video",
        meta: {
          title: "视频库",
          affix: true,
          keepAlive: true
        }
      }
    ]
  },
  {
    path: "/user",
    component: Layout,
    // redirect: "/course/",
    name: "User",
    meta: {
      title: "用户管理",
      elIcon: "Menu",
      alwaysShow: true // 将始终显示根菜单
    },
    children: [
      {
        path: "userList",
        component: () => import("@/views/user/userList/index.vue"),
        name: "UserList",
        meta: {
          title: "用户管理",
          affix: true,
          keepAlive: true
        }
      }
    ]
  },
  {
    path: "/marketing",
    component: Layout,
    name: "Marketing",
    meta: {
      title: "营销管理",
      elIcon: "Menu",
      alwaysShow: true // 将始终显示根菜单
    },
    children: [
      {
        path: "marketing",
        component: () => import("@/views/marketing/marketingList/index.vue"),
        name: "Marketing",
        meta: {
          title: "营销位管理",
          affix: true,
          keepAlive: true
        }
      },
      {
        path: "marketingEdit",
        component: () => import("@/views/marketing/marketingEdit/index.vue"),
        name: "MarketingEdit",
        meta: {
          title: "新增营销",
          hidden: true,
          keepAlive: true
        }
      }
    ]
  },
  {
    path: "/appVersion",
    component: Layout,
    name: "AppVersion",
    meta: {
      title: "app版本管理",
      elIcon: "Cellphone",
      alwaysShow: true // 将始终显示根菜单
    },
    children: [
      {
        path: "appVersionList",
        component: () => import("@/views/appVersion/appVersionList/index.vue"),
        name: "AppVersionList",
        meta: {
          title: "app版本管理",
          affix: true,
          keepAlive: true
        }
      },
      {
        path: "appVersionAdd",
        component: () => import("@/views/appVersion/appVersionAdd/index.vue"),
        name: "AppVersionAdd",
        meta: {
          title: "新增app版本",
          hidden: true,
          keepAlive: true
        }
      }
    ]
  },
  {
    path: "/dictionary",
    component: Layout,
    name: "Dictionary",
    meta: {
      title: "字典管理",
      elIcon: "List",
      alwaysShow: true // 将始终显示根菜单
    },
    children: [
      {
        path: "dictionaryList",
        component: () => import("@/views/dictionary/dictionaryList/index.vue"),
        name: "DictionaryList",
        meta: {
          title: "字典管理",
          affix: true,
          keepAlive: true
        }
      },
      {
        path: "dictionaryAdd",
        component: () => import("@/views/dictionary/dictionaryAdd/index.vue"),
        name: "DictionaryAdd",
        meta: {
          title: "新增字典",
          hidden: true,
          keepAlive: true
        }
      }
    ]
  }
]

/**
 * 动态路由
 * 用来放置有权限 (Roles 属性) 的路由
 * 必须带有 Name 属性
 */
export const asyncRoutes: RouteRecordRaw[] = [
  // {
  //   path: "/permission",
  //   component: Layout,
  //   redirect: "/permission/page",
  //   name: "Permission",
  //   meta: {
  //     title: "权限管理",
  //     svgIcon: "lock",
  //     roles: ["admin", "editor"], // 可以在根路由中设置角色
  //     alwaysShow: true // 将始终显示根菜单
  //   },
  //   children: [
  //     {
  //       path: "page",
  //       component: () => import("@/views/permission/page.vue"),
  //       name: "PagePermission",
  //       meta: {
  //         title: "页面权限",
  //         roles: ["admin"] // 或者在子导航中设置角色
  //       }
  //     },
  //     {
  //       path: "directive",
  //       component: () => import("@/views/permission/directive.vue"),
  //       name: "DirectivePermission",
  //       meta: {
  //         title: "指令权限" // 如果未设置角色，则表示：该页面不需要权限，但会继承根路由的角色
  //       }
  //     }
  //   ]
  // },
  {
    path: "/:pathMatch(.*)*", // Must put the 'ErrorPage' route at the end, 必须将 'ErrorPage' 路由放在最后
    redirect: "/404",
    name: "ErrorPage",
    meta: {
      hidden: true
    }
  }
]

const router = createRouter({
  history:
    import.meta.env.VITE_ROUTER_HISTORY === "hash"
      ? createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH)
      : createWebHistory(import.meta.env.VITE_PUBLIC_PATH),
  routes: constantRoutes
})

/** 重置路由 */
export function resetRouter() {
  // 注意：所有动态路由路由必须带有 Name 属性，否则可能会不能完全重置干净
  try {
    router.getRoutes().forEach((route) => {
      const { name, meta } = route
      if (name && meta.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name)
      }
    })
  } catch (error) {
    // 强制刷新浏览器也行，只是交互体验不是很好
    window.location.reload()
  }
}

export default router
