import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import 'source-map-support/register'

import { TodoItem } from '../models/TodoItem'

export class TodoAccess {

    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly todosIndex = process.env.TODOS_INDEX) {

        }

    async getAllTodos(userId: string): Promise<TodoItem[]> {
        console.log("Getting all todo items")

        const result = await this.docClient.query(
            {
                TableName: this.todosTable,
                IndexName: this.todosIndex,
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': userId
                }
            }
        ).promise()
        return result.Items as TodoItem[]
    }

    async getTodo(userId: string, todoItemId: string): Promise<TodoItem> {
        console.log(`Getting todoItem for user ${userId} and todoItemId ${todoItemId}`)

        const result = await this.docClient.query(
            {
                TableName: this.todosTable,
                IndexName: this.todosIndex,
                KeyConditionExpression: 'userId = :userId and todoId = :todoItemId',
                ExpressionAttributeValues: {
                    ':userId': userId,
                    ':todoItemId': todoItemId
                }
            }
        ).promise()

        return result.Items[0] as TodoItem
    }

    async createTodoItem(todoItem: TodoItem): Promise<TodoItem> {
        await this.docClient.put({
                    TableName: this.todosTable,
                    Item: todoItem
            }
        ).promise()

        return todoItem
    } 

    async deleteTodoItem(todoItem: TodoItem): Promise<void> {
        await this.docClient.delete({
                    TableName: this.todosTable,
                    Key: {userId: todoItem.userId, createdAt: todoItem.createdAt},
                    ConditionExpression: 'todoId = :todoId',
                    ExpressionAttributeValues: {
                        ':todoId': todoItem.todoId
                    }
            }
        ).promise()
    }

    async updateTodoItem(todoItem: TodoItem): Promise<TodoItem> {
        await this.docClient.update({
            TableName: this.todosTable,
            Key: {userId: todoItem.userId, createdAt: todoItem.createdAt},
            UpdateExpression: 'SET #n = :name, dueDate = :dueDate, done = :done',
            ExpressionAttributeNames: {
                "#n": "name"
            },
            ConditionExpression: 'todoId = :todoId',
            ExpressionAttributeValues: { 
                ':todoId': todoItem.todoId,
                ':name': todoItem.name,
                ':dueDate': todoItem.dueDate,
                ':done': todoItem.done
            }
        }).promise()
        return todoItem
    }
}