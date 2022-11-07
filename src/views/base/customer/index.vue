<template>
  <el-container>
    <el-header>
      <!-- <div style="flex: 3">
        <el-row>
          <el-col :span="3">
            <el-input v-model="searchForm.search" placeholder="输入商品名称" />
          </el-col>
          <el-col :span="3">
            <el-select v-model="searchForm.status" placeholder="选择商品状态">
              <el-option
                v-for="item in data.shopOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-button
              @click="triggerSearch"
              :icon="Search"
              type="primary"
              round
              >查询</el-button
            >
            <el-button :icon="Refresh" @click="triggerRefresh" round
              >重置</el-button
            >
          </el-col>
        </el-row>
      </div>
      <el-button @click="openAdd('add')" type="success" icon="el-icon-plus" text
        >添加套餐</el-button
      > -->
    </el-header>
    <el-main class="nopadding">
      <div class="scTable-table">
        <el-table
          ref="table"
          style="height: 100%"
          :data="data.tableData"
          :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
          row-key="id"
          border
          @refresh="refresh"
          v-loading="data.loading"
        >
          <el-table-column
            prop=""
            label="序号"
            type="index"
            align="center"
            width="100"
          >
          </el-table-column>
          <el-table-column prop="name" label="客户名称" align="center" />
          <el-table-column
            prop="phone_number"
            label="联系方式"
            align="center"
          />

          <el-table-column prop="status" label="状态" align="center">
            <template #default="scope">
              <div v-if="statusObj[scope.row.status]">
                <el-tag :type="statusObj[scope.row.status].type">{{
                  statusObj[scope.row.status].text
                }}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="创建时间" />
          <el-table-column
            label="操作"
            fixed="right"
            align="left"
            width="200"
          >
            <template #default="scope">
              <el-button-group v-if="scope?.row?.status != `confirmed`">
                <el-button
                    v-if="scope?.row?.status != `has_contact`"
                  @click="triggerUpDown(scope?.row?.uuid, 'has_contact')"
                  type="primary"
                  text
                  size="small"
                  >已联系</el-button
                >
                <el-button
                  @click="triggerUpDown(scope?.row?.uuid, 'confirmed')"
                  type="primary"
                  text
                  size="small"
                  >已确认</el-button
                >
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="scTable-page">
        <el-pagination
          background
          :small="true"
          layout="total"
          :total="data.totalRows"
          :page-sizes="[10, 20, 30]"
          v-model:currentPage="data.currentPage"
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
import api from "./server/newapi.js";
import { Search, Refresh } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { ref, reactive, onMounted, nextTick } from "vue";

const role = ref(localStorage.getItem("role"));

const statusObj = {
  not_contact: { text: "未联系", type: "info" },
  has_contact: { text: "已联系", type: "" },
  confirmed: { text: "已确认", type: "success" },
};

nextTick(() => {
  if (!localStorage.getItem("reload")) {
    localStorage.setItem("reload", 1);
    location.reload();
  }
});

let searchForm = ref({ search: "", status: "" });
const refAddUser = ref(null);
const imgView = ref({
  viewImg: false,
  url: "",
});
const data = reactive({
  tableData: [],
  currentPage: 1,
  loading: false,
  totalRows: 0,
  pageNo: 1,
  page_size: 10,
});

onMounted(() => {
  getList();
});

//下架
const triggerUpDown = async (uuid, status) => {
  const res = await api.patchDistributors(uuid, { status });
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

const refresh = () => {
  ElMessage({
    type: "success",
    message: "已刷新",
  });
  getList();
};

// 获取列表信息
const getList = async () => {
  data.loading = true;
  const res = await api.getList();
  data.loading = false;
  if (res?.errorCode == "") {
    console.log(res, 22);
    // if (res.data && res.data.rows.length > 0) {
    //   // 处理字典
    //   res.data.rows.forEach((item) => {
    //     const statusObj = data.shopOption.find((e) => e.value == item?.status);
    //     const typeObj = data.typeOption.find((e) => e.value == item?.type);
    //     if (statusObj) {
    //       item.statusTxt = statusObj.label;
    //     }
    //     if (typeObj) {
    //       item.typeTxt = typeObj.label;
    //     }
    //   });
    // }
    data.tableData = res?.data;

    data.totalRows = res?.data?.length;
  }
};

//查询
const triggerSearch = () => {
  getList();
};

// 重置
const triggerRefresh = () => {
  searchForm.value = { search: "", status: "" };
  getList();
};

const paginationChange = (e) => {
  data.pageNo = e;
  getList();
};
const handleSizeChange = (e) => {
  data.page_size = e;
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
