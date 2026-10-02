import vine from '@vinejs/vine'

/**
 * Validator for creating a task (POST)
 */
export const createTaskValidator = vine.compile(
    vine.object({
        title: vine.string().trim().minLength(1),
        description: vine.string().trim().optional(),
        status: vine.string().trim().optional(),
    })
)

/**
 * Validator for updating a task (PATCH)
 */
export const updateTaskValidator = vine.compile(
    vine.object({
        title: vine.string().trim().minLength(1).optional(),
        description: vine.string().trim().optional(),
        status: vine.string().trim().optional(),
    })
)