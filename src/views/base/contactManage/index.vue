<template>
  <el-container>
    <el-header>
      <div style="width: 100%">
        <el-row :gutter="10">
          <el-col :span="17">
            <el-input
              v-model="search"
              style="width: 50%"
              placeholder="输入搜索"
            ></el-input>
            <el-button
              type="primary"
              style="margin-left: 30px"
              @click="triggerSearch"
              >搜索</el-button
            >
          </el-col>
          <el-col :span="7">
            <el-button type="primary" :icon="Plus" @click="triggerAdd"
              >新增触点</el-button
            >
          </el-col>
        </el-row>
      </div>
    </el-header>
    <el-main class="nopadding">
      <vrTable
        ref="refTable"
        :column="tableConfig.talbeColumn"
        :data="tableConfig.data"
        :url="tableConfig.url"
      >
        <!-- <template
          v-for="(item, index) in tableConfig.talbeColumn"
          :key="index"
          #[item.prop]
        >
          <component :is="item.slot"></component>
        </template> -->

        <template #is_default="scope">
          <el-tag :type="parseDefault(scope.row.is_default)?.type">{{
            parseDefault(scope.row.is_default)?.label
          }}</el-tag>
        </template>
        <template #status="scope">
          <el-tag :type="parseStatus(scope.row.status)?.type">{{
            parseStatus(scope.row.status)?.label
          }}</el-tag>
        </template>

        <el-table-column align="center" prop="name" label="操作" width="260" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              text
              @click="triggerDefault(scope.row)"
              >全局触点</el-button
            >
            <el-button
              type="warning"
              size="small"
              text
              @click="triggerEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="small"
              text
              @click="triggerDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </vrTable>
    </el-main>
  </el-container>
  <add ref="refAdd" @success="success"></add>
</template>

<script setup>
import api from "./server/api.js";
import add from "./components/add.vue";
import { onMounted, reactive, ref } from "vue";
import vrTable from "./components/vr-table.vue";
import template1 from "./components/template1.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus } from "@element-plus/icons-vue";

const refAdd = ref(null);
const refTable = ref(null);

const search = ref("");

const tableConfig = reactive({
  data: [],
  url: "/api/touchPoints",
  talbeColumn: [
    {
      prop: "name",
      label: "触点名称",
    },
    {
      prop: "app_code",
      label: "触点应用编码(ID)",
      toolTip: true,
      align: "center",
    },
    {
      prop: "dev_code",
      label: "触点发展人编码",
    },
    {
      prop: "owner_name",
      label: "触点负责人姓名",
    },
    {
      prop: "owner_phone",
      label: "触点负责人手机号",
    },
    {
      prop: "is_default",
      label: "是否全局",
      slot: true,
    },
    {
      prop: "status",
      label: "状态",
      slot: true,
    },
  ],
});

const triggerAdd = () => {
  refAdd.value.open("add");
};

const parseStatus = (status) => {
  const statusObj = {
    silence: { label: "静默", type: "info" },
    active: { label: "活动", type: "success" },
  };

  return statusObj[status];
};

const triggerSearch = () => {
  refTable.value.handleData({ search: search.value });
};

const triggerDefault = async (row) => {
  ElMessageBox.confirm(
    "如果当前已存在全局触点，会设置当前触点为新的全局触点，是否确认当前操作",
    "提示",
    {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    }
  ).then(async () => {
    const res = await api.setDefault(row.uuid);
    if (res.errorCode == "") {
      ElMessage.success("成功");
      refTable.value.handleData();
    } else {
      ElMessage.error(res.errorMessage);
    }
  });
};

const parseDefault = (status) => {
  const defaultObj = {
    true: { label: "是", type: "success" },
    false: { label: "否", type: "info" },
  };

  return defaultObj[status];
};

const triggerEdit = (row) => {
  refAdd.value.open("edit", row);
  refTable.value.handleData();
};

const triggerDelete = (row) => {
  console.log(row);
    ElMessageBox.confirm(
    "你确认要删除吗？",
    "提示",
    {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    }
  ).then(async () => {
    const res = await api.deleteData(row.uuid);
    if (res.errorCode == "") {
      ElMessage.success("删除成功");
      refTable.value.handleData();
    } else {
      ElMessage.error(res.errorMessage);
    }
  });
}

const success = () => {
  refTable.value.handleData();
};
</script>

<style scoped lang="scss">
.el-header {
  border-bottom: none;
}
</style>
