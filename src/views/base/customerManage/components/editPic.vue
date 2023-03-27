<template>
    <div>
        <el-dialog v-model="hasView" v-if="hasView" title="修改套餐图片" width="35%">
            <el-form ref="formRef" :model="formData" :rules="rules" class="" label-position="right" label-width="100px">
                <el-form-item label="商品图片" prop="des_picture">
                    <el-upload ref="refUpload" :class="{ hide: hideUpload }" v-model:file-list="fileList" action="#"
                        :http-request="HttpRequest" list-type="picture-card" :on-remove="handleRemove" :on-preview="handlePictureCardPreview"
                        :on-success="handleSucess" :before-upload="handleBefore" :limit="limit">
                        <el-icon>
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
            </el-form>
            <template #footer>
                <div>
                    <el-button type="primary" @click="submit">保存</el-button>
                </div>
            </template>
        </el-dialog>
        <el-dialog v-model="imgView.view.viewImg">
            <img  style="width: 100%;height: 100%;" :src="imgView.view.viewUrl" />
        </el-dialog>
    </div>
</template>

<script setup>
import api from "../server/api.js";
import { Plus } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { ref, reactive } from "vue";

const emits = defineEmits(['emitSubmit'])
const hasView = ref(false);
const cId = ref();

// 图片
const fileList = ref([]);
const limit = ref(1);
const imgView = reactive({
    view: {
        viewImg: false,
        viewUrl: "",
    },
});
const formRef = ref(null);

let formData = ref({
    des_picture: "",
});

const hideUpload = ref(false);

const rules = reactive({
    des_picture: [
        {
            required: true,
            message: "请上传图片",
            trigger: "blur",
        },
    ],
});

const open = (row) => {
    cId.value = row.id;
    fileList.value = [{ url: row.des_picture }];
    formData.value.des_picture = row.des_picture;
    hasView.value = true;
    hideUpload.value = true;
}

const submit = () => {
    formRef.value.validate(async (valid) => {
        if (valid) {
            const fData = new FormData();
            for (const item in formData.value) {
                fData.append(item, formData.value[item]);
            }
            const res = await api.updatePlanPic(fData, cId.value);
            if (res.errorCode == '') {
                emits('emitSubmit', 1)
                ElMessage.success("修改成功");
                hasView.value = false;
            }
            console.log(res)

        }
    })
    console.log(formData.value)
}

const handleSucess = (e) => {
    console.log(e);
};
const handleBefore = (e) => {
    console.log(e);
};

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

defineExpose({
    hasView,
    open
})


</script>

<style lang="scss" scoped>
.hide :deep(.el-upload--picture-card) {
    display: none;
}
</style>