<template>
  <div>
    <van-nav-bar :title="title" >
    </van-nav-bar>

    <div style="height: calc(100vh - 100px); overflow-y: scroll" v-if="active == 0">
      <van-swipe class="my-swipe" indicator-color="white">
        <van-swipe-item @click="jumpPoster">
          <img class="w-full h-[150px]" src="https://qztele-1251945399.cos.ap-nanjing.myqcloud.com/qztele/banner29%E5%85%83%E8%B7%B3%E8%BD%AC%E5%9B%BE.jpg" alt="" />
        </van-swipe-item>
      </van-swipe>

      <div class="mt-[15px] px-[10px] min-h-[260px]">
        <div class="font-bold text-[14px] p-[5px]">订单信息</div>
        <div>
          <div class="card1" v-for="item in orderList">
            <div class="card2">
              <div class="card3">
                <div style="
                    padding-bottom: 10px;
                    display: flex;
                    justify-content: space-between;
                  ">
                  <span style="color: #969799">客户信息</span>
                  <span class="title">{{ item?.post_name }} / {{ item?.post_number }}</span>
                </div>
                <div style="
                    padding-bottom: 10px;
                    display: flex;
                    justify-content: space-between;
                  ">
                  <span style="color: #969799">订购号码</span>
                  <span class="title">{{ item?.number }}</span>
                </div>
                <div style="
                    padding-bottom: 5px;
                    display: flex;
                    justify-content: space-between;
                  ">
                  <span style="color: #969799">订单状态</span>
                  <span><van-tag type="primary" round>{{
                    item?.status
                  }}</van-tag></span>
                </div>
                <div style="
                    padding-bottom: 10px;
                    display: flex;
                    justify-content: space-between;
                  ">
                  <span style="color: #969799">首充金额</span>
                  <span>{{ item?.first_money || 0 }}元</span>
                </div>
                <div style="display: flex; justify-content: space-between">
                  <div style="color: #969799">下单时间</div>
                  <div>{{ item?.created_at }}</div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="orderList.length > 0" class="flex justify-center text-[14px] text-[#1989FA]" @click="jumpOrder">
            查看全部订单
          </div>
        </div>
      </div>
    </div>
    <div class="overflow-y-scroll" style="height: calc(100vh - 200px)" v-if="active == 1">
      <div class="personBg">
        <div v-if="!['salesman'].includes(roles)" class="pt-[15px] ml-[20px] text-[15px] font-bold">可提现金额</div>
        <div  class="
          w-[100%]
          h-[80px]
          flex
          items-center
          justify-center
          text-[14px] text-[#E6A23C]
          font-bold
        ">
          <span v-if="!['salesman'].includes(roles)" class="text-[30px]">{{ personInfo.money }}&nbsp;元</span>
        </div>
      </div>
      <van-cell v-if="!['salesman'].includes(roles)" title="提现" value="每周五开放" is-link @click="clickCell" />
      <van-cell v-if="!['salesman'].includes(roles)" title="提现设置" :value="withIng" is-link @click="jumpInfo('setting')" />
      <van-cell v-if="!['salesman'].includes(roles)" title="提现记录" is-link @click="jumpInfo('record')" />
      <van-cell title="密码修改" is-link @click="jumpInfo('password')" />
      <van-cell title="退出登录" is-link @click="jumpInfo('loginout')" />
    </div>
    <van-tabbar v-model="active" @change="onChange">
      <van-tabbar-item icon="home-o">主页</van-tabbar-item>
      <van-tabbar-item icon="friends-o">个人中心</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { state } from "./server/vuex.js";
import api from "./server/api.js";
import { showConfirmDialog, showToast } from "vant";
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";

const $router = useRouter();

const roles = ref(localStorage.getItem("role"));

const current = ref(0);
const withIng = ref("")
const items = [
  {
    background: "#09BE4F",
  },
  {
    background: "#FFB703",
  },
  {
    background: "#B2B2B2",
  },
];

const active = ref(0);
const title = ref("订单信息");
const username = ref(localStorage.getItem("username"));
const personInfo = ref({});

onMounted(() => {
  getInfo();
  getOrder();
  active.value = state.index;
});

const onChange = (index) => {
  if (index == `0`) {
    title.value = "订单信息";
  }
  if (index == `1`) {
    title.value = "个人信息";
  }
};

const getInfo = async () => {
  const res = await api.getInfo();
  if (res.errorCode == "") {
    personInfo.value = res.data;
    if (personInfo.value.status =='tobe_reviewed') {
    withIng.value = '资料审核中'

    }
  }
  console.log(res);
};

const jumpInfo = (type) => {
  if (type == `setting`) {
    $router.push({
      path: "/spreadWithUpload",
    });
  }
  if (type == `password`) {
    $router.push({
      path: "/spreadPassword",
    });
  }
  if (type == `record`) {
    $router.push({
      path: "/spreadRecord",
    });
  }
  if (type == `loginout`) {
    localStorage.clear();
    $router.push({
      path: "/login",
    });
  }
};


const clickCell = () => {
  // const week = new Date().getDay();
  // if (week != '5') {
  //   showToast("今天不是周五哦");
  //   return;
  // }
  showConfirmDialog({
    title: "提现",
    message: "确认申请提现吗？",
  })
    .then(async () => {
      const res = await api.withdrawals();
      if (res.errorCode == "") {
        showToast("提交成功");
        getInfo();
      } else {
        showToast(res.errorMessage);
      }
    })
    .catch(() => {
      // on cancel
    });
};

const searchObj = ref({
  search: "",
  goods_id: "",
  page: 1,
  page_size: 2,
});

const orderList = ref([]);

const getOrder = async () => {
  const res = await api.getOrder({
    ...searchObj.value,
  });
  if (res.errorCode == "") {
    orderList.value = res?.data.rows;
  }
};

const jumpOrder = () => {
  $router.push({
    path: "/spreadIndex",
  });
};
const jumpPoster = () => {
  $router.push({
    path: "/spreadPoster",
  });
};
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

.my-swipe .van-swipe-item {
  color: #fff;
  font-size: 20px;
  //   line-height: 150px;
  text-align: center;
  //   background-color: #39a9ed;
}

.personBg {
  // background-image: linear-gradient(to bottom, #a7bcdc, #8da8d4, #7395cc, #5981c4, #3c6ebb);
  // background-image: linear-gradient(to bottom, #a7bcdc, #91acd6, #7a9bcf, #648bc9, #4c7bc2);
  background-image: linear-gradient(to bottom, #a7bcdc 0%, #2e6be0 80%);
}
</style>