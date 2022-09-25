<template>
  <el-container>
    <el-header style="justify-content: flex-end">
      <el-button type="success" icon="el-icon-plus" text @click="openUpload"
        >上传订单</el-button
      >
    </el-header>
    <el-main class="nopadding">
      <div class="tableclass">
        <el-table
          ref="table"
          style="height: 100%"
          :data="dataObj.tableData"
          :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
          row-key="id"
          border
          v-loading="dataObj.loading"
        >
          <el-table-column
            prop=""
            label="#"
            type="index"
            align="center"
            width="100"
          >
          </el-table-column>
          <el-table-column prop="third_id" label="ID" />
          <el-table-column prop="status" label="状态" align="center" />
          <el-table-column prop="message" label="原因" />
          <el-table-column prop="created_at" label="创建时间" align="center" />
        </el-table>
      </div>
      <div class="table-page">
            <el-pagination
          background
          :small="true"
          layout="total, prev, pager, next"
          :total="dataObj.totalRows"
          :page-sizes="[10, 20, 30]"
          v-model:currentPage="dataObj.currentPage"
          :default-page-size="20"
          @current-change="paginationChange"
        ></el-pagination>
      </div>
    </el-main>
  </el-container>
  <uploadModel ref="refUpload"></uploadModel>
</template>

<script setup>
import api from "./server/api.js";
import uploadModel from "./components/uploadModel.vue";
import { reactive, ref, onMounted } from "vue";

const refUpload = ref(null);
const dataObj = reactive({
  tableData: [],
  loading: false,
  totalRows: 0,
  currentPage: 1,
  page_size: 20,
});

onMounted(() => {
  getList();
});

const getList = async () => {
  const res = await api.getTaskOrder({
    page: dataObj.currentPage,
    page_size: dataObj.page_size,
  });
  if (res.errorCode == "") {
    dataObj.tableData = res?.data?.rows;
    dataObj.totalRows = res?.data?.total;
  }
};

const openUpload = () => {
  refUpload.value.extraClick();
};

const paginationChange = (e) => {
    console.log(e);
    dataObj.currentPage = e
    getList()
};

const handleSizeChange = (e) => {};

const uploadTa = () => {};
</script>
