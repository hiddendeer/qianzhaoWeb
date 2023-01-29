<template>
    <div>
        <van-nav-bar title="提现记录" left-arrow @click-left="onClickLeft"> </van-nav-bar>
        <div>
            <div class="card1" v-for="item in list">
                <div class="card2">
                    <div class="card3">
                        <div style="
                    padding-bottom: 10px;
                    display: flex;
                    justify-content: space-between;
                  ">
                            <span style="color: #969799">昵称</span>
                            <span class="title">{{ item?.owner_info?.name }}</span>
                        </div>
                        <div style="
                    padding-bottom: 5px;
                    display: flex;
                    justify-content: space-between;
                  ">
                            <span style="color: #969799">订单状态</span>
                            <span><van-tag type="primary" round>{{
                                statusObj[item?.status]
                            }}</van-tag></span>
                        </div>
                        <div style="
                    padding-bottom: 10px;
                    display: flex;
                    justify-content: space-between;
                  ">
                            <span style="color: #969799">提现金额</span>
                            <span>{{ item?.money }}元</span>
                        </div>
                        <div style="display: flex; justify-content: space-between">
                            <div style="color: #969799">提现时间</div>
                            <div>{{ item?.created_at }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { state } from "./server/vuex.js";
import api from "./server/api.js";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const $router = useRouter();

const list = ref([]);

const statusObj = {
    unpaid: '未打款',
    paid: '已打款',
    reject: '已驳回',
}

onMounted(async () => {
    const res = await api.withdrawalsRecord();
    list.value = res.data;

})

const onClickLeft = () => {
    state.index = 1;
    $router.push({
        path: "/spreadH5",
    })
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
</style>