<template>
<div style="display: flex;flex-wrap: no-wrap">
  <div class="cc">
    1111111111111111111111111111111111111111111111111111111111111111111111111111111111SD发生的发生的发
  </div>
  <div>
<el-tag type="success">你好哇</el-tag>
  </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    aa: {
      type: String
    }
  })

</script>


<style scoped>
.cc {
  width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>