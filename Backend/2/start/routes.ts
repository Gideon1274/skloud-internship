/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/


import router from '@adonisjs/core/services/router'



const TasksController = () => import('#controllers/tasks_controller')

router.get('/tasks', [TasksController, 'index'])
router.get('/tasks/:id', [TasksController, 'show'])
router.post('/tasks', [TasksController, 'store'])
router.patch('/tasks/:id', [TasksController, 'update'])
router.delete('/tasks/:id', [TasksController, 'destroy'])

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
