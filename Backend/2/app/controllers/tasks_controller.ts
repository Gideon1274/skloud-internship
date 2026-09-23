// import type { HttpContext } from '@adonisjs/core/http'

import type { HttpContext } from '@adonisjs/core/http'
import Task from '#models/task'
import { createTaskValidator, updateTaskValidator } from '#validators/task'

export default class TasksController {
    /**
     * GET /tasks - Return all tasks
     */
    public async index({ response }: HttpContext) {
        const tasks = await Task.all()
        return response.ok(tasks)
    }

    /**
     * GET /tasks/:id - Return one task
     */
    public async show({ params, response }: HttpContext) {
        const task = await Task.find(params.id)

        if (!task) {
            return response.notFound({ message: 'Task not found' })
        }

        return response.ok(task)
    }

    /**
     * POST /tasks - Validate and create a task
     */
    public async store({ request, response }: HttpContext) {
        try {
            const payload = await request.validateUsing(createTaskValidator)
            const task = await Task.create(payload)

            return response.created(task)
        } catch (error: any) {
            return response.badRequest({
                message: 'Invalid request payload or validation failed',
                errors: error.messages || error.message,
            })
        }
    }

    /**
     * PATCH /tasks/:id - Validate and update an existing task
     */
    public async update({ params, request, response }: HttpContext) {
        const task = await Task.find(params.id)

        if (!task) {
            return response.notFound({ message: 'Task not found' })
        }

        try {
            const payload = await request.validateUsing(updateTaskValidator)
            task.merge(payload)
            await task.save()

            return response.ok(task)
        } catch (error: any) {
            return response.badRequest({
                message: 'Invalid request payload or validation failed',
                errors: error.messages || error.message,
            })
        }
    }

    /**
     * DELETE /tasks/:id - Delete an existing task
     */
    public async destroy({ params, response }: HttpContext) {
        const task = await Task.find(params.id)

        if (!task) {
            return response.notFound({ message: 'Task not found' })
        }

        await task.delete()
        return response.ok({ message: 'Task deleted successfully' })
    }
}