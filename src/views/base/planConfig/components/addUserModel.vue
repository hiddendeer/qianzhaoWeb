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
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="formData.name" placeholder="输入商品名称" />
        </el-form-item>
        <el-form-item label="商品ID" prop="goods_id">
          <el-input v-model="formData.goods_id" placeholder="输入商品ID" />
        </el-form-item>
        <el-form-item label="产品ID" prop="base_product_id">
          <el-input
            v-model="formData.base_product_id"
            placeholder="输入产品ID"
          />
        </el-form-item>
        <el-form-item label="商品图片" prop="des_picture">
          <el-upload
            ref="refUpload"
            :class="{ hide: hideUpload }"
            v-model:file-list="fileList"
            action="#"
            :http-request="HttpRequest"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleSucess"
            :before-upload="handleBefore"
            :limit="limit"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品说明" prop="des_content">
          <el-input
            v-model="formData.des_content"
            :rows="2"
            type="textarea"
            placeholder="输入商品说明"
          />
        </el-form-item>
        <el-form-item label="销售价格" prop="price">
          <el-input
            v-model="formData.price"
            type="number"
            placeholder="输入销售价格(元)"
          />
        </el-form-item>
        <el-form-item label="套餐类型" prop="type">
          <el-select
            v-model="formData.type"
            placeholder="选择套餐类型"
            style="width: 100%"
          >
            <el-option
              v-for="item in typeOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="formData.status"
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
      </el-form>
      <div  style="display: flex;justify-content: end;">
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
const title = ref("添加套餐");
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
  name: "",
  goods_id: "",
  base_product_id: "",
  price: "0",
  des_content: "",
  status: "outline",
  des_picture: "",
  type: "",
});

const rules = reactive({
  name: [
    {
      required: true,
      type: "string",
      message: "请输入商品名称",
      trigger: "blur",
    },
  ],
  goods_id: [
    {
      required: true,
      type: "string",
      message: "请输入商品ID",
      trigger: "blur",
    },
  ],
  base_product_id: [
    {
      required: true,
      type: "string",
      message: "请输入产品ID",
      trigger: "blur",
    },
  ],
  price: [
    {
      required: true,
      message: "请输入商品价格",
      trigger: "blur",
    },
  ],
  des_content: [
    {
      required: true,
      message: "请输入商品说明",
      trigger: "blur",
    },
  ],
  des_picture: [
    {
      required: true,
      message: "请上传商品图片",
      trigger: "blur",
    },
  ],
  type: [
    {
      required: true,
      message: "请选择套餐类型",
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
    const fData = new FormData();

    if (valid) {
      if (title.value == "修改套餐") {
        if (
          isString(formData.value?.des_picture) &&
          formData.value?.des_picture.indexOf("http") > -1
        ) {
          delete formData.value.des_picture;
        }
        for (const item in formData.value) {
          fData.append(item, formData.value[item]);
        }
        const res = await api.edit(fData, formData.value?.id);
        if (res.errorCode == "") {
          ElMessage.success("修改成功");
          hasView.value = false;
        } else {
          ElMessage.error(res.message);
        }
      } else {
        for (const item in formData.value) {
          fData.append(item, formData.value[item]);
        }
        const res = await api.add.post(fData);
        if (res.errorCode == "") {
          ElMessage.success("添加成功");
          hasView.value = false;
        } else {
          ElMessage.error(res.message);
        }
      }
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

