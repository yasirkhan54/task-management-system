import { Request, Response, NextFunction } from 'express'
import { plainToClass } from 'class-transformer'
import createError from 'http-errors'

import db from '../prisma'
import { TaskDto } from '../models'
import { ERROR_MESSAGE } from '../constants'

export namespace TaskManagerController {

  // Get all tasks.
  export const GET_ALL_TASKS = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tasks = await db.task.findMany()
      res.status(200).json(tasks)
    } catch (error) {
      next(error)
    }
  }

  // Get all tasks paginated data.
  export const GET_ALL_TASKS_PAGINATED = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = req.query as { page: string, limit: string }
      const page_limit = parseInt(limit || '5')
      const page_number = parseInt(page || '1')

      const tasks = await db.task.findMany({
        skip: (page_number - 1) * page_limit,
        take: page_limit,
      })
      res.status(200).json(tasks)
    } catch (error) {
      next(error)
    }
  }

  // Get a task by its ID.
  export const GET_TASK_BY_ID = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { task_id } = req.params
      const task = await db.task.findUnique({ where: { task_id } })

      // Check if task not found then throw error
      if (!task) throw createError.NotFound(ERROR_MESSAGE.TASK_NOT_FOUND)

      res.status(200).json(task)
    } catch (error) {
      next(error)
    }
  }

  // - GET `/tasks?assignedTo=[username]` - Retrieve all tasks assigned to a specific user.
  export const GET_TASKS_BY_ASSIGNED_TO = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id } = req.query as { user_id: string }

      // if user_id not found then throw error
      if (!user_id) throw createError.NotFound(ERROR_MESSAGE.USER_NOT_FOUND)

      const tasks = await db.task.findMany({ where: { user_id: user_id } })

      res.status(200).json(tasks)
    } catch (error) {
      next(error)
    }
  }

  // - GET `/tasks?category=[categoryName]` - Retrieve all tasks under a specific category.
  export const GET_TASKS_BY_CATEGORY = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { category } = req.query as { category: string }

      // if category not found then throw error
      if (!category) throw createError.NotFound(ERROR_MESSAGE.CATEGORY_NOT_FOUND)

      const tasks = await db.task.findMany({ where: { category: category } })

      res.status(200).json(tasks)
    } catch (error) {
      next(error)
    }
  }

  // Update a specific task.
  export const UPDATE_TASK_BY_ID = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { task_id } = req.params
      const data = plainToClass(TaskDto, req.body)

      // Check if task not found then throw error
      if (!await db.task.findUnique({ where: { task_id } })) throw createError.NotFound(ERROR_MESSAGE.TASK_NOT_FOUND)

      const task = await db.task.update({
        where: { task_id },
        data,
        select: {
          task_id: true,
          user_id: true,
          title: true,
          description: true,
          due_date: true,
          category: true,
          status: true,
        }
      })
      res.status(200).json(task)
    } catch (error) {
      next(error)
    }
  }

  // Delete a specific task.
  export const SOFT_DELETE_TASK_BY_ID = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { task_id } = req.params

      // Check if task not found then throw error
      if (!await db.task.findUnique({ where: { task_id } })) throw createError.NotFound(ERROR_MESSAGE.TASK_NOT_FOUND)

      const task = await db.task.update({
        where: { task_id },
        data: { is_active: false, is_deleted: true },
        select: {
          task_id: true,
          user_id: true,
          title: true,
          description: true,
          due_date: true,
          category: true,
          status: true,
        }
      })
      res.status(200).json(task)
    } catch (error) {
      next(error)
    }
  }

  // Create a new task.
  export const CREATE_TASK = async (req: Request, res: Response, next: NextFunction) => {
    try {
      //const data = req.body as TaskDto
      const data = plainToClass(TaskDto, req.body)

      const task = await db.task.create({
        data,
        select: {
          task_id: true,
          user_id: true,
          title: true,
          description: true,
          due_date: true,
          category: true,
          status: true,
        }
      })
      res.status(201).json(task)
    } catch (error) {
      next(error)
    }
  }

  // Delete a specific task.
  export const DELETE_TASK_BY_ID = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { task_id } = req.params

      // Check if task not found then throw error
      if (!await db.task.findUnique({ where: { task_id } })) throw createError.NotFound(ERROR_MESSAGE.TASK_NOT_FOUND)

      const task = await db.task.delete({ where: { task_id } })
      res.status(200).json(task)
    } catch (error) {
      next(error)
    }
  }

}
