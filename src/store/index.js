// 组装模块并导出 store

import Vue from 'vue'
import Vuex from 'vuex'
import Api from '@/config/api'
import Tool from './tool.js'
import { Loading, MessageBox } from 'element-ui'
/* 模块 */
// import UserInfo from './modules/userInfo' //     用户信息
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    // UserInfo, Shop, Menu, Table, Order, Beforehand, Music
  },

  state: {
    pageType: '', //                       页面类型  'add'新增  'update'修改  'view'查看  'modify'变更
    /* 数据 */
    storehouse: {}, //                     仓库
    examineGoods: {}, //                   报告信息
    examineBusinessPostList: {}, //        岗位对应比例
    customMap: {}, //                      客户信息
    tableData: {}, //                      表格：原始数据
    /* 选项 */
    peopleList: {}, //                     岗位下：人员列表
    arrResultType: {}, //                  原因类型
    arrOut: {}, //                         外部
    arrIn: {}, //                          内部
    arrHandlingType: {}, //                处理方式
    /* 上传附件 */
    file: {}, //                           附件对象
    del_files: [], //                      删除的附件ID数组
    /** 表单 **/
    formData: [],
    time: '', //                           验货日期
    /* 变更 */
    modify_reason: '', //                  变更原因
    modify_content: '', //                 变更内容
    /** 表格 **/
    arrResult: { 0: '不合格', 1: '合格' } // 验货结果
  },

  getters: {
    /**
     * [整理：表格数据]
     */
    tableList: (state) => {
      return Tool.tableList(state)
    },
    /**
     * [不合格原因汇总]
     */
    summary: (state) => {
      return Tool.summary(state)
    },
    /**
     * [责任划分（计算文本框外的数字）]
     */
    accountability: (state) => {
      return Tool.accountability(state)
    }
  },

  mutations: {
    /**
     * [change 事件：验货日期]
     */
    changeTime(state) {
      Tool.changeTime(state)
    },
    /**
     * [change 事件：责任归属]
     */
    changeCheckbox(state) {
      Tool.changeCheckbox(state)
    },
    /**
     * [保存数据]
     * @param {[String]} name 属性名
     * @param {[Object]} obj  属性值
     */
    saveData(state, params) {
      const { name, obj } = params
      state[name] = obj
    },
    /**
     * [添加数据]
     * @param {[String]} name 属性名
     * @param {[Object]} obj  属性值
     */
    assignData(state, params) {
      const { name, obj } = params
      const data = state[name] || {}
      state[name] = Object.assign({}, data, obj)
    },
    /**
     * [删除数据]
     * @param {[String]}  name 属性名
     * @param {[Stroing]} key  值索引
     */
    deleteData(state, params) {
      const { name, key, type = false } = params
      const data = state[name] || {}
      if (type) {
        delete data[key]
      } else {
        data[key].length = 1
        data[key][0].is_delete = '0'
      }
      state[name] = Object.assign({}, data)
    },
    /**
     * [插入数据：责任归属]
     * @param {[String]} name 属性名
     * @param {[String]} key  键
     * @param {[Object]} val  值
     */
    pushData(state, params) {
      const { name, key, val } = params
      state[name][key].push(val)
    },
    /**
     * [插入数据：责任归属]
     * @param {[String]} name  属性名
     * @param {[String]} key   对象索引
     * @param {[Int]}    index 数组索引
     */
    spliceData(state, params) {
      const { name, key, index } = params
      state[name][key].splice(index, 1)
    }
  },

  actions: {
    /**
     * [请求：页面数据]
     */
    A_showAddView({ state, commit }, { item_id }) {
      const name = '页面数据'
      const obj = { item_id }
      const suc = function (res) {
        // console.log('返回的数据 ----- ', res)
        const { examineGoods, customMap, examineGoodsDetailList, wbzrgs, businessPostList, examineNoQualifyList, yhclfs, examineBusinessPostList } = res
        const { tableData, storehouse } = Tool.returnTableObj(examineGoodsDetailList)
        const formData = Tool.returnFormData(examineBusinessPostList, examineGoods, businessPostList)
        /* 数据 */
        state.examineGoods = Tool.returnExamineGoods(examineGoods) //  报告信息
        state.examineBusinessPostList = examineBusinessPostList //     岗位对应比例
        state.customMap = customMap //                                 客户信息
        state.formData = formData //                                   表单数据
        state.tableData = tableData //                                 表格：原始数据
        state.storehouse = storehouse //                               仓库
        /* 选项 */
        state.peopleList = Tool.peopleList(businessPostList) //        岗位下：人员列表
        state.arrOut = Tool.returnArrOut(wbzrgs) //                    外部
        state.arrIn = Tool.returnArrIn(businessPostList) //            内部
        state.arrResultType = Tool.returnCate(examineNoQualifyList) // 原因类型
        state.arrHandlingType = Tool.returnYhclfs(yhclfs) //           处理方式
        /* change 事件：验货日期 */
        commit('changeTime')
        /** change 事件：责任归属 **/
        commit('changeCheckbox')
      }
      Api({ name, obj, suc })
    },
    /**
     * [请求：保存]
     */
    A_addExamineGoods({ state, getters }, { submitType }) {
      /* 报告信息 */
      const { examine_goods_id, item_id, custom_id, final_examine_result, final_explain, examine_time, deliver_type } = state.examineGoods
      const obj = { examine_goods_id, item_id, custom_id, final_examine_result, state: submitType, final_explain, examine_time, deliver_type }
      /* 附件 */
      const { file, del_files } = state
      obj.file = file
      obj.del_files = del_files
      /* 验货明细 */
      const { tableData } = state
      const { arr_detail, error_detail } = Tool.submitExamine_goods_detail(tableData, file, del_files) // 提交：验货明细
      obj.examine_goods_detail = JSON.stringify(arr_detail)
      /* 责任划分 */
      const { formData, examineBusinessPostList, arrIn } = state
      const { examine_business_post, inside_ratio, outside_ratio } = Tool.submitExamine_business_post(formData, examineBusinessPostList, arrIn)
      // console.log('责任划分 ----- ', examine_business_post)
      obj.examine_business_post = JSON.stringify(examine_business_post) // 责任划分
      obj.inside_ratio = inside_ratio //                                   内部占比
      obj.outside_ratio = outside_ratio //                                 外部占比
      /* 变更说明 */
      const { pageType, modify_reason, modify_content } = state
      if (pageType === 'modify') {
        obj.modify_reason = modify_reason
        obj.modify_content = modify_content
      }
      /* 确认完成 -> 验证 */
      const warningArr = []
      if (submitType === 1) {
        /* 验证：综合验货结果 */
        if (final_examine_result === null || !final_examine_result.length) {
          warningArr.push('<p>综合验货结果</p>')
        }
        /* 验证：责任划分 */
        const { accountability } = getters
        const provingText = Tool.provingAccountability(accountability)
        if (provingText) {
          warningArr.push(`<p>${provingText}</p>`)
        }
        /* 验证：验货明细 */
        if (error_detail.length) {
          warningArr.push(`验货明细：${error_detail.join('、')}`)
        }
        /* 验证：变更说明 */
        if (pageType === 'modify') {
          if (modify_reason === '') {
            warningArr.push('<p>变更原因</p>')
          }
          if (modify_content === '') {
            warningArr.push('<p>变更内容</p>')
          }
        }
      }
      // console.log('obj ----- ', obj)
      if (submitType === 1 && warningArr.length) {
        /* 报错提示 */
        MessageBox.alert(warningArr.join(''), '请完善信息后再提交', { dangerouslyUseHTMLString: true })
      } else {
        /* 发起请求 */
        const loadingInstance = Loading.service({})
        const name = pageType === 'modify' ? '变更' : '保存'
        const suc = function (res) {
          loadingInstance.close()
          // eslint-disable-next-line
          dg.close()
        }
        Api({ name, obj, suc })
      }
    }
  }

})

export default store
