<template>
    <div>
        <van-nav-bar title="海报" left-arrow  @click-left="onClickLeft">

</van-nav-bar>
        <img class="w-full" style="height: calc(100vh - 50px)"  src="@/assets/image/poster.jpg" alt="">
    </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const $router = useRouter();

const onClickLeft = () => {
    $router.push({
        path: "/spreadH5",
    })
}


</script>