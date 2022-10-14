<template>
  <el-container>
    <el-header>
      <div></div>
      <el-button
        @click="openProxy('add')"
        type="success"
        icon="el-icon-plus"
        text
        >添加代理商</el-button
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
          <el-table-column prop="name" label="代理商名称" />
          <el-table-column prop="login_name" label="用户账号" />
          <el-table-column prop="domains" label="域名" />
          <el-table-column
            prop="phone_number"
            label="联系电话"
            align="center"
          />
          <el-table-column prop="is_root" label="是否总代" align="center">
            <template #default="scope">
              <div v-if="scope.row.is_root">是</div>
              <div v-else>否</div>
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="创建时间" align="center" />
          <el-table-column
            label="操作"
            fixed="right"
            align="center"
            width="200"
          >
            <template #default="scope">
              <el-button-group>
                <template v-if="scope.row.status == 'normal'">
                  <el-button
                    type="danger"
                    text
                    size="small"
                    @click="statusProxy('disabled', scope.row)"
                    >禁用</el-button
                  >
                </template>
                <template v-else>
                  <el-button
                    type="success"
                    text
                    size="small"
                    @click="statusProxy('normal', scope.row)"
                    >激活</el-button
                  >
                </template>
              </el-button-group>
              <el-dropdown>
                <el-button size="small">
                  更多操作<el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      @click="typeSelect('login_name', scope.row)"
                      >修改用户账号</el-dropdown-item
                    >
                    <el-dropdown-item
                      @click="typeSelect('login_password', scope.row)"
                      >修改登录密码</el-dropdown-item
                    >
                    <el-dropdown-item @click="typeSelect('edit', scope.row)"
                      >编辑</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="table-page">
        <!-- <el-pagination
          background
          :small="true"
          layout="total, sizes, prev, pager, next"
          :total="dataObj.totalRows"
          :page-sizes="[10, 20, 30]"
          v-model:currentPage="dataObj.currentPage"
          :default-page-size="10"
          @current-change="paginationChange"
          @size-change="handleSizeChange"
        ></el-pagination> -->
      </div>
    </el-main>
  </el-container>
  <addUserModel ref="refAddUser" @emitAddMenu="emitAddMenu"></addUserModel>
  <el-dialog title="修改" v-model="dialogShow" width="37vw">
    <div v-if="editType == 'login_name'">
      <el-form-item label="修改登录名">
        <el-input v-model="editContent" placeholder="输入" />
      </el-form-item>
    </div>
    <div v-if="editType == 'login_password'">
      <el-form-item label="修改登录密码">
        <el-input v-model="editContent" type="password" placeholder="输入" />
      </el-form-item>
    </div>
    <div v-if="editType == 'edit'">
      <el-form-item label="代理商名称">
        <el-input v-model="name" placeholder="输入" />
      </el-form-item>
      <el-form-item
        v-for="(item, index) in comArray"
        :key="index"
        label="代理商域名"
      >
        <el-input v-model="item.url" placeholder="输入代理商域名">
          <template #append>
            <span style="color: red; cursor: pointer" @click="delDomain(index)"
              >删除</span
            >
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button @click="addUrl" :icon="Plus" type="primary"
          >增加域名</el-button
        >
      </el-form-item>
    </div>
    <template #footer>
      <el-button @click="dialogShow = false">取 消</el-button>
      <el-button type="primary" @click="confirmEdit">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import api from "./server/api.js";
import addUserModel from "./components/addUserModel.vue";
import { reactive, ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { ArrowDown, Plus } from "@element-plus/icons-vue";

const comArray = ref([]);
const name = ref("");
const refAddUser = ref(null);
const editType = ref("");
const editContent = ref("");
const dialogShow = ref(false);
const currentUuid = ref("");
const dataObj = reactive({
  tableData: [],
  loading: false,
  totalRows: 0,
  currentPage: 1,
});

onMounted(() => {
  getProxy();
});

const addUrl = () => {
  comArray.value.push({
    url: "",
  });
};

const delDomain = (index) => {
  comArray.value.splice(index, 1);
};

const getProxy = async () => {
  const res = await api.getProxy();
  dataObj.tableData = res.data;
};

const statusProxy = async (type, data) => {
  const res = await api.statusProxy(data?.uuid, { status: type });
  if (res.errorCode == "") {
    ElMessage({
      type: "success",
      message: "操作成功",
    });
    getProxy();
  }
};

const confirmEdit = async () => {
  if (editType.value == "login_name") {
    if (editContent.value == "") {
      ElMessage({
        type: "error",
        message: "内容不能为空！！",
      });
      return;
    }
    const res = await api.statusProxy(currentUuid.value, {
      login_name: editContent.value,
    });
    if (res.errorCode == "") {
      ElMessage({
        type: "success",
        message: "操作成功",
      });
      dialogShow.value = false;
    }
  }
  if (editType.value == "login_password") {
    if (editContent.value == "") {
      ElMessage({
        type: "error",
        message: "内容不能为空！！",
      });
      return;
    }
    const res = await api.statusProxy(currentUuid.value, {
      login_password: editContent.value,
    });
    if (res.errorCode == "") {
      ElMessage({
        type: "success",
        message: "操作成功",
      });
      dialogShow.value = false;
    }
  }

  if (editType.value == "edit") {
    if (name.value == "") {
      ElMessage({
        type: "error",
        message: "代理商名称不能为空",
      });
      return;
    }
    if (comArray.value.length == 0) {
      ElMessage({
        type: "error",
        message: "代理商域名不能为空",
      });
      return;
    }
    let isBool = true;
    comArray.value.forEach((item) => {
      if (item.url == "") {
        isBool = false;
      }
    });
    if (!isBool) {
      ElMessage({
        type: "error",
        message: "代理商域名不能为空",
      });
      return;
    }
    console.log(33);
    const domains = comArray.value.map(item => item.url);
        const res = await api.statusProxy(currentUuid.value, {
      name: name.value,
      domains
    });
    if (res.errorCode == "") {
      ElMessage({
        type: "success",
        message: "操作成功",
      });
      dialogShow.value = false;
    } else {
        ElMessage({
        type: "error",
        message: res.errorMessage,
      });
    }
  }

  getProxy();
};

const typeSelect = (type, data) => {
  editType.value = type;
  currentUuid.value = data.uuid;
  dialogShow.value = true;
  if (type == "edit") {
    comArray.value = [];
    name.value = data.name;
    data.domains.forEach((item) => {
      comArray.value.push({ url: item });
    });
  }
};

const refresh = () => {
  console.log(22);
};
const paginationChange = (e) => {};

const handleSizeChange = (e) => {};

const emitAddMenu = () => {
  getProxy();
};

const openProxy = (type) => {
  refAddUser.value.hasView = true;
};
</script>
