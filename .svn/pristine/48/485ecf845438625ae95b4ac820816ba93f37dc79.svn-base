
const Tool = {}

// 影响 责任划分
//   changeCheckbox  责任归属 事件
//   returnFormData  生成

/** ------------------------------ getters ------------------------------ **/

/**
 * [计算属性：表格数据]
 */
Tool.tableList = function (state) {
  const { tableData } = state
  let arr = []
  const arrObj = {}
  /* 按 1,2,3,4 添加到对象 */
  for (const x in tableData) {
    for (let i = 0; i < tableData[x].length; i++) {
      const val = tableData[x][i]
      /* 展示：未删除 */
      if (val.is_delete !== '0') {
        const index = x.split('.')[0]
        if (!arrObj[index]) {
          arrObj[index] = []
        }
        val.key = i
        arrObj[index].push(val)
        if (i === 0 && val.examine_result === '1') {
          // 此仓库验货结果：合格
          break
        }
      }
    }
  }
  /* 合并数组（保证列表数据一致） */
  for (const x in arrObj) {
    arr = arr.concat(arrObj[x])
  }
  return arr
}

/**
 * [计算属性：不合格原因汇总]
 */
Tool.summary = function (state) {
  const { tableData, arrOut, arrIn, arrResult, arrResultType } = state
  const obj = {}
  for (const x in tableData) {
    const arr = []
    let count = 0
    /* 单条：大数据 */
    tableData[x].forEach(function (item) {
      if (arrResult[item.examine_result] === '不合格' && item.is_delete === '1') {
        /* 抽取：责任归属（文字） */
        const outInTextArr = []
        item.accountability.out.forEach(function (val) {
          if (arrOut[val]) {
            outInTextArr.push(arrOut[val].text)
          }
        })
        item.accountability.in.forEach(function (val) {
          if (arrIn[val]) {
            outInTextArr.push(arrIn[val].text)
          }
        })
        item.outInTextArr = outInTextArr
        /* 累计：比例 */
        count += parseFloat(item.ratio || 0)
        /* 添加信息 */
        arr.push(item)
        /* 显示文字：原因类型 */
        item.typeText = item.reason_type ? arrResultType[item.reason_type].label : ''
        /* 显示文字：原因描述 */
        if (item.reason_type) {
          for (let i = 0; i < arrResultType[item.reason_type].arr.length; i++) {
            const { label, value } = arrResultType[item.reason_type].arr[i]
            if (value === item.reason_desc) {
              item.descText = label
              break
            }
          }
        } else {
          item.descText = ''
        }
      }
    })
    /* 记录：比例总数 */
    arr.forEach(function (item) {
      item.resultNumCount = parseInt(count)
    })
    /* 添加数据 */
    if (arr.length) {
      obj[x] = arr
    }
  }
  return obj
}

/**
 * [计算属性：责任划分（计算文本框外的数字）]
 */
Tool.accountability = function (state) {
  const { formData } = state
  const obj = { total: { type: 0, job: {}, peoples: {} }, jobNum: {}, peopleNum: {} }
  let inNum = 0 //       初始化：内部
  let outNum = 0 //      初始化：外部
  let inNumCount = 0 //  类型占比：内部
  let outNumCount = 0 // 类型占比：外部
  formData.forEach(function (item, index, arr) {
    let jobNumShow = 0 // 类型占比 * 岗位占比
    if (item.type === '内部') {
      inNum = item.typeNum ? item.typeNum : inNum
      /* 计算值：岗位占比 */
      jobNumShow = parseFloat(inNum) * parseFloat(item.jobNum || 0) / 100 // 类型占比 * 岗位占比
      obj.jobNum[item.job] = parseFloat(jobNumShow.toFixed(2))
      inNumCount += parseFloat(item.jobNum || 0)
    } else if (item.type === '外部') {
      outNum = item.typeNum ? item.typeNum : outNum
      /* 计算值：岗位占比 */
      jobNumShow = parseFloat(outNum) * parseFloat(item.jobNum || 0) / 100 // 类型占比 * 岗位占比
      obj.jobNum[item.job] = parseFloat(jobNumShow.toFixed(2))
      outNumCount += parseFloat(item.jobNum || 0)
    }
    /* 计算值：人员占比 */
    if (Object.keys(item.list).length) {
      const peopleNum = {}
      let peopleCount = 0
      for (const x in item.list) {
        const val = item.list[x]
        peopleNum[val.name] = parseFloat((parseFloat(val.num || 0) * jobNumShow / 100).toFixed(2)) // 岗位占比 * 人员占比
        peopleCount += parseFloat(val.num || 0)
      }
      obj.peopleNum[item.job] = peopleNum
      obj.total.peoples[item.job] = parseFloat(peopleCount.toFixed(2))
    }
  })
  /* 赋值 */
  obj.total.type = parseFloat((parseFloat(inNum) + parseFloat(outNum)).toFixed(2)) // 总数：类型占比
  obj.total.job['内部'] = parseFloat(inNumCount.toFixed(2)) //                        总数：内部岗位
  obj.total.job['外部'] = parseFloat(outNumCount.toFixed(2)) //                       总数：外部岗位
  return obj
}

