<template>
    <header class="adminui-header">
      <div class="adminui-header-left">
        <div class="logo-bar">
          <img class="logo" src="img/logo.png">
          <span>{{ $CONFIG.APP_NAME }}</span>
        </div>
      </div>
      <div class="adminui-header-right">
        <userbar></userbar>
      </div>
    </header>
    <section class="aminui-wrapper">
      <div
        class="asidemenu"
        v-if="!ismobile"
        :class="menuIsCollapse ? 'aminui-side isCollapse' : 'aminui-side'"
      >
        <div class="adminui-side-scroll">
          <el-scrollbar>
            <el-menu
              :default-active="active"
              router
              :collapse="menuIsCollapse"
              :unique-opened="$CONFIG.MENU_UNIQUE_OPENED"
            >
              <NavMenu :navMenus="menu"></NavMenu>
            </el-menu>
          </el-scrollbar>
        </div>
      </div>
      <Side-m v-if="ismobile"></Side-m>
      <div class="aminui-body el-container">
        <Topbar v-if="!ismobile">
          <template #actions>
            <div class="pr-[20px]" v-if="showBack">
              <el-button @click="triggerBack">返回</el-button>
            </div>
          </template>
        </Topbar>
        <div class="adminui-main" id="adminui-main">
          <router-view v-slot="{ Component }">
            <keep-alive
              :include="[
                this.$store.state.keepAlive.keepLiveRoute,
                'hiddenAudit',
              ]"
            >
              <component
                :is="Component"
                :key="$route.fullPath"
                v-if="$store.state.keepAlive.routeShow"
              />
            </keep-alive>
          </router-view>
          <iframe-view></iframe-view>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  import SideM from "./sideM.vue";
  import Topbar from "./topbar.vue";
  import Tags from "./tags.vue";
  import NavMenu from "./NavMenu.vue";
  import userbar from "./userbar.vue";
  import setting from "./setting.vue";
  import iframeView from "./iframeView.vue";
  
  export default {
    name: "index",
    components: {
      SideM,
      Topbar,
      Tags,
      NavMenu,
      userbar,
      setting,
      iframeView,
    },
    data() {
      return {
        settingDialog: false,
        menu: [],
        nextMenu: [],
        pmenu: {},
        active: "",
      };
    },
    computed: {
      ismobile() {
        return this.$store.state.global.ismobile;
      },
      layout() {
        return this.$store.state.global.layout;
      },
      layoutTags() {
        return this.$store.state.global.layoutTags;
      },
      menuIsCollapse() {
        return this.$store.state.global.menuIsCollapse;
      },
      showBack() {
        return this.$store.state.global.showBack;
      },
    },
    created() {
      this.onLayoutResize();
      window.addEventListener("resize", this.onLayoutResize);
      var menu = this.$router.sc_getMenu();
      this.menu = this.filterUrl(menu);
      this.showThis();
    },
    mounted() {},
    watch: {
      $route() {
        this.showThis();
      },
      layout: {
        handler(val) {
          document.body.setAttribute("data-layout", val);
        },
        immediate: true,
      },
    },
    methods: {
      openSetting() {
        this.settingDialog = true;
      },
      onLayoutResize() {
        this.$store.commit("SET_ismobile", document.body.clientWidth < 1200);
      },
      triggerBack() {
        this.$router.go(-1);
      },
      //路由监听高亮
      showThis() {
        this.pmenu = this.$route.meta.breadcrumb
          ? this.$route.meta.breadcrumb[0]
          : {};
        this.nextMenu = this.filterUrl(this.pmenu.children);
        this.$nextTick(() => {
          this.active = this.$route.meta.active || this.$route.fullPath;
        });
      },
      //点击显示
      showMenu(route) {
        this.pmenu = route;
        this.nextMenu = this.filterUrl(route.children);
        if ((!route.children || route.children.length == 0) && route.component) {
          this.$router.push({ path: route.path });
        }
      },
      //转换外部链接的路由
      filterUrl(map) {
        var newMap = [];
        map &&
          map.forEach((item) => {
            item.meta = item.meta ? item.meta : {};
            //处理隐藏
            if (item.meta.hidden || item.meta.type == "button") {
              return false;
            }
            //处理http
            if (item.meta.type == "iframe") {
              item.path = `/i/${item.name}`;
            }
            //递归循环
            if (item.children && item.children.length > 0) {
              item.children = this.filterUrl(item.children);
            }
            newMap.push(item);
          });
        return newMap;
      },
      //退出最大化
      exitMaximize() {
        document.getElementById("app").classList.remove("main-maximize");
      },
    },
  };
  </script>
  <style lang="scss" scoped>
  $maxermargin: 24px;
  $maxerheight: 72px;
  $maxerwidth: 284px;
  
  $minnermargin: 16px;
  $minnerheight: 64px;
  $minnerwidth: 216px;
  $ItemActiveColor: #e5e7eb;
  
  @media (max-width: 2400px) {
    .aminui-wrapper {
      padding-right: $maxermargin;
    }
  
    .asidemenu {
      margin: $maxermargin;
      width: $maxerwidth;
    }
  
    .adminui-header {
      height: $maxerheight;
      display: flex;
      align-items: center;
  
      .adminui-header-left {
        height: $maxermargin;
        padding: 0 $maxermargin;
      }
  
      .adminui-header-right {
        height: $maxermargin;
        padding: 0 $maxermargin;
      }
    }
  
    .aminui-body.el-container {
      height: calc(100vh - 96px);
      max-height: calc(100vh - 96px);
    }
  
    .aminui-body {
      padding-top: $maxermargin;
    }
  }
  
  @media (max-width: 1440px) {
    .aminui-wrapper {
      padding-right: $minnermargin;
    }
  
    .asidemenu {
      margin: $minnermargin;
      width: $minnerwidth;
    }
  
    .adminui-header {
      height: $minnerheight;
      display: flex;
      align-items: center;
  
      .adminui-header-left {
        height: $minnermargin;
        padding: 0 $minnermargin;
      }
  
      .adminui-header-right {
        height: $minnermargin;
        padding: 0 $minnermargin;
      }
    }
  
    .aminui-body.el-container {
      height: calc(100vh - 80px);
      max-height: calc(100vh - 80px);
    }
  
    .aminui-body {
      padding-top: $minnermargin;
    }
  }
  
  .asidemenu {
    border-radius: 8px;
  //   background-image: linear-gradient(
  //     to bottom,
  //     rgba($color: #c0d9fc, $alpha: 0.5) 0%,
  //     rgba($color: #fff, $alpha: 1) 100%
  //   );
  }
  :deep(.adminui-side-scroll) {border-radius: 6px;}
  :deep(.el-menu-item:hover) {background: $ItemActiveColor !important;color: none !important;}
  :deep(.el-sub-menu__title:hover) {background: $ItemActiveColor !important;color: none !important;}
  </style>
  