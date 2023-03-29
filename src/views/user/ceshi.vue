<template>
    <div>
        <div class="w-full h-[100vh] pt-[100px] relative" @click="iframeClick" style="z-index: 999;">
            iframe
        </div>
        <div class=" absolute top-0 w-full h-[100vh]" @click="dataClick" style="z-index: 111;">
            我是数据大屏
        </div>
    </div>
</template>

<script setup>
const dataClick = () => {
    console.log(11);
}
const iframeClick = () => {
    console.log(22);
}
</script>

<style lang="scss" scoped></style>