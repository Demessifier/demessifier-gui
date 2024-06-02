import {
  createRouter,
  createWebHistory,
  Router,
  RouteRecordRaw,
} from "vue-router";
import type { MenuItem } from "./menu-example";
import NotFound from "../component/layout/NotFound.vue";

export function getRouterForMenu(
  menu: MenuItem[],
  useDefault404: boolean = true,
): Router {
  const routes: RouteRecordRaw[] = [];
  for (const menuItem of menu) {
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
  if (useDefault404) {
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
  }
  const router = createRouter({
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

  return router;
}
