<template>
    <div>
        <van-nav-bar title="海报" left-arrow @click-left="onClickLeft">
        </van-nav-bar>
        <div ref="canvasRef" id="canvasID">
            <img class="w-full canvasImg"  style="height: calc(100vh - 50px)" src="@/assets/image/poster.jpg"
                alt="">
            <scQrCode :text="text" :logo="logo" class="qrClass"></scQrCode>
        </div>
        <!-- <el-button @click="trigger">按钮</el-button> -->
    </div>
</template>

<script setup>
import api from "./server/api.js";
import logo from "@/assets/image/logo.png"
import scQrCode from "@/components/scQrCode/index.vue"
import html2canvas from 'html2canvas'
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
const $router = useRouter();

const canvasRef = ref(null)
const personInfo = ref({})
const text =ref('');

onMounted(() => {
    getInfo();
});

const getInfo = async () => {
    const res = await api.getInfo();
    if (res.errorCode == '') {
        text.value = 'http://'+res.data.domains[0]+'/h5/#/?pid='+res.data.uuid;
        personInfo.value = res.data;

    }
}

const trigger = () => {
    html2canvas(canvasRef.value, {
        useCORS: true, // 是否使用CORS从服务器加载图像 !!!
        allowTaint: true // 是否允许跨域图像污染画布  !!!
    }).then(canvas => {
        const url = canvas.toDataURL('image/jpg');
        console.log(url);
    })
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
    .qrClass{
        position: absolute;
        top: 52vh;
        left: 10vh;
        z-index: 999;
    }
</style>