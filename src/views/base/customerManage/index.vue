<template>
    <el-container>
      <el-header>
        <div style="flex: 3">
          <!-- <el-row>
            <el-col :span="3">
              <el-input v-model="searchForm.search" placeholder="输入商品名称" />
            </el-col>
            <el-col :span="3">
              <el-select v-model="searchForm.status" placeholder="选择商品状态">
                <el-option v-for="item in data.shopOption" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-button @click="triggerSearch" :icon="Search" type="primary" round>查询</el-button>
              <el-button :icon="Refresh" @click="triggerRefresh" round>重置</el-button>
            </el-col>
          </el-row> -->
        </div>
        <el-button  @click="openAdd('add')" type="primary" icon="el-icon-plus">创建账号</el-button>
      </el-header>
      <el-main class="nopadding">
        <div class="scTable-table">
          <el-table ref="table" style="height: 100%" :data="data.tableData"
            :header-cell-style="{ background: '#f5f7fa', color: '#606266' }" row-key="id" border @refresh="refresh"
            v-loading="data.loading">
            <el-table-column prop="" label="序号" type="index" align="center" width="100">
            </el-table-column>
            <el-table-column prop="first_name" label="昵称" align="center" />
            <el-table-column prop="username" label="账号名称" align="center" />
            <el-table-column prop="date_joined" label="创建时间" align="center"/>
   
            <el-table-column label="操作" fixed="right" align="center" width="200">
              <template #default="scope">
                <el-button-group>
                  <el-button  @click="openAdd('edit', scope)" type="warning" text
                    size="small">编辑</el-button>
                  <el-button  @click="delShop(scope.row)" type="danger" text
                    size="small">删除</el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="scTable-page">
          <el-pagination background :small="true" layout="total, sizes, prev, pager, next" :total="data.totalRows"
            :page-sizes="[10, 20, 30]" v-model:currentPage="data.currentPage" :default-page-size="10"
            @current-change="paginationChange" @size-change="handleSizeChange"></el-pagination>
        </div>
      </el-main>
    </el-container>
    <addUserModel ref="refAddUser" @emitAddMenu="emitAddMenu"></addUserModel>
    <editPic ref="refEditPic" @emitSubmit="emitSubmit"></editPic>
    <el-dialog v-model="imgView.viewImg">
      <img style="width: 100%" :src="imgView.url" />
    </el-dialog>
  </template>
  
  <script setup>
  import api from "./server/api.js";
  import addUserModel from "./components/addUserModel.vue";
  import editPic from "./components/editPic.vue";
  import { Search, Refresh } from "@element-plus/icons-vue";
  import { ElMessage, ElMessageBox } from "element-plus";
  import { ref, reactive, onMounted, nextTick } from "vue";
  import { useRoute } from "vue-router"
  const route = useRoute()
  
  const role = ref(localStorage.getItem("role"));
  
  nextTick(() => {
    if (!localStorage.getItem("reload")) {
      localStorage.setItem("reload", 1);
      location.reload();
    }
  });
  
  let searchForm = ref({ search: "", status: "",role: "customer_care" });
  const refAddUser = ref(null);
  const refEditPic = ref(null);
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
    shopOption: [
      { label: "全部", value: "" },
      { label: "草稿", value: "outline" },
      { label: "上架", value: "on_shelf" },
      { label: "下架", value: "off_shelf" },
    ],
    typeOption: [
      { label: "普通套餐", value: "common" },
      { label: "k计划套餐", value: "kplan" },
    ],
  });
  
  onMounted(() => {
    getList();
  });
  
  const openAdd = (type, jsonObj = {}) => {
    if (type == "edit") {
      refAddUser.value.title = "编辑";
      refAddUser.value.formData.username = jsonObj?.row?.username;
      refAddUser.value.formData.first_name = jsonObj?.row?.first_name;
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
  // 新增后更新列表
  const emitSubmit = () => {
    getList();
  };
  
  const delShop = (row) => {
    ElMessageBox.confirm("请确认删除账号?", "删除", {
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
      .catch(() => { });
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
    const res = await api.treasurerList.get({
      ...searchForm.value,
      page: data.pageNo,
      page_size: data.page_size,
    });
    data.loading = false;
    if (res?.errorCode == "") {
      if (res.data && res.data.rows.length > 0) {
        // 处理字典
        res.data.rows.forEach((item) => {
          const statusObj = data.shopOption.find((e) => e.value == item?.status);
          const typeObj = data.typeOption.find((e) => e.value == item?.type);
          if (statusObj) {
            item.statusTxt = statusObj.label;
          }
          if (typeObj) {
            item.typeTxt = typeObj.label;
          }
        });
      }
      data.tableData = res?.data?.rows;
  
      data.totalRows = res?.data?.total;
    }
  };
  
  //查询
  const triggerSearch = () => {
    getList();
  };
  //查询
  const openEdit = (row) => {
    refEditPic.value.open(row);
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
  