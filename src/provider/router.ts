import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { MENU } from "./menu";
import NotFound from "../component/layout/NotFound.vue";

const routes: RouteRecordRaw[] = [];
for (const menuItem of MENU) {
  routes.push({
    path: menuItem.path,
    name: menuItem.name,
    component: menuItem.component,
    props: menuItem.componentProps,
    meta: {
      title: menuItem.metaTitle,
    },
  });
}
routes.push(
  {
    path: "/:pathMatch(.*)*",
    component: () => NotFound,
    meta: {
      title: "404 not found",
    },
  },
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