/** ------------------------------ mutations ------------------------------ **/

/**
 * [方法：change 事件：验货日期]
 */
Tool.changeTime = function (state) {
  const { tableData } = state
  const arr = []
  /* 提取：已选时间的毫秒数 */
  for (const x in tableData) {
    if (tableData[x][0] && tableData[x][0].examine_time) {
      const num = new Date(tableData[x][0].examine_time).getTime()
      if (num) {
        arr.push(num)
      }
    }
  }
  /* 排序 */
  arr.sort()
  /* 取最近日期 */
  if (arr.length) {
    const minDay = new Date(arr[0])
    const year = minDay.getFullYear()
    const month = minDay.getMonth() + 1 < 10 ? '0' + (minDay.getMonth() + 1) : minDay.getMonth() + 1
    const day = minDay.getDate() < 10 ? '0' + minDay.getDate() : minDay.getDate()
    state.time = `${year}-${month}-${day}`
  } else {
    state.time = ''
  }
}

/**
 * [方法：change 事件：责任归属]
 */
Tool.changeCheckbox = function (state) {
  const resultArr = [] // 最终数组
  /* 提取：现有数据 */
  const { arrResult, formData, peopleList } = state
  const objFormData = { '内部': {}, '外部': {} } // objFormData = { '内部': { '业务岗': {单条数据} }, '外部': {} }
  /* 提取：类型占比 */
  let inNum = 0
  let outNum = 0
  const formDataObj = {}
  formData.forEach(function (item) {
    if (item.typeNum && item.type === '内部') {
      inNum = item.typeNum
    }
    if (item.typeNum && item.type === '外部') {
      outNum = item.typeNum
    }
    formDataObj[item.job] = item
  })
  /* 提取：勾选，所有涉及到的岗位（去重） */
  const { tableData, arrOut, arrIn } = state
  const textObj = { '内部': {}, '外部': {} } // textObj = { '内部': { '业务岗': '' }, '外部': {} }
  for (const x in tableData) {
    tableData[x].forEach(function (item) {
      if (arrResult[item.examine_result] === '不合格' && arrResult[tableData[x][0].examine_result] === '不合格') {
        item.accountability.in.forEach(function (item) {
          if (item) {
            if (arrIn[item]) {
              textObj['内部'][arrIn[item].text] = ''
            } else {
              textObj['内部'][item] = ''
            }
          }
        })
        item.accountability.out.forEach(function (item) {
          if (item) {
            if (arrIn[item]) {
              textObj['外部'][arrOut[item].text] = ''
            } else {
              textObj['外部'][item] = ''
            }
          }
        })
      }
    })
  }
  const inOutArr = [Object.keys(textObj['内部']), Object.keys(textObj['外部'])]
  /* 制造数据 */
  let listIndex = 0
  inOutArr.forEach(function (itemItem, itemIndex) {
    itemItem.forEach(function (job, index, arr) {
      const count = index === 0 ? arr.length : 0 // 内部或外部，第一条数据才给count值，用于合并单元格
      if (itemIndex === 0) {
        /* 内部 */
        const typeNum = index === 0 ? inNum : 0
        if (objFormData['内部'][job]) {
          // { index: 0, count: 3, type: '内部', typeNum: 0, job: '业务岗', jobNum: 0, list: [{ name: '业务1', num: 0 }, { name: '业务2', num: 0 }] }
          const obj = Object.assign({}, objFormData['内部'][job], { index: listIndex, count, typeNum })
          resultArr.push(obj)
        } else {
          if (formDataObj[job]) {
            const obj = Object.assign({}, formDataObj[job], { index: listIndex, count, typeNum })
            resultArr.push(obj)
          } else {
            const obj = { index: listIndex, count, type: '内部', typeNum, job: job, jobNum: 0, list: [] }
            if (peopleList[job]) {
              for (const x in peopleList[job]) {
                obj.list.push(peopleList[job][x])
              }
            }
            resultArr.push(obj)
          }
        }
      } else if (itemIndex === 1) {
        /* 外部 */
        const typeNum = index === 0 ? outNum : 0
        if (objFormData['外部'][job]) {
          const obj = Object.assign({}, objFormData['外部'][job], { index: listIndex, count, typeNum })
          resultArr.push(obj)
        } else {
          if (formDataObj[job]) {
            const obj = Object.assign({}, formDataObj[job], { index: listIndex, count, typeNum })
            resultArr.push(obj)
          } else {
            const obj = { index: listIndex, count, type: '外部', typeNum, job: job, jobNum: 0, list: [] }
            resultArr.push(obj)
          }
        }
      }
      listIndex++
    })
  })
  /* 赋值 */
  state.formData = resultArr
}

