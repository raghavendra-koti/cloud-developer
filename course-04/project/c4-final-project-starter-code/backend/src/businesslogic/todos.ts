import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../datalayer/TodoAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as uuid from 'uuid'

const todoAccess = new TodoAccess()

const bucketName = process.env.TODO_IMAGES_S3_BUCKET

export async function getAllTodos(userId: string): Promise<TodoItem[]> {
  return todoAccess.getAllTodos(userId)
}

export async function createTodoItem(
  create: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {

  const itemId = uuid.v4()

  const todoItem = {
    userId: userId,
    todoId: itemId,
    createdAt: new Date().toISOString(),
    name: create.name,
    dueDate: create.dueDate,
    done: false,
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${itemId}`
  }

  const result = await todoAccess.createTodoItem(todoItem)
  return result
}

export async function deleteTodoItem(
  todoItemId: string,
  userId: string
): Promise<void> {
  const existingTodoItem = await todoAccess.getTodo(userId, todoItemId)
  if (existingTodoItem) {
    console.log('Deleting item')
    await todoAccess.deleteTodoItem(existingTodoItem)
  }
  else {
    throw new Error(`Todo item ${todoItemId} not found`)
  }
}

export async function updateTodoItem(
  update: UpdateTodoRequest,
  todoItemId: string,
  userId: string
): Promise<TodoItem> {
  const existingTodoItem = await todoAccess.getTodo(userId, todoItemId)

  if (existingTodoItem) {
    console.log('Updating todo Item')
    const todoItem = {
      userId: existingTodoItem.userId,
      todoId: todoItemId,
      createdAt: existingTodoItem.createdAt,
      name: update.name,
      dueDate: update.dueDate,
      done: update.done,
      attachmentUrl: existingTodoItem.attachmentUrl
    }
    return await todoAccess.updateTodoItem(todoItem)
  }
  else {
    throw new Error(`Todo item ${todoItemId} not found`)
  }
}