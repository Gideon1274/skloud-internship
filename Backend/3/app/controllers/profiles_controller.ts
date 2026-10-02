import type { HttpContext } from '@adonisjs/core/http'

export default class ProfilesController {
    public async show({ auth, response }: HttpContext) {
        const user = auth.getUserOrFail()
        return response.ok({
            id: user.id,
            name: user.fullName,
            email: user.email,
        })
    }
}