/** ------------------------------ actions ------------------------------ **/

/**
 * [返回：报告信息]
 */
Tool.returnExamineGoods = function (obj) {
  const { fileList = [], final_explain } = obj
  fileList.map(function (item) {
    item.name = item.file_name
    item.url = window.location.origin + '/nova' + item.file_path
  })
  obj.final_explain = final_explain === null || final_explain === 'null' ? '' : final_explain
  obj.fileList = fileList
  return obj
}

/**
 * [返回：表单数据]
 */
Tool.returnFormData = function (list = [], { inside_ratio, outside_ratio }, peopleList = []) {
  const inArr = []
  const outArr = []
  const peopleObj = {}
  /* 添加人员：岗位下全部人员 */
  peopleList.forEach(function (item, index) {
    const { post_name: job } = item
    const peopleData = { index, job, jobNum: 0, list: {}, type: '内部' }
    item.empList.forEach(function (people) {
      const { employee_id: emp_id, examine_emp_id = '', employeename: name, num = 0 } = people
      peopleData.list[name] = { emp_id, examine_emp_id, name, num }
    })
    // peopleObj[服装业务] = { index, job: '服装业务', jobNum: 0, list: { 徐海妹: { 人员信息 } }, type: '内部' }
    peopleObj[job] = peopleData
  })
  /* 提取数据（内部、外部） */
  list.forEach(function (item, index) {
    const typeObj = { 1: '内部', 2: '外部' }
    const { examineBusinessEmpList = [], ...otherData } = item
    const { post_name: job, ratio: jobNum, out_in } = otherData
    // obj = { job: '面料业务', jobNum: 20, out_in: '内部', business_post_id, examine_goods_id, examine_post_id, is_delete, out_in, post_name, ratio }
    const obj = Object.assign({}, otherData, { index, job, jobNum, type: typeObj[out_in] })
    const objList = {}
    /* 添加人员：接口返回有数据的 */
    examineBusinessEmpList.forEach(function (val) {
      const { emp_id, examine_emp_id = '', emp_name: name, ratio: num } = val
      objList[name] = { emp_id, examine_emp_id, name, num }
    })
    peopleObj[job] = Object.assign({}, peopleObj[job], obj)
    peopleObj[job].list = Object.assign({}, peopleObj[job].list, objList) // 人员信息 中加入 比例 num
  })
  /* 分类 */
  for (const x in peopleObj) {
    const item = peopleObj[x]
    if (item.type === '内部') {
      inArr.push(item)
    } else if (item.type === '外部') {
      outArr.push(item)
    }
  }
  /* 给第一项添加属性 */
  if (inArr.length) {
    inArr[0].count = inArr.length
    inArr[0].typeNum = inside_ratio !== null ? inside_ratio : 0
  }
  if (outArr.length) {
    outArr[0].count = outArr.length
    outArr[0].typeNum = outside_ratio !== null ? outside_ratio : 0
  }
  /* 整合数组 */
  const formData = inArr.concat(outArr)
  return formData
}

/**
 * [返回：表格数据 && 仓库]
 */
