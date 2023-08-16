<template>
    <el-container>
        <el-header>
            <!-- <el-row>
                <el-col :span="4">
                    <el-input v-model="searchForm.search" placeholder="手机号搜索" />
                </el-col>
                <el-col :span="3">
                    <el-select v-model="searchForm.status" placeholder="选择状态" clearable @change="changeType">
                        <el-option v-for="item in dataObj.statusList" :key="item.code" :label="item.label"
                            :value="item.code" />
                    </el-select>
                </el-col>
                <el-col :span="8">
                    <el-config-provider :locale="dataObj.locale">
                        <el-date-picker v-model="dataObj.selectTime" type="daterange" range-separator="至"
                            start-placeholder="开始时间" end-placeholder="结束时间" value-format="YYYY-MM-DD" />
                    </el-config-provider>
                </el-col>
                <el-col :span="6">
                    <el-button style="margin-left: 15px;" @click="triggerSearch" :icon="Search" type="primary"
                        round>查询</el-button>
                    <el-button :icon="Refresh" @click="triggerRefresh" round>重置</el-button>
                </el-col>
            </el-row> -->
        </el-header>
        <el-main class="nopadding">
            <div class="scTable-table">
                <el-table ref="table" style="height: 100%" :data="dataObj.tableData"
                    :header-cell-style="{ background: '#f5f7fa', color: '#606266' }" row-key="id" border @refresh="refresh"
                    v-loading="dataObj.loading">
                    <el-table-column prop="" label="序号" type="index" align="center" width="100">
                    </el-table-column>
                    <el-table-column prop="full_name" label="姓名" align="center" />
                    <el-table-column prop="phone" label="手机号" align="center" />
                    <el-table-column prop="cert_no" label="身份证" align="center" />
                    <el-table-column  label="图片信息" align="center" >
                        <template #default="scope">
                            <el-button v-if="scope.row.cert_pic1" type="primary" text @click="openView(scope.row)">查看</el-button>
                        </template>
                        </el-table-column>
                    <el-table-column prop="created_at" label="创建时间" align="center" />
               
           
                    <!-- <el-table-column label="操作" fixed="right" align="center" width="200">
                        <template #default="scope">
                            <el-button-group v-if="['pay_success'].includes(scope.row.status)">
                                 <el-button  @click="changeAction(scope.row, 'success')" type="success" text size="small">
                                    确认充值
                                </el-button>
                            </el-button-group>
                        </template>
                    </el-table-column> -->
                </el-table>
            </div>
            <div class="scTable-page !justify-end">
                <el-pagination background :small="true" layout="total, sizes, prev, pager, next" :total="dataObj.totalRows"
                    :page-sizes="[10, 20, 30]" v-model:currentPage="currentPage" :default-page-size="20"
                    @current-change="paginationChange" @size-change="handleSizeChange"></el-pagination>
            </div>
        </el-main>
    </el-container>
    <el-dialog v-model="imgView.viewImg">
        <img style="width: 100%" :src="imgView.url" />
    </el-dialog>
    <preview ref="previewRef" v-model:showPreviewDialog="showPreviewDialog" :list="imgList" :id="imgId" @emitGetList="emitGetList"></preview>
</template>
  
<script setup>
import api from "./server/api.js";
import preview from './components/vr-preview/preview.vue';
import { ElMessage, ElMessageBox } from "element-plus";
import { Search, Refresh } from "@element-plus/icons-vue";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import { ref, reactive, onMounted } from "vue";


const role = ref(localStorage.role);
const refAddUser = ref(null);
const currentPage = ref(1);
const showPreviewDialog = ref(false);
const imgList = ref([]);
const imgId = ref("");

const imgView = ref({
    viewImg: false,
    url: "",
});
let searchForm = ref({ search: "", status: 'pay_success' });
const dataObj = reactive({
    tableData: [],
    selectTime: [],
    loading: false,
    totalRows: 0,
    pageNo: 1,
    page_size: 20,
    locale: zhCn,
    typeOption: [],
    statusList: [
        //     {
        //   label: '全部',
        //   code: 'all',
        // },
        {
            label: '待支付',
            code: 'pay_wait'
        },
        {
            label: '支付成功',
            code: 'pay_success'
        },
        {
            label: '充值成功',
            code: 'success'
        },
    ]
});

onMounted(() => {
    getList();
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
    // getList();
};

// 获取列表信息
const getList = async () => {
    dataObj.loading = true;
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

const openView = (row) => {
    console.log(row);
    imgList.value = [
        {
            fileName: '身份证正面照',
            fileUrl: row?.cert_pic1
        },
        {
            fileName: '身份证反面照',
            fileUrl: row?.cert_pic2
        },
        {
            fileName: '半身照',
            fileUrl: row?.body_pic
        },
    ];
    imgId.value = row.uuid;
    showPreviewDialog.value = true;

}

// 重置
const triggerRefresh = () => {
    dataObj.selectTime = [];
    searchForm.value = { search: "", status: "" };
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

const emitGetList = () => {
    showPreviewDialog.value = false;
    getList();
}

const changeAction = async (data, type) => {
    ElMessageBox.confirm(
        '是否继续操作?',
        '确认',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            const res = await api.operate({ action: type }, data.uuid);
            if (res?.errorCode == '') {
                ElMessage({
                    type: "success",
                    message: "操作成功",
                });
                getList();
            }
        })


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
  