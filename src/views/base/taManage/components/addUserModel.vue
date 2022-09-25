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
        <el-form-item label="代理商名称" prop="name">
          <el-input v-model="formData.name" placeholder="输入代理商名称" />
        </el-form-item>
        <el-form-item
          v-for="(item, index) in formData.comArray"
          :key="index"
          :prop="`comArray.${index}.url`"
          :rules="[
            { required: true, message: '代理商域名不能为空', trigger: 'blur' },
          ]"
          label="代理商域名"
        >
          <el-input v-model="item.url" placeholder="输入代理商域名">
            <template #append v-if="index > 0">
              <span @click="delDomain(index)">删除</span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button @click="addUrl" :icon="Plus" type="primary"
            >增加域名</el-button
          >
        </el-form-item>

        <el-form-item label="是否总代" prop="is_root">
          <el-select
            v-model="formData.is_root"
            placeholder="选择状态"
            style="width: 100%"
          >
            <el-option
              v-for="item in shopOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="平台登录账号" prop="login_name">
          <el-input
            v-model="formData.login_name"
            placeholder="输入平台登录名称"
          />
        </el-form-item>
        <el-form-item label="平台登录密码" prop="login_password">
          <el-input
            v-model="formData.login_password"
            placeholder="输入平台登录名称"
          />
        </el-form-item>
        <el-form-item label="联系方式" prop="phone_number">
          <el-input
            v-model="formData.phone_number"
            placeholder="忘记密码时用"
          />
        </el-form-item>
      </el-form>
      <div style="display: flex; justify-content: end">
        <el-button @click="hasView = false" type="danger" text>取消</el-button>
        <el-button @click="submit" type="success" text>提交</el-button>
      </div>
    </el-dialog>
  </div>
  <el-dialog v-model="imgView.view.viewImg">
    <img w-full :src="imgView.view.viewUrl" />
  </el-dialog>
</template>

<script  setup>
import api from "../server/api.js";
import { ElMessage } from "element-plus";
import { ref, reactive, onMounted, watch } from "vue";
import { Plus } from "@element-plus/icons-vue";
import { isString } from "@vue/shared";

const emit = defineEmits(["emitAddMenu"]);
const hideUpload = ref(false);
const hasView = ref(false);
const title = ref("添加代理商");
const formRef = ref(null);
const refUpload = ref(null);
const limit = ref(1);
const treeList = ref([]);
const comArray = ref([
  {
    url: "",
  },
]);
const imgView = reactive({
  view: {
    viewImg: false,
    viewUrl: "",
  },
});

const shopOption = ref([
  { label: "是", value: "yes" },
  { label: "否", value: "no" },
]);

let formData = ref({
  name: "",
  is_root: "no",
  login_name: "",
  login_password: "",
  phone_number: "",
  domains: [],
  comArray: [
    {
      url: "",
    },
  ],
});

const rules = reactive({
  name: [
    {
      required: true,
      type: "string",
      message: "请输入名称",
      trigger: "blur",
    },
  ],
  login_name: [
    {
      required: true,
      type: "string",
      message: "请输入平台登录账号",
      trigger: "blur",
    },
  ],
  login_password: [
    {
      required: true,
      type: "string",
      message: "请输入平台登录密码",
      trigger: "blur",
    },
  ],
  phone_number: [
    {
      required: true,
      message: "请输入联系方式",
      trigger: "blur",
    },
  ],
});

onMounted(async () => {});

const handleSucess = (e) => {
  console.log(e);
};
const handleBefore = (e) => {
  console.log(e);
};

const submit = async () => {
  formRef.value.validate(async (valid) => {
    if (formData.value.comArray[0].url == "") {
      ElMessage.error("代理商域名不能为空");
      return;
    }

    const qq = formData.value.comArray.map((item) => item.url);
    formData.value.domains = qq;

    if (valid) {
      if (title.value == "修改代理商") {
      } else {
        delete formData.value.comArray;
        const res = await api.addProxy(formData.value);
        if (res.errorCode == "") {
          ElMessage({
            type: "success",
            message: "添加成功",
          });
        } else {
          ElMessage({
            type: "danger",
            message: res.errorMessage,
          });
        }
      }
      hasView.value = false;
      emit("emitAddMenu");
    }
  });
};

// 图片
const fileList = ref([]);

const handleRemove = (uploadFile, uploadFiles) => {
  hideUpload.value = false;
  formData.value.des_picture = "";
};

const handlePictureCardPreview = (uploadFile) => {
  imgView.view.viewUrl = uploadFile.url;
  imgView.view.viewImg = true;
};

const HttpRequest = (data) => {
  formData.value.des_picture = data.file;
  hideUpload.value = fileList.value.length >= limit.value;
};

const delDomain = (index) => {
  comArray.value.splice(index, 1);
};

// 关闭处理一些问题
const closeDialog = () => {
  formData.value = {
    name: "",
    goods_id: "",
    price: "0",
    des_content: "",
    status: "outline",
    des_picture: "",
    type: "",
  };
  fileList.value = [];
  hideUpload.value = false;
};

const addUrl = () => {
  formData.value.comArray.push({
    url: "",
  });
};

defineExpose({
  hasView,
  title,
  formData,
  fileList,
  hideUpload,
});
</script>

<style scoped lang="scss">
.hide :deep(.el-upload--picture-card) {
  display: none;
}
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
:deep(.avatar-uploader .el-upload) {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
.card {
  max-width: 100vw;
  width: 33%;
  min-height: 36vh;
}

:deep(.el-form-item__content) {
  align-items: unset;
}

:deep(.el-input-group__append) {
  background-color: #f56c6c;
  color: #fff;
  cursor: pointer;
}

.el-select {
  --el-select-input-focus-border-color: #fff;
}

// :deep(.el-input__wrapper) {
//   box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color))
//     inset;
//   border-bottom-width: 1px;
//   border-color: -var(--el-border-color); //边框的颜色
//   cursor: default;
//   .el-input__inner {
//     cursor: default !important;
//   }
// }
</style>

