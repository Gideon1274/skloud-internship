/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/


import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const UsersController = () => import('#controllers/users_controller')
const SessionsController = () => import('#controllers/sessions_controller')
const ProfilesController = () => import('#controllers/profiles_controller')
const TasksController = () => import('#controllers/tasks_controller')

// Public routes
router.post('/users', [UsersController, 'store'])
router.post('/sessions', [SessionsController, 'store'])

// Protected routes (Require Bearer Token)
router
    .group(() => {
        router.get('/me', [ProfilesController, 'show'])
        router.get('/tasks', [TasksController, 'index'])
        router.get('/tasks/:id', [TasksController, 'show'])
        router.post('/tasks', [TasksController, 'store'])
        router.patch('/tasks/:id', [TasksController, 'update'])
        router.delete('/tasks/:id', [TasksController, 'destroy'])
    })
    .use(middleware.auth())

// router.get('/', () => {
//   return { hello: 'world' }
// })

// router
//   .group(() => {
//     router
//       .group(() => {
//         router.post('signup', [controllers.NewAccount, 'store'])
//         router.post('login', [controllers.AccessTokens, 'store'])
//       })
//       .prefix('auth')
//       .as('auth')

//     router
//       .group(() => {
//         router.get('profile', [controllers.Profile, 'show'])
//         router.post('logout', [controllers.AccessTokens, 'destroy'])
//       })
//       .prefix('account')
//       .as('profile')
//       .use(middleware.auth())
//   })
//   .prefix('/api/v1')
