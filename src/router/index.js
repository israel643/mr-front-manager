import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { storeToRefs } from "pinia";
import { RoleType } from "@/constants/roleType";

// Layouts
import CleanLayout from "@/layouts/CleanLayout.vue";
import AppLayout from "@/layouts/AppLayout.vue";
// Páginas públicas
import Login from "@/views/Login.vue";
// Vistas protegidas (autenticadas)
const Dashboard = () => import("@/views/Dashboard.vue");
const Entry = () => import("@/views/Entry.vue");
const Output = () => import("@/views/Output.vue");
const Movement = () => import("@/views/Movement.vue");
const Article = () => import("@/views/Article.vue");
const Provider = () => import("@/views/Provider.vue");
const Measurement = () => import("@/views/Measurement.vue");
const Brand = () => import("@/views/Brand.vue");
const Category = () => import("@/views/Category.vue");
const User = () => import("@/views/User.vue");

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      component: CleanLayout,
      meta: { requiresAuth: false },
      children: [
        {
          path: "",
          name: "login",
          component: Login,
        },
      ],
    },
    {
      path: "/",
      component: AppLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: "dashboard",
          name: "dashboard",
          component: Dashboard,
          meta: { roles: [RoleType.ADMIN] },
        },
        {
          path: "articles",
          name: "articles",
          component: Article,
          meta: { roles: [RoleType.ADMIN, RoleType.ALMACENISTA] },
        },
        {
          path: "categories",
          name: "categories",
          component: Category,
          meta: { roles: [RoleType.ADMIN] },
        },
        {
          path: "brands",
          name: "brands",
          component: Brand,
          meta: { roles: [RoleType.ADMIN] },
        },
        {
          path: "measurement",
          name: "measurement",
          component: Measurement,
          meta: { roles: [RoleType.ADMIN] },
        },
        {
          path: "movements",
          name: "movements",
          component: Movement,
          meta: { roles: [RoleType.ADMIN, RoleType.ALMACENISTA] },
        },
        {
          path: "providers",
          name: "providers",
          component: Provider,
          meta: { roles: [RoleType.ADMIN, RoleType.ALMACENISTA] },
        },
        {
          path: "outputs",
          name: "outputs",
          component: Output,
          meta: { roles: [RoleType.ADMIN, RoleType.ALMACENISTA] },
        },
        {
          path: "entries",
          name: "entries",
          component: Entry,
          meta: { roles: [RoleType.ADMIN, RoleType.ALMACENISTA] },
        },
        {
          path: "users",
          name: "users",
          component: User,
          meta: { roles: [RoleType.ADMIN] },
        },
        // Redirección por defecto
        { path: "", redirect: { name: "articles" } },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/dashboard",
    },
  ],
});

// Middleware de navegación
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const { user } = storeToRefs(authStore);

  if (!user.value) {
    try {
      await authStore.fetchUser(); // usa el nuevo método controlado
    } catch (e) {
      // Silenciosamente falla, y user seguirá null
    }
  }

  // Redirige a login si requiere autenticación y no hay usuario
  if (to.meta.requiresAuth && !user.value) return next("/login");

  // Si está autenticado y va a /login, redirige según el rol
  if (to.path === "/login" && user.value) {
    const roleId = user.value.role?.id;

    if (roleId === RoleType.ADMIN) return next("/dashboard");
    if (roleId === RoleType.ALMACENISTA) return next("/articles");

    return next("/dashboard");
  }

  // Validar permisos por rol si está autenticado
  if (to.meta.roles && user.value) {
    const userRole = user.value.role?.id;
    const allowedRoles = to.meta.roles;

    if (!allowedRoles.includes(userRole)) {
      console.warn("Acceso denegado por rol:", userRole);
      return next("/articles"); // o a una ruta tipo 403
    }
  }

  return next();
});

export default router;
