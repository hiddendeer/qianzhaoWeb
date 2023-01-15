<template>
    <div>
        <van-nav-bar :title="title" left-arrow @click-left="onClickLeft">

        </van-nav-bar>
        <van-dropdown-menu>
            <van-dropdown-item v-model="searchObj.has_completed" :options="option1" @change="dropChange" />
        </van-dropdown-menu>
        <div style="height: calc(100vh - 100px);overflow-y: scroll;" v-if="active == 0">
            <div class="card1" v-for="item in orderList">
                <div class="card2">
                    <div class="card3">
                        <div style="padding-bottom:10px;display: flex;justify-content: space-between;">
                            <span style="color: #969799">客户姓名</span>
                            <span class="title">{{ item.post_name }}</span>
                        </div>
                        <div style="padding-bottom:10px;display: flex;justify-content: space-between;">
                            <span style="color: #969799">订单状态</span>
                            <span><van-tag type="primary" round>{{ item.status }}</van-tag></span>
                        </div>
                        <div style="padding-bottom:10px;display: flex;justify-content: space-between;">
                            <span style="color: #969799">首充金额</span>
                            <span>{{ item.first_money }}元</span>
                        </div>
                        <div style="display: flex;justify-content: space-between;">
                            <div style="color: #969799">下单时间</div>
                            <div>{{ item.created_at }}</div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <div class="overflow-y-scroll" style="height: calc(100vh - 100px);" v-if="active == 1">
            <div class="mt-[15px] ml-[20px] text-[15px] font-bold">可提现金额</div>
            <div class="w-[80%] h-[80px] flex items-center justify-center text-[14px] text-[#E6A23C] font-bold">
                <span class="text-[20px]">{{ personInfo.money }}</span>&nbsp;元
            </div>
            <van-cell title="提现" value="每周五开放" is-link @click="clickCell" />
            <van-cell title="提现设置" is-link @click="jumpInfo('setting')" />
            <van-cell title="提现记录" is-link @click="jumpInfo" />
            <van-cell title="密码修改" is-link @click="jumpInfo" />

        </div>
    </div>
</template>

<script setup>
import api from "./server/api.js";
import { showConfirmDialog, showToast } from 'vant';
import { useRouter } from "vue-router";
import { ref, onMounted } from 'vue';

const $router = useRouter();

const option1 = [
    { text: '全部', value: 'all' },
    { text: '待审核', value: 'completed' },
    { text: '审核中', value: 'uncompleted' },
];

const active = ref(0);
const title = ref('订单信息');
const username = ref(localStorage.getItem('username'))
const personInfo = ref({})


onMounted(() => {
    getInfo();
    getOrder();
})

const onChange = (index) => {
    if (index == `0`) {
        title.value = '订单信息'
    }
    if (index == `1`) {
        title.value = '个人信息'
    }
}

const getInfo = async () => {
    const res = await api.getInfo();
    if (res.errorCode == '') {
        personInfo.value = res.data;
    }
    console.log(res);
}

const jumpInfo = (type) => {
    if (type == `setting`) {
        $router.push({
            path: "/spreadWithUpload"
        })
    }

}

const onClickLeft = () => {
    $router.push({
        path: "/spreadH5",
    })
}
const clickCell = () => {
    showConfirmDialog({
        title: '提现',
        message:
            '确认申请提现吗？',
    })
        .then(async () => {
            const res = await api.withdrawals();
            if (res.errorCode == '') {
                showToast('提交成功');
            } else {
                showToast(res.errorMessage);
            }
        })
        .catch(() => {
            // on cancel
        });
}

const searchObj = ref({
    search: '',
    goods_id: '',
    page: 1,
    page_size: 999,
    has_completed: 'all'
})

const orderList = ref([])

const getOrder = async () => {
    const res = await api.getOrder(searchObj.value)
    if (res.errorCode == '') {
        orderList.value = res?.data?.rows;
    }
}

const dropChange = (e) => {
    searchObj.value.has_completed = e;
    getOrder();
}


</script>

<style lang="scss" scoped>
body{
    overflow: hidden !important;
}
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