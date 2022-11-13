<template>
  <div class="table-main">
    <div class="table-content" v-loading="loading">
      <el-table
        ref="refTable"
        v-bind="$attrs"
        :data="data"
        :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
        :border="props.border ?? true"
        style="height: 100%"
      >
        <template v-for="(item, index) in column" :key="index">
          <el-table-column
            :column-key="item.prop"
            :label="item.label"
            :prop="item.prop"
            :width="item.width"
            :fixed="item.fixed"
            :show-overflow-tooltip="item.toolTip"
            :align="item.align ?? `center`"
          >
            <template #default="scope">
              <div v-if="item.slot">
                <slot :name="item.prop" v-bind="scope">
                </slot>
              </div>
              <div v-else>
                {{ scope.row[item.prop] }}
              </div>
            </template>
          </el-table-column>
        </template>
        <slot></slot>
        <template #empty>
          <el-empty description="暂无数据" :image-size="100"></el-empty>
        </template>
      </el-table>
    </div>
    <div class="table-footer">
      <div class="scTable-pagination">
        <el-pagination
          v-model:currentPage="tableConfig.currentPage"
          background
          :small="true"
          :layout="tableConfig.paginationLayout"
          :total="tableConfig.total"
          :page-size="tableConfig.pageSize"
          :page-sizes="tableConfig.pageSizes"
          @current-change="paginationChange"
          @update:page-size="pageSizeChange"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script setup>
import api from "../server/api.js";
import { ref, onMounted, watch, reactive } from "vue";

const loading = ref(false);

const props = defineProps({
  // 列名
  column: {
    type: Array,
    default: () => [],
  },
  // 第一种渲染方式-传url
  url: {
    type: String,
    default: "",
  },
  // 第二种渲染方式-传data(包含table数据及总数)
  tableData: {
    type: Object,
    default: () => ({
      data: [],
      total: 0,
    }),
  },
  //配置项-数据及总数
  config: {
    type: Object,
    default: () => ({
      dataAlias: "rows",
      totalAlias: "total",
      pageAlias: "page",
      pageSizeAlias: "page_size",
    }),
  },
});

// table数据
const data = ref([]);

// table基本配置
const tableConfig = reactive({
  currentPage: 1,
  total: 0,
  pageSize: 20,
  pageSizes: [20, 50],
  paginationLayout: "total,sizes,prev,pager, next",
});

onMounted(() => {
  handleData();
});

/**
 * 分支-传数据渲染和api渲染
 */
const handleData = (e) => {
  if (props.tableData && props.tableData.length > 0) {
    data.value = props.tableData[config.dataAlias];
    tableConfig.total = props.tableData[config.totalAlias];
  } else if (props.url) {
    getApiData(e);
  }
};

// api请求渲染方式
const getApiData = async (e) => {
  loading.value = true;
  
  const tableRes = await api.getTableList(props.url, {
    [props.config.pageAlias]: tableConfig.currentPage,
    [props.config.pageSizeAlias]: tableConfig.pageSize,
    ...e
  });

  parseData(tableRes.data);
  loading.value = false;
};

const paginationChange = (e) => {
  tableConfig.currentPage = e;
  getTableData();
};
const pageSizeChange = (e) => {
  tableConfig.pageSize = e;
  getTableData();
};

// 处理配置别名等数据
const parseData = (res) => {
  data.value = res[props.config.dataAlias];
  tableConfig.total = res[props.config.totalAlias];
};

defineExpose({
  handleData,
});
</script>

<style scoped lang="scss">
.table-main {
  height: 100%;
}
.table-content {
  height: calc(100% - 50px);
}
.table-footer {
  height: 50px;
  //   border-top: 1px solid #ebeef5;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 20px;
}
</style>
