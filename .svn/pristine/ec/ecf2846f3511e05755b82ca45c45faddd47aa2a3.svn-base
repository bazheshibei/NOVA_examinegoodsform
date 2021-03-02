
<!-- 模块：表格 -->

<template>
  <div class="comTableBox">
    <div class="comTableTitle">
      <span>分仓验货明细</span>
      <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
      <el-button v-if="pageType === 'add' || pageType === 'update'" type="primary" size="mini" plain @click="addData">增加验货明细</el-button>
    </div>
    <el-table :data="tableList" border :header-cell-style="{ background: 'none' }" :span-method="objectSpanMethod">
      <!-- 操作 -->
      <el-table-column label="操作" align="center" width="80">
        <template slot-scope="scope">
          <div class="comCell" v-if="pageType === 'view'">
            <span>--</span>
          </div>
          <div class="comCell" v-else-if="!scope.row.dispatch_order_id">
            <el-button size="mini" type="danger" plain @click="deleteData(scope.row)">删除</el-button>
          </div>
          <div class="comCell" v-else>
            <span>--</span>
          </div>
        </template>
      </el-table-column>
      <!-- 仓库 -->
      <el-table-column align="center" width="150">
        <template slot="header" slot-scope="scope">
          <span class="red">*</span>仓库
        </template>
        <template slot-scope="scope">
          <div class="comCell" v-if="pageType === 'view'">
            <span>{{scope.row.store_name}}</span>
          </div>
          <div class="comCell" v-else-if="scope.row.dispatch_order_id">
            <span>{{scope.row.store_name}}</span>
          </div>
          <div class="comCell" v-else>
            <el-select v-model="scope.row.store_name" size="mini" @change="eventChange(scope.row, 'store_name', $event)">
              <el-option class="comSelectOptions" v-for="(item, index) in storehouse" :key="'store_name_' + index" :label="index" :value="index"></el-option>
            </el-select>
          </div>
        </template>
      </el-table-column>
      <!-- 验货日期 -->
      <el-table-column align="center" width="160">
        <template slot="header" slot-scope="scope">
          <span class="red">*</span>验货日期
        </template>
        <template slot-scope="scope">
          <div class="comCell" v-if="pageType === 'view'">
            {{scope.row.examine_time}}
          </div>
          <div class="comCell" v-else-if="scope.row.custom_store_id">
            <el-date-picker class="comDatePicker" type="date" size="mini" placeholder="请选择日期" editable value-format="yyyy-MM-dd" v-model="scope.row.examine_time" @change="changeTime(scope.row)"></el-date-picker>
          </div>
          <div class="comCell" v-else style="text-align: center;">--</div>
        </template>
      </el-table-column>
      <!-- 验货人 -->
      <el-table-column align="center" width="150">
        <template slot="header" slot-scope="scope">
          <span class="red">*</span>验货人
        </template>
        <template slot-scope="scope">
          <div class="comCell" v-if="pageType === 'view'">
            {{scope.row.examine_name}}
          </div>
          <div class="comCell" v-else-if="scope.row.custom_store_id">
            <el-input size="mini" v-model="scope.row.examine_name" placeholder="请输入验货人" @blur="blurName(scope.row)"></el-input>
          </div>
          <div class="comCell" v-else style="text-align: center;">--</div>
        </template>
      </el-table-column>
      <!-- 验货结果 -->
      <el-table-column align="center" width="150">
        <template slot="header" slot-scope="scope">
          <span class="red">*</span>验货结果
        </template>
        <template slot-scope="scope">
          <div class="comCell" v-if="pageType === 'view'">
            {{{ 0: '不合格', 1: '合格' }[scope.row.examine_result]}}
          </div>
          <div class="comCell" v-else-if="scope.row.custom_store_id">
            <el-select v-model="scope.row.examine_result" size="mini" @change="eventChange(scope.row, 'examine_result', $event)">
              <el-option class="comSelectOptions" v-for="(item, index) in arrResult" :key="'examine_result_' + index" :label="item" :value="index"></el-option>
            </el-select>
          </div>
          <div class="comCell" v-else style="text-align: center;">--</div>
        </template>
      </el-table-column>
      <el-table-column label="不合格原因" align="center">
        <!-- 原因类型 -->
        <el-table-column align="center" width="150">
          <template slot="header" slot-scope="scope">
            <span class="red">*</span>原因类型
          </template>
          <template slot-scope="scope">
            <div class="comCell" v-if="pageType === 'view' && scope.row.examine_result === '0'">
              {{arrResultType[scope.row.reason_type] ? arrResultType[scope.row.reason_type].label : ''}}
            </div>
            <div class="comCell" v-else-if="scope.row.examine_result === '0'">
              <el-select v-model="scope.row.reason_type" size="mini" @change="eventChange(scope.row, 'reason_type', $event)">
                <el-option class="comSelectOptions" v-for="item in arrResultType" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </div>
            <div class="comCell" v-else>--</div>
          </template>
        </el-table-column>
        <!-- 原因描述 -->
        <el-table-column align="center" width="150">
          <template slot="header" slot-scope="scope">
            <span class="red">*</span>原因描述
          </template>
          <template slot-scope="scope">
            <div class="comCell" v-if="pageType === 'view' && scope.row.examine_result === '0'">
              <span v-for="(viewItem, viewIndex) in (arrResultType[scope.row.reason_type] ? arrResultType[scope.row.reason_type].arr : [])" :key="'view_' + viewIndex"
                v-show="viewItem.value === scope.row.reason_desc"
              >
                {{viewItem.label}}
              </span>
            </div>
            <div class="comCell" v-else-if="scope.row.examine_result === '0'">
              <el-select v-model="scope.row.reason_desc" size="mini" @change="eventChange(scope.row, 'reason_desc', $event)">
                <el-option class="comSelectOptions" v-for="item in (arrResultType[scope.row.reason_type] ? arrResultType[scope.row.reason_type].arr : [])" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </div>
            <div class="comCell" v-else>--</div>
          </template>
        </el-table-column>
        <!-- 比例 -->
        <el-table-column align="center" width="120">
          <template slot="header" slot-scope="scope">
            <span class="red">*</span>比例（%）
          </template>
          <template slot-scope="scope">
            <div class="comCell" v-if="pageType === 'view' && scope.row.examine_result === '0'">
              {{scope.row.ratio}}
            </div>
            <div class="comCell" v-else-if="scope.row.examine_result === '0'">
              <el-input class="comSelectInput" size="mini" placeholder="请输入比例"
                v-model="scope.row.ratio" @change="eventChange(scope.row, 'ratio', $event)" @blur="blurRatio(scope.row, 'ratio', scope.row.ratio)"
              ></el-input>
            </div>
            <div class="comCell" v-else>--</div>
          </template>
        </el-table-column>
        <!-- 责任归属 -->
        <el-table-column width="400">
          <template slot="header" slot-scope="scope">
            <span class="red">*</span>责任归属
          </template>
          <template slot-scope="scope">
            <div class="comCell" v-if="pageType === 'view' && scope.row.examine_result === '0'">
              <div class="comCheckboxBox">
                <span class="comCheckboxLabel">内部：</span>
                <el-checkbox-group v-model="scope.row.accountability.in" disabled>
                  <el-checkbox :label="item.label" v-for="item in arrIn" :key="'out_' + item.label">{{item.text}}</el-checkbox>
                </el-checkbox-group>
              </div>
              <div class="comCheckboxBox">
                <span class="comCheckboxLabel">外部：</span>
                <el-checkbox-group v-model="scope.row.accountability.out" disabled>
                  <el-checkbox :label="item.label" v-for="item in arrOut" :key="'out_' + item.label">{{item.text}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            <div class="comCell" v-else-if="scope.row.examine_result === '0'">
              <div class="comCheckboxBox">
                <span class="comCheckboxLabel">内部：</span>
                <el-checkbox-group v-model="scope.row.accountability.in" @change="eventCheckbox">
                  <el-checkbox :label="item.label" v-for="item in arrIn" :key="'out_' + item.label">{{item.text}}</el-checkbox>
                </el-checkbox-group>
              </div>
              <div class="comCheckboxBox">
                <span class="comCheckboxLabel">外部：</span>
                <el-checkbox-group v-model="scope.row.accountability.out" @change="eventCheckbox">
                  <el-checkbox :label="item.label" v-for="item in arrOut" :key="'out_' + item.label">{{item.text}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            <div class="comCell" v-else style="text-align: center;">--</div>
          </template>
        </el-table-column>
        <!-- 归属说明 -->
        <el-table-column label="归属说明" align="center" width="150">
          <template slot-scope="scope">
            <div class="comCell" v-if="pageType === 'view' && scope.row.examine_result === '0'">
              {{scope.row.detail_explain}}
            </div>
            <div class="comCell" v-else-if="scope.row.examine_result === '0'">
              <el-input class="comSelectInputLeft" size="mini" placeholder="请输入归属说明"
                v-model="scope.row.detail_explain" @change="eventChange(scope.row, 'detail_explain', $event)"
              ></el-input>
            </div>
            <div class="comCell" v-else>--</div>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" align="center" width="60">
          <template slot-scope="scope">
            <div class="comCell" v-if="pageType === 'view' && scope.row.examine_result === '0'">--</div>
            <div class="comCell" v-else-if="scope.row.examine_result === '0'">
              <i class="el-icon-circle-plus-outline tableIcon iconPlus" v-if="!scope.row.key" @click="activeAdd(scope.row)"></i>
              <i class="el-icon-remove-outline tableIcon" v-else @click="activeDelete(scope.row)"></i>
            </div>
            <div class="comCell" v-else>--</div>
          </template>
        </el-table-column>
      </el-table-column>
      <!-- 处理方式 -->
      <el-table-column align="center" width="150">
        <template slot="header" slot-scope="scope">
          <span class="red">*</span>处理方式
        </template>
        <template slot-scope="scope">
          <div class="comCell" v-if="pageType === 'view' && scope.row.custom_store_id && scope.row.examine_result === '0'">
            {{scope.row.handle_mode}}
          </div>
          <div class="comCell" v-else-if="scope.row.custom_store_id && scope.row.examine_result === '0'">
            <el-select v-model="scope.row.handle_mode" size="mini" @change="eventChange(scope.row, 'handle_mode', $event)">
              <el-option class="comSelectOptions" v-for="item in arrHandlingType" :key="item.label" :label="item.text" :value="item.label"></el-option>
            </el-select>
          </div>
          <div class="comCell" v-else style="text-align: center;">--</div>
        </template>
      </el-table-column>
      <!-- 备注 -->
      <el-table-column label="备注" align="center" width="150">
        <template slot-scope="scope">
          <div class="comCell" v-if="pageType === 'view' && scope.row.custom_store_id">
            {{scope.row.remark}}
          </div>
          <div class="comCell" v-else-if="scope.row.custom_store_id">
            <el-input class="comSelectInputLeft" size="mini" placeholder="请输入备注"
              v-model="scope.row.remark" @change="eventChange(scope.row, 'remark', $event)"
            ></el-input>
          </div>
          <div class="comCell" v-else style="text-align: center;">--</div>
        </template>
      </el-table-column>
      <!-- 验货报告 -->
      <el-table-column min-width="400">
        <template slot="header" slot-scope="scope">
          <span class="red">*</span>验货报告
        </template>
        <template slot-scope="scope">
          <div class="comCell" v-if="scope.row.custom_store_id">
            <el-upload class="asd" action="#" multiple :file-list="scope.row.fileList"
               v-if="pageType !== 'view'"
              :on-preview="uploadLook" :http-request="uploadRequest" :before-remove="uploadRemove"
            >
              <el-button type="primary" size="mini" plain @click="id = scope.row.examine_detail_id">上传验货报告</el-button>
            </el-upload>
            <el-upload v-else class="asd" action="#" multiple :file-list="scope.row.fileList" disabled :on-preview="uploadLook"></el-upload>
          </div>
          <div class="comCell" v-else style="text-align: center;">--</div>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  data() {
    return {
      id: ''
    }
  },
  created() {},
  computed: {
    ...mapState(['tableData', 'arrResult', 'arrResultType', 'arrResultDetail', 'arrOut', 'arrIn', 'arrHandlingType', 'storehouse', 'tableArray', 'tableActive', 'pageType']),
    ...mapGetters(['tableList'])
  },
  methods: {
    /**
     * [验货人：给其他数据（合并的）赋值]
     * @param {[Object]} row 本条数据
     */
    blurName(row) {
      const { store_name, index } = row
      const arr = this.tableData[`${index}.${store_name}`]
      let str = ''
      arr.map(function (item, index) {
        if (index === 0) {
          str = item.examine_name
        } else {
          item.examine_name = str
        }
      })
    },
    /**
     * [比例：输入值改为数字]
     * @param {[Object]} row  本条数据
     * @param {[String]} name 属性名
     * @param {[String]} val  属性值
     */
    blurRatio(row, name, val) {
      const { store_name, index, key } = row
      this.tableData[`${index}.${store_name}`][key].ratio = isNaN(parseFloat(val)) ? 0 : parseFloat(val)
    },
    /**
     * [上传附件：查看]
     */
    uploadLook(file) {
      const { is_pic, name, url } = file
      if (is_pic === 1) {
        /* 图片：预览 */
        window.open(url)
      } else {
        /* 文件：下载 */
        const a = document.createElement('a')
        a.href = url
        a.download = name
        a.click()
      }
    },
    /**
     * [上传附件：覆盖默认的上传行为]
     */
    uploadRequest(params) {
      const { file } = this.$store.state
      const { id } = this
      if (!file[id]) {
        file[id] = {}
      }
      file[id][params.file.uid] = params.file
      this.$store.commit('assignData', { name: 'file', obj: file })
    },
    /**
     * [上传附件：删除]
     * @param {[Object]} file 删除的图片信息
     */
    uploadRemove(file) {
      const { file: obj, del_files } = this.$store.state
      const { id } = this
      const { uid, acce_id } = file
      if (acce_id) {
        /* 删除数据：之前保存 */
        del_files.push(acce_id)
      } else {
        /* 删除数据：新上传 */
        delete obj[id][uid]
        this.$store.commit('assignData', { name: 'file', obj })
      }
    },
    /**
     * [选择：验货日期]
     */
    changeTime(row) {
      /* 去重 */
      const { index, store_name, examine_time, custom_store_id } = row
      let status = true
      const { tableData } = this
      for (const x in tableData) {
        const data = tableData[x][0]
        if (data.index !== index && data.examine_time === examine_time && data.custom_store_id === custom_store_id) {
          this.$message({ message: `${store_name} 在 ${examine_time} 已有验货`, type: 'warning' })
          status = false
        }
      }
      /* 给其他数据（合并的）赋值 */
      const arr = this.tableData[`${index}.${store_name}`]
      let str = ''
      arr.map(function (item, index) {
        if (status) {
          if (index === 0) {
            str = item.examine_time
          } else {
            item.examine_time = str
          }
        } else {
          item.examine_time = ''
        }
      })
      /** change 事件：验货日期 **/
      this.$store.commit('changeTime')
    },
    /**
     * [数据：删除]
     * @param {[Object]} row 当前行的数据
     */
    deleteData(row) {
      const { index, store_name = '新增仓库' } = row
      this.$store.commit('deleteData', { name: 'tableData', key: `${index}.${store_name}` })
    },
    /**
     * [数据：增加]
     */
    addData() {
      const { tableData } = this
      /* 重置：索引数字 */
      const obj = {}
      let i = 0
      for (const x in tableData) {
        const name = `${i}.${x.split('.')[1]}`
        const data = tableData[x]
        obj[name] = data
        i++
      }
      /* 新增数据 */
      const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
      const uuid = []
      for (let i = 0; i < 32; i++) {
        uuid[i] = chars[0 | Math.random() * 16]
      }
      obj[`${i}.新增仓库`] = [
        {
          isLocal: true,
          accountability: { in: [], out: [] },
          create_time: '',
          creator: '',
          creator_id: '',
          custom_store_id: '',
          detail_explain: '',
          dispatch_order_id: '',
          examine_detail_duty_id: '',
          examine_detail_id: uuid.join(''),
          examine_goods_id: '',
          examine_name: '',
          examine_result: '',
          examine_time: '',
          file: {},
          fileList: [],
          handle_mode: '',
          in_post_id: '',
          index: i,
          is_delete: '',
          key: 0,
          outInTextArr: [],
          out_code: '',
          ratio: 0,
          reason_desc: '',
          reason_type: '',
          remark: '',
          resultNumCount: 0,
          store_name: undefined,
          update_time: '',
          updator: '',
          updator_id: ''
        }
      ]
      this.$store.commit('assignData', { name: 'tableData', obj })
    },
    /**
     * [change 事件：下拉框、输入框]
     * @param {[Object]} row  本条数据
     * @param {[String]} name 属性名
     * @param {[String]} val  属性值
     */
    eventChange(row, name, val) {
      const obj = this.tableData
      const { store_name, index, key } = row
      if (name === 'ratio') {
        /* 输入比例 */
        obj[`${index}.${store_name}`][key].ratio = parseFloat(val)
      }
      /**/
      if (name === 'handle_mode') {
        /* 给其他数据（合并的）赋值 */
        const { store_name, index } = row
        const arr = this.tableData[`${index}.${store_name}`]
        let str = ''
        arr.map(function (item, index) {
          if (index === 0) {
            str = item.handle_mode
          } else {
            item.handle_mode = str
          }
        })
      }
      if (name === 'store_name') {
        /* ----- 选中仓库 ----- */
        const custom_store_id = this.storehouse[val]
        /* 寻找当前数据 */
        let data = {}
        let dataKey = ''
        for (const x in obj) {
          const num = x.split('.')[0]
          if (num === String(index)) {
            data = obj[x]
            dataKey = x
            break
          }
        }
        /* 赋值 */
        data[key].store_name = val
        data[key].is_delete = '1'
        data[key].custom_store_id = custom_store_id
        /* 更新数据 */
        this.$store.commit('deleteData', { name: 'tableData', key: dataKey, type: true }) //           删除临时数据
        this.$store.commit('assignData', { name: 'tableData', obj: { [`${index}.${val}`]: data } }) // 添加选中仓库后的对象
      } else {
        /* ----- 其他变更 ----- */
        /* 原因类型：重置原因描述 */
        if (name === 'reason_type') {
          obj[`${index}.${store_name}`][key].reason_desc = ''
        }
        /** 更新数据 **/
        obj[`${index}.${store_name}`][key][name] = val
        this.$store.commit('assignData', { name: 'tableData', obj })
        /* 不合格 */
        if (name === 'examine_result') {
          /** change 事件：责任归属 **/
          this.$store.commit('changeCheckbox')
        }
      }
    },
    /**
     * [change 事件：多选框]
     */
    eventCheckbox(event) {
      /** change 事件：责任归属 **/
      this.$store.commit('changeCheckbox')
    },
    /**
     * [合并：表格单元格]
     */
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      const { tableData } = this
      if (columnIndex < 5 || columnIndex > 10) {
        if (!row.key) {
          const { store_name = '新增仓库', index } = row
          let length = 0
          for (let i = 0; i < tableData[`${index}.${store_name}`].length; i++) {
            const item = tableData[`${index}.${store_name}`][i]
            if (item.is_delete !== '0') {
              length++
            }
            if (i === 0 && item.examine_result === '1') {
              break
            }
          }
          return { rowspan: length, colspan: 1 } // 合并
        } else {
          return { rowspan: 0, colspan: 0 } //      隐藏
        }
      }
    },
    /**
     * [不合格原因：添加]
     * @param {[Object]} data 单行数据
     */
    activeAdd(data) {
      const { store_name, index } = data
      const val = { accountability: { in: [], out: [] } }
      const key = `${index}.${store_name}`
      for (const x in data) {
        if (x === 'accountability') {
          data[x].in.forEach(function (item) {
            val.accountability.in.push(item)
          })
          data[x].out.forEach(function (item) {
            val.accountability.out.push(item)
          })
        } else {
          val[x] = data[x]
        }
      }
      val.examine_detail_duty_id = ''
      this.$store.commit('pushData', { name: 'tableData', key, val })
    },
    /**
     * [不合格原因：删除]
     * @param {[Object]} data 单行数据
     */
    activeDelete(data) {
      const { store_name, index, key } = data
      /** 删除数据 **/
      this.$store.commit('spliceData', { name: 'tableData', key: `${index}.${store_name}`, index: key })
    }
  }
}
</script>

