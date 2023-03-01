<template>
  <el-container>
    <el-header>
      <div></div>
      <el-button @click="openAdd('add')" type="success" icon="el-icon-plus" text>添加推广人</el-button>
    </el-header>
    <el-main class="nopadding">
      <div class="scTable-table">
        <el-table ref="table" style="height: 100%" :data="dataObj.tableData"
          :header-cell-style="{ background: '#f5f7fa', color: '#606266' }" row-key="id" border
          v-loading="dataObj.loading">
          <el-table-column prop="" label="序号" type="index" align="center" width="100">
          </el-table-column>
          <el-table-column prop="name" align="center" label="推广人名称" />
          <el-table-column prop="login_name" align="center" label="登录账号" />
          <el-table-column prop="login_password" align="center" label="登录密码" />
          <el-table-column prop="phone_number" align="center" label="手机号" />
          <el-table-column label="操作" fixed="right" align="center" width="300">
            <template #default="scope">
              <el-button type="warning" text size="small" @click="edit(scope.row)">编辑</el-button>
              <el-popconfirm confirm-button-text="确认" cancel-button-text="取消"  icon-color="#626AEF"
                title="你确认要删除吗?" @confirm="clickDelete(scope.row)">
                <template #reference>
                  <el-button type="danger" text size="small">删除</el-button>
                </template>
              </el-popconfirm>

              <el-popover placement="left" :width="400" trigger="click">
                <template #reference>
                  <el-button type="primary" text size="small" @click="triggerUrl(scope.row)">生成推广链接</el-button>
                </template>
                <template v-for="item in urlArr">
                  <div>
                    {{ item }}
                  </div>
                </template>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="scTable-page">
        <!-- <el-pagination
          background
          :small="true"
          layout="total, sizes, prev, pager, next"
          :total="dataObj.totalRows"
          :page-sizes="[10, 20, 30]"
          v-model:currentPage="currentPage"
          :default-page-size="10"
          @current-change="paginationChange"
          @size-change="handleSizeChange"
        ></el-pagination> -->
      </div>
    </el-main>
  </el-container>

  <addSpreadModel ref="refSpread" @getList="getList"></addSpreadModel>
</template>

<script setup>
import api from "./server/api.js";
import addSpreadModel from "./components/addSpreadModel.vue";
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";

const urlArr = ref([]);
const dataObj = reactive({
  tableData: [],
});

const refSpread = ref(null);

onMounted(() => {
  getList();
});

const openAdd = () => {
  console.log(refSpread.value);
  refSpread.value.open('add');

};

const getList = async () => {
  const res = await api.getPromoters();
  if (res.errorCode=='') {
    dataObj.tableData = res.data;

  }
};

const triggerUrl = async (row) => {
  if (localStorage.domains) {
    urlArr.value = []
    const arr = JSON.parse(localStorage.domains)
    arr.forEach(item => {
      urlArr.value.push('http://' + item + '/h5/#/?pid=' + row.uuid)
    });
  }
}

const edit = (row) => {
  refSpread.value.open('edit', row);
}

const clickDelete = async (row) => {
  const res = await api.deletePromoters(row);
  if (res.errorCode == '') {
    getList();
    ElMessage.success('删除成功');
  } else {
      ElMessage.error(res.errorMessage);
  }
}
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
