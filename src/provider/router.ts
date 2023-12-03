import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { MENU } from "./menu";

const routes: RouteRecordRaw[] = [];
for (const menuItem of MENU) {
  routes.push({
    path: menuItem.path,
    name: menuItem.name,
    component: menuItem.component,
    meta: {
      title: menuItem.metaTitle,
    },
  });
}
routes.push(
  {
    path: "/:pathMatch(.*)*",
    component: () => import("../component/layout/NotFound.vue"),
    meta: {
      title: "404 not found",
    },
  }
  // {
  //   path: "/:pathMatch(.*)*",
  //   redirect: clientPaths._404,
  // }
);

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: (to) =>
    to.hash
      ? { el: to.hash, behavior: "smooth" }
      : { top: 0, left: 0, behavior: "smooth" },
});

router.beforeEach((to, _, next) => {
  document.title = `Vue App ${to.meta.title ?? ""}`;
  next();
});
