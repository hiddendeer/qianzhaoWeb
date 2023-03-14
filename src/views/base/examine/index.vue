<template>
    <el-container>
        <el-header>
            <div></div>
        </el-header>
        <el-main class="nopadding">
            <div class="scTable-table">
                <el-table ref="table" style="height: 100%" :data="dataObj.tableData"
                    :header-cell-style="{ background: '#f5f7fa', color: '#606266' }" row-key="id" border
                    v-loading="dataObj.loading">
                    <el-table-column prop="" label="序号" type="index" align="center" width="100">
                    </el-table-column>
                    <el-table-column prop="name" align="center" label="账号名称" />
                    <el-table-column prop="full_name" align="center" label="姓名" />
                    <el-table-column prop="phone_number" align="center" label="手机号" />
                    <el-table-column prop="payment?.qr_code" align="center" label="收款码">
                        <template #default="scope">
                            <el-button type="primary" @click="viewImg(scope.row)" text>查看</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" align="center" label="状态">
                        <template #default="scope">
                            <div v-if="scope.row.status == `tobe_reviewed`">
                                <el-tag type="info">待审核</el-tag>
                            </div>
                            <div v-if="scope.row.status == `paid`">
                                <el-tag type="success">已打款</el-tag>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="payment.created_at" align="center" label="创建时间" />
                    <el-table-column label="操作" fixed="right" align="center" width="300">
                        <template #default="scope">
                            <el-button v-if="scope.row.status == `tobe_reviewed`" type="primary" text size="small"
                                @click="open(scope.row)">审核</el-button>
                            <el-button v-if="scope.row.status == `tobe_reviewed`" type="danger" text size="small"
                                @click="triggerReject(scope.row)">驳回</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="scTable-page">

            </div>
        </el-main>
    </el-container>
    <el-dialog v-model="imgObj.showImg" title="收款码">
        <img style="width: 100%" :src="imgObj.url" />
    </el-dialog>
</template>

<script setup>
import api from "./server/api.js";
import { onMounted, reactive, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

const form = ref({ money: 0, status: 'paid' });
const urlArr = ref([]);
const dataObj = reactive({
    tableData: [],
});

const imgObj = ref({
    showImg: false,
    url: ''
})


const refSpread = ref(null);
const dialogFormVisible = ref(false);

onMounted(() => {
    getList();
});

const triggerReject = (row) => {
    ElMessageBox.confirm(
        '确定要驳回吗?',
        '确认',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            const res = await api.checkInfo({approve: false}, row.uuid);
            if (res.errorCode == '') {
                ElMessage({
                    type: 'success',
                    message: '驳回成功',
                })
                getList();
            }

        })
}

const open = (row) => {
    ElMessageBox.confirm(
        '确定要审核通过吗?',
        '确认',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            const res = await api.checkInfo({approve: true}, row.uuid);
            if (res.errorCode == '') {
                ElMessage({
                    type: 'success',
                    message: '审核成功',
                })
                getList();
            }

        })
}


const getList = async () => {
    const res = await api.needCheck();
    dataObj.tableData = res.data;
};

const viewImg = (row) => {
    imgObj.value.showImg = true;
    imgObj.value.url = row.payment?.qr_code;
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
