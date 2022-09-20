<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="4">
          <el-input
            v-model="searchForm.search"
            placeholder="名称、编码、收货号码"
          />
        </el-col>
        <el-col :span="3">
          <el-select
            v-model="searchForm.goods_id"
            placeholder="选择套餐"
            clearable
            @change="changeType"
          >
            <el-option
              v-for="item in dataObj.typeOption"
              :key="item.id"
              :label="item.name"
              :value="item.goods_id"
            />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-config-provider :locale="dataObj.locale">
            <el-date-picker
              v-model="dataObj.selectTime"
              type="daterange"
              range-separator="至"
              start-placeholder="下单时间"
              end-placeholder="结束时间"
              value-format="YYYY-MM-DD"
            />
          </el-config-provider>
        </el-col>
        <el-col :span="5">
          <el-button style="margin-left: 15px;" @click="triggerSearch" :icon="Search" type="primary" round
            >查询</el-button
          >
          <el-button :icon="Refresh" @click="triggerRefresh" round
            >重置</el-button
          >
        </el-col>
      </el-row>
    </el-header>
    <el-main class="nopadding">
      <div class="scTable-table">
        <el-table
          ref="table"
          style="height: 100%"
          :data="dataObj.tableData"
          :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
          row-key="id"
          border
          @refresh="refresh"
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
          <el-table-column prop="plan_name" label="套餐名称" />
          <el-table-column prop="status" label="订单状态" />
          <el-table-column prop="cert_name" label="客户姓名" />
          <el-table-column prop="cert_id" label="客户身份证" />
          <el-table-column prop="number" label="选购号码" />

          <el-table-column prop="post_name" label="收货人" align="center" />
          <el-table-column
            prop="post_number"
            label="收货人号码"
            align="center"
          />
          <el-table-column prop="post_address" label="收货地址" />
          <el-table-column prop="order_no" label="联通订单编号" />
          <el-table-column prop="order_id" label="联通订单ID" />
          <el-table-column prop="created_at" label="下单时间" />
        </el-table>
      </div>
      <div class="scTable-page">
        <el-pagination
          background
          :small="true"
          layout="total, sizes, prev, pager, next"
          :total="dataObj.totalRows"
          :page-sizes="[10, 20, 30]"
          v-model:currentPage="currentPage"
          :default-page-size="10"
          @current-change="paginationChange"
          @size-change="handleSizeChange"
        ></el-pagination>
      </div>
    </el-main>
  </el-container>
  <el-dialog v-model="imgView.viewImg">
    <img style="width: 100%" :src="imgView.url" />
  </el-dialog>
</template>

<script setup>
import api from "./server/api.js";
import { ElMessage, ElMessageBox } from "element-plus";
import { Search, Refresh } from "@element-plus/icons-vue";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import { ref, reactive, onMounted } from "vue";

const refAddUser = ref(null);
const currentPage = ref(1);
const imgView = ref({
  viewImg: false,
  url: "",
});
let searchForm = ref({ search: "", goods_id: "" });
const dataObj = reactive({
  tableData: [],
  selectTime: [],
  loading: false,
  totalRows: 0,
  pageNo: 1,
  page_size: 10,
  locale: zhCn,
  typeOption: [],
});

onMounted(() => {
  getList();
  typeList();
});

const changeType = (e) => {
  getList();
};

const openAdd = (type, jsonObj = {}) => {
  if (type == "edit") {
    refAddUser.value.title = "修改套餐";
    refAddUser.value.formData = jsonObj?.row;
    refAddUser.value.fileList = [{ url: jsonObj?.row?.des_picture }];
    refAddUser.value.hideUpload = true;
  }

  if (type == "add") {
    refAddUser.value.title = "添加套餐";
  }
  refAddUser.value.hasView = true;
};

const viewImg = (imgUrl) => {
  imgView.value.viewImg = true;
  imgView.value.url = imgUrl;
};

//下架
const triggerUpDown = async (id, status) => {
  const res = await api.upDown({ status }, id);
  if (res.errorCode == "") {
    ElMessage({
      type: "success",
      message: "操作成功",
    });
    getList();
  }
};

// 新增后更新列表
const emitAddMenu = () => {
  getList();
};

const delShop = (row) => {
  ElMessageBox.confirm("请确认删除套餐?", "删除套餐", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "error",
  })
    .then(async () => {
      console.log(row?.id);
      const res = await api.delete(row?.id);
      console.log(res);
      if (res.errorCode == "") {
        ElMessage({
          type: "success",
          message: "删除成功",
        });
        getList();
      } else {
        ElMessage({
          type: "danger",
          message: res.errorMessage,
        });
      }
    })
    .catch(() => {});
};

const typeList = async () => {
  const res = await api.getType();
  console.log(res);
  dataObj.typeOption = res?.data;
};

const refresh = () => {
  ElMessage({
    type: "success",
    message: "已刷新",
  });
  getList();
};

// 获取列表信息
const getList = async () => {
  dataObj.loading = true;
  // 处理数据
  console.log(dataObj.selectTime);
  if (dataObj.selectTime?.length > 0) {
    searchForm.value.created_at_gte = dataObj.selectTime[0];
    searchForm.value.created_at_lte = dataObj.selectTime[1];
  } else {
    delete searchForm.value.created_at_gte;
    delete searchForm.value.created_at_lte;
  }

  const res = await api.getList({
    ...searchForm.value,
    page: dataObj.pageNo,
    page_size: dataObj.page_size,
  });
  dataObj.loading = false;
  if (res?.errorCode == "") {
    dataObj.tableData = res?.data?.rows;
    dataObj.totalRows = res?.data?.total;
  }
};

//查询
const triggerSearch = () => {
  getList();
};

// 重置
const triggerRefresh = () => {
  dataObj.selectTime = [];
  searchForm.value = { search: "", status: "" };
  getList();
};

const paginationChange = (e) => {
  console.log(e,222);
  dataObj.pageNo = e;
  getList();
};
const handleSizeChange = (e) => {
  dataObj.page_size = e;
  getList();
};
</script>

<style scoped>
.scTable-table {
  height: calc(100% - 50px);
}
.scTable-page {
  height: 50px;
  border-top: 1px solid #ebeef5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
}
:deep(.scTable-table .el-table__body-wrapper .el-scrollbar__bar.is-horizontal) {
  height: 12px;
  border-radius: 12px;
}
.el-row {
  width: 100%;
}
.el-col {
  padding: 0 1rem;
}
</style>
