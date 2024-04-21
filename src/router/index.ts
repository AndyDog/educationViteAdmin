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
    path: "/baseinfo",
    component: Layout,
    redirect: "/baseinfo/course-management",
    name: "baseinfo",
    meta: {
      title: "基础信息",
      elIcon: "Grid",
      alwaysShow: true
    },
    children: [
      {
        path: "course-management",
        component: () => import("@/views/baseinfo/course-management/index.vue"),
        name: "courseManagement",
        meta: {
          title: "课程管理",
          svgIcon: "dashboard",

          keepAlive: true
        }
      }
    ]
  },
  {
    path: "/platform",
    component: Layout,
    redirect: "/platform/static-picture",
    name: "platform",
    meta: {
      title: "平台管理",
      elIcon: "Grid"
    },
    children: [
      {
        path: "static-picture",
        component: () => import("@/views/system/element-plus/index.vue"),
        name: "staticPicture",
        meta: {
          title: "静态图片",
          keepAlive: true
        }
      },
      {
        path: "public-notice",
        component: () => import("@/views/system/public-notice/index.vue"),
        name: "publicNotice",
        meta: {
          title: "公开公告管理",
          keepAlive: true
        }
      },

      // {
      //   path: "user-manage",
      //   component: () => import("@/views/system/user-manage/index.vue"),
      //   name: "userManage",
      //   meta: {
      //     title: "用户管理",
      //     keepAlive: true
      //   }
      // },
      {
        path: "hire-manage",
        component: () => import("@/views/system/hire-manage/index.vue"),
        name: "hireManage",
        meta: {
          title: "租户管理",
          keepAlive: true
        }
      }
    ]
  },

  {
    path: "/training",
    component: Layout,
    redirect: "/training/training-info",
    name: "training",
    meta: {
      title: "培训管理",
      elIcon: "menu"
    },
    children: [
      {
        path: "training-info",
        component: () => import("@/views/training/training-info/index.vue"),
        // component: () => import("@/views/training/trainingcourseinfos/index.vue"),
        name: "trainingInfo",
        meta: {
          title: "培训信息",
          keepAlive: false
        }
      },
      {
        path: "training-course-infos",
        component: () => import("@/views/training/trainingcourseinfos/index.vue"),
        name: "trainingCourseInfos",
        meta: {
          title: "培训课程信息",
          keepAlive: false
        }
      },
      {
        path: "user-training-info",
        component: () => import("@/views/training/userTrainingInfo/index.vue"),
        name: "userTrainingInfo",
        meta: {
          title: "用户培训信息",
          keepAlive: false
        }
      },
      {
        path: "user-Schedule-info",
        component: () => import("@/views/training/user-Schedule-info/index.vue"),
        name: "userScheduleInfo11",
        meta: {
          title: "用户课表信息",
          keepAlive: false
        }
      },
      {
        path: "training-paper-management",
        component: () => import("@/views/training/training-paper-management/index.vue"),
        name: "TrainingPaperManagement",
        meta: {
          title: "培训试卷管理",
          keepAlive: false
        }
      },
      {
        path: "training-release-exam",
        component: () => import("@/views/training/training-release-exam/index.vue"),
        name: "TrainingReleaseExam",
        meta: {
          title: "培训发布考试",
          keepAlive: false
        }
      },
      {
        path: "training-exam-correction",
        component: () => import("@/views/training/training-exam-correction/index.vue"),
        name: "TrainingExamCorrection",
        meta: {
          title: "培训考试批改",
          keepAlive: false
        }
      },
      {
        path: "training-certificate",
        component: () => import("@/views/training/training-certificate/index.vue"),
        name: "TrainingCertificate",
        meta: {
          title: "培训证书",
          keepAlive: true
        }
      }
    ]
  },
  {
    path: "/usercenter",
    component: Layout,
    redirect: "/usercenter/userinfo",
    name: "userCenter",
    meta: {
      title: "个人中心",
      elIcon: "menu"
    },
    children: [
      {
        path: "userinfo",
        component: () => import("@/views/usercenter/userinfo/index.vue"),
        name: "userInfo",
        meta: {
          title: "个人资料",
          keepAlive: true
        }
      },
      {
        path: "mymessage",
        component: () => import("@/views/usercenter/myMessage/index.vue"),
        name: "myMessage",
        meta: {
          title: "我的消息",
          keepAlive: true
        }
      },
      {
        path: "personal-cloud-storage",
        component: () => import("@/views/usercenter/PersonalCloudStorage/index.vue"),
        name: "PersonalCloudStorage",
        meta: {
          title: "个人云盘",
          keepAlive: true
        }
      }
    ]
  },
  {
    path: "/system",
    component: Layout,
    redirect: "/system/user-manage",
    name: "system",
    meta: {
      title: "系统管理",
      elIcon: "Grid"
    },
    children: [
      {
        path: "user-manage",
        component: () => import("@/views/system/user-manage/index.vue"),
        name: "userManage",
        meta: {
          title: "用户管理",
          keepAlive: true
        }
      },
      {
        path: "role-manage",
        component: () => import("@/views/system/public-notice/index.vue"),
        name: "roleManage",
        meta: {
          title: "角色管理",
          keepAlive: true
        }
      },

      {
        path: "org-manage",
        component: () => import("@/views/system/user-manage/index.vue"),
        name: "orgManage",
        meta: {
          title: "机构管理",
          keepAlive: true
        }
      },
      {
        path: "group-manage",
        component: () => import("@/views/system/hire-manage/index.vue"),
        name: "groupManage",
        meta: {
          title: "分组管理",
          keepAlive: true
        }
      },
      {
        path: "menu-manage",
        component: () => import("@/views/system/hire-manage/index.vue"),
        name: "menuManage",
        meta: {
          title: "菜单管理",
          keepAlive: true
        }
      }
    ]
  }

  // {
  //   path: "/table",
  //   component: Layout,
  //   redirect: "/table/element-plus",
  //   name: "Table",
  //   meta: {
  //     title: "表格",
  //     elIcon: "Grid"
  //   },
  //   children: [
  //     {
  //       path: "element-plus",
  //       component: () => import("@/views/table/element-plus/index.vue"),
  //       name: "ElementPlus",
  //       meta: {
  //         title: "Element Plus",
  //         keepAlive: true
  //       }
  //     },
  //     {
  //       path: "vxe-table",
  //       component: () => import("@/views/table/vxe-table/index.vue"),
  //       name: "VxeTable",
  //       meta: {
  //         title: "Vxe Table",
  //         keepAlive: true
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: "/menu",
  //   component: Layout,
  //   redirect: "/menu/menu1",
  //   name: "Menu",
  //   meta: {
  //     title: "多级菜单",
  //     svgIcon: "menu"
  //   },
  //   children: [
  //     {
  //       path: "menu1",
  //       component: () => import("@/views/menu/menu1/index.vue"),
  //       redirect: "/menu/menu1/menu1-1",
  //       name: "Menu1",
  //       meta: {
  //         title: "menu1"
  //       },
  //       children: [
  //         {
  //           path: "menu1-1",
  //           component: () => import("@/views/menu/menu1/menu1-1/index.vue"),
  //           name: "Menu1-1",
  //           meta: {
  //             title: "menu1-1"
  //           }
  //         },
  //         {
  //           path: "menu1-2",
  //           component: () => import("@/views/menu/menu1/menu1-2/index.vue"),
  //           redirect: "/menu/menu1/menu1-2/menu1-2-1",
  //           name: "Menu1-2",
  //           meta: {
  //             title: "menu1-2"
  //           },
  //           children: [
  //             {
  //               path: "menu1-2-1",
  //               component: () => import("@/views/menu/menu1/menu1-2/menu1-2-1/index.vue"),
  //               name: "Menu1-2-1",
  //               meta: {
  //                 title: "menu1-2-1"
  //               }
  //             },
  //             {
  //               path: "menu1-2-2",
  //               component: () => import("@/views/menu/menu1/menu1-2/menu1-2-2/index.vue"),
  //               name: "Menu1-2-2",
  //               meta: {
  //                 title: "menu1-2-2"
  //               }
  //             }
  //           ]
  //         },
  //         {
  //           path: "menu1-3",
  //           component: () => import("@/views/menu/menu1/menu1-3/index.vue"),
  //           name: "Menu1-3",
  //           meta: {
  //             title: "menu1-3"
  //           }
  //         }
  //       ]
  //     },
  //     {
  //       path: "menu2",
  //       component: () => import("@/views/menu/menu2/index.vue"),
  //       name: "Menu2",
  //       meta: {
  //         title: "menu2"
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: "/hook-demo",
  //   component: Layout,
  //   redirect: "/hook-demo/use-fetch-select",
  //   name: "HookDemo",
  //   meta: {
  //     title: "hook 示例",
  //     elIcon: "Menu",
  //     alwaysShow: true
  //   },
  //   children: [
  //     {
  //       path: "use-fetch-select",
  //       component: () => import("@/views/hook-demo/use-fetch-select.vue"),
  //       name: "UseFetchSelect",
  //       meta: {
  //         title: "useFetchSelect"
  //       }
  //     },
  //     {
  //       path: "use-fullscreen-loading",
  //       component: () => import("@/views/hook-demo/use-fullscreen-loading.vue"),
  //       name: "UseFullscreenLoading",
  //       meta: {
  //         title: "useFullscreenLoading"
  //       }
  //     }
  //   ]
  // },
]

/**
 * 动态路由
 * 用来放置有权限 (Roles 属性) 的路由
 * 必须带有 Name 属性
 */
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: "/permission",
    component: Layout,
    redirect: "/permission/page",
    name: "Permission",
    meta: {
      title: "权限管理",
      svgIcon: "lock",
      roles: ["admin", "editor"], // 可以在根路由中设置角色
      alwaysShow: true // 将始终显示根菜单
    },
    children: [
      {
        path: "page",
        component: () => import("@/views/permission/page.vue"),
        name: "PagePermission",
        meta: {
          title: "页面权限",
          roles: ["admin"] // 或者在子导航中设置角色
        }
      },
      {
        path: "directive",
        component: () => import("@/views/permission/directive.vue"),
        name: "DirectivePermission",
        meta: {
          title: "指令权限" // 如果未设置角色，则表示：该页面不需要权限，但会继承根路由的角色
        }
      }
    ]
  },
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
