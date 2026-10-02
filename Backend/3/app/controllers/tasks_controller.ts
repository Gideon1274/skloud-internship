import type { HttpContext } from '@adonisjs/core/http'
import Task from '#models/task'
import { createTaskValidator, updateTaskValidator } from '#validators/task'

export default class TasksController {
    /**
     * GET /tasks - Return all tasks owned by the authenticated user
     */
    public async index({ auth, response }: HttpContext) {
        const user = auth.getUserOrFail()
        const tasks = await Task.query().where('user_id', user.id)
        return response.ok(tasks)
    }

    /**
     * GET /tasks/:id - Return task if owned by authenticated user
     */
    public async show({ params, auth, response }: HttpContext) {
        const user = auth.getUserOrFail()
        const task = await Task.query().where('id', params.id).where('user_id', user.id).first()

        if (!task) {
            return response.notFound({ message: 'Task not found' })
        }

        return response.ok(task)
    }

    /**
     * POST /tasks - Create task assigned to authenticated user
     */
    public async store({ request, auth, response }: HttpContext) {
        const user = auth.getUserOrFail()

        try {
            const payload = await request.validateUsing(createTaskValidator)
            const task = await Task.create({
                ...payload,
                userId: user.id,
            })

            return response.created(task)
        } catch (error: any) {
            return response.badRequest({
                message: 'Invalid request payload or validation failed',
                errors: error.messages || error.message,
            })
        }
    }

    /**
     * PATCH /tasks/:id - Update task with strict ownership check
     */
    public async update({ params, request, auth, response }: HttpContext) {
        const user = auth.getUserOrFail()
        const task = await Task.query().where('id', params.id).first()

        if (!task) {
            return response.notFound({ message: 'Task not found' })
        }

        // Ownership Enforcement (Task 5)
        if (task.userId !== user.id) {
            return response.forbidden({ message: 'You do not have permission to update this task' })
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
     * DELETE /tasks/:id - Delete task with strict ownership check
     */
    public async destroy({ params, auth, response }: HttpContext) {
        const user = auth.getUserOrFail()
        const task = await Task.query().where('id', params.id).first()

        if (!task) {
            return response.notFound({ message: 'Task not found' })
        }

        // Ownership Enforcement (Task 5)
        if (task.userId !== user.id) {
            return response.forbidden({ message: 'You do not have permission to delete this task' })
        }

        await task.delete()
        return response.ok({ message: 'Task deleted successfully' })
    }
}