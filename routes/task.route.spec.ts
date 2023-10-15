import request from 'supertest'
import app from '../src/index'

import { TASK_MANAGEMENT_PATH } from './task.route'

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('TaskManagerController', () => {

  beforeAll(async () => {
    await prisma.user.deleteMany({});
    const user = await prisma.user.create({
      data: {
        "first_name": "Yasir",
        "last_name": "Khan",
        "email": "yasirkhan54@gmail.com",
        "password": "Lahore@123",
        "terms_accepted": true,
        "email_verify_code": "123456",
      }
    });
    await prisma.task.create({
      data: {
        "user_id": user.user_id,
        "title": "title",
        "description": "description",
        "due_date": "2023-10-14T15:00:00.000Z",
        "category": "category",
        "status": "Pending"
      }
    });
  });

  afterAll(async () => {
    await prisma.task.deleteMany({});
  });

  it('should be greater than 0', async () => {
    const response = await request(app)
      .get(`${TASK_MANAGEMENT_PATH}/tasks`)
      .expect(200);

    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should get by id', async () => {
    const task = await prisma.task.findFirst();
    const response = await request(app)
      .get(`${TASK_MANAGEMENT_PATH}/task/${task?.task_id}`)
      .expect(200);

    expect(response.body.task_id).toEqual(task?.task_id);
  })

  it('should get by assigned to', async () => {
    const task = await prisma.task.findFirst();
    const response = await request(app)
      .get(`${TASK_MANAGEMENT_PATH}/tasks-by-user?user_id=${task?.user_id}`)
      .expect(200);

    expect(response.body.length).toBeGreaterThan(0);
  })

  it('should get by category', async () => {
    const task = await prisma.task.findFirst();
    const response = await request(app)
      .get(`${TASK_MANAGEMENT_PATH}/tasks-by-category?category=${task?.category}`)
      .expect(200);

    expect(response.body.length).toBeGreaterThan(0);
  })

  it('should update by id', async () => {
    const task = await prisma.task.findFirst();
    const response = await request(app)
      .put(`${TASK_MANAGEMENT_PATH}/task/${task?.task_id}`)
      .send({
        "user_id": task?.user_id,
        "title": "updated title",
        "description": "this is some updated description",
        "due_date": "2023-10-14T15:00:00.000Z",
        "category": "category",
        "status": "Pending"
      })
      .expect(200);

    expect(response.body.task_id).toEqual(task?.task_id);
  })

  it('should create new task', async () => {
    const user = await prisma.user.findFirst();
    const response = await request(app)
      .post(`${TASK_MANAGEMENT_PATH}/task`)
      .send({
        "user_id": user?.user_id,
        "title": "title",
        "description": "description",
        "due_date": "2023-10-14T15:00:00.000Z",
        "category": "category",
        "status": "Pending"
      })
      .expect(201);

    expect(response.body.task_id).toBeDefined();
  })

  it('should delete by id', async () => {
    const task = await prisma.task.findFirst();
    const response = await request(app)
      .delete(`${TASK_MANAGEMENT_PATH}/task/${task?.task_id}`)
      .expect(200);

    expect(response.body.task_id).toEqual(task?.task_id);
  })

  it('should soft delete by id', async () => {
    const task = await prisma.task.findFirst();
    const response = await request(app)
      .delete(`${TASK_MANAGEMENT_PATH}/delete-task/${task?.task_id}`)
      .expect(200);

    expect(response.body.task_id).toEqual(task?.task_id);
  })

});