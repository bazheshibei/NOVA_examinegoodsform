// 接口

import Axios from '@/config/axios'

/**
 * [服务器地址]
 */
// const host = '/api/'
const host = window.location.origin + '/nova/'

/**
 * [接口地址]
 */
const url = {
  '页面数据': 'examineGoodsShowAction.ndo?action=showAddView',
  '保存': 'examineGoodsSaveAction.ndo?action=addExamineGoods',
  '变更': 'examineGoodsModifySaveAction.ndo?action=addExamineGoodsModify',
  '查看变更明细': 'examineGoodsModifyShowAction.ndo?action=showViewModify',
  '甘特表帮助按钮': 'noticeAction.ndo?action=getHelpText'
}

/**
 * [请求接口时，如果需要 loading 效果时，显示的文字]
 */
// const Loading = {
//   '下单接口': '下单中...'
// }

const request = function (param) {
  param.path = host + url[param.name]
  Axios(param)
}

export default request
