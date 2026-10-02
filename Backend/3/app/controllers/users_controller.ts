import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { registerValidator } from '#validators/auth'

export default class UsersController {
    public async store({ request, response }: HttpContext) {
        try {
            const payload = await request.validateUsing(registerValidator)

            const existingUser = await User.findBy('email', payload.email)
            if (existingUser) {
                return response.badRequest({ message: 'Email already registered' })
            }

            const hashedPassword = await hash.make(payload.password)

            const user = await User.create({
                fullName: payload.name,
                email: payload.email,
                password: hashedPassword,
            })

            return response.created({
                id: user.id,
                name: user.fullName,
                email: user.email,
            })
        } catch (error: unknown) {
            const validationError = error as {
                messages?: unknown
                message?: string
            }

            return response.badRequest({
                message: 'Validation failed',
                errors: validationError.messages || validationError.message,
            })
        }
    }
}