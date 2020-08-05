
<!-- 录入验货报告 -->

<template>
  <div class="pageBox" v-on:scroll="pageScroll" ref="page">

    <!-- 模块：变更 -->
    <com-change v-if="pageType === 'modify'"></com-change>

    <!-- 模块：表单 -->
    <com-form></com-form>

    <!-- 模块：表格 -->
    <com-table></com-table>

    <!-- 底部按钮 -->
    <div class="bottomBox">
      <el-button size="mini" type="warning" plain @click="submit(0)"
        v-if="pageType === 'add' || pageType === 'update'"
      >
        暂存草稿
      </el-button>
      <el-button size="mini" type="primary" plain @click="submit(1)"
        v-if="pageType !== 'view'"
      >
        {{pageType === 'modify' ? '确认变更' : '确认完成'}}
      </el-button>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import ComForm from './components/form.vue' //     模块：表单
import ComTable from './components/table.vue' //   模块：表格
import ComChange from './components/change.vue' // 模块：变更
export default {
  components: { ComForm, ComTable, ComChange },
  data() {
    return {
      scrollTop: 0
    }
  },
  created() {
    const local = JSON.parse(localStorage.getItem('NOVA_examineGoods')) || {}
    const { pageType = '', item_id = '40289281711abb1a01711b25c4810000' } = local
    this.$store.commit('saveData', { name: 'pageType', obj: pageType })
    /** 请求：页面数据 **/
    this.$store.dispatch('A_showAddView', { item_id })

    // /* 平台方法 */
    // // eslint-disable-next-line
    // dg.removeBtn('cancel')
    // // eslint-disable-next-line
    // dg.removeBtn('saveAndAdd')
    // // eslint-disable-next-line
    // dg.removeBtn('saveAndClose')
    // // eslint-disable-next-line
    // dg.removeBtn('saveNoClose')
  },
  computed: {
    ...mapState(['pageType', 'modify_reason', 'modify_content'])
  },
  methods: {
    /**
     * [提交表单]
     * @param {[Int]} submitType 1 验证（确认完成）  0 不验证（暂存草稿
     */
    submit(submitType) {
      this.$store.dispatch('A_addExamineGoods', { submitType })
    },
    /**
     * [页面滚动事件]
     */
    pageScroll(event) {
      const newNum = event.target.scrollTop
      const oldNum = this.scrollTop
      if (Math.abs(newNum - oldNum) < 300) {
        this.scrollTop = event.target.scrollTop
        this.$refs.page.scrollTop = newNum
      } else {
        this.$refs.page.scrollTop = oldNum
      }
    },
    /**
     * [兼容IE11：数组includes]
     * @param  {[String]}  str 关键字
     * @param  {[Array]}   arr 数组
     * @return {[Boolean]}     true || false
     */
    arrIncludes(str, arr) {
      let status = false
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === str) {
          status = true
        }
      }
      return status
    }
  }
}
</script>

<style scoped>
.pageBox {
  width: 100%;
  height: 100%;
  background: #ffffff;
  overflow-y: auto;
}
.ComTable {
  margin-top: 20px;
  border-top: 1px solid #a6eaf1;
}
.bottomBox {
  padding: 2px 15px;
  display: flex;
  justify-content: flex-end;
}
</style>

<style>
/*** 模块刷新 ***/
.f5 {
  color: #909399;
  cursor: pointer;
  padding: 0 6px;
}

/*** 表格字体 ***/
.el-table {
  font-size: 12px !important;
}
/*** 重置表头单元格 ***/
.el-table > div th, .el-table > div th > .cell {
  padding: 0 !important;
}
.el-table > div th > .cell .thText {
  padding: 5px 10px;
}
th > .cell, th > .cell .thText {
  text-align: center;
}
/*** 单元格 ***/
td {
  padding: 0 !important;
}
.cell p {
  /* line-height: 16px !important;
  margin: 4px 0 !important; */
}
td > .cell {
  /* text-align: center; */
  padding: 0 !important;
}

/*** 下拉框 ***/
.comSelectOptions { /* 下拉框：单个选项 */
  height: 25px !important;
  font-size: 12px !important;
  line-height: 25px !important;
  padding: 0 10px !important;
}
.comSelectInput > .el-input__inner { /* input */
  height: 28px !important;
  text-align: center;
}
.comSelectInputLeft > .el-input__inner { /* input */
  height: 28px !important;
  text-align: left;
}
/*** 输入框 ***/
.comInput > .el-input__inner { /* input */
  height: 20px !important;
  text-align: center !important;
}
</style>
