<template>
  <el-container>
    <el-header id="client-header">
      <el-row>
        <el-col :span="6">
          <el-input v-model="searchForm.search" placeholder="选购号码、收货号码、姓名、身份证、联通订单ID" />
        </el-col>
        <template v-if="!['treasurer'].includes(role)">
        
        <el-col :span="3" >
          <el-select v-model="searchForm.goods_id" placeholder="选择套餐" clearable @change="changeType">
            <el-option v-for="item in dataObj.typeOption" :key="item.id" :label="item.name" :value="item.goods_id" />
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select v-model="searchForm.distributor" placeholder="选择代理商" clearable @change="changeProxy">
            <el-option v-for="item in dataObj.proxyList" :key="item.uuid" :label="item.name" :value="item.uuid" />
          </el-select>
        </el-col>
        </template>

        <!-- <el-col :span="6">
          <el-config-provider :locale="dataObj.locale">
            <el-date-picker v-model="dataObj.selectTime" type="daterange" range-separator="至" start-placeholder="下单时间"
              end-placeholder="结束时间" value-format="YYYY-MM-DD" />
          </el-config-provider>
        </el-col> -->
        <el-col :span="8">
          <el-button style="margin-left: 15px;" @click="triggerSearch" :icon="Search" type="primary"
            round>查询</el-button>
          <el-button :icon="Refresh" @click="triggerRefresh" round>重置</el-button>
          <el-button @click="seniorSearch" round v-if="!['treasurer'].includes(role)">高级筛选</el-button>
          <el-button :icon="Upload" @click="dcTrigger" round type="primary">导出</el-button>
        </el-col>
      </el-row>

    </el-header>
    <el-main class="nopadding">
      <div class="scTable-table">
        <el-table ref="table" style="height: 100%" :data="dataObj.tableData"
          :header-cell-style="{ background: '#f5f7fa', color: '#606266' }" row-key="id" border @refresh="refresh"
          v-loading="dataObj.loading">
          <el-table-column prop="" label="序号" type="index" align="center" width="100">
          </el-table-column>
          <el-table-column prop="distributor_name" label="代理商名称" />
          <el-table-column prop="plan_name" label="套餐名称" />
          <el-table-column prop="status" label="订单状态" />
          <el-table-column v-if="role != `promoter`" prop="first_money" label="首充金额" />
          <el-table-column prop="cert_name" label="客户姓名" />
          <el-table-column prop="cert_id" label="客户身份证" />
          <el-table-column prop="number" label="选购号码" />

          <!-- <el-table-column prop="post_name" label="收货人" align="center" /> -->
          <el-table-column prop="post_number" label="收货人号码" align="center" />
          <el-table-column prop="post_address" label="收货地址" />
          <el-table-column prop="order_no" label="联通订单编号" />
          <el-table-column prop="order_id" label="联通订单ID" />
          <el-table-column prop="created_at" label="下单时间" />
        </el-table>
      </div>
      <div class="scTable-page">
        <el-pagination background :small="true" layout="total, sizes, prev, pager, next" :total="dataObj.totalRows"
          :page-sizes="[10, 20, 30]" v-model:currentPage="currentPage" :default-page-size="10"
          @current-change="paginationChange" @size-change="handleSizeChange"></el-pagination>
      </div>
    </el-main>
  </el-container>
  <el-dialog v-model="imgView.viewImg">
    <img style="width: 100%" :src="imgView.url" />
  </el-dialog>
  <uploadModel ref="refUpload" @refresh="refresh"></uploadModel>
  <div v-if="showSearch" class="extra-class" :style="{ top: clientObj.bottom + 'px', width: clientObj.width + 'px' }">
    <el-row>
      <el-col :span="8">
        <el-config-provider :locale="dataObj.locale">
          <el-date-picker v-model="dataObj.selectTime" type="daterange" range-separator="至" start-placeholder="下单时间"
            end-placeholder="结束时间" value-format="YYYY-MM-DD" />
        </el-config-provider>
      </el-col>
      <el-col :span="6">
        <el-select v-model="searchForm.has_status" placeholder="选择状态" clearable @change="changeStatus">
          <el-option v-for="item in dataObj.statusList" :key="item.code" :label="item.label" :value="item.code" />
        </el-select>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import api from "./server/api.js";
import newapi from "./server/newapi.js";
import { ElMessage, ElMessageBox } from "element-plus";
import { Search, Refresh, Upload } from "@element-plus/icons-vue";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import uploadModel from "./components/uploadModel.vue";
import { ref, reactive, onMounted } from "vue";

const role = ref(localStorage.role);
const refAddUser = ref(null);
const refUpload = ref(null);
const showSearch = ref(false);
const currentPage = ref(1);
const imgView = ref({
  viewImg: false,
  url: "",
});
let searchForm = ref({ search: "", goods_id: "", distributor: "", has_status: 'all' });
const dataObj = reactive({
  tableData: [],
  selectTime: [],
  loading: false,
  totalRows: 0,
  pageNo: 1,
  page_size: 10,
  locale: zhCn,
  typeOption: [],
  proxyList: [],
  statusList: [{
    label: '全部',
    code: 'all',
  },
  {
    label: '有状态',
    code: 'stateful'
  },
  {
    label: '无状态',
    code: 'stateless'
  },
  ]
});

const clientObj = reactive({
  bottom: 0,
  width: 0
})

onMounted(() => {
  getList();
  typeList();
  clientObj.bottom = document.getElementById('client-header').getBoundingClientRect().bottom;
  clientObj.width = document.getElementById('client-header').getBoundingClientRect().width;
});

const seniorSearch = () => {
  showSearch.value = !showSearch.value;
}

const changeType = (e) => {
  getList();
};
const changeProxy = (e) => {
  getList();
};
const changeStatus = (e) => {
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

const dcTrigger = () => {
  refUpload.value.extraClick(searchForm.value);
}



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
    .catch(() => { });
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
  const proxy = await newapi.getProxy();
  dataObj.proxyList = proxy?.data;

  dataObj.loading = true;
  // 处理数据
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
  searchForm.value = { search: "", status: "", distributor: "" };
  getList();
};

const paginationChange = (e) => {
  console.log(e, 222);
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
  margin-right: 10px;
}

.extra-class {
  background: #fff;
  position: absolute;
  z-index: 999;
  min-height: 100px;
  padding: 20px;
}
</style>
