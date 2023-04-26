// 静态路由配置
// 书写格式与动态路由格式一致，全部经由框架统一转换
// 比较动态路由在meta中多加入了role角色权限，为数组类型。一个菜单是否有权限显示，取决于它以及后代菜单是否有权限。
// routes 显示在左侧菜单中的路由(显示顺序在动态路由之前)
// 示例如下

let routes = [
    {
        name: "base",
        path: "/base",
        meta: {
            title: "基础业务",
            icon: "el-icon-notebook",
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
                path: "/pay/index",
                name: "pay",
                meta: {
                    title: "充值管理",
                    icon: "el-icon-shopping-cart",
                    type: "menu"
                },
                component: "pay/index"
            },




        ]
    },
    // {
    //     name: "account",
    //     path: "/account",
    //     meta: {
    //         title: "账号管理",
    //         icon: "el-icon-shopping-cart",
    //         type: "menu"
    //     },
    //     children: [
    //         {
    //             path: "/treasurerAccount/index",
    //             name: "account",
    //             meta: {
    //                 title: "财务账号管理",
    //                 icon: "el-icon-money",
    //                 type: "menu"
    //             },
    //             component: "base/treasurerAccount/index"
    //         },
    //         {
    //             path: "/customer_care/index",
    //             name: "customer_care",
    //             meta: {
    //                 title: "客服账号管理",
    //                 icon: "el-icon-phone",
    //                 type: "menu"
    //             },
    //             component: "base/customerManage/index"
    //         },
    //     ]
    // },

]

if (['distributor', 'admin'].includes(localStorage.getItem('role'))) {
    let spread = {
        name: "spread",
        path: "/spread",
        meta: {
            title: "推广人",
            icon: "el-icon-notebook",
            type: "menu"
        },
        children: [
            {
                path: "/base/spread",
                name: "spread",
                meta: {
                    title: "推广管理",
                    icon: "el-icon-share",
                    type: "menu"
                },
                component: "base/spread/index"
            },
            {
                path: "/base/sales",
                name: "sales",
                meta: {
                    title: "销售管理",
                    icon: "el-icon-document-checked",
                    type: "menu"
                },
                component: "base/salesman/index"
            },
        ]
    }

    if (['admin'].includes(localStorage.getItem('role'))) {
        spread.children.push(
            {
                path: "/base/with",
                name: "with",
                meta: {
                    title: "提现管理",
                    icon: "el-icon-sugar",
                    type: "menu"
                },
                component: "base/withdrawals/index"
            }
        )
        spread.children.push(
            {
                path: "/base/examine",
                name: "examine",
                meta: {
                    title: "资料审核管理",
                    icon: "el-icon-DocumentCopy",
                    type: "menu"
                },
                component: "base/examine/index"
            },
        )

        let accountObj = {
            name: "account",
            path: "/account",
            meta: {
                title: "账号管理",
                icon: "el-icon-shopping-cart",
                type: "menu"
            },
            children: [
                {
                    path: "/treasurerAccount/index",
                    name: "account",
                    meta: {
                        title: "财务账号管理",
                        icon: "el-icon-money",
                        type: "menu"
                    },
                    component: "base/treasurerAccount/index"
                },
                {
                    path: "/customer_care/index",
                    name: "customer_care",
                    meta: {
                        title: "客服账号管理",
                        icon: "el-icon-phone",
                        type: "menu"
                    },
                    component: "base/customerManage/index"
                },
            ]
        };
    routes.push(accountObj);


    }

    routes.push(spread);
}

routes.push(
    {
        name: "spreadH5",
        path: "/spreadH5",
        meta: {
            title: "推广人",
            icon: "el-icon-notebook",
            hidden: true,
            fullpage: true
        },
        component: "h5/index"

    },
    {
        name: "spreadIndex",
        path: "/spreadIndex",
        meta: {
            title: "推广人",
            icon: "el-icon-notebook",
            hidden: true,
            fullpage: true
        },
        component: "h5/spreadIndex"

    },
    {
        name: "spreadWithUpload",
        path: "/spreadWithUpload",
        meta: {
            title: "推广人",
            icon: "el-icon-notebook",
            hidden: true,
            fullpage: true
        },
        component: "h5/components/withUpload"

    },
    {
        name: "spreadPoster",
        path: "/spreadPoster",
        meta: {
            title: "推广人",
            icon: "el-icon-notebook",
            hidden: true,
            fullpage: true
        },
        component: "h5/poster"

    },
    {
        name: "spreadPassword",
        path: "/spreadPassword",
        meta: {
            title: "推广人",
            icon: "el-icon-notebook",
            hidden: true,
            fullpage: true
        },
        component: "h5/editPassword"

    },
    {
        name: "spreadRecord",
        path: "/spreadRecord",
        meta: {
            title: "推广人",
            icon: "el-icon-notebook",
            hidden: true,
            fullpage: true
        },
        component: "h5/withRecord"

    },
)

