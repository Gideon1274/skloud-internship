import type { HttpContext } from '@adonisjs/core/http'

// In-memory data store
let students = [
    { id: 1, name: 'Anna' },
    { id: 2, name: 'John' },
]

export default class StudentsController {
    /**
     * GET /students
     */
    public async index({ response }: HttpContext) {
        return response.ok(students)
    }

    /**
     * GET /students/:id
     */
    public async show({ params, response }: HttpContext) {
        const studentId = Number(params.id)
        const student = students.find((s) => s.id === studentId)

        if (!student) {
            return response.notFound({ message: 'Student not found' })
        }

        return response.ok(student)
    }

    /**
     * POST /students
     */
    public async store({ request, response }: HttpContext) {
        const { name } = request.only(['name'])

        if (!name) {
            return response.badRequest({ message: 'Name is required' })
        }

        const newStudent = {
            id: students.length + 1,
            name,
        }

        students.push(newStudent)

        return response.created(newStudent)
    }
}