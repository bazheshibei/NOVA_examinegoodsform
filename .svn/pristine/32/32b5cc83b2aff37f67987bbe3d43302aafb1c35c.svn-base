
import Tool from './tool.js'
import { MessageBox } from 'element-ui'

/**
 * 本地开发代码
 * @ [调用本地数据]
 * @ [不请求接口]
 */
const Dev = {}

/**
 * [请求：页面数据]
 */
Dev.A_showAddView = function (state, commit, item_id) {
  const res = JSON.parse(localStorage.getItem('验货报告'))
  const { examineGoods, customMap, examineGoodsDetailList, wbzrgs, businessPostList, examineNoQualifyList, yhclfs, examineBusinessPostList } = res
  const { tableData, storehouse } = Tool.returnTableObj(examineGoodsDetailList)
  const formData = Tool.returnFormData(examineBusinessPostList, examineGoods, businessPostList)
  console.log('formData ----- ', formData)
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

/**
 * [请求：保存]
 */
Dev.A_addExamineGoods = function (state, getters, submitType) {
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
  // console.log('明细 ----- ', arr_detail)
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
      warningArr.push('<p>综合验货结果：必选</p>')
    }
    /* 验证：责任划分 */
    const { accountability } = getters
    const provingText = Tool.provingAccountability(accountability)
    if (provingText) {
      warningArr.push(`<p>${provingText}</p>`)
    }
    /* 验证：验货明细 */
    if (error_detail.length) {
      warningArr.push(`验货明细：${error_detail.join('、')} 必填项需填写完整`)
    }
    /* 验证：变更说明 */
    if (pageType === 'modify') {
      if (modify_reason === '') {
        warningArr.push('<p>变更原因：必填</p>')
      }
      if (modify_content === '') {
        warningArr.push('<p>变更内容：必填</p>')
      }
    }
  }
  if (submitType === 1 && warningArr.length) {
    /* 报错提示 */
    MessageBox.alert(warningArr.join(''), '请完善信息后再提交', { dangerouslyUseHTMLString: true })
  } else {
    /* 发起请求 */
    console.log(pageType === 'modify' ? '变更' : '保存', ' ----- obj', obj)
  }
}

/**
 * [请求：甘特表帮助按钮]
 */
Dev.A_getHelpText = function (state) {
  console.log('甘特表帮助按钮 ----- help_page_url', 'LRYHBG')
}

export default Dev
