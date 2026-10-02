import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class AccessTokensController {
  public async store({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    const user = await User.verifyCredentials(email, password)
    if (!user) {
      return response.badRequest({ message: 'Invalid credentials' })
    }

    const token = await User.accessTokens.create(user)

    return response.ok({
      type: 'bearer',
      value: token.value!.release(),
    })
  }

  public async destroy({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const token =
      auth.user && 'currentAccessToken' in auth.user ? auth.user.currentAccessToken : undefined

    if (token) {
      await User.accessTokens.delete(user, token.identifier)
    }

    return response.ok({ message: 'Logged out successfully' })
  }
}