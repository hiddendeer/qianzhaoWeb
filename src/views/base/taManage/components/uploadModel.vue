<template>
  <el-dialog v-model="Visible" title="订单上传" :close-on-click-modal="false">
    <template v-if="hasSuccess">
    <div style="margin: 15px 0;display:flex;justify-content: flex-end;">
      <el-button type="success" icon="el-icon-plus" text @click="refreshUpload"
        >重新上传</el-button
      >
    </div>
      <el-tabs type="border-card" @tab-click="tabClick">
        <el-tab-pane>
          <template #label>
            <span style="color: #67c23a"
              >成功订单 {{ table.successTotal }}个</span
            >
          </template>
          <el-table
            :data="table.successTable"
            border
            height="50vh"
            :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
          >
            <el-table-column
              prop=""
              label="#"
              type="index"
              align="center"
              width="100"
            >
            </el-table-column>
            <el-table-column property="status" label="状态" align="center">
              <template #default="scope">
                <div v-if="scope.row.status == 'success'">
                  <el-tag type="success">成功</el-tag>
                </div>
                <div v-else>
                  <el-tag type="danger">失败</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column property="third_id" label="Id" />
            <el-table-column property="message" label="原因" />
          </el-table>
          <div style="margin-top: 20px">
            <el-pagination
              @current-change="currentChange1"
              background
              layout="prev, pager, next"
              :default-page-size="15"
              :total="table.successTotal"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane>
          <template #label>
            <span style="color: red">失败订单 {{ table.errorTotal }}个</span>
          </template>
          <el-table
            :data="table.errorTable"
            border
            height="50vh"
            :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
          >
            <el-table-column
              prop=""
              label="#"
              type="index"
              align="center"
              width="100"
            >
            </el-table-column>
            <el-table-column property="status" label="状态">
              <template #default="scope">
                <div v-if="scope.row.status == 'success'">
                  <el-tag type="success">成功</el-tag>
                </div>
                <div v-else>
                  <el-tag type="danger">失败</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column property="third_id" label="Id" width="150" />
            <el-table-column property="message" label="原因" width="200" />
          </el-table>
          <div style="margin-top: 20px">
            <el-pagination
              @current-change="currentChange2"
              background
              layout="prev, pager, next"
              :default-page-size="15"
              :total="table.errorTotal"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </template>
    <template v-else>
      <el-container>
        <el-header style="justify-content: flex-end">
          <el-upload
            :action="uploadUrl"
            :on-error="handleError"
            :on-success="handleSuccess"
            :limit="1"
            name="excel_file"
            :show-file-list="false"
          >
            <el-button type="success" icon="el-icon-plus" text
              >上传推啊订单</el-button
            >
          </el-upload>
        </el-header>
        <el-main>
          <div style="display: flex; justify-content: center">
            <el-progress
              type="circle"
              :percentage="percentage"
              :status="percentageStatus"
            />
          </div>
        </el-main>
      </el-container>
    </template>
  </el-dialog>
</template>

<script setup>
import api from "../server/api.js";
import { ElMessage } from "element-plus";
import { ref, onMounted, reactive } from "vue";
const Visible = ref(false);
const hasSuccess = ref(false);
const percentageStatus = ref("");
const percentage = ref(0);
let timer = ref(null);
const taskId = ref("d0ab8af2-c057-4d1b-b718-204de08e65af");

const emits = defineEmits(['refresh'])

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

const extraClick = () => {
  Visible.value = true;
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
  hasSuccess.value= false;
  percentage.value = 0;
  percentageStatus.value = '';
}

const getTask = async () => {
  const res = await api.getTask();
  if (res.data && res.data.progress == "100") {
    percentageStatus.value = "success";
    getTaskOrder(taskId.value);
    clearInterval(timer.value);
    clearTimeout();
    emits('refresh')
    setTimeout(() => {
      hasSuccess.value = true;
    }, 1000);
  }

  if (res.data && res.data.progress) {
    percentage.value = parseInt(res.data.progress);
    console.log(percentage.value);
  }
};

const getTaskOrder = async () => {
  const successRes = await api.getTaskOrder({
    task_id: taskId.value,
    page: table.page,
    page_size: table.page_size,
    status: "success",
  });
  if (successRes.errorCode == "") {
    table.successTable = successRes?.data?.rows;
    table.successTotal = successRes?.data?.total;
  }
  const res = await api.getTaskOrder({
    task_id: taskId.value,
    page: table.page2,
    page_size: table.page_size,
    status: "failed",
  });
  if (res.errorCode == "") {
    table.errorTable = res?.data?.rows;
    table.errorTotal = res?.data?.total;
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
  if (e.data && e.data?.uuid) {
    taskId.value = e.data.uuid;
  } else {
    ElMessage({
      type: "danger",
      message: "缺少uuid",
    });
  }

  timer.value = setInterval(() => {
    setTimeout(() => {
      getTask();
    }, 0);
  }, 2000);
};

defineExpose({ extraClick });
</script>
