import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
    vine.object({
        name: vine.string().trim().minLength(2),
        email: vine.string().email().trim(),
        password: vine.string().minLength(6),
    })
)

export const loginValidator = vine.compile(
    vine.object({
        email: vine.string().email().trim(),
        password: vine.string(),
    })
)