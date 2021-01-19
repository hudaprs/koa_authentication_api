import KoaRouter from 'koa-router'

import {
  register,
  login,
  refreshToken,
  getAllUsers,
  logout
} from '../app/controllers/index.js'

import { authMiddleware } from '../middlewares/index.js'

const router = new KoaRouter()
const { verifyUser } = authMiddleware

export default app => {
  // Init router middleware
  app.use(router.routes()).use(router.allowedMethods())

  // Auth
  router.post('/api/auth/register', register)
  router.post('/api/auth/login', login)
  router.post('/api/auth/logout', verifyUser, logout)
  router.get('/api/tokens/refresh', refreshToken)

  // User
  router.get('/api/users', verifyUser, getAllUsers)
}
