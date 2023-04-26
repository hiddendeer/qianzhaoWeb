<template>
    <div>
        <van-nav-bar title="专属海报" left-arrow @click-left="onClickLeft">
        </van-nav-bar>
        <div v-loading="loading" element-loading-text="生成专属海报...">
            <div v-if="viewUrl == ``" ref="canvasRef" id="canvasID">
                <img class="w-full canvasImg" style="height: calc(100vh - 50px)" src="@/assets/image/poster.jpg" alt="">
                <scQrCode :text="text" :logo="logo" class="qrClass"></scQrCode>
            </div>
            <div v-else>
                <img class="w-full" style="height: calc(100vh - 50px)" :src="viewUrl" alt="">
            </div>
        </div>
        <!-- <el-button @click="trigger">按钮</el-button> -->
    </div>
</template>

<script setup>
import api from "./server/api.js";
import logo from "@/assets/image/inLogo1.png"
import scQrCode from "@/components/scQrCode/index.vue"
import html2canvas from 'html2canvas'
import { ref, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
const $router = useRouter();

const canvasRef = ref(null)
const personInfo = ref({})
const text = ref('');
const viewUrl = ref('');
const loading = ref(false);
const roles = ref(localStorage.getItem("role"))

onMounted(() => {
    if (roles.value == `salesman`) {
        getSalesInfo();
    }else {
        getInfo();
    }
});

const getInfo = async () => {
    loading.value = true;
    const res = await api.getInfo();
    if (res.errorCode == '') {
        text.value = 'http://' + res.data.domains[0] + '/h5/#/?pid=' + res.data.uuid;
        personInfo.value = res.data;
        trigger()
    }
}
const getSalesInfo = async () => {
    loading.value = true;
    const res = await api.getSalesInfo();
    if (res.errorCode == '') {
        text.value = 'http://' + res.data.domains[0] + '/h5/#/?pid=' + res.data.uuid;
        personInfo.value = res.data;
        trigger()
    }
}

const trigger = () => {
    setTimeout(() => {
        html2canvas(canvasRef.value, {
            useCORS: true, // 是否使用CORS从服务器加载图像 !!!
            allowTaint: true // 是否允许跨域图像污染画布  !!!
        }).then(canvas => {
            const url = canvas.toDataURL('image/jpg');
            viewUrl.value = url;
            loading.value = false;
            // console.log(url);
        })
    }, 1500)

}

const onClickLeft = () => {
    $router.push({
        path: "/spreadH5",
    })
}


</script>

<style lang="scss">
.canvasImg {
    z-index: -10;
}

.qrClass {
    position: absolute;
    top: 48vh;
    left: 20vh;
    z-index: 999;
}
</style>