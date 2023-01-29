<template>
  <common-page title="注册新账号">
    <!-- <el-steps :active="stepActive" simple finish-status="success">
		    <el-step title="基础信息" />
			<el-step title="详细信息" />
		    <el-step title="完成注册" />
		</el-steps> -->
    <el-form ref="stepForm_0" :model="form" :rules="rules" :label-width="120">
      <el-form-item label="昵称" prop="name">
        <el-input v-model="form.name" placeholder="请输入昵称"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone_number">
        <el-input
          v-model="form.phone_number"
          placeholder="请输入手机号"
        ></el-input>
      </el-form-item>
      <el-form-item label="登录账号" prop="login_name">
        <el-input
          v-model="form.login_name"
          placeholder="请输入登录账号"
        ></el-input>
        <div class="el-form-item-msg">登录账号将作为登录时的唯一凭证</div>
      </el-form-item>
      <el-form-item label="登录密码" prop="login_password">
        <el-input
          v-model="form.login_password"
          type="password"
          show-password
          placeholder="请输入登录密码"
        ></el-input>
        <sc-password-strength
          v-model="form.login_password"
        ></sc-password-strength>
        <div class="el-form-item-msg">请输入包含英文、数字的8位以上密码</div>
      </el-form-item>
      <el-form-item label="确认密码" prop="password2">
				<el-input v-model="form.password2" type="password" show-password placeholder="请再一次输入登录密码"></el-input>
			</el-form-item>

      <el-form-item label="代理商编码">
        <el-input
          v-model="form.distributor_domain"
          placeholder="请输入代理商编码"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item label="" prop="agree">
				<el-checkbox v-model="form.agree" label="">已阅读并同意</el-checkbox><span class="link" @click="showAgree=true">《平台服务协议》</span>
			</el-form-item> -->
    </el-form>
    <el-form style="text-align: center">
      <el-button type="primary" @click="save">注册</el-button>
    </el-form>
    <el-dialog
      v-model="showAgree"
      title="平台服务协议"
      :width="800"
      destroy-on-close
    >
      平台服务协议
      <template #footer>
        <el-button @click="showAgree = false">取消</el-button>
        <el-button
          type="primary"
          @click="
            showAgree = false;
            form.agree = true;
          "
          >我已阅读并同意</el-button
        >
      </template>
    </el-dialog>
  </common-page>
</template>

<script>
import { ElMessage } from "element-plus";
import api from "./server/api.js";
import scPasswordStrength from "@/components/scPasswordStrength";
import commonPage from "./components/commonPage";

export default {
  components: {
    commonPage,
    scPasswordStrength,
  },
  data() {
    return {
      stepActive: 0,
      showAgree: false,
      form: {
        login_name: "",
        login_password: "",
        password2: "",
        distributor_domain: "",
        name: "",
        phone_number: "",
      },
      rules: {
        login_name: [{ required: true, message: "请输入账号名" }],
        name: [{ required: true, message: "请输入昵称" }],
        phone_number: [
          { required: true, message: "请输入手机号" },
          { min: 11, max: 11, message: "请输入正确的手机号", trigger: "blur" },
        ],
        login_password: [
          { required: true, message: "请输入密码" },
          { min: 8, max: 16, message: "密码要求在8-16位", trigger: "blur" },
        ],
        password2: [
						{ required: true, message: '请再次输入密码'},
						{validator: (rule, value, callback) => {
							if (value !== this.form.login_password) {
								callback(new Error('两次输入密码不一致'));
							}else{
								callback();
							}
						}}
					],
      },
    };
  },
  mounted() {},
  methods: {
    pre() {
      this.stepActive -= 1;
    },
    next() {
      const formName = `stepForm_${this.stepActive}`;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.stepActive += 1;
        } else {
          return false;
        }
      });
    },
    save() {
      this.$refs["stepForm_0"].validate(async (valid) => {
        if (valid) {
          const res = await api.register(this.form);
          if (res.errorCode == "") {
            ElMessage.success("注册成功");
            this.$router.push({
              path: "/login",
            });
          } else {
            ElMessage.error(res.errorMessage);
          }
        } else {
          return false;
        }
      });
    },
    goLogin() {
      this.$router.push({
        path: "/login",
      });
    },
  },
};
</script>

<style scoped>
</style>
