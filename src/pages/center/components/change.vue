
<!-- 模块：变更 -->

<template>
  <div class="comTableBox" style="margin-top: 0;">

    <div class="comTableTitle">
      <span>变更说明</span>
    </div>

    <div class="formLine">
      <!-- 变更原因 -->
      <div class="formLabel"><span class="red">*</span>变更原因：</div>
      <div class="formText">
        <el-input class="input_reason" size="mini" v-model="modify_reason" @blur="blur('modify_reason')"></el-input>
      </div>
    </div>
    <div class="formLine">
      <!-- 变更内容 -->
      <div class="formLabel"><span class="red">*</span>变更内容：</div>
      <div class="formText">
        <el-input class="input_content" size="mini" type="textarea" v-model="modify_content" @blur="blur('modify_content')"></el-input>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      modify_reason: '',
      modify_content: ''
    }
  },
  methods: {
    /**
     * [输入框失焦]
     * @param {[String]} name 属性名
     */
    blur(name) {
      const obj = this[name]
      this.$store.commit('saveData', { name, obj })
    }
  }
}
</script>

<style scoped>
.comTableBox {
  margin-bottom: 5px;
  border-top: 1px solid #DCDFE6;
}
.comTableTitle {
  color: #409EFF;
  font-size: 14px;
  padding: 10px;
  background: #ecf5ff;
  flex: 1;
}

.formLine { /* 单行 */
  width: 100%;
  font-size: 12px;
  border-bottom: 1px solid #DCDFE6;
  display: flex;
}
.formLabel { /* 标题 */
  width: 110px;
  min-height: 34px;
  padding: 0 4px;
  border-right: 1px solid #DCDFE6;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.formText { /* 值 */
  padding: 6px 10px;
  border-right: 1px solid #DCDFE6;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  flex: 1;
}
.red {
  color: #F56C6C;
}

.input_reason {
  width: 30%;
  min-width: 500px;
}
.input_content {
  width: 50%;
  min-width: 800px;
}
</style>
