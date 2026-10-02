import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { loginValidator } from '#validators/auth'

export default class SessionsController {
    public async store({ request, response }: HttpContext) {
        try {
            const payload = await request.validateUsing(loginValidator)

            const user = await User.findBy('email', payload.email)
            if (!user) {
                return response.badRequest({ message: 'Invalid email or password' })
            }

            const isPasswordValid = await hash.verify(user.password, payload.password)
            if (!isPasswordValid) {
                return response.badRequest({ message: 'Invalid email or password' })
            }

            const token = await User.accessTokens.create(user)

            return response.ok({
                type: 'bearer',
                value: token.value!.release(),
            })
        } catch (error: any) {
            return response.badRequest({
                message: 'Validation failed',
                errors: error.messages || error.message,
            })
        }
    }
}