<template>
  <div>
    <el-button @click="defaultSelectSomeone">默认选中某项</el-button>
    <el-button @click="defaultSelectAll">默认选中全部</el-button>
    <el-cascader v-model="newVal" ref="casRef" clearable filterable :options="ceshi.options" :props="props1"
      :collapse-tags="true" placeholder="请选择" @change="selectHandle">
      <template #default="{ node, data }">
        <span>{{ data.label }}</span>
        <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
      </template>
    </el-cascader>
  </div>
</template>

<script>
import { toRaw } from "vue"
export default {
  data() {
    return {
      props1: { multiple: true },
      preSelected: [], // 上次选中的数据
      originData: [], //  源数据平铺成一级节点
      newVal: [],
      ceshi: {
        value1: [],
        options: [
          { label: '全选', value: '全选' },
          { label: '层级0', value: '0' },
          {
            label: '层级1', value: '1', children: [
              {
                label: '层级11', value: '11', children: [
                  { label: '层级111', value: '111', },
                  { label: '层级112', value: '112', }
                ]
              },
              {
                label: '层级12', value: '12', children: [
                  { label: '层级121', value: '121', }
                ]
              }
            ]
          },
          {
            label: '层级2', value: '2', children: [
              { label: '层级21', value: '21' },
              { label: '层级22', value: '22' },
            ]
          },
          {
            label: '层级3', value: '3', children: [
              { label: '层级31', value: '31' }
            ]
          }
        ]
      }
    }
  },
  methods: {
    defaultSelectSomeone() {
      this.ceshi.value1 = [['2', '21']];
    },
    defaultSelectAll() {
      this.selectHandle([['全选']])
    },
    judgetAllSelected(node) {
      // 判断是否是全选,也就是看已选择的选中中包不包含"全选"
      let isAllSelected = false
      for (let i = 0; i < node.length; i++) {
        if (node[i][0] === '全选') {
          isAllSelected = true
          break;
        }
      }
      return isAllSelected
    },
    loopFlatData(list = [], parentNode = []) {
      list.length > 0 && list.forEach(e => {
        let pNode = [...parentNode]; // 注意这里必须是深拷贝，否则会由于引用类型赋值的是地址（指针），导致parentNode在pNode更新时，同时被更新
        if (e.children && e.children.length > 0) {
          pNode.push(e.value)// 1 11
          this.loopFlatData(e.children, pNode)
        } else {
          if (e.label !== '全选') {
            if (parentNode.length > 0) {
              pNode.push(e.value)
              this.originData.push({ ...e, parentNode: pNode })
            } else {
              this.originData.push(e)
            }
          }
        }
      })
    },
    loopSelectData(list, parentNode = []) {
      list.length > 0 && list.forEach(e => {
        let pNode = [...parentNode]; // 注意这里必须是深拷贝，否则会由于引用类型赋值的是地址（指针），导致parentNode在pNode更新时，同时被更新
        if (e.children && e.children.length > 0) {
          pNode.push(e.value)// 1 11
          this.loopSelectData(e.children, pNode)
        } else {
          if (parentNode.length > 0) {
            this.ceshi.value1.push([...parentNode, e.value])
          } else {
            this.ceshi.value1.push([e.value])
          }
        }
      })
    },
    checkIsAddAllSelected() {
      let list = this.ceshi.options; // 原始数据列表
      if (this.originData.length === 0) {
        this.loopFlatData(list) // 把所有的父子级平铺成一个一级列表
      }
      let origin = this.originData;
      let now = [...this.ceshi.value1].filter(item => item[0] !== '全选')
      if (origin.length > now.length) {
        // 非全选时, 如果有之前选过全选,要把全选过滤掉
        this.ceshi.value1 = this.ceshi.value1.filter(item => item[0] !== '全选')
      } else {
        // 当所有的数据都选择时, 要自动把全选勾选上
        if (this.ceshi.value1[0] && this.ceshi.value1[0][0] !== '全选') {
          this.ceshi.value1 = [['全选'], ...this.ceshi.value1]
        }
      }
    },
    async selectHandle(node = []) {
      this.ceshi.value1 = []
      // 选中的数据格式: [['全选'], ['0'], ['1', '11', '111'], ['2', '21'],...]
      let list = this.ceshi.options
      let current = []; // 获取当前选中的option, 因为element文档中没有获取当前选中的option的方法,所以我通过上一次和本地的选中数据进行对比来获取
      if (node.length >= this.preSelected.length) {
        let keys = this.preSelected.map(item => JSON.stringify(item))
        current = node.filter(item => !keys.includes(JSON.stringify(item)))
        console.log('选中某项', current);
      } else {
        // 取消选中
        let keys = node.map(item => JSON.stringify(item))
        current = this.preSelected.filter(item => !keys.includes(JSON.stringify(item)))
        console.log('取消选中', current);
      }
      // 根据element的选中数据格式, 每一个选项都是一个列表, 列表第一项为父级value, 第二项为选中的子级value, ...以此类推
      const currentValue = current.length > 0 ? current[0][0] || '' : ''
      if (currentValue === '全选') {
        if (this.judgetAllSelected(node)) {
          this.loopSelectData(list)
        } else {
          this.ceshi.value1 = []
        }
      } else {
        this.ceshi.value1 = node
      }
      this.checkIsAddAllSelected(); // 主要是勾选或取消非“全选”项时，对于全选的逻辑处理
      this.preSelected = this.ceshi.value1; // 保存上一次的选择结果
      this.changeHandle();
    },
    changeHandle() {
      // 这里是处理成自己需要的数据格式, 需要把全选的这一选项过滤掉
      // 原始选择的数据格式[['全选'], ['1', '11'], ['2', '21'],...]
      // const hh = toRaw(this.ceshi.value1);
      //   console.log(hh);
      this.newVal = this.ceshi.value1.reverse();

      console.log(this.newVal);

    },

  }


}
</script>
  