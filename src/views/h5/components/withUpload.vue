<template>
    <div>
        <van-nav-bar title="提现设置" left-arrow @click-left="onClickLeft">
        </van-nav-bar>
        <div class="mt-[80px]">
            <van-form @submit="onSubmit">
                <van-cell-group inset>
                    <van-cell title="当前状态" :value="statusObj[viewObj.status]" />
                    <van-field v-model="formData.full_name" name="姓名" label="姓名" placeholder="请填写姓名"
                        :rules="[{ required: true, message: '请填写姓名' }]" />
                    <van-field v-model="formData.phone_number" name="手机号" label="手机号" placeholder="请填写手机号"
                        :rules="[{ required: true, message: '请填写手机号' }, { validator: validator, message: '请填写正确的手机号' }]" />
                    <van-field name="uploader" label="收款码上传" :rules="[{ required: true, message: '请上传收款码' },]">
                        <template #input>
                            <van-uploader v-model="formData.imgList" :after-read="afterRead" max-count="1" />
                        </template>
                    </van-field>
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
import { state } from "../server/vuex.js";
import api from '../server/api.js';
import { showToast, showConfirmDialog } from 'vant';
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const $router = useRouter();

const isUpload = ref(false)

const statusObj = {
    'normal': '正常',
    'disabled': '禁用',
    'expired': '授权到期',
    'tobe_reviewed': '资料审核中',
    'reviewed_failed': '资料审核失败',
}

const formData = ref({
    phone_number: '',
    full_name: '',
    imgList: []
})

const viewObj = ref({
    status: 'normal'
})

const fileObj = ref();

onMounted(async () => {
    const res = await api.getInfo();
    if (res.errorCode == '') {
        viewObj.value.status = res.data.status;
        formData.value.phone_number = res.data.phone_number;
        formData.value.full_name = res.data.full_name;
        formData.value.imgList = [{ url: res.data?.payment?.qr_code }]
        if (res.data?.payment?.qr_code != '') {
            isUpload.value = true;
        }
    }
})

const onSubmit = async () => {
    let formdata = new FormData();
    if (fileObj.value) {
        formdata.append('qr_code', fileObj.value);
    }
    formdata.append('phone_number', formData.value.phone_number);
    formdata.append('full_name', formData.value.full_name);

    if (isUpload) {
        showConfirmDialog({
            title: '提示',
            message:
                '确认要修改提现收款码吗，修改后需要重新审核，可能影响您的提现进度。',
        })
            .then(async () => {
                const res = await api.updateInfo(formdata);
                if (res.errorCode == '') {
                    state.index = 1;
                    showToast('提交成功');
                    $router.push({
                        path: "/spreadH5"
                    })
                }
            })

    } else {
        const res = await api.updateInfo(formdata);
        if (res.errorCode == '') {
            state.index = 1;
            showToast('提交成功');
            $router.push({
                path: "/spreadH5"
            })
        }
    }


}


const afterRead = async (file) => {
    fileObj.value = file.file;
    console.log(fileObj.value);
}

const onClickLeft = () => {
    state.index = 1;
    $router.push({
        path: "/spreadH5"
    })
}

const validator = (val) => /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[0123456789])|(?:7[0-8])|(?:8[\d])|(?:9[0123456789]))\d{8}$/.test(val);


</script>