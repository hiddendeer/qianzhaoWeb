<template>
  <div>
    <el-dialog
      v-model="hasView"
      v-if="hasView"
      @close="closeDialog"
      :title="title"
      width="35%"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-position="right"
        label-width="120px"
      >
        <el-form-item label="推广人名称" prop="name">
          <el-input v-model="formData.name" placeholder="输入推广人名称" />
        </el-form-item>
        <el-form-item label="登录账号" prop="login_name">
          <el-input v-model="formData.login_name" placeholder="输入登录账号" />
        </el-form-item>
        <el-form-item label="登录密码" prop="login_password">
          <el-input
            v-model="formData.login_password"
            placeholder="输入登录密码"
          />
        </el-form-item>
        <el-form-item label="手机号" prop="phone_number">
          <el-input v-model="formData.phone_number" placeholder="输入手机号" />
        </el-form-item>
        <el-form-item label="分成金额" prop="commission">
          <el-input-number v-model="formData.commission" :min="0" :max="70"  />
        </el-form-item>
      </el-form>
      <div style="display: flex; justify-content: end">
        <el-button @click="hasView = false" type="danger" text>取消</el-button>
        <el-button @click="submit" type="success" text>提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import api from "../server/api.js";
import { ElMessage } from "element-plus";
import { reactive, ref, nextTick } from "vue";
const hasView = ref(false);
const formRef = ref(null);
const title = ref("添加");
const emit = defineEmits(['getList'])

const formData = ref({
    name: '',
    login_name: '',
    login_password: '',
    phone_number: '',
    commission: 0,
});

const rules = reactive({
  name: [
    {
      required: true,
      type: "string",
      message: "请输入",
      trigger: "blur",
    },
  ],
  login_name: [
    {
      required: true,
      type: "string",
      message: "请输入",
      trigger: "blur",
    },
  ],
  login_password: [
    {
      required: true,
      type: "string",
      message: "请输入",
      trigger: "blur",
    },
  ],
  phone_number: [
    {
      required: true,
      type: "string",
      message: "请输入",
      trigger: "blur",
    },
  ],
  commission: [
    {
      required: true,
      type: "number",
      message: "请输入",
      trigger: "blur",
    },
  ],
});

const submit = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      if (title.value == '添加') {
        const res = await api.addPromoters(formData.value);
        if (res.errorCode == '') {
            ElMessage.success('添加成功');
            emit('getList')
            hasView.value = false;
        } else {
          if (res.errorMessage instanceof Object) {
            ElMessage.error('添加失败');
          } else {
            ElMessage.error(res.errorMessage);

          }
        }

      } else {
        const res = await api.patchPromoters(formData.value?.uuid, formData.value);
        if (res.errorCode == '') {
            ElMessage.success('编辑成功');
            emit('getList')
            hasView.value = false;
        } else {
          if (res.errorMessage instanceof Object) {
            ElMessage.error('添加失败');
          } else {
            ElMessage.error(res.errorMessage);
          }
        }
      }

    }
  });
};

const closeDialog = () => {};

const open = (type,row={}) => {
  hasView.value = true;
  if (type == 'add') {
    title.value = '添加'
  } else {
    title.value = '编辑'
    nextTick(()=> {
    formData.value = row;
  })
  }

  console.log(row);
}

defineExpose({
    hasView,
    open
})
</script>