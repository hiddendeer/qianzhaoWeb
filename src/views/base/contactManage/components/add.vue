<template>
  <el-dialog
    :title="title"
    v-model="showDialog"
    @close="closeDialog"
    :close-on-click-modal="false"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-position="left"
      label-width="150px"
    >
      <el-form-item label="触点名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="触点应用编码(ID)" prop="app_code">
        <el-input v-model="formData.app_code" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="触点发展人编码" prop="dev_code">
        <el-input v-model="formData.dev_code" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="触点负责人姓名" prop="owner_name">
        <el-input v-model="formData.owner_name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="触点负责人手机号" prop="owner_phone">
        <el-input v-model="formData.owner_phone" placeholder="请输入" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="showDialog = false">取消</el-button>
      <el-button type="primary" @click="submitData">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import api from "../server/api.js";
import { nextTick, reactive, ref } from "vue";
import { ElMessage } from "element-plus";

const emits = defineEmits(["success"]);

const formRef = ref(null);
const showDialog = ref(false);

const title = ref("新增");
const titleObj = { add: "新增", edit: "编辑" };

const formData = ref({});

const rules = reactive({
  name: [
    {
      required: true,
      type: "string",
      message: "请输入",
      trigger: "blur",
    },
  ],
  app_code: [
    {
      required: true,
      type: "string",
      message: "请输入",
      trigger: "blur",
    },
  ],
  dev_code: [
    {
      required: true,
      type: "string",
      message: "请输入",
      trigger: "blur",
    },
  ],
  owner_name: [
    {
      required: true,
      type: "string",
      message: "请输入",
      trigger: "blur",
    },
  ],
  owner_phone: [
    {
      required: true,
      type: "string",
      message: "请输入",
      trigger: "blur",
    },
  ],
});

const open = (type, row) => {
  title.value = titleObj[type];
  if (row) {
    nextTick(() => {
      formData.value = row;
    });
  }

  showDialog.value = true;
};

const submitData = async () => {
  console.log(formData.value);
  formRef.value.validate(async (valid) => {
    if (title.value == "新增") {
      const res = await api.postData(formData.value);
      if (res.errorCode == "") {
        ElMessage.success("新增成功");
        showDialog.value = false;
        emits("success");
      } else {
        ElMessage.error(res.message);
      }
    } else {
      const res = await api.patchData(formData.value?.uuid,formData.value);
      if (res.errorCode == "") {
        ElMessage.success("修改成功");
        showDialog.value = false;
        emits("success");
      } else {
        ElMessage.error(res.errorMessage);
      }
    }
  });
};

const closeDialog = () => {
  showDialog.value = false;
};

defineExpose({
  open,
});
</script>
