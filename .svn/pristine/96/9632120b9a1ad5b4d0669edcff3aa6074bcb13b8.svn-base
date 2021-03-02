// 组装模块并导出 store

import Vue from 'vue'
import Vuex from 'vuex'
import Tool from './tool.js' // 工具方法
import Dev from './dev.js' //   本地开发代码
import Prod from './prod.js' // 生产环境代码

/* 模块 */
// import UserInfo from './modules/userInfo' //     用户信息
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    // UserInfo, Shop, Menu, Table, Order, Beforehand, Music
  },

  state: {
    nowCodeType: 'Prod', //     当前代码类型
    codeObj: { Dev, Prod }, // 代码类型 { Dev: '开发', Prod: '生产' }
    /**/
    helpText: '', //                       帮助文字
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
      state.codeObj[state.nowCodeType].A_showAddView(state, commit, item_id)
    },
    /**
     * [请求：保存]
     */
    A_addExamineGoods({ state, getters }, { submitType }) {
      state.codeObj[state.nowCodeType].A_addExamineGoods(state, getters, submitType)
    },
    /**
     * [请求：甘特表帮助按钮]
     */
    A_getHelpText({ state }) {
      state.codeObj[state.nowCodeType].A_getHelpText(state)
    }
  }

})

export default store
