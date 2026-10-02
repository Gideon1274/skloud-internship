import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import hash from '@adonisjs/core/services/hash'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Static helper to verify user credentials
  static async verifyCredentials(email: string, password: string) {
    const user = await this.findBy('email', email)
    if (!user) {
      return null
    }

    const isValid = await hash.verify(user.password, password)
    if (!isValid) {
      return null
    }

    return user
  }

  static accessTokens = DbAccessTokensProvider.forModel(User)
}