import { Router } from 'express'
import { validate, authorization } from '../middlewares'
import { TaskManagerController } from '../controllers'
import {
  TaskDto
} from '../models'

const router = Router()

const PATH = {
  GET_ALL_TASKS: '/tasks',
  GET_TASK_BY_ID: '/task/:task_id',
  
  GET_TASKS_BY_CATEGORY: '/tasks-by-category',
  GET_TASKS_BY_ASSIGNED_TO: '/tasks-by-user',
  GET_ALL_TASKS_PAGINATED: '/search',

  UPDATE_TASK_BY_ID: '/task/:task_id',

  CREATE_TASK: '/task',
  
  DELETE_TASK_BY_ID: '/task/:task_id',
  SOFT_DELETE_TASK_BY_ID: '/delete-task/:task_id'
}

// POST APIs
router.get(PATH.GET_ALL_TASKS, authorization, TaskManagerController.GET_ALL_TASKS)
router.get(PATH.GET_TASK_BY_ID, authorization, TaskManagerController.GET_TASK_BY_ID)

router.get(PATH.GET_TASKS_BY_CATEGORY, authorization, TaskManagerController.GET_TASKS_BY_CATEGORY)
router.get(PATH.GET_TASKS_BY_ASSIGNED_TO, authorization, TaskManagerController.GET_TASKS_BY_ASSIGNED_TO)
router.get(PATH.GET_ALL_TASKS_PAGINATED, authorization, TaskManagerController.GET_ALL_TASKS_PAGINATED)

router.put(PATH.UPDATE_TASK_BY_ID, authorization, validate(TaskDto), TaskManagerController.UPDATE_TASK_BY_ID)

router.post(PATH.CREATE_TASK, authorization, validate(TaskDto), TaskManagerController.CREATE_TASK)

router.delete(PATH.DELETE_TASK_BY_ID, authorization, TaskManagerController.DELETE_TASK_BY_ID)
router.delete(PATH.SOFT_DELETE_TASK_BY_ID, authorization, TaskManagerController.SOFT_DELETE_TASK_BY_ID)

export const TASK_MANAGEMENT_PATH = '/task-management';
export const TASK_MANAGEMENT_ROUTER = router;