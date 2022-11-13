<template>
  <el-dialog title="绑定触点" v-model="dialogVisible">
    <el-form-item label="选择触点">
      <el-select v-model="selectId" style="width: 100%" placeholder="选择触点">
        <el-option
          v-for="item in selectArr"
          :key="item.uuid"
          :label="item.name"
          :value="item.uuid"
        />
      </el-select>
    </el-form-item>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="triggerConfirm">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import api from "../server/api.js";
import { onMounted, ref } from "vue";
import { ElMessage } from "element-plus";

const selectArr = ref([]);
const selectId = ref("");
const proxyId = ref("");

const dialogVisible = ref(false);

const emits = defineEmits(['success'])

onMounted(() => {
  getList();
});

const triggerConfirm = async () => {
  if (selectId.value == "") {
    ElMessage.error("请选择触点");
    return;
  }
  const res = await api.bindTouchPoints(proxyId.value, {
    touch_point_id: selectId.value,
  });
  if (res.errorCode == "") {
    ElMessage.success("添加成功");
    dialogVisible.value = false;
    emits('success')
  }
};

const open = (row) => {
  dialogVisible.value = true;
  proxyId.value = row.uuid;
};

const getList = async () => {
  const res = await api.getTouchPoints();
  selectArr.value = res.data;
};

defineExpose({
  open,
});
</script>
