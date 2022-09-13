import express from 'express'
import { throwError } from '../../middleware/handleError.js'
import { validBody } from '../../middleware/validBody.js'
import {
  createCategorySchema,
  updateCategoryNameSchema,
  updateCategoryParentSchema
} from '../../schema/categories.js'
import CategoriesTask from '../../tasks/categories.js'

const route = express.Router()

route.get('/', async (req, res) => {
  // 获取所有商品分类

  const result = await CategoriesTask.getCategoriesDetails()

  res.send(result)
})

route.post(
  '/create',
  validBody(createCategorySchema, '提交的信息不正确!'),
  async (req, res, next) => {
    // 创建商品分类

    const { name, parent_name } = req.body

    const validCategoryResult = await CategoriesTask.getCategoryDetails(name)
    if (validCategoryResult) {
      return throwError(next, '此分类已存在!')
    }
    // 当新分类的名称存在时返回400

    if (parent_name) {
      const validParentCategoryResult = await CategoriesTask.getCategoryDetails(
        parent_name
      )
      if (!validParentCategoryResult) {
        return throwError(next, '父分类不存在!')
      }
      // 当父分类不存在时返回400

      if (validParentCategoryResult.parent_id) {
        return throwError(next, '提交的子分类是父父类，请重新选择!')
      }
      // 当提交的父分类拥有父分类的id时返回400

      await CategoriesTask.createCategory(name, parent_name)

      return res.json({
        message: '创建成功!',
        name,
        parent_name
      })
    }

    await CategoriesTask.createCategory(name)

    res.json({
      message: '创建成功!',
      name,
      parent_name
    })
  }
)

route.put(
  '/updatename',
  validBody(updateCategoryNameSchema, '请输入正确的信息!'),
  async (req, res, next) => {
    // 更新分类名称

    const { old_name, new_name } = req.body

    const validOldNameResult = await CategoriesTask.getCategoryDetails(old_name)
    if (!validOldNameResult) {
      return throwError(next, '需要修改的分类不存在!')
    }
    // 当需要修改的分类不存在时返回400

    const validNewNameResult = await CategoriesTask.getCategoryDetails(new_name)
    if (validNewNameResult) {
      return throwError(next, '新的分类名称已存在!')
    }
    // 当新的分类名称已存在时返回400

    await CategoriesTask.updateCategoryName(old_name, new_name)

    res.json({
      message: '修改成功!',
      old_name,
      new_name
    })
  }
)

route.put(
  '/updateparent',
  validBody(updateCategoryParentSchema, '请输入正确的分类名称!'),
  async (req, res, next) => {
    // 更新子分类所属的父分类

    const { name, parent_name } = req.body
    const validNameResult = await CategoriesTask.getCategoryDetails(name)
    if (!validNameResult) {
      return throwError(next, '需要修改的子分类不存在!')
    }
    // 当需要修改的子分类不存在时返回400

    const validChildResult = await CategoriesTask.getChildCategory(name)
    if (validChildResult.length !== 0) {
      return throwError(next, '提交的子分类是父分类，无法为父分类设置父分类!')
    }
    // 当需要修改的子分类已是父分类时返回400

    const validParentNameResult = await CategoriesTask.getCategoryDetails(
      parent_name
    )
    if (!validParentNameResult) {
      return throwError(next, '此父分类不存在!')
    }
    // 当父分类不存在时返回400

    const { parent_id } = await CategoriesTask.getCategoryDetails(parent_name)
    if (parent_id) {
      return throwError(next, '提交的父分类是子分类，无法将其设置为父分类!')
    }
    // 当需要修改的父分类是子分类时返回400

    await CategoriesTask.updateCategoryParent(name, parent_name)

    res.json({
      message: '修改成功!',
      name,
      parent_name
    })
  }
)

route.delete('/delete/:name', async (req, res, next) => {
  // 删除分类

  const { name } = req.params
  const validCategoryResult = await CategoriesTask.getCategoryDetails(name)
  if (!validCategoryResult) {
    return throwError(next, '分类不存在!')
  }

  const { id } = validCategoryResult
  const validCategoryHasCommodity =
    await CategoriesTask.checkCategoryHasCommodity(id)
  // 检查当前分类下是否含有商品

  if (validCategoryHasCommodity) {
    return throwError(next, '当前分类下含有商品,无法删除!')
  }

  await CategoriesTask.deleteCategory(id)

  res.json({
    message: '删除成功!',
    name
  })
})

export default route
