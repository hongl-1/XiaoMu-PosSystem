import React, { useMemo, useCallback } from 'react'
import styled from '../../../../../styles/warehouse/commodity.scss'
import { VirtualSelectList } from '../../../../../components/VirtualSelectList'
import { LoadingBox } from '../../../../../components/LoadingBox'

const columns = [
  {
    title: '序号',
    key: 'index',
    type: 5
  },
  {
    title: '条码',
    key: 'barcode',
    type: 2
  },
  {
    title: '名称',
    key: 'name',
    type: 2
  },
  {
    title: '规格',
    key: 'size',
    type: 5
  },
  {
    title: '单位',
    key: 'unit',
    type: 5
  },
  {
    title: '进价',
    key: 'in_price',
    type: 1
  },
  {
    title: '售价',
    key: 'sale_price',
    type: 1
  },
  {
    title: '库存',
    key: 'count',
    type: 1
  },
  {
    title: '修改日期',
    key: 'change_date',
    type: 2
  },
  {
    title: '建立日期',
    key: 'work_date',
    type: 2
  }
]

const footerColumns = (length) => [
  {
    title: '共计',
    value: length || 0
  },
  {
    title: 'SPACE',
    type: 2,
    value: ''
  }
]

export function CommodityList({
  commodityList,
  setSelect,
  selectId,
  selectType,
  spinStatus = true
}) {
  function handleClickSelect(selectId) {
    setSelect({
      selectId,
      selectType: 'click'
    })
  }

  const handleCss = useCallback((css, styled, data) => {
    const { in_price, sale_price } = data
    if (in_price === 0 || sale_price === 0 || sale_price <= in_price) {
      return [...css, styled['error']]
    }
    return css
  }, [])

  const footerData = useMemo(
    () => footerColumns(commodityList.length),
    [commodityList.length]
  )

  return (
    <div className={styled['commodity-list-wrap']}>
      <LoadingBox status={spinStatus} />
      <VirtualSelectList
        wrapCss={styled['list-wrap']}
        data={commodityList}
        selectType={selectType}
        select={selectId}
        columns={columns}
        footerColumn={footerData}
        handleClickSelect={handleClickSelect}
        handleColumnCss={handleCss}
      />
    </div>
  )
}
