<template>
    <div>
        <van-nav-bar title="订单信息" right-text="退出登录"  @click-right="onClickRight">

        </van-nav-bar>
        <div class="card1" v-for="item in orderList">
            <div class="card2">
                <div class="card3">
                    <div style="padding-bottom:10px;display: flex;justify-content: space-between;">
                        <span style="color: #969799">客户姓名</span>
                        <span class="title">{{item.post_name}}</span>
                    </div>
                    <div style="padding-bottom:10px;display: flex;justify-content: space-between;">
                        <span style="color: #969799">订单状态</span>
                        <span><van-tag type="primary" round>{{item.status}}</van-tag></span>
                    </div>
                    <div style="padding-bottom:10px;display: flex;justify-content: space-between;">
                        <span style="color: #969799">首充金额</span>
                        <span>{{item.first_money}}元</span>
                    </div>
                    <div style="display: flex;justify-content: space-between;">
                        <div style="color: #969799">下单时间</div>
                        <div>{{item.created_at}}</div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import api from "./server/api.js";
import { useRouter } from "vue-router";
import { ref, onMounted } from 'vue';

const $router = useRouter();
onMounted(() => {
    getOrder();
})

const onClickRight = () => {
localStorage.clear();
$router.push({
    path: "/login",
})
}

const searchObj = ref({
    search: '',
    goods_id: '',
    page: 1,
    page_size: 30
})

const orderList = ref([])

const getOrder = async () => {
    const res = await api.getOrder({
        ...searchObj
    })
    if (res.errorCode == '') {
        orderList.value = res?.data;
    }
    console.log(res);
}


</script>

<style lang="scss" scoped>
.card1 {
    box-sizing: border-box;
    // height: 100%;
    padding: 12px;

    .card2 {
        padding: 15px;
        background-color: #fff;
        border-radius: 10px;

        .card3 {
            position: relative;
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            width: 100%;
            // padding: var(--van-cell-vertical-padding) var(--van-cell-horizontal-padding);
            overflow: hidden;
            color: #323233;
            font-size: 14px;
            line-height: 24px;
            background: #fff;
        }
    }
}

.title {
    font-weight: bold;
}

.desc {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}
</style>