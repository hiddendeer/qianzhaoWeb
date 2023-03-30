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
        class=""
        label-position="right"
        label-width="100px"
      >
      <template v-if="title==`编辑` || title==`添加`">
   
        <el-form-item label="昵称" prop="first_name">
          <el-input v-model="formData.first_name" placeholder="输入昵称" />
        </el-form-item>
        <el-form-item label="账号名称" prop="username">
          <el-input v-model="formData.username" placeholder="输入账号" />
        </el-form-item>
        <el-form-item  v-if="title!==`编辑`" label="密码" prop="password">
          <el-input v-model="formData.password" type="password" placeholder="输入密码" />
        </el-form-item>
      </template>

      <template v-if="title==`修改密码`">
          <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" placeholder="输入密码" />
        </el-form-item>
      </template>

      </el-form>
      <div  style="display: flex;justify-content: end;">
        <el-button @click="closeDialog" type="danger" text>取消</el-button>
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
const title = ref("创建");
const formRef = ref(null);
const refUpload = ref(null);
const limit = ref(1);
const treeList = ref([]);
const imgView = reactive({
  view: {
    viewImg: false,
    viewUrl: "",
  },
});

const shopOption = ref([
  { label: "草稿", value: "outline" },
  { label: "上架", value: "on_shelf" },
  { label: "下架", value: "off_shelf" },
]);
const typeOption = ref([
  { label: "普通套餐", value: "common" },
  { label: "k计划套餐", value: "kplan" },
]);

let formData = ref({

});

const rules = reactive({
  first_name: [
    {
      required: true,
      type: "string",
      message: "请输入昵称",
      trigger: "blur",
    },
  ],
  username: [
    {
      required: true,
      type: "string",
      message: "请输入账号名称",
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      type: "string",
      message: "请输入密码",
      trigger: "blur",
    },
  ],
});

onMounted(() => {});

const handleSucess = (e) => {
  console.log(e);
};
const handleBefore = (e) => {
  console.log(e);
};

const submit = async () => {
  formRef.value.validate(async (valid) => {

    if (valid) {
      if (title.value == "编辑") {
        delete formData.value?.password
        const res = await api.edit(formData.value, formData.value?.id);
        if (res.errorCode == "") {
          ElMessage.success("修改成功");
          hasView.value = false;
        } else {
          ElMessage.error(res.message);
        }
      } else if(title.value == `修改密码`) {
        delete formData.value?.username;
        const res = await api.edit(formData.value, formData.value?.id);
        if (res.errorCode == "") {
          ElMessage.success("修改成功");
          hasView.value = false;
        } else {
          ElMessage.error(res.message);
        }
      }
      else {
        const res = await api.customerCaresAdd.post(formData.value);
        if (res.errorCode == "") {
          ElMessage.success("添加成功");
          hasView.value = false;
        } else {
          ElMessage.error(res.message);
        }
      }
      closeDialog();
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

// 关闭处理一些问题
const closeDialog = () => {
  formData.value = {
    username: "",
    password: "",
  };
  hasView.value = false
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

