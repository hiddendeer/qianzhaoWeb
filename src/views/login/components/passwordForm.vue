<template>
  <el-form ref="loginForm" :model="form" :rules="rules" label-width="0" size="large" @keyup.enter="login">
    <el-form-item prop="user">
      <el-input v-model="form.user" prefix-icon="el-icon-user" clearable :placeholder="$t('login.userPlaceholder')">
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="form.password" prefix-icon="el-icon-lock" clearable show-password
        :placeholder="$t('login.PWPlaceholder')"></el-input>
    </el-form-item>
    <el-form-item style="margin-bottom: 20px">
      <!-- <el-col :span="12">
        <el-checkbox
          :label="$t('login.rememberMe')"
          v-model="form.autologin"
        ></el-checkbox>
      </el-col> -->
      <!-- <el-col :span="12" class="login-forgot">
        <router-link to="/reset_password"
          >{{ $t("login.forgetPassword") }}？</router-link
        >
      </el-col> -->
    </el-form-item>
    <el-form-item>
      <el-button type="primary" style="width: 100%" :loading="islogin" round @click="login">{{ $t("login.signIn") }}
      </el-button>
    </el-form-item>
    <el-form-item>
      <div @click="jumpR" class="w-full flex justify-center cursor-pointer text-[#409EFF]">推广人注册</div>
    </el-form-item>
    <!-- <div class="login-reg">
      {{ $t("login.noAccount") }}
      <router-link to="/user_register">{{
        $t("login.createAccount")
      }}</router-link>
    </div> -->
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      userType: "admin",
      form: {
        user: "",
        password: "",
        autologin: false,
      },
      rules: {
        user: [
          {
            required: true,
            message: this.$t("login.userError"),
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: this.$t("login.PWError"),
            trigger: "blur",
          },
        ],
      },
      islogin: false,
    };
  },
  watch: {
    userType(val) {
      if (val == "admin") {
        this.form.user = "admin";
        this.form.password = "admin";
      } else if (val == "user") {
        this.form.user = "user";
        this.form.password = "user";
      }
    },
  },
  mounted() {
    localStorage.clear();
  },
  methods: {
    async login() {
      var validate = await this.$refs.loginForm.validate().catch(() => { });
      if (!validate) {
        return false;
      }

      this.islogin = true;
      var data = {
        username: this.form.user,
        password: this.form.password,
        // password: this.$TOOL.crypto.MD5(this.form.password)
      };
      //获取token
      var user = await this.$API.auth.token.post(data);
      if (user.errorCode == '') {
        // this.$TOOL.cookie.set("TOKEN", user.data.token, {
        //   expires: this.form.autologin ? 24 * 60 * 60 : 0,
        // });
        localStorage.setItem('TOKEN', user.data.token)
        localStorage.setItem('role', user?.data?.user?.role)
        localStorage.setItem('domains', JSON.stringify(user?.data?.user?.domains))
        localStorage.setItem('username', user?.data?.user?.username)
        localStorage.removeItem('reload');
        // this.$TOOL.data.set("USER_INFO", user.data.userInfo);
      } else {
        this.islogin = false;
        this.$message.warning(user.errorMessage);
        return false;
      }
      //获取菜单
      // var menu = null;
      // if (this.form.user == "super") {
      //   menu = await this.$API.system.menu.myMenus.get();
      // } else {
      //   menu = await this.$API.demo.menu.get();
      // }
      // if (menu.data.menu.length == 0) {
      //   this.islogin = false;
      //   this.$alert(
      //     "当前用户无任何菜单权限，请联系系统管理员",
      //     "无权限访问",
      //     {
      //       type: "error",
      //       center: true,
      //     }
      //   );
      //   return false;
      // }
      // this.$TOOL.data.set("MENU", menu.data.menu);
      // this.$TOOL.data.set("MENU", routeParams);
      // localStorage.setItem("MENU", JSON.stringify({content: routeParams}))
      // this.$TOOL.data.set("PERMISSIONS", menu.data.permissions);
      if (['promoter','salesman'].includes(user?.data?.user?.role)) {
        this.$router.push({
          path: "/spreadH5",
        });
      } else if (user?.data?.user?.role == 'treasurer') {
        this.$router.push({
          path: "/base/with",
        });
      }
      else if (user?.data?.user?.role == 'customer_care') {
        this.$router.push({
          path: "/base/order",
        });
      }
      else {
        this.$router.replace({
          path: "/base/plan",
        });
      }
      setTimeout(() => {
        this.$router.go(0)
      }, 1000)
      this.$message.success("欢迎登录");
      this.islogin = false;
    },
    jumpR() {
      this.$router.replace({
        path: "/register",
      });
    }
  },
};
</script>

<style></style>
