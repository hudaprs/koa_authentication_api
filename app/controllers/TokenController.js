import { Token, User } from '../models/index.js'
import { apiResponseService, tokenService } from '../services/index.js'
import jwt from 'jsonwebtoken'

export const refreshToken = async ctx => {
  try {
    const { refreshToken } = ctx.query

    if (!refreshToken || refreshToken === '') {
      ctx.status = 400
      throw new Error('Invalid request')
    }

    const checkRefreshToken = await Token.findOne({ refreshToken })
    if (!checkRefreshToken) {
      ctx.status = 404
      throw new Error('Refresh token not found')
    }

    // Verify refresh token
    let verifyRefreshToken = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET
    )

    const user = await User.findById(verifyRefreshToken.user).select(
      '-password'
    )
    if (!user) {
      ctx.status = 401
      throw new Error('The refresh token not recognized by any user')
    }

    const {
      token: newToken,
      refreshToken: newRefreshToken
    } = await tokenService.generateToken(ctx, { user: user._id })

    return apiResponseService.sendSuccess(ctx, 'Token refreshed successfully', {
      token: newToken,
      refreshToken: newRefreshToken,
      user
    })
  } catch (err) {
    return apiResponseService.sendError(ctx, err)
  }
}