<style scope>
.comTableBox {
  margin-top: 5px;
  border-top: 1px solid #DCDFE6;
}
.comTableTitle {
  color: #409EFF;
  font-size: 14px;
  padding: 10px;
  background: #ecf5ff;
  flex: 1;
}

/*** 表格 ***/
.tableIcon { /* 操作 */
  color: #E6A23C;
  font-size: 16px;
}
.iconPlus { /* 操作：+ */
  color: #409EFF;
}
.comCell { /* 单元格内：容器 */
  padding: 2px 10px;
}
.comCheckboxBox { /* 多选框：容器 */
  display: flex;
}
.comCheckboxLabel { /* 多选框：标题 */
  white-space: nowrap;
}
.comCell > .comCheckboxBox:first-child {
  margin-bottom: 4px;
}

.red {
  color: #F56C6C;
  margin-right: 2px;
}
</style>

<style>
/*** 多选框 ***/
.comCheckboxBox > .el-checkbox-group { /* 选项组 */
  line-height: 10px;
}
.comCheckboxBox > .el-checkbox-group > .el-checkbox { /* 选项 */
  margin-right: 20px;
}
.comCheckboxBox > .el-checkbox-group > .el-checkbox > .el-checkbox__label { /* 选项：文字 */
  font-size: 12px !important;
  padding-left: 5px;
}
.is-checked > .el-checkbox__inner {
  background-color: #409EFF !important;
  border-color: #409EFF !important;
}

/*** 时间选择器 ***/
.comDatePicker {
  max-width: 135px;
}
</style>
