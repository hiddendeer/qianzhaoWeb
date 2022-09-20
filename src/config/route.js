// 静态路由配置
// 书写格式与动态路由格式一致，全部经由框架统一转换
// 比较动态路由在meta中多加入了role角色权限，为数组类型。一个菜单是否有权限显示，取决于它以及后代菜单是否有权限。
// routes 显示在左侧菜单中的路由(显示顺序在动态路由之前)
// 示例如下

const routes = [
	// {
	// 	name: "demo",
	// 	path: "/demo",
	// 	meta: {
	// 		icon: "el-icon-eleme-filled",
	// 		title: "演示",
	// 		role: ["SA"]
	// 	},
	// 	children: [{
	// 		name: "demopage",
	// 		path: "/demopage",
	// 		component: "test/autocode/index",
	// 		meta: {
	// 			icon: "el-icon-menu",
	// 			title: "演示页面",
	// 			role: ["SA"]
	// 		}
	// 	}]
	// }
    {
        name: "base",
        path: "/base",
        meta: {
            title: "基础业务",
            icon: "el-icon-eleme-filled",
            type: "menu"
        },
        children: [
            {
                path: "/base/plan",
                name: "plan",
                meta: {
                    title: "套餐管理",
                    icon: "el-icon-document-add",
                    type: "menu"
                },
                component: "base/plan/index"
            },
            {
                path: "/base/order",
                name: "order",
                meta: {
                    title: "订单管理",
                    icon: "el-icon-document-copy",
                    type: "menu"
                },
                component: "base/order/index"
            },
            {
                path: "/base/proxyManage",
                name: "proxyManage",
                meta: {
                    title: "代理商管理",
                    icon: "el-icon-document-copy",
                    type: "menu"
                },
                component: "base/proxyManage/index"
            }
        ]
    }
]

// const routes = []

export default routes;