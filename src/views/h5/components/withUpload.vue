<template>
    <div>
        <van-nav-bar title="提现设置" right-text="返回" @click-right="onClickRight">
        </van-nav-bar>
        <div class="mt-[80px]">
            <van-form @submit="onSubmit">
                <van-cell-group inset>
                    <van-cell title="当前状态" :value="statusObj[viewObj.status]" />
                    <van-field v-model="formData.phone_number" name="手机号" label="手机号" placeholder="请填写手机号"
                        :rules="[{ required: true, message: '请填写手机号' },{validator:validator,message: '请填写正确的手机号'}]" />
                    <van-field name="uploader" label="收款码上传" :rules="[{ required: true, message: '请上传收款码' },]" >
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
import api from '../server/api.js';
import { showToast } from 'vant';
import { ref, onMounted } from "vue";
import {useRouter} from "vue-router";

const $router = useRouter();

const statusObj = {
    'normal': '正常',
    'disabled': '禁用',
    'expired': '授权到期',
    'tobe_reviewed': '资料待审核',
    'reviewed_failed': '资料审核失败',
}

const formData = ref({
    phone_number: '',
    imgList: []
})

const viewObj = ref({
    status: 'normal'
})

const fileObj = ref();

onMounted(async () => {
    const res = await api.getInfo();
    if (res.errorCode=='') {
        viewObj.value.status = res.data.status;
        formData.value.phone_number = res.data.phone_number;
        formData.value.imgList = [{url: res.data?.payment?.qr_code}]
    }
})

const onSubmit = async() => {
    let formdata = new FormData();
    if (fileObj.value) {
        formdata.append('qr_code', fileObj.value);
    }
    formdata.append('phone_number', formData.value.phone_number);
    const res = await api.updateInfo(formdata);
    if (res.errorCode=='') {
        showToast('提交成功');
        $router.push({
            path: "/spreadH5"
        })
    }
}


const afterRead = async (file) => {
    fileObj.value = file.file;
    console.log(fileObj.value);
}

const onClickRight = () => {
    $router.push({
        path: "/spreadH5"
    })
}

const validator = (val) => /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[0123456789])|(?:7[0-8])|(?:8[\d])|(?:9[0123456789]))\d{8}$/.test(val);


</script>