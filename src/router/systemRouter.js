import config from "@/config"

//系统路由
const routes = [
	{
		name: "layout",
		path: "/",
		component: () => import(/* webpackChunkName: "layout" */ '@/layout'),
		redirect: config.DASHBOARD_URL || '/base/plan',
		children: []

	},
	{
		path: "/login",
		component: () => import(/* webpackChunkName: "login" */ '@/views/login'),
		meta: {
			title: "登录"
		}
	},
	{
		path: "/user_register",
		component: () => import(/* webpackChunkName: "userRegister" */ '@/views/login/userRegister'),
		meta: {
			title: "注册"
		}
	},
	{
		path: "/register",
		component: () => import(/* webpackChunkName: "userRegister" */ '@/views/login/register'),
		meta: {
			title: "注册"
		}
	},
	{
		path: "/reset_password",
		component: () => import(/* webpackChunkName: "resetPassword" */ '@/views/login/resetPassword'),
		meta: {
			title: "重置密码"
		}
	},
	{
		path: "/user",
		component: () => import(/* webpackChunkName: "resetPassword" */ '@/views/user/index'),
		meta: {
			title: "重置密码"
		}
	},
	{
		path: "/ceshi",
		component: () => import(/* webpackChunkName: "resetPassword" */ '@/views/user/ceshi'),
		meta: {
			title: "重置密码"
		}
	}
]

export default routes;
