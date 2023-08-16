<template>
  <el-dialog v-model="props.showPreviewDialog" append-to-body style="z-index:3000" title="预览" width="55%" :close-on-click-modal="false"
    :close-on-press-escape="false" :destroy-on-close="true" @close="closeDialog" top="10vh">
    <template v-if="props.type == 'img'">
      <div v-if="tools?.url">
        <div class="img-div">
          <img v-scale fit="cover" :src="tools.url" style="max-width: 90%;" alt="preview" />
        </div>
        <div class="preview-text">
          <span>{{ tools.name }}</span>
        </div>
      </div>
      <el-empty v-else description="暂无数据"></el-empty>
    </template>
    <template v-else>
      <div v-if="tools?.url">
        <!-- <xgVideo :src="tools.url"></xgVideo> -->
        <div class="preview-text">
          <span>{{ tools.name }}</span>
        </div>
      </div>
      <el-empty v-else description="暂无数据"></el-empty>
    </template>
    <div class="preview-btn" v-if="props.list.length > 1">
      <el-button :disabled="tools.currentIndex == 0" @click="next(props.type, 1)">上一个</el-button>
      <el-button :disabled="tools.currentIndex == props.list.length - 1" @click="next(props.type, 2)">下一个</el-button>
    </div>
  </el-dialog>
</template>
<script setup>
import { ref, reactive,  watch } from "vue";
// import xgVideo from "../vr-video/xgVideo";

const props = defineProps({
  showPreviewDialog: {
    type: Boolean,
    default: false
  },
  list: {
    type: Array,
    default: []
  },
  current: {
    type: Number,
    default: 0
  },
  type: {
    type: String,
    default: 'img'
  },
});
const ruleFormRefs = ref(null);
const tools = reactive({
  currentIndex: 0, // 当前图片index
  name: '',
  url: '',
});

watch(props, (val) => {
  tools.currentIndex = val?.current ?? 0;
  tools.url = val.list[tools.currentIndex]?.fileUrl;
  tools.name = val.list[tools.currentIndex]?.fileName;
},{
  immediate: true
});
const emit = defineEmits(["update:showPreviewDialog"]);

const closeDialog = () => {
  emit('update:showPreviewDialog', false);
}
// 视频切换
const next = (preview, type) => {
  // preview:img 图片      video  视频
  // type:1  切换上一个     2  切换下一个
  if (type == 1) {
    tools.currentIndex -= 1;
  } else {
    tools.currentIndex += 1;
  }
  tools.url = props.list[tools.currentIndex]?.fileUrl;
  tools.name = props.list[tools.currentIndex]?.fileName;
}
</script>
<style lang="scss">
.img-div {
  margin: 0 auto;
  width: 100%;
  min-height: 40vh;
  max-height: 60vh;
  overflow: auto;
  text-align: center;
}

.preview-text {
  text-align: center;
  padding: 15px 0 0;
}

.preview-btn {
  display: flex;
  justify-content: space-between;
  padding: 20px 0 10px;
}
</style>