// if (localStorage.getItem('role') == 'promoter') {
//     console.log('pop');
//     routes.push(
//         {
//             name: "spreadH5",
//             path: "/spreadH5",
//             meta: {
//                 title: "推广人",
//                 icon: "el-icon-notebook",
//                 hidden: true,
//                 fullpage: true
//             },
//             component: "h5/spreadIndex"

//         }
//     )
// }

if (localStorage.getItem('role') == 'admin') {
    routes.push(
        {
            name: "proxyManage",
            path: "/proxyManage",
            meta: {
                title: "代理管理",
                icon: "el-icon-cpu",
                type: "menu"
            },
            children: [
                {
                    path: "/base/proxyManage",
                    name: "proxyManage",
                    meta: {
                        title: "代理商管理",
                        icon: "el-icon-document-copy",
                        type: "menu"
                    },
                    component: "base/proxyManage/index"
                },
                {
                    path: "/base/planConfig",
                    name: "planConfig",
                    meta: {
                        title: "套餐配置",
                        icon: "el-icon-document-add",
                        type: "menu"
                    },
                    component: "base/planConfig/index"
                },
                {
                    path: "/base/orderConfig",
                    name: "orderConfig",
                    meta: {
                        title: "订单管理",
                        icon: "el-icon-document-copy",
                        type: "menu"
                    },
                    component: "base/orderConfig/index"
                },
                {
                    path: "/base/customer",
                    name: "customer",
                    meta: {
                        title: "商机管理",
                        icon: "el-icon-document-copy",
                        type: "menu"
                    },
                    component: "base/customer/index"
                },
                {
                    path: "/base/contact",
                    name: "contact",
                    meta: {
                        title: "触点管理",
                        icon: "el-icon-pointer",
                        type: "menu"
                    },
                    component: "base/contactManage/index"
                }
            ]
        }
    );
    routes.push(
        {
            name: "extra",
            path: "/extra",
            meta: {
                title: "扩展功能",
                icon: "el-icon-cpu",
                type: "menu"
            },
            children: [
                {
                    path: "/extra/taOrder",
                    name: "taOrder",
                    meta: {
                        title: "推啊订单",
                        icon: "el-icon-document-copy",
                        type: "menu"
                    },
                    component: "base/taManage/index"
                }
            ]

        }
    )
}

// 财务角色
if (['treasurer'].includes(localStorage.getItem('role'))) {
    routes = [];
    let spread = {
        name: "spread ",
        path: "/spread ",
        meta: {
            title: "推广人",
            icon: "el-icon-notebook",
            type: "menu"
        },
        children: [
            {
                path: "/base/orderConfig",
                name: "orderConfig",
                meta: {
                    title: "订单管理",
                    icon: "el-icon-document-copy",
                    type: "menu"
                },
                component: "base/orderConfig/index"
            },
            {
                path: "/base/with",
                name: "with",
                meta: {
                    title: "提现管理",
                    icon: "el-icon-sugar",
                    type: "menu"
                },
                component: "base/withdrawals/index"
            },
            {
                path: "/base/examine",
                name: "examine",
                meta: {
                    title: "审核资料管理",
                    icon: "el-icon-DocumentCopy",
                    type: "menu"
                },
                component: "base/examine/index"
            },

        ]
    }
    routes.push(spread)
}

if (['customer_care'].includes(localStorage.getItem('role'))) {
    routes = [];
    let spread = {
        name: "base",
        path: "/base",
        meta: {
            title: "基础业务",
            icon: "el-icon-notebook",
            type: "menu"
        },
        children: [
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
                path: "/pay/index",
                name: "pay",
                meta: {
                    title: "充值管理",
                    icon: "el-icon-shopping-cart",
                    type: "menu"
                },
                component: "pay/index"
            },
        ]

    }
    routes.push(spread);
}
console.log(routes, 'routes');

export default routes;
