<template>
  <el-dialog
    v-model="Visible"
    title="导出订单"
    :close-on-click-modal="false"
    @close="close"
  >
    <template v-if="hasSuccess">
      <div style="margin: 15px 0; display: flex; justify-content: flex-end">
        <el-button type="success" icon="el-icon-plus" text @click="getTaskOrder"
          >重新导出</el-button
        >
      </div>
      <el-main>
        <div style="display: flex; justify-content: center">
          <el-progress
            type="circle"
            :percentage="percentage"
            :status="percentageStatus"
          />
        </div>
      </el-main>
    </template>
    <template v-else>
      <el-container>
        <el-header style="justify-content: flex-end">
          <el-button
            type="success"
            icon="el-icon-upload"
            text
            @click="getTaskOrder"
            >开始导出订单</el-button
          >
        </el-header>
        <el-main>
          <div style="display: flex; justify-content: center">
            <el-progress
              type="circle"
              :percentage="percentage"
              :status="percentageStatus"
            >
                  <!-- <template #default="{ percentage }">
        <div style="padding-bottom: 10px;">{{ percentage }}%</div>
        <div class="percentage-label">Progressing</div>
      </template> -->
            </el-progress>
          </div>
        </el-main>
      </el-container>
    </template>
  </el-dialog>
</template>

<script setup>
import api from "../server/newapi.js";
import { ElMessage } from "element-plus";
import { ref, onMounted, reactive } from "vue";
const Visible = ref(false);
const hasSuccess = ref(false);
const percentageStatus = ref("");
const percentage = ref(0);
let timer = ref(null);
const taskId = ref("d0ab8af2-c057-4d1b-b718-204de08e65af");

const emits = defineEmits(["refresh"]);

const uploadUrl = window.location.origin + "/api/thirdOrders/createTask";
const table = reactive({
  successTable: [],
  successTotal: 0,
  errorTable: [],
  errorTotal: 0,
  page: 1,
  page2: 1,
  page_size: 15,
});

const createParams = ref({})

const extraClick = (searchForm) => {
  Visible.value = true;
  createParams.value = searchForm;
  handleTask();
};

const currentChange1 = (e) => {
  table.page = e;
  getTaskOrder();
};
const currentChange2 = (e) => {
  table.page2 = e;
  getTaskOrder();
};

onMounted(async () => {});

const handleTask = async () => {
  const res = await api.getTask();

  if (res.data && ![0, 100].includes(res.data.progress)) {
    hasSuccess.value = false;
    handleSuccess();
  }
};

const refreshUpload = () => {
  hasSuccess.value = false;
  percentage.value = 0;
  percentageStatus.value = "";
};

const getTask = async () => {
  const res = await api.getTask();
  if (res.data && res.data.progress == "100" && res.data.file_url != "") {
    let a = document.createElement("a");
    a.href = res.data.file_url;
    a.download = "导出订单.xlsx";
    a.click();
    percentageStatus.value = "success";
    // getTaskOrder(taskId.value);
    clearInterval(timer.value);
    clearTimeout();
    emits("refresh");
    setTimeout(() => {
      hasSuccess.value = true;
    }, 1000);
  }

  if (res.data && res.data.progress) {
    percentage.value = parseInt(res.data.progress);
    console.log(percentage.value);
  }
};

// 下载
const getTaskOrder = async () => {
    percentage.value = 0;
  percentageStatus.value = "";
  console.log(createParams.value,22);
  const successRes = await api.taskOrder(createParams.value);
  if (successRes.errorCode == "") {
    percentage.value = parseInt(successRes.data.progress);
    timer.value = setInterval(() => {
      setTimeout(() => {
        getTask();
      }, 0);
    }, 1000);
  } else {
  ElMessage({
    type: "danger",
    message: successRes?.errorMessage,
  });
  }
};

const tabClick = (e) => {
  console.log(e.index, "33");
};

const handleError = (e) => {
  ElMessage({
    type: "danger",
    message: "上传失败",
  });
};
const handleSuccess = (e) => {

  timer.value = setInterval(() => {
    setTimeout(() => {
      getTask();
    }, 0);
  }, 2000);
};

const close = () => {
  hasSuccess.value = false;
  percentage.value = 0;
  percentageStatus.value = "";
};

defineExpose({ extraClick });
</script>
