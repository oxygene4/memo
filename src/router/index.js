import Vue from "vue";
import VueRouter from "vue-router";
import NoteList from "../pages/NoteList";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "list",
      component: NoteList
    },
    {
      path: "/note/:id",
      name: "note",
      component: () => import("../pages/EditNote")
    },
    {
      path: "*",
      redirect: "/"
    }
  ]
});

export default router;
