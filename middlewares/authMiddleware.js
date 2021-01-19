import jwt from 'jsonwebtoken'
import { User } from '../app/models/index.js'
import { apiResponseService } from '../app/services/index.js'

export const verifyUser = async (ctx, next) => {
  try {
    const token = ctx.headers['x-auth-token']
    if (!token) {
      ctx.status = 401
      throw new Error('Token required')
    }

    const verifyToken = jwt.verify(token, process.env.JWT_TOKEN_SECRET)

    // Check user
    const user = await User.findById(verifyToken.user)
    if (!user) {
      ctx.status = 401
      throw new Error('User not found')
    }

    ctx.user = verifyToken.user

    await next()
  } catch (err) {
    return apiResponseService.sendError(ctx, err)
  }
}
