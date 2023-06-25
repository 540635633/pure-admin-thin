import { gym } from "@/router/enums";

export default {
  path: "/gym",
  name: "Gym日记",
  redirect: "/gym/action",
  meta: {
    title: "Gym日记",
    rank: gym
  },
  children: [
    {
      path: "/gym/template",
      name: "模板管理",
      component: () => import("@/views/gym/template/index.vue"),
      meta: {
        title: "模板管理"
      }
    },
    {
      path: "/gym/templateLog",
      name: "日记管理",
      component: () => import("@/views/gym/templateLog/index.vue"),
      meta: {
        title: "日记管理"
      }
    },
    {
      path: "/gym/action",
      name: "动作管理",
      component: () => import("@/views/gym/action/index.vue"),
      meta: {
        title: "动作管理"
      }
    }
  ]
} as RouteConfigsTable;