Tool.returnTableObj = function (list = []) {
  const tableData = {} //  表格数据
  const storehouse = {} // 仓库
  list.forEach(function (item, index) {
    const { store_name, custom_store_id } = item
    if (!tableData[`${index}.${store_name}`]) {
      tableData[`${index}.${store_name}`] = []
    }
    /* 表格数据 */
    /* 抽取 examineGoodsDetailDutyList（不合格原因） 数据 */
    const { examineGoodsDetailDutyList, ...otherData } = item
    if (examineGoodsDetailDutyList.length === 0) {
      const { examine_detail_id } = item
      const data_2 = { detail_explain: '', examine_detail_duty_id: '', examine_goods_id: '', in_post_id: '', out_code: '', ratio: 0, reason_desc: '', reason_type: '' }
      const data = Object.assign({}, item, { accountability: { out: [], in: [] }, file: {}, index }, data_2, { examine_detail_id })
      /* 附件 */
      data.fileList = data.fileList || []
      data.fileList.map(function (val) {
        val.name = val.file_name
        val.url = window.location.origin + '/nova' + val.file_path
      })
      tableData[`${index}.${store_name}`] = [data]
    } else if (examineGoodsDetailDutyList.length > 0) {
      examineGoodsDetailDutyList.forEach(function (val) {
        const data = Object.assign({}, otherData, { accountability: { out: [], in: [] }, file: {}, index }, val)
        data.accountability.in = val.in_post_id === null ? [] : val.in_post_id.split(',')
        data.accountability.out = val.out_code === null ? [] : val.out_code.split(',')
        /* 附件 */
        data.fileList = data.fileList || []
        data.fileList.map(function (val) {
          val.name = val.file_name
          val.url = window.location.origin + '/nova' + val.file_path
        })
        tableData[`${index}.${store_name}`].push(data)
      })
    }
    /* 仓库 */
    storehouse[store_name] = custom_store_id
  })
  return { tableData, storehouse }
}

/**
 * [返回：岗位下：人员列表]
 */
Tool.peopleList = function (list = []) {
  const obj = {}
  list.forEach(function (item) {
    const data = {}
    item.empList.forEach(function (val) {
      const { employee_id: emp_id, examine_emp_id = '', employeename: name, num = 0 } = val
      data[val.employeename] = { emp_id, examine_emp_id, name, num }
    })
    obj[item.post_name] = data
  })
  return obj
}

/**
 * [返回：责任归属：外部]
 */
Tool.returnArrOut = function (list = []) {
  const obj = {}
  list.forEach(function (item) {
    const { dcode, dcvalue } = item
    obj[dcode] = { label: dcode, text: dcvalue } // 取值：label  展示：text
  })
  return obj
}

/**
 * [返回：责任归属：内部]
 */
Tool.returnArrIn = function (list = []) {
  const obj = {}
  list.forEach(function (item) {
    const { business_post_id, post_name } = item
    obj[business_post_id] = Object.assign({}, item, { label: business_post_id, text: post_name }) // 取值：label  展示：text
  })
  return obj
}

/**
 * [返回：原因类型、原因描述]
 */
Tool.returnCate = function (list = []) {
  /* 原因类型 */
  const obj = {}
  list.forEach(function (item) {
    const { name, qualify_id, detailList } = item
    /* 原因描述 */
    const arr = []
    detailList.forEach(function (val) {
      const { name, qualify_detail_id } = val
      arr.push({ label: name, value: qualify_detail_id })
    })
    /* 赋值 */
    obj[qualify_id] = { label: name, value: qualify_id, arr }
  })
  return obj
}

/**
 * [返回：处理方式]
 */
Tool.returnYhclfs = function (list = []) {
  const obj = {}
  list.forEach(function (item) {
    const { dcode, dcvalue } = item
    obj[dcode] = { label: dcode, text: dcvalue } // 取值：label  展示：text
  })
  return obj
}

/**
 * [提交：验货明细]
 * @param {[Object]} obj       表格数据 tableData
 * @param {[Object]} file      附件对象
 * @param {[Array]}  del_files 删除的附件ID数组
 */
