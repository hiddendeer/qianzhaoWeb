<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="6">
          <el-input v-model="searchForm.search" class="w-full" placeholder="输入信息搜索" />
        </el-col>
           <el-col :span="8">
          <el-button style="margin-left: 15px;" @click="triggerSearch" :icon="Search" type="primary"
            round>查询</el-button>
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
          v-loading="dataObj.loading"
        >
          <el-table-column
            prop=""
            label="序号"
            type="index"
            align="center"
            width="100"
          >
          </el-table-column>
          <el-table-column
            prop="owner_info.name"
            align="center"
            label="账号名称"
          />
          <el-table-column
            prop="owner_info.full_name"
            align="center"
            label="姓名"
          />
          <el-table-column
            prop="owner_info.phone_number"
            align="center"
            label="手机号"
          />
          <el-table-column prop="money" align="center" label="提现金额" />
          <el-table-column prop="status" align="center" label="状态">
            <template #default="scope">
              <div v-if="scope.row.status == `unpaid`">
                <el-tag class="ml-2" type="info">未打款</el-tag>
              </div>
              <div v-if="scope.row.status == `paid`">
                <el-tag class="ml-2" type="success">已打款</el-tag>
              </div>
              <div v-if="scope.row.status == `reject`">
                <el-tag class="ml-2" type="danger">驳回</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="created_at" align="center" label="创建时间" />
          <el-table-column
            label="操作"
            fixed="right"
            align="center"
            width="300"
          >
            <template #default="scope">
              <el-button
                v-if="scope.row.status == `unpaid`"
                type="primary"
                text
                size="small"
                @click="open(scope.row)"
                >转账</el-button
              >
              <el-button
                type="danger"
                v-if="scope.row.status == `unpaid`"
                text
                size="small"
                @click="triggerReject(scope.row)"
                >驳回</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="scTable-page"></div>
    </el-main>
  </el-container>
  <el-dialog width="30%" center v-model="dialogFormVisible" title="确认">
    <div class="flex justify-center">
      <el-form :model="form">
        <!-- <el-form-item label="输入金额">
                <el-input v-model="form.money" type="number" autocomplete="off" class="w-[100%]" />
            </el-form-item> -->
        <div>姓名：{{ currentObj?.owner_info?.full_name }}</div>
        <div>金额：{{ currentObj?.money }}元</div>
        <div v-if="currentObj?.owner_info?.payment">
          <img
            class="w-[300px] h-[300px]"
            :src="currentObj?.owner_info?.payment?.qr_code"
            alt=""
          />
        </div>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submit"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
  
<script setup>
import api from "./server/api.js";
import { onMounted, reactive, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

const form = ref({ status: "paid" });
const searchForm = ref({
  search: "",
});
const urlArr = ref([]);
const dataObj = reactive({
  tableData: [],
});

const currentId = ref("");
const currentObj = ref({});

const refSpread = ref(null);
const dialogFormVisible = ref(false);

onMounted(() => {
  getList();
});

const triggerSearch = () => {
    getList();
}

const open = (row) => {
  currentId.value = row.uuid;
  currentObj.value = row;
  dialogFormVisible.value = true;
};
const triggerReject = (row) => {
  currentId.value = row.uuid;
  currentObj.value = row;
  ElMessageBox.confirm("您确认要驳回?", "Warning", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    const res = await api.withDrawals({ status: "reject" }, currentId.value);
    if (res.errorCode == "") {
      ElMessage.success("驳回成功");
      getList();
    } else {
      ElMessage.error(res.errorMessage);
    }
  });
};

const submit = async () => {
  const res = await api.withDrawals(form.value, currentId.value);
  if (res.errorCode == "") {
    ElMessage.success("提交成功");
    getList();
    dialogFormVisible.value = false;
  } else {
    ElMessage.error(res.errorMessage);
  }
};

const getList = async () => {
  const res = await api.getWithdrawals(searchForm.value);
  if (res.errorCode == "") {
    dataObj.tableData = res?.data;
  }
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
  