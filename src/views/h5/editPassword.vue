<template>
  <div>
    <van-nav-bar title="修改密码" left-arrow @click-left="onClickLeft"> </van-nav-bar>
    <div class="mt-[80px]">
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field v-model="formData.login_password" name="新密码" label="新密码" placeholder="请填写新密码" :rules="[
            { required: true, message: '请填写密码' },
            { validator: validator, message: '密码少于8位或超出16位' },
          ]" />
          <van-field v-model="formData.login_password2" name="确认密码" label="确认密码" placeholder="请确认密码" :rules="[
            { required: true, message: '请确认密码' },
            { validator: validator, message: '两次密码不一致' },
          ]" />
        </van-cell-group>

        <div class="mt-[30px] mx-[30px]">
          <van-button round block type="primary" native-type="submit">
            提交
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script setup>
import { state } from "./server/vuex.js";
import api from "./server/api.js";
import { showToast } from "vant";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const $router = useRouter();

const formData = ref({
  login_password: "",
  login_password2: "",
});
const personInfo = ref({});

const roles = ref(localStorage.getItem("role"))

onMounted(() => {
  if (roles.value == `salesman`) {
    getSalesInfo();
  } else {
    getInfo();
  }
})

const getInfo = async () => {
  const res = await api.getInfo();
  if (res.errorCode == '') {
    personInfo.value = res.data;
  }
}

const getSalesInfo = async () => {
  const res = await api.getSalesInfo();
  if (res.errorCode == '') {
    personInfo.value = res.data;
  }
}


const onSubmit = async () => {
  let res;
  if (roles.value == `salesman`) {
    res = await api.updateSalesPassword(formData.value, personInfo.value?.uuid);

  } else {
    res = await api.updatePassword(formData.value, personInfo.value?.uuid);

  }
  if (res?.errorCode == "") {
    showToast("修改成功");
    $router.push({
      path: "/login",
    })
    localStorage.clear();
  } else {
    showToast(res.errorMessage);
  }
};


const onClickLeft = () => {
  state.index = 1;
  $router.push({
    path: "/spreadH5",
  })
}

const validator = (val) => {
  if (formData.value.login_password != val) {
    return false;
  }

  return true;
};
</script>