import { Router } from 'express'
import { validate } from '../middlewares'
import { TaskManagerController } from '../controllers'
import {
  TaskDto
} from '../models'

const router = Router()

const PATH = {
  GET_ALL_TASKS: '/tasks',
  GET_TASK_BY_ID: '/task/:task_id',
  GET_TASKS_BY_ASSIGNED_TO: '/tasks?assignedTo=:task_id',
  GET_TASKS_BY_CATEGORY: '/tasks?category=:category',
  UPDATE_TASK_BY_ID: '/task/:task_id',
  CREATE_TASK: '/task',
  DELETE_TASK_BY_ID: '/task/:task_id',
  SOFT_DELETE_TASK_BY_ID: '/delete-task/:task_id'
}

// POST APIs
router.get(PATH.GET_ALL_TASKS, TaskManagerController.GET_ALL_TASKS)
router.get(PATH.GET_TASK_BY_ID, TaskManagerController.GET_TASK_BY_ID)
router.get(PATH.GET_TASKS_BY_ASSIGNED_TO, TaskManagerController.GET_TASKS_BY_ASSIGNED_TO)
router.get(PATH.GET_TASKS_BY_CATEGORY, TaskManagerController.GET_TASKS_BY_CATEGORY)

router.put(PATH.UPDATE_TASK_BY_ID, validate(TaskDto), TaskManagerController.UPDATE_TASK_BY_ID)

router.post(PATH.CREATE_TASK, validate(TaskDto), TaskManagerController.CREATE_TASK)

router.delete(PATH.DELETE_TASK_BY_ID, TaskManagerController.DELETE_TASK_BY_ID)
router.delete(PATH.SOFT_DELETE_TASK_BY_ID, TaskManagerController.SOFT_DELETE_TASK_BY_ID)

export const TASK_MANAGEMENT_PATH = '/task-management';
export const TASK_MANAGEMENT_ROUTER = router;