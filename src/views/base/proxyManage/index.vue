<template>
  <el-container>
    <el-header>
      <el-button @click="openProxy('add')" type="success" icon="el-icon-plus" text>添加代理商</el-button>
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
          <el-table-column prop="name" label="商品名称" />
          <el-table-column prop="login_name" label="用户账号" />
          <el-table-column prop="domains" label="域名" />
          <el-table-column prop="phone_number" label="联系电话" align="center" />
          <el-table-column prop="is_root" label="是否总代" align="center">
            <template #default="scope">
              <div v-if="scope.row.is_root">
                是
              </div>
              <div v-else>
                否
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="创建时间" align="center" />
        </el-table>
      </div>
      <div class="table-page">
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
  <addUserModel ref="refAddUser"></addUserModel>
</template>

<script setup>
import api from "./server/api.js";
import addUserModel from './components/addUserModel.vue'
import { reactive, ref, onMounted } from "vue";

const refAddUser = ref(null)
const currentPage = ref(0)
const dataObj = reactive({
  tableData: [],
  loading: false,
  totalRows: 0,
});

onMounted(()=> {
 getProxy();
})

const getProxy = async () => {
  const res = await api.getProxy();
  dataObj.tableData = res.data;
}

const refresh = () => {
    console.log(22);
}
const paginationChange = (e) => {


}

const handleSizeChange = (e) => {

}

const openProxy = (type) => {
  refAddUser.value.hasView = true;
}
</script>
