<template>
	<el-form ref="loginForm" :model="form" :rules="rules" label-width="0" size="large">
		<el-form-item prop="phone">
			<el-input v-model="form.phone" prefix-icon="el-icon-iphone" clearable
				:placeholder="$t('login.mobilePlaceholder')">
				<template #prepend>+86</template>
			</el-input>
		</el-form-item>
		<el-form-item prop="captcha" style="margin-bottom: 35px;">
			<div class="login-msg-yzm">
				<el-input v-model="form.captcha" prefix-icon="el-icon-unlock" clearable maxlength="6"
					:placeholder="$t('login.smsPlaceholder')"></el-input>
				<el-button @click="getYzm" :disabled="disabled">{{ this.$t('login.smsGet') }}<span v-if="disabled">
						({{ time }})</span></el-button>
			</div>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" style="width: 100%;" :loading="islogin" round @click="login">{{ $t('login.signIn')
			}}</el-button>
		</el-form-item>
		<!-- <div class="login-reg">
			{{ $t('login.noAccount') }} <router-link to="/user_register">{{ $t('login.createAccount') }}</router-link>
		</div> -->
	</el-form>
</template>

<script>
import api from "../server/api.js";
export default {
	data() {
		return {
			form: {
				phone: "",
				captcha: "",
			},
			rules: {
				phone: [
					{ required: true, message: this.$t('login.mobileError') },
					{ pattern: /^(?:13\d|14\d|15\d|16\d|17\d|18\d|19\d)\d{5}(\d{3}|\*{3})$/, message: '请输入正确的手机号', trigger: 'blur' }
				],
				captcha: [
					{ required: true, message: this.$t('login.smsError') }
				]
			},
			disabled: false,
			time: 0,
			islogin: false,
		}
	},
	mounted() {

	},
	methods: {
		async getYzm() {
			var validate = await this.$refs.loginForm.validateField("phone").catch(() => { })
			if (!validate) { return false }
			const res = await api.sendCaptcha({ postNumber: this.form.phone })
			if (res?.errorCode == '') {
				this.$message.success('已发送短信')
			} else {
				this.$message.error('短信发送失败')
			}

			this.disabled = true
			this.time = 60
			var t = setInterval(() => {
				this.time -= 1
				if (this.time < 1) {
					clearInterval(t)
					this.disabled = false
					this.time = 0
				}
			}, 1000)
		},
		async login() {
			var validate = await this.$refs.loginForm.validate().catch(() => { })
			if (!validate) { return false }
			this.islogin = true;
			const user = await api.getToken({ phone: this.form.phone, captcha: this.form.captcha, login_type: 'SMS_CAPTCHA' })
			if (user?.errorCode == '') {
				localStorage.setItem('TOKEN', user.data.token)
				localStorage.setItem('role', user?.data?.user?.role)
				localStorage.setItem('domains', JSON.stringify(user?.data?.user?.domains))
				localStorage.setItem('username', user?.data?.user?.username)
				localStorage.removeItem('reload');
			} else {
				this.$message.error(user?.errorMessage);
				this.islogin = false;
				return;
			}
			if (user?.data?.user?.role == 'promoter') {
				this.$router.push({
					path: "/spreadH5",
				});
			} else if (user?.data?.user?.role == 'treasurer') {
				this.$router.push({
					path: "/base/with",
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
		}
	}
}
</script>

<style></style>