Tool.submitExamine_goods_detail = function (obj = {}, file, del_files = []) {
  const deleteFile = {} // { 删除的附件ID： true }
  del_files.forEach(function (item) {
    deleteFile[item] = true
  })
  const arr_detail = [] //   明细数组
  const obj_detail = {}
  const error_detail = [] // 报错
  let i = 1
  for (const x in obj) {
    const objArr = obj[x] // 仓库数组
    let time_index_0 = ''
    let obj_ratio = 0 // 此仓库输入的比例总和
    objArr.forEach(function (item, index) {
      obj_ratio += Number(item.ratio)
      if (item.isLocal && item.is_delete === '0') {
        // 删除了的手动添加数据
      } else {
        let listObj = {}
        let status = true
        /* 基础数据 */
        const { examine_detail_duty_id, examine_detail_id, is_delete, remark, custom_store_id, store_name, examine_time, examine_name, examine_result, dispatch_order_id = [] } = item
        if (index === 0) {
          time_index_0 = examine_time === null ? '' : examine_time
        }
        const data = { examine_detail_id, is_delete, remark, custom_store_id, store_name, examine_time: time_index_0, examine_name, examine_result, dispatch_order_id }
        if (is_delete === '1') {
          /* ----- 验货结果 ----- */
          if (examine_result !== null && !examine_result.length) {
            // 未选中
            status = false
          } else if (examine_result === '1') {
            // 合格
            data.handle_mode = ''
            listObj = { examine_detail_duty_id, reason_type: '', reason_desc: '', ratio: '', out_code: '', in_post_id: '', detail_explain: '' }
            /* 验证：仓库        验货日期          验货人 */
            if (!store_name || !examine_time || !examine_name) {
              status = false
            }
          } else {
            // 不合格
            const { reason_type, reason_desc, ratio, detail_explain, accountability: { in: inArr, out: outArr }, handle_mode } = item
            data.handle_mode = handle_mode
            const in_post_id = inArr.join(',')
            const out_code = outArr.join(',')
            listObj = { examine_detail_duty_id, reason_type, reason_desc, ratio, out_code, in_post_id, detail_explain }
            /* 验证：仓库        验货日期          验货人            原因类型         原因描述          比例       责任归属                       处理方式 */
            if (!store_name || !examine_time || !examine_name || !reason_type || !reason_desc || !ratio || (!out_code && !in_post_id) || !handle_mode) {
              status = false
            }
          }
          /* ----- 附件 ----- */
          const { fileList = [], examine_detail_id } = item
          /* 新上传的附件 */
          const fileObj = file[examine_detail_id] || {}
          const newLength = Object.keys(fileObj).length
          /* 原始附件，剔除删除了的 */
          let oldLength = fileList.length
          fileList.forEach(function (fileItem) {
            if (deleteFile[fileItem.acce_id]) {
              oldLength = oldLength - 1
            }
          })
          /* 统计附件总数 */
          if (oldLength + newLength < 1) {
            status = false
          }
        }
        /* 赋值 */
        data.examineGoodsDetailDutyList = Object.keys(listObj).length ? [listObj] : []
        if (obj_detail[examine_detail_id]) {
          obj_detail[examine_detail_id].examineGoodsDetailDutyList.push(listObj)
        } else {
          obj_detail[examine_detail_id] = data
        }
        /* 报错 */
        if (!status) {
          error_detail.push(`第${i}条`)
        }
        i++
      }
    })
    /* 仓库数据比例 !== 100% */
    if (obj_ratio !== 100) {
      const { examine_result, store_name, examine_time, is_delete } = objArr[0]
      if (examine_result === '0' && is_delete === '1') {
        error_detail.push(`${store_name} ${examine_time} 比例总和不等于100%`)
      }
    }
  }
  /* 提取 */
  for (const x in obj_detail) {
    arr_detail.push(obj_detail[x])
  }
  return { arr_detail, error_detail }
}

/**
 * [提交：责任划分]
 */
Tool.submitExamine_business_post = function (newList = [], oldList = [], arrIn = {}) {
  const typeObj = { '内部': '1', '外部': '2' }
  const examine_business_post = []
  let inside_ratio = 0 //  内部占比
  let outside_ratio = 0 // 外部占比
  /* 提取：内部岗位数据 */
  const arrObj = {}
  for (const x in arrIn) {
    if (arrIn[x].empList && arrIn[x].empList.length) {
      arrIn[x].empList.forEach(function (item) {
        arrObj[item.post_name] = item
      })
    }
  }
  /* 提取：选中的岗位ID */
  newList.map(function (item) {
    item.is_delete = '1'
    /* 整理数据 */
    const { is_delete, job: post_name, jobNum: ratio, type, typeNum } = item
    if (type === '内部') {
      inside_ratio = typeNum > 0 ? typeNum : inside_ratio
    }
    if (type === '外部') {
      outside_ratio = typeNum > 0 ? typeNum : outside_ratio
    }
    const data = { is_delete, post_name, ratio, out_in: typeObj[type], examine_business_emp: [] }
    for (const x in item.list) {
      const val = item.list[x]
      const { name: emp_name, num: ratio } = val
      const { business_post_id = '', employee_id: emp_id } = arrObj[post_name] || {}
      data.business_post_id = business_post_id
      data.examine_business_emp.push({ emp_id, emp_name, ratio })
    }
    examine_business_post.push(data)
  })
  return { examine_business_post, inside_ratio, outside_ratio }
}

/**
 * [验证：责任划分]
 */
Tool.provingAccountability = function ({ total: { job, peoples, type } }) {
  if (job['内部'] === 0 && job['外部'] === 0) {
    return ''
  } else {
    let status = true
    /* 类型占比 */
    status = type !== 100 ? false : status
    /* 岗位占比 */
    for (const x in job) {
      status = (job[x] !== 100 && job[x] !== 0) ? false : status
    }
    /* 人员占比 */
    for (const x in peoples) {
      status = peoples[x] !== 100 ? false : status
    }
    if (!status) {
      return '责任划分模块各类型占比应为100%'
    } else {
      return ''
    }
  }
}

export default Tool